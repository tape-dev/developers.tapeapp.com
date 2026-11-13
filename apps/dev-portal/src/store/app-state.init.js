import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { loadAppStateFromServer } from './app-state.effect';
import { getRuntime } from './app-state.selectors';
import {
  getAppState,
  getInitialAppState,
  setAppState,
  subscribeToAppState,
} from './app-state.store';

function getRuntimeFromContext(docusaurusContext) {
  return (docusaurusContext?.siteConfig?.customFields?.runtime || 'PRD')
    .trim()
    .toUpperCase();
}

/**
 * React hook returning the global application state.
 *
 * Server rendering and hydration always see the initial state, so the first
 * client render matches the static HTML: since React 18 a hydration mismatch
 * discards the server HTML and re-renders the whole page on the client. The
 * live state (e.g. a user context that loaded meanwhile) is applied right after.
 */
export function useAppState() {
  const runtime = getRuntimeFromContext(useDocusaurusContext());
  const serverState = useMemo(
    () => ({ ...getInitialAppState(), runtime }),
    [runtime]
  );

  useEffect(() => {
    // Initialize runtime
    if (getRuntime(getAppState()) !== runtime) {
      setAppState({ ...getAppState(), runtime });
    }

    // Lazy initialize app state
    loadAppStateFromServer(runtime);
  }, [runtime]);

  return useSyncExternalStore(
    subscribeToAppState,
    getAppState,
    () => serverState
  );
}
