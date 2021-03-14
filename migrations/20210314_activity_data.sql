DROP TABLE IF EXISTS activity_data;

CREATE TABLE activity_data(
  id uuid NOT NULL,
  user_id uuid NOT NULL,
  name VARCHAR(255),
  type VARCHAR(255),
  distance NUMERIC(double precision),
  activity_datetime DATETIME,
  elapsed_time NUMERIC(double precision),
  elevation_gain NUMERIC(double precision),
  PRIMARY KEY (id),
  UNIQUE (strava_user_id)
);

CREATE INDEX user_activity ON activity_data(user_id, activity_datetime);
