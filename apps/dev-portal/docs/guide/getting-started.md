---
id: getting-started
title: Getting Started
---

import UserLoginInfo from '@site/src/components/user-login/user-login.component';
import ApiKeyCodeblock from '@site/src/components/api-key-code-block/api-key-code-block.component';

<UserLoginInfo></UserLoginInfo>

If you're new to the Tape API, you've come to the right place. In this guide you'll learn how to use the Tape API by interacting with a Record.

## Authentication

The easiest way to authenticate with the Developer API is to use your personal user API key. Note that your API key carries the same privileges as your user account, so be sure to keep it secret! However, if your API key gets leaked you can always deactivate it and generate a new one inside your user settings.

## Retrieve your first Record

<ApiKeyCodeblock language="shell">
{`curl #BASE_URL/v1/record/#RECORD_ID  \\
  -u #USER_API_KEY:
`}
</ApiKeyCodeblock>
