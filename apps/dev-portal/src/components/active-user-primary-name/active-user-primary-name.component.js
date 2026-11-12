import React from 'react';
import {
  getActiveUserIsLoading,
  getActiveUserPrimaryNameWithFallback,
  useAppState,
} from '@site/src/store';

export const ActiveUserPrimaryName = () => {
  // Initialize application state usage
  const state = useAppState();

  // Select properties from state
  const isLoading = getActiveUserIsLoading(state);
  const primaryName = getActiveUserPrimaryNameWithFallback(state);

  if (isLoading) {
    return '';
  }

  return <mark>{primaryName}</mark>;
};
