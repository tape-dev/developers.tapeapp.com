import { makeObservable } from '@site/src/utils';

const store = makeObservable({
  initializing: false,

  // Active user context
  activeUserContext: undefined,
  activeUserContextIsLoading: true,

  // Demo record
  demoRecord: undefined,
  demoRecordIsLoading: true,
});

export function subscribeToAppState(listenerFunc) {
  return store.subscribe(listenerFunc);
}

export function getAppState() {
  return store.get();
}

export function setAppState(state) {
  store.set(state);
}
