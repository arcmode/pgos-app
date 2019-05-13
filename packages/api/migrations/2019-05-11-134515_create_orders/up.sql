create table orders(
  order_ integer primary key autoincrement not null,
  coffee varchar not null,
  method_ varchar not null,
  number_of_cases int not null,
  packets_per_case int not null,
  ship_date date not null,
  priority boolean not null
)
