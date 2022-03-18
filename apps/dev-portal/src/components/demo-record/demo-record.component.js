import clsx from 'clsx';
import React from 'react';
import styles from './hexcolor-preview-styles.module.css';

export default function DemoRecord({ color }) {
  return (
    <div
      className={clsx(styles.scaleOnHover)}
      title={color}
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
