# clear_record_collection

> Config reference for the Tape automation clear_record_collection action, with its config key and an example.

Use this action to empty a record collection from an earlier action.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Clear collected records** in the [Record collections](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#record-collections) family. Its `group` is `action`, and it works with every trigger but needs an earlier action that creates the record collection.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

An earlier action collected job candidates from database app `100`. This action empties that collection:

```json
{
  "type": "clear_record_collection",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 100 }
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `record_collection` | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** The collection to empty, created by an earlier action. The schema lets you save without it, but validation then reports `action_invalid`. | `{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 100 }` |

## General behavior

-   `record_collection` is the only key. It has no default.
-   Without `record_collection`, Tape saves the action, and validation reports `action_invalid`.
-   A `record_collection` without a matching earlier action fails validation with `action_variable_missing`.
-   Reference a collection from a collect action, not a single field value.
-   Later actions that reference the same collection get an empty list.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   An earlier action in the automation must create the collection in `record_collection`, for example [`collect_app_records`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-app-records).

## Next steps

[

filter\_record\_collection

keep only some records instead of none.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/filter-record-collection)[

Dynamic values

build the `record_collection` reference.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Action examples

configs to copy for the common actions.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
