import React from 'react';

export default function EndpointBadge({ method, url }) {
  let methodColor;

  switch (method) {
    case 'GET': {
      methodColor = '#007959';
      break;
    }

    case 'POST': {
      methodColor = '#0071BB';
      break;
    }

    case 'PUT': {
      methodColor = '#DEA700';
      break;
    }

    case 'DELETE': {
      methodColor = '#DF245E';
      break;
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontSize: '15px',
        lineHeight: '15px',
        marginBottom: '13px',
      }}
    >
      {/* Method */}
      <span
        style={{
          backgroundColor: methodColor,
          color: 'var(--tape-color-lightest)',
          borderRadius: '999px',
          padding: '4px 9px 3px 9px',
          fontWeight: 700,
          fontSize: '11px',
          lineHeight: '11px',
        }}
      >
        {method.toUpperCase()}
      </span>
      {/* URL */}
      <span
        style={{
          color: 'var(--tape-color-darker)',
          marginLeft: '9px',
          marginTop: '2px',
        }}
      >
        {url}
      </span>
    </div>
  );
}
