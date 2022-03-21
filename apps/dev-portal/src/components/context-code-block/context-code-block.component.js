import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getAppState, subscribeToAppState } from '@site/src/store';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import {
  getActiveUserApiKeyWithFallback,
  getDemoRecordIdWithFallback,
  getDemoRecordTitleWithFallback,
  getDevApiBaseUrl,
} from '../../store';
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
  // Initialize application state usage
  const [state, setAppState] = useState(getAppState());
  useEffect(subscribeToAppState(useDocusaurusContext(), setAppState), []);

  // Select properties from state
  const apiKey = getActiveUserApiKeyWithFallback(state);
  const recordId = getDemoRecordIdWithFallback(state);
  const recordTitle = getDemoRecordTitleWithFallback(state);
  const baseUrl = getDevApiBaseUrl(state);

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
