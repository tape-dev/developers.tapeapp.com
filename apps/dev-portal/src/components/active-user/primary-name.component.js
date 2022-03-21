import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { useEffect, useState } from 'react';
import {
  DEFAULT_USERNAME,
  getActiveUserContextIsLoading,
  getActiveUserPrimaryName,
} from './constants';
import { activeUserContextEffect } from './context.effect';

export const ActiveUserPrimaryName = () => {
  const [_, setState] = useState(0);
  const { siteConfig: config } = useDocusaurusContext();

  const primaryName = getActiveUserPrimaryName(config) ?? '';
  const isLoading = getActiveUserContextIsLoading(config);

  useEffect(() => {
    activeUserContextEffect(config, setState);
  }, []);

  if (isLoading) {
    return '';
  }

  return <mark>{primaryName || DEFAULT_USERNAME}</mark>;
};
