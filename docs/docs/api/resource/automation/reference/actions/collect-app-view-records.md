# collect_app_view_records

> Config reference for the Tape automation collect_app_view_records action, with its config keys, defaults and an example.

Use this action to collect the records of a view into a record collection that later actions can use.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Get records of a view** in the [Record collections](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#record-collections) family. Its `group` is `action`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action collects up to 100 records from an **Open deals** view:

```json
{
  "type": "collect_app_view_records",
  "config": {
    "app_id": 4201,
    "app_view_id": 9317,
    "limit": 100,
    "limit_enabled": true
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `app_id` | integer | ID of the database app the view belongs to. Without it, Tape skips the action when the automation runs. | `4201` |
| `app_view_id` | integer | **Required.** ID of the view to collect records from. The schema lets you save without it, but validation then reports `action_view_missing`. | `9317` |
| `limit` | integer | Maximum number of records to collect. Takes effect only when `limit_enabled` is `true`. Default `1`, like a new action in the editor. | `100` |
| `limit_enabled` | boolean | Whether Tape applies `limit`. Default `false`. | `true` |

To find `app_id`, see [App and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids). To find `app_view_id`, see [Retrieve views for an app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-views-for-an-app). It returns the ID of each public view as `view_id`.

## Use the collection in later actions

This action creates a `record_collection` for the database app in `app_id`. A later action references it with this object:

```json
{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 4201 }
```

-   Tape resolves the reference to the nearest earlier action that creates a collection for the same `app_id`.
-   Use it in `filter_record_collection`, `sort_record_collection`, `clear_record_collection`, the `collected_records_*` actions and the `iterable` of a `for_loop`.
-   See [Record collections](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#record-collections) for the pattern.

## General behavior

-   Tape collects the records that the view returns, with the view's own filters.
-   Validation checks `app_view_id` for presence only. A view ID that doesn't exist passes validation and fails when the automation runs.
-   Without `app_id`, the action saves and passes validation. When the automation runs, Tape skips it.
-   An `app_id` of a deleted app fails validation with `action_app_missing`. An `app_id` that never existed makes `validate` and activate return `404`.
-   Without `limit` and `limit_enabled`, Tape fills in the defaults.
-   Every collect stops at 1000 records when the automation runs, with or without `limit_enabled`.
-   Tape stores a `limit` above 1000, or one with `limit_enabled: false`, and reads it back unchanged. Neither the write nor `validate` warns. See [Limits and throttling](https://developers.tapeapp.com/docs/automations/limitations).

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   The view in `app_view_id` must exist in the database app in `app_id`.

## Next steps

[

collect\_app\_records

collect records with your own filter instead of a view.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-app-records)[

Dynamic values

build references to fields and collections.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Errors & broken reasons

what `action_view_missing` and `action_app_missing` mean.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors)[

Action examples

a collect action followed by an update of the collection.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
