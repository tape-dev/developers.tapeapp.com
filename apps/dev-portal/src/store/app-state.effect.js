import { getAppState, setAppState } from './app-state.store';
import { loadActiveUserSessionsAndContext } from './active-user-context-request';

export async function loadAppStateFromServer() {
  const state = getAppState();
  if (state.initializing) {
    return;
  }
  setAppState({ initializing: true });

  loadActiveUserSessionsAndContext('DEV').then((activeUserContext) => {
    setAppState({
      ...state,
      activeUserContext,
    });
  });
  console.log('LOADING!');
}
