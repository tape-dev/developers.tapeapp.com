---
id: collected-records-comment-create
title: collected_records_comment_create
sidebar_label: collected_records_comment_create
description: Config reference for the Tape automation collected_records_comment_create action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Comment on collected records** — adds a comment to each record in a collection. `group: "action"`. No specific trigger context is required.

Part of the [Record collections](/docs/api/resource/automation/reference/actions#record-collections) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `comment_content` | [template value](/docs/api/resource/automation/dynamic-values) | **yes** | Comment body. |
| `record_collection` | [reference](/docs/api/resource/automation/dynamic-values) | no | Reference to a record collection variable produced by an earlier action. Omitted → the collection bound by the enclosing for-loop. |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | no | User the comment is attributed to — a literal user id or a variable reference. Omitted → the automation itself. |
| `trigger_webhooks` | boolean | no | Whether the mutation fires outbound webhooks. |
| `trigger_other_flows` | boolean | no | Whether the mutation triggers other automations. |
| `silent` | boolean | no | Whether the mutation is silent (no notifications). |

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "collected_records_comment_create",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 123 },
    "comment_content": ["Reviewed by automation on record ", { "kind": "variable", "source": "meta", "meta_type": "app_record_id" }],
    "silent": true
  }
}
```

## Validation & behavior

- `comment_content` is the only required member; every other member is optional and falls back to its internal default.
- This is a **consumer** of a record collection: `record_collection` references a collection variable produced by an earlier action. When omitted, the action targets the collection bound by its enclosing for-loop, so it must run inside one.
- With `author_id` omitted, the comment is attributed to the automation itself.
- `trigger_webhooks`, `trigger_other_flows`, and `silent` are the shared mutation-control members; omitted = the internal default.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Record collections family](/docs/api/resource/automation/reference/actions#record-collections) — actions that produce and consume collections
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
