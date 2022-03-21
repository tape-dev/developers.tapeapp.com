// Active user context
export function getActiveUserCtx(state) {
  return state.activeUserContext ?? {};
}

export function getActiveUserApiKey(state) {
  return getActiveUserCtx(state).apiKey;
}

export function getActiveUserPrimaryName(state) {
  return getActiveUserCtx(state).user?.primaryName;
}

export function getActiveUserIsLoading(state) {
  return state.activeUserContextIsLoading;
}

// Demo record
export function getDemoRecord() {
  return state.demoRecord ?? {};
}

export function getDemoRecordId() {
  return getDemoRecord().id;
}

export function getDemoRecordTitle() {
  return getDemoRecord().title;
}

export function getDemoRecordIsLoading(state) {
  return state.demoRecordIsLoading;
}
