# custom_variable

> Config reference for the Tape automation custom_variable action, with its config keys, defaults and an example.

Use this action to compute a value and store it in a variable for later actions.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Perform a calculation** in the [Code & variables](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#code--variables) family. Its `group` is `action`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action estimates the yearly yield of a solar system from its size in kWp and stores the result in the variable `Annual yield (kWh)`:

```json
{
  "type": "custom_variable",
  "config": {
    "assignment_code": [
      "Math.round(Number(",
      { "kind": "variable", "source": "field", "field_id": 702, "field_type": "number", "previous": false, "collection": false, "triggering": false },
      ") * 950)"
    ],
    "custom_variable_defs": [
      { "custom_type": "any", "label": "Annual yield (kWh)" }
    ]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `assignment_code` | [code value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** One JavaScript expression. Tape stores its value in the declared variable. A plain string works too. | `["1 + 1"]` |
| `custom_variable_defs` | array of [variable declarations](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | The variable that receives the value. Each entry is `{ "custom_type", "label" }`, and both keys are required. Empty when left out. | `[{ "custom_type": "any", "label": "Total" }]` |

### Variable types

`custom_type` takes one of these lower-case tokens:

-   `any`
-   `single_file`
-   `multi_file`
-   `single_link`
-   `html_table_rows`

> Why does my action save but do nothing?
> 
> With an empty or missing `custom_variable_defs`, this action still validates and saves. When the automation runs, Tape skips it without a per-action log, as it does with an empty `assignment_code`. Declare one variable so the action has a target.

## Use the variable in a later action

Tape stores the value in the first variable of `custom_variable_defs`. A later action reads it with a `custom` reference that has the same `custom_type` and `label`:

```json
{ "kind": "variable", "source": "custom", "custom_type": "any", "label": "Annual yield (kWh)" }
```

## General behavior

-   `assignment_code` is the only required key. It has no default. `custom_variable_defs` defaults to `[]`.
-   Tape evaluates `assignment_code` as one expression. Write `1 + 1`, not `return 1 + 1;`. A top-level `return` fails when the automation runs, with `Illegal return statement`.
-   To store an object literal, wrap it in parentheses: `["({ total: ", …, " })"]`. Without them, JavaScript reads the braces as a block.
-   Declare one variable per action.
-   The action's own `assignment_code` can't reference the variable.
-   The write path doesn't check the syntax. A broken expression saves and passes `validate`. The error shows up only in the run log.
-   For a block of statements instead of one expression, use [`custom_code`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/custom-code).

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.

## Next steps

[

custom\_code

run several statements and fill more than one variable.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/custom-code)[

for\_loop

loop over a custom variable.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/for-loop)[

Dynamic values

code values and `custom` references.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Libraries

Node.js libraries you can call in `assignment_code`.

](https://developers.tapeapp.com/docs/automations/libraries)[

Action examples

configs to copy for the common actions.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
