# filter_record_collection

> Config reference for the Tape automation filter_record_collection action, with its config keys, defaults and an example.

Use this action to narrow a record collection from an earlier action down to the records that match a condition.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Filter collected records** in the [Record collections](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#record-collections) family. Its `group` is `action`, and it works with every trigger but needs an earlier action that creates the record collection.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

An earlier action collected invoices from database app `42`. This action keeps only the invoices whose **Payment status** is **Overdue**:

```json
{
  "type": "filter_record_collection",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 42 },
    "match_condition": {
      "operator": "and",
      "rows": [
        {
          "subject": {
            "kind": "variable",
            "source": "field",
            "field_id": 512,
            "field_type": "single_category",
            "previous": false,
            "collection": true,
            "triggering": false
          },
          "operator": "is_any_of",
          "value": { "type": "ids", "ids": [9001] }
        }
      ]
    }
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `record_collection` | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** The collection to filter, created by an earlier action. The schema lets you save without it, but validation then reports `action_invalid`. | `{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 42 }` |
| `match_condition` | [filter group](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) | `null` | The condition the records must match. An empty AND group when left out or `null`. | `{ "operator": "and", "rows": [] }` |

To find the field IDs for `match_condition`, see [App and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids). To find the option IDs for `ids`, see [Retrieve a single app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app). It returns them in `config.settings.options` of the field.

## Build the condition

-   Each `subject` is a field of the collection's database app, scoped to the collection: `"collection": true`.
-   A subject outside the collection's database app fails validation with `filter_variable_missing`.
-   [`GET /v1/automation/meta/filter`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) returns the operators for each field type.
-   See [Filters](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) for the group shape and the value union.

## General behavior

-   `record_collection` has no default. Without it, Tape saves the action, and validation reports `action_invalid`.
-   A `record_collection` without a matching earlier action fails validation with `action_variable_missing`.
-   Without `match_condition`, the filter keeps every record. An empty condition reads back as `null`.
-   Later actions that reference the same collection get the filtered records.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   An earlier action in the automation must create the collection in `record_collection`, for example [`collect_app_records`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-app-records).

## Next steps

[

sort\_record\_collection

put the filtered records in order.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/sort-record-collection)[

Filters

the filter group used by `match_condition`.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters)[

Dynamic values

build the `record_collection` reference.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Action examples

a collect action followed by an update of the collection.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
