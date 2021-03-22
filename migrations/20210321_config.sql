DROP TABLE IF EXISTS config;

DROP CAST IF EXISTS (uuid as varchar);
CREATE CAST (uuid as varchar) WITH INOUT AS IMPLICIT;

CREATE TABLE config(
  config_key VARCHAR(255) NOT NULL,
  config_value VARCHAR(255) NOT NULL,
  PRIMARY KEY (config_key)
);

INSERT INTO config (config_key, config_value) VALUES ('session_secret', uuid_generate_v4 ());
