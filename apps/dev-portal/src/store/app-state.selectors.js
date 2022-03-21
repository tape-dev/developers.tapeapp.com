export function getActiveUserCtx(state) {
  return state.activeUserContext ?? {};
}

export function getActiveUserApiKey(state) {
  return getActiveUserCtx(state).user?.apiKey;
}

export function getActiveUserPrimaryName(state) {
  return getActiveUserCtx(state).user?.primaryName;
}

export function getActiveUserIsLoading(state) {
  return state.activeUserContextIsLoading;
}
