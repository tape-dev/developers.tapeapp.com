# Capabilities and scopes

> The 17 capabilities a personal access token or an OAuth access token can hold, how they are requested, and how Tape enforces them.

Grant a credential only the capabilities it needs.

A *capability* is one thing a credential may do, such as reading records or sending email. Two kinds of credential carry capabilities, and Tape checks every request they make against them:

| Credential | Who decides its capabilities | When they are set |
| --- | --- | --- |
| [Personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens) | You, when you create the token | At creation, and never change |
| [OAuth access token](https://developers.tapeapp.com/docs/api/oauth/overview) | The app requests them; the user approves or declines on Tape's consent screen | At approval, and never widen |

A [user API key](https://developers.tapeapp.com/docs/api/authentication#user-api-key) carries no capabilities, and Tape never checks it against them.

> Capabilities or scopes?
> 
> Tape's settings call them *capabilities*, and the consent screen lists them as what an app can do. In the protocol they're called *scopes*: in OAuth's `scope` parameter, in token responses and in error messages. Scopes use the form `resource:action`, for example `records:read`.

## Capabilities only ever subtract

A credential acts as the user it belongs to. Its effective access is that user's own permissions, narrowed by its capabilities:

| Axis | Question it answers | Personal access token | OAuth access token |
| --- | --- | --- | --- |
| **The user's own role** | What may this person do anyway? | Applies | Applies |
| **Capabilities** | What kind of action? | Chosen at creation | Approved at consent |
| **Content access** | Which workspaces and apps? | All, or only the ones you [select](https://developers.tapeapp.com/docs/api/personal-access-tokens#content-selection) | Everything the user can reach |

A capability never gives a credential access to something its user can't reach. When the user loses access to a workspace, every credential they own loses it too.

## The capabilities

| Area | Capability | Scope | What it allows |
| --- | --- | --- | --- |
| **Organization** | Read organization | `organization:read` | View your organization and its members, including their names, email addresses and phone numbers. |
|  | Manage members | `organization.members:manage` | Invite people to your organization and manage invitations. Invitations can take up paid seats. |
| **Workspaces** | Read workspaces | `workspaces:read` | View workspaces and their members. |
|  | Edit workspaces | `workspaces:edit` | Create, rename and delete workspaces. Deleting a workspace also deletes the apps and records inside it. |
|  | Manage members | `workspaces.members:manage` | Add and remove workspace members. This gives other people access. |
| **Apps** | Read apps | `apps:read` | View apps together with their fields, views and settings. Also search across them. |
|  | Edit apps | `apps:edit` | Create, edit and delete apps, fields and views. Deleting a field also deletes its values in every record, and they cannot be restored. |
| **Records** | Read records | `records:read` | View records, their field values, files and full revision history, including values that were deleted. Also search across them. |
|  | Edit records | `records:edit` | Create, edit, delete and restore records, and upload files. |
|  | Read comments | `records.comments:read` | View comments and replies on records. |
|  | Edit comments | `records.comments:edit` | Post comments and replies, and delete your own. |
|  | Share records | `records:share` | Change who can see and edit individual records. This gives other people access. |
| **Automations** | Read automations | `automations:read` | View automations, their run history and their setup, including credentials for connected systems. |
|  | Edit automations | `automations:edit` | Create, edit, activate, deactivate and delete automations. Deactivating one stops the processes that depend on it. |
|  | Run automations | `automations:run` | Trigger and simulate automations on your behalf. An automation runs with the rights of the person who owns it, so it can do things the credential cannot, including in apps outside a token's content access. |
| **Advanced** | Manage webhooks | `webhooks:manage` | Create, list, verify and delete webhooks. A webhook keeps sending record, comment and app changes to an address you choose until someone deletes it, including after the credential that created it is revoked. |
|  | Send email | `email:send` | Send email on your behalf, using your organization's email settings. Without your own SMTP server, Tape sends from its own address. |

## Four rules worth knowing

**Editing doesn't include reading.** `records:edit` lets a credential write records, but not read them back. A write-only integration, such as an inbound sync, needs no read access. Grant both when you need both.

**Deleting is part of editing.** There's no separate delete capability. `records:edit` covers creating, changing, deleting and restoring records. `workspaces:edit` covers deleting a workspace and everything inside it.

**Identifying yourself needs nothing.** [`GET /v1/user`](https://developers.tapeapp.com/docs/api/resource/user#retrieve-the-current-user) tells you which user a credential belongs to and requires no capability. It returns no other user.

**Search is filtered, not blocked.** [`/v1/search`](https://developers.tapeapp.com/docs/api/resource/search) returns app and record results. It accepts a credential that holds *either* `apps:read` *or* `records:read`, and returns only the result types the credential may see. A credential with only `records:read` gets record results and no app results.

## Requesting scopes with OAuth

A personal access token gets its capabilities from the checkboxes in the settings. An OAuth app requests them in the `scope` parameter of its [authorization request](https://developers.tapeapp.com/docs/api/oauth/authorization-flow#2-send-the-user-to-tape):

```text
scope=apps:read records:read records:edit
```

### General behavior

-   **Separate scopes with a single space** (`%20` in a URL). Tabs, line breaks and other whitespace make the value unknown. Use the scope strings from the table above.
-   **Omitting `scope` grants the read tier**, `apps:read records:read`. So does a `scope` that's empty once Tape removes ignored values.
-   **Tape ignores OpenID Connect values.** It drops `openid`, `profile`, `email`, `address`, `phone` and `offline_access` without an error, because many client libraries send them unasked. Tape isn't an OpenID provider, and it issues a refresh token without `offline_access`.
-   **Any other unknown value fails the request** with `invalid_scope`.
-   **The user approves all requested scopes or none.** The consent screen lists the requested scopes one per line, so sending email, managing webhooks and inviting organization members each get their own line. An MCP client that requests exactly the scopes the Tape MCP server advertises sees a short fixed summary instead.
-   **Read `scope` in the token response** instead of assuming Tape granted your request as sent. It names exactly what the access token holds.

Request every scope your app needs in the first authorization. Scopes are fixed once the user approves. To add one later, the user has to approve again; see [Insufficient capabilities](#insufficient-capabilities).

## Insufficient capabilities

A credential that authenticates but lacks a capability the endpoint requires gets a `403`. The message names the kind of credential:

*Response*

```json
{
  "status_code": 403,
  "endpoint": "/v1/record/1",
  "error_code": "forbidden",
  "error_message": "This personal access token is missing the required scope(s): records:edit."
}
```

For an OAuth access token, the message reads `This OAuth access token is missing the required scope(s): records:edit.` Some endpoints accept any one of several capabilities, such as [`/v1/search`](https://developers.tapeapp.com/docs/api/resource/search). They refuse a credential that holds none of them with a message that lists them all.

The response also carries a standard `WWW-Authenticate` header that names what the endpoint needs:

```http
WWW-Authenticate: Bearer error="insufficient_scope", error_description="This personal access token is missing the required scope(s): records:edit.", scope="records:edit"
```

The `scope` value lists what the *endpoint requires*, not what your credential holds. Among `403` responses, only a capability refusal carries this header. See [`403` and `404` mean different things](#403-and-404-mean-different-things).

> A refused request still costs credits
> 
> Tape checks capabilities after rate limiting, so a `403` uses rate limit credits like any other request. Retrying a call your credential can't make uses up your budget without ever succeeding.

### Fix a missing capability

-   **Personal access token.** A token's capabilities are fixed when you create it. You can only change its name afterwards. Create a new token with the capabilities your integration needs, switch to it, and revoke the old one.
-   **OAuth access token.** Send the user through a new [authorization request](https://developers.tapeapp.com/docs/api/oauth/authorization-flow) whose `scope` names the scopes the app already holds *plus* the missing one (*step-up authorization*). Approval creates a new connection with exactly those scopes. Revoke the earlier connection's refresh token once you've stored the new tokens; see [Asking for more scopes](https://developers.tapeapp.com/docs/api/oauth/authorization-flow#asking-for-more-scopes). The [Tape MCP server](https://developers.tapeapp.com/docs/mcp/overview) answers a missing scope with a `403` whose `scope` already names the full set.

### `403` and `404` mean different things

A request passes through independent checks. The status code and the `WWW-Authenticate` header together tell you which check refused it:

| Status | Meaning | Fix |
| --- | --- | --- |
| `403` with `WWW-Authenticate: Bearer error="insufficient_scope"` and a `scope` value | The credential lacks a *capability* the endpoint requires | Create a token with that capability, or ask the user to approve it |
| `403` without that header | The user's own role or permissions in Tape do not allow this operation, for example changing a [view](https://developers.tapeapp.com/docs/api/resource/view) needs share access (**Can share** or **Full access**) to its app. `error_message` says why | Change the user's access in Tape. A new token or a new approval doesn't help |
| `404` | The resource does not exist, the user cannot see it, or, for a personal access token, it is outside the token's [content access](https://developers.tapeapp.com/docs/api/personal-access-tokens#content-selection) | Check the user's access; for a token, create one that selects that workspace or app |

A `404` deliberately looks the same as a resource that doesn't exist, so it carries no `WWW-Authenticate` header. If a personal access token gets a `404` for a record or app you know exists, check the token's content access first. An OAuth access token has no content access, so a `404` is about the user's own access.

A missing permission on a record or app usually returns `400` with `record_no_permission` or `app_no_permission`, not `403`. See [Errors](https://developers.tapeapp.com/docs/api/errors).

## Endpoints unavailable to tokens

A few internal endpoints refuse personal access tokens and OAuth access tokens, whatever capabilities they hold. They're not part of the public API. Requests to them return a `403` with this message:

```text
This endpoint cannot be accessed with a personal access token.
```

For an OAuth access token, the message is `This endpoint cannot be accessed with an OAuth access token.`

Every endpoint in this reference is reachable with the right capability.

## Next steps

[

Personal access tokens

create a token with the capabilities you need.

](https://developers.tapeapp.com/docs/api/personal-access-tokens)[

Authorization flow

request scopes for your app.

](https://developers.tapeapp.com/docs/api/oauth/authorization-flow)[

Authentication

compare the three credentials.

](https://developers.tapeapp.com/docs/api/authentication)[

Errors

handle `403`, `404` and other errors.

](https://developers.tapeapp.com/docs/api/errors)[

Request limits

what refused requests cost.

](https://developers.tapeapp.com/docs/api/request-limits)
