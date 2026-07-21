---
id: custom-code
title: custom_code
sidebar_label: custom_code
description: Config reference for the Tape automation custom_code action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Run code** — runs custom code (JavaScript) in the automation sandbox. `group: "action"`. No specific trigger context is required.

Part of the [Code & variables](/docs/api/resource/automation/reference/actions#code--variables) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | [code value](/docs/api/resource/automation/dynamic-values) | **yes** | The code the action runs — JavaScript executed in the automation sandbox. A code value of string literals and variable references only. |
| `custom_variable_defs` | array of [variable declarations](/docs/api/resource/automation/dynamic-values) | no | Custom variables this action declares (e.g. its result variable) for its own code or later actions. Empty when omitted. |

**`custom_variable_defs[].custom_type` tokens** (lower-case): `any`, `single_file`, `multi_file`, `single_link`,
`html_table_rows`. Each declaration also carries a `label`; a `custom` variable reference resolves only when its
`custom_type` + `label` match a declaration.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "custom_code",
  "config": {
    "code": [
      "return { greeting: 'Hello ' + ",
      { "kind": "variable", "source": "meta", "meta_type": "app_record_id" },
      " };"
    ],
    "custom_variable_defs": [
      { "custom_type": "any", "label": "result" }
    ]
  }
}
```

## Validation & behavior

- `code` is the only required member; it runs in the automation sandbox and carries the action's code envelope.
- `code` is a code value — string literals interleaved with variable references only; it does not resolve template values.
- `code` is a **statement block**: it is inlined into the generated program, so statements — including a top-level `return` — are legal (unlike [`custom_variable`](/docs/api/resource/automation/reference/actions/custom-variable)'s `assignment_code`, which is a bare expression where `return` throws). The write path does not syntax-check it, so a malformed script still persists and passes `validate`; the error surfaces only in the run log.
- `custom_variable_defs` defaults to `[]` when omitted, so an omitting caller still yields a complete internal action.
- A `custom` variable reference (from this action's code or a later action) resolves only when its `custom_type` + `label` match a declaration in `custom_variable_defs`; otherwise the definition validates as `WORKFLOW_ACTION_VARIABLE_DEF_MISSING`.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — code values, variable references, and custom-variable declarations
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
