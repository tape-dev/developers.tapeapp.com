import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useEffect } from 'react';
import {
  getActiveUserState,
  setActiveUserContext,
  setActiveUserContextIsLoading,
} from './constants';
import { loadActiveUserContext } from './context-request';

/**
 *
 * We know this is probably the worst code ever but we don't know anything about React, Angular devs for years :)
 *
 */

// We need this local isLoading variable because the config update does not prevent the first N components to fire a request.
let isLoading = false;

export const ActiveUserContext = ({ children }) => {
  const { siteConfig: config } = useDocusaurusContext();

  useEffect(() => {
    const state = getActiveUserState(config);

    // skip request if already loading
    if (isLoading || state.isLoading) {
      return;
    }

    // skip request if user context already loaded
    if (state.context) {
      return;
    }

    isLoading = true;
    // ... perform request otherwise
    loadActiveUserContext()
      .then((activeUserContext) => {
        setActiveUserContextIsLoading(config, 'loaded');
        setActiveUserContext(config, activeUserContext);
      })
      .catch((error) => {
        console.error(error);
        requestInflight = false;
      });
  }, []);

  // renders nothing
  return `${children}`;
};
