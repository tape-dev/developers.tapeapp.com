import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { useEffect, useState } from 'react';
import { DEFAULT_USERNAME } from './constants';
import {
  getActiveUserIsLoading,
  getActiveUserPrimaryName,
  getAppState,
  subscribeToAppState,
} from '../../store';

export const ActiveUserPrimaryName = () => {
  // Initialize application state usage
  const ctx = useDocusaurusContext();
  const [state, setAppState] = useState(getAppState());
  useEffect(() => {
    return subscribeToAppState(ctx, setAppState);
  }, []);

  const isLoading = getActiveUserIsLoading(state);
  const primaryName = getActiveUserPrimaryName(state);

  if (isLoading) {
    return '';
  }

  return <mark>{primaryName || DEFAULT_USERNAME}</mark>;
};
