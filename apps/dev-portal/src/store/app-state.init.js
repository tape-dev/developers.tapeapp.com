import { getRuntimeFromDocusaurusCtx } from '../utils';
import { loadAppStateFromServer } from './app-state.effect';
import { subscribeToAppState as _subscribeToAppState } from './app-state.store';

export function subscribeToAppState(docusaurusContext, listenerFunc) {
  const runtime = getRuntimeFromDocusaurusCtx(docusaurusContext);

  // Lazy initialize app state
  loadAppStateFromServer(runtime);

  return _subscribeToAppState(listenerFunc);
}
