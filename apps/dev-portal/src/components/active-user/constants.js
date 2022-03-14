export const ACTIVE_USER_STATE_KEY = 'activeUserState';

// Defaults
export const DEFAULT_USERNAME = 'Tape Developer';
export const DEFAULT_API_KEY =
  'user_key_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiLvv71cdTAwMDZcdTAwMTLvv73vv71cdTAwMWXvv73vv71U77-9Iiwic2NvcGUiOiJ1a192MSJ9.JTmsHguUWkP0b2dvwIZc2q8dsbjkDXg2FbZyC4_Sh20';

export function getActiveUserState(config) {
  return config[ACTIVE_USER_STATE_KEY] || {};
}

// Context
export function getActiveUserContext(config) {
  return getActiveUserState(config).context;
}

export function setActiveUserContext(config, activeUserContext) {
  config[ACTIVE_USER_STATE_KEY] = config[ACTIVE_USER_STATE_KEY] || {};
  config[ACTIVE_USER_STATE_KEY].context = activeUserContext;
}

// Loading state
export function getActiveUserContextIsLoading(config) {
  const state = getActiveUserState(config);

  if (!state) {
    return undefined;
  }

  return state.isLoading;
}

/**
 *
 * @param config global config object
 * @param  isLoading can be "false" | "loading" | "loaded" | "failed"
 */
export function setActiveUserContextIsLoading(config, isLoading) {
  config[ACTIVE_USER_STATE_KEY] = config[ACTIVE_USER_STATE_KEY] || {};
  config[ACTIVE_USER_STATE_KEY].isLoading = isLoading;
}

// API key
export function getActiveUserApiKey(config) {
  const context = getActiveUserContext(config);

  if (!context) {
    return undefined;
  }

  return context.apiKey;
}

// Primary name
export function getActiveUserPrimaryName(config) {
  const context = getActiveUserContext(config);

  if (!context || !context.user) {
    return undefined;
  }

  return context.user.primaryName;
}
