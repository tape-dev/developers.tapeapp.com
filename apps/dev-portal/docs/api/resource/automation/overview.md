---
id: overview
title: Automation
sidebar_label: Overview
description: The Tape Automation API — discover the catalog, then create, version, validate, and run automations (a trigger, an optional filter, and ordered actions) scoped to an app.
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Admonition from '@theme/Admonition';

<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '18px 22px',
  margin: '0 0 28px',
  borderRadius: '12px',
  border: '2px solid #E0A72E',
  background: 'rgba(224, 167, 46, 0.10)',
}}>
  <span style={{
    flexShrink: 0,
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontWeight: 800,
    fontSize: '19px',
    letterSpacing: '0.16em',
    color: '#1c1400',
    background: '#E0A72E',
    padding: '6px 16px',
    borderRadius: '8px',
  }}>BETA</span>
  <span style={{ fontSize: '16px', fontWeight: 600, lineHeight: 1.45, color: 'var(--ifm-font-color-base)' }}>
    This API is an <strong>internal beta and is not released yet.</strong> Endpoints and payloads are not final and may change — or be withdrawn — at any time.
  </span>
</div>

:::caution Not final
While the Automation API is in beta, the endpoints, payloads and behaviour described on these pages may change, or be
withdrawn, at any time without notice. Use at your own risk, and pin nothing you cannot change.
:::

An **automation** is made up of a **trigger** that starts it, an optional **filter** that
decides whether to proceed, and an ordered list of **actions** that it runs — all scoped to a single
[app](/docs/api/resource/app). This API lets you discover what an automation can be built from, create and version
automations, validate them, and run or simulate them against a record.

Automations live _above_ their executions. Each time an automation fires it produces an
[automation run](/docs/api/resource/automation-run); this API manages the **definitions**, and you read their
executions through the existing Automation Run resource.

