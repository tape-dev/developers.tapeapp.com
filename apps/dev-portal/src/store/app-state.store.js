import { makeObservable } from '@site/src/utils';

const store = makeObservable({
  initializing: false,
  activeUserContext: undefined,
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
