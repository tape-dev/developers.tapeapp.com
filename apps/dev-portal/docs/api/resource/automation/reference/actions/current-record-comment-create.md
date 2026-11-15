---
id: current-record-comment-create
title: current_record_comment_create
sidebar_label: current_record_comment_create
description: Config reference for the Tape automation current_record_comment_create action, with its config keys, defaults and an example.
---

Use this action to add a comment to the record that an automation runs on.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Add a comment to the current record** in the [Current record](/docs/api/resource/automation/reference/actions#current-record) family. Its `group` is `action`, and it needs a trigger with a record: `record_created`, `record_updated`, `record_deleted`, `record_comment_or_reply_created`, `date_field_arrived`, `automation_called` or `weblink_clicked`.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

When an invoice record comes in, this action leaves a note for the finance team:

```json
{
  "type": "current_record_comment_create",
  "config": {
    "comment_content": ["Invoice ", { "kind": "variable", "source": "meta", "meta_type": "app_record_id", "app_id": 87 }, " is ready for approval."],
    "silent": true
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `comment_content` | [template value](/docs/api/resource/automation/dynamic-values) | **Required.** Text of the comment. A plain string works too. Tape turns it into an array. | `["Invoice approved."]` |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | User Tape attributes the comment to: a user ID, or a reference to the creator, the last modifier or a user field. Left out, the automation itself is the author. | `812` |
| `trigger_webhooks` | boolean | Whether the comment fires outbound webhooks. Default `false`. | `false` |
| `trigger_other_flows` | boolean | Whether the comment starts other automations. Default `false`. | `false` |
| `silent` | boolean | Whether Tape sends no notifications for the comment. Default `false`. | `true` |

`author_id`, `trigger_webhooks`, `trigger_other_flows` and `silent` are shared by every action that changes records. In the action menu of the automation editor, they are **Author**, **Trigger webhooks**, **Trigger automations** and **Silent**. To find a user ID for `author_id`, see [Retrieve organization users](/docs/api/resource/user#retrieve-organization-users).

## General behavior {#validation--behavior}

- `comment_content` is the only required key. It has no default.
- With an empty `comment_content`, Tape skips the action when the automation runs.
- If the references in `comment_content` resolve to empty text when the automation runs, the action fails, and so does the run.
- Mentions in `comment_content` can only point to members of the workspace that the trigger's database app belongs to.
- Without a trigger that has a record, validation reports the [broken reason](/docs/api/resource/automation/reference/errors#broken-reason-codes) `action_invalid`. `periodic` and `webhook_received` have no record.
- Without `author_id`, the automation itself is the author. A user ID that Tape can't find gives the broken reason `action_user_missing`.
- Tape returns `silent` on every read. It's `false` when you left it out.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.
- The automation needs a trigger with a record.

<a id="see-also"></a>

## Next steps

- [current_record_comment_or_reply_reply_create](/docs/api/resource/automation/reference/actions/current-record-comment-or-reply-reply-create): reply to the comment or reply that started the run.
- [collected_records_comment_create](/docs/api/resource/automation/reference/actions/collected-records-comment-create): add a comment to every record in a collection.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): build template values and references.
- [Action examples](/docs/api/resource/automation/action-examples): configs to copy for the common actions.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
