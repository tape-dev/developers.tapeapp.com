---
id: overview
title: OAuth
sidebar_label: Overview
description: Let other Tape users connect your app to their account with OAuth 2.1. When to use it, supported flows, endpoints, and what an access token can do.
---

import MediaFrame from '@site/src/components/media-frame/media-frame.component';
import ConnectionsSettingsPng from '@site/static/docs/api/oauth/overview/connections-settings.png';

Use OAuth to let other Tape users connect your app to their Tape account without copying a secret.

Tape is an OAuth 2.1 authorization server. An access token calls the [Developer API](/docs/api/introduction) and the [Tape MCP server](/docs/mcp/overview) as the user who approved your app.

## When to use OAuth

OAuth is mainly for *MCP clients* and for *integrations and partners registered by Tape*.

| You are building                                                                                    | Use                                                                                        |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| A script, internal tool or integration that calls the API directly, including on a user's behalf    | A [personal access token](/docs/api/personal-access-tokens)                                |
| An MCP client or AI platform                                                                        | OAuth, with a client that [registers itself](/docs/api/oauth/clients#register-a-client-yourself) |
| An integration or partner product with a "Connect to Tape" or "Sign in with Tape" button            | OAuth, with a [client registered by Tape](/docs/api/oauth/clients#a-client-registered-by-tape). See the [integration guide](/docs/api/oauth/sign-in-with-tape) |

A personal access token can do everything an OAuth token can do, and more. It needs no client registration, no redirect, no consent screen and no refreshing. You can limit it to selected workspaces and apps. See [Which credential to use](/docs/api/authentication#which-credential-to-use).

## How it works

1. Your app sends the user's browser to Tape's *authorization endpoint* and names the scopes it needs.
2. The user signs in to Tape if needed and chooses the organization to connect. The *consent screen* shows your app's name and what your app can do.
3. The user approves. Tape redirects the browser back to your app with a short-lived *authorization code*.
4. Your app exchanges the code at the *token endpoint* for an *access token* and a *refresh token*.
5. Your app calls the API with the access token. The access token lasts one hour. Use the refresh token to get a new one.

Each approval creates a *connection* between the user and your app. A connection keeps working until one of these happens:

- The user, an organization admin, or your app disconnects it.
- The user loses access to the organization.
- 90 days pass without a refresh.
- 365 days pass since the user approved it. This doesn't apply when Tape registered your client as a confidential one.

[The authorization flow](/docs/api/oauth/authorization-flow) walks through every step.

:::info Where do users see their connections?
In Tape, users select their profile picture, then select **Preferences** → **Connections**. MCP clients appear under **Tape MCP** instead. Organization owners and admins manage connections for everyone on the **Manage** tab of the same pages.
:::

<MediaFrame><img src={ConnectionsSettingsPng} alt="Connections page in the settings window with the tabs Browse Connections and Manage" /></MediaFrame>

## Supported flows

| Grant type                                     | Supported                                 |
| ---------------------------------------------- | ----------------------------------------- |
| Authorization code with PKCE (`authorization_code`) | Yes, the only way to get a token |
| Refresh token (`refresh_token`)                | Yes                                       |
| Client credentials                             | No                                        |
| Device authorization                           | No                                        |
| Implicit, resource owner password              | No, OAuth 2.1 removes both                |

- **PKCE is required**, with the `S256` method. Tape refuses `plain`.
- **The response type is `code`**, and the response mode is `query`.
- **Tape is not an OpenID Connect provider.** There is no `id_token` and no OpenID userinfo endpoint. The token response names the user (`tape_user_id`), and [`GET /v1/user`](/docs/api/resource/user#retrieve-the-current-user) returns the rest.
- **Tokens are opaque.** They are not JWTs. Don't try to decode them.

## Endpoints

The issuer is `https://api.tapeapp.com`.

| Endpoint                                     | URL                                                                     |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| Authorization server metadata (RFC 8414)     | `GET https://api.tapeapp.com/.well-known/oauth-authorization-server`    |
| Authorization                                | `GET https://api.tapeapp.com/oauth/authorize`                           |
| Token                                        | `POST https://api.tapeapp.com/oauth/token`                              |
| Revocation (RFC 7009)                        | `POST https://api.tapeapp.com/oauth/revoke`                             |
| Dynamic client registration (RFC 7591)       | `POST https://api.tapeapp.com/oauth/register`                           |
| Protected resource metadata, Developer API   | `GET https://api.tapeapp.com/.well-known/oauth-protected-resource/v1`   |
| Protected resource metadata, Tape MCP        | `GET https://mcp.tapeapp.com/.well-known/oauth-protected-resource/mcp`  |

The authorization server metadata also lists an introspection endpoint. Tape reserves it for its own services, and it refuses every other client.

Discover the endpoints from the metadata instead of hard-coding them:

```json title="GET https://api.tapeapp.com/.well-known/oauth-authorization-server"
{
  "issuer": "https://api.tapeapp.com",
  "authorization_endpoint": "https://api.tapeapp.com/oauth/authorize",
  "token_endpoint": "https://api.tapeapp.com/oauth/token",
  "revocation_endpoint": "https://api.tapeapp.com/oauth/revoke",
  "introspection_endpoint": "https://api.tapeapp.com/oauth/introspect",
  "registration_endpoint": "https://api.tapeapp.com/oauth/register",
  "scopes_supported": ["apps:read", "records:read"],
  "response_types_supported": ["code"],
  "response_modes_supported": ["query"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post", "none"],
  "revocation_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post", "none"],
  "introspection_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
  "code_challenge_methods_supported": ["S256"],
  "client_id_metadata_document_supported": true,
  "authorization_response_iss_parameter_supported": true,
  "service_documentation": "https://developers.tapeapp.com/oauth"
}
```

`scopes_supported` lists only the default read scopes. You can request every scope in [Capabilities](/docs/api/capabilities).

### General behavior

- The token and revocation endpoints take `application/x-www-form-urlencoded` bodies. Registration takes `application/json`.
- Send each parameter at most once. Only `resource` may repeat.
- The token, revocation, and registration endpoints and all three metadata documents allow cross-origin requests. An app that runs in a browser can call them.

## What an access token can do

- **It acts as the user.** Its access is the user's own permissions, narrowed by the scopes the user approved. Records it creates or changes show the user as the author.
- **It reaches everything the user can.** Unlike a personal access token, you can't limit an OAuth access token to selected workspaces and apps.
- **It works at the Developer API and the MCP server alike.** One token is valid at `https://api.tapeapp.com/v1` and at `https://mcp.tapeapp.com/mcp`.
- **It shares the user's rate limit.** Every connected app draws from the same per-user budget as the user's personal access tokens. See [Request limits](/docs/api/request-limits).

Send it as a bearer token, the same way as a personal access token:

```shell
curl https://api.tapeapp.com/v1/user \
  -H "Authorization: Bearer tape_oat_0a1b2c3d..."
```

### Credential formats

Every OAuth credential has a recognizable prefix. The prefix is part of the value. Store and send each credential exactly as you received it.

| Credential         | Prefix      | Lifetime                                                  |
| ------------------ | ----------- | --------------------------------------------------------- |
| Access token       | `tape_oat_` | 1 hour                                                    |
| Refresh token      | `tape_ort_` | Public client: single use, each refresh returns a new one. Confidential client: as long as its connection. See [Refreshing](/docs/api/oauth/authorization-flow#refreshing-an-access-token) |
| Authorization code | `tape_oac_` | 60 seconds, single use                                    |
| Client ID          | `tape_oc_`  | None. A [metadata document](/docs/api/oauth/clients#client-id-metadata-document) client uses its URL instead |
| Client secret      | `tape_ocs_` | Until Tape rotates it                                     |

## Next steps

- [Register a client](/docs/api/oauth/clients): get a `client_id`, and a secret if your app has a backend.
- [Authorization flow](/docs/api/oauth/authorization-flow): send each request step by step, then refresh, ask for more scopes, and disconnect.
- [Integration guide](/docs/api/oauth/sign-in-with-tape): connect your product's users to Tape from your backend.
- [Capabilities](/docs/api/capabilities): every scope you can request.
- [Personal access tokens](/docs/api/personal-access-tokens): call the API directly without a client.
- [Request limits](/docs/api/request-limits): the per-user budget connected apps share.
- In the Help Center: [Connect apps with OAuth 2.1](https://help.tapeapp.com/en/articles/18449279-connect-apps-with-oauth-2-1)
