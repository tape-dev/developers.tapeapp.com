import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useEffect } from 'react';

const getUserSessionsQuery = `{
  "operationName": "getUserSessions",
  "variables": {},
  "query": "query getUserSessions {  defaultAlias: getUserSessions {    ...UserSessionDtoNoNesting    __typename  }}fragment UserSessionDtoNoNesting on UserSessionDto {  active  userId  createdAt  __typename}"
}`;

const requestOptions = {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: getUserSessionsQuery,
};


let requestInflight = false;

export const ActiveUserAPIKey = () => {
    const API_KEY_DUMMY = 'YOUR_API_KEY';
    const API_KEY_PROPERTY_NAME = 'personalApiKey';
     
    const siteConfigHasProperApiKey = (siteConfig) =>
      siteConfig[API_KEY_PROPERTY_NAME] !== undefined;
    const { siteConfig } = useDocusaurusContext();

    useEffect(() => {
      // request options
      // skip request if API key is loaded already
      if (siteConfigHasProperApiKey(siteConfig)) {
        console.log('key already loaded');
        return;
      }

      if(requestInflight) {
        return;
      }

      requestInflight = true;

      // ... perform request otherwise
      fetch('https://mobile.tapeapp.com/graphql/getUserSessions', requestOptions)
      .catch(() => {
        console.log('Error loading API key.');
        siteConfig[API_KEY_PROPERTY_NAME] = 'FAILED_LOADING_API_KEY_DUMMY';
        requestInflight = false;
      })
      .then((result) => {
        if (!result) {
          siteConfig[API_KEY_PROPERTY_NAME] = 'LOADED_API_KEY_DUMMY';
          requestInflight = false;
          return;
        }
        // extract key
        const { personalApiKey } = result;
        // TODO: properly extract
      });
    }, []);
    return `${siteConfig[API_KEY_PROPERTY_NAME]}`;
  };