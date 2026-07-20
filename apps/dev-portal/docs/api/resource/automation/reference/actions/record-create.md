---
id: record-create
title: record_create
sidebar_label: record_create
description: Config reference for the Tape automation record_create action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Create record** — creates a record in an app. `group: "action"`. No specific trigger context is required.

Part of the [Current record](/docs/api/resource/automation/reference/actions#current-record) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `app_id` | integer | no | Target app the record is created in. |
| `field_assignments` | array of typed per-field-type field assignments (discriminated by `field_type`), new in the typed schema | no | Field assignments applied to the new record. Omitted means the app's default assignments. |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | no | User the mutation is attributed to — a literal user id or a reference. Omitted → the automation itself. |
| `trigger_webhooks` | boolean | no | Whether the mutation fires outbound webhooks. |
| `trigger_other_flows` | boolean | no | Whether the mutation triggers other automations. |
| `silent` | boolean | no | Whether the mutation is silent (no notifications). |

`field_assignments` is a discriminated union of 20 per-field-type entry shapes; its populated encoding is **beta** and
its exact per-type members are still settling. An empty list `[]` (no-op) is always accepted. For the assignment shapes,
see [Action examples](/docs/api/resource/automation/action-examples).

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "record_create",
  "config": {
    "app_id": 4021,
    "field_assignments": [],
    "author_id": { "kind": "variable", "source": "meta", "meta_type": "created_by" },
    "silent": true
  }
}
```

## Validation & behavior

- No member is required — with an empty `config` the action creates a record in the automation's own app context using default assignments.
- `field_assignments` omitted means the app's default assignments; `[]` is an accepted no-op, and its populated encoding is still beta (see meta/action).
- `author_id` omitted attributes the mutation to the automation itself; supply a user id or a reference to attribute it to a specific user.
- `trigger_webhooks`, `trigger_other_flows`, and `silent` default to the internal defaults when omitted — set them to control the created record's side effects.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Action examples](/docs/api/resource/automation/action-examples) — field-assignment shapes used by `field_assignments`
- [Actions catalog](/docs/api/resource/automation/reference/actions)
