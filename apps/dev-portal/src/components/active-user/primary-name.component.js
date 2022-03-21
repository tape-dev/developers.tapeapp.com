import React from 'react';
import { DEFAULT_USERNAME } from './constants';

export const ActiveUserPrimaryName = () => {
  const isLoading = false;
  if (isLoading) {
    return '';
  }

  return <mark>{primaryName || DEFAULT_USERNAME}</mark>;
};
