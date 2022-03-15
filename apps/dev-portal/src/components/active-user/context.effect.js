import {
  getActiveUserState,
  setActiveUserContext,
  setActiveUserContextIsLoading,
} from './constants';
import { loadActiveUserSessionsAndContext } from './context-request';

let isLoading = false;

export const activeUserContextEffect = (config, setState) => {
  const runtime = config.customFields.runtime;
  const state = getActiveUserState(config);

  // skip request if already loading
  if (isLoading || state.isLoading) {
    return;
  }

  // skip request if user context already loaded
  if (state.context) {
    return;
  }

  isLoading = true;
  // ... perform request otherwise
  loadActiveUserSessionsAndContext(runtime)
    .then((activeUserContext) => {
      setActiveUserContextIsLoading(config, false);
      setActiveUserContext(config, activeUserContext);
      setState(Date.now()); // force component rerender
    })
    .catch((error) => {
      console.error(error);
      isLoading = false;
    });
};
