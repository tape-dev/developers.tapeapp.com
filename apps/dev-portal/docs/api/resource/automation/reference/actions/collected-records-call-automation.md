---
id: collected-records-call-automation
title: collected_records_call_automation
sidebar_label: collected_records_call_automation
description: Config reference for the Tape automation collected_records_call_automation action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Call automation for collected records** — calls a target automation once per record in a referenced record
collection. `group: "action"`. No specific trigger context is required.

Part of the [Automation calls & weblinks](/docs/api/resource/automation/reference/actions#automation-calls--weblinks) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `automation_id` | integer | no | Id of the automation to call for each collected record. Omitted → no target; an unset target round-trips as absent. |
| `record_collection` | [reference](/docs/api/resource/automation/dynamic-values) | no | The record collection to iterate over — an action-variable reference to a prior action's collection output. Omitted when unset. |
| `call_arguments` | array of call-argument objects | no | Arguments bound to the called automation's declared inputs, one per its custom variables. Empty when omitted. |

Each `call_arguments` entry binds one of the called automation's declared custom variables (`variable_def`) to either a
[template value](/docs/api/resource/automation/dynamic-values) (`value`, when `assignment_type` is `set`) or a
[code value](/docs/api/resource/automation/dynamic-values) (`code`, when `assignment_type` is `set_code`). `assignment_type`
defaults to `set` when omitted.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "collected_records_call_automation",
  "config": {
    "automation_id": 4021,
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection" },
    "call_arguments": [
      {
        "variable_def": { "custom_type": "any", "label": "Amount" },
        "assignment_type": "set",
        "value": ["100"]
      }
    ]
  }
}
```

## Validation & behavior

- All three members are optional at input; the mapper defaults omitted `call_arguments` to `[]`, and an unset
  `automation_id` round-trips as absent.
- This action is a **consumer** of a record collection: `record_collection` should reference a collection produced by a
  prior action, and the target automation is called **once per record** in it.
- `call_arguments` entries bind the callee's declared custom variables; each entry carries either a template `value`
  (`set`) or a `code` expression (`set_code`), defaulting to `set`.
- The action shares the shape of `current_record_call_automation` plus the `record_collection` reference — the per-record
  iteration is the only behavioral difference (beta — see meta/action).

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references used by `record_collection` and `call_arguments`
- [Actions catalog](/docs/api/resource/automation/reference/actions) · [Action examples](/docs/api/resource/automation/action-examples)
