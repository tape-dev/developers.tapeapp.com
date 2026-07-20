---
id: conditional
title: conditional
sidebar_label: conditional
description: Config reference for the Tape automation conditional action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Condition** — runs a then branch when a condition holds, and an optional else branch otherwise. `group: "control_flow"`. No specific trigger context is required.

Part of the [Flow control](/docs/api/resource/automation/reference/actions#flow-control) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

The control-flow shape now lives entirely in `config` — the condition and the branches recently moved off the action's
top level. Each branch is a nested action list, and a branch is enabled by **presence**: there are no `*_enabled` flags.

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | no | The if-condition. `null` or omitted means **always true**. |
| `action_rows` | array of nested [actions](/docs/api/resource/automation/reference/actions) | no | The then branch — actions run when the condition holds. |
| `else_action_rows` | array of nested [actions](/docs/api/resource/automation/reference/actions) | no | The else branch — actions run when the condition fails. Omitted disables the else branch. |

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "conditional",
  "config": {
    "condition": {
      "operator": "and",
      "filters": [
        { "field": "status", "comparator": "equals", "value": ["open"] }
      ]
    },
    "action_rows": [
      { "type": "send_email", "config": { "to_address": ["owner@example.com"], "subject": ["Still open"] } }
    ],
    "else_action_rows": [
      { "type": "current_record_delete", "config": {} }
    ]
  }
}
```

## Validation & behavior

- All three members are optional. An omitted or `null` `condition` evaluates as **always true**, so the then branch always runs.
- `else_action_rows` is enabled by presence: omit it to disable the else branch entirely — there is no `*_enabled` flag.
- `action_rows` and `else_action_rows` each hold a nested action list; the available nested action types are advertised by [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery).
- `condition` is a boolean filter expression; see [`GET /v1/automation/meta/filter`](/docs/api/resource/automation/discovery) for the operators available per field type.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Filters](/docs/api/resource/automation/reference/filters) — the filter-group shape used by `condition`
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
