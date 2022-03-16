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
      performLoadActiveUserSessionsAndContext(runtime, config, setState).then(
        () => {
          setState(Date.now()); // force component rerender
        }
      );
    });
  }

  isLoading = true;
  performLoadActiveUserSessionsAndContext(runtime, config, setState);
};

function performLoadActiveUserSessionsAndContext(runtime, config, setState) {
  // ... perform request otherwise
  const load = loadActiveUserSessionsAndContext(runtime)
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

  return load.then(() => setState);
}
