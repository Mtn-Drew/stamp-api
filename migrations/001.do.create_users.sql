CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4 (),
  user_name TEXT NOT NULL,
  PRIMARY KEY (id),
  email TEXT NOT NULL,
  password text NOT NULL
)