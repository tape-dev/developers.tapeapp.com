import { getAppState, setAppState } from './app-state.store';
import { loadActiveUserSessionsAndContext } from './active-user-context-request';

export async function loadAppStateFromServer(runtime) {
  const state = getAppState();
  if (state.initializing) {
    return;
  }
  setAppState({ initializing: true });

  loadActiveUserSessionsAndContext(runtime).then((activeUserContext) => {
    setAppState({
      ...state,
      activeUserContext,
      activeUserContextIsLoading: false,
    });
  });
  console.log('LOADING!');
}
