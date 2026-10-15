---
id: authorization-flow
title: The OAuth Authorization Flow
sidebar_label: Authorization Flow
description: Connect a user's Tape account step by step — PKCE, the authorization request, consent, the code exchange, refreshing, step-up, disconnecting and errors.
---

This page walks through connecting one user's Tape account to your app, using the authorization-code flow with PKCE — the only flow Tape supports. You need a [client ID](/docs/api/oauth/clients) first. Most OAuth client libraries implement every step below; point yours at Tape's [metadata document](/docs/api/oauth/overview#endpoints) and it will find the endpoints itself.

## 1. Create a PKCE verifier and challenge

For every authorization, create a fresh random **code verifier** and derive its **code challenge**: `BASE64URL(SHA256(code_verifier))`, without padding. Keep the verifier on your side — in your backend session, or in the app's memory — until the code exchange.

```shell
code_verifier=$(openssl rand -base64 48 | tr '+/' '-_' | tr -d '=\n')
code_challenge=$(printf '%s' "$code_verifier" | openssl dgst -sha256 -binary | openssl base64 | tr '+/' '-_' | tr -d '=\n')
```

The verifier must be 43 to 128 characters from `A–Z`, `a–z`, `0–9` and `-._~`. The challenge is always 43 characters.

## 2. Send the user to Tape

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

| Parameter               | Required    | Value                                                                                                                                  |
| ----------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `response_type`         | Yes         | `code`                                                                                                                                 |
| `client_id`             | Yes         | Your client ID                                                                                                                         |
| `redirect_uri`          | Yes         | One of your registered [redirect URIs](/docs/api/oauth/clients#redirect-uris). Always required, even if you registered only one       |
| `code_challenge`        | Yes         | The challenge from step 1                                                                                                               |
| `code_challenge_method` | Recommended | `S256`. If omitted, `S256` is assumed; `plain` is refused                                                                              |
| `state`                 | Recommended | An unguessable value bound to the user's browser session. Tape returns it unchanged; check it on the way back to prevent CSRF          |
| `scope`                 | No          | Space-separated [scopes](/docs/api/capabilities#requesting-scopes-with-oauth). Defaults to `apps:read records:read`                    |
| `resource`              | No          | `https://api.tapeapp.com/v1` or `https://mcp.tapeapp.com/mcp`, and may repeat. Accepted for compatibility; the token works at both either way |

Other parameters, such as `nonce`, are ignored.

## 3. The user approves

Tape asks the user to sign in if needed and to choose which organization to connect. The consent screen then shows:

- your app's name — or, for a [self-registered](/docs/api/oauth/clients#register-a-client-yourself) client, its client ID URL or redirect host. A client Tape cannot tie to a website, such as one that returns to a loopback address or a custom URL scheme, is marked **Unverified**,
- what your app will be able to do, one line per scope you requested.

The user approves **all** the requested scopes or declines. An authorization request expires if it is not decided within 10 minutes.

Some users cannot approve:

- **Organization guests** cannot connect apps.
- **An organization can restrict apps.** Admins can allow only approved apps for new connections, or limit an app to admins and owners. A member it blocks is told why on the consent screen and can ask an admin.

## 4. Handle the callback

Tape redirects the browser to your `redirect_uri`:

```text
https://app.example.com/oauth/callback
  ?code=tape_oac_4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a
  &state=af0ifjsldkj
  &iss=https%3A%2F%2Fapi.tapeapp.com
```

Before using the code, check that `state` is the value you sent and that `iss` is `https://api.tapeapp.com`.

If the user declines, you receive `access_denied`:

```text
https://app.example.com/oauth/callback
  ?error=access_denied
  &state=af0ifjsldkj
  &iss=https%3A%2F%2Fapi.tapeapp.com
```

If the request is invalid in another way — an unknown scope, a malformed PKCE challenge or an unsupported `resource`, say — Tape still asks the user to sign in, then shows an error page with the reason ID. The error reaches your `redirect_uri` when the user clicks **Return to app**, with `error` set to `invalid_request`, `invalid_scope`, `invalid_target` or `unsupported_response_type`, and an `error_description` that ends in the reason ID.

When the `client_id` or `redirect_uri` itself cannot be trusted — unknown, revoked, or not registered — Tape does **not** redirect. The user sees an error page instead, and a request that prefers `application/json` gets a `400` with an `invalid_client` body.

## 5. Exchange the code for tokens

Within **60 seconds**, post the code to the token endpoint:

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

`redirect_uri` is optional here, but when you send it, it must equal the value from step 2 exactly.

```json title="⬅️      Response"
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

| Field                  | Meaning                                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `access_token`         | Send it as `Authorization: Bearer` to the API                                                                                                             |
| `expires_in`           | Seconds until the access token expires — at most 3600                                                                                                     |
| `refresh_token`        | Gets new access tokens. Store it securely, server-side where you can                                                                                      |
| `scope`                | The scopes **this access token** holds. Read it rather than assuming your request was granted as sent                                                     |
| `tape_user_id`         | The connected Tape user. Key your accounts on it: a person who belongs to two Tape organizations is two Tape users                                         |
| `tape_organization_id` | The organization the user chose on the consent screen                                                                                                     |

:::danger Never retry a code exchange
A code is single use, and Tape treats a code presented twice as stolen — even if the second attempt is your own retry after a timeout. Tape then **disconnects** the connection the code created and answers `invalid_grant`. If an exchange fails, start a new authorization instead.
:::

## 6. Call the API

```shell
curl https://api.tapeapp.com/v1/user \
  -H "Authorization: Bearer tape_oat_9a3f..."
```

The token acts as the connected user, limited to the approved scopes, and works at the [Developer API](/docs/api/introduction) and the [Tape MCP server](/docs/mcp/overview) alike. [`GET /v1/user`](/docs/api/resource/user#retrieve-the-current-user) needs no scope and reports the token's scopes in its response.

## Refreshing an access token

An access token lasts one hour. Get a new one with the refresh token:

```shell
curl https://api.tapeapp.com/oauth/token \
  -u "tape_oc_8f14e45fceea167a5a36dedd4bea2543:tape_ocs_..." \
  -d grant_type=refresh_token \
  -d refresh_token=tape_ort_3f9a...
```

What happens to the refresh token depends on your client type:

- **Public clients rotate.** Every refresh returns a new refresh token and uses up the one you sent. **Always store the new one.** Re-sending a used refresh token within 30 seconds — a retry after a timeout, say — returns a fresh pair, up to three times. Re-sending it later, or a fourth time, is treated as theft: Tape disconnects the connection, for every device holding it, and the user has to connect again.
- **Confidential clients keep theirs.** The refresh token from the code exchange stays valid for the life of the connection. A refresh returns only a new access token, without `refresh_token`, and concurrent refreshes are fine.

You may send `scope` to get an access token with **fewer** scopes than the connection holds. It never adds scopes: a `scope` outside the connection fails with `invalid_scope` and leaves the refresh token usable.

Every refresh keeps the connection alive. A connection that gets no new token for **90 days** expires. Unless Tape registered your client as a confidential one, a connection also ends **365 days** after the user approved it, however active it is. When a refresh fails with `invalid_grant`, the connection is gone: send the user through the authorization flow again.

## Asking for more scopes

If your app calls an endpoint that needs a scope the token lacks, the API answers `403` with:

```http
WWW-Authenticate: Bearer error="insufficient_scope", error_description="This OAuth access token is missing the required scope(s): records:edit.", scope="records:edit"
```

To get the missing scope, send the user through the authorization flow again with `scope` set to the scopes you **already hold plus the missing one**. The user approves the new set, and you get a new connection with exactly those scopes. Asking for the missing scope alone would leave you with only that scope.

The new approval does not end the earlier connection. Once you have stored the new tokens, [revoke](#disconnecting) the old refresh token so the user is not left with an unused connection.

Asking for everything you need up front avoids sending the user back to the consent screen. See [Insufficient capabilities](/docs/api/capabilities#insufficient-capabilities).

## Disconnecting

To disconnect, revoke the **refresh token**:

```shell
curl https://api.tapeapp.com/oauth/revoke \
  -u "tape_oc_8f14e45fceea167a5a36dedd4bea2543:tape_ocs_..." \
  -d token=tape_ort_3f9a... \
  -d token_type_hint=refresh_token
```

- **A refresh token** ends the whole connection, and every access token issued for it stops working on the next request.
- **An access token** revokes only that one access token. The connection keeps working.
- Once your client has authenticated and sent a `token`, the endpoint answers `200` with an empty body — including for a token that is unknown, already revoked or not your client's.

A connection also ends when:

- the user disconnects your app in Tape, or an organization admin disconnects it for them or for everyone,
- the user is deactivated or removed from the organization, or becomes a guest,
- an organization admin blocks your app for the user — for example by restricting it to admins and owners,
- it expires, as described under [Refreshing](#refreshing-an-access-token).

Changing a password does not end connections.

### One connection per approval

Every approval creates its own connection, with its own tokens. Connecting the same app from a second device does not disconnect the first, and a user can hold up to **10** connections to the same app — an eleventh ends the oldest. A client Tape registered to keep one connection per user is the exception: there, each new sign-in replaces the user's previous connection, so store the newest tokens every time.

## Errors

### At the OAuth endpoints

The token, revocation and registration endpoints answer errors in the standard OAuth shape. `error_description` ends with a **reason ID** in brackets. Errors from the authorization endpoint carry the same reason IDs — in the redirect's `error_description`, on Tape's error page, or in a `400` JSON body:

```json
{
  "error": "invalid_grant",
  "error_description": "The authorization code is unknown or has expired. [TOKEN_CODE_UNKNOWN]"
}
```

Quote the reason ID when you contact Tape support — it names the exact cause. Status codes: `400` in general, `401` with `invalid_client` when client authentication fails, and `429` with `temporarily_unavailable` and a `Retry-After` header when you are rate limited.

The reason IDs you are most likely to meet:

| Reason ID                                                     | Meaning                                                                                                                              |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `AUTHORIZE_CLIENT_INVALID`                                    | The `client_id` is missing, unknown or revoked. A [dynamically registered](/docs/api/oauth/clients#dynamic-client-registration) client that no user connected within 25 hours is removed and lands here — register again |
| `AUTHORIZE_REDIRECT_URI_INVALID`                              | `redirect_uri` is missing or matches no registered URI                                                                               |
| `AUTHORIZE_CIMD_DOCUMENT_INVALID`                             | Tape could not fetch your [client ID metadata document](/docs/api/oauth/clients#client-id-metadata-document), or it is invalid        |
| `AUTHORIZE_PKCE_INVALID`                                      | No code challenge, a method other than `S256`, or a malformed challenge                                                              |
| `AUTHORIZE_SCOPE_UNKNOWN`                                     | A requested scope does not exist — check for typos, and separate scopes with single spaces                                           |
| `AUTHORIZE_RESOURCE_INVALID`                                  | `resource` is neither `https://api.tapeapp.com/v1` nor `https://mcp.tapeapp.com/mcp`                                                 |
| `CLIENT_AUTH_FAILED`                                          | Unknown client, wrong or missing secret, or a public client sending a secret                                                          |
| `CLIENT_AUTH_AMBIGUOUS`                                       | More than one client authentication method in one request                                                                            |
| `TOKEN_CODE_UNKNOWN`                                          | The code expired (after 60 seconds) or was never issued                                                                              |
| `TOKEN_CODE_REPLAYED`                                         | The code was used before. Its connection has been disconnected                                                                        |
| `TOKEN_CODE_BINDING_MISMATCH`                                 | The code belongs to another client, or `redirect_uri` differs from the authorization request                                         |
| `TOKEN_PKCE_VERIFIER_PRESENCE` / `TOKEN_PKCE_VERIFIER_MISMATCH` | `code_verifier` is missing, or does not match the challenge                                                                         |
| `TOKEN_CODE_REDEMPTION_REFUSED`                               | The user can no longer connect your app — deactivated, a guest, or blocked by the organization's app settings                        |
| `TOKEN_REFRESH_TOKEN_UNKNOWN`                                 | Not a refresh token of this client                                                                                                   |
| `TOKEN_REFRESH_GRANT_INACTIVE`                                | The connection was disconnected or expired, or the organization now blocks your app. Start a new authorization                       |
| `TOKEN_REFRESH_SCOPE_INVALID`                                 | The refresh asked for a scope the connection does not hold. Nothing was consumed                                                     |
| `TOKEN_REFRESH_REPLAYED`                                      | A public client re-sent a used refresh token too late or too often. The connection has been disconnected                             |

### At the Developer API

The API answers in its own [error format](/docs/api/errors). An access token that is no longer valid — expired, revoked, disconnected, or blocked by the organization — gets the same `401` whatever the cause:

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

Refresh the access token; if the refresh fails with `invalid_grant`, start a new authorization. A missing scope is a `403`, covered under [Asking for more scopes](#asking-for-more-scopes).

## Differences from the specifications

Tape follows OAuth 2.1 and the related RFCs, with these deliberate differences:

- **One token for both Tape resources.** Every access token is valid at the Developer API and the MCP server, whichever `resource` you asked for.
- **`redirect_uri` is always required** in the authorization request, even with a single registered redirect URI.
- **A missing `code_challenge_method` means `S256`**, not `plain`.
- **Revoking another client's token answers `200`** and revokes nothing, so the endpoint cannot be used to find out whose token it is.
- **`private_key_jwt` is not supported.** A client ID metadata document that prefers it is accepted as a public client if it also lists `none`; `jwks_uri` is ignored.
- **PKCE can be waived** for a confidential client registered by Tape, on request. A code issued without PKCE requires `redirect_uri` at the token endpoint.
