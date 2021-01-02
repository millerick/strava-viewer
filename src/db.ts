import { Pool } from 'pg';

import * as config from './config';
import * as credentials from './credentials';

const CONNECTION_POOL = new Pool({
  user: credentials.POSTGRES_USER,
  password: credentials.POSTGRES_PASSWORD,
  host: config.POSTGRES_HOST,
  database: config.POSTGRES_DATABASE,
  port: config.POSTGRES_PORT,
});

/**
 * USEFUL HOOKS FOR DEBUGGING
 */
CONNECTION_POOL.on('connect', () => console.log('PG: connection created'));
CONNECTION_POOL.on('acquire', () => console.log('PG: client acquired'));
CONNECTION_POOL.on('remove', () => console.log('PG: client removed'));

/**
 * Error handler for the pool, to provide protection in the case of unexpected errors.
 * This is a safeguard, do NOT remove it.
 */
CONNECTION_POOL.on('error', (err) => {
  console.log(`PG: error emitted ${JSON.stringify(err)}`);
});

/**
 * The connection pool object exposed from the `pg` library.
 */
export const pool = CONNECTION_POOL;
