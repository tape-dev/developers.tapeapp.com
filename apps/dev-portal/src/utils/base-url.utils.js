// Base URL
const BASE_URL_DEV = 'http://localhost:3000';
const BASE_URL_PRD = 'https://tapeapp.com';

const DEV_API_BASE_URL_DEV = 'http://localhost:3000';
const DEV_API_BASE_URL_PRD = 'https://api.tapeapp.com';

export function getBaseUrlForRuntime(runtime) {
  return runtime === 'DEV' ? BASE_URL_DEV : BASE_URL_PRD;
}

export function getDevApiBaseUrlForRuntime(runtime) {
  return runtime === 'DEV' ? DEV_API_BASE_URL_DEV : DEV_API_BASE_URL_PRD;
}
