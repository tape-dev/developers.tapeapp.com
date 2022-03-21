import { getBaseUrlForRuntime } from '../utils';
import { loadActiveUserSessionsAndContext } from './active-user-context-request';
import { getAppState, setAppState } from './app-state.store';
import { loadActiveUserDemoRecord } from './demo-record-request';

export async function loadAppStateFromServer(runtime) {
  if (getAppState().initializing) {
    return;
  }
  setAppState({ ...getAppState(), initializing: true });

  // Load active user context
  const baseUrl = getBaseUrlForRuntime(runtime);
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
}
