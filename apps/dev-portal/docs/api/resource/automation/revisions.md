---
id: revisions
title: Revisions
sidebar_label: Revisions
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

Every change to an automation appends an immutable **revision** — a frozen snapshot of its definition. There is no
"active version" pointer; to roll back, retrieve a revision and [`PUT`](/docs/api/resource/automation/manage) its
definition back. Both endpoints require a **user API key** and workspace-admin access, and cost `1x` base credits.

:::note Rolling back is not always a verbatim re-`PUT`
A revision is a **read** snapshot, so its `trigger` / `filter` can carry output-only fields — a `webhook_received`
trigger's server-assigned `webhook_url`, or read-only filter subjects and change-tracking conditions (see
[triggers](/docs/api/resource/automation/reference/triggers) and
[filters](/docs/api/resource/automation/reference/filters#v1-limitations)). Strip those before re-submitting; a
verbatim `PUT` of such a revision is rejected with a `400`.
:::

## List revisions

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation/{automation_id}/revision" />

Returns the automation's full history, **newest-first**. This listing is **unpaginated** — there is no `cursor` or
`total`. Simulation snapshots are excluded.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/automation/4021/revision -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "revisions": [
    {
      "id": "90071992547409929",
      "automation_id": 4021,
      "created_at": "2024-05-20 16:03:08",
      "name": "Email the owner on a new high-priority lead",
      "paused": false,
      "broken": false,
      "trigger": { "type": "record_created", "config": { "app_id": 87 } },
      "filter": null,
      "actions": []
    }
  ]
}`}
</ContextCodeBlock>

## Retrieve a revision

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation/{automation_id}/revision/{revision_id}" />

Returns one frozen revision, which must belong to this automation. A `revision_id` that is unknown, malformed, or
belongs to another automation all answer the same `404` (never an existence oracle).

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/automation/4021/revision/90071992547409929 -u #USER_API_KEY:`}
</ContextCodeBlock>

Returns `{ revision }`.

## The revision object

A revision snapshots the automation's **definition** as of one edit.

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | The revision ID — a 64-bit value, returned as a string. |
| `automation_id` | `integer` | The automation this revision belongs to. |
| `created_at` | `string` | When the revision was created, UTC `YYYY-MM-DD HH:mm:ss`. |
| `name` | `string` | The name as of this revision. |
| `paused` / `broken` | `boolean` | State as of this revision. |
| `trigger` | `object` \| `null` | The [trigger](/docs/api/resource/automation/reference/triggers) as of this revision. |
| `filter` | `object` \| `null` | The [filter](/docs/api/resource/automation/reference/filters) as of this revision. |
| `actions` | `array` | The [actions](/docs/api/resource/automation/reference/actions) as of this revision. |

A revision is deliberately narrower than the [automation object](/docs/api/resource/automation/reference/object): it
has no `description`, `broken_reason`, `updated_at`, `app_id` or `workspace_id`.
