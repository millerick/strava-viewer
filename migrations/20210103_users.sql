DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id uuid DEFAULT uuid_generate_v4 (),
  session_id varchar NOT NULL COLLATE "default",
  strava_user_id VARCHAR(255),
  refresh_token VARCHAR(255),
  bearer_token VARCHAR(255),
  strava_user_name VARCHAR(255),
  PRIMARY KEY (id),
  UNIQUE (strava_user_id)
);
