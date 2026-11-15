import React from 'react';

// Long API ids like collected_records_collect_referenced_records: allow line breaks after "_" only
export default function breakable(text) {
  if (typeof text !== 'string' || !text.includes('_')) return text;
  const parts = text.split('_');
  return parts.map((p, i) => (i < parts.length - 1 ? <React.Fragment key={i}>{p}_<wbr /></React.Fragment> : <React.Fragment key={i}>{p}</React.Fragment>));
}
