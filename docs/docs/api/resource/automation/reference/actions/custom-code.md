# custom_code

> Config reference for the Tape automation custom_code action, with its config keys, defaults and an example.

Use this action to run your own JavaScript in an automation.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Execute a script** in the [Code & variables](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#code--variables) family. Its `group` is `action`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action reads the deal value of a sales record and stores a 3 % commission in the variable `Commission`:

```json
{
  "type": "custom_code",
  "config": {
    "code": [
      "const dealValue = Number(",
      { "kind": "variable", "source": "field", "field_id": 601, "field_type": "number", "previous": false, "collection": false, "triggering": false },
      ");\n",
      { "kind": "variable", "source": "custom", "custom_type": "any", "label": "Commission" },
      " = Math.round(dealValue * 0.03);"
    ],
    "custom_variable_defs": [
      { "custom_type": "any", "label": "Commission" }
    ]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `code` | [code value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** The JavaScript the action runs. String literals mixed with variable references. A plain string works too. | `["const total = 1 + 1;"]` |
| `custom_variable_defs` | array of [variable declarations](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Custom variables this action declares. Its own code and later actions can use them. Empty when left out. | `[{ "custom_type": "any", "label": "Commission" }]` |

### Variable types

Each entry of `custom_variable_defs` needs a `label` and a `custom_type`. `custom_type` takes one of these lower-case tokens:

-   `any`
-   `single_file`
-   `multi_file`
-   `single_link`
-   `html_table_rows`

## Use the variable in a later action

Assign the result to a declared variable, as in the example. A later action reads it with a `custom` reference that has the same `custom_type` and `label`:

```json
{ "kind": "variable", "source": "custom", "custom_type": "any", "label": "Commission" }
```

## General behavior

-   `code` is the only required key.
-   `code` is a code value. It holds string literals and variable references only. Tape doesn't resolve template values in it.
-   Tape runs `code` as a block of statements inside the automation's script. It isn't a single expression like the `assignment_code` of [`custom_variable`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/custom-variable).
-   The write path doesn't check the syntax. A broken script saves and passes `validate`. The error shows up only in the run log.
-   `custom_variable_defs` defaults to `[]`. On read, Tape leaves it out when the action declares no variables.
-   A `custom` reference resolves only when this action or an earlier one declares a variable with the same `custom_type` and `label`. Otherwise validation reports `action_variable_missing`. See [Errors & broken reasons](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors).

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.

## Next steps

[

custom\_variable

compute one value with a single expression.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/custom-variable)[

Dynamic values

code values, variable references and variable declarations.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Libraries

Node.js libraries you can call in `code` without importing them.

](https://developers.tapeapp.com/docs/automations/libraries)[

Run & simulate

validate and simulate the automation before it goes live.

](https://developers.tapeapp.com/docs/api/resource/automation/execution)[

Action examples

configs to copy for the common actions.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
