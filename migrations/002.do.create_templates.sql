DROP TABLE IF EXISTS templates;

CREATE TABLE templates (
  id uuid DEFAULT uuid_generate_v4 (),
  title TEXT NOT NULL,
  PRIMARY KEY (id),
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL
)