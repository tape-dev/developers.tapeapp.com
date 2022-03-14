import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import React, { useEffect, useState } from 'react';
import { DEFAULT_API_KEY, getActiveUserApiKey } from './constants';
import { activeUserContextEffect } from './context.effect';

export const ActiveUserApiKey = () => {
  const [_, setState] = useState(Date.now());
  const { siteConfig: config } = useDocusaurusContext();

  useEffect(() => {
    activeUserContextEffect(config, setState);
  }, []);

  const apiKey = getActiveUserApiKey(config) ?? DEFAULT_API_KEY;
  return <CodeBlock>{`${apiKey || ''}`}</CodeBlock>;
};
