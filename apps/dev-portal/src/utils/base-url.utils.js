const baseUrlDev = 'http://localhost:3000';
const baseUrlPrd = 'https://tapeapp.com';

const devApiBaseUrlDev = 'http://localhost:3000';
const devApiBaseUrlPrd = 'https://api.tapeapp.com';

/**
 * Get the baseUrl of the server based on the runtime
 * @param configOrRuntime string | config object
 * @returns baseUrl
 */
export function getBaseUrl(configOrRuntime) {
  const runtime =
    (typeof configOrRuntime === 'string'
      ? configOrRuntime
      : configOrRuntime?.customFields?.runtime) ?? 'PRD';

  // Developer explicitly specified the PRD runtime environment
  if (runtime.toUpperCase() === 'PRD') {
    return baseUrlPrd;
  }

  // Developer explicitly specified the DEV runtime environment
  if (runtime.toUpperCase() === 'DEV') {
    return baseUrlDev;
  }

  // Default is PRD
  return baseUrlPrd;
}

/**
 * Get the Dev-API baseUrl of the server based on the runtime
 * @param configOrRuntime string | config object
 * @returns baseUrl
 */
export function getDevApiBaseUrl(configOrRuntime) {
  const runtime =
    (typeof configOrRuntime === 'string'
      ? configOrRuntime
      : configOrRuntime?.customFields?.runtime) ?? 'PRD';

  // Developer explicitly specified the PRD runtime environment
  if (runtime.toUpperCase() === 'PRD') {
    return devApiBaseUrlPrd;
  }

  // Developer explicitly specified the DEV runtime environment
  if (runtime.toUpperCase() === 'DEV') {
    return devApiBaseUrlDev;
  }

  // Default is PRD
  return devApiBaseUrlPrd;
}
