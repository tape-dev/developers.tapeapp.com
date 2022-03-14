import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { useEffect, useState } from 'react';
import {
  getActiveUserApiKey,
  getActiveUserContextIsLoading,
} from './constants';
import { activeUserContextEffect } from './context.effect';

export const ActiveUserApiKey = () => {
  const [_, setState] = useState(Date.now());
  const { siteConfig: config } = useDocusaurusContext();

  const apiKey = getActiveUserApiKey(config);
  const isLoading = getActiveUserContextIsLoading(config);

  useEffect(() => {
    activeUserContextEffect(config, setState);
  }, []);

  if (!isLoading) {
    return <>******************************</>;
  }

  return `${apiKey || ''}`;
};
