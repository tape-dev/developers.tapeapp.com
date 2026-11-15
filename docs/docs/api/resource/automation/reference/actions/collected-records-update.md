# collected_records_update

> Config reference for the Tape automation collected_records_update action, with its config keys, defaults and an example.

Use this action to update every record in a collection that an earlier action built.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Update all collected records** in the [Record collections](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#record-collections) family. Its `group` is `action`, and it works with every trigger but needs an earlier action that creates the record collection.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action marks every collected task as ready for review:

```json
{
  "type": "collected_records_update",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 5 },
    "field_assignments": [
      {
        "field_type": "single_text",
        "variable_def": { "kind": "variable", "source": "field", "field_id": 4021, "field_type": "single_text", "previous": false, "collection": false, "triggering": false },
        "assignment_type": "set",
        "field_value": ["Ready for review"]
      }
    ],
    "silent": true
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `record_collection` | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** The collection to update, created by an earlier action. The schema lets you save without it, but validation then reports `action_invalid`. | `{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 5 }` |
| `field_assignments` | array of field assignments | The values to set on each collected record, one entry per field. Empty when left out. See [Field assignments](#field-assignments). | `[]` |
| `author_id` | integer | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | User Tape attributes the change to: a user ID, or a reference to the creator, the last modifier or a user field. Left out, the automation itself is the author. | `812` |
| `trigger_webhooks` | boolean | Whether the change fires outbound webhooks. Default `false`. | `false` |
| `trigger_other_flows` | boolean | Whether the change starts other automations. Default `false`. | `false` |
| `silent` | boolean | Whether Tape sends no notifications for the change. Default `false`. | `true` |

To find the field IDs, see [App and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

`author_id`, `trigger_webhooks`, `trigger_other_flows` and `silent` are shared by every action that changes records. In the action menu of the automation editor, they are **Author**, **Trigger webhooks**, **Trigger automations** and **Silent**. To find a user ID for `author_id`, see [Retrieve organization users](https://developers.tapeapp.com/docs/api/resource/user#retrieve-organization-users).

### Field assignments

Each entry in `field_assignments` sets one field on every collected record.

-   `field_type` tells the 20 field-type shapes apart, for example `single_text` or `number`.
-   `variable_def` is a [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) to the target field.
-   `assignment_type` picks how Tape produces the value. `set` uses `field_value`, `set_code` uses `code`.

[`meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) describes the populated shape only loosely. Copy the shapes from [`current_record_update`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-update#field-assignments) and check the live `config_schema` before you send filled assignments.

## General behavior

-   No key is required by the schema. Without `record_collection`, Tape saves the action, and validation reports `action_invalid`.
-   A `record_collection` without a matching earlier action fails validation with `action_variable_missing`. Tape resolves the reference to the nearest earlier action that creates a collection for the same `app_id`.
-   Left out or `[]`, `field_assignments` changes no field value. The action still logs a `success` step for each collected record.
-   On an empty collection, the action changes nothing and logs one `success` step with the message `No records were found in the collection.`
-   Without `author_id`, the automation itself is the author. A user ID that Tape can't find gives the broken reason `action_user_missing`.
-   Tape returns `silent` on every read. It's `false` when you left it out.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   An earlier action in the automation must create the collection in `record_collection`, for example [`collect_app_records`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-app-records).

## Next steps

[

referenced\_records\_update

update the records related to the current record.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/referenced-records-update)[

current\_record\_update

update only the record the run works on.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-update)[

Dynamic values

build references and template values.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Action examples

a full collect-and-update payload.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
