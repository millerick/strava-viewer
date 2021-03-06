DROP TABLE IF EXISTS activity_data;

CREATE TABLE activity_data(
  id uuid DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  name VARCHAR(255),
  type VARCHAR(255) NOT NULL,
  distance DOUBLE PRECISION,
  activity_datetime TIMESTAMP,
  elapsed_time DOUBLE PRECISION,
  elevation_gain DOUBLE PRECISION,
  PRIMARY KEY (id)
);

CREATE INDEX user_activity ON activity_data(user_id, activity_datetime);
CREATE INDEX user_activity_type ON activity_data(user_id, type, activity_datetime);
