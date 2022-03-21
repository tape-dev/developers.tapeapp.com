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

const headers = {
  'content-type': 'application/json',
};

export function loadActiveUserDemoRecord(baseUrl, userId) {
  return fetch(`${baseUrl}/graphql/getActiveUserDevPortalDemoRecord`, {
    method: 'POST',
    headers: {
      ...headers,
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
