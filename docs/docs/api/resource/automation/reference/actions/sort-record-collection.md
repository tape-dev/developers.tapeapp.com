# sort_record_collection

> Config reference for the Tape automation sort_record_collection action, with its config keys, defaults and an example.

Use this action to put the records of a record collection from an earlier action in order.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Sort collected records** in the [Record collections](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#record-collections) family. Its `group` is `action`, and it works with every trigger but needs an earlier action that creates the record collection.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

An earlier action collected deals from database app `42`. This action sorts them by **Amount**, highest first, and then by **Close date**:

```json
{
  "type": "sort_record_collection",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 42 },
    "sorts": [
      {
        "variable_def": { "kind": "variable", "source": "field", "field_id": 4055, "field_type": "number", "previous": false, "collection": true, "triggering": false },
        "direction": "desc"
      },
      {
        "variable_def": { "kind": "variable", "source": "field", "field_id": 4061, "field_type": "single_date", "previous": false, "collection": true, "triggering": false },
        "direction": "asc"
      }
    ]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `record_collection` | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** The collection to sort, created by an earlier action. The schema lets you save without it, but validation then reports `action_invalid`. | `{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 42 }` |
| `sorts` | array of [sort entries](#sort-entries) | The sort order, applied in the order given. Empty when left out. | `[{ "variable_def": { … }, "direction": "asc" }]` |

To find the field IDs for `sorts`, see [App and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

### Sort entries

Each entry in `sorts` is an object:

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `variable_def` | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** The field or record metadata to sort by. It must belong to the collection's database app, with `"collection": true`. | `{ "kind": "variable", "source": "field", "field_id": 4055, "field_type": "number", "previous": false, "collection": true, "triggering": false }` |
| `direction` | enum | **Required.** `asc` for ascending, `desc` for descending. | `"desc"` |
| `id` | string | Stable ID of the entry. Tape creates one when you leave it out and returns it on read. | `"sort-1"` |

To sort by record metadata, use a `meta` reference with `"collection": true`: record ID (`app_record_id`), created on (`created_at`), created by (`created_by`), last modified on (`last_modified_at`) or last modified by (`last_modified_by`). For example: `{ "kind": "variable", "source": "meta", "meta_type": "created_at", "app_id": 42, "collection": true }`.

## General behavior

-   `record_collection` has no default. Without it, Tape saves the action, and validation reports `action_invalid`.
-   A `record_collection` without a matching earlier action fails validation with `action_variable_missing`.
-   Without `sorts`, Tape stores an empty list, and the action doesn't change the order.
-   `variable_def` and `direction` are required in every sort entry. A missing one returns `400`.
-   A sort key outside the collection's database app fails validation with `action_variable_missing`.
-   A `meta` sort key without `"collection": true`, or with `record_id`, fails validation with `action_variable_missing`.
-   Tape applies the entries in order. Each later entry breaks ties of the entries before it.
-   Tape sorts the collection in place. Later actions that reference it get the new order.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   An earlier action in the automation must create the collection in `record_collection`, for example [`collect_app_records`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-app-records).

## Next steps

[

filter\_record\_collection

narrow the collection before you sort it.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/filter-record-collection)[

for\_loop

go through the sorted records one by one.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/for-loop)[

Dynamic values

build the `record_collection` reference and the sort keys.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Action examples

configs to copy for the common actions.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
