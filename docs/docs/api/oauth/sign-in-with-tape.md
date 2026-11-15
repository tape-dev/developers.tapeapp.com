# Build a Tape integration with OAuth

> Connect each of your product's users to their Tape account from your backend, with a "Sign in with Tape" button or a sync, and keep the connection healthy.

Connect each of your product's users to their own Tape account from your backend.

This guide is for integrations and partners registered by Tape. It covers a product with a *backend*, such as a "Sign in with Tape" button, a sync, or any integration that keeps working while the user is away. It builds on [the authorization flow](https://developers.tapeapp.com/docs/api/oauth/authorization-flow).

Do you call the API directly from your own code, including on a user's behalf? You don't need any of this. Use a [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens).

## Step 1: Request a client

Ask Tape for a [confidential client](https://developers.tapeapp.com/docs/api/oauth/clients#a-client-registered-by-tape) with exact `https` redirect URIs.

Mention whether your app keeps *one* connection per Tape user. With that setting, a new sign-in replaces that Tape user's previous connection, even when it comes from a different account in your product. Two of your accounts linked to the same Tape user can't both stay connected.

A confidential client registered by Tape has no yearly reconnect. Its connections last as long as you refresh them at least once every 90 days.

## Step 2: Start the sign-in

Start every sign-in from an endpoint on your backend:

1.  Create a fresh `state` and PKCE `code_verifier`. Use PKCE even though your client has a secret.
2.  Store both in a short-lived, `HttpOnly`, `Secure` cookie, set on the user's browser by this endpoint.
3.  Redirect the browser to the [authorization endpoint](https://developers.tapeapp.com/docs/api/oauth/authorization-flow#2-send-the-user-to-tape), and request every scope your integration needs.

Tape shows the consent screen on every sign-in, including when the user already approved your app.

> Bind the sign-in to the browser, not to `state`
> 
> On the callback, read `state` and the verifier from the cookie, and compare. Never look up a pending sign-in by the `state` value alone. Otherwise an attacker can have their own sign-in completed in a victim's browser, which links the *victim's* Tape account to the attacker's account in your product.

## Step 3: Handle the callback

1.  Check `state` against the cookie, and `iss` against `https://api.tapeapp.com`.
2.  Exchange the code *once*. [Never retry a code exchange](https://developers.tapeapp.com/docs/api/oauth/authorization-flow#5-exchange-the-code-for-tokens): a code presented twice disconnects the connection it created.
3.  **Key the account on `tape_user_id`** from the token response, and store `tape_organization_id` beside it. A person who belongs to two Tape organizations is two Tape users, with two IDs.
4.  Read `scope` from the token response to learn what the user granted.
5.  **Overwrite the stored token pair on every sign-in.** If your client keeps one connection per user, the new sign-in replaced the old connection, and the old tokens stop working.

Need the user's name, email, or organization name? Call [`GET /v1/user`](https://developers.tapeapp.com/docs/api/resource/user#retrieve-the-current-user) with the new access token.

## Step 4: Keep the connection alive

-   **Refresh when the access token expires,** or when the API answers `401`. A confidential client keeps the refresh token from the code exchange for the whole connection. Refresh responses contain no new refresh token, so don't overwrite the stored one with an empty value.
-   **Refresh at least once every 90 days,** or the connection expires.
-   **On `invalid_grant`, re-read before giving up.** Another sign-in may have replaced the stored tokens while your refresh was in flight. Re-read the stored pair, and retry once if it changed. Only when Tape refuses the current pair, mark the account as disconnected and ask the user to sign in again.

## Step 5: Let the user disconnect

When the user disconnects Tape in your product, [revoke the refresh token](https://developers.tapeapp.com/docs/api/oauth/authorization-flow#disconnecting). That ends the connection in Tape as well, instead of leaving it to expire.

Users can also disconnect your app in Tape, under **Preferences** → **Connections**. Your next refresh then fails with `invalid_grant`.

## Libraries

Tape is an OAuth 2.1 authorization server, not an OpenID Connect provider. It publishes an [OAuth metadata document](https://developers.tapeapp.com/docs/api/oauth/overview#endpoints) but no OpenID configuration, and issues no ID token. Configure libraries for plain OAuth.

### Auth.js (`NextAuth`)

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

-   **Set `issuer`.** Tape sends `iss` on the callback. Without a configured issuer, the check fails.
-   **Store the tokens on every sign-in.** Auth.js doesn't update a stored account when the same user signs in again. Write the new token pair in the `events.signIn` callback.
-   **NextAuth v4 with the Prisma adapter** writes every field of the token response to the account. Add `tape_user_id Int?` and `tape_organization_id Int?` to the `Account` model, or the first sign-in fails.
-   **Auth.js v5** stores only the standard token fields. To keep the Tape IDs, add the same two columns and return them from the provider's `account(tokens)` callback. Return the standard fields there too (`access_token`, `refresh_token`, `expires_at`, `scope`, `token_type`), because that callback replaces the default one.
-   **For a public client**, set `client: { token_endpoint_auth_method: 'none' }`.

### `openid-client`

Discover the server as OAuth, not as OpenID Connect:

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

### `requests-oauthlib` (Python)

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

-   **Set `OAUTHLIB_RELAX_TOKEN_SCOPE`.** requests-oauthlib raises an error when the granted scopes differ from the requested ones, for example when Tape ignores a requested `offline_access`. It checks again on every refresh.
-   **Create the PKCE verifier yourself.** The session's `pkce=` option keeps the verifier only on the session object that built the authorization URL. A callback handled in a separate request can't use it.
-   **Authenticate on refresh.** `refresh_token()` sends no client credentials by default. Pass `auth=(client_id, client_secret)` for a confidential client, or `client_id=client_id` for a public one. You can also set them once in `auto_refresh_kwargs`.
-   **For a public client**, pass `include_client_id=True` to `fetch_token`.

### `Spring Security`

When a refresh fails with `invalid_grant`, the default failure handler of Spring Security removes the stored authorized client. That may be the newer one another sign-in stored a moment ago. Call `OAuth2AuthorizedClientManager.authorize()` without a pre-loaded authorized client, so it reads the current tokens before giving up.

## Next steps

[

Authorization flow

look up every request and reason ID behind these steps.

](https://developers.tapeapp.com/docs/api/oauth/authorization-flow)[

Register a client

send Tape the details for your confidential client.

](https://developers.tapeapp.com/docs/api/oauth/clients#a-client-registered-by-tape)[

Capabilities

choose the scopes your integration requests.

](https://developers.tapeapp.com/docs/api/capabilities)[

User

get the name and email of a connected user.

](https://developers.tapeapp.com/docs/api/resource/user#retrieve-the-current-user)[

Request limits

plan a sync within the user's per-user budget.

](https://developers.tapeapp.com/docs/api/request-limits)
