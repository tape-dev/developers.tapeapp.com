---
id: for-loop
title: for_loop
sidebar_label: for_loop
description: Config reference for the Tape automation for_loop action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**For loop** — iterates over an iterable and runs a nested body of actions for each item. `group: "control_flow"`. No specific trigger context is required. This is a control-flow action: its whole shape now lives in `config` (recently moved from the action's top level), and each branch is enabled by **presence** — there are no `*_enabled` flags.

Part of the [Flow control](/docs/api/resource/automation/reference/actions#flow-control) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `iterable` | [reference](/docs/api/resource/automation/dynamic-values) | no | The collection to loop over — a `record_collection` reference produced by an upstream `collect_*` action (or a multi-value field / custom variable). Named `iterable` on the wire (renamed from the internal `iterable_variable_def`). |
| `action_rows` | array of nested [actions](/docs/api/resource/automation/reference/actions) | no | The loop body — the actions run once per item. Empty when omitted. |
| `break_condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | no | Stops the loop when it matches. Omitted → disabled. |
| `continue_condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | no | Skips to the next item when it matches. Omitted → disabled. |

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "for_loop",
  "config": {
    "iterable": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 12345 },
    "action_rows": [
      {
        "type": "send_email",
        "config": {
          "to_address": ["someone@example.com"],
          "subject": ["Processing item"]
        }
      }
    ]
  }
}
```

## Validation & behavior

- No member is required — an empty `config` is valid, though a loop with no `iterable` or `action_rows` does nothing useful.
- Control-flow shape lives entirely in `config`; it was recently moved from the action's top level.
- Enabled-ness is encoded by **presence**, not by a flag: an omitted `break_condition` or `continue_condition` disables that branch (the internal `*_enabled` members are derived).
- `action_rows` holds nested [actions](/docs/api/resource/automation/reference/actions) that execute once per iteration; `break_condition` / `continue_condition` are evaluated as [filter groups](/docs/api/resource/automation/reference/filters).

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — references such as `iterable`
- [Filters](/docs/api/resource/automation/reference/filters) — the filter-group shape used by `break_condition` and `continue_condition`
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
