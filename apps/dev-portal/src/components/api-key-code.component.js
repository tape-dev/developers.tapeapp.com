import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getDevApiBaseUrl } from '@site/src/util/base-url.utils';
import React, { useEffect, useState } from 'react';
import { DEFAULT_API_KEY, getActiveUserApiKey } from './active-user/constants';
import { activeUserContextEffect } from './active-user/context.effect';
import { DEFAULT_RECORD_ID, getDemoRecordId } from './demo-record/constants';

const USER_API_KEY_PLACEHOLDER = '#USER_API_KEY';
const BASE_URL_PLACEHOLDER = '#BASE_URL';
const RECORD_ID_PLACEHOLDER = '#RECORD_ID';

export default function ApiKeyCode({ children, language }) {
  const [_, setState] = useState(Date.now());
  const { siteConfig: config } = useDocusaurusContext();

  useEffect(() => {
    activeUserContextEffect(config, setState);
  }, []);

  const apiKey = getActiveUserApiKey(config) ?? DEFAULT_API_KEY;
  const recordId = getDemoRecordId(config) ?? DEFAULT_RECORD_ID;
  const baseUrl = getDevApiBaseUrl(config);

  const childrenArr =
    typeof children === 'string'
      ? [children]
      : Array.isArray(children)
      ? children
      : [];

  const result = childrenArr.map((child) => {
    if (typeof child === 'string') {
      return child
        .replace(new RegExp(USER_API_KEY_PLACEHOLDER, 'g'), apiKey)
        .replace(new RegExp(BASE_URL_PLACEHOLDER, 'g'), baseUrl)
        .replace(new RegExp(RECORD_ID_PLACEHOLDER, 'g'), recordId);
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
