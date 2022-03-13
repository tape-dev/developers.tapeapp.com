import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getActiveUserAPIKey } from './constants';
import { ActiveUserContext } from './active-user-context.component';

export const ActiveUserAPIKey = () => {
  const { siteConfig } = useDocusaurusContext();
  const apiKey = getActiveUserAPIKey(siteConfig);
  return <ActiveUserContext>{apiKey}</ActiveUserContext>;
};
