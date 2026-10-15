---
id: sign-in-with-tape
title: Build a Tape Integration with OAuth
sidebar_label: Integration Guide
description: Connect each of your product's users to their Tape account from your backend — a "Sign in with Tape" button or a sync — and keep the connection healthy.
---

This guide is for integrations and partners registered by Tape: a product with a **backend** that connects each of its users to their own Tape account — a "Sign in with Tape" button, a sync, or any integration that keeps working while the user is away. It builds on [the authorization flow](/docs/api/oauth/authorization-flow) and covers what such an integration has to get right.

If you are calling the API directly from your own code, including on a user's behalf, you do not need any of this — use a [personal access token](/docs/api/personal-access-tokens).

## 1. Request a client

Ask Tape for a [confidential client](/docs/api/oauth/clients#a-client-registered-by-tape) with exact `https` redirect URIs. Mention whether your app should keep **one** connection per Tape user. With that setting, a new sign-in replaces that Tape user's previous connection to your app instead of adding a second one — also when the new sign-in comes from a different account in your product, so two of your accounts linked to the same Tape user cannot both stay connected.

A confidential client registered by Tape has no yearly reconnect: its connections last as long as you refresh them at least once every 90 days.

## 2. Start the sign-in

Start every sign-in from an endpoint on your backend:

1. Create a fresh `state` and PKCE `code_verifier`. Use PKCE even though your client has a secret.
2. Store both in a short-lived, `HttpOnly`, `Secure` cookie, set on the user's browser by this endpoint.
3. Redirect the browser to the [authorization endpoint](/docs/api/oauth/authorization-flow#2-send-the-user-to-tape), requesting every scope your integration needs.

Tape shows the consent screen on every sign-in, including when the user already approved your app.

:::caution Bind the sign-in to the browser, not to `state`
On the callback, read `state` and the verifier from the cookie, and compare. Never look up a pending sign-in by the `state` value alone: an attacker could then start a sign-in in their own browser and have it completed in a victim's browser, linking the **victim's** Tape account to the attacker's account in your product — and giving the attacker access to the victim's Tape data.
:::

## 3. Handle the callback

1. Check `state` against the cookie, and `iss` against `https://api.tapeapp.com`.
2. Exchange the code **once**. [Never retry a code exchange](/docs/api/oauth/authorization-flow#5-exchange-the-code-for-tokens): a code presented twice disconnects the connection it created.
3. **Key the account on `tape_user_id`** from the token response, and store `tape_organization_id` beside it. A person who belongs to two Tape organizations is two Tape users, with two IDs.
4. Read `scope` from the token response to learn what was granted.
5. **Overwrite the stored token pair on every sign-in.** If your client keeps one connection per user, the new sign-in has just replaced the old connection, and the old tokens stop working.

[`GET /v1/user`](/docs/api/resource/user#retrieve-the-current-user) with the new access token returns the user's name, email and organization name, if you need them.

## 4. Keep the connection alive

- **Refresh when the access token expires,** or when the API answers `401`. A confidential client keeps the refresh token from the code exchange for the whole connection: refresh responses contain no new refresh token, so do not overwrite the stored one with an empty value.
- **Refresh at least once every 90 days,** or the connection expires.
- **On `invalid_grant`, re-read before giving up.** Another sign-in may have replaced the stored tokens while your refresh was in flight. Re-read the stored pair and retry once if it changed. Only when the current pair is refused, mark the account as disconnected and ask the user to sign in again.

## 5. Let the user disconnect

When the user disconnects Tape in your product, [revoke the refresh token](/docs/api/oauth/authorization-flow#disconnecting). That ends the connection in Tape as well, rather than leaving it to expire.

## Libraries

Tape is an OAuth 2.1 authorization server, not an OpenID Connect provider: it publishes an [OAuth metadata document](/docs/api/oauth/overview#endpoints) but no OpenID configuration, and issues no ID token. Configure libraries for plain OAuth.

### Auth.js (NextAuth)

```js
{
  id: 'tape',
  name: 'Tape',
  type: 'oauth',
  issuer: 'https://api.tapeapp.com',
  clientId: process.env.TAPE_CLIENT_ID,
  clientSecret: process.env.TAPE_CLIENT_SECRET,
  authorization: {
    url: 'https://api.tapeapp.com/oauth/authorize',
    params: { scope: 'apps:read records:read records:edit' },
  },
  token: 'https://api.tapeapp.com/oauth/token',
  userinfo: 'https://api.tapeapp.com/v1/user',
  checks: ['pkce', 'state'],
  profile(profile) {
    return { id: String(profile.user_id), name: profile.name, email: profile.email };
  },
}
```

- **Set `issuer`.** Tape sends `iss` on the callback, and without a configured issuer the check fails.
- **Store the tokens on every sign-in.** Auth.js does not update a stored account when the same user signs in again. Write the new token pair in the `events.signIn` callback.
- **NextAuth v4 with the Prisma adapter** writes every field of the token response to the account: add `tape_user_id Int?` and `tape_organization_id Int?` to the `Account` model, or the first sign-in fails.
- **Auth.js v5** stores only the standard token fields. To keep the Tape IDs, add the same two columns and return them from the provider's `account(tokens)` callback, together with the standard fields (`access_token`, `refresh_token`, `expires_at`, `scope`, `token_type`), since that callback replaces the default one.
- **For a public client**, set `client: { token_endpoint_auth_method: 'none' }`.

### openid-client

Discover the server as OAuth rather than OpenID Connect:

```js
import * as client from 'openid-client';

const config = await client.discovery(
  new URL('https://api.tapeapp.com'),
  process.env.TAPE_CLIENT_ID,
  process.env.TAPE_CLIENT_SECRET,
  undefined,
  { algorithm: 'oauth2' },
);
```

### requests-oauthlib (Python)

```python
import base64, hashlib, os, secrets
from requests_oauthlib import OAuth2Session

os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'

def tape_session(state=None):
    return OAuth2Session(
        client_id,
        redirect_uri='https://app.example.com/oauth/callback',
        scope=['apps:read', 'records:read', 'records:edit'],
        state=state,
    )

# Start the sign-in
verifier = secrets.token_urlsafe(64)
challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b'=').decode()
url, state = tape_session().authorization_url(
    'https://api.tapeapp.com/oauth/authorize',
    code_challenge=challenge,
    code_challenge_method='S256',
)
# Store state and verifier in the cookie, then redirect the browser to url.

# On the callback, after checking state and iss:
token = tape_session(state=state_from_cookie).fetch_token(
    'https://api.tapeapp.com/oauth/token',
    authorization_response=callback_url,
    code_verifier=verifier_from_cookie,
    client_secret=client_secret,
)
```

- **Set `OAUTHLIB_RELAX_TOKEN_SCOPE`.** requests-oauthlib raises an error when the granted scopes differ from the requested ones — for example when Tape ignores a requested `offline_access` — and it checks again on every refresh.
- **Create the PKCE verifier yourself.** The session's `pkce=` option keeps the verifier only on the session object that built the authorization URL, so a callback handled in a separate request cannot use it.
- **Authenticate on refresh.** `refresh_token()` sends no client credentials by default: pass `auth=(client_id, client_secret)` for a confidential client, or `client_id=client_id` for a public one — or set them once in `auto_refresh_kwargs`.
- **For a public client**, pass `include_client_id=True` to `fetch_token`.

### Spring Security

When a refresh fails with `invalid_grant`, Spring Security's default failure handler removes the stored authorized client — which may be the newer one another sign-in just stored. Call `OAuth2AuthorizedClientManager.authorize()` without a pre-loaded authorized client, so it reads the current tokens before giving up.
