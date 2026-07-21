---
id: manage
title: Manage automations
sidebar_label: Manage
description: Create, retrieve, list, update, replace the trigger, activate, pause, and delete Tape automations through the Developer API.
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Admonition from '@theme/Admonition';

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

Create, retrieve, list, update, replace the trigger, activate, pause and delete automations.

:::info Requires a user API key
Every endpoint here requires a **user API key**, and you must **administrate the workspace** the automation's app
belongs to. Unavailable automations answer a uniform `404` — see
[Authentication and permissions](/docs/api/resource/automation/overview#authentication-and-permissions). The returned
shape is the [automation object](/docs/api/resource/automation/reference/object), always wrapped as `{ automation }`.
:::

## Create an automation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation/app/{app_id}" />

Creates an automation in the app. It lands **paused and not broken** — a valid draft you finish, then
[activate](#activate-an-automation). Node IDs inside `filter` / `actions` are optional (server-minted when omitted).

**Body Parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | yes | 1–5000 characters. |
| `description` | `string` | no | Up to 25000 characters. |
| `trigger` | `object` | no | A [trigger](/docs/api/resource/automation/reference/triggers) `{ type, config }`. |
| `filter` | `object` | no | A [filter group](/docs/api/resource/automation/reference/filters). |
| `actions` | `array` | no | An ordered list of [actions](/docs/api/resource/automation/reference/actions). |

<Tabs defaultValue="curl">
<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation/app/87 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "name": "Email the owner on a new high-priority lead",
    "trigger": { "type": "record_created", "config": {} }
  }'`}
</ContextCodeBlock>
</TabItem>
<TabItem value="json" label="JSON">

```json title="➡️      Request"
{
  "name": "Email the owner on a new high-priority lead",
  "trigger": { "type": "record_created", "config": {} }
}
```

</TabItem>
</Tabs>

Returns `201` with the created [automation](/docs/api/resource/automation/reference/object). `null` is not accepted for
`description` or `trigger` here (unlike [update](#update-an-automation)). The create and update bodies are validated
against a **closed schema** — any top-level property not in the table above is rejected with a `400` (as is an unknown
key inside a trigger's `config`).

:::caution Limit — 500 automations per app
An app can hold at most **500 automations**. Once an app has reached this limit, further create
requests are rejected with an error until you delete an existing automation.
:::

## Retrieve an automation

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation/{automation_id}" />

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/automation/4021 -u #USER_API_KEY:`}
</ContextCodeBlock>

Returns `{ automation }` with its `trigger`, `filter` and `actions` inlined.

## List automations

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation/app/{app_id}" />
<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation/workspace/{workspace_id}" />
<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation/org" />

List automations in an app, a workspace, or across every workspace you administrate in your organization. The `org`
variant derives the organization from your key — it has no path scope, and returns an **empty page** (not a `404`) if
you administrate nothing.

**Query Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `cursor` | `string` | Cursor from the previous page. `null` on the last page. |
| `limit` | `integer` | Page size, `1`–`100`. Defaults to `50`. |

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl "#BASE_URL/v1/automation/app/87?limit=2" -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 12,
  "automations": [ { "id": 4021, "name": "Email the owner on a new high-priority lead", "paused": false, "broken": false }  ],
  "cursor": "eyJhbGciOiJI..."
}`}
</ContextCodeBlock>

Each entry is a full [automation object](/docs/api/resource/automation/reference/object). Results are ordered
**oldest-first** (by ID). `total` is a snapshot taken on the first page. See [Pagination](/docs/api/pagination). The
`cursor` is **scope-pinned** — it is bound to the exact list scope that issued it (this app, this workspace, or your
org). Replaying a cursor against a different scope is rejected with a `400`, not answered with an empty page; pass each
cursor back only to the same list call that produced it.

## Update an automation

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/automation/{automation_id}" />

A **partial update**: an omitted field is left unchanged; an explicit **`null`** clears `description`, `trigger` or
`filter`. `name` is never nullable. `actions`, when present, **replaces the whole list** (send `[]` to empty it).
Every update mints a new [revision](/docs/api/resource/automation/revisions).

**Body Parameters** (all optional)

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | New name (1–5000). |
| `description` | `string` \| `null` | Set, or `null` to clear. |
| `trigger` | `object` \| `null` | Replace, or `null` to remove. |
| `filter` | `object` \| `null` | Replace, or `null` to clear. |
| `actions` | `array` | Replace the whole list. |

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/automation/4021 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{ "description": "Notifies the owner of new leads." }'`}
</ContextCodeBlock>

:::note `broken` is not re-checked on write
Create and update don't re-validate the definition, so `broken` reflects the last activation. Call
[validate](/docs/api/resource/automation/execution) for a fresh verdict, or [activate](#activate-an-automation) it.
:::

## Replace the trigger

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/automation/{automation_id}/trigger" />

The **whole body is the trigger** `{ type, config }`. It replaces any existing trigger and mints a revision. To
*remove* a trigger, use [update](#update-an-automation) with `trigger: null` instead.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/automation/4021/trigger \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{ "type": "record_updated", "config": {} }'`}
</ContextCodeBlock>

## Activate an automation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation/{automation_id}/activate" />

Takes the automation live. Validity is **recomputed server-side** — a broken definition is refused with `409`
(point users at [validate](/docs/api/resource/automation/execution) for the reasons). No request body. **Idempotent**
for a valid automation: re-activating an already-live one succeeds as a no-op. (Unlike pause, activate re-runs the
broken-gate every call, so this holds only while the definition stays valid.)

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation/4021/activate -u #USER_API_KEY:`}
</ContextCodeBlock>

## Pause an automation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation/{automation_id}/pause" />

Pauses the automation. Idempotent, and never blocked by a broken definition. No request body.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation/4021/pause -u #USER_API_KEY:`}
</ContextCodeBlock>

## Delete an automation

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/automation/{automation_id}" />

**Soft-deletes** the automation (same as in the product): it drops out of every listing and is no longer retrievable,
but the data persists. Returns `200` with the final soft-deleted [automation](/docs/api/resource/automation/reference/object)
as confirmation — not `204`.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X DELETE #BASE_URL/v1/automation/4021 -u #USER_API_KEY:`}
</ContextCodeBlock>

## Rate limit credits

The three **list** endpoints cost `2x` base credits; every other endpoint on this page costs `1x`. See
[Request limits](/docs/api/request-limits).
