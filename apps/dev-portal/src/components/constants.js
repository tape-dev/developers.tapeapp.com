export const ACTIVE_USER_CONTEXT_KEY = 'activeUserContext';

export function getActiveUserContext(siteConfig) {
  return siteConfig[ACTIVE_USER_CONTEXT_KEY];
}

export function getActiveUserAPIKey(siteConfig) {
  const activeUserContext = getActiveUserContext(siteConfig);

  if (!activeUserContext) {
    return undefined;
  }

  return activeUserContext.apiKey;
}

export function setActiveUserContext(siteConfig, activeUserContext) {
  siteConfig[ACTIVE_USER_CONTEXT_KEY] = activeUserContext;
}

export const DUMMY_ACTIVE_USER_CONTEXT = { apiKey: 'LOADED_API_KEY_YO_ANDREW' };
