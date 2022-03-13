import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getActiveUserApiKey } from './constants';
import { ActiveUserContext } from './context.component';

export const ActiveUserApiKey = () => {
  const { siteConfig } = useDocusaurusContext();
  const apiKey = getActiveUserApiKey(siteConfig) || 'placeholder-api-key';

  return <ActiveUserContext>{apiKey}</ActiveUserContext>;
};
