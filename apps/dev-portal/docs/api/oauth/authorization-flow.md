---
id: authorization-flow
title: The OAuth authorization flow
sidebar_label: Authorization flow
description: Connect a user's Tape account step by step. PKCE, the authorization request, consent, the code exchange, refreshing, step-up, disconnecting, and errors.
---

import ConsentUnverifiedPng from '@site/static/docs/api/oauth/authorization-flow/consent-unverified.png';
import MediaFrame from '@site/src/components/media-frame/media-frame.component';

Use this flow to connect one user's Tape account to your app.

Tape supports one flow: the authorization code flow with PKCE. You need a [client ID](/docs/api/oauth/clients) first.

Most OAuth client libraries implement every step below. Point yours at Tape's [metadata document](/docs/api/oauth/overview#endpoints), and it finds the endpoints itself.

## Step 1: Create a code verifier and challenge {#1-create-a-pkce-verifier-and-challenge}

Create a fresh random *code verifier* for every authorization. Derive its *code challenge* from it: `BASE64URL(SHA256(code_verifier))`, without padding. Keep the verifier on your side until the code exchange, in your backend session or in the app's memory.

```shell
code_verifier=$(openssl rand -base64 48 | tr '+/' '-_' | tr -d '=\n')
code_challenge=$(printf '%s' "$code_verifier" | openssl dgst -sha256 -binary | openssl base64 | tr '+/' '-_' | tr -d '=\n')
```

The verifier must be 43 to 128 characters from `A–Z`, `a–z`, `0–9` and `-._~`. The challenge has 43 characters.

## Step 2: Send the user to Tape {#2-send-the-user-to-tape}

Redirect the user's browser to the authorization endpoint:

```text
https://api.tapeapp.com/oauth/authorize
  ?response_type=code
  &client_id=tape_oc_8f14e45fceea167a5a36dedd4bea2543
  &redirect_uri=https%3A%2F%2Fapp.example.com%2Foauth%2Fcallback
  &scope=apps%3Aread%20records%3Aread%20records%3Aedit
  &state=af0ifjsldkj
  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256
```

