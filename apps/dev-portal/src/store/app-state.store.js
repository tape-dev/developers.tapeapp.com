import { makeObservable } from '@site/src/utils';

const store = makeObservable({
  initializing: false,
  ctx: undefined,
});

export function subscribeToAppState(listenerFunc) {
  store.subscribe(listenerFunc);
}

export function getAppState() {
  return store.get();
}

export function setAppState(state) {
  store.set(state);
}
