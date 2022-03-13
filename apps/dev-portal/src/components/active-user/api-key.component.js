import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getActiveUserAPIKey } from './constants';
import { ActiveUserContext } from './context.component';

export const ActiveUserAPIKey = () => {
  const { siteConfig } = useDocusaurusContext();
  const apiKey = getActiveUserAPIKey(siteConfig) || 'placeholder-api-key';
  return <ActiveUserContext>{apiKey}</ActiveUserContext>;
};
