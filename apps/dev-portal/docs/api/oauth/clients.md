---
id: clients
title: Register an OAuth Client
sidebar_label: Register a Client
description: Get an OAuth client ID for Tape — registered by Tape for integrations, or self-registered through a client ID metadata document or dynamic client registration.
---

Every app that uses [OAuth](/docs/api/oauth/overview) needs a **client ID**. There are three ways to get one:

| How                                                                        | Best for                                                            | Client secret            | On the consent screen                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------ | -------------------------------------- |
| [Registered by Tape](#a-client-registered-by-tape)                         | Integrations and partner products                                   | Optional                 | Your app's name                                                        |
| [Client ID metadata document](#client-id-metadata-document)                | MCP clients and AI platforms                                        | None — public client     | Its client ID URL, or its name if Tape recognizes it                   |
| [Dynamic client registration](#dynamic-client-registration)                | MCP clients that support it                                         | None — public client     | Its redirect host, or marked **Unverified** — see [below](#dynamic-client-registration) |

If you are building an integration or partner product, ask Tape to register it. Self-registration exists so that MCP clients can connect to the [Tape MCP server](/docs/mcp/overview) without anyone setting them up first: a client that registers itself is always treated as an MCP client — its consent screen reads **Connect with Tape MCP**, and organization admins manage it in their Tape MCP settings. If you only need to call the API from your own code, you need no client at all — use a [personal access token](/docs/api/personal-access-tokens).

## A client registered by Tape

Email [team@tapeapp.com](mailto:team@tapeapp.com) with:

- your app's **name**, a short description and its website,
- its **redirect URIs** — the exact URLs Tape may send the user back to (see [Redirect URIs](#redirect-uris)),
- whether it has a **backend** that can keep a secret (a _confidential_ client), or runs entirely on the user's device or in a browser (a _public_ client),
- for a confidential client, whether your app should keep **one** connection per Tape user, so that a new sign-in replaces that user's previous connection — usual for a "Sign in with Tape" backend. See the [integration guide](/docs/api/oauth/sign-in-with-tape).

You receive a client ID starting with `tape_oc_` and, for a confidential client, a client secret starting with `tape_ocs_`. The secret is shared with you **once**: store it in your backend's secret store, and never ship it in a browser, mobile or desktop app.

On the consent screen, a client registered by Tape is shown under your app's name. A confidential one also gets connections that never reach an absolute expiry, so an unattended sync keeps running for as long as it refreshes at least once every 90 days.

:::tip Secret rotation without downtime
When Tape rotates your client secret, the previous secret keeps working for a transition period — seven days unless agreed otherwise — so you can deploy the new one before the old one stops.
:::

## Register a client yourself

An MCP client or AI platform usually cannot be registered by hand for every server it talks to. Tape supports the two standard ways for such a client to register itself. Both create a **public** client: it has no secret and proves possession with [PKCE](/docs/api/oauth/authorization-flow#1-create-a-pkce-verifier-and-challenge) alone.

### Client ID metadata document

With a client ID metadata document, the client ID **is** an `https` URL, and that URL serves a JSON document describing the client. Tape fetches the document the first time a user starts a sign-in, so there is no registration request at all.

```json title="https://app.example.com/oauth/client-metadata.json"
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

**The URL** must use `https`, have a path, contain no credentials or fragment, be in canonical form and be at most 2048 characters long. Its host must be a domain name, not an IP address, and the URL must not name a port.

**The document** must:

- name the URL itself as its `client_id`,
- list at least one `redirect_uris` entry, each one [admissible](#redirect-uris),
- be a public client: `token_endpoint_auth_method` is `none`, or `none` appears in `token_endpoint_auth_methods_supported`,
- include `authorization_code` in `grant_types`, if `grant_types` is present.

Members Tape does not use are ignored.

**Fetching.** Tape requests the document on port 443, follows no redirects and waits at most 5 seconds. The response must be `200 OK` with `Content-Type: application/json`, uncompressed, and at most 5 KB. A document is cached for up to an hour, so a change can take that long to apply.

If your host is unreachable, times out, answers `5xx`, `408` or `429`, or returns something that is not a JSON document of at most 5 KB, Tape keeps using the last good copy for up to a day. If it answers any other `4xx`, a redirect, or a document that breaks the rules above, Tape discards its copy, and sign-ins stop until the host serves a valid document again.

On the consent screen, the app is shown by its client ID URL — or by its own name, if Tape recognizes it — and is not marked **Unverified**, because the document's address shows who published it. The document's `client_name` is not shown.

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

```json title="⬅️      Response (201 Created)"
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

The response echoes what Tape **accepted**, which can differ from what you sent:

- **Public clients only.** No client secret is issued, and any `token_endpoint_auth_method` is replaced by `none`.
- **Redirect URIs are filtered.** Inadmissible entries are dropped and the rest echoed; the request fails with `invalid_redirect_uri` only when none remain. Send at most 10 entries and 4096 characters in total.
- **`client_name`** is cut to 100 characters, and defaults to the first redirect URI's host. `logo_uri` is ignored, and `client_uri` is kept only when it is an `https` URL, without credentials, on the host of one of your `https` redirect URIs.
- **`scope` and `grant_types` never limit the client.** Scopes are chosen per authorization request, and a refresh token is issued either way. Unsupported `grant_types` values are dropped.

The request fails with `invalid_client_metadata` when `grant_types` is present without `authorization_code`, when `response_types` is anything other than `["code"]`, or when the redirect URIs exceed the limits above.

**Registration is idempotent for 24 hours.** Posting identical metadata again returns the same client ID, so every installation that registers with the same metadata shares one client ID. Treat it as public.

**Unused registrations expire.** A client that no user has connected within 25 hours of registering is deleted, and so, eventually, is one whose connections have all ended. If the authorization endpoint then refuses your client ID with `AUTHORIZE_CLIENT_INVALID`, register again. A browser sees an error page; a request that sends `Accept: application/json` gets a `400` with an `invalid_client` body.

**On the consent screen**, a client whose redirect URIs are all `https` on one host is shown by that host. Any other self-registered client — one that returns to a loopback address or a custom URL scheme — is marked **Unverified**.

## Redirect URIs

The same rules apply to every kind of client. A redirect URI may be:

| Kind                          | Example                                    | Notes                                                                                                   |
| ----------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `https`                       | `https://app.example.com/oauth/callback`   | The usual choice for a web app                                                                          |
| Loopback `http`               | `http://127.0.0.1/callback`                | Only on `127.0.0.1`, `[::1]` or `localhost`. **Any port matches**, so register it without one           |
| Private-use scheme            | `com.example.app:/oauth/callback`          | For desktop and mobile apps. `javascript`, `data`, `file`, `blob` and similar schemes are refused       |

A redirect URI must contain no credentials and no fragment, be in canonical form, and be at most 2048 characters long. The authorization request's `redirect_uri` must match a registered one **exactly** — apart from a loopback URI's port.

## Client authentication

The token and revocation endpoints identify the client in one of three ways. Use exactly one per request.

| Method                | For                 | How                                                                                       |
| --------------------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `client_secret_basic` | Confidential client | HTTP Basic authentication, with the client ID as the username and the secret as the password |
| `client_secret_post`  | Confidential client | `client_id` and `client_secret` in the form body                                          |
| `none`                | Public client       | `client_id` in the form body; possession is proven with PKCE                             |

A confidential client may use either secret method, regardless of which one it registered. Sending a secret both ways, or a body `client_id` that differs from the Basic username, is refused with `invalid_request`. A public client that sends Basic authentication with an empty password is treated as `none`.
