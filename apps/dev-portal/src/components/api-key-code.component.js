import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { useEffect, useState } from 'react';
import { DEFAULT_API_KEY, getActiveUserApiKey } from './active-user/constants';
import { activeUserContextEffect } from './active-user/context.effect';
import { getBaseUrl } from '@site/src/util/base-url.utils';

const USER_API_KEY_PLACEHOLDER = '#USER_API_KEY';
const BASE_URL_PLACEHOLDER = '#BASE_URL';

export default function ApiKeyCode({ children, language }) {
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

  const baseUrl = getBaseUrl(config);
  const result = childrenArr.map((child) => {
    if (typeof child === 'string') {
      return child
        .replace(new RegExp(USER_API_KEY_PLACEHOLDER, 'g'), apiKey)
        .replace(new RegExp(BASE_URL_PLACEHOLDER, 'g'), baseUrl);
    }
    return child;
  });

  return (
    <div style={{ overflowY: 'auto' }}>
      <code
        style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all' }}
        language={language}
      >
        {result}
      </code>
    </div>
  );
}
