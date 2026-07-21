---
id: actions
title: Actions
sidebar_label: Actions
description: The 35 Tape automation action types, grouped by family, each with its label and where to read its config schema.
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
| `config` | `object` | The step's settings — keys per the action's `config_schema`. **Required on every action written through the API** — an empty `{}` is valid for a not-yet-configured step, but omitting the `config` key is a `400`. [Dynamic values](/docs/api/resource/automation/dynamic-values) inside are normalized to the reference model. |
| _(control-flow `config`)_ | | For `conditional` / `for_loop`, `config` carries the branch/loop structure — see [Control-flow actions](#control-flow-actions). |

:::note `config` is normalized, not echoed back verbatim
`config` keys come from the action's `config_schema` on [`meta/action`](/docs/api/resource/automation/discovery), but a
written `config` does **not** read back byte-for-byte:

- **Omitted members are server-defaulted on read.** An omitted `match_condition` / `attach_files_match_condition` reads
  back as an empty [filter group](/docs/api/resource/automation/reference/filters) (or `null`), and omitted required
  arrays (`ref_collection_defs`, `field_assignments`, `call_arguments`, `http_call_headers`, `sorts`) read back as `[]`.
  A verbatim `GET` → `PUT` still works (the defaults are idempotent) — but don't diff write against read.
  `field_assignments` — the payload of every mutating action (`record_create`, `current_record_update`,
  `referenced_records_update`, `collected_records_update`) — is a **typed, per-field-type union** discriminated by
  `field_type`. The `meta/action` schema still advertises its array items opaquely, so read the shape from
  [Action examples](/docs/api/resource/automation/action-examples). It is newly writable and still stabilizing (beta);
  the empty `[]` is always accepted as a no-op.
- **A companion `_enabled` flag gates `limit`.** In `collect_app_records` / `collect_app_view_records`, `limit` takes
  effect only when `limit_enabled` is `true`; send both, and with `limit_enabled: false`, `limit` is ignored and the
  collect is capped at the server maximum of **1000 records** (see [Limitations](/docs/automations/limitations)). (The
  `triggering_app_ids` / `custom_variable_defs` `_enabled` flags belong to **trigger** config, not action
  config; control-flow branches are gated by **presence**, not a flag.)
- **A condition embedded in `config`** (e.g. a collect/filter action's `match_condition`) uses the **same public
  [filter tree](/docs/api/resource/automation/reference/filters)** as a `conditional`'s `condition` — `operator: "and" |
  "or"` (lower-case) with `rows` — not the internal encoding it used before the typed-config migration.
- **`config_schema` validity is structural only.** Passing the schema gets the action *stored*; per-action semantic
  constraints surface later at [validate](/docs/api/resource/automation/execution) / activate as
  [broken-reason codes](/docs/api/resource/automation/reference/errors) — e.g. `referenced_records_update.app_id` must
  be a relation-edge app of the trigger app, and a sort key must be collection-scoped.
- **All config enum tokens are lower-case** — send them exactly as `meta/action` advertises them (e.g.
  `http_call_type: "post"`, `exit_type: "success"`, `ref_collection_defs[].direction: "incoming"`, `match_type: "all"`).

Per-type config shapes are a future tightening — read the keys from `meta/action` and don't hard-code internal
encodings yet.
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
| [`custom_code`](/docs/api/resource/automation/reference/actions/custom-code) | **Run code** — runs custom code in the automation sandbox. |
| [`custom_variable`](/docs/api/resource/automation/reference/actions/custom-variable) | **Set variable** — computes and stores a custom variable for later actions. |

### Current record

| Action | What it does |
| --- | --- |
| [`record_create`](/docs/api/resource/automation/reference/actions/record-create) | **Create record** — creates a record in an app. |
| [`current_record_update`](/docs/api/resource/automation/reference/actions/current-record-update) | **Update record** — updates the current record. |
| [`current_record_delete`](/docs/api/resource/automation/reference/actions/current-record-delete) | **Delete record** — deletes the current record. |
| [`current_record_restore`](/docs/api/resource/automation/reference/actions/current-record-restore) | **Restore record** — restores the current (soft-deleted) record. |
| [`current_record_get_previous_revision`](/docs/api/resource/automation/reference/actions/current-record-get-previous-revision) | **Get previous revision** — loads the previous revision of the current record. |
| [`current_record_comment_create`](/docs/api/resource/automation/reference/actions/current-record-comment-create) | **Add comment** — adds a comment to the current record. |
| [`current_record_comment_or_reply_reply_create`](/docs/api/resource/automation/reference/actions/current-record-comment-or-reply-reply-create) | **Add reply** — adds a reply to the current comment or reply. |
| [`current_record_comment_or_reply_delete`](/docs/api/resource/automation/reference/actions/current-record-comment-or-reply-delete) | **Delete comment or reply** — deletes the current comment or reply. |

### Record collections

| Action | What it does |
| --- | --- |
| [`collect_app_records`](/docs/api/resource/automation/reference/actions/collect-app-records) | **Collect app records** — collects records from an app, optionally filtered. |
| [`collect_app_view_records`](/docs/api/resource/automation/reference/actions/collect-app-view-records) | **Collect app view records** — collects records from an app view. |
| [`collect_referenced_records`](/docs/api/resource/automation/reference/actions/collect-referenced-records) | **Collect referenced records** — collects records referenced by the current record. |
| [`collected_records_collect_referenced_records`](/docs/api/resource/automation/reference/actions/collected-records-collect-referenced-records) | **Collect referenced records (from collection)** — collects records referenced by a starting record collection. |
| [`filter_record_collection`](/docs/api/resource/automation/reference/actions/filter-record-collection) | **Filter collection** — filters a record collection. |
| [`sort_record_collection`](/docs/api/resource/automation/reference/actions/sort-record-collection) | **Sort collection** — sorts a record collection. |
| [`clear_record_collection`](/docs/api/resource/automation/reference/actions/clear-record-collection) | **Clear collection** — empties a record collection. |
| [`collected_records_update`](/docs/api/resource/automation/reference/actions/collected-records-update) | **Update collected records** — updates every record in a collection. |
| [`referenced_records_update`](/docs/api/resource/automation/reference/actions/referenced-records-update) | **Update referenced records** — updates records referenced by the current record. |
| [`collected_records_comment_create`](/docs/api/resource/automation/reference/actions/collected-records-comment-create) | **Comment on collected records** — adds a comment to every record in a collection. |
| [`rollup_iterable_values`](/docs/api/resource/automation/reference/actions/rollup-iterable-values) | **Roll up values** — aggregates the values of an iterable (count, sum, average, …). |

Most of these form **producer/consumer pairs**: a `collect_*` action publishes a `record_collection`, and a downstream
action (`filter` / `sort` / `clear_record_collection`, the `collected_records_*` family, or a `for_loop` `iterable`)
consumes it. The producer must appear **first** in the automation, and the consumer references it by an object —
`{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": … }` — that resolves to the
**nearest upstream producer** (it never names the producer's `id`). A consumer with no matching upstream producer fails
validation. See [Action examples](/docs/api/resource/automation/action-examples) for a complete payload.

### Automation calls & weblinks

| Action | What it does |
| --- | --- |
| [`current_record_call_automation`](/docs/api/resource/automation/reference/actions/current-record-call-automation) | **Call automation** — calls another automation with the current record. |
| [`collected_records_call_automation`](/docs/api/resource/automation/reference/actions/collected-records-call-automation) | **Call automation for collected records** — calls another automation for every record in a collection. |
| [`current_record_generate_automation_weblink`](/docs/api/resource/automation/reference/actions/current-record-generate-automation-weblink) | **Generate weblink** — generates a weblink that calls an automation with the current record. |
| [`display_webpage`](/docs/api/resource/automation/reference/actions/display-webpage) | **Display webpage** — displays a webpage in a weblink flow. |
| [`redirect_user`](/docs/api/resource/automation/reference/actions/redirect-user) | **Redirect user** — redirects the user to a URL in a weblink flow. |

The call/weblink actions reference a target automation by id. The target must **exist**, live in the **same app**, and
carry the matching trigger — `automation_called` for `current_record_call_automation` /
`collected_records_call_automation`, `weblink_clicked` for `current_record_generate_automation_weblink`. Otherwise the
definition fails validation. A **paused** target is a valid reference (it just produces no run when the call endpoint
fires it — see [Advanced / Sandbox](/docs/api/resource/automation/advanced)).

### Email & documents

| Action | What it does |
| --- | --- |
| [`send_email`](/docs/api/resource/automation/reference/actions/send-email) | **Send email** — sends an email. |
| [`collected_records_send_email`](/docs/api/resource/automation/reference/actions/collected-records-send-email) | **Send email for collected records** — sends an email for every record in a collection. |
| [`create_pdf`](/docs/api/resource/automation/reference/actions/create-pdf) | **Create PDF** — renders an HTML template to a PDF file. |

### HTTP requests

| Action | What it does |
| --- | --- |
| [`http_call`](/docs/api/resource/automation/reference/actions/http-call) | **HTTP request** — makes an outbound HTTP request. |
| [`authenticated_http_call`](/docs/api/resource/automation/reference/actions/authenticated-http-call) | **Authenticated HTTP request** — makes an outbound HTTP request signed by an authentication provider. |

Outbound requests are subject to [SSRF protection](/docs/automations/troubleshooting/ip-addresses) — hosts resolving
to private/internal addresses are refused. `authenticated_http_call` also needs an `authentication_provider_id`, but
the public API exposes **no endpoint to create or list OAuth integrations** — they are provisioned by an org admin in
the Tape app. So the action can be *defined* via the API, but without a valid provider id it is skipped at run time.

### Flow control

| Action | What it does |
| --- | --- |
| [`delay`](/docs/api/resource/automation/reference/actions/delay) | **Delay** — pauses the automation for a fixed duration. |
| [`exit`](/docs/api/resource/automation/reference/actions/exit) | **Exit** — ends the automation run. |
| [`for_loop`](/docs/api/resource/automation/reference/actions/for-loop) | **For loop** — runs nested actions for each item of an iterable. `group: "control_flow"`. |
| [`conditional`](/docs/api/resource/automation/reference/actions/conditional) | **Condition** — runs nested actions only when a condition holds. `group: "control_flow"`. |

### Trigger context

Some actions are only valid under a matching trigger — a wrong pairing fails validation with `action_invalid`:

| Action(s) | Requires trigger |
| --- | --- |
| `display_webpage`, `redirect_user`, `current_record_generate_automation_weblink` | `weblink_clicked` |
| `current_record_comment_or_reply_reply_create`, `current_record_comment_or_reply_delete` | `record_comment_or_reply_created` |
| `current_record_*` (update / delete / restore / get_previous_revision / comment_create / call_automation) | any **record-context** trigger (not `periodic` / `webhook_received` without a record) |

## Control-flow actions

`conditional` and `for_loop` carry their whole structure **inside `config`** — like every other action; there are no
top-level control-flow fields. Each branch/condition is enabled by **presence**: an omitted member is disabled. A
nested body is an array of actions under `action_rows`.

**`conditional`** — `config` keys:

| Key | Type | Description |
| --- | --- | --- |
| `condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | The branch condition; `null` or omitted means always true. |
| `action_rows` | array of [actions](/docs/api/resource/automation/reference/actions) | The if/then branch. |
| `else_action_rows` | array of [actions](/docs/api/resource/automation/reference/actions) | The else branch — omit to disable it. |

**`for_loop`** — `config` keys:

| Key | Type | Description |
| --- | --- | --- |
| `iterable` | [reference](/docs/api/resource/automation/dynamic-values) | The collection to loop over (public name `iterable` — renamed from the internal `iterable_variable_def`). |
| `action_rows` | array of [actions](/docs/api/resource/automation/reference/actions) | The loop body. |
| `break_condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | Stops the loop when it matches — omit to disable. |
| `continue_condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | Skips to the next item when it matches — omit to disable. |

See [`conditional`](/docs/api/resource/automation/reference/actions/conditional) and [`for_loop`](/docs/api/resource/automation/reference/actions/for-loop) for full config examples.
