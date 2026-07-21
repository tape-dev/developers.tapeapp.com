---
id: current-record-generate-automation-weblink
title: current_record_generate_automation_weblink
sidebar_label: current_record_generate_automation_weblink
description: Config reference for the Tape automation current_record_generate_automation_weblink action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Generate weblink** — generates a weblink that calls another automation, passing the current record as its context. `group: "action"`. Requires the `weblink_clicked` trigger context.

Part of the [Automation calls & weblinks](/docs/api/resource/automation/reference/actions#automation-calls--weblinks)
family. This page documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `automation_id` | integer | no | Id of the automation the generated weblink calls. Unset target when omitted. |
| `call_arguments` | array of argument bindings | no | Arguments bound to the target automation's declared inputs, one per the callee's custom variable. Empty when omitted. |
| `custom_variable_def` | object | no | The action's output variable carrying the generated weblink. Each entry is `{ custom_type, label }`. Defaults to the canonical single-link `Weblink` variable (`{ custom_type: "single_link", label: "Weblink" }`) when omitted. |
| `weblink_expiration` | enum | no | When the generated weblink expires. Default `never`. |

Each entry in `call_arguments` binds one declared input (`variable_def`) to either a
[template value](/docs/api/resource/automation/dynamic-values) (`value`, used when `assignment_type` is `set`) or a
[code value](/docs/api/resource/automation/dynamic-values) (`code`, used when `set_code`). `assignment_type` defaults
to `set` when omitted, and its tokens (lower-case) are `set` and `set_code`. A `call_arguments` entry `id` defaults to an empty string (`""`) when omitted — it is not server-minted.

**`custom_variable_def.custom_type` tokens** (lower-case): `any`, `single_file`, `multi_file`, `single_link`,
`html_table_rows`. Each entry also carries a `label` string; both `custom_type` and `label` are required on the entry.

**`weblink_expiration` tokens** (lower-case): `never`, `on_click`, `one_day`, `one_week`, `one_month`, `one_year`.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "current_record_generate_automation_weblink",
  "config": {
    "automation_id": 4021,
    "call_arguments": [
      {
        "variable_def": { "custom_type": "any", "label": "Note" },
        "assignment_type": "set",
        "value": ["Opened from ", { "kind": "variable", "source": "meta", "meta_type": "app_record_id" }]
      }
    ],
    "custom_variable_def": { "custom_type": "single_link", "label": "Weblink" },
    "weblink_expiration": "one_week"
  }
}
```

## Validation & behavior

- No member is required — an omitting caller still yields a complete internal action: `automation_id` round-trips as an
  unset target, `call_arguments` defaults to an empty list, `custom_variable_def` defaults to the canonical single-link
  `Weblink` variable, and `weblink_expiration` defaults to `never`.
- The weblink target automation must live in the **same app** as this automation and be reachable from the
  `weblink_clicked` trigger context.
- Each `call_arguments` entry binds one of the callee's declared inputs; `assignment_type` selects the source —
  `set` uses `value` (a template value), `set_code` uses `code` (a code value) — and defaults to `set`.
- This action requires the `weblink_clicked` trigger context to run.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values, references, and code values
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
