import { makeObservable } from '../util/observable.utils';

// State
const store = makeObservable({ isLoading: true, ctx: undefined });

// Selectors
export function getActiveUserCtxIsLoading() {
  return store.get().isLoading;
}

export function getActiveUserCtx() {
  return store.get().ctx;
}

// Reducers
export function setActiveUserCtxIsLoading(isLoading) {
  store.set({ isLoading });
}

export function setActiveUserCtx(ctx) {
  store.set({ ctx });
}
