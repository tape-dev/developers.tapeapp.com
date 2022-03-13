import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useEffect } from 'react';
import { loadActiveUserContextMock } from './active-user-context-request';
import { getActiveUserContext, setActiveUserContext } from './constants';

let requestInflight = false;

export const ActiveUserContext = ({ children }) => {
  const { siteConfig } = useDocusaurusContext();

  useEffect(() => {
    const activeUserContext = getActiveUserContext(siteConfig);

    // skip request if already loading
    if (requestInflight) {
      return;
    }

    // skip request if user context already loaded
    if (activeUserContext) {
      return;
    }

    requestInflight = true;

    // ... perform request otherwise
    loadActiveUserContextMock()
      .then((activeUserContext) => {
        console.log({ activeUserContext });
        requestInflight = false;
        setActiveUserContext(siteConfig, activeUserContext);
      })
      .catch((error) => {
        console.error(error);
        requestInflight = false;
      });
  }, []);

  // renders nothing
  return `${children}`;
};
