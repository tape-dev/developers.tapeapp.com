---
id: current-record-comment-or-reply-reply-create
title: current_record_comment_or_reply_reply_create
sidebar_label: current_record_comment_or_reply_reply_create
description: Config reference for the Tape automation current_record_comment_or_reply_reply_create action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Add reply** — posts a reply to the comment or reply that triggered the automation. `group: "action"`. Requires the
`record_comment_or_reply_created` trigger context.

Part of the [Current record](/docs/api/resource/automation/reference/actions#current-record) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `reply_content` | [template value](/docs/api/resource/automation/dynamic-values) | **yes** | Reply body. |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | no | User the reply is attributed to — a literal user id or a variable reference. Omitted → the automation itself. |
| `trigger_webhooks` | boolean | no | Whether the reply fires outbound webhooks. |
| `trigger_other_flows` | boolean | no | Whether the reply triggers other automations. |
| `silent` | boolean | no | Whether the reply is silent (suppresses notifications). |

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "current_record_comment_or_reply_reply_create",
  "config": {
    "reply_content": ["Thanks — logged by ", { "kind": "variable", "source": "meta", "meta_type": "app_record_id" }],
    "silent": true
  }
}
```

## Validation & behavior

- `reply_content` is the only required member — it has no canonical default; every other member is an optional mutation control.
- The action needs the `record_comment_or_reply_created` trigger context: it replies to the comment or reply that fired the automation.
- With `author_id` omitted, the reply is attributed to the automation itself.
- `trigger_webhooks`, `trigger_other_flows`, and `silent` are omitted by default and fall back to the internal defaults for the mutation.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
