DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
  id uuid DEFAULT uuid_generate_v4 (),
  title TEXT NOT NULL,
  PRIMARY KEY (id),
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE NOT NULL
)