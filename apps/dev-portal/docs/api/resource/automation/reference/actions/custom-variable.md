---
id: custom-variable
title: custom_variable
sidebar_label: custom_variable
description: Config reference for the Tape automation custom_variable action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Set variable** — computes and assigns custom variables for use by its own code and later actions. `group: "action"`. No specific trigger context is required.

Part of the [Code & variables](/docs/api/resource/automation/reference/actions#code--variables) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `assignment_code` | [code value](/docs/api/resource/automation/dynamic-values) | **yes** | The code that computes and assigns the declared custom variables. |
| `custom_variable_defs` | array of objects | no | Custom variables this action declares for its own code and later actions. Each entry is `{ custom_type, label }`. Empty when omitted. |

**`custom_variable_defs[].custom_type` tokens** (lower-case): `any`, `single_file`, `multi_file`, `single_link`,
`html_table_rows`. Each entry also carries a `label` string. Both `custom_type` and `label` are required on an entry.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "custom_variable",
  "config": {
    "assignment_code": ["({ total: ", { "kind": "variable", "source": "meta", "meta_type": "app_record_id" }, " })"],
    "custom_variable_defs": [
      { "custom_type": "any", "label": "Total" }
    ]
  }
}
```

## Validation & behavior

- `assignment_code` is the only required member — it has no canonical default. `custom_variable_defs` defaults to `[]` when omitted.
- `assignment_code` is evaluated as a single **expression**, and its value is assigned to the declared variable — write `1 + 1`, **not** `return 1 + 1;`. A top-level `return` fails at run time with `Illegal return statement`. To assign an object literal, wrap it in parentheses so it is not parsed as a block: `["({ total: ", { … }, " })"]`. The write path does **not** syntax-check the code, so an invalid script still persists and passes `validate` — the error surfaces only in the run log. (Contrast [`custom_code`](/docs/api/resource/automation/reference/actions/custom-code), whose `code` is a statement block where `return` is legal.)
- Each `custom_variable_defs` entry requires both `custom_type` (one of the tokens above) and `label`.
- The declared variables become available to this action's own code and to later actions in the definition.
- Beta caveat: with `custom_variable_defs` empty, the action still validates but has nothing to assign — it silently no-ops with no per-action log. Declare at least one entry for the action to do work. (beta — see [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery).)

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — code values and references
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
