# current_record_call_automation

> Config reference for the Tape automation current_record_call_automation action, with its config keys, defaults and an example.

Use this action to call another automation and pass it the record that this automation runs on.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Trigger another automation on the current record** in the [Automation calls & weblinks](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#automation-calls--weblinks) family. Its `group` is `action`, and it needs a trigger with a record: `record_created`, `record_updated`, `record_deleted`, `record_comment_or_reply_created`, `date_field_arrived`, `automation_called` or `weblink_clicked`.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

When a listing is marked as sold, this action calls the automation that notifies the buyer's agent and passes a closing note:

```json
{
  "type": "current_record_call_automation",
  "config": {
    "automation_id": 4021,
    "call_arguments": [
      {
        "variable_def": { "custom_type": "any", "label": "Closing note" },
        "assignment_type": "set",
        "value": ["Sold at asking price. Listing ", { "kind": "variable", "source": "meta", "meta_type": "app_record_id", "app_id": 87 }]
      }
    ]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `automation_id` | integer | **Required.** ID of the automation to call. The schema lets you save without it, but validation then reports `action_automation_missing`. | `4021` |
| `call_arguments` | array of [call arguments](#call-arguments) | Values for the inputs that the called automation declares. Empty when left out. | `[]` |

To find `automation_id`, see [List automations](https://developers.tapeapp.com/docs/api/resource/automation/manage#list-automations). It returns the ID of each automation as `id`.

### Call arguments

Each entry in `call_arguments` binds one input of the called automation:

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `variable_def` | object | **Required.** The input to fill, as `{ "custom_type", "label" }`. The `label` must match a custom variable that the called automation's trigger declares. | `{ "custom_type": "any", "label": "Closing note" }` |
| `assignment_type` | enum | Where the value comes from: `set` uses `value`, `set_code` uses `code`. Default `set`. | `"set"` |
| `value` | [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | The value for `set`. Empty when left out. | `["Sold"]` |
| `code` | [code value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | The expression for `set_code`. Empty when left out. | `["1 + 1"]` |
| `id` | string | Stable ID of the entry. Tape creates one when you leave it out and returns it on read. | `"a1b2c3"` |

`custom_type` takes one of `any`, `single_file`, `multi_file`, `single_link`, `html_table_rows`.

The called automation declares the input in its trigger:

```json
{ "type": "automation_called", "config": { "custom_variable_defs_enabled": true, "custom_variable_defs": [{ "custom_type": "any", "label": "Closing note" }] } }
```

## General behavior

-   No key is required by the schema. Tape saves the action without `automation_id` or `call_arguments`.
-   The target automation must exist. Otherwise validation reports `action_automation_missing`.
-   The target must live in the same database app as this automation's trigger and use the `automation_called` trigger. Otherwise validation reports `action_automation_invalid`.
-   A *paused* target is a valid reference.
-   Each `call_arguments` label must match a custom variable of the target's trigger, with `custom_variable_defs_enabled` set to `true`. Otherwise validation reports `action_call_argument_invalid`.
-   Without a trigger that has a record, validation reports the [broken reason](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors#broken-reason-codes) `action_invalid`. `periodic` and `webhook_received` have no record.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   The automation needs a trigger with a record.
-   The target automation uses the `automation_called` trigger and lives in the same database app.

## Next steps

[

collected\_records\_call\_automation

call the target once per record in a collection.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collected-records-call-automation)[

Triggers

set up `automation_called` and its custom variables on the target.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers)[

Dynamic values

build template values, code values and references.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Errors & broken reasons

what the validation codes mean.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
