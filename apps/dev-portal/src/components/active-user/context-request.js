import { getBaseUrl } from '@site/src/util/base-url.utils';

const getActiveUserDevPortalContextQuery = JSON.stringify({
  operationName: null,
  variables: {},
  query: `{
  getActiveUserDevPortalContext {
    ... on ActiveUserDevPortalContextDto {
      userId
      apiKey
      user {
        id
        primaryName
      }
    }
  }
}
`,
});

const getUserSessionsQuery = JSON.stringify({
  operationName: null,
  variables: {},
  query: `{
      getUserSessions {
        active
        userId
      }
    }
`,
});

const headers = {
  'content-type': 'application/json',
};

function loadActiveUserContext(uid, runtime) {
  return fetch(`${getBaseUrl(runtime)}/graphql/getActiveUserDevPortalContext`, {
    method: 'POST',
    headers: {
      ...headers,
      uid,
    },
    credentials: 'include',
    mode: 'cors',
    body: getActiveUserDevPortalContextQuery,
  })
    .then((res) => res.text())
    .then((text) => {
      const body = JSON.parse(text);
      return body?.data?.getActiveUserDevPortalContext || {};
    });
}

function loadActiveUserSessions(runtime) {
  return fetch(`${getBaseUrl(runtime)}/graphql/getUserSessions`, {
    method: 'POST',
    headers,
    credentials: 'include',
    mode: 'cors',
    body: getUserSessionsQuery,
  })
    .then((res) => res.text())
    .then((text) => {
      const body = JSON.parse(text);
      const sessions = body?.data?.getUserSessions || [];

      return sessions;
    });
}

export async function loadActiveUserSessionsAndContext(runtime) {
  const sessions = await loadActiveUserSessions(runtime);

  const activeUserSessions = sessions.filter((session) => session.active);

  if (!activeUserSessions.length) {
    return {};
  }

  const { userId } = activeUserSessions[0];

  const activeUserContext = await loadActiveUserContext(userId, runtime);

  return activeUserContext;
}
