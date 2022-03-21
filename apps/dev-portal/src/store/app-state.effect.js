import { getBaseUrlForRuntime } from '@site/src/utils';
import {
  loadActiveUserDemoRecord,
  loadActiveUserSessionsAndContext,
} from './app-state.requests';
import { getAppState, setAppState } from './app-state.store';

export async function loadAppStateFromServer(runtime) {
  if (getAppState().initializing) {
    return;
  }
  setAppState({ ...getAppState(), initializing: true });
  const baseUrl = getBaseUrlForRuntime(runtime);

  try {
    // Load active user context
    const activeUserContext = await loadActiveUserSessionsAndContext(baseUrl);
    setAppState({
      ...getAppState(),
      activeUserContext,
      activeUserContextIsLoading: false,
    });

    // Load demo record
    const userId = activeUserContext.user?.id;
    if (userId) {
      const demoRecord = await loadActiveUserDemoRecord(baseUrl, userId);
      setAppState({
        ...getAppState(),
        demoRecord,
        demoRecordIsLoading: false,
      });
    }
  } catch (err) {
    console.error(err);
    setAppState({
      ...getAppState(),
      activeUserContextIsLoading: false,
      demoRecordIsLoading: false,
    });
  }
}
