---
id: current-record-restore
title: current_record_restore
sidebar_label: current_record_restore
description: Config reference for the Tape automation current_record_restore action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Restore record** — restores the current soft-deleted record. `group: "action"`. Requires any record-context trigger.

Part of the [Current record](/docs/api/resource/automation/reference/actions#current-record) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

Restoring a record is a mutation, so the action carries only the shared record-mutation envelope and nothing of its own.
Every member is optional; omitting one falls back to the internal default.

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | no | User the mutation is attributed to — a literal user id, or a reference (created-by / last-modified-by / a user field). Omitted → the automation itself. |
| `trigger_webhooks` | boolean | no | Whether the mutation fires outbound webhooks. |
| `trigger_other_flows` | boolean | no | Whether the mutation triggers other automations. |
| `silent` | boolean | no | Whether the mutation is silent (suppresses notifications). |

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "current_record_restore",
  "config": {
    "author_id": { "kind": "variable", "source": "meta", "meta_type": "last_modified_by" },
    "silent": true
  }
}
```

The `config` may also be empty (`"config": {}`) — the restore then runs with every envelope member at its default.

## Validation & behavior

- No member is required; an empty `config` is valid and runs the restore with all envelope defaults.
- `author_id` accepts either a literal user id or a variable reference; omitted, the mutation is attributed to the automation itself.
- `trigger_webhooks`, `trigger_other_flows`, and `silent` are booleans that gate the mutation's side effects; omitted, each uses its internal default.
- Restores the current soft-deleted record, so it is typically only reachable after an upstream `current_record_delete` in the same run — outside that context there is nothing to restore.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — the reference shape used by `author_id`
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
