# current_record_delete

> Config reference for the Tape automation current_record_delete action, with its config keys, defaults and an example.

Use this action to delete the record that an automation runs on.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Delete the current record** in the [Current record](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#current-record) family. Its `group` is `action`, and it needs a trigger with a record: `record_created`, `record_updated`, `record_deleted`, `record_comment_or_reply_created`, `date_field_arrived`, `automation_called` or `weblink_clicked`.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action deletes the current record with the defaults:

```json
{
  "type": "current_record_delete",
  "config": {}
}
```

This action removes a cancelled solar installation request without notifications and attributes the deletion to the user who created the record:

```json
{
  "type": "current_record_delete",
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
| `author_id` | integer | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | User Tape attributes the deletion to: a reference to the creator, the last modifier or a user field. Left out, the automation itself is the author. | `{ "kind": "variable", "source": "meta", "meta_type": "created_by", "app_id": 87 }` |
| `trigger_webhooks` | boolean | Whether the deletion fires outbound webhooks. Default `false`. | `false` |
| `trigger_other_flows` | boolean | Whether the deletion starts other automations. Default `false`. | `false` |
| `silent` | boolean | Whether Tape sends no notifications for the deletion. Default `false`. | `true` |

In the action menu of the automation editor, these keys are **Author**, **Trigger webhooks**, **Trigger automations** and **Silent**.

## General behavior

-   No key is required.
-   The action deletes the record the run works on.
-   Without a trigger that has a record, validation reports the [broken reason](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors#broken-reason-codes) `action_invalid`. `periodic` and `webhook_received` have no record.
-   Without `author_id`, the automation itself is the author. Use a reference in `author_id`: with a literal user ID, `validate` reports `action_user_missing`, even for an existing user, and activation fails.
-   Tape returns `silent` on every read. It's `false` when you left it out.
-   To bring the record back later in the same run, add [`current_record_restore`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-restore).

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   The automation needs a trigger with a record.

## Next steps

[

current\_record\_restore

restore the current record.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-restore)[

Dynamic values

build the reference for `author_id`.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Action examples

configs to copy for the common actions.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
