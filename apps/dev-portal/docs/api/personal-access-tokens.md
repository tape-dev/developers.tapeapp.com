---
id: personal-access-tokens
title: Personal Access Tokens
sidebar_label: Personal Access Tokens
description: Named, capability-scoped API credentials that can be limited to specific workspaces and apps, and revoked individually.
---

A **personal access token** (PAT) is a named credential you create for a single integration. Unlike the [user API key](/docs/api/authentication#user-api-key), which can do everything your account can do, a personal access token only does what you allow it to.

Every token carries two independent grants:

- a set of [**capabilities**](/docs/api/capabilities) — _what_ the token may do, such as reading records or sending email,
- a **content selection** — _which_ workspaces and apps it may do it to.

Tokens begin with the prefix `tape_pat_`.

:::info A token can never exceed you
A token's effective access is your own permissions, narrowed by its capabilities, narrowed again by its content selection. Both grants only ever subtract. Granting a capability never gives a token access to something you cannot already reach yourself, and losing your own access to a workspace immediately narrows every token you own.
:::

## Creating a token

1. Click the user avatar on the top right and open your user settings.
2. Go to the **Developer** section.
3. Under **Personal access tokens (PATs)**, click **New token**.
4. Give the token a name, choose which workspaces and apps it may reach, and choose its capabilities.
5. Click **Create token**.

:::caution The token is shown exactly once
Copy the token when it is displayed and store it somewhere safe, such as your integration's secret store. Tape keeps only a hash of it, so the value cannot be shown again. If you lose it, revoke the token and create a new one.
:::

Afterwards the settings list shows only the first and last few characters of each token, which is enough to identify it without exposing the secret.

:::note A token's grants are chosen once
Capabilities and content selection are fixed at creation. You can rename a token later, but to change what it may do or reach, create a new token and revoke the old one.
:::

## Using a token

Send the token as a bearer token, exactly like a user API key:

```shell
curl https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer tape_pat_0a1b2c3d..."
```

A personal access token authenticates the **developer API** (`/v1/*`) and nothing else. In particular, it cannot be used to create or manage personal access tokens — that happens only while signed in to Tape.

## Content selection

When you create a token you choose between two kinds of reach:

| Content selection      | What the token can reach                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| **All**                | Every workspace and app you can reach, including ones created later                       |
| **Selected**           | Only the workspaces and apps you pick                                                     |

Selecting a **workspace** also covers every app inside it, including apps added to that workspace later. The reverse is not true: selecting an app does **not** grant access to its workspace.

You can select up to 50 workspaces and up to 50 apps.

When a token addresses a resource outside its selection, the request is refused with a `404`, exactly as if the resource did not exist.

Endpoints that return **lists** behave differently: they succeed with a `200` and simply return fewer results. [`GET /v1/app`](/docs/api/resource/app), [`GET /v1/workspace/org`](/docs/api/resource/workspace), `GET /v1/automation/org`, the automation run history and [search](/docs/api/resource/search) all narrow their results this way.

Some endpoints name the resource they act on in the request **body** rather than in the URL — creating an app names its `workspace_id`, batch-updating record permissions names its `record_id`s, and generating an automation weblink names its `trigger_workflow_def_id`. These are checked against the selection as well, so they succeed as long as the resource named in the body is inside it.

**Creating a workspace** is the one operation a restricted token cannot perform at all. A new top-level workspace has no parent that a selection could name, and creating one would widen the token's reach — so it requires a token scoped to **All**.

:::caution Content selection limits a credential, not your data
Content selection reduces what a **token** can reach. It is not a data isolation boundary, and it does not hide data from you or change anyone's permissions.

One case in particular is worth knowing: when a token reads a record in a selected app, related records are returned as small previews — their id, title, creation date and the app they live in, together with that app's workspace — **even when those related records live in an app the token did not select**. This is read-only and still bounded by your own permissions, but if you need a hard boundary around data, content selection is not the mechanism to rely on.
:::

## Revoking a token

Revoke a token from the same **Developer** settings section. Revocation takes effect on the **next request** — there is nothing cached and nothing to re-issue.

Revoking one token never affects your other tokens, your user API key, or your account. Revoked tokens stay visible in the settings list so you keep a record of what existed.

:::caution Webhooks outlive the token that created them
A webhook created through the API keeps delivering after the token that created it is revoked. Revoking a token does not delete the webhooks it registered — delete those separately.
:::

## Limits

| Limit                          | Value          |
| ------------------------------ | -------------- |
| Active tokens per user         | 20             |
| Selected workspaces per token  | 50             |
| Selected apps per token        | 50             |
| Token name length              | 500 characters |

## Rate limits

A personal access token does **not** get its own rate limit budget. All of your credentials — your user API key and every personal access token you own — draw from the **same per-user budget**.

Creating more tokens therefore does not buy more throughput. See [Request limits](/docs/api/request-limits) for the credit system.

## Attribution

A token acts as **you**. Records it creates or changes show you as the author in the activity stream, and emails it sends show you as the sender. If you want an integration's activity to appear under its own name, create a dedicated user for it and mint the token from that account.

## Keeping tokens safe

- **Never commit a token** to source control, and never paste one into a client-side application. A token in a browser bundle is a public token.
- **One token per integration.** Shared credentials cannot be revoked without breaking something unrelated.
- **Grant the narrowest set of [capabilities](/docs/api/capabilities) that works.** In particular, `edit` is not required to read — a reporting integration should hold only read capabilities.
- **Select only the workspaces and apps the integration needs**, rather than defaulting to all of them.
- The `tape_pat_` prefix is designed to be recognizable by secret-scanning tools, so a leaked token can be spotted automatically.
- If a token may have leaked, revoke it first and investigate afterwards. Revocation is instant and costs you nothing but a new token.
