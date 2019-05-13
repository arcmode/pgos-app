#[macro_use]
extern crate diesel;
#[macro_use]
extern crate serde_derive;

extern crate actix_web;
extern crate chrono;
extern crate dotenv;

use actix_web::{http, middleware, web, App, Error, HttpResponse, HttpServer};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use dotenv::dotenv;
use futures::Future;
use std::env;
use std::io::ErrorKind;

mod models;
mod pagination;
mod schema;

use self::pagination::*;

const PAGE_SIZE: i64 = 16;

type Pool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

fn create_query(
    order: models::NewOrder,
    pool: web::Data<Pool>,
) -> Result<(), diesel::result::Error> {
    use self::schema::orders::dsl::*;

    let conn: &SqliteConnection = &pool.get().unwrap();
    let order_insert: models::NewOrderInsert = order.into();
    diesel::insert_into(orders)
        .values(&order_insert)
        .execute(conn)?;

    Ok(())
}

fn create(
    order: web::Json<models::NewOrder>,
    pool: web::Data<Pool>,
) -> impl Future<Item = HttpResponse, Error = Error> {
    web::block(move || create_query(order.into_inner(), pool)).then(|res| match res {
        Ok(_) => Ok(HttpResponse::Created().finish()),
        Err(_) => Ok(HttpResponse::InternalServerError().into()),
    })
}

fn index_query(
    pool: web::Data<Pool>,
    pagination: Pagination,
) -> Result<Vec<models::Order>, diesel::result::Error> {
    use self::schema::orders::dsl::*;

    let conn: &SqliteConnection = &pool.get().unwrap();
    match pagination.offset {
        0 => {
            let items = orders
                .order(order_.desc())
                .limit(PAGE_SIZE)
                .load::<models::Order>(conn)?;
            Ok(items)
        }
        n => {
            let items = orders
                .order(order_.desc())
                .offset(PAGE_SIZE * n as i64)
                .limit(PAGE_SIZE)
                .load::<models::Order>(conn)?;
            Ok(items)
        }
    }
}

fn index(
    pool: web::Data<Pool>,
    pagination: Pagination,
) -> impl Future<Item = HttpResponse, Error = Error> {
    web::block(move || index_query(pool, pagination)).then(|res| match res {
        Ok(items) => Ok(HttpResponse::Ok().json(items)),
        Err(_) => Ok(HttpResponse::InternalServerError().into()),
    })
}

const DB_ENV_VAR: &str = "DATABASE_URL";

fn main() -> std::io::Result<()> {
    dotenv().map_err(|_| std::io::Error::new(ErrorKind::Other, "Environment is not available"))?;
    let path = env::var(DB_ENV_VAR)
        .map_err(|_| std::io::Error::new(ErrorKind::Other, "Cannot get DB_ENV_VAR"))?;
    let manager = ConnectionManager::<SqliteConnection>::new(path);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");
    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .wrap(middleware::Logger::default())
            .wrap(
                middleware::cors::Cors::new()
                    .allowed_origin("http://localhost:9000")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![
                        http::header::AUTHORIZATION,
                        http::header::ACCEPT,
                        http::header::HeaderName::from_static("x-pagination-offset"),
                    ])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .max_age(3600),
            )
            .service(
                web::resource("/")
                    .route(web::get().to_async(index))
                    .route(web::post().to_async(create)),
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
}
