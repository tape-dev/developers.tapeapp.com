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

export function loadActiveUserContext() {
  return fetch('http://localhost:3000/graphql/getActiveUserDevPortalContext', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      uid: 7,
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
