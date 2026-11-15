---
id: custom-variable
title: custom_variable
sidebar_label: custom_variable
description: Config reference for the Tape automation custom_variable action, with its config keys, defaults and an example.
---

Use this action to compute a value and store it in a variable for later actions.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Perform a calculation** in the [Code & variables](/docs/api/resource/automation/reference/actions#code--variables) family. Its `group` is `action`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

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
| `assignment_code` | [code value](/docs/api/resource/automation/dynamic-values) | **Required.** One JavaScript expression. Tape stores its value in the declared variable. A plain string works too. | `["1 + 1"]` |
| `custom_variable_defs` | array of [variable declarations](/docs/api/resource/automation/dynamic-values) | The variable that receives the value. Each entry is `{ "custom_type", "label" }`, and both keys are required. Empty when left out. | `[{ "custom_type": "any", "label": "Total" }]` |

### Variable types

`custom_type` takes one of these lower-case tokens:

- `any`
- `single_file`
- `multi_file`
- `single_link`
- `html_table_rows`

:::caution Why does my action save but do nothing?
With an empty or missing `custom_variable_defs`, this action still validates and saves. When the automation runs, Tape skips it without a per-action log, as it does with an empty `assignment_code`. Declare one variable so the action has a target.
:::

## Use the variable in a later action

Tape stores the value in the first variable of `custom_variable_defs`. A later action reads it with a `custom` reference that has the same `custom_type` and `label`:

```json
{ "kind": "variable", "source": "custom", "custom_type": "any", "label": "Annual yield (kWh)" }
```

## General behavior {#validation--behavior}

- `assignment_code` is the only required key. It has no default. `custom_variable_defs` defaults to `[]`.
- Tape evaluates `assignment_code` as one expression. Write `1 + 1`, not `return 1 + 1;`. A top-level `return` fails when the automation runs, with `Illegal return statement`.
- To store an object literal, wrap it in parentheses: `["({ total: ", …, " })"]`. Without them, JavaScript reads the braces as a block.
- Declare one variable per action.
- The action's own `assignment_code` can't reference the variable.
- The write path doesn't check the syntax. A broken expression saves and passes `validate`. The error shows up only in the run log.
- For a block of statements instead of one expression, use [`custom_code`](/docs/api/resource/automation/reference/actions/custom-code).

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.

<a id="see-also"></a>

## Next steps

- [custom_code](/docs/api/resource/automation/reference/actions/custom-code): run several statements and fill more than one variable.
- [for_loop](/docs/api/resource/automation/reference/actions/for-loop): loop over a custom variable.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): code values and `custom` references.
- [Libraries](/docs/automations/libraries): Node.js libraries you can call in `assignment_code`.
- [Action examples](/docs/api/resource/automation/action-examples): configs to copy for the common actions.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
