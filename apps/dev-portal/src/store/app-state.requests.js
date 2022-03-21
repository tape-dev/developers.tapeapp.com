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

function loadActiveUserContext(baseUrl, userId) {
  return fetch(`${baseUrl}/graphql/getActiveUserDevPortalContext`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
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
    headers: {
      'content-type': 'application/json',
    },
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

const getActiveUserDevPortalDemoRecordQuery = JSON.stringify({
  operationName: null,
  variables: {},
  query: `{
  getActiveUserDevPortalDemoBlabItem {
    id
    title
  }
}`,
});

export function loadActiveUserDemoRecord(baseUrl, userId) {
  return fetch(`${baseUrl}/graphql/getActiveUserDevPortalDemoRecord`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      uid: userId,
    },
    credentials: 'include',
    mode: 'cors',
    body: getActiveUserDevPortalDemoRecordQuery,
  })
    .then((res) => res.text())
    .then((text) => {
      const body = JSON.parse(text);
      return body?.data?.getActiveUserDevPortalDemoBlabItem || {};
    });
}
