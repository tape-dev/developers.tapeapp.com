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

There are **35** action types — **33** leaf actions (`group: "action"`) and **2** control-flow constructs
(`group: "control_flow"`). Each type's `config` keys come from its `config_schema` on
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery); the label and one-line description below
are the same ones that endpoint returns. The families are a reading aid — an action's authoritative grouping is its
`group` field, not its family. For copy-paste config of the most common actions, see
[Action examples](/docs/api/resource/automation/action-examples).

### Code & variables

| Action | What it does |
| --- | --- |
| `custom_code` | **Run code** — runs custom code in the automation sandbox. |
| `custom_variable` | **Set variable** — computes and stores a custom variable for later actions. |

### Current record

| Action | What it does |
| --- | --- |
| `record_create` | **Create record** — creates a record in an app. |
| `current_record_update` | **Update record** — updates the current record. |
| `current_record_delete` | **Delete record** — deletes the current record. |
| `current_record_restore` | **Restore record** — restores the current (soft-deleted) record. |
| `current_record_get_previous_revision` | **Get previous revision** — loads the previous revision of the current record. |
| `current_record_comment_create` | **Add comment** — adds a comment to the current record. |
| `current_record_comment_or_reply_reply_create` | **Add reply** — adds a reply to the current comment or reply. |
| `current_record_comment_or_reply_delete` | **Delete comment or reply** — deletes the current comment or reply. |

### Record collections

| Action | What it does |
| --- | --- |
| `collect_app_records` | **Collect app records** — collects records from an app, optionally filtered. |
| `collect_app_view_records` | **Collect app view records** — collects records from an app view. |
| `collect_referenced_records` | **Collect referenced records** — collects records referenced by the current record. |
| `collected_records_collect_referenced_records` | **Collect referenced records (from collection)** — collects records referenced by a starting record collection. |
| `filter_record_collection` | **Filter collection** — filters a record collection. |
| `sort_record_collection` | **Sort collection** — sorts a record collection. |
| `clear_record_collection` | **Clear collection** — empties a record collection. |
| `collected_records_update` | **Update collected records** — updates every record in a collection. |
| `referenced_records_update` | **Update referenced records** — updates records referenced by the current record. |
| `collected_records_comment_create` | **Comment on collected records** — adds a comment to every record in a collection. |
| `rollup_iterable_values` | **Roll up values** — aggregates the values of an iterable (count, sum, average, …). |

### Automation calls & weblinks

| Action | What it does |
| --- | --- |
| `current_record_call_automation` | **Call automation** — calls another automation with the current record. |
| `collected_records_call_automation` | **Call automation for collected records** — calls another automation for every record in a collection. |
| `current_record_generate_automation_weblink` | **Generate weblink** — generates a weblink that calls an automation with the current record. |
| `display_webpage` | **Display webpage** — displays a webpage in a weblink flow. |
| `redirect_user` | **Redirect user** — redirects the user to a URL in a weblink flow. |

### Email & documents

| Action | What it does |
| --- | --- |
| `send_email` | **Send email** — sends an email. |
| `collected_records_send_email` | **Send email for collected records** — sends an email for every record in a collection. |
| `create_pdf` | **Create PDF** — renders an HTML template to a PDF file. |

### HTTP requests

| Action | What it does |
| --- | --- |
| `http_call` | **HTTP request** — makes an outbound HTTP request. |
| `authenticated_http_call` | **Authenticated HTTP request** — makes an outbound HTTP request signed by an authentication provider. |

### Flow control

| Action | What it does |
| --- | --- |
| `delay` | **Delay** — pauses the automation for a fixed duration. |
| `exit` | **Exit** — ends the automation run. |
| `for_loop` | **For loop** — runs nested actions for each item of an iterable. `group: "control_flow"`. |
| `conditional` | **Condition** — runs nested actions only when a condition holds. `group: "control_flow"`. |

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
