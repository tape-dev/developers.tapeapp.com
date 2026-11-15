# collect_app_records

> Config reference for the Tape automation collect_app_records action, with its config keys, defaults and an example.

Use this action to collect records from a database app into a record collection that later actions can use.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Search for records** in the [Record collections](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#record-collections) family. Its `group` is `action`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action collects up to 100 listings whose **Address** field isn't empty:

```json
{
  "type": "collect_app_records",
  "config": {
    "app_id": 4821,
    "match_condition": {
      "operator": "and",
      "rows": [
        {
          "subject": {
            "kind": "variable",
            "source": "field",
            "field_id": 55012,
            "field_type": "single_text",
            "previous": false,
            "collection": false,
            "triggering": false
          },
          "operator": "is_not_empty"
        }
      ]
    },
    "limit": 100,
    "limit_enabled": true
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `app_id` | integer | ID of the database app to collect records from. Without it, Tape skips the action when the automation runs. | `4821` |
| `match_condition` | [filter group](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) | `null` | Filters the records to collect. Left out, Tape collects every record of the database app. A filter that matches everything reads back as `null`. | `null` |
| `limit` | integer | Maximum number of records to collect. Takes effect only when `limit_enabled` is `true`. Default `1`. | `100` |
| `limit_enabled` | boolean | Whether Tape applies `limit`. Default `false`. | `true` |

To find `app_id` and the field IDs for `match_condition`, see [App and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

## Use the collection in later actions

This action creates a `record_collection` for the database app in `app_id`. A later action references it with this object:

```json
{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 4821 }
```

-   Tape resolves the reference to the nearest earlier action that creates a collection for the same `app_id`.
-   Use it in `filter_record_collection`, `sort_record_collection`, `clear_record_collection`, the `collected_records_*` actions and the `iterable` of a `for_loop`.
-   See [Record collections](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#record-collections) for the pattern.

## General behavior

-   Every key is optional when you save. Tape fills in the defaults.
-   Every collect stops at 1000 records when the automation runs, with or without `limit_enabled`.
-   Tape stores a `limit` above 1000 and reads it back unchanged. Neither the write nor `validate` warns. See [Limits and throttling](https://developers.tapeapp.com/docs/automations/limitations).
-   Without `app_id`, the action saves and passes validation. When the automation runs, Tape skips it.
-   An `app_id` of a deleted app fails validation with `action_app_missing`. An `app_id` that never existed makes `validate` and activate return `404`. See [Errors & broken reasons](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors).

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.

## Next steps

[

collect\_app\_view\_records

collect the records of a view instead.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-app-view-records)[

Filters

the filter group used by `match_condition`.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters)[

Dynamic values

build references to fields and collections.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Action examples

a collect action followed by an update of the collection.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
