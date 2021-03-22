import * as path from 'path';

export const CLIENT_DIR = path.join(__dirname, '../build/dist');

export const NODE_ENV = process.env.NODE_ENV || 'dev';
export const DEBUG_ENABLED = NODE_ENV === 'dev';

/**
 * HTTP CONFIGS
 */
export const BASE_PATH = (() => {
  switch (NODE_ENV) {
    case 'production':
      return 'TO BE DEFINED'; // TODO: define this
    case 'dev':
    default:
      return 'http://localhost:3000';
  }
})();

export const SECURE_COOKIES = (() => {
  switch (NODE_ENV) {
    case 'production':
      return true;
    case 'dev':
    default:
      return false;
  }
})();

/**
 * COOKIES
 */
export const SESSION_COOKIE = 'strava-viewer-connect-session';

/**
 * POSTGRES CONFIGS
 */
export const POSTGRES_HOST = '192.168.86.44';
export const POSTGRES_DATABASE = (() => {
  switch (NODE_ENV) {
    case 'production':
      return 'strava_viewer';
    case 'dev':
    default:
      return 'strava_viewer'; // TODO: create a different database for dev
  }
})();
export const POSTGRES_PORT = 5432;
