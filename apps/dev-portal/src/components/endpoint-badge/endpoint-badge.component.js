import React from 'react';

// URL bar with method pill, path segments in mono, grey slashes
const PILL = {
  GET: ['#15803d', 'rgba(34, 197, 94, 0.18)'],
  POST: ['#1d4ed8', 'rgba(59, 130, 246, 0.18)'],
  PUT: ['#a16207', 'rgba(234, 179, 8, 0.2)'],
  PATCH: ['#a16207', 'rgba(234, 179, 8, 0.2)'],
  DELETE: ['#b91c1c', 'rgba(239, 68, 68, 0.16)'],
};

export default function EndpointBadge({ method, url, isNew }) {
  const [fg, bg] = PILL[method] || ['#3e3e3e', 'rgba(0,0,0,0.06)'];
  const path = (url || '').replace(/^https?:\/\/[^/]+/, '');
  const host = (url || '').match(/^https?:\/\/[^/]+/)?.[0];
  const parts = path.split('/').filter(Boolean);
  return (
    <div className="tp-url" title={url}>
      <span className="tp-url__method" data-m={method} style={{ color: fg, background: bg }}>{method}</span>
      <code className="tp-url__path">
        {parts.map((p, i) => (
          <React.Fragment key={i}>
            <span className="tp-url__slash">/</span>
            <span className={p.startsWith('{') ? 'tp-url__param' : 'tp-url__seg'}>{p}</span>
          </React.Fragment>
        ))}
      </code>
      {isNew && <span className="tp-url__new">New</span>}
      {host && <span className="tp-url__host">{host.replace(/^https?:\/\//, '')}</span>}
    </div>
  );
}
