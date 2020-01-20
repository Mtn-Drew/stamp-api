CREATE TYPE active_status AS ENUM (
  'Active',
  'Archive'
);

ALTER TABLE users
  ADD COLUMN
    standing active_status;