---
id: collected-records-call-automation
title: collected_records_call_automation
sidebar_label: collected_records_call_automation
description: Config reference for the Tape automation collected_records_call_automation action, with its config keys, defaults and an example.
---

Use this action to call another automation once for every record in a collection.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Trigger another automation on collected records** in the [Automation calls & weblinks](/docs/api/resource/automation/reference/actions#automation-calls--weblinks) family. Its `group` is `action`, and it works with every trigger but needs an earlier action that creates the record collection.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

An earlier action collects the contracts that renew next quarter. This action calls the renewal reminder automation for each of them:

```json
{
  "type": "collected_records_call_automation",
  "config": {
    "automation_id": 4022,
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 2087 },
    "call_arguments": [
      {
        "variable_def": { "custom_type": "any", "label": "Renewal quarter" },
        "assignment_type": "set",
        "value": ["Q1 2027"]
      }
    ]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `automation_id` | integer | **Required.** ID of the automation to call for each record. The schema lets you save without it, but validation then reports `action_automation_missing`. | `4022` |
| `record_collection` | [reference](/docs/api/resource/automation/dynamic-values) | **Required.** The collection whose records Tape calls the automation for, created by an earlier action. The schema lets you save without it, but validation then reports `action_invalid` and `action_automation_invalid`. | `{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 2087 }` |
| `call_arguments` | array of call arguments | Values for the inputs that the called automation declares. Empty when left out. | `[]` |

To find `automation_id`, see [List automations](/docs/api/resource/automation/manage#list-automations). It returns the ID of each automation as `id`.

Each `call_arguments` entry has the same shape as in [`current_record_call_automation`](/docs/api/resource/automation/reference/actions/current-record-call-automation#call-arguments):

- `variable_def` (*required*): the input to fill, as `{ "custom_type", "label" }`.
- `assignment_type`: `set` uses `value` (a template value), `set_code` uses `code` (a code value). Default `set`.
- `id`: stable ID of the entry. Tape creates one when you leave it out and returns it on read.

## General behavior {#validation--behavior}

- No key is required by the schema. Tape saves the action without `automation_id`, `record_collection` or `call_arguments`.
- Tape calls the target automation *once per record* in the collection.
- Without `record_collection`, validation reports `action_invalid`. It also reports `action_automation_invalid`, because Tape then has no database app to check the target against.
- A `record_collection` without a matching earlier action fails validation with `action_variable_missing`. Tape resolves the reference to the nearest earlier action that creates a collection for the same `app_id`.
- The target automation must exist. Otherwise validation reports `action_automation_missing`.
- The target must live in the database app of the collected records and use the `automation_called` trigger. Otherwise validation reports `action_automation_invalid`.
- A *paused* target is a valid reference.
- Each `call_arguments` label must match a custom variable of the target's trigger, with `custom_variable_defs_enabled` set to `true`. Otherwise validation reports `action_call_argument_invalid`.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.
- An earlier action in the automation must create the collection in `record_collection`, for example [`collect_app_records`](/docs/api/resource/automation/reference/actions/collect-app-records).
- The target automation uses the `automation_called` trigger and lives in the database app of the collected records.

<a id="see-also"></a>

## Next steps

- [current_record_call_automation](/docs/api/resource/automation/reference/actions/current-record-call-automation): call the target for the current record only.
- [Triggers](/docs/api/resource/automation/reference/triggers): set up `automation_called` and its custom variables on the target.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): references for `record_collection` and `call_arguments`.
- [Errors & broken reasons](/docs/api/resource/automation/reference/errors): what the validation codes mean.
- [Action examples](/docs/api/resource/automation/action-examples): a complete payload that collects records and uses the collection.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
