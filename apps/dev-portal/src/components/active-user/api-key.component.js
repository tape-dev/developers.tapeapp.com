import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import React, { useEffect, useState } from 'react';
import {
  DEFAULT_USERNAME,
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
    return DEFAULT_USERNAME;
  }

  return <CodeBlock>{`${apiKey || ''}`}</CodeBlock>;
};
