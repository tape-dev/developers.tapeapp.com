import {
  getActiveUserContext,
  getActiveUserState,
  setActiveUserContext,
  setActiveUserContextIsLoading,
} from './constants';
import { loadActiveUserSessionsAndContext } from './context-request';

let isLoading = false;
let visibilityChangeRegistered = true; // Deactivate for now

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

  if (!visibilityChangeRegistered) {
    visibilityChangeRegistered = true;
    addEventListener('visibilitychange', (event) => {
      const ctx = getActiveUserContext(config);
      const hasUserId = !!ctx?.userId;
      const isVisible = event?.target?.visibilityState === 'visible';
      // console.log({ hasUserId, isVisible })

      // Do not re-fetch if user is logged in
      if (hasUserId) {
        return;
      }

      // Do not re-fetch on document hiding
      if (!isVisible) {
        return;
      }

      performLoadActiveUserSessionsAndContext(runtime, config, setState);
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
