#!/bin/bash

# This script should be run as the postgres user

# Change these variables if you move this script elsewhere to run migrations elsewhere
PG_DATABASE=strava_viewer

run_query () {
	psql -d $PG_DATABASE -c "$1";
}

run_query_file () {
	psql -d $PG_DATABASE -f $1;
}

# Set up a table to keep track of the migrations that have been run
run_query 'CREATE TABLE IF NOT EXISTS migrations (migration_name VARCHAR(255) CONSTRAINT primary_key PRIMARY KEY, run_at TIMESTAMP NOT NULL DEFAULT NOW());';

# Get the migrations that need to run and sort them
# migrations are intended to be named as YYYYMMDD_name.sql

MIGRATIONS=`ls *.sql | sort`;

for f in `ls *.sql | sort`; do
	echo "Attempting to run migration file $f";
	TEST_RESULT=`run_query "SELECT * FROM migrations WHERE migration_name='$f'"`;
	if [[ $TEST_RESULT =~ "(0 rows)" ]]; then
		echo "Running the migration $f";
		run_query_file $f;
		run_query "INSERT INTO migrations(migration_name) VALUES ('$f')";
	else
		echo "Skipping the migration $f since it was run previously";
	fi
	echo
done
