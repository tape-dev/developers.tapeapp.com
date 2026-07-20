---
id: current-record-delete
title: current_record_delete
sidebar_label: current_record_delete
description: Config reference for the Tape automation current_record_delete action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Delete record** — deletes the record that triggered the automation. `group: "action"`. Requires any record-context
trigger. Deleting a record is a mutation, so the action carries only the shared record-mutation envelope and nothing of
its own.

Part of the [Current record](/docs/api/resource/automation/reference/actions#current-record) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | no | User the mutation is attributed to — a literal user id, or a variable reference (created-by / last-modified-by / a user field). Omitted → the automation itself. |
| `trigger_webhooks` | boolean | no | Whether the mutation fires outbound webhooks. |
| `trigger_other_flows` | boolean | no | Whether the mutation triggers other automations. |
| `silent` | boolean | no | Whether the mutation is silent (no notifications). |

## Example

An action entry inside an automation definition's `actions[]`. The config is empty by default — every member is optional:

```json
{
  "type": "current_record_delete",
  "config": {}
}
```

To attribute the deletion to a specific user and suppress notifications:

```json
{
  "type": "current_record_delete",
  "config": {
    "author_id": 812,
    "silent": true
  }
}
```

## Validation & behavior

- No config members are required — an empty `config: {}` is valid and deletes the current record with the internal defaults.
- Operates on the trigger's current record, so it needs any record-context trigger to run.
- Every member is a mutation-control from the shared envelope; each omitted member falls back to the internal default.
- `author_id` accepts a literal user id or a variable reference (created-by / last-modified-by / a user field); omitted attributes the deletion to the automation itself.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Actions](/docs/api/resource/automation/reference/actions#current-record) — the Current record family
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
