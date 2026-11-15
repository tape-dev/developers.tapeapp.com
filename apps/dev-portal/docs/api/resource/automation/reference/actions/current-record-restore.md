---
id: current-record-restore
title: current_record_restore
sidebar_label: current_record_restore
description: Config reference for the Tape automation current_record_restore action, with its config keys, defaults and an example.
---

Use this action to restore the deleted record that an automation runs on.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Restore the current record** in the [Current record](/docs/api/resource/automation/reference/actions#current-record) family. Its `group` is `action`, and it needs a trigger with a record: `record_created`, `record_updated`, `record_deleted`, `record_comment_or_reply_created`, `date_field_arrived`, `automation_called` or `weblink_clicked`.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

Under the `record_deleted` trigger, this action restores an employee record in an HR database app and attributes the restore to the user who last changed it:

```json
{
  "type": "current_record_restore",
  "config": {
    "author_id": { "kind": "variable", "source": "meta", "meta_type": "last_modified_by", "app_id": 87 },
    "silent": true
  }
}
```

## Config

The action has no keys of its own. It takes only the keys that every record-changing action shares.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | User Tape attributes the restore to: a reference to the creator, the last modifier or a user field. Left out, the automation itself is the author. | `{ "kind": "variable", "source": "meta", "meta_type": "created_by", "app_id": 87 }` |
| `trigger_webhooks` | boolean | Whether the restore fires outbound webhooks. Default `false`. | `false` |
| `trigger_other_flows` | boolean | Whether the restore starts other automations. Default `false`. | `false` |
| `silent` | boolean | Whether Tape sends no notifications for the restore. Default `false`. | `true` |

In the action menu of the automation editor, these keys are **Author**, **Trigger webhooks**, **Trigger automations** and **Silent**.

## General behavior {#validation--behavior}

- No key is required. `"config": {}` restores the current record with the defaults.
- The action restores the record the run works on. It's useful when that record is deleted: under the `record_deleted` trigger, or after [`current_record_delete`](/docs/api/resource/automation/reference/actions/current-record-delete) earlier in the same run.
- Without a trigger that has a record, validation reports the [broken reason](/docs/api/resource/automation/reference/errors#broken-reason-codes) `action_invalid`. `periodic` and `webhook_received` have no record.
- Without `author_id`, the automation itself is the author. Use a reference in `author_id`: with a literal user ID, `validate` reports `action_user_missing`, even for an existing user, and activation fails.
- Tape returns `silent` on every read. It's `false` when you left it out.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.
- The automation needs a trigger with a record.

<a id="see-also"></a>

## Next steps

- [current_record_delete](/docs/api/resource/automation/reference/actions/current-record-delete): delete the current record.
- [Triggers](/docs/api/resource/automation/reference/triggers): the `record_deleted` trigger and the others.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): build the reference for `author_id`.
- [Action examples](/docs/api/resource/automation/action-examples): configs to copy for the common actions.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
