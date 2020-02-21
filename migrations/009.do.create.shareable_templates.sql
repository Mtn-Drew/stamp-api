DROP TABLE IF EXISTS shareable_templates;

CREATE TABLE shareable_templates (
  id uuid DEFAULT uuid_generate_v4 (),
  template_title TEXT,
  template_desc TEXT,
  PRIMARY KEY (id),
  template_id uuid 
)