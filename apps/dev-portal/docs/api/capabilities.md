---
id: capabilities
title: Capabilities
sidebar_label: Capabilities
description: The 17 capabilities a personal access token can be granted, and how Tape enforces them.
---

A **capability** is a single thing a [personal access token](personal-access-tokens) is allowed to do, such as reading records or sending email. When you create a token you pick its capabilities; every request that token makes is then checked against them.

:::info Capabilities and scopes are the same thing
Tape's settings screen calls them **capabilities**. On the wire — in error messages and, in future, in OAuth — they appear as **scopes**, written `resource:action`, for example `records:read`. Same concept, two names for two audiences.
:::

Capabilities apply **only** to personal access tokens. A [user API key](authentication#user-api-key) carries no capabilities and is never subject to these checks.

## The capabilities

| Area             | Capability        | Scope                         | What it allows                                                                                                                                                                             |
| ---------------- | ----------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Organization** | Read organization | `organization:read`           | View your organization and its members, including their names, email addresses and phone numbers                                                                                           |
|                  | Manage members    | `organization.members:manage` | Invite people to your organization and manage invitations. Invitations can take up paid seats                                                                                              |
| **Workspaces**   | Read workspaces   | `workspaces:read`             | View workspaces and their members                                                                                                                                                          |
|                  | Edit workspaces   | `workspaces:edit`             | Create, rename and delete workspaces. Deleting a workspace also deletes the apps and records inside it                                                                                     |
|                  | Manage members    | `workspaces.members:manage`   | Add and remove workspace members. This gives other people access                                                                                                                           |
| **Apps**         | Read apps         | `apps:read`                   | View apps together with their fields, views and settings. Also search across them                                                                                                          |
|                  | Edit apps         | `apps:edit`                   | Create, edit and delete apps, fields and views. Deleting a field also deletes its values in every record, and they cannot be restored                                                      |
| **Records**      | Read records      | `records:read`                | View records, their field values, files and full revision history — including values that were deleted. Also search across them                                                            |
|                  | Edit records      | `records:edit`                | Create, edit, delete and restore records, and upload files                                                                                                                                 |
|                  | Read comments     | `records.comments:read`       | View comments and replies on records                                                                                                                                                       |
|                  | Edit comments     | `records.comments:edit`       | Post comments and replies, and delete your own                                                                                                                                             |
|                  | Share records     | `records:share`               | Change who can see and edit individual records. This gives other people access                                                                                                             |
| **Automations**  | Read automations  | `automations:read`            | View automations, their run history and their setup, including credentials for connected systems                                                                                           |
|                  | Edit automations  | `automations:edit`            | Create, edit, activate, deactivate and delete automations. Deactivating one stops the processes that depend on it                                                                          |
|                  | Run automations   | `automations:run`             | Trigger and simulate automations on your behalf. An automation runs with the rights of the person who owns it, so it can do things this token cannot — including in apps you did not select |
| **Advanced**     | Manage webhooks   | `webhooks:manage`             | Create and delete webhooks. A webhook keeps sending record, comment and app changes to an address you choose until someone deletes it — including after this token is revoked              |
|                  | Send email        | `email:send`                  | Send email in your name, using your organization's email settings. Recipients see you as the sender                                                                                        |

## Four rules worth knowing

**Editing does not include reading.** `records:edit` lets a token write records but not read them back. This is deliberate — a write-only integration, such as an inbound sync, is a real case and should not be forced to take read access it never uses. Grant both when you need both.

**Deleting is part of editing.** There is no separate delete capability. `records:edit` covers creating, changing, deleting and restoring records; `workspaces:edit` covers deleting a workspace, and everything inside it.

**Identifying yourself needs nothing.** [`GET /v1/user`](resource/user) answers "which user is this credential?" and requires no capability at all. It takes no parameters and can return no other user, so it discloses nothing a caller does not already know.

**Search is filtered, not blocked.** [`/v1/search`](resource/search) returns both app and record results, and is allowed for a token holding **either** `apps:read` **or** `records:read`. Rather than refusing a token that holds only one of them, Tape narrows the response to the result types the token is allowed to see. A token with only `records:read` gets record results and no app results.

## Insufficient capabilities

When a token authenticates successfully but lacks a capability the endpoint requires, the request is refused with `403`:

```json title="⬅️      Response"
{
  "status_code": 403,
  "endpoint": "/v1/record/1",
  "error_code": "forbidden",
  "error_message": "This personal access token is missing the required scope(s): records:edit."
}
```

The response also carries a standard `WWW-Authenticate` header naming what the endpoint needed:

```http
WWW-Authenticate: Bearer error="insufficient_scope", error_description="This personal access token is missing the required scope(s): records:edit.", scope="records:edit"
```

The `scope` value lists what the **endpoint requires**, not what your token holds.

:::caution A refused request still costs credits
Capability checks run after rate limiting, so a `403` consumes its rate limit credits like any other request. Retrying a call your token cannot make will exhaust your budget without ever succeeding.
:::

A token's capabilities are fixed when it is created — only its name can be changed afterwards. To resolve a `403`, create a new token with the capabilities your integration needs, switch over to it, and revoke the old one.

### `403` and `404` mean different things

A personal access token passes through two independent checks, and they fail with different status codes on purpose:

| Status | Meaning                                                                       | Fix                                                              |
| ------ | ----------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `403`  | The token lacks a **capability** the endpoint requires                        | Issue a token with that capability                               |
| `404`  | The resource is outside the token's [content selection](personal-access-tokens#content-selection) | Issue a token that selects that workspace or app |

A `404` is deliberately indistinguishable from a resource that genuinely does not exist, so it carries no `WWW-Authenticate` header. If you get a `404` for a record or app you know exists, check the token's content selection before anything else.

## Endpoints unavailable to tokens

A small number of internal endpoints cannot be reached with a personal access token at all, whatever capabilities it holds. They are not part of the public API surface, and requests to them are refused with a `403` carrying this message:

```
This endpoint cannot be accessed with a personal access token.
```

Every endpoint documented in this reference is reachable with the right capability.
