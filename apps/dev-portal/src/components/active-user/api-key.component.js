import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  getActiveUserApiKey,
  getActiveUserContextIsLoading,
} from './constants';
import { ActiveUserContext } from './context.component';

export const ActiveUserApiKey = () => {
  const { siteConfig: config } = useDocusaurusContext();
  const apiKey = getActiveUserApiKey(config);
  const isLoading = getActiveUserContextIsLoading(config);

  if (!isLoading) {
    return (
      <ActiveUserContext> ****************************** </ActiveUserContext>
    );
  }

  return apiKey;
};
