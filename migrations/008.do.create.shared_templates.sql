CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS shared_templates;

CREATE TABLE shared_templates (
  id uuid DEFAULT uuid_generate_v4 (),
  PRIMARY KEY (id),
  template_id uuid,
  user_id uuid
)