| Parameter               | Required    | Description                                                                                                                             |
| ----------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `response_type`         | Yes         | `code`.                                                                                                                                 |
| `client_id`             | Yes         | Your client ID.                                                                                                                         |
| `redirect_uri`          | Yes         | One of your registered [redirect URIs](/docs/api/oauth/clients#redirect-uris). Required even if you registered only one.                |
| `code_challenge`        | Yes         | The challenge from step 1.                                                                                                               |
| `code_challenge_method` | Recommended | `S256`. If omitted, Tape assumes `S256`. Tape refuses `plain`.                                                                          |
| `state`                 | Recommended | An unguessable value bound to the user's browser session. Tape returns it unchanged. Check it on the way back to prevent CSRF.          |
| `scope`                 | No          | Space-separated [scopes](/docs/api/capabilities#requesting-scopes-with-oauth). Defaults to `apps:read records:read`.                    |
| `resource`              | No          | `https://api.tapeapp.com/v1` or `https://mcp.tapeapp.com/mcp`, and may repeat. Accepted for compatibility. The token works at both either way. |

Tape ignores other parameters, such as `nonce`.

## Step 3: Let the user approve {#3-the-user-approves}

Tape asks the user to sign in if needed. The **Connect with Tape** consent screen then shows the organization to connect under **Select organization**, and:

- Your app's name. For a [self-registered](/docs/api/oauth/clients#register-a-client-yourself) client, it shows the client ID URL or the redirect host instead. A client Tape can't tie to a website carries the badge **Unverified**: one with a custom URL scheme shows that scheme, one that returns to a loopback address shows its `software_id` or the `client_name` it registered with, in lowercase. For a self-registered client, the screen reads **Connect with Tape MCP**.
- What your app can do, one line per scope you requested.

<MediaFrame><img src={ConsentUnverifiedPng} alt="Connect with Tape MCP consent screen for a self-registered client: the line Grant acme sales sync access to Tape with the badge Unverified, Select organization, the scopes, Continue and Cancel" /></MediaFrame>

The user approves *all* the requested scopes with **Continue**, or declines with **Cancel**. An authorization request expires if the user doesn't decide in time.

:::info Why can't some users approve?
- **Organization guests** can't connect apps.
- **An organization can restrict apps.** Owners and admins can allow only approved apps for new connections, or limit an app to owners and admins. The consent screen tells a blocked member why, and the member can ask an admin.
:::

## Step 4: Handle the callback {#4-handle-the-callback}

Tape redirects the browser to your `redirect_uri`:

```text
https://app.example.com/oauth/callback
  ?code=tape_oac_4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a
  &state=af0ifjsldkj
  &iss=https%3A%2F%2Fapi.tapeapp.com
```

Before you use the code, check two values:

- `state` is the value you sent.
- `iss` is `https://api.tapeapp.com`.

If the user declines, you receive `access_denied`:

```text
https://app.example.com/oauth/callback
  ?error=access_denied
  &state=af0ifjsldkj
  &iss=https%3A%2F%2Fapi.tapeapp.com
```

### General behavior

- **An invalid request still reaches your app,** for example an unknown scope, a malformed PKCE challenge, or an unsupported `resource`. Tape asks the user to sign in, then shows an error page with the reason ID. When the user selects **Return to app**, your `redirect_uri` receives `error` (`invalid_request`, `invalid_scope`, `invalid_target` or `unsupported_response_type`) and an `error_description` that ends in the reason ID.
- **An untrusted client gets no redirect.** When Tape can't trust the `client_id` or `redirect_uri` itself, because it is unknown, revoked, or not registered, the user sees an error page instead. A request that prefers `application/json` gets a `400` with an `invalid_client` body.

## Step 5: Exchange the code for tokens {#5-exchange-the-code-for-tokens}

Post the code to the token endpoint within 60 seconds:

```shell title="Confidential client"
curl https://api.tapeapp.com/oauth/token \
  -u "tape_oc_8f14e45fceea167a5a36dedd4bea2543:tape_ocs_..." \
  -d grant_type=authorization_code \
  -d code=tape_oac_4b2277... \
  -d code_verifier="$code_verifier" \
  -d redirect_uri=https://app.example.com/oauth/callback
```

```shell title="Public client"
curl https://api.tapeapp.com/oauth/token \
  -d client_id=tape_oc_8f14e45fceea167a5a36dedd4bea2543 \
  -d grant_type=authorization_code \
  -d code=tape_oac_4b2277... \
  -d code_verifier="$code_verifier" \
  -d redirect_uri=https://app.example.com/oauth/callback
```

`redirect_uri` is optional here. If you send it, it must equal the value from step 2 exactly.

```json title="Response"
{
  "access_token": "tape_oat_9a3f...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "tape_ort_3f9a...",
  "scope": "apps:read records:read records:edit",
  "tape_user_id": 45,
  "tape_organization_id": 7
}
```

**Key fields**

| Field                  | Meaning                                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `access_token`         | Send it as `Authorization: Bearer` to the API.                                                                                                             |
| `expires_in`           | Seconds until the access token expires, at most 3600.                                                                                                      |
| `refresh_token`        | Gets new access tokens. Store it securely, on your server where you can.                                                                                   |
| `scope`                | The scopes *this access token* holds. Read it instead of assuming Tape granted your request as sent.                                                     |
| `tape_user_id`         | The connected Tape user. Key your accounts on it: a person who belongs to two Tape organizations is two Tape users.                                         |
| `tape_organization_id` | The organization the user chose on the consent screen.                                                                                                     |

:::danger Never retry a code exchange
A code is single use: Tape treats a code presented twice as stolen, even your own retry after a timeout. It then *disconnects* the connection the code created and answers `invalid_grant`. If an exchange fails, start a new authorization instead.
:::

## Step 6: Call the API {#6-call-the-api}

```shell
curl https://api.tapeapp.com/v1/user \
  -H "Authorization: Bearer tape_oat_9a3f..."
```

The token acts as the connected user, limited to the approved scopes. It works at the [Developer API](/docs/api/introduction) and the [Tape MCP server](/docs/mcp/overview) alike. [`GET /v1/user`](/docs/api/resource/user#retrieve-the-current-user) needs no scope and reports the token's scopes in its response.

## Refreshing an access token

An access token lasts one hour. Get a new one with the refresh token:

```shell
curl https://api.tapeapp.com/oauth/token \
  -u "tape_oc_8f14e45fceea167a5a36dedd4bea2543:tape_ocs_..." \
  -d grant_type=refresh_token \
  -d refresh_token=tape_ort_3f9a...
```

A public client sends `-d client_id=tape_oc_...` instead of `-u`, here and when [disconnecting](#disconnecting).

What happens to the refresh token depends on your client type:

- **Public clients rotate.** Every refresh returns a new refresh token and uses up the one you sent, so store the new one every time. Re-sending a used refresh token within 30 seconds, for example as a retry after a timeout, returns a fresh pair, up to three times. Tape treats a later re-send, or a fourth one, as theft: it disconnects the connection for every device that holds it, and the user has to connect again.
- **Confidential clients keep theirs.** The refresh token from the code exchange stays valid for the life of the connection. A refresh returns only a new access token, without `refresh_token`. Concurrent refreshes are fine.

Send `scope` to get an access token with *fewer* scopes than the connection holds. `scope` never adds scopes. A `scope` outside the connection fails with `invalid_scope` and leaves the refresh token usable.

### General behavior

- Every refresh keeps the connection alive. A connection that gets no new token for 90 days expires.
- A connection also ends 365 days after the user approved it, however active it is. This doesn't apply when Tape registered your client as a confidential one.
- When a refresh fails with `invalid_grant`, the connection is gone. Send the user through the authorization flow again.

## Asking for more scopes

When your app calls an endpoint that needs a scope the token lacks, the API answers `403` with:

```http
WWW-Authenticate: Bearer error="insufficient_scope", error_description="This OAuth access token is missing the required scope(s): records:edit.", scope="records:edit"
```

To get the missing scope:

1. Send the user through the authorization flow again.
2. Set `scope` to the scopes you *already hold plus the missing one*. If you ask for the missing scope alone, you end up with only that scope.
3. The user approves the new set. You get a new connection with exactly those scopes.
4. Store the new tokens, then [revoke](#disconnecting) the old refresh token. The new approval doesn't end the earlier connection, so the user would otherwise keep an unused one.

Ask for everything you need up front, so you don't send the user back to the consent screen. See [Insufficient capabilities](/docs/api/capabilities#insufficient-capabilities).

## Disconnecting

To disconnect, revoke the *refresh token*:

```shell
curl https://api.tapeapp.com/oauth/revoke \
  -u "tape_oc_8f14e45fceea167a5a36dedd4bea2543:tape_ocs_..." \
  -d token=tape_ort_3f9a... \
  -d token_type_hint=refresh_token
```

- **A refresh token** ends the whole connection. Every access token issued for it stops working on the next request.
- **An access token** revokes only that one access token. The connection keeps working.
- Once your client authenticates and sends a `token`, the endpoint answers `200` with an empty body. This includes a token that is unknown, already revoked, or not your client's.

A connection also ends when:

- the user disconnects your app in Tape, under **Preferences** → **Connections**, or an organization admin disconnects it for them or for everyone,
- the user is deactivated or removed from the organization, or becomes a guest,
- an organization admin blocks your app for the user, for example by restricting it to **Owners and admins**,
- it expires, as described under [Refreshing](#refreshing-an-access-token).

Changing a password doesn't end connections.

### One connection per approval

Every approval creates its own connection, with its own tokens. Connecting the same app from a second device doesn't disconnect the first. A user can hold up to 10 connections to the same app, and an eleventh ends the oldest.

A client Tape registered to keep one connection per user is the exception. There, each new sign-in replaces the user's previous connection, so store the newest tokens every time.

## Errors

### At the OAuth endpoints

The token, revocation, and registration endpoints answer errors in the standard OAuth shape. `error_description` ends with a *reason ID* in brackets. Errors from the authorization endpoint carry the same reason IDs: in the redirect's `error_description`, on Tape's error page, or in a `400` JSON body.

```json
{
  "error": "invalid_grant",
  "error_description": "The authorization code is unknown or has expired. [TOKEN_CODE_UNKNOWN]"
}
```

Quote the reason ID when you contact Tape support. It names the exact cause.

| Status | When |
| --- | --- |
| `400` | In general. |
| `401` | With `invalid_client`, when client authentication fails. |
| `429` | With `temporarily_unavailable` and a `Retry-After` header, when you are rate limited. |

The reason IDs you are most likely to meet:

| Reason ID                                                     | Meaning                                                                                                                              |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `AUTHORIZE_CLIENT_INVALID`                                    | The `client_id` is missing, unknown or revoked. Tape removes a [dynamically registered](/docs/api/oauth/clients#dynamic-client-registration) client that no user connected within 25 hours, and it lands here. Register again. |
| `AUTHORIZE_REDIRECT_URI_INVALID`                              | `redirect_uri` is missing or matches no registered URI.                                                                               |
| `AUTHORIZE_CIMD_DOCUMENT_INVALID`                             | Tape couldn't fetch your [client ID metadata document](/docs/api/oauth/clients#client-id-metadata-document), or it is invalid.         |
| `AUTHORIZE_PKCE_INVALID`                                      | No code challenge, a method other than `S256`, or a malformed challenge.                                                              |
| `AUTHORIZE_SCOPE_UNKNOWN`                                     | A requested scope doesn't exist. Check for typos, and separate scopes with single spaces.                                             |
| `AUTHORIZE_RESOURCE_INVALID`                                  | `resource` is neither `https://api.tapeapp.com/v1` nor `https://mcp.tapeapp.com/mcp`.                                                 |
| `CLIENT_AUTH_FAILED`                                          | Unknown client, wrong or missing secret, or a public client sending a secret.                                                          |
| `CLIENT_AUTH_AMBIGUOUS`                                       | More than one client authentication method in one request.                                                                            |
| `TOKEN_CODE_UNKNOWN`                                          | The code expired (after 60 seconds) or was never issued.                                                                              |
| `TOKEN_CODE_REPLAYED`                                         | The code was used before. Tape disconnected its connection.                                                                            |
| `TOKEN_CODE_BINDING_MISMATCH`                                 | The code belongs to another client, or `redirect_uri` differs from the authorization request.                                         |
| `TOKEN_PKCE_VERIFIER_PRESENCE` / `TOKEN_PKCE_VERIFIER_MISMATCH` | `code_verifier` is missing, or doesn't match the challenge.                                                                          |
| `TOKEN_CODE_REDEMPTION_REFUSED`                               | The user can no longer connect your app: deactivated, a guest, or blocked by the organization's app settings.                         |
| `TOKEN_REFRESH_TOKEN_UNKNOWN`                                 | Not a refresh token of this client.                                                                                                   |
| `TOKEN_REFRESH_GRANT_INACTIVE`                                | The connection was disconnected or expired, or the organization now blocks your app. Start a new authorization.                       |
| `TOKEN_REFRESH_SCOPE_INVALID`                                 | The refresh asked for a scope the connection doesn't hold. Nothing was used up.                                                       |
| `TOKEN_REFRESH_REPLAYED`                                      | A public client re-sent a used refresh token too late or too often. Tape disconnected the connection.                                 |

### At the developer API {#at-the-developer-api}

The API answers in its own [error format](/docs/api/errors). An access token that is no longer valid gets the same `401`, whatever the cause: expired, revoked, disconnected, or blocked by the organization.

```json
{
  "status_code": 401,
  "endpoint": "/v1/record/1",
  "error_code": "dev_api_invalid_access_token",
  "error_message": "Invalid access token for accessing endpoint '/v1/record/1' (the access token is not active)"
}
```

```http
WWW-Authenticate: Bearer resource_metadata="https://api.tapeapp.com/.well-known/oauth-protected-resource/v1", error="invalid_token", error_description="The access token is not active."
```

Refresh the access token. If the refresh fails with `invalid_grant`, start a new authorization. A missing scope is a `403`, covered under [Asking for more scopes](#asking-for-more-scopes).

## Differences from the specifications

Tape follows OAuth 2.1 and the related RFCs, with these deliberate differences:

- **One token for both Tape resources.** Every access token is valid at the Developer API and the MCP server, whichever `resource` you asked for.
- **`redirect_uri` is required** in every authorization request, even with a single registered redirect URI.
- **A missing `code_challenge_method` means `S256`**, not `plain`.
- **Revoking another client's token answers `200`** and revokes nothing. Nobody can use the endpoint to find out whose token it is.
- **Tape doesn't support `private_key_jwt`.** Tape accepts a client ID metadata document that prefers it as a public client, if the document also lists `none`. Tape ignores `jwks_uri`.
- **Tape can waive PKCE** for a confidential client it registered, on request. A code issued without PKCE requires `redirect_uri` at the token endpoint.

## Next steps

- [Register a client](/docs/api/oauth/clients): get the client ID this flow needs.
- [Integration guide](/docs/api/oauth/sign-in-with-tape): run this flow safely from your backend.
- [Capabilities](/docs/api/capabilities): pick the scopes to request in step 2.
- [Errors](/docs/api/errors): read the error format of the Developer API.
- [Request limits](/docs/api/request-limits): the budget connected apps share with the user.
- [OAuth overview](/docs/api/oauth/overview): compare OAuth with personal access tokens.
