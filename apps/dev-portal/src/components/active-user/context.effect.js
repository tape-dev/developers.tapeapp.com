import { setDemoRecordState } from '../demo-record/constants';
import { loadActiveUserDemoRecord } from '../demo-record/demo-record-request';
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
  const load = loadActiveUserSessionsAndContext(runtime)
    .then((activeUserContext) => {
      isLoading = false;
      setActiveUserContextIsLoading(config, false);
      setActiveUserContext(config, activeUserContext);
      setState(Date.now()); // force component rerender
      return activeUserContext;
    })
    .then(({ userId }) => {
      return loadActiveUserDemoRecord(userId, runtime);
    })
    .then((demoRecord) => {
      setDemoRecordState(config, demoRecord);
      setState(Date.now()); // force component rerender
    })
    .catch(() => {
      isLoading = false;
      setActiveUserContextIsLoading(config, false);
      setState(Date.now()); // force component rerender
    });
};
