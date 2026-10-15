---
id: capabilities
title: Capabilities and Scopes
sidebar_label: Capabilities and Scopes
description: The 17 capabilities a personal access token or an OAuth access token can hold, how they are requested, and how Tape enforces them.
---

A **capability** is a single thing a credential is allowed to do, such as reading records or sending email. Two kinds of credential carry capabilities, and every request they make is checked against them:

| Credential                                                | Who decides its capabilities                                                   | When they are set                    |
| --------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------ |
| [Personal access token](/docs/api/personal-access-tokens) | You, when you create the token                                                 | At creation, and never change        |
| [OAuth access token](/docs/api/oauth/overview)            | The app requests them; the user approves or declines on Tape's consent screen | At approval, and never widen         |

A [user API key](/docs/api/authentication#user-api-key) carries no capabilities and is never subject to these checks.

:::info Capabilities and scopes are the same thing
Tape's settings screen calls them **capabilities**, and the consent screen describes them as what an app "will be able to" do. On the wire — in OAuth's `scope` parameter, in token responses and in error messages — they appear as **scopes**, written `resource:action`, for example `records:read`. Same concept, different names for different audiences.
:::

## Capabilities only ever subtract

A credential always acts as the user it belongs to. Its effective access is that user's own permissions, narrowed by its capabilities:

| Axis                    | Question it answers                     | Personal access token                                                                | OAuth access token                         |
| ----------------------- | --------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------ |
| **The user's own role** | What may this person do anyway?         | Always applies                                                                       | Always applies                             |
| **Capabilities**        | What kind of action?                    | Chosen at creation                                                                   | Approved at consent                        |
| **Content selection**   | Which workspaces and apps?              | All, or only the ones you [select](/docs/api/personal-access-tokens#content-selection) | Always everything the user can reach       |

Granting a capability never gives a credential access to something its user cannot already reach, and when the user loses access to a workspace, every credential they own loses it too.

## The capabilities

| Area             | Capability        | Scope                         | What it allows                                                                                                                                                                                                         |
| ---------------- | ----------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Organization** | Read organization | `organization:read`           | View your organization and its members, including their names, email addresses and phone numbers                                                                                                                       |
|                  | Manage members    | `organization.members:manage` | Invite people to your organization and manage invitations. Invitations can take up paid seats                                                                                                                          |
| **Workspaces**   | Read workspaces   | `workspaces:read`             | View workspaces and their members                                                                                                                                                                                      |
|                  | Edit workspaces   | `workspaces:edit`             | Create, rename and delete workspaces. Deleting a workspace also deletes the apps and records inside it                                                                                                                 |
|                  | Manage members    | `workspaces.members:manage`   | Add and remove workspace members. This gives other people access                                                                                                                                                       |
| **Apps**         | Read apps         | `apps:read`                   | View apps together with their fields, views and settings. Also search across them                                                                                                                                      |
|                  | Edit apps         | `apps:edit`                   | Create, edit and delete apps, fields and views. Deleting a field also deletes its values in every record, and they cannot be restored                                                                                  |
| **Records**      | Read records      | `records:read`                | View records, their field values, files and full revision history — including values that were deleted. Also search across them                                                                                        |
|                  | Edit records      | `records:edit`                | Create, edit, delete and restore records, and upload files                                                                                                                                                             |
|                  | Read comments     | `records.comments:read`       | View comments and replies on records                                                                                                                                                                                   |
|                  | Edit comments     | `records.comments:edit`       | Post comments and replies, and delete your own                                                                                                                                                                         |
|                  | Share records     | `records:share`               | Change who can see and edit individual records. This gives other people access                                                                                                                                         |
| **Automations**  | Read automations  | `automations:read`            | View automations, their run history and their setup, including credentials for connected systems                                                                                                                       |
|                  | Edit automations  | `automations:edit`            | Create, edit, activate, deactivate and delete automations. Deactivating one stops the processes that depend on it                                                                                                      |
|                  | Run automations   | `automations:run`             | Trigger and simulate automations on your behalf. An automation runs with the rights of the person who owns it, so it can do things the credential cannot — including in apps outside a token's content selection    |
| **Advanced**     | Manage webhooks   | `webhooks:manage`             | Create and delete webhooks. A webhook keeps sending record, comment and app changes to an address you choose until someone deletes it — including after the credential that created it is revoked                     |
|                  | Send email        | `email:send`                  | Send email in your name, using your organization's email settings. Recipients see you as the sender                                                                                                                    |

## Four rules worth knowing

**Editing does not include reading.** `records:edit` lets a credential write records but not read them back. This is deliberate — a write-only integration, such as an inbound sync, is a real case and should not be forced to take read access it never uses. Grant both when you need both.

**Deleting is part of editing.** There is no separate delete capability. `records:edit` covers creating, changing, deleting and restoring records; `workspaces:edit` covers deleting a workspace, and everything inside it.

**Identifying yourself needs nothing.** [`GET /v1/user`](/docs/api/resource/user#retrieve-the-current-user) answers "which user is this credential?" and requires no capability at all. It takes no parameters and can return no other user, so it discloses nothing a caller does not already know.

**Search is filtered, not blocked.** [`/v1/search`](/docs/api/resource/search) returns both app and record results, and is allowed for a credential holding **either** `apps:read` **or** `records:read`. Rather than refusing a credential that holds only one of them, Tape narrows the response to the result types it is allowed to see. A credential with only `records:read` gets record results and no app results.

## Requesting scopes with OAuth

A personal access token gets its capabilities from the checkboxes on the settings screen. An OAuth app asks for them in the `scope` parameter of its [authorization request](/docs/api/oauth/authorization-flow#2-send-the-user-to-tape):

```text
scope=apps:read records:read records:edit
```

- **Separate scopes with a single space character** (`%20` in a URL). Tabs, line breaks and other whitespace make the value unknown. The values are the scope strings in the table above.
- **Omitting `scope` grants the read tier**, `apps:read records:read`. So does a `scope` that is empty once ignored values are removed.
- **OpenID Connect values are ignored.** `openid`, `profile`, `email`, `address`, `phone` and `offline_access` are dropped silently, because many client libraries send them unasked. Tape is not an OpenID provider, and a refresh token is always issued without `offline_access`.
- **Any other unknown value fails the request** with `invalid_scope`.
- **The user approves all of the requested scopes or none.** The consent screen lists the requested scopes one per line, so sending email, managing webhooks and inviting organization members each get a line of their own. An MCP client that requests exactly the scopes the Tape MCP server advertises sees a short fixed summary instead.
- **Read `scope` in the token response** rather than assuming your request was granted as sent: it names exactly what the access token holds.

Request every scope your app needs in the first authorization. Scopes are fixed once the user approves; to add one later, the user has to approve again (see [below](#insufficient-capabilities)).

## Insufficient capabilities

When a credential authenticates successfully but lacks a capability the endpoint requires, the request is refused with `403`. The message names the kind of credential:

```json title="⬅️      Response"
{
  "status_code": 403,
  "endpoint": "/v1/record/1",
  "error_code": "forbidden",
  "error_message": "This personal access token is missing the required scope(s): records:edit."
}
```

For an OAuth access token, the message reads `This OAuth access token is missing the required scope(s): records:edit.` An endpoint that accepts any one of several capabilities — such as [`/v1/search`](/docs/api/resource/search) — refuses a credential holding none of them with a message listing them all.

The response also carries a standard `WWW-Authenticate` header naming what the endpoint needed:

```http
WWW-Authenticate: Bearer error="insufficient_scope", error_description="This personal access token is missing the required scope(s): records:edit.", scope="records:edit"
```

The `scope` value lists what the **endpoint requires**, not what your credential holds. Only a capability refusal carries this header: a `403` without it comes from the user's own permissions, and no new token or approval will fix it — see [below](#403-and-404-mean-different-things).

:::caution A refused request still costs credits
Capability checks run after rate limiting, so a `403` consumes its rate limit credits like any other request. Retrying a call your credential cannot make will exhaust your budget without ever succeeding.
:::

How to resolve it depends on the credential:

- **Personal access token.** A token's capabilities are fixed when it is created — only its name can be changed afterwards. Create a new token with the capabilities your integration needs, switch over to it, and revoke the old one.
- **OAuth access token.** Send the user through a new [authorization request](/docs/api/oauth/authorization-flow) whose `scope` names the scopes the app already holds **plus** the missing one. Approval creates a new connection with exactly the scopes requested, so asking for the missing scope alone would trade away the others. The earlier connection stays active, so revoke its refresh token once you have stored the new tokens. This is called _step-up authorization_. The [Tape MCP server](/docs/mcp/overview) answers an OAuth client's missing scope with a `403` whose `scope` already names that union, so an MCP client can re-authorize with it as is.

### `403` and `404` mean different things

A credential passes through independent checks. The status code and the `WWW-Authenticate` header together tell you which one refused the request:

| Status | Meaning                                                                                                                                                         | Fix                                                                                         |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `403` with `WWW-Authenticate: Bearer error="insufficient_scope"` and a `scope` value | The credential lacks a **capability** the endpoint requires                                                                      | Issue a token with that capability, or ask the user to approve it                           |
| `403` without that header | The user's own role or permissions in Tape do not allow this operation — for example, changing a view needs share access to its app. `error_message` says why | Change the user's access in Tape. A new token or a new approval will not help               |
| `404`  | The resource does not exist, the user cannot see it, or — for a personal access token — it is outside the token's [content selection](/docs/api/personal-access-tokens#content-selection) | Check the user's access; for a token, issue one that selects that workspace or app          |

A `404` is deliberately indistinguishable from a resource that genuinely does not exist, so it carries no `WWW-Authenticate` header. If a personal access token gets a `404` for a record or app you know exists, check the token's content selection before anything else. An OAuth access token has no content selection, so for it a `404` is about the user's own access.

## Endpoints unavailable to tokens

A small number of internal endpoints cannot be reached with a personal access token or an OAuth access token at all, whatever capabilities it holds. They are not part of the public API surface, and requests to them are refused with a `403` carrying this message:

```
This endpoint cannot be accessed with a personal access token.
```

or, for an OAuth access token, `This endpoint cannot be accessed with an OAuth access token.`

Every endpoint documented in this reference is reachable with the right capability.
