---
id: actions
title: Actions
sidebar_label: Actions
---

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

Actions are **what** an automation does: an ordered list of steps. Most are leaf steps (`group: "action"`); two are
**control-flow** constructs (`group: "control_flow"`) that nest further actions. The catalog, with each type's
`config_schema`, is served by [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery).

## The action object

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Opaque node ID. Optional on input (server-minted when omitted); always present on read. |
| `type` | `string` | The action type (below). |
| `group` | `string` | `action` or `control_flow`. **Derived from `type`** — read-only; you may omit it on input. |
| `custom_name` | `string` | Optional label. Absent when unset. |
| `deactivate` | `boolean` | Whether the step is skipped. Absent when unset. |
| `continue_on_error` | `boolean` | Whether the run continues when this step errors. Absent when unset. |
| `config` | `object` | The step's settings — keys per the action's `config_schema`. [Dynamic values](/docs/api/resource/automation/dynamic-values) inside are normalized to the reference model. |
| _control-flow fields_ | | Present only for `conditional` / `for_loop` — see below. |

:::note `config` is an open bag
Beyond its dynamic-value tokens, `config` is a raw passthrough keyed by the action's `config_schema`; per-type config
shapes are a future tightening. Read the keys from [`meta/action`](/docs/api/resource/automation/discovery) and don't
depend on internal encodings yet.
:::

## Action types

**Leaf actions** (`group: "action"`) — 33:

`custom_code` · `custom_variable` · `record_create` · `current_record_update` · `current_record_delete` ·
`current_record_restore` · `current_record_comment_create` · `current_record_comment_or_reply_delete` ·
`current_record_comment_or_reply_reply_create` · `current_record_get_previous_revision` ·
`current_record_call_automation` · `current_record_generate_automation_weblink` · `collect_referenced_records` ·
`collected_records_collect_referenced_records` · `collect_app_records` · `collect_app_view_records` ·
`clear_record_collection` · `sort_record_collection` · `filter_record_collection` · `collected_records_update` ·
`collected_records_comment_create` · `collected_records_call_automation` · `rollup_iterable_values` ·
`referenced_records_update` · `display_webpage` · `redirect_user` · `send_email` · `collected_records_send_email` ·
`create_pdf` · `delay` · `http_call` · `authenticated_http_call` · `exit`

**Control-flow** (`group: "control_flow"`) — 2: `for_loop`, `conditional`.

## Control-flow actions

Both nest actions under `action_rows`. A **disabled** optional branch is **absent** from the response; an **enabled**
one is always present — even when empty (an enabled-but-empty conditional `else` reads as `else_action_rows: []`, and
an enabled-but-empty `for_loop` `break_condition` / `continue_condition` reads as `null`).

**`conditional`**

| Field | Type | Description |
| --- | --- | --- |
| `condition` | `object` \| `null` | The branch [condition](/docs/api/resource/automation/reference/filters) (a filter group); `null` means always true. |
| `action_rows` | `array` | The if/then branch. |
| `else_action_rows` | `array` | The else branch — present only when enabled. |

**`for_loop`**

| Field | Type | Description |
| --- | --- | --- |
| `iterable` | `object` | A [reference](/docs/api/resource/automation/dynamic-values) to the collection to loop over. |
| `action_rows` | `array` | The loop body. |
| `break_condition` | `object` \| `null` | A [filter group](/docs/api/resource/automation/reference/filters) — present only when enabled. |
| `continue_condition` | `object` \| `null` | A filter group — present only when enabled. |
