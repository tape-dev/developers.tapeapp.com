import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  getActiveUserPrimaryName,
  getActiveUserContextIsLoading,
} from './constants';
import { ActiveUserContext } from './context.component';

export const ActiveUserPrimaryName = () => {
  const { siteConfig: config } = useDocusaurusContext();
  const primaryName = getActiveUserPrimaryName(config);
  const isLoading = getActiveUserContextIsLoading(config);

  if (!isLoading) {
    return <ActiveUserContext> Developer </ActiveUserContext>;
  }

  return primaryName;
};
