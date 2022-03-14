---
id: api-reference
title: API Reference
sidebar_label: API Reference
---

import { ActiveUserApiKey } from '@site/src/components/active-user/api-key.component';
import ApiKeyCodeblock from '@site/src/components/api-key-code-block.component';

# API Reference

The Tape API follows the REST specification. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.

## First example

<ApiKeyCodeblock>
{`curl https://api.tapeapp.com/v1/record \\
  -u #USER_API_KEY:
`}
</ApiKeyCodeblock>

## Base URL

```
https://api.tapeapp.com
```

## Authentication

### Personal API keys

The easiest way to get started with the Tape API is to use personal API keys to authenticate requests. You can view and manage your API keys in your [Tape user settings](<https://tapeapp.com/tape/(focus//root-modal:user-settings/profile)>).

Your personal API key carries many privileges, so to keep it secure! Avoid sharing it in public environments, such as GitHub, client-side code, and so forth. You can regenerate it anytime, the previuos one will not work in that case.

Authentication to the API is performed via HTTP Basic Auth. Provide your API key as the basic auth username value, providing a password is not required.

In case you need to authenticate via bearer auth, use `-H "Authorization: Bearer KEY"` instead of `-u KEY`.

All API requests are to be made over HTTPS, while calls made over plain HTTP will fail. API requests without authentication will also fail.

### OAuth2 Authentication Flow

In order to develop scalable integrations and applications around Tape, there will be an OAuth2 authentication flow in the future. Feel free to reach out to developers@tapeapp.com to vote for that feature.
