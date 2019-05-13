use actix_web::{dev, error, http, Error, FromRequest, HttpRequest};

#[derive(Debug, Deserialize)]
pub struct Pagination {
    pub offset: i32,
}

impl FromRequest for Pagination {
    type Error = Error;
    type Future = Result<Self, Self::Error>;
    type Config = ();

    fn from_request(req: &HttpRequest, payload: &mut dev::Payload) -> Self::Future {
        let default_offset: http::header::HeaderValue = http::header::HeaderValue::from_static("0");

        let pheader = req.headers().get("x-pagination-offset");

        match pheader {
            Some(hd) => Ok(Pagination {
                offset: hd.to_str().unwrap_or("0").parse().unwrap_or(0),
            }),
            None => Ok(Pagination { offset: 0 }),
        }
    }
}
