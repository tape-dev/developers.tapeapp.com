import clsx from 'clsx';
import React from 'react';
import styles from './media-frame-styles.module.css';

export default function MediaFrame({ children }) {
  return <div className={clsx(styles.shadow)}>{children}</div>;
}
