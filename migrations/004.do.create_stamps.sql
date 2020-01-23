DROP TABLE IF EXISTS stamps;

CREATE TABLE stamps (
  id uuid DEFAULT uuid_generate_v4 (),
  title TEXT NOT NULL,
  PRIMARY KEY (id),
  content TEXT,
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE NOT NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  archived TEXT,
  write TEXT
)