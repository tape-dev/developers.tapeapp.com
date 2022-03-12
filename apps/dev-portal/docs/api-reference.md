---
id: api-reference
title: API Reference
sidebar_label: API Reference
---

# API Reference
The Tape API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.

You can use the Tape API in test mode, which does not affect your live data or interact with the banking networks. The API key you use to authenticate the request determines whether the request is live mode or test mode.

The Tape API differs for every account as we release new versions and tailor functionality. Log in to see docs customized to your version of the API, with your test key and data.

## Base URL

```
https://api.tapeapp.com
```

## Authentication

### Personal API keys

The Tape API uses personal API keys to authenticate requests. You can view and manage your API keys in your [Tape user settings](https://tapeapp.com/tape/(focus//root-modal:user-settings/profile)).

Your personal API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.

Authentication to the API is performed via HTTP Basic Auth. Provide your API key as the basic auth username value. You do not need to provide a password.

If you need to authenticate via bearer auth (e.g., for a cross-origin request), use -H "Authorization: Bearer YOUR_API_KEY" instead of -u YOUR_API_KEY.

All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.

```
$ curl https://api.tapeapp.com/v1/charges -u YOUR_API_KEY:

# The colon prevents curl from asking for a password.
```

### OAuth2 Authentication Flow

In order to develop scalable integrations and applications around Tape, there will be an OAuth2 authentication flow in the future.

## Rate Limiting

Currently a global rate limit of X is enforced for all personal API keys. Contact us if you require a different limit.