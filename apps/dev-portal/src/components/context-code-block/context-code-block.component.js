import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import React from 'react';
import styles from './context-code-block-styles.module.css';

// Fixed sample values: the docs never fill examples with account data
const VALUES = {
  '#USER_API_KEY': '$TAPE_TOKEN',
  '#BASE_URL': 'https://api.tapeapp.com',
  '#RECORD_ID': '123456',
  '#RECORD_TITLE': 'Acme Inc.',
};
const PATTERN = new RegExp(Object.keys(VALUES).join('|'), 'g');

const replacePlaceholders = (str) => (str || '').replace(PATTERN, (m) => VALUES[m]);

/**
 * CodeBlock wrapper that replaces the placeholders above in the title and in
 * the code with the fixed sample values.
 */
export default function ContextCodeBlock({ children, language, title }) {
  const childrenArr =
    typeof children === 'string' ? [children] : Array.isArray(children) ? children : [];
  const result = childrenArr.map((child) =>
    typeof child === 'string' ? replacePlaceholders(child) : child
  );

  return (
    <div className={clsx(styles.codeBlock)}>
      <CodeBlock title={replacePlaceholders(title)} language={language}>
        {result}
      </CodeBlock>
    </div>
  );
}
