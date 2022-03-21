import { getAppState, setAppState } from './app-state.store';
import { loadActiveUserSessionsAndContext } from './active-user-context-request';
import { loadActiveUserDemoRecord } from './demo-record-request';

export async function loadAppStateFromServer(runtime) {
  const state = getAppState();
  if (state.initializing) {
    return;
  }
  setAppState({ initializing: true });

  // Load active user context
  const activeUserContext = await loadActiveUserSessionsAndContext(runtime);

  setAppState({
    ...getAppState(),
    activeUserContext,
    activeUserContextIsLoading: false,
  });

  // Load demo record
  const userId = activeUserContext.user?.id;
  if (userId) {
    const demoRecord = await loadActiveUserDemoRecord(runtime, userId);

    setAppState({
      ...getAppState(),
      demoRecord,
      demoRecordIsLoading: false,
    });
  }
}
