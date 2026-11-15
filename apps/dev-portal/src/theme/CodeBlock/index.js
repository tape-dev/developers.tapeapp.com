import React from 'react';
import CodeBlock from '@theme-original/CodeBlock';

// Like the reference: a header bar only when the block has a title (no language label otherwise)
export default function CodeBlockWrapper(props) {
  return <CodeBlock {...props} />;
}
