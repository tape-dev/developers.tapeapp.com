---
id: action-examples
title: Action examples
sidebar_label: Action examples
description: Copy-paste config for the most common Tape automation actions — records, email, HTTP, code, control flow, and collections.
---

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

Copy-paste `config` for the most common [action types](/docs/api/resource/automation/reference/actions). Each is a
**minimal, faithful** example — the smallest `config` that persists, validates and runs — and each `config` shape is
taken from the automation API's own end-to-end action suite. Every action type's full `config_schema` is served by
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery); build against that for the complete field
list.

A few conventions used below:

- Drop these objects into the `actions` array on [create or update](/docs/api/resource/automation/manage).
- Node `id`s are **omitted** — the server mints them. (Stable `id`s are shown only where an action nests others.)
- `group` is **derived from `type`** and optional on input; it's shown for clarity.
- Values that pull in live record data are [dynamic values](/docs/api/resource/automation/dynamic-values) — an
  **array** (template/code). Plain settings (an `app_id`, a boolean) are scalars. Each example notes which is which.

## Create a record — `record_create`

Creates a record in an app. With no `field_assignments`, it creates an **empty** record.

```json
{
  "type": "record_create",
  "group": "action",
  "config": {
    "app_id": 12345,
    "silent": false,
    "trigger_other_flows": false
  }
}
```

- `app_id` (**required**) — the target app; it is not defaulted, so always send it.
- `field_assignments` omitted → an empty record. Populated assignments are a **typed, per-field-type union** discriminated by `field_type`, with lower-case `field_type` / `assignment_type` tokens (e.g. `single_text` / `set`); `meta/action` advertises the array items opaquely, so treat this shape as **beta** and still stabilizing. `[]` is always accepted (see **Update the current record**, below).
- `trigger_other_flows: false` stops the new record from re-firing automations — set it to avoid a recursion when this automation triggers on the same app.
- All three keys are plain scalars (no dynamic-value arrays here).

## Update the current record — `current_record_update`

Updates the record the run is executing on, applying a list of `field_assignments`.

```json
{
  "type": "current_record_update",
  "group": "action",
  "config": {
    "field_assignments": [],
    "silent": false
  }
}
```

- `field_assignments` (optional) — omitted or `[]` is a valid **no-op** update (changes no fields, still logs success). A populated assignment is a **typed, per-field-type object** discriminated by `field_type` (lower-case `field_type` / `assignment_type` tokens, plus any nested match/search conditions in the public [filter tree](/docs/api/resource/automation/reference/filters)); since `meta/action` advertises the items opaquely, treat this shape as **beta** and still stabilizing.
- Targets the **current record** implicitly — no `app_id` (that's `referenced_records_update`) and no `record_collection` (that's `collected_records_update`).
- `silent` / `trigger_webhooks` / `trigger_other_flows` / `author_id` are optional mutation flags; omitting `author_id` runs the update as the automation's default author.

## Run code — `custom_code`

Runs custom code in the automation sandbox. The most self-contained action — no referenced entities, no external service.

```json
{
  "type": "custom_code",
  "group": "action",
  "config": {
    "code": ["const sum = 1 + 1;"]
  }
}
```

- `code` (**required**) — a **code dynamic value**: an array of literal strings interleaved with variable/value reference tokens to embed record data. A plain string is accepted and coerced to array form.
- `custom_variable_defs` omitted → the script declares no variables for later actions.

## Declare a variable — `custom_variable`

Computes a value and stores it under a declared variable that later actions can reference.

```json
{
  "type": "custom_variable",
  "group": "action",
  "config": {
    "custom_variable_defs": [{ "custom_type": "any", "label": "Result" }],
    "assignment_code": ["return 1 + 1;"]
  }
}
```

- `custom_variable_defs` — the **declaration**: each entry is `{ "custom_type", "label" }` (`custom_type` ∈ `any` / `single_file` / `multi_file` / `single_link` / `html_table_rows`). Later actions reference the variable by `{ "kind": "variable", "source": "custom", "custom_type", "label" }`.
- `assignment_code` — a **code dynamic value** (array) computing the value.
- **Silent no-op trap:** with an empty/omitted `custom_variable_defs` this action still *validates and persists*, but at run time it silently skips — no per-action log. The same trap applies to a `for_loop` with no `iterable` and an `authenticated_http_call` with no `authentication_provider_id`.

## Send an email — `send_email`

Sends one email through the organization's SMTP account.

```json
{
  "type": "send_email",
  "group": "action",
  "config": {
    "to_address": ["recipient@example.com"],
    "subject": ["Email from the automation"],
    "message_body": ["<p>Sent by the send_email automation action.</p>"]
  }
}
```

