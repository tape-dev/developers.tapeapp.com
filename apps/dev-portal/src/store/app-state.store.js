import { makeObservable } from '@site/src/utils';

const INITIAL_APP_STATE = {
  initializing: false,

  // Runtime
  runtime: 'PRD',

  // Active user context
  activeUserContext: undefined,
  activeUserContextIsLoading: true,

  // Demo record
  demoRecord: undefined,
  demoRecordIsLoading: true,
};

const store = makeObservable(INITIAL_APP_STATE);

export function getInitialAppState() {
  return INITIAL_APP_STATE;
}

export function subscribeToAppState(listenerFunc) {
  return store.subscribe(listenerFunc);
}

export function getAppState() {
  return store.get();
}

export function setAppState(state) {
  store.set(state);
}
