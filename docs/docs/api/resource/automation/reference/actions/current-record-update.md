# current_record_update

> Config reference for the Tape automation current_record_update action, with its config keys, defaults and an example.

Use this action to change field values of the record that an automation runs on.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Update the current record** in the [Current record](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#current-record) family. Its `group` is `action`, and it needs a trigger with a record: `record_created`, `record_updated`, `record_deleted`, `record_comment_or_reply_created`, `date_field_arrived`, `automation_called` or `weblink_clicked`.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

When a property listing changes, this action stamps a review note and sets the category option **In review**:

```json
{
  "type": "current_record_update",
  "config": {
    "field_assignments": [
      {
        "field_type": "single_text",
        "variable_def": { "kind": "variable", "source": "field", "field_id": 4021, "field_type": "single_text", "previous": false, "collection": false, "triggering": false },
        "assignment_type": "set",
        "field_value": ["Listing changed, review the asking price"]
      },
      {
        "field_type": "single_category",
        "variable_def": { "kind": "variable", "source": "field", "field_id": 4022, "field_type": "single_category", "previous": false, "collection": false, "triggering": false },
        "assignment_type": "set",
        "field_category_option_id": 2
      }
    ],
    "silent": true
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `field_assignments` | array of [field assignments](#field-assignments) | Values Tape writes into the current record, one entry per field. Empty when left out. | `[]` |
| `author_id` | integer | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | User Tape attributes the change to: a user ID, or a reference to the creator, the last modifier or a user field. Left out, the automation itself is the author. | `{ "kind": "variable", "source": "meta", "meta_type": "last_modified_by", "app_id": 87 }` |
| `trigger_webhooks` | boolean | Whether the change fires outbound webhooks. Default `false`. | `false` |
| `trigger_other_flows` | boolean | Whether the change starts other automations. Default `false`. | `false` |
| `silent` | boolean | Whether Tape sends no notifications for the change. Default `false`. | `true` |

To find the field IDs, see [App and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids). To find the option ID for `field_category_option_id`, see [Retrieve a single app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app). It returns the options in `config.settings.options` of the field.

`author_id`, `trigger_webhooks`, `trigger_other_flows` and `silent` are shared by every action that changes records. In the action menu of the automation editor, they are **Author**, **Trigger webhooks**, **Trigger automations** and **Silent**. To find a user ID for `author_id`, see [Retrieve organization users](https://developers.tapeapp.com/docs/api/resource/user#retrieve-organization-users).

### Field assignments

Each entry of `field_assignments` sets one field of the current record. There are 20 assignment shapes, one per field type. They share these members:

-   `field_type` (*required*): the type of the target field, for example `single_text` or `single_category`. It selects the shape of the entry.
-   `variable_def` (*required*): a field [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) to the target field, with `source: "field"`, `field_id` and `field_type`.
-   `assignment_type`: how Tape produces the value. The modes depend on the field type. A `single_text` entry takes `set`, `unset` or `set_code`.
-   A value member that fits the mode: `field_value` for `set` on a text field, `field_category_option_id` for `set` on a category field, `code` for `set_code`. `unset` carries no value. `code` holds a JavaScript expression, for example `[<reference>, ".price"]`. For a text field, the expression must return text, for example `["String(", <reference>, ".price)"]`. A number fails the action when the automation runs. `field_value` is a [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) and can hold references, for example to a `custom` variable.
-   `id`: stable ID of the entry. Tape creates one when you leave it out and returns it on read.

[`meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) describes the populated shape only loosely. Copy the shapes from the example above and check the live `config_schema` before you send filled assignments.

## General behavior

-   No key is required by the schema. Left out or `[]`, `field_assignments` changes no field value. The action still logs a `success` step and updates the record's `last_modified_on` and `last_modified_by`.
-   The action changes the record the run works on. To change other records, use `referenced_records_update` or `collected_records_update`.
-   Without a trigger that has a record, validation reports the [broken reason](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors#broken-reason-codes) `action_invalid`. `periodic` and `webhook_received` have no record.
-   Tape refuses an entry with `400` when its mode needs a value that the entry doesn't send. For example, `set` without `field_value` on a text field.
-   Without `author_id`, the automation itself is the author. A user ID that Tape can't find gives the broken reason `action_user_missing`.
-   Tape returns `silent` on every read. It's `false` when you left it out.
-   Keep `trigger_other_flows` at `false` to avoid a loop when the automation triggers on record updates.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   The automation needs a trigger with a record.

## Next steps

[

referenced\_records\_update

update the records related to the current record.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/referenced-records-update)[

collected\_records\_update

update every record in a collection.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collected-records-update)[

Dynamic values

build template values and references.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Action examples

configs to copy for the common actions.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
