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

:::info Authentication via OAuth
In the future, Tape plans to support authentication flows via OAuth. For now, the user API key is the only way of authentication.
:::
