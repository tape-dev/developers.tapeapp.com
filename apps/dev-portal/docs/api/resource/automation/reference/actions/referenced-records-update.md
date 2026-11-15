---
id: referenced-records-update
title: referenced_records_update
sidebar_label: referenced_records_update
description: Config reference for the Tape automation referenced_records_update action, with its config keys, defaults and an example.
---

Use this action to update the records that relate to the record an automation runs on.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Update all related records** in the [Record collections](/docs/api/resource/automation/reference/actions#record-collections) family. Its `group` is `action`, and it needs a trigger with a record in a database app, because Tape looks up the related records from that record.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

When a solar project changes, this action updates every related installation:

```json
{
  "type": "referenced_records_update",
  "config": {
    "app_id": 1044,
    "field_assignments": [
      {
        "field_type": "single_text",
        "variable_def": { "kind": "variable", "source": "field", "field_id": 4021, "field_type": "single_text", "previous": false, "collection": false, "triggering": false },
        "assignment_type": "set",
        "field_value": ["Permit approved"]
      }
    ],
    "silent": true
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `app_id` | integer | **Required.** ID of the database app that holds the related records. It must relate to the trigger's database app, in either direction. The schema lets you save without it, but validation then reports `action_app_missing`. | `1044` |
| `field_assignments` | array of field assignments | The values to set on each related record, one entry per field. Empty when left out. See [Field assignments](#field-assignments). | `[]` |
| `author_id` | integer \| [reference](/docs/api/resource/automation/dynamic-values) | User Tape attributes the change to: a user ID, or a reference to the creator, the last modifier or a user field. Left out, the automation itself is the author. | `812` |
| `trigger_webhooks` | boolean | Whether the change fires outbound webhooks. Default `false`. | `false` |
| `trigger_other_flows` | boolean | Whether the change starts other automations. Default `false`. | `false` |
| `silent` | boolean | Whether Tape sends no notifications for the change. Default `false`. | `true` |

To find `app_id` and the field IDs, see [App and field IDs](/docs/api/resource/app#find-app-and-field-ids).

`author_id`, `trigger_webhooks`, `trigger_other_flows` and `silent` are shared by every action that changes records. In the action menu of the automation editor, they are **Author**, **Trigger webhooks**, **Trigger automations** and **Silent**. To find a user ID for `author_id`, see [Retrieve organization users](/docs/api/resource/user#retrieve-organization-users).

### Field assignments

Each entry in `field_assignments` sets one field on every related record.

- `field_type` tells the 20 field-type shapes apart, for example `single_text` or `number`.
- `variable_def` is a [reference](/docs/api/resource/automation/dynamic-values) to the target field.
- `assignment_type` picks how Tape produces the value. `set` uses `field_value`, `set_code` uses `code`. The unused value stays empty.

[`meta/action`](/docs/api/resource/automation/discovery) describes the populated shape only loosely. Copy the shapes from [`current_record_update`](/docs/api/resource/automation/reference/actions/current-record-update#field-assignments) and check the live `config_schema` before you send filled assignments.

## General behavior {#validation--behavior}

- No key is required by the schema. Validation needs `app_id`.
- Tape updates the records in `app_id` that relate to the current record, in both directions.
- An `app_id` that doesn't relate to the trigger's database app fails validation with `action_app_invalid`.
- Validation doesn't check the trigger for this action. With a trigger that has no record, such as `periodic`, Tape skips the action when the automation runs.
- Left out or `[]`, `field_assignments` changes no field value. The action still logs a `success` step for each related record.
- If the current record has no related records in `app_id`, the action does nothing and writes *no step* to the run log.
- Later actions can use the updated records as a record collection of `app_id`.
- Without `author_id`, the automation itself is the author. A user ID that Tape can't find gives the broken reason `action_user_missing`.
- Tape returns `silent` on every read. It's `false` when you left it out.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.
- The trigger must run on a record of a database app. The database app in `app_id` must relate to it.

<a id="see-also"></a>

## Next steps

- [collected_records_update](/docs/api/resource/automation/reference/actions/collected-records-update): update every record in a collection.
- [current_record_update](/docs/api/resource/automation/reference/actions/current-record-update): update only the record the run works on.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): build references and template values.
- [Errors & broken reasons](/docs/api/resource/automation/reference/errors): what `action_app_missing` and `action_app_invalid` mean.
- [Action examples](/docs/api/resource/automation/action-examples): configs to copy for the common actions.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
