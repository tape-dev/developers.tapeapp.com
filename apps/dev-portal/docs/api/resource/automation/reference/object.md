---
id: object
title: The automation object
sidebar_label: Automation object
description: The Tape automation object — its fields, the paused/broken status model, and identifiers.
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

The automation object is returned — wrapped as `{ "automation": … }` — by retrieve, create, update, the lifecycle
endpoints and delete, and in `automations[]` by the [list endpoints](/docs/api/resource/automation/manage). Its three
substantive blocks — [trigger](/docs/api/resource/automation/reference/triggers),
[filter](/docs/api/resource/automation/reference/filters) and
[actions](/docs/api/resource/automation/reference/actions) — each have their own reference page.

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "automation": {
    "id": 4021,
    "app_id": 87,
    "workspace_id": 12,
    "name": "Email the owner on a new high-priority lead",
    "description": "Notifies the record owner whenever a lead is created.",
    "paused": false,
    "broken": false,
    "broken_reason": null,
    "trigger": { "type": "record_created", "config": {} },
    "filter": {
      "operator": "and",
      "rows": [
        {
          "id": "6a1f…",
          "subject": { "kind": "variable", "source": "field", "field_id": 512, "field_type": "single_category", "previous": false, "collection": false, "triggering": false },
          "operator": "is_any_of",
          "value": { "type": "ids", "ids": [9001] }
        }
      ]
    },
    "actions": [
      { "id": "3f9a2c", "type": "send_email", "group": "action", "config": { "subject": ["A new lead was created"] } }
    ],
    "created_at": "2024-05-14 09:12:31",
    "updated_at": "2024-05-20 16:03:08"
  }
}`}
</ContextCodeBlock>

## Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `integer` | ID of the automation. |
| `app_id` | `integer` | The app the automation belongs to. Only database apps can have automations. |
| `workspace_id` | `integer` | The workspace the app belongs to. |
| `name` | `string` | Name of the automation. |
| `description` | `string` | Optional. Absent when the automation has none. |
| `paused` | `boolean` | Whether the automation is paused. See [status](/docs/api/resource/automation/overview#status-and-lifecycle). |
| `broken` | `boolean` | Whether the definition is not executable. Reflects the last verdict the platform **stored**, not the current edit — see the note below. |
| `broken_reason` | `object` \| `null` | `{ errors: [...] }` when there are recorded reasons, else `null` — and it can be `null` even when `broken` is `true` (see the note below). Same entry shape as [validate](/docs/api/resource/automation/reference/errors). |
| `trigger` | `object` \| `null` | The single [trigger](/docs/api/resource/automation/reference/triggers) `{ type, config }`, or `null`. |
| `filter` | `object` \| `null` | The root [filter group](/docs/api/resource/automation/reference/filters), or `null` when there is no filter. |
| `actions` | `array` | The ordered [action](/docs/api/resource/automation/reference/actions) list. `[]` when none. |
| `created_at` | `string` | Creation time, UTC `YYYY-MM-DD HH:mm:ss`. |
| `updated_at` | `string` | Last-modified time, UTC `YYYY-MM-DD HH:mm:ss`. |

There is **no `status` field** (state is the `paused` + `broken` pair) and **no `owner`/author field** in this
release.

:::note `broken` reflects the last stored verdict, not the current definition
`broken` reflects the last verdict the platform **stored**. Create, update, `activate` and `validate` never write it —
a failed `activate` returns `409` without changing the object, and `validate` is a read-only check. Call
[`validate`](/docs/api/resource/automation/execution) for a current verdict. So a freshly written, non-executable
definition still reads `broken: false`, and `broken_reason` on the object can differ from what `validate` returns.

The platform **does** set `broken: true` when a previously-valid automation is later invalidated — for example its
filter can no longer be built, a field it watches is deleted, or a connected authentication provider is removed. A
broken automation is not fired by its trigger, and a manual run returns `409`. In that case `broken_reason` may be
`null`.
:::

## Identifiers

`id`, `app_id` and `workspace_id` are plain JSON **integers**. The only string-wrapped ID in this resource is a
**[revision](/docs/api/resource/automation/revisions) ID** (a 64-bit value). Node IDs inside `filter` and `actions`
are opaque **strings** — a caller-supplied id is preserved verbatim; server-minted ones (when you omit an id) are
UUIDs. Treat them as handles, not numbers.
