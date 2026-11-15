---
id: authentication
title: Authentication
sidebar_label: Authentication
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DeveloperSettingsPng from '@site/static/docs/api/authentication/developer-settings.png';
import MediaFrame from '@site/src/components/media-frame/media-frame.component';

Send a bearer token in the `Authorization` header of every request to authenticate with the Tape API.

Tape accepts three kinds of bearer token for your own code. They differ in who obtains them and how much they may do. A fourth kind, the [automation API key](#automation-api-key), exists only inside automation runs.

## Usage example

<Tabs>
<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell">
{`curl #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN"
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="http" label="HTTP">
<ContextCodeBlock language="http">
{`GET /v1/record/1 HTTP/1.1
Host: api.tapeapp.com
Authorization: Bearer tape_pat_0a1b2c3d...
`}
</ContextCodeBlock>
</TabItem>
</Tabs>

`$TAPE_TOKEN` holds your personal access token from the [Quickstart](/docs/guide/api/getting-started#step-1-create-a-personal-access-token). `1` is a record ID.

An OAuth access token goes in the same header. So does a user API key in existing integrations:

```shell
curl https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer tape_oat_0a1b2c3d..."
```

## Which credential to use

| You are…                                                                                                                              | Use                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| A developer calling the API directly: a script, an internal tool, an integration you build and run, including one that works in Tape on a user's behalf | A personal access token                          |
| Connecting an AI assistant or another MCP client to Tape                                                                              | OAuth: the client [signs in with Tape](/docs/mcp/connect)                           |
| Building an integration or partner product that Tape registers, with a "Connect to Tape" or "Sign in with Tape" button                | OAuth, with a [client registered by Tape](/docs/api/oauth/clients#a-client-registered-by-tape) |
| Maintaining an integration built on a user API key                                                                                    | Keep it running, and move it to a personal access token when you next work on it     |

**Personal access tokens are the default.** Use one whenever you write code that calls the Tape API. A personal access token:

- needs no client registration, no redirect and no consent screen
- never needs refreshing
- can be limited to the capabilities, workspaces and apps your code needs
- can be revoked on its own without affecting anything else

The user your integration should act as creates the token and hands it to your integration.

Coming from the Podio API? Instead of app authentication, use a [personal access token limited to that app](/docs/guide/api/coming-from-podio#switch-authentication).

**OAuth is for MCP clients and registered integrations.** With OAuth, a person connects an app by signing in to Tape, without handling a secret. MCP clients use it to connect to the [Tape MCP server](/docs/mcp/overview). Integrations and partners registered by Tape use it for their sign-in. Building such an integration? [Ask Tape to register a client](/docs/api/oauth/clients#a-client-registered-by-tape).

## Comparing the credentials

|                   | Personal access token                                        | OAuth access token                                                   | User API key                            |
| ----------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- | --------------------------------------- |
| Used by           | Developers calling the API directly                          | MCP clients, and integrations registered by Tape                     | Existing integrations                   |
| Prefix            | `tape_pat_`                                                  | `tape_oat_`                                                          | `user_key_`                             |
| Obtained by       | Creating it in your Tape settings                            | The user approving your app on Tape's consent screen                 | Copying it from your Tape settings      |
| What it may do    | Only the capabilities you grant it | Only the capabilities the user approved    | Everything your user account can do     |
| What it may reach | All, or only the workspaces and apps you select              | Everything the user can reach                                        | Everything you can reach                |
| Lifetime          | Until revoked                                                | Access tokens last one hour and are renewed with a refresh token; the connection ends after 90 days unused, and for most apps a year after approval | Until deleted                           |
| Revoking          | Individually, at any time                                    | By the user, an organization admin, or the app                       | Only by deleting the single key         |
| Status            | Recommended                                                  | For MCP clients and registered integrations                          | Deprecated, existing integrations only |

:::caution User API keys are deprecated
Existing user API keys keep working, but you can't limit them to capabilities, workspaces or apps. Deleting a key breaks every integration that uses it. Build new integrations on a personal access token.
:::

## User API key

Each Tape user has one user API key. It acts as a bearer token for the API.

:::info Where do you find the user API key?
1. Select your profile picture, then select **Preferences**.
2. In the settings window, select **Developer** (under **Features**).
3. If you still have a user API key, it appears as **API Key** in the table of personal access tokens.
4. Open its **⋯** menu and select **Copy API key** or **Delete**.
:::

<MediaFrame><img src={DeveloperSettingsPng} alt="Developer page in the settings window, selected under Features, with the table of personal access tokens and the New token button" /></MediaFrame>

:::caution Keep your user API key secret
Your user API key has the same privileges as your user account. If it leaks, delete it in the settings window under **Developer** and create a personal access token instead. A deleted key can't be restored.
:::

## Personal access token

A personal access token is a named credential you create for one integration. You choose what it may do, and which workspaces and apps it may reach. Tokens start with `tape_pat_`, and Tape shows each one only once, when you create it.

- [Personal access tokens](/docs/api/personal-access-tokens): create, limit and revoke a token.
- [Capabilities](/docs/api/capabilities): the full list of what you can grant a token.

## OAuth access token

An app receives an OAuth access token when a Tape user connects it to their account:

1. The app sends the user to Tape.
2. The user approves the scopes the app asked for.
3. The app gets an access token that acts as that user.

Tokens start with `tape_oat_`, last one hour, and are renewed with a refresh token. [OAuth](/docs/api/oauth/overview) describes the whole flow.

## Automation API key

An automation API key authenticates an automation, not a person. Tape creates a new one for each automation run. Keys start with `workflow_key_` and expire after a short time.

The `tape` client in an [**Execute a script** action](/docs/automations/introduction#tape-api-client) uses it, so your script doesn't handle authentication. You can't create, copy or revoke an automation API key yourself.

The key has no user behind it, so endpoints that need a user reject it, mostly with `400` or `401`. Where it works, Tape checks the automation's own access to the app or record. It works for:

- the [discovery endpoints](/docs/api/resource/automation/discovery) of the automation API
- [calling an automation and generating a weblink](/docs/api/resource/automation/advanced)
- [listing the views of an app](/docs/api/resource/app#retrieve-views-for-an-app)
- [retrieving a single app](/docs/api/resource/app#retrieve-a-single-app)
- the record endpoints the built-in actions call: retrieve, create, update, delete and restore a record, filter records, retrieve the records of a view, record references and their statistics
- [batch creating](/docs/api/resource/record#batch-create-multiple-records) and [batch updating](/docs/api/resource/record#batch-update-multiple-records) records
- all [record revision endpoints](/docs/api/resource/record-revision)
- [unfollowing all records in a database app](/docs/api/resource/record-follow)
- creating a comment or a reply, and [deleting a comment or reply](/docs/api/resource/record-comment#delete-a-comment-or-reply)
- generating a PDF, sending an email and making an authenticated HTTP call
- uploading files and creating a signed upload URL
- the [automation usage report](/docs/api/resource/automation-usage-report)

It doesn't work for managing apps, fields and views, retrieving a view, retrieving shared records, finding relatable records, updating record permissions, reading or listing comments and replies, deleting a comment with `DELETE /v1/comment/{comment_id}`, managing automations, listing automation runs, search, webhooks, users, workspaces and organizations.

Requests with an automation API key count against the run's own budget, not a user's. The `X-RateLimit-Scope` header shows `workflow`. See [Request limits](/docs/api/request-limits).

## Attribution

Every credential belongs to a user. Changes made with it show that user as the author, for example in the record's activity. You also don't get notifications for your own changes on records you follow.

To show an integration under its own name, create a dedicated user, for example "API User", and create the credential from that account.

## Authentication errors

Failed authentication with a personal access token or a user API key returns one of these responses. An OAuth access token that's no longer valid gets its own response. See [General behavior](#general-behavior).

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

```json title="Missing credential"
{
  "status_code": 401,
  "endpoint": "/v1/record/1",
  "error_code": "dev_api_authentication",
  "error_message": "Missing authentication for Dev-API endpoint: '/v1/record/1' (no user API key provided)"
}
```

The missing authentication response also carries `WWW-Authenticate: Bearer resource_metadata="https://api.tapeapp.com/.well-known/oauth-protected-resource/v1"`. An OAuth client finds Tape's authorization server there.

:::note Why do several causes return the same message?
An unknown token, a revoked token and a token whose owner was deactivated all return the same "no active user for the given API key" message. This is deliberate: different messages would let an unauthenticated caller probe which tokens exist.
:::

:::info Getting an authentication error?
Check that you send the whole token, prefix included, after `Bearer `. If the token was revoked or lost, create a new one under **Developer**.
:::

### General behavior

- An OAuth access token that's no longer valid (expired, revoked or disconnected) returns `401` with the error code `dev_api_invalid_access_token`. The response carries a `WWW-Authenticate: Bearer error="invalid_token"` header, whose `resource_metadata` points to the Developer API's protected resource metadata. See [Errors at the Developer API](/docs/api/oauth/authorization-flow#at-the-developer-api).
- A personal access token or OAuth access token that authenticates but lacks the capability an endpoint requires returns `403`. See [Insufficient capabilities](/docs/api/capabilities#insufficient-capabilities).

## Next steps

- [Quickstart](/docs/guide/api/getting-started): make your first request with a personal access token.
- [Personal access tokens](/docs/api/personal-access-tokens): create and limit a token.
- [Capabilities](/docs/api/capabilities): what each endpoint requires.
- [OAuth overview](/docs/api/oauth/overview): connect apps and MCP clients.
- [Errors](/docs/api/errors): handle all error codes.