- `to_address` and `subject` are **required**; `message_body` is **optional** — omit it and the email still sends, with an empty body. Provide it for a non-empty message.
- All three are **template dynamic values** (arrays); the HTML body round-trips verbatim.
- `smtp_account_id` omitted → the organization's **default** SMTP account. Pin an id only if you need a specific account.

## Make an HTTP request — `http_call`

Makes an outbound HTTP request from the automation sandbox.

```json
{
  "type": "http_call",
  "group": "action",
  "config": {
    "http_call_type": "get",
    "http_call_url": ["https://tapeapp.com/"]
  }
}
```

- `http_call_type` (**required**) — a lowercase enum scalar: `get` / `post` / `put` / `patch` / `delete`.
- `http_call_url` (**required**) — a **template dynamic value** (array), so you can interpolate record data into the URL.
- Outbound requests run from Tape's worker IPs and are subject to network restrictions — see [Troubleshooting → IP addresses](/docs/automations/troubleshooting/ip-addresses). Private/internal hosts are refused.

## Branch on a condition — `conditional`

A control-flow action: runs its nested `action_rows` (the then-branch) only when `condition` holds.

```json
{
  "type": "conditional",
  "group": "control_flow",
  "config": {
    "condition": {
      "operator": "and",
      "rows": [
        { "id": "cond-leaf", "code": ["true"] }
      ]
    },
    "action_rows": [
      {
        "id": "then-1",
        "type": "custom_code",
        "group": "action",
        "config": { "code": ["const a = 1;"] }
      }
    ]
  }
}
```

- The branch structure lives **inside `config`** (`condition`, `action_rows`, and an optional `else_action_rows`) — like every action, a `conditional` carries its whole shape in `config`. See [`conditional`](/docs/api/resource/automation/reference/actions/conditional).
- `condition` is a [filter group](/docs/api/resource/automation/reference/filters); the row above is a **script condition** (`code` instead of `subject`/`operator`/`value`).
- `action_rows` is the then-branch — full nested action nodes. Add `else_action_rows` (inside `config`) for an else-branch; omit it to disable.

## Loop over items — `for_loop`

A control-flow action: runs its nested `action_rows` (the loop body) once per item of an iterable.

```json
{
  "type": "for_loop",
  "group": "control_flow",
  "config": {
    "iterable": {
      "kind": "variable",
      "source": "action",
      "action_type": "record_collection",
      "app_id": 12345
    },
    "action_rows": [
      {
        "id": "loop-body",
        "type": "custom_code",
        "group": "action",
        "config": { "code": ["const x = 1;"] }
      }
    ]
  }
}
```

- The loop lives **inside `config`**: `iterable` (what to loop over), `action_rows` (the body), and optional `break_condition` / `continue_condition`. Like every action, `for_loop` carries its whole shape in `config`.
- The [`iterable`](/docs/api/resource/automation/reference/actions/for-loop) is a [reference](/docs/api/resource/automation/dynamic-values) to a collection (or custom variable) produced by an earlier `collect_*` or `custom_variable` action. With no iterable set, the loop body doesn't run (see the collection pattern below for how to produce and reference a collection).

## Collect and update a collection — `collect_app_records` → `collected_records_update`

The collection pattern: an upstream **collect** action publishes a `record_collection`; a downstream action references it. Order matters — the producer comes first.

```json
{
  "actions": [
    {
      "id": "collect",
      "type": "collect_app_records",
      "group": "action",
      "config": { "app_id": 12345 }
    },
    {
      "type": "collected_records_update",
      "group": "action",
      "config": {
        "record_collection": {
          "kind": "variable",
          "source": "action",
          "action_type": "record_collection",
          "app_id": 12345
        },
        "field_assignments": [],
        "silent": false
      }
    }
  ]
}
```

- `record_collection` is an **object reference**, never a string. It resolves by `action_type` + `app_id` to the nearest upstream producer, so it doesn't name the collect action's `id`.
- The same reference shape feeds any collection consumer — `filter_record_collection`, `sort_record_collection`, `collected_records_comment_create`, a `for_loop`'s `iterable`, and so on.
- **Enum casing:** all config enum tokens are **lower-case** — `http_call_type: "post"`, `weblink_expiration: "never"`, `exit_type: "success"`, and on `collect_referenced_records` both `ref_collection_defs[].direction` (`outgoing` / `incoming` / `both`) and `match_type` (`all` / `filtered`). Send them as the `config_schema` gives them.
