import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import React from 'react';
import { getActiveUserApiKey } from './active-user/constants';

const USER_API_KEY_PLACEHOLDER = '$USER_API_KEY';

export default function ApiKeyCodeblock({ children }) {
  const { siteConfig: config } = useDocusaurusContext();

  const apiKey = getActiveUserApiKey(config);

  const result = (children ?? []).map((child) => {
    if (typeof child === 'string' && child.includes(USER_API_KEY_PLACEHOLDER)) {
      return child.replace(USER_API_KEY_PLACEHOLDER, apiKey);
    }
    return child;
  });
  return <CodeBlock>{result}</CodeBlock>;
}
