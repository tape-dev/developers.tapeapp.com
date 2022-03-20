---
id: authentication
title: Authentication
sidebar_label: Authentication
---

import ApiKeyCodeblock from '@site/src/components/api-key-code-block/api-key-code-block.component';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Requests use the HTTP `Authorization` header to both authenticate and authorize operations. The Tape API accepts bearer tokens in this header. Each Tape user has an user API key associated with it that acts as a bearer token to authentciate with the API.
Note that your API key carries the same privileges as your user account, so be sure to keep it secret! However, if your API key gets leaked, you can always deactivate it and generate a new one inside your user settings.

:::info Authentication via OAuth
In the future, Tape plans to support authentication flows via OAuth. For now, the user API key is the only way of authentication.
:::

Here's an example of how to correctly set the `Authorization` header:

<Tabs>
<TabItem value="curl" label="cURL">
<ApiKeyCodeblock language="shell">
{`curl #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer #USER_API_KEY"
`}
</ApiKeyCodeblock>
</TabItem>

<TabItem value="http" label="HTTP">
<ApiKeyCodeblock language="http">
{`GET /v1/record/1 HTTP/1.1
Host: api.tapeapp.com
Authorization: Bearer #USER_API_KEY
`}
</ApiKeyCodeblock>
</TabItem>
</Tabs>

## Authentication errors

Tape returns comprehensive error messages for authentication failures:

```json title="Invalid key format validation error"
{
  "status_code": 400,
  "endpoint": "/v1/record/1",
  "error_code": "validation",
  "error_message": "Invalid user API key for accessing endpoint '/v1/record/1' (key has to start with 'user_key_')"
}
```

```json title="Invalid key signature validation error"
{
  "status_code": 400,
  "endpoint": "/v1/record/1",
  "error_code": "validation",
  "error_message": "Invalid user API key for accessing endpoint '/v1/record/1' (signature check not passed, key is malformed)"
}
```

```json title="Authentication missing error"
{
  "status_code": 401,
  "endpoint": "/v1/record/1",
  "error_code": "dev_api_authentication",
  "error_message": "Missing authentication for Dev-API endpoint: '/v1/record/1' (no user API key provided)"
}
```
