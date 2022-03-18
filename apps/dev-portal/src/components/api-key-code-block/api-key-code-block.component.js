import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import React, { useEffect, useState } from 'react';
import { DEFAULT_API_KEY, getActiveUserApiKey } from '../active-user/constants';
import { activeUserContextEffect } from '../active-user/context.effect';
import { getDevApiBaseUrl } from '@site/src/util/base-url.utils';
import clsx from 'clsx';
import styles from './api-key-code-block-styles.module.css';
import {
  DEFAULT_RECORD_ID,
  DEFAULT_RECORD_TITLE,
  getDemoRecordId,
  getDemoRecordTitle,
} from '../demo-record/constants';

const USER_API_KEY_PLACEHOLDER = '#USER_API_KEY';
const BASE_URL_PLACEHOLDER = '#BASE_URL';
const RECORD_ID_PLACEHOLDER = '#RECORD_ID';
const RECORD_TITLE_PLACEHOLDER = '#RECORD_TITLE';

export default function ApiKeyCodeblock({ children, language, title }) {
  const [_, setState] = useState(Date.now());
  const { siteConfig: config } = useDocusaurusContext();

  useEffect(() => {
    activeUserContextEffect(config, setState);
  }, []);

  const apiKey = getActiveUserApiKey(config) ?? DEFAULT_API_KEY;
  const recordId = getDemoRecordId(config) ?? DEFAULT_RECORD_ID;
  const recordTitle = getDemoRecordTitle(config) ?? DEFAULT_RECORD_TITLE;
  const baseUrl = getDevApiBaseUrl(config);

  function replacePlaceholders(str) {
    return str
      .replace(new RegExp(USER_API_KEY_PLACEHOLDER, 'g'), apiKey)
      .replace(new RegExp(BASE_URL_PLACEHOLDER, 'g'), baseUrl)
      .replace(new RegExp(RECORD_ID_PLACEHOLDER, 'g'), recordId)
      .replace(new RegExp(RECORD_TITLE_PLACEHOLDER, 'g'), recordTitle);
  }

  const childrenArr =
    typeof children === 'string'
      ? [children]
      : Array.isArray(children)
      ? children
      : [];

  const result = childrenArr.map((child) => {
    if (typeof child === 'string') {
      return replacePlaceholders(child);
    }
    return child;
  });

  const replacedTitle = replacePlaceholders(title);

  return (
    <div className={clsx(styles.codeBlock)}>
      <CodeBlock title={replacedTitle} language={language}>
        {result}
      </CodeBlock>
    </div>
  );
}
