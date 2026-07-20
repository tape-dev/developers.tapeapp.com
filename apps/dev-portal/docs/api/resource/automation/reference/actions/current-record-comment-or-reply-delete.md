---
id: current-record-comment-or-reply-delete
title: current_record_comment_or_reply_delete
sidebar_label: current_record_comment_or_reply_delete
description: Config reference for the Tape automation current_record_comment_or_reply_delete action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Delete comment or reply** — deletes the comment or reply from the triggering record. `group: "action"`. Requires the
`record_comment_or_reply_created` trigger context.

Part of the [Current record](/docs/api/resource/automation/reference/actions#current-record) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

Deleting a comment or reply is a record mutation, so this action carries only the shared record-mutation envelope and
has nothing of its own.

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | no | User the mutation is attributed to — a literal user id or a variable reference. Omitted → the automation itself. |
| `trigger_webhooks` | boolean | no | Whether the deletion fires outbound webhooks. |
| `trigger_other_flows` | boolean | no | Whether the deletion triggers other automations. |
| `silent` | boolean | no | Whether the deletion is silent (suppresses notifications). |

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "current_record_comment_or_reply_delete",
  "config": {
    "author_id": { "kind": "variable", "source": "meta", "meta_type": "created_by" },
    "silent": true
  }
}
```

## Validation & behavior

- No members are required — an empty `"config": {}` deletes the triggering comment or reply with the internal defaults.
- This action is only meaningful under the `record_comment_or_reply_created` trigger context, which supplies the comment
  or reply to delete.
- `author_id`, `trigger_webhooks`, `trigger_other_flows`, and `silent` are all optional; each omitted member falls back
  to the internal default (the mutation is attributed to the automation itself).
- Deleting a comment or reply is a record mutation and honours the shared mutation-control envelope above.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Actions](/docs/api/resource/automation/reference/actions) — how actions compose in an automation definition
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