This overview covers the concepts, the shared authentication rules, the shape of the automation object, and the
resource-wide conventions. The individual endpoints live on the pages listed under
[Working with automations](#working-with-automations).

## The anatomy of an automation

| Part        | Cardinality | What it is                                                                                                                                                                                      |
| ----------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trigger** | 0 or 1      | The event that starts the automation — a record being created, a date arriving, a schedule, an inbound webhook, and so on. See the [trigger object](#the-trigger-object).                       |
| **Filter**  | 0 or 1      | A recursive `and`/`or` tree of conditions the triggering record must match. Omitted or `null` means the automation always runs. See [filters](/docs/api/resource/automation/reference/filters). |
| **Actions** | 0 or more   | An ordered list of steps — send an email, create a record, branch, loop, and so on. See the [action object](#the-action-object).                                                                |

The **catalog** of available trigger types, action types and filter operators — and the exact `config` each one
accepts — is served live by the [discovery endpoints](/docs/api/resource/automation/discovery). Build against those
rather than hard-coding the vocabulary: new types appear there without a change to this API. The full token lists are
also collected in the [reference](/docs/api/resource/automation/reference/triggers) pages.

## Authentication and permissions

:::info Requires a user API key
Every endpoint on this resource requires a **user API key**, with two exceptions: the
[discovery endpoints](#discovery-is-the-exception) and the two [Advanced / Sandbox](/docs/api/resource/automation/advanced)
endpoints (call-automation and generate-weblink) each accept **either** a user or an automation API key. Everywhere
else, an automation API key authenticates an automation, not a person, and therefore carries no workspace role to
check; using one there returns a `401`. See [Authentication](/docs/api/authentication).
:::

You may work with the automations of any app in a workspace you **administrate**. Concretely, for every
automation-scoped call the caller must be an **administrator of the workspace** the automation's app belongs to, and
that workspace must be in your own organization.

#### Discovery is the exception

The three [discovery endpoints](/docs/api/resource/automation/discovery) (`meta/trigger`, `meta/action`,
`meta/filter`) return a **static catalog** that is identical for everyone. They require only a valid API key of
**either** kind and carry no workspace scope.

#### Unavailable automations return `404`

Tape IDs are globally unique, so an ID belonging to another organization is still a perfectly well-formed ID. To
avoid turning these endpoints into a way of probing which IDs exist, every automation that is not available to you
answers the same `404` — whether it does not exist, was deleted, is an unsaved draft, or lives in a workspace you do
not administrate. A request authenticated with the wrong kind of key still returns `401`, and a malformed ID (one
that is not an integer) returns `400`.

## The automation object

A single retrieve returns the automation wrapped under `automation`. Create, update, activate, pause and delete
return the automation in the same envelope, so the shape below is the one you will handle throughout the resource.

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "automation": {
    "id": 4021,
    "app_id": 87,
    "workspace_id": 12,
    "name": "Email the owner on a new high-priority lead",
    "description": "Notifies the record owner whenever a lead is created.",
    "paused": false,
    "broken": false,
    "broken_reason": null,
    "trigger": {
      "type": "record_created",
      "config": { "app_id": 87 }
    },
    "filter": null,
    "actions": [
      {
        "id": "3f9a2c",
        "type": "send_email",
        "group": "action",
        "config": {
          "subject": ["A new lead was created"],
          "smtp_account_id": 5
        }
      }
    ],
    "created_at": "2024-05-14 09:12:31",
    "updated_at": "2024-05-20 16:03:08"
  }
}`}
</ContextCodeBlock>

**Fields**

| Field           | Type               | Description                                                                                                             |
| --------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `id`            | `integer`          | ID of the automation.                                                                                                   |
| `app_id`        | `integer`          | The app the automation belongs to. Only database apps can have automations.                                             |
| `workspace_id`  | `integer`          | The workspace the app belongs to.                                                                                       |
| `name`          | `string`           | Name of the automation.                                                                                                 |
| `description`   | `string`           | Optional description. Absent when the automation has none.                                                              |
| `paused`        | `boolean`          | Whether the automation is paused. See [Status and lifecycle](#status-and-lifecycle).                                    |
| `broken`        | `boolean`          | Whether the automation's definition is not executable.                                                                  |
| `broken_reason` | `object` \| `null` | The reasons the automation is broken, or `null` when it is not. See [Broken reasons](#broken-reasons).                  |
| `trigger`       | `object` \| `null` | The single [trigger](#the-trigger-object), or `null` when none is configured.                                           |
| `filter`        | `object` \| `null` | The root [filter group](#the-filter) — a recursive `and`/`or` condition tree. `null` when the automation has no filter. |
| `actions`       | `array`            | The ordered list of [actions](#the-action-object). An empty array when the automation has none.                         |
| `created_at`    | `string`           | When the automation was created, in UTC.                                                                                |
| `updated_at`    | `string`           | When the automation was last modified, in UTC.                                                                          |

### The trigger object

A trigger is `{ type, config }`. The `type` is one of the public [trigger types](/docs/api/resource/automation/reference/triggers);
`config` holds the trigger's settings, keyed exactly as the trigger's `config_schema` from
[`GET /v1/automation/meta/trigger`](/docs/api/resource/automation/discovery) describes.

| Field    | Type     | Description                                                                        |
| -------- | -------- | ---------------------------------------------------------------------------------- |
| `type`   | `string` | The trigger type, e.g. `record_created`.                                           |
| `config` | `object` | The trigger's settings. Keys and value types follow the trigger's `config_schema`. |

Config values may be **dynamic** — see [Dynamic values](#dynamic-values).

### The filter

The `filter` is a recursive tree of **groups** and **conditions**. A group combines its `rows` with `and` or `or`;
a condition tests a field against an operator. The root group has no `id`; nested nodes do.

| Field      | Type     | Description                                                                                                                     |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `operator` | `string` | `and` (match all) or `or` (match any) — on a group.                                                                             |
| `rows`     | `array`  | A group's children — nested groups or conditions.                                                                               |
| `subject`  | `object` | On a condition: a [reference](#dynamic-values) to the field, record-metadata, trigger-output or action-output being tested.     |
| `operator` | `string` | On a condition: one of the [22 operators](/docs/api/resource/automation/reference/filters), e.g. `is`, `contains`, `is_any_of`. |
| `value`    | `object` | On a condition: the tagged comparison value. Absent for value-less operators such as `is_empty`.                                |

The operators valid for a given field type are returned by
[`GET /v1/automation/meta/filter?field_type=…`](/docs/api/resource/automation/discovery). See
[filters](/docs/api/resource/automation/reference/filters) for the full model, including script conditions.

### Dynamic values

Wherever a value can reference live data — a trigger/action config field, a filter comparison — it is a **dynamic
value**: an ordered array that interleaves literal strings with **references** resolved against the record at run
time. A subject like "the record's Name field" is a reference; `"Hi "` is a literal. See
[Dynamic values](/docs/api/resource/automation/dynamic-values) for the reference model and the full source/value
vocabularies.

### The action object

Each entry in `actions` is one step. Leaf actions do work (`group: "action"`); control-flow actions
(`group: "control_flow"` — a `for_loop` or a `conditional`) nest other actions under `action_rows`.

| Field                | Type               | Description                                                                                                                                                                                   |
| -------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | `string`           | Stable identifier of the action within the automation.                                                                                                                                        |
| `type`               | `string`           | The action type, e.g. `send_email`. See [action types](/docs/api/resource/automation/reference/actions).                                                                                      |
| `group`              | `string`           | `action` for a leaf step, or `control_flow` for a `for_loop` / `conditional`.                                                                                                                 |
| `custom_name`        | `string`           | Optional label for the step. Absent when unset.                                                                                                                                               |
| `deactivate`         | `boolean`          | Whether the step is deactivated (skipped). Absent when unset.                                                                                                                                 |
| `continue_on_error`  | `boolean`          | Whether the run continues when this step errors. Absent when unset.                                                                                                                           |
| `config`             | `object`           | The action's settings, keyed as the action's `config_schema` from `GET /v1/automation/meta/action` describes. [Dynamic values](#dynamic-values) inside are normalized to the reference model. |
| `action_rows`        | `array`            | Nested actions — the `conditional` if/then branch, or the `for_loop` body. Control-flow only.                                                                                                 |
| `condition`          | `object` \| `null` | A `conditional`'s branch condition (a [filter group](#the-filter)); `null` means always.                                                                                                      |
| `else_action_rows`   | `array`            | A `conditional`'s `else` branch — present only when the else branch is enabled.                                                                                                               |
| `iterable`           | `object`           | A `for_loop`'s iterable — a [reference](#dynamic-values) to the collection to loop over.                                                                                                      |
| `break_condition`    | `object` \| `null` | A `for_loop` break condition (a [filter group](#the-filter)) — present only when enabled.                                                                                                     |
| `continue_condition` | `object` \| `null` | A `for_loop` continue condition — present only when enabled.                                                                                                                                  |

:::note Control-flow shapes
See [actions](/docs/api/resource/automation/reference/actions) for the full `conditional` / `for_loop` structure.
A **disabled** branch is absent; an **enabled** branch is present even when empty (`else_action_rows: []`, or a `null` break/continue condition).
:::

### Broken reasons

When `broken` is `true`, `broken_reason` is an object with an `errors` array; each entry has a machine-readable
`code`, an English `message`, and optional references to the app, field or action at fault. The full list of codes is
on the [reference page](/docs/api/resource/automation/reference/errors). To check an automation on demand
rather than reading the stored flag, use [validate](/docs/api/resource/automation/execution).

## Status and lifecycle

An automation has no single `status` field. Its state is the pair of booleans `paused` and `broken`:

| `paused` | `broken` | Meaning                                                                                                                                                               |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `false`  | `false`  | **Live** — the automation runs when its trigger fires.                                                                                                                |
| `true`   | `false`  | **Paused** — a valid automation that is not fired automatically by its trigger. It can still be [manually run or simulated](/docs/api/resource/automation/execution). |
| any      | `true`   | **Broken** — the definition is not executable and will not run.                                                                                                       |

- A newly **created** automation lands **paused** and not broken — a valid draft you configure, then activate.
- **Activate** re-checks the definition and refuses a broken one with a `409`; **pause** always succeeds.
- Every change mints a new immutable [revision](/docs/api/resource/automation/revisions).

The lifecycle endpoints (create, update, activate, pause, delete) are on the
[Manage](/docs/api/resource/automation/manage) page.

## Identifiers and timestamps

Most IDs on this resource are plain JSON **integers** (`id`, `app_id`, `workspace_id`, and the `automation_id` you
pass in a path). The one exception is a **revision ID**, which is a 64-bit value returned as a **string** so it is
safe to handle in any language — see [revisions](/docs/api/resource/automation/revisions). Action `id`s are opaque
**strings**; treat them as handles, not numbers.

All timestamps use the Tape API datetime format — UTC, `YYYY-MM-DD HH:mm:ss`, with no `T` separator, no `Z` suffix and
no milliseconds. See [Date & Timezone](/docs/api/date-timezone).

## Rate limit credits

| Endpoints                                                                                            | Cost              |
| ---------------------------------------------------------------------------------------------------- | ----------------- |
| The [list](/docs/api/resource/automation/manage) endpoints (app, workspace, org)                     | `2x` base credits |
| Everything else — discovery, retrieve, create, update, lifecycle, revisions, validate, run, simulate | `1x` base credits |

This is separate from the automation **action credits** a real [run](/docs/api/resource/automation/execution)
consumes as it executes (reported as `num_consumed_actions` on the resulting run). See
[Request limits](/docs/api/request-limits) for how rate limiting works. Runtime limits — the per-run action cap, the
1000-record collection cap, and the shared email send quota — are covered under
[Automations → Limitations](/docs/automations/limitations).

## Errors

Errors use the standard envelope — `status_code`, `endpoint`, `error_code` and `error_message`. Across this resource:

- `400` — a malformed body or a path ID that is not an integer.
- `401` — the request is not authenticated with a user API key (where one is required).
- `404` — the automation, app, workspace or revision is not available to you (see [above](#unavailable-automations-return-404)).
- `409` — a lifecycle conflict, e.g. activating a broken automation.

See [Errors](/docs/api/errors) for the full list of error codes.

## Working with automations

| Page                                                                                                                                                                                                                                                                                                                     | What it covers                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [Quickstart](/docs/api/resource/automation/quickstart)                                                                                                                                                                                                                                                                   | The whole lifecycle end to end — discover, create, configure, validate, activate, run, observe. |
| [Discovery](/docs/api/resource/automation/discovery)                                                                                                                                                                                                                                                                     | The catalog of trigger, action and filter types, with their config schemas.                     |
| [Manage](/docs/api/resource/automation/manage)                                                                                                                                                                                                                                                                           | Create, retrieve, list, update, replace the trigger, activate, pause and delete.                |
| [Revisions](/docs/api/resource/automation/revisions)                                                                                                                                                                                                                                                                     | The immutable version history of an automation.                                                 |
| [Execution](/docs/api/resource/automation/execution)                                                                                                                                                                                                                                                                     | Run and simulate against a record, and validate a definition.                                   |
| [Advanced / Sandbox](/docs/api/resource/automation/advanced)                                                                                                                                                                                                                                                             | The call-automation and generate-weblink endpoints that back those actions.                     |
| [Dynamic values](/docs/api/resource/automation/dynamic-values)                                                                                                                                                                                                                                                           | How values reference live record and run data.                                                  |
| Reference — [object](/docs/api/resource/automation/reference/object) · [triggers](/docs/api/resource/automation/reference/triggers) · [filters](/docs/api/resource/automation/reference/filters) · [actions](/docs/api/resource/automation/reference/actions) · [errors](/docs/api/resource/automation/reference/errors) | The full object, vocabularies and error codes.                                                  |
