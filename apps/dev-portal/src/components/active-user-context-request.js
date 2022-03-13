import { DUMMY_ACTIVE_USER_CONTEXT } from './constants';

export function loadActiveUserContextMock() {
  return fetch('https://jsonplaceholder.typicode.com/posts/1', {}).then(() => {
    return DUMMY_ACTIVE_USER_CONTEXT;
  });
}

export function loadActiveUserContext() {
  return fetch('https://jsonplaceholder.typicode.com/posts/1', {}).then(() => {
    return DUMMY_ACTIVE_USER_CONTEXT;
  });
}
