# collected_records_collect_referenced_records

> Config reference for the Tape automation collected_records_collect_referenced_records action, with its config keys, defaults and an example.

Use this action to collect the records that the records of an earlier collection relate to.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Get related records** in the [Record collections](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#record-collections) family. Its `group` is `action`, and it works with every trigger but needs an earlier action that creates the record collection it starts from.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

An earlier action collected solar installations from database app `87`. This action collects the customers that those installations point to:

```json
{
  "type": "collected_records_collect_referenced_records",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 87 },
    "ref_collection_defs": [
      {
        "direction": "outgoing",
        "match_type": "all",
        "app_id": 91,
        "via_field_ids": [55012]
      }
    ]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `record_collection` | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** The collection to start from, created by an earlier action. The schema lets you save without it, but validation then reports `action_invalid`. | `{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 87 }` |
| `ref_collection_defs` | array of reference steps | The steps that Tape follows from the records in the collection. Empty when left out, and then the action collects nothing. | `[{ "direction": "outgoing", "match_type": "all", "app_id": 91 }]` |

Each step has the same keys as in [`collect_referenced_records`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-referenced-records#reference-steps):

-   `direction` (*required*): `outgoing`, `incoming` or `both`.
-   `match_type` (*required*): `all` keeps every related record, `filtered` keeps only the records that match `match_condition`.
-   `app_id`: the related database app. Validation reports `action_app_missing` without it.
-   `via_field_ids`: the relation fields to follow.
-   `match_condition`: a [filter group](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) for the `filtered` mode. An empty AND group when left out, read back as `null`.
-   `id`: stable ID of the step. Tape creates one when you leave it out and returns it on read.

With more than one step, Tape follows them as a chain. Each step starts from the records that the step before it found.

To find `app_id` and the relation field IDs for `via_field_ids`, see [App and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

## Use the collection in later actions

Each step creates a `record_collection` for its `app_id`. A later action references the customers from the example with this object:

```json
{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 91 }
```

-   Tape resolves the reference to the nearest earlier action that creates a collection for the same `app_id`.
-   Use it in `filter_record_collection`, `sort_record_collection`, `clear_record_collection`, the `collected_records_*` actions and the `iterable` of a `for_loop`.
-   See [Record collections](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#record-collections) for the pattern.

## General behavior

-   This action uses one collection and creates another. It starts from `record_collection` and fills a record collection for the `app_id` of each step.
-   `record_collection` has no default. Without it, Tape saves the action, and validation reports `action_invalid`.
-   A `record_collection` without a matching earlier action fails validation with `action_variable_missing`.
-   `direction` and `match_type` have no default. Send both on every step, as lower-case tokens.
-   Neither the save nor [`validate`](https://developers.tapeapp.com/docs/api/resource/automation/execution) reports a step without `direction` or `match_type`. The step then reads back without both keys.
-   Each step's `app_id` must relate to the database app before it. Otherwise validation reports `action_app_invalid`.
-   For each step, the run log shows how many records Tape collected.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   An earlier action in the automation must create the collection in `record_collection`, for example [`collect_app_records`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-app-records).

## Next steps

[

collect\_referenced\_records

start from the current record instead.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-referenced-records)[

Filters

the filter group used by each step's `match_condition`.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters)[

Dynamic values

build the `record_collection` reference.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
