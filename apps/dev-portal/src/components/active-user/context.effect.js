import { useState } from 'react';
import { makeObservable } from '../../utils/observable.utils';
import { setDemoRecordState } from '../demo-record/constants';
import { loadActiveUserDemoRecord } from '../demo-record/demo-record-request';
import {
  getActiveUserState,
  setActiveUserContext,
  setActiveUserContextIsLoading,
} from './constants';
import { loadActiveUserSessionsAndContext } from './context-request';

let isLoading = false;

export const activeUserStore = makeObservable({
  isLoading: false,
  ctx: undefined,
});

export const activeUserContextEffect = (config, setStateNEW) => {
  const runtime = config.customFields.runtime;
  const state = getActiveUserState(config);

  // skip request if already loading
  if (isLoading || state.isLoading || state.context) {
  } else {
    isLoading = true;
    // ... perform request otherwise
    return loadActiveUserSessionsAndContext(runtime)
      .then((activeUserContext) => {
        isLoading = false;
        setActiveUserContextIsLoading(config, false);
        setActiveUserContext(config, activeUserContext);
        activeUserStore.set(activeUserContext); // force component rerender
        return activeUserContext;
      })
      .then(({ userId }) => {
        return loadActiveUserDemoRecord(userId, runtime);
      })
      .then((demoRecord) => {
        setDemoRecordState(config, demoRecord);
        setStateNEW(2); // force component rerender
      })
      .catch(() => {
        isLoading = false;
        setActiveUserContextIsLoading(config, false);
        setStateNEW(2); // force component rerender
      });
  }
};
