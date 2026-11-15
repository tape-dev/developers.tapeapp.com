# Register an OAuth client

> Get an OAuth client ID for Tape. Registered by Tape for integrations, or self-registered through a client ID metadata document or dynamic client registration.

Get the client ID that every [OAuth](https://developers.tapeapp.com/docs/api/oauth/overview) app needs.

There are three ways to get a client ID:

| How | Best for | Client secret | On the consent screen |
| --- | --- | --- | --- |
| [Registered by Tape](#a-client-registered-by-tape) | Integrations and partner products | Optional | Your app's name |
| [Client ID metadata document](#client-id-metadata-document) | MCP clients and AI platforms | None, public client | Its client ID URL, or its name if Tape recognizes it |
| [Dynamic client registration](#dynamic-client-registration) | MCP clients that support it | None, public client | Its redirect host, or the badge **Unverified** |

Do you only call the API from your own code? You need no client at all. Use a [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens).

## A client registered by Tape

Email [team@tapeapp.com](mailto:team@tapeapp.com) with:

-   your app's *name*, a short description, and its website,
-   its *redirect URIs*: the exact URLs Tape may send the user back to (see [Redirect URIs](#redirect-uris)),
-   whether it has a *backend* that can keep a secret (a *confidential* client), or runs entirely on the user's device or in a browser (a *public* client),
-   for a confidential client, whether your app keeps *one* connection per Tape user. With that setting, a new sign-in replaces the user's previous connection. This is usual for a "Sign in with Tape" backend. See the [integration guide](https://developers.tapeapp.com/docs/api/oauth/sign-in-with-tape).

You receive a client ID that starts with `tape_oc_`. A confidential client also gets a client secret that starts with `tape_ocs_`.

> Tape shares the secret only once
> 
> Store the client secret in your backend's secret store. Never ship it in a browser, mobile, or desktop app.

### General behavior

-   The consent screen shows a client registered by Tape under your app's name.
-   A confidential client's connections never reach an absolute expiry. An unattended sync keeps running as long as it refreshes at least once every 90 days.

> Rotating the client secret?
> 
> When Tape rotates your client secret, the previous secret keeps working for a transition period: seven days, unless agreed otherwise. Deploy the new secret before the old one stops.

## Register a client yourself

An MCP client or AI platform can't be registered by hand for every server it talks to. Self-registration lets it connect to the [Tape MCP server](https://developers.tapeapp.com/docs/mcp/overview) without anyone setting it up first. Tape supports the two standard ways to do this.

Both create a *public* client. A public client has no secret and proves possession with [PKCE](https://developers.tapeapp.com/docs/api/oauth/authorization-flow#1-create-a-pkce-verifier-and-challenge) alone.

Tape treats a client that registers itself as an MCP client:

-   Its consent screen reads **Connect with Tape MCP**.
-   Organization owners and admins manage it under **Tape MCP** in their settings.

![Consent screen titled Connect with Tape MCP for a self-registered client, with Select organization, the scopes, Continue and Cancel](https://developers.tapeapp.com/assets/images/consent-tape-mcp-daf71db289716b866f258dc1c3f7fc7e.png)

### Client ID metadata document

With a client ID metadata document, the client ID *is* an `https` URL. That URL serves a JSON document that describes the client. Tape fetches the document the first time a user starts a sign-in, so there is no registration request at all.

*https://app.example.com/oauth/client-metadata.json*

```json
{
  "client_id": "https://app.example.com/oauth/client-metadata.json",
  "client_name": "Example Assistant",
  "client_uri": "https://app.example.com",
  "redirect_uris": ["https://app.example.com/oauth/callback", "http://127.0.0.1/callback"],
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "none"
}
```

#### Requirements

**The URL** must:

-   use `https` and have a path,
-   contain no credentials or fragment,
-   be in canonical form and at most 2048 characters long,
-   have a domain name as its host, not an IP address, and name no port.

**The document** must:

-   name the URL itself as its `client_id`,
-   list at least one `redirect_uris` entry, each one [admissible](#redirect-uris),
-   be a public client: `token_endpoint_auth_method` is `none`, or `none` appears in `token_endpoint_auth_methods_supported`,
-   include `authorization_code` in `grant_types`, if `grant_types` is present.

Tape ignores members it doesn't use.

#### How Tape fetches the document

-   Tape requests the document on port 443, follows no redirects, and waits at most 5 seconds.
-   The response must be `200 OK` with `Content-Type: application/json`, uncompressed, and at most 5 KB.
-   Tape caches a document for up to an hour, so a change can take that long to apply.

Your host is unreachable, times out, answers `5xx`, `408` or `429`, or returns something that isn't a JSON document of at most 5 KB? Tape keeps using the last good copy for up to a day.

Your host answers any other `4xx`, a redirect, or a document that breaks the rules above? Tape discards its copy. Sign-ins stop until the host serves a valid document again.

#### On the consent screen

The consent screen shows the app by its client ID URL, or by its own name if Tape recognizes it. Tape doesn't mark it **Unverified**, because the document's address shows who published it. The document's `client_name` doesn't appear.

### Dynamic client registration

A client can also register by posting its metadata to the registration endpoint. No authentication is needed.

```shell
curl https://api.tapeapp.com/oauth/register \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Example Assistant",
    "redirect_uris": ["http://127.0.0.1/callback"]
  }'
```

*Response (201 Created)*

```json
{
  "client_id": "tape_oc_8f14e45fceea167a5a36dedd4bea2543",
  "client_id_issued_at": 1791000000,
  "client_name": "Example Assistant",
  "redirect_uris": ["http://127.0.0.1/callback"],
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "none"
}
```

The response echoes what Tape *accepted*. It can differ from what you sent:

-   **Public clients only.** Tape issues no client secret and replaces any `token_endpoint_auth_method` with `none`.
-   **Redirect URIs are filtered.** Tape drops inadmissible entries and echoes the rest. The request fails with `invalid_redirect_uri` only when none remain. Send at most 10 entries and 4096 characters in total.
-   **`client_name`** is cut to 100 characters and defaults to the first redirect URI's host. Tape ignores `logo_uri`. It keeps `client_uri` only when it is an `https` URL, without credentials, on the host of one of your `https` redirect URIs.
-   **`scope` and `grant_types` never limit the client.** You choose scopes per authorization request, and Tape issues a refresh token either way. Tape drops unsupported `grant_types` values.

The request fails with `invalid_client_metadata` when:

-   `grant_types` is present without `authorization_code`,
-   `response_types` is anything other than `["code"]`,
-   the redirect URIs exceed the limits above.

#### General behavior

-   **Registration is idempotent for 24 hours.** Posting identical metadata again returns the same client ID. Every installation that registers with the same metadata shares one client ID, so treat it as public.
-   **Unused registrations expire.** Tape deletes a client that no user connected within 25 hours of registering, and eventually one whose connections have all ended. When the authorization endpoint then refuses your client ID with `AUTHORIZE_CLIENT_INVALID`, register again. A browser sees an error page, and a request that sends `Accept: application/json` gets a `400` with an `invalid_client` body.
-   **On the consent screen,** a client whose redirect URIs are all `https` on one host appears under that host. Any other self-registered client, one that returns to a loopback address or a custom URL scheme, carries the badge **Unverified**.

## Where Tape may redirect

The same rules apply to every kind of client. A redirect URI may be:

| Kind | Example | Notes |
| --- | --- | --- |
| `https` | `https://app.example.com/oauth/callback` | The usual choice for a web app. |
| Loopback `http` | `http://127.0.0.1/callback` | Only on `127.0.0.1`, `[::1]` or `localhost`. *Any port matches*, so register it without one. |
| Private-use scheme | `com.example.app:/oauth/callback` | For desktop and mobile apps. Tape refuses `javascript`, `data`, `file`, `blob` and similar schemes. |

A redirect URI must contain no credentials and no fragment, be in canonical form, and be at most 2048 characters long. The authorization request's `redirect_uri` must match a registered one *exactly*, apart from a loopback URI's port.

## Client authentication

The token and revocation endpoints identify the client in one of three ways. Use exactly one per request.

| Method | For | How |
| --- | --- | --- |
| `client_secret_basic` | Confidential client | HTTP Basic authentication, with the client ID as the username and the secret as the password. |
| `client_secret_post` | Confidential client | `client_id` and `client_secret` in the form body. |
| `none` | Public client | `client_id` in the form body. PKCE proves possession. |

### General behavior

-   A confidential client may use either secret method, regardless of which one it registered.
-   Tape refuses a secret sent both ways, or a body `client_id` that differs from the Basic username, with `invalid_request`.
-   Tape treats a public client that sends Basic authentication with an empty password as `none`.

## Next steps

[

Authorization flow

use your client ID to connect a user.

](https://developers.tapeapp.com/docs/api/oauth/authorization-flow)[

Integration guide

set up a confidential client for a "Sign in with Tape" backend.

](https://developers.tapeapp.com/docs/api/oauth/sign-in-with-tape)[

Connect to Tape MCP

how MCP clients connect with a self-registered client.

](https://developers.tapeapp.com/docs/mcp/connect)[

OAuth overview

find every endpoint and credential format.

](https://developers.tapeapp.com/docs/api/oauth/overview)[

Personal access tokens

call the API from your own code without a client.

](https://developers.tapeapp.com/docs/api/personal-access-tokens)
