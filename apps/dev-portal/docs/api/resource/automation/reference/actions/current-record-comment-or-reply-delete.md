---
id: current-record-comment-or-reply-delete
title: current_record_comment_or_reply_delete
sidebar_label: current_record_comment_or_reply_delete
description: Config reference for the Tape automation current_record_comment_or_reply_delete action, with its config keys, defaults and an example.
---

Use this action to delete the comment or reply that started an automation.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Delete the current comment** in the [Current record](/docs/api/resource/automation/reference/actions#current-record) family. Its `group` is `action`, and it needs the `record_comment_or_reply_created` trigger.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action removes a comment on a candidate record in an HR database app, for example after a filter found personal data in it:

```json
{
  "type": "current_record_comment_or_reply_delete",
  "config": {
    "author_id": { "kind": "variable", "source": "meta", "meta_type": "created_by", "app_id": 87 },
    "silent": true
  }
}
```

## Config

The action has no keys of its own. It takes only the keys that every record-changing action shares.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | User Tape attributes the deletion to: a user ID, or a reference to the creator, the last modifier or a user field. Left out, the automation itself is the author. | `812` |
| `trigger_webhooks` | boolean | Whether the deletion fires outbound webhooks. Default `false`. | `false` |
| `trigger_other_flows` | boolean | Whether the deletion starts other automations. Default `false`. | `false` |
| `silent` | boolean | Whether Tape sends no notifications for the deletion. Default `false`. | `true` |

In the action menu of the automation editor, these keys are **Author**, **Trigger webhooks**, **Trigger automations** and **Silent**. To find a user ID for `author_id`, see [Retrieve organization users](/docs/api/resource/user#retrieve-organization-users).

## General behavior {#validation--behavior}

- No key is required. `"config": {}` deletes the comment or reply with the defaults.
- The action deletes the comment or reply that started the run. Only the `record_comment_or_reply_created` trigger provides it.
- With any other trigger, validation reports the [broken reason](/docs/api/resource/automation/reference/errors#broken-reason-codes) `action_invalid`.
- Without `author_id`, the automation itself is the author. A user ID that Tape can't find gives the broken reason `action_user_missing`.
- Tape returns `silent` on every read. It's `false` when you left it out.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.
- The automation needs the `record_comment_or_reply_created` trigger.

<a id="see-also"></a>

## Next steps

- [current_record_comment_or_reply_reply_create](/docs/api/resource/automation/reference/actions/current-record-comment-or-reply-reply-create): reply to the comment or reply that started the run.
- [Triggers](/docs/api/resource/automation/reference/triggers): the `record_comment_or_reply_created` trigger.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): build the reference for `author_id`.
- [Filters](/docs/api/resource/automation/reference/filters): decide which comments the automation acts on.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
