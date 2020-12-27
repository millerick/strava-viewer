export const NODE_ENV = process.env.NODE_ENV || 'dev';

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
