---
id: authentication
title: Authentication
sidebar_label: Authentication
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Requests use the HTTP `Authorization` header to both authenticate and authorize operations. The Tape API accepts bearer tokens in this header.

There are three kinds of bearer token, and all of them authenticate the same way. What differs is who obtains them and how much they are allowed to do.

## Which credential to use

| You are…                                                                                                                              | Use                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| A developer calling the API directly — a script, an internal tool, an integration you build and run, including one that works in Tape on a user's behalf | A [personal access token](/docs/api/personal-access-tokens)                          |
| Connecting an AI assistant or another MCP client to Tape                                                                              | OAuth — the client [signs in with Tape](/docs/mcp/connect)                           |
| Building an integration or partner product that Tape registers, with a "Connect to Tape" or "Sign in with Tape" button                | OAuth, with a [client registered by Tape](/docs/api/oauth/clients#a-client-registered-by-tape) |
| Maintaining an integration built on a user API key                                                                                    | Keep it running, and move it to a personal access token when you next work on it     |

**Personal access tokens are the default.** If you write code that calls the Tape API — for yourself, for your team, or to act in Tape on a particular user's behalf — use a personal access token. It needs no client registration, no redirect and no consent screen, never needs refreshing, can be limited to exactly the capabilities and the workspaces and apps your code needs, and can be revoked on its own without disturbing anything else. The user it should act as creates the token and hands it to your integration.

**OAuth is for MCP clients and registered integrations.** OAuth lets a person connect an app by signing in to Tape, without ever handling a secret. It is how MCP clients connect to the [Tape MCP server](/docs/mcp/overview), and how integrations and partners registered by Tape run their sign-in. If you are building such an integration, [ask Tape to register a client](/docs/api/oauth/clients#a-client-registered-by-tape).

## Comparing the credentials

|                   | Personal access token                                        | OAuth access token                                                   | User API key                            |
| ----------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- | --------------------------------------- |
| Used by           | Developers calling the API directly                          | MCP clients, and integrations registered by Tape                     | Existing integrations                   |
| Prefix            | `tape_pat_`                                                  | `tape_oat_`                                                          | `user_key_`                             |
| Obtained by       | Creating it in your Tape settings                            | The user approving your app on Tape's consent screen                 | Copying it from your Tape settings      |
| What it may do    | Only the [capabilities](/docs/api/capabilities) you grant it | Only the [capabilities](/docs/api/capabilities) the user approved    | Everything your user account can do     |
| What it may reach | All, or only the workspaces and apps you select              | Everything the user can reach                                        | Everything you can reach                |
| Lifetime          | Until revoked                                                | Access tokens last one hour and are renewed with a refresh token; the connection ends after 90 days unused, and for most apps a year after approval | Until rotated                           |
| Revoking          | Individually, at any time                                    | By the user, an organization admin, or the app                       | Only by rotating the single key         |
| Status            | Recommended                                                  | For MCP clients and registered integrations                          | Deprecated — existing integrations only |

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

Read [Personal access tokens](/docs/api/personal-access-tokens) for how to create, scope and revoke one, and [Capabilities and Scopes](/docs/api/capabilities) for the full list of what a token can be granted.

## OAuth access token

An OAuth access token is what an app receives when a Tape user connects it to their account. The app sends the user to Tape, the user approves the [scopes](/docs/api/capabilities) the app asked for, and the app gets an access token that acts as that user. Tokens start with `tape_oat_`, last one hour, and are renewed with a refresh token.

OAuth is mainly for MCP clients and for integrations and partners registered by Tape. If you call the API directly — including on a user's behalf — use a personal access token instead. Read [OAuth](/docs/api/oauth/overview) for the whole flow.

## Attribution

:::note Every credential acts as its user
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

A personal access token or an OAuth access token goes in exactly the same header:

```shell
curl https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer tape_pat_0a1b2c3d..."
```

## Authentication errors

Tape returns comprehensive error messages for authentication failures. The messages below are the same for a personal access token and a user API key.

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

This response also carries `WWW-Authenticate: Bearer resource_metadata="https://api.tapeapp.com/.well-known/oauth-protected-resource/v1"`, from which an OAuth client can find Tape's authorization server.

:::note One message for several causes
An unknown token, a revoked token and a token whose owner was deactivated all return the same "no active user for the given API key" message. This is deliberate: distinguishing them would let an unauthenticated caller probe which tokens exist.
:::

An OAuth access token that is no longer valid — expired, revoked or disconnected — is rejected with a `401` and the error code `dev_api_invalid_access_token` instead, together with a `WWW-Authenticate: Bearer error="invalid_token"` header whose `resource_metadata` points to the Developer API's protected resource metadata. See [Errors at the Developer API](/docs/api/oauth/authorization-flow#at-the-developer-api).

A personal access token or OAuth access token that authenticates successfully but lacks the capability an endpoint requires is rejected with a `403`. See [Insufficient capabilities](/docs/api/capabilities#insufficient-capabilities).
