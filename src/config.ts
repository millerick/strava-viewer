export const NODE_ENV = process.env.NODE_ENV || 'dev';

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
 * POSTGRES CONFIGS
 */
export const POSTGRES_HOST = '192.168.86.44';
export const POSTGRES_DATABASE = 'strava_viewer'; // TODO: separate into dev and production databases
export const POSTGRES_PORT = 5432;
