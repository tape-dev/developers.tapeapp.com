---
id: current-record-update
title: current_record_update
sidebar_label: current_record_update
description: Config reference for the Tape automation current_record_update action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Update record** — updates the triggering record. `group: "action"`. Requires any record-context trigger.

Part of the [Current record](/docs/api/resource/automation/reference/actions#current-record) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `field_assignments` | array of field assignments | no | Field assignments applied to the triggering record, one entry per target field. Empty when omitted. |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | no | User the mutation is attributed to — a literal user id, or a variable reference (created-by / last-modified-by / a user field). Omitted → the automation itself. |
| `trigger_webhooks` | boolean | no | Whether the mutation fires outbound webhooks. |
| `trigger_other_flows` | boolean | no | Whether the mutation triggers other automations. |
| `silent` | boolean | no | Whether the mutation is silent (suppresses notifications). |

`field_assignments` is an **array of typed per-field-type field assignments** (discriminated by `field_type`), new in
the typed schema. Its populated encoding is beta — an empty `[]` (no-op) is always accepted. There are 20 assignment
types, one per field type; each entry carries a `field_type` discriminator, a `variable_def` [reference](/docs/api/resource/automation/dynamic-values)
to the target field, an `assignment_type` mode, and the produced value. See
[Action examples](/docs/api/resource/automation/action-examples) for concrete per-type encodings.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "current_record_update",
  "config": {
    "field_assignments": [
      {
        "field_type": "single_text",
        "variable_def": { "kind": "variable", "source": "field", "field_id": 4021, "field_type": "single_text", "previous": false, "collection": false, "triggering": false },
        "assignment_type": "set",
        "field_value": ["Processed by automation"]
      }
    ],
    "silent": true
  }
}
```

## Validation & behavior

- No member is required — an omitted `field_assignments` defaults to `[]`, a no-op update; the action mutates the record that triggered the automation, so it needs any record-context trigger.
- Each `field_assignments[]` entry targets one field: `variable_def` references the field, `assignment_type` selects how the value is produced (e.g. `set` uses `field_value`, `set_code` uses `code`), and the unused value defaults to empty.
- `author_id` omitted attributes the mutation to the automation itself; `trigger_webhooks`, `trigger_other_flows`, and `silent` default to the internal defaults when omitted.
- The populated `field_assignments` encoding is beta — read the live per-type shapes from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery); `[]` is always accepted.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Action examples](/docs/api/resource/automation/action-examples) — per-field-type `field_assignments` encodings
- [Actions catalog](/docs/api/resource/automation/reference/actions)
