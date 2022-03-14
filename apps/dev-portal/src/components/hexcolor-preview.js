import React from 'react';

export default function HexcolorPreview({ color }) {
  return (
    <div
      class="scale-on-hover"
      style={{
        width: '24px',
        height: '24px',
        margin: 'auto',
        backgroundColor: color,
        borderRadius: '2px',
      }}
    ></div>
  );
}
