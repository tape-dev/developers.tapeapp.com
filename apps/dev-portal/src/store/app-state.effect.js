import { getAppState, setAppState } from './app-state.store';

export async function loadAppStateFromServer() {
  const state = getAppState();
  if (state.initializing) {
    return;
  }
  setAppState({ initializing: true });

  console.log('LOADING!');
}
