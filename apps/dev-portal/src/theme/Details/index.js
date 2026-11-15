import React, { useEffect, useRef } from 'react';

const textOf = (node) => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  return React.isValidElement(node) ? textOf(node.props.children) : '';
};
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Accordion: rounded border, triangle on the left, title medium.
// Opening it puts its anchor in the address (replaceState, like the reference); loading with that anchor opens it.
export default function Details({ summary, children, className, id, ...props }) {
  const items = React.Children.toArray(children);
  let sum = summary;
  if (!sum) {
    const i = items.findIndex((c) => React.isValidElement(c) && (c.type === 'summary' || c.props?.mdxType === 'summary'));
    if (i >= 0) sum = items.splice(i, 1)[0];
  }
  const label = React.isValidElement(sum) ? sum.props.children : sum;
  const anchor = id || slug(textOf(label)) || undefined;
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !anchor) return undefined;
    if (decodeURIComponent(window.location.hash.slice(1)) === anchor) { el.open = true; el.scrollIntoView(); }
    const onToggle = () => {
      const here = decodeURIComponent(window.location.hash.slice(1)) === anchor;
      if (el.open && !here) window.history.replaceState(window.history.state, '', '#' + anchor);
      else if (!el.open && here) window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    };
    el.addEventListener('toggle', onToggle);
    return () => el.removeEventListener('toggle', onToggle);
  }, [anchor]);
  return (
    <details ref={ref} id={anchor} className={['tp-acc', className].filter(Boolean).join(' ')} {...props}>
      <summary className="tp-acc__summary">
        <svg className="tp-acc__chev" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M4 2.5 8.5 6 4 9.5z" fill="currentColor" /></svg>
        <span className="tp-acc__title">{label}</span>
      </summary>
      <div className="tp-acc__body">{items}</div>
    </details>
  );
}
