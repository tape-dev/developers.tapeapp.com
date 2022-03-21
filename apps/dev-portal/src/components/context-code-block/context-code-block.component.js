import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getAppState, subscribeToAppState } from '@site/src/store';
import { getDevApiBaseUrl } from '@site/src/utils/base-url.utils';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { DEFAULT_API_KEY, getActiveUserApiKey } from '../active-user/constants';
import {
  DEFAULT_RECORD_ID,
  DEFAULT_RECORD_TITLE,
  getDemoRecordId,
  getDemoRecordTitle,
} from '../demo-record/constants';
import styles from './context-code-block-styles.module.css';

const USER_API_KEY_PLACEHOLDER = '#USER_API_KEY';
const BASE_URL_PLACEHOLDER = '#BASE_URL';
const RECORD_ID_PLACEHOLDER = '#RECORD_ID';
const RECORD_TITLE_PLACEHOLDER = '#RECORD_TITLE';

/**
 * Context-aware CodeBlock component wrapper, replacing placeholders with the respective values from the context.
 * Replaces placeholders inside the title and children components.
 */
export default function ContextCodeBlock({ children, language, title }) {
  const { siteConfig: config } = useDocusaurusContext();
  const apiKey = getActiveUserApiKey(config) ?? DEFAULT_API_KEY;

  // Initialize application state usage
  const [state, setAppState] = useState(getAppState());
  useEffect(() => {
    return subscribeToAppState(setAppState);
  }, []);

  const recordId = getDemoRecordId(config) ?? DEFAULT_RECORD_ID;
  const recordTitle = getDemoRecordTitle(config) ?? DEFAULT_RECORD_TITLE;
  const baseUrl = getDevApiBaseUrl(config);

  function replacePlaceholders(str) {
    return (str || '')
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
