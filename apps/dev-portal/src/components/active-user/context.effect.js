import {
  getActiveUserState,
  setActiveUserContext,
  setActiveUserContextIsLoading,
} from './constants';
import { loadActiveUserSessionsAndContext } from './context-request';

let isLoading = false;
let registerVisibilityChange = false;

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

  if (!registerVisibilityChange) {
    registerVisibilityChange = true;
    addEventListener('visibilitychange', (event) => {
      performLoadActiveUserSessionsAndContext(runtime, config);
    });
  }

  isLoading = true;
  performLoadActiveUserSessionsAndContext(runtime, config);
};

function performLoadActiveUserSessionsAndContext(runtime, config) {
  // ... perform request otherwise
  loadActiveUserSessionsAndContext(runtime)
    .then((activeUserContext) => {
      isLoading = false;
      setActiveUserContextIsLoading(config, false);
      setActiveUserContext(config, activeUserContext);
      setState(Date.now()); // force component rerender
    })
    .catch(() => {
      isLoading = false;
      setActiveUserContextIsLoading(config, false);
      setState(Date.now()); // force component rerender
    });
}
