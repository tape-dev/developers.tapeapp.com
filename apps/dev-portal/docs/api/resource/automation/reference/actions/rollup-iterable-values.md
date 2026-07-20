---
id: rollup-iterable-values
title: rollup_iterable_values
sidebar_label: rollup_iterable_values
description: Config reference for the Tape automation rollup_iterable_values action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Roll up values** — aggregates the values of a collected iterable into a single result (sum, count, average, and
similar). `group: "action"`. No specific trigger context is required.

Part of the [Record collections](/docs/api/resource/automation/reference/actions#record-collections) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `rollup_type` | enum | **yes** | The aggregation to perform over the iterable's values. No canonical default. |
| `rollup_variable_def` | [reference](/docs/api/resource/automation/dynamic-values) | no | The iterable whose values are rolled up — a collection-scoped field variable an upstream collect action must have put in scope. Carried through when present, dropped when unset. |
| `custom_variable_def` | object | no | The declared **output** variable holding the rollup result; reference it from later actions by its label. Defaults to `{ custom_type: 'any', label: 'Rollup' }`. |

**`rollup_type` tokens** (lower-case): `count_all`, `count_empty`, `count_not_empty`, `percent_empty`,
`percent_not_empty`, `sum`, `average`, `median`, `min`, `max`.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "rollup_iterable_values",
  "config": {
    "rollup_type": "sum",
    "rollup_variable_def": {
      "kind": "variable",
      "source": "field",
      "field_id": 123,
      "field_type": "number",
      "app_id": 45,
      "collection": true,
      "previous": false,
      "triggering": false
    },
    "custom_variable_def": { "custom_type": "any", "label": "Total amount" }
  }
}
```

## Validation & behavior

- `rollup_type` is the only member required at input — it has no canonical default.
- `rollup_variable_def` is advertised optional at input, but a rollup with no iterable in scope fails the validate gate
  with `action_variable_def_missing` — so in practice you must supply a collection-scoped field variable that an
  upstream **collect** action put in scope (beta — see [meta/action](/docs/api/resource/automation/discovery)).
- `custom_variable_def` is the action's output: omit it to accept the canonical default
  (`{ custom_type: 'any', label: 'Rollup' }`), or set a `label` to reference the result from later actions.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Record collections](/docs/api/resource/automation/reference/actions#record-collections) — the collect action that scopes the iterable this rollup consumes
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
