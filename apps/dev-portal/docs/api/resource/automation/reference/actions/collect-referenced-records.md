---
id: collect-referenced-records
title: collect_referenced_records
sidebar_label: collect_referenced_records
description: Config reference for the Tape automation collect_referenced_records action, with its config keys, defaults and an example.
---

Use this action to collect the records that the current record relates to, by following its relation fields.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Get related records for the current record** in the [Record collections](/docs/api/resource/automation/reference/actions#record-collections) family. Its `group` is `action`, and it needs a trigger with a record: `record_created`, `record_updated`, `record_deleted`, `record_comment_or_reply_created`, `date_field_arrived`, `automation_called` or `weblink_clicked`. The current record is the record that the automation runs on.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

Starting from a project, this action collects the open tasks that the project's **Tasks** relation field points to:

```json
{
  "type": "collect_referenced_records",
  "config": {
    "ref_collection_defs": [
      {
        "direction": "outgoing",
        "match_type": "filtered",
        "app_id": 1204,
        "via_field_ids": [88123],
        "match_condition": {
          "operator": "and",
          "rows": [
            {
              "subject": {
                "kind": "variable",
                "source": "field",
                "field_id": 88140,
                "field_type": "single_category",
                "previous": false,
                "collection": false,
                "triggering": false
              },
              "operator": "is_any_of",
              "value": { "type": "ids", "ids": [3] }
            }
          ]
        }
      }
    ]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `ref_collection_defs` | array of [reference steps](#reference-steps) | The steps that Tape follows from the current record. Empty when left out, and then the action collects nothing. | `[{ "direction": "outgoing", "match_type": "all", "app_id": 1204 }]` |

To find `app_id` and the relation field IDs for `via_field_ids`, see [App and field IDs](/docs/api/resource/app#find-app-and-field-ids). To find the option IDs for `ids`, see [Retrieve a single app](/docs/api/resource/app#retrieve-a-single-app). It returns them in `config.settings.options` of the field.

### Reference steps

Each entry in `ref_collection_defs` is one step along the relations:

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `direction` | enum | **Required.** Which relations to follow. See [Directions](#directions). | `"outgoing"` |
| `match_type` | enum | **Required.** `all` keeps every related record. `filtered` keeps only the records that match `match_condition`. | `"filtered"` |
| `app_id` | integer | **Required.** ID of the related database app to collect from. The schema lets you save without it, but validation then reports `action_app_missing`. | `1204` |
| `via_field_ids` | array of integers | The relation fields to follow. Left out, Tape follows every relation field to that database app. | `[88123]` |
| `match_condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | Filters the related records in the `filtered` mode. Ignored with `match_type: "all"`. An empty AND group when left out, read back as `null`. | `null` |
| `id` | string | Stable ID of the step. Tape creates one when you leave it out and returns it on read. | `"step-1"` |

### Directions

`direction` takes one of these lower-case tokens:

- `outgoing`: records that this record points to through its own relation fields. In the editor, **Outgoing via**.
- `incoming`: records that point to this record through their relation fields. In the editor, **Incoming via**.
- `both`: records in either direction. In the editor, **Both directions**.

### Several steps in a row

With more than one step, Tape follows them as a chain.

- The first step starts from the current record.
- Each later step starts from the records that the step before it found.
- Each step fills a record collection for its own `app_id`.
- A step's `app_id` must be a database app that the previous database app relates to. Otherwise validation reports `action_app_invalid`.

## Use the collection in later actions

Each step creates a `record_collection` for its `app_id`. A later action references the tasks from the example with this object:

```json
{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 1204 }
```

- Tape resolves the reference to the nearest earlier action that creates a collection for the same `app_id`.
- Use it in `filter_record_collection`, `sort_record_collection`, `clear_record_collection`, the `collected_records_*` actions and the `iterable` of a `for_loop`.
- See [Record collections](/docs/api/resource/automation/reference/actions#record-collections) for the pattern.

## General behavior {#validation--behavior}

- `ref_collection_defs` is optional when you save.
- `direction` and `match_type` have no default. Send both on every step, as lower-case tokens.
- Neither the save nor [`validate`](/docs/api/resource/automation/execution) reports a step without `direction` or `match_type`. The step then reads back without both keys.
- Without a trigger that has a record, validation reports the [broken reason](/docs/api/resource/automation/reference/errors#broken-reason-codes) `action_invalid`. `periodic` and `webhook_received` have no record.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.
- The automation needs a trigger with a record.
- The database app of each step must relate to the database app before it.

<a id="see-also"></a>

## Next steps

- [collected_records_collect_referenced_records](/docs/api/resource/automation/reference/actions/collected-records-collect-referenced-records): start from a collection instead of the current record.
- [Filters](/docs/api/resource/automation/reference/filters): the filter group used by `match_condition`.
- [Triggers](/docs/api/resource/automation/reference/triggers): which triggers carry a record.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): reference the collection in later actions.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
