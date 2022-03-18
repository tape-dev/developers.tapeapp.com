---
id: authentication
title: Authentication
sidebar_label: Authentication
---

import ApiKeyCodeblock from '@site/src/components/api-key-code-block/api-key-code-block.component';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Requests use the HTTP `Authorization` header to both authenticate and authorize operations. The Tape API accepts bearer tokens in this header. Bearer tokens are provided to you when you create an integration. If you're creating a public OAuth integration, the integration also receives bearer tokens each time a user completes the OAuth flow.

Here is your user API Key:

<ApiKeyCodeblock language="shell">
#USER_API_KEY
</ApiKeyCodeblock>

You can use it to authenticate via the HTTP `Authorization` header:

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
