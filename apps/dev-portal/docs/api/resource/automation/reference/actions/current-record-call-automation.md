---
id: current-record-call-automation
title: current_record_call_automation
sidebar_label: current_record_call_automation
description: Config reference for the Tape automation current_record_call_automation action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Call automation** — calls another automation, passing the current record as its context. `group: "action"`. Requires
any record-context trigger.

Part of the [Automation calls & weblinks](/docs/api/resource/automation/reference/actions#automation-calls--weblinks)
family. This page documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `automation_id` | integer | no | Id of the automation to call. Unset target when omitted. |
| `call_arguments` | array of argument bindings | no | Arguments bound to the called automation's declared inputs, one per the callee's custom variable. Empty when omitted. |

Each entry in `call_arguments` binds one declared input (`variable_def`) to either a
[template value](/docs/api/resource/automation/dynamic-values) (`value`, used when `assignment_type` is `set`) or a
[code value](/docs/api/resource/automation/dynamic-values) (`code`, used when `set_code`). `assignment_type` defaults
to `set` when omitted, and its tokens (lower-case) are `set` and `set_code`. A server-minted `id` is filled when omitted.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "current_record_call_automation",
  "config": {
    "automation_id": 4021,
    "call_arguments": [
      {
        "variable_def": { "custom_type": "any", "label": "Note" },
        "assignment_type": "set",
        "value": ["Forwarded from ", { "kind": "variable", "source": "meta", "meta_type": "app_record_id" }]
      }
    ]
  }
}
```

## Validation & behavior

- Both `automation_id` and `call_arguments` are optional; an omitted `automation_id` round-trips as an unset target and
  an omitted `call_arguments` defaults to an empty list.
- The callee must exist and live in the **same app** as this automation, and it must carry the `automation_called`
  trigger. A **paused** callee is a valid target.
- Each `call_arguments` entry binds one of the callee's declared inputs; `assignment_type` selects the source —
  `set` uses `value` (a template value), `set_code` uses `code` (a code value) — and defaults to `set`.
- This action requires a record-context trigger so the current record is available as the call's context.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values, references, and code values
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
