import { makeObservable } from '@site/src/utils';

const store = makeObservable({
  isLoading: true,
  ctx: undefined,
});

export function subscribeToAppState(listenerFunc) {
  store.subscribe(listenerFunc);
}

export function getAppState() {
  return store.get();
}
