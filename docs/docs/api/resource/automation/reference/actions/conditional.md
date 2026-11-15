# conditional

> Config reference for the Tape automation conditional action, with its config keys, defaults and an example.

Use this action to run nested actions only when a condition holds, with an optional else branch.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Conditional actions** in the [Flow control](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#flow-control) family. Its `group` is `control_flow`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

When a deal is worth more than 50,000, this action asks the sales director for approval. Otherwise, it tells the account owner that the deal is ready to close:

```json
{
  "type": "conditional",
  "config": {
    "condition": {
      "operator": "and",
      "rows": [
        {
          "subject": { "kind": "variable", "source": "field", "field_id": 601, "field_type": "number", "previous": false, "collection": false, "triggering": false },
          "operator": "greater_than",
          "value": { "type": "number", "number": ["50000"] }
        }
      ]
    },
    "action_rows": [
      {
        "type": "send_email",
        "config": {
          "to_address": ["romeo@acme.com"],
          "subject": ["Approval needed: deal over 50,000"]
        }
      }
    ],
    "else_action_rows": [
      {
        "type": "send_email",
        "config": {
          "to_address": ["juliet@acme.com"],
          "subject": ["Deal ready to close"]
        }
      }
    ]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `condition` | [filter group](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) | `null` | The if condition. `null` or left out counts as true. | `{ "operator": "and", "rows": [ … ] }` |
| `action_rows` | array of nested [actions](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions) | The then branch. Runs when the condition holds. Empty when left out. | `[{ "type": "send_email", "config": { … } }]` |
| `else_action_rows` | array of nested [actions](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions) | The else branch. Runs when the condition fails. Leave it out to switch the else branch off. | `[{ "type": "exit", "config": { "exit_type": "success" } }]` |

To find the field IDs, see [App and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

## General behavior

-   No key is required.
-   The condition and both branches live in `config`, like every other action. Each branch is a nested list of actions.
-   A missing, `null` or empty `condition` counts as true. The then branch runs on every run. It reads back as `condition: null`.
-   Leave `else_action_rows` out to switch the else branch off. Send it, even as `[]`, to switch it on. There are no `*_enabled` flags.
-   `action_rows` and `else_action_rows` hold full action objects. `GET /v1/automation/meta/action` lists the types you can nest.
-   When the API rejects the input of a nested action, the error names its path, for example `config/else_action_rows/0`.
-   `condition` uses the same filter tree as the collect actions. [`GET /v1/automation/meta/filter`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) lists the operators for each field type.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.

## Next steps

[

exit

end the run inside a branch.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/exit)[

for\_loop

check the condition once per collected record.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/for-loop)[

Filters

the filter group used by `condition`.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters)[

Dynamic values

field references for the condition's subject.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Action examples

configs to copy for the common actions.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
