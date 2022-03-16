const baseUrlDev = 'http://localhost:3000';
const baseUrlPrd = 'https://tapeapp.com';

/**
 * Get the baseUrl of the server based on the runtime and the current window location href
 * @param configOrRuntime string | config object
 * @returns baseUrl
 */
export function getBaseUrl(configOrRuntime) {
  const runtime =
    typeof configOrRuntime === 'string'
      ? configOrRuntime
      : configOrRuntime?.customFields?.runtime;

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
