---
id: current-record-comment-create
title: current_record_comment_create
sidebar_label: current_record_comment_create
description: Config reference for the Tape automation current_record_comment_create action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Add comment** — posts a comment on the run's current record. `group: "action"`. Requires any record-context trigger.

Part of the [Current record](/docs/api/resource/automation/reference/actions#current-record) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `comment_content` | [template value](/docs/api/resource/automation/dynamic-values) | **yes** | Comment body posted on the run's current record. |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | no | User the comment is attributed to — a literal user id or a variable reference. Omitted → the automation itself. |
| `trigger_webhooks` | boolean | no | Whether the mutation fires outbound webhooks. |
| `trigger_other_flows` | boolean | no | Whether the mutation triggers other automations. |
| `silent` | boolean | no | Whether the mutation is silent (suppresses notifications). |

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "current_record_comment_create",
  "config": {
    "comment_content": ["Auto-comment for record ", { "kind": "variable", "source": "meta", "meta_type": "app_record_id" }],
    "silent": true
  }
}
```

## Validation & behavior

- `comment_content` is the only required member — it has no canonical default; every other member is an optional mutation-control flag inherited from the shared mutating-action base.
- With `author_id` omitted, the comment is attributed to the automation itself; otherwise pass a literal user id or a variable reference (created-by / last-modified-by / a user field).
- The `trigger_webhooks`, `trigger_other_flows`, and `silent` flags default to the internal mutation defaults when omitted.
- Requires a record-context trigger so that a current record exists to comment on.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
