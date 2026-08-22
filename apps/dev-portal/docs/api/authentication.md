---
id: authentication
title: Authentication
sidebar_label: Authentication
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Requests use the HTTP `Authorization` header to both authenticate and authorize operations. The Tape API accepts bearer tokens in this header.

There are two kinds of bearer token, and both authenticate the same way. What differs is how much they are allowed to do.

## Choosing a credential

|                   | Personal access token                              | User API key                            |
| ----------------- | -------------------------------------------------- | --------------------------------------- |
| Prefix            | `tape_pat_`                                        | `user_key_`                             |
| What it may do    | Only the [capabilities](/docs/api/capabilities) you grant it | Everything your user account can do     |
| What it may reach | All, or only the workspaces and apps you select    | Everything you can reach                |
| How many          | Several per user, typically one per integration    | Exactly one per user                    |
| Revoking          | Individually, at any time                          | Only by rotating the single key         |
| Status            | Recommended                                        | Deprecated — existing integrations only |

:::tip Prefer a personal access token for new integrations
A personal access token can be limited to exactly the capabilities an integration needs, restricted to particular workspaces and apps, and revoked on its own without disturbing anything else you have built. See [Personal access tokens](/docs/api/personal-access-tokens).
:::

:::caution User API keys are deprecated
Existing user API keys keep working, and nothing about them changed when personal access tokens were introduced — they carry no capabilities, are never subject to capability or content checks, and existing integrations are unaffected.

They are no longer the recommended credential, though. A user API key cannot be limited to a set of capabilities, cannot be restricted to particular workspaces and apps, and can only be invalidated by rotating it — which breaks every other integration using it at the same time. Build new integrations on a [personal access token](/docs/api/personal-access-tokens).
:::

## User API key

Each Tape user has a user API key associated with it that acts as a bearer token to authenticate with the API.

:::info Where does one find the user API key?
The user API key can be found inside the user settings after logging into Tape. Click the user avatar on the top right, and navigate to "Preferences". After opening the user preferences you will find the API key inside the "API" section (accessible via the left navigation bar). Here, you can copy the key and also rotate the key should you want a new one. Note that the existing one will not work anymore after rotating to a new key.
:::

Note that your API key carries the same privileges as your user account, so be sure to keep it secret! However, if your API key gets leaked, you can always deactivate it and generate a new one inside your user settings.

## Personal access token

A personal access token is a named credential you create for a single integration. You choose what it may do, and which workspaces and apps it may do it to. Tokens start with `tape_pat_` and are shown only once, at creation.

Read [Personal access tokens](/docs/api/personal-access-tokens) for how to create, scope and revoke one, and [Capabilities](/docs/api/capabilities) for the full list of what a token can be granted.

## Attribution

:::note Both credentials act as your user
Every credential belongs to a user, so all changes made using it will show the respective user as author, e.g. inside the record's activity stream. This also means that you will not receive notifications if you follow a record and make a change using your own credential. A workaround is to have a dedicated user, e.g. called "API User" that will then act as a host to yield the credential that will then be utilized.
:::

## Usage example

Here's an example of how to correctly set the `Authorization` header:

<Tabs>
<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell">
{`curl #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer #USER_API_KEY"
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="http" label="HTTP">
<ContextCodeBlock language="http">
{`GET /v1/record/1 HTTP/1.1
Host: api.tapeapp.com
Authorization: Bearer #USER_API_KEY
`}
</ContextCodeBlock>
</TabItem>
</Tabs>

A personal access token goes in exactly the same header:

```shell
curl https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer tape_pat_0a1b2c3d..."
```

:::info Authentication via OAuth
In the future, Tape plans to support authentication flows via OAuth. OAuth will use the same [capabilities](/docs/api/capabilities) as personal access tokens, so anything you learn about them now carries over.
:::

## Authentication errors

Tape returns comprehensive error messages for authentication failures. The messages below are the same for both kinds of credential.

```json title="Invalid or unusable credential"
{
  "status_code": 400,
  "endpoint": "/v1/record/1",
  "error_code": "validation",
  "error_message": "Invalid API key for accessing endpoint '/v1/record/1' (no active user for the given API key)"
}
```

```json title="Malformed credential"
{
  "status_code": 400,
  "endpoint": "/v1/record/1",
  "error_code": "validation",
  "error_message": "Invalid API key for accessing endpoint '/v1/record/1' (signature check not passed, key is malformed)"
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

:::note One message for several causes
An unknown token, a revoked token and a token whose owner was deactivated all return the same "no active user for the given API key" message. This is deliberate: distinguishing them would let an unauthenticated caller probe which tokens exist.
:::

A personal access token that authenticates successfully but lacks the capability an endpoint requires is rejected with a `403` instead. See [Insufficient capabilities](/docs/api/capabilities#insufficient-capabilities).
