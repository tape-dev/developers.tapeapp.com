import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { useEffect, useState } from 'react';
import {
  getActiveUserIsLoading,
  getActiveUserPrimaryNameWithFallback,
  getAppState,
  subscribeToAppState,
} from '../../store';

export const ActiveUserPrimaryName = () => {
  // Initialize application state usage
  const [state, setAppState] = useState(getAppState());
  useEffect(subscribeToAppState(useDocusaurusContext(), setAppState), []);

  // Select properties from state
  const isLoading = getActiveUserIsLoading(state);
  const primaryName = getActiveUserPrimaryNameWithFallback(state);

  if (isLoading) {
    return '';
  }

  return <mark>{primaryName}</mark>;
};
