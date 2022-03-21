import {
  BASE_URL_DEV,
  BASE_URL_PRD,
  DEFAULT_API_KEY,
  DEFAULT_PRIMARY_NAME,
  DEFAULT_RECORD_ID,
  DEFAULT_RECORD_TITLE,
  DEV_API_BASE_URL_DEV,
  DEV_API_BASE_URL_PRD,
} from './app-state.constants';

// Runtime
export function getRuntime(state) {
  return state.runtime;
}

export function getBaseUrl(state) {
  const runtime = getRuntime(state);
  return runtime === 'DEV' ? BASE_URL_DEV : BASE_URL_PRD;
}

export function getDevApiBaseUrl(state) {
  const runtime = getRuntime(state);
  return runtime === 'DEV' ? DEV_API_BASE_URL_DEV : DEV_API_BASE_URL_PRD;
}

// Active user context
export function getActiveUserCtx(state) {
  return state.activeUserContext ?? {};
}

export function getActiveUserIsLoading(state) {
  return state.activeUserContextIsLoading;
}

export function getActiveUserApiKey(state) {
  return getActiveUserCtx(state).apiKey;
}

export function getActiveUserApiKeyWithFallback(state) {
  return getActiveUserApiKey(state) ?? DEFAULT_API_KEY;
}

export function getActiveUserPrimaryName(state) {
  return getActiveUserCtx(state).user?.primaryName;
}

export function getActiveUserPrimaryNameWithFallback(state) {
  return getActiveUserPrimaryName(state) ?? DEFAULT_PRIMARY_NAME;
}

// Demo record
export function getDemoRecord(state) {
  return state.demoRecord ?? {};
}

export function getDemoRecordIsLoading(state) {
  return state.demoRecordIsLoading;
}

export function getDemoRecordId(state) {
  return getDemoRecord(state).id;
}

export function getDemoRecordIdWithFallback(state) {
  return getDemoRecordId(state) ?? DEFAULT_RECORD_ID;
}

export function getDemoRecordTitle(state) {
  return getDemoRecord(state).title;
}

export function getDemoRecordTitleWithFallback(state) {
  return getDemoRecordTitle(state) ?? DEFAULT_RECORD_TITLE;
}
