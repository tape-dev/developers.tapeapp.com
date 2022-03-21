import { loadAppStateFromServer } from './app-state.effect';
import { getRuntime } from './app-state.selectors';
import {
  getAppState,
  setAppState,
  subscribeToAppState as _subscribeToAppState,
} from './app-state.store';

export function subscribeToAppState(docusaurusContext, listenerFunc) {
  // Initialize runtime
  const runtime = (
    docusaurusContext?.siteConfig?.customFields?.runtime || 'PRD'
  )
    .trim()
    .toUpperCase();

  if (getRuntime(getAppState()) !== runtime) {
    setAppState({ ...getAppState(), runtime });
  }

  // Lazy initialize app state
  loadAppStateFromServer(runtime);

  return _subscribeToAppState(listenerFunc);
}
