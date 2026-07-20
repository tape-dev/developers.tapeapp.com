---
id: collected-records-update
title: collected_records_update
sidebar_label: collected_records_update
description: Config reference for the Tape automation collected_records_update action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Update collected records** — applies field assignments to each record in a collected record collection. `group: "action"`. No specific trigger context is required.

Part of the [Record collections](/docs/api/resource/automation/reference/actions#record-collections) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `record_collection` | [reference](/docs/api/resource/automation/dynamic-values) | no | The record collection to update — the output of a prior collect action. |
| `field_assignments` | array of field assignments | no | Array of typed per-field-type field assignments (discriminated by `field_type`), new in the typed schema. Empty when omitted. |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | no | Who the mutation is attributed to — a fixed user id or a reference. Omitted → the automation itself. |
| `trigger_webhooks` | boolean | no | Whether the mutation fires outbound webhooks. |
| `trigger_other_flows` | boolean | no | Whether the mutation triggers other automations. |
| `silent` | boolean | no | Whether the mutation is silent (suppresses notifications). |

`field_assignments` covers 20 per-field-type shapes discriminated by `field_type`; its populated encoding is **beta** — see
[Action examples](/docs/api/resource/automation/action-examples). An empty array `[]` (no-op) is always accepted, and an
omitted list defaults to `[]`.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "collected_records_update",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 5 },
    "field_assignments": [],
    "silent": true
  }
}
```

## Validation & behavior

- No member is required; `record_collection` and `field_assignments` both default (an omitted `field_assignments` becomes `[]`).
- This is a **consumer** action: `record_collection` should reference a record collection produced by an earlier collect action.
- As a **mutating** action, it applies `field_assignments` to each collected record; `author_id`, `trigger_webhooks`, `trigger_other_flows`, and `silent` control attribution and side effects, each falling back to the internal default when omitted.
- The populated `field_assignments` encoding is beta — an empty array is always accepted; consult [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) for the live shape before sending populated assignments.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Action examples](/docs/api/resource/automation/action-examples) — field-assignment encodings
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
