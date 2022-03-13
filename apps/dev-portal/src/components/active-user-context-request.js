import { DUMMY_ACTIVE_USER_CONTEXT } from './constants';

export function loadActiveUserContextMock() {
  return fetch('https://jsonplaceholder.typicode.com/posts/1', {}).then(() => {
    return DUMMY_ACTIVE_USER_CONTEXT;
  });
}

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

export function loadActiveUserContext() {
  return fetch(
    'https://mobile.tapeapp.com/graphql/getUserSessions',
    requestOptions
  ).then(() => {
    // TODO: properly extract active user context from gql response once it works
    return DUMMY_ACTIVE_USER_CONTEXT;
  });
}
