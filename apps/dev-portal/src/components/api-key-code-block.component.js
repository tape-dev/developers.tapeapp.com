import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import React, { useEffect, useState } from 'react';
import { DEFAULT_API_KEY, getActiveUserApiKey } from './active-user/constants';
import { activeUserContextEffect } from './active-user/context.effect';

const USER_API_KEY_PLACEHOLDER = '#USER_API_KEY';

export default function ApiKeyCodeblock({ children }) {
  const [_, setState] = useState(Date.now());
  const { siteConfig: config } = useDocusaurusContext();

  useEffect(() => {
    activeUserContextEffect(config, setState);
  }, []);

  const apiKey = getActiveUserApiKey(config) ?? DEFAULT_API_KEY;

  const childrenArr =
    typeof children === 'string'
      ? [children]
      : Array.isArray(children)
      ? children
      : [];

  const result = childrenArr.map((child) => {
    if (typeof child === 'string' && child.includes(USER_API_KEY_PLACEHOLDER)) {
      return child.replace(USER_API_KEY_PLACEHOLDER, apiKey);
    }
    return child;
  });

  return <CodeBlock>{result}</CodeBlock>;
}
