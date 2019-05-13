use chrono::prelude::NaiveDate;

use super::schema::orders;
use serde::Deserialize;

#[derive(Deserialize, Serialize, Debug)]
pub enum Coffee {
    #[serde(rename = "BELLA_DONOVAN")]
    BellaDonovan,
    #[serde(rename = "GIANT_STEPS")]
    GiantSteps,
}

impl From<Coffee> for String {
    fn from(coffee: Coffee) -> String {
        match coffee {
            Coffee::BellaDonovan => String::from("BELLA_DONOVAN"),
            Coffee::GiantSteps => String::from("GIANT_STEPS"),
        }
    }
}

#[derive(Deserialize, Serialize, Debug, AsExpression)]
pub enum Method {
    #[serde(rename = "AEROPRESS")]
    Aeropress,
    #[serde(rename = "COFFEE_MAKER")]
    CoffeeMaker,
    #[serde(rename = "COLD_BREW")]
    ColdBrew,
    #[serde(rename = "FRENCH_PRESS")]
    FrenchPress,
    #[serde(rename = "POUR_OVER")]
    PourOver,
}

impl From<Method> for String {
    fn from(method: Method) -> String {
        match method {
            Method::Aeropress => String::from("AEROPRESS"),
            Method::CoffeeMaker => String::from("COFFEE_MAKER"),
            Method::ColdBrew => String::from("COLD_BREW"),
            Method::FrenchPress => String::from("FRENCH_PRESS"),
            Method::PourOver => String::from("POUR_OVER"),
        }
    }
}

#[derive(Deserialize, Serialize, Debug, Queryable)]
pub struct Order {
    #[serde(rename = "order")]
    pub order_: i32,
    pub coffee: String,
    #[serde(rename = "method")]
    pub method_: String,
    #[serde(rename = "numberOfCases")]
    pub number_of_cases: i32,
    #[serde(rename = "packetsPerCase")]
    pub packets_per_case: i32,
    #[serde(rename = "shipDate")]
    pub ship_date: NaiveDate,
    pub priority: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NewOrder {
    pub coffee: Coffee,
    #[serde(rename = "method")]
    pub method_: Method,
    #[serde(rename = "numberOfCases")]
    pub number_of_cases: i32,
    #[serde(rename = "packetsPerCase")]
    pub packets_per_case: i32,
    #[serde(rename = "shipDate")]
    pub ship_date: NaiveDate,
    pub priority: bool,
}

#[derive(Serialize, Deserialize, Debug, Insertable)]
#[table_name = "orders"]
pub struct NewOrderInsert {
    pub coffee: String,
    pub method_: String,
    pub number_of_cases: i32,
    pub packets_per_case: i32,
    pub ship_date: NaiveDate,
    pub priority: bool,
}

impl From<NewOrder> for NewOrderInsert {
    fn from(order: NewOrder) -> Self {
        NewOrderInsert {
            coffee: order.coffee.into(),
            method_: order.method_.into(),
            number_of_cases: order.number_of_cases,
            packets_per_case: order.packets_per_case,
            ship_date: order.ship_date,
            priority: order.priority,
        }
    }
}
