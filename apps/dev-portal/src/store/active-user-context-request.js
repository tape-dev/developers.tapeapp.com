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

function loadActiveUserContext(baseUrl, userId) {
  return fetch(`${baseUrl}/graphql/getActiveUserDevPortalContext`, {
    method: 'POST',
    headers: {
      ...headers,
      uid: userId,
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

function loadActiveUserSessions(baseUrl) {
  return fetch(`${baseUrl}/graphql/getUserSessions`, {
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

export async function loadActiveUserSessionsAndContext(baseUrl) {
  const sessions = await loadActiveUserSessions(baseUrl);
  const activeUserSessions = sessions.filter((session) => session.active);

  if (!activeUserSessions.length) {
    return {};
  }

  const { userId } = activeUserSessions[0];
  const activeUserContext = await loadActiveUserContext(baseUrl, userId);
  return activeUserContext;
}