import { loadAppStateFromServer } from './app-state.effect';
import { subscribeToAppState as _subscribeToAppState } from './app-state.store';

export function subscribeToAppState(listenerFunc) {
  // Lazy initialize app state
  loadAppStateFromServer();

  return _subscribeToAppState(listenerFunc);
}
