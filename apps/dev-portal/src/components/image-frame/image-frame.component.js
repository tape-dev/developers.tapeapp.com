import clsx from 'clsx';
import React from 'react';
import styles from './image-frame-styles.module.css';

export default function ImageFrame({ children }) {
  return <div className={clsx(styles.shadow)}>{children}</div>;
}
