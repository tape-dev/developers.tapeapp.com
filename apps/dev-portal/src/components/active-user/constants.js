export const ACTIVE_USER_STATE_KEY = 'activeUserState';

export function getActiveUserState(config) {
  return config[ACTIVE_USER_STATE_KEY] || {};
}

export function getActiveUserContext(config) {
  return getActiveUserState(config).context;
}

export function getActiveUserApiKey(config) {
  const context = getActiveUserContext(config);

  if (!context) {
    return undefined;
  }

  return context.apiKey;
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
