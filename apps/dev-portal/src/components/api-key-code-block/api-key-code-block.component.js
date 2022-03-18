import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import React, { useEffect, useState } from 'react';
import { DEFAULT_API_KEY, getActiveUserApiKey } from '../active-user/constants';
import { activeUserContextEffect } from '../active-user/context.effect';
import { getDevApiBaseUrl } from '@site/src/util/base-url.utils';
import clsx from 'clsx';
import styles from './api-key-code-block-styles.module.css';

const USER_API_KEY_PLACEHOLDER = '#USER_API_KEY';
const BASE_URL_PLACEHOLDER = '#BASE_URL';

export default function ApiKeyCodeblock({ children, language }) {
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

  const baseUrl = getDevApiBaseUrl(config);
  console.log(childrenArr);
  const result = childrenArr.map((child) => {
    if (typeof child === 'string') {
      return child
        .replace(new RegExp(USER_API_KEY_PLACEHOLDER, 'g'), apiKey)
        .replace(new RegExp(BASE_URL_PLACEHOLDER, 'g'), baseUrl);
    }
    return child;
  });

  return (
    <div className={clsx(styles.codeBlock)}>
      <CodeBlock language={language}>{result}</CodeBlock>
    </div>
  );
}
