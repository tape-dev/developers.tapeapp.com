import React from 'react';

export default function EndpointBadge({ method, url, isNew }) {
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

  if (isNew) {
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
        {/* NEW */}
        <span
          style={{
            backgroundColor: 'rgba(17, 100, 163, 0.1)',
            color: 'rgb(17, 100, 163)',
            borderRadius: '999px',
            padding: '4px 9px 3px 9px',
            fontWeight: 700,
            fontSize: '11px',
            lineHeight: '11px',
            marginRight: '6px',
          }}
        >
          NEW
        </span>

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
