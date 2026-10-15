---
id: overview
title: OAuth
sidebar_label: Overview
description: Let other Tape users connect your app to their account with OAuth 2.1 — when to use it, supported flows, endpoints and what an access token can do.
---

Tape is an **OAuth 2.1 authorization server**. Your app sends a user to Tape, the user signs in and approves what your app asked for, and your app receives an access token that calls the [Developer API](/docs/api/introduction) and the [Tape MCP server](/docs/mcp/overview) as that user. The user never copies a secret into your app, and can disconnect it at any time.

## When to use OAuth

OAuth is mainly for **MCP clients** and for **integrations and partners registered by Tape**. If you are a developer calling the API directly — for yourself, or to act in Tape on a user's behalf — use a [personal access token](/docs/api/personal-access-tokens) instead. It needs no client registration, no redirect and no consent screen.

| You are building                                                                                    | Use                                                                                        |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| A script, internal tool or integration that calls the API directly, including on a user's behalf    | A [personal access token](/docs/api/personal-access-tokens)                                |
| An MCP client or AI platform                                                                        | OAuth, with a client that [registers itself](/docs/api/oauth/clients#register-a-client-yourself) |
| An integration or partner product with a "Connect to Tape" or "Sign in with Tape" button            | OAuth, with a [client registered by Tape](/docs/api/oauth/clients#a-client-registered-by-tape) — see the [integration guide](/docs/api/oauth/sign-in-with-tape) |

A personal access token can do everything an OAuth token can and more: it can be limited to selected workspaces and apps, and it needs no refreshing. See [Which credential to use](/docs/api/authentication#which-credential-to-use).

## How it works

1. Your app sends the user's browser to Tape's **authorization endpoint**, naming the [scopes](/docs/api/capabilities) it needs.
2. The user signs in to Tape if they are not already, chooses the organization to connect, and sees the **consent screen**: your app's name and what it will be able to do.
3. When the user approves, Tape redirects the browser back to your app with a short-lived **authorization code**.
4. Your app exchanges the code at the **token endpoint** for an **access token** and a **refresh token**.
5. Your app calls the API with the access token. The access token lasts one hour; the refresh token gets a new one.

Each approval creates a **connection** between the user and your app. A connection keeps working until the user, an organization admin or your app disconnects it, or the user loses access to the organization. It also expires after 90 days without a refresh and — unless Tape registered your client as a confidential one — 365 days after the user approved it. [The authorization flow](/docs/api/oauth/authorization-flow) walks through every step.

## Supported flows

| Grant type                                     | Supported                                 |
| ---------------------------------------------- | ----------------------------------------- |
| Authorization code with PKCE (`authorization_code`) | Yes — the only way to obtain a token |
| Refresh token (`refresh_token`)                | Yes                                       |
| Client credentials                             | No                                        |
| Device authorization                           | No                                        |
| Implicit, resource owner password              | No — both are removed in OAuth 2.1        |

- **PKCE is required**, with the `S256` method. `plain` is refused.
- **The response type is `code`** and the response mode is `query`.
- **Tape is not an OpenID Connect provider.** There is no `id_token` and no OpenID userinfo endpoint. The token response names the user (`tape_user_id`), and [`GET /v1/user`](/docs/api/resource/user#retrieve-the-current-user) returns the rest.
- **Tokens are opaque.** They are not JWTs; do not try to decode them.

## Endpoints

The issuer is `https://api.tapeapp.com`.

| Endpoint                                     | URL                                                                     |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| Authorization server metadata (RFC 8414)     | `GET https://api.tapeapp.com/.well-known/oauth-authorization-server`    |
| Authorization                                | `GET https://api.tapeapp.com/oauth/authorize`                           |
| Token                                        | `POST https://api.tapeapp.com/oauth/token`                              |
| Revocation (RFC 7009)                        | `POST https://api.tapeapp.com/oauth/revoke`                             |
| Dynamic client registration (RFC 7591)       | `POST https://api.tapeapp.com/oauth/register`                           |
| Protected resource metadata — Developer API  | `GET https://api.tapeapp.com/.well-known/oauth-protected-resource/v1`   |
| Protected resource metadata — Tape MCP       | `GET https://mcp.tapeapp.com/.well-known/oauth-protected-resource/mcp`  |

The authorization server metadata also lists an introspection endpoint. It is reserved for Tape's own services and refuses every other client.

The token and revocation endpoints take `application/x-www-form-urlencoded` bodies; registration takes `application/json`. Send each parameter at most once — only `resource` may repeat. The token, revocation and registration endpoints and all three metadata documents allow cross-origin requests, so an app running in a browser can call them.

Prefer discovering the endpoints from the metadata over hard-coding them:

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

`scopes_supported` lists only the default read scopes. Every scope in [Capabilities and Scopes](/docs/api/capabilities) can be requested.

## What an access token can do

- **It acts as the user.** Its access is the user's own permissions, narrowed by the scopes they approved. Records it creates or changes show the user as the author.
- **It reaches everything the user can.** Unlike a personal access token, an OAuth access token cannot be limited to selected workspaces and apps.
- **It works at the Developer API and the MCP server alike.** One token is valid at `https://api.tapeapp.com/v1` and at `https://mcp.tapeapp.com/mcp`.
- **It shares the user's rate limit.** Every connected app draws from the same per-user budget as the user's personal access tokens. See [Request limits](/docs/api/request-limits).

Send it as a bearer token, exactly like a personal access token:

```shell
curl https://api.tapeapp.com/v1/user \
  -H "Authorization: Bearer tape_oat_0a1b2c3d..."
```

### Credential formats

Every OAuth credential has a recognizable prefix. The prefix is part of the value: store and send each one verbatim.

| Credential         | Prefix      | Lifetime                                                  |
| ------------------ | ----------- | --------------------------------------------------------- |
| Access token       | `tape_oat_` | 1 hour                                                    |
| Refresh token      | `tape_ort_` | Public client: single use, each refresh returns a new one. Confidential client: as long as its connection. See [Refreshing](/docs/api/oauth/authorization-flow#refreshing-an-access-token) |
| Authorization code | `tape_oac_` | 60 seconds, single use                                    |
| Client ID          | `tape_oc_`  | — (a [metadata document](/docs/api/oauth/clients#client-id-metadata-document) client uses its URL instead) |
| Client secret      | `tape_ocs_` | Until Tape rotates it                                     |

## Next steps

- [Register a client](/docs/api/oauth/clients) — get a `client_id`, and a secret if your app has a backend
- [The authorization flow](/docs/api/oauth/authorization-flow) — the requests, step by step, plus refreshing, step-up and disconnecting
- [Integration guide](/docs/api/oauth/sign-in-with-tape) — connect your product's users to Tape from your backend
- [Capabilities and Scopes](/docs/api/capabilities) — every scope you can request
