import { loadAppStateFromServer } from './app-state.effect';
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
  if (getAppState().runtime !== runtime) {
    setAppState({ ...getAppState(), runtime });
  }

  // Lazy initialize app state
  loadAppStateFromServer(runtime);

  return _subscribeToAppState(listenerFunc);
}
