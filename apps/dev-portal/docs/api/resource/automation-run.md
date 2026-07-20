---
id: automation-run
title: Automation Run
sidebar_label: Automation Run
description: List and retrieve Tape automation runs and their step logs through the Developer API.
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Admonition from '@theme/Admonition';

An automation run is a single execution of one of your automations. The API lets you list the runs you may see —
optionally filtered by app, automation, workspace and status — and retrieve an individual run together with its
logs.

You see the runs of automations that belong to apps in a workspace you **administrate**. Only the last **30 days**
of runs are retained. Simulation runs — the ones produced by testing an automation in the editor — are excluded
from the listings, except the [per-automation listing](#list-runs-for-an-automation); they can still be retrieved
individually by id.

:::info Requires a user API key
Both endpoints require a **user API key**. An automation API key authenticates an automation, not a person, and
therefore carries no workspace role to check — using one here returns a `401`. See
[Authentication](/docs/api/authentication).
:::

## List automation runs

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation-run" />

Returns a page of runs, newest first, without logs. All body parameters are optional — an empty body lists
every run you may see.

**Body Parameters**

| Parameter         | Type        | Description                                                                                             |
| ----------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| `cursor`          | `string`    | Cursor of the previous page. Mutually exclusive with the filters below — see [Pagination](#pagination). |
| `limit`           | `integer`   | Page size. Between `1` and `500`. Defaults to `50`.                                                     |
| `app_ids`         | `integer[]` | Only runs of automations belonging to these apps. Max 100 ids. Only database apps can have automations. |
| `automation_ids`  | `integer[]` | Only runs of these automations. Max 100 ids.                                                            |
| `workspace_ids`   | `integer[]` | Only runs of automations in these workspaces. Max 100 ids.                                              |
| `status`          | `string[]`  | Only runs in these statuses. One or more of `pending`, `running`, `completed`, `failed`, `cancelled`.   |
| `created_at_from` | `string`    | Only runs created at or after this instant. Inclusive. See [Filtering by date](#filtering-by-date).     |
| `created_at_to`   | `string`    | Only runs created at or before this instant. Inclusive. See [Filtering by date](#filtering-by-date).    |

Every id you name must be one you may see: an app, automation or workspace you do not administrate is rejected with
a `404`.

The example below requests the 2 most recent successful runs you may see.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation-run \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "status": ["completed"],
    "limit": 2
  }'`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request"
{
  "status": ["completed"],
  "limit": 2
}
```

</TabItem>
</Tabs>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 37,
  "automation_runs": [
    {
      "id": "9001",
      "automation_id": 88,
      "automation_name": "Notify on new lead",
      "automation_revision_id": "3",
      "app_id": 42,
      "app_name": "Leads",
      "workspace_id": 7,
      "status": "completed",
      "type": "regular",
      "created_at": "2024-01-18 08:12:04",
      "completed_at": "2024-01-18 08:12:09",
      "num_consumed_actions": 2,
      "failure_reason": null,
      "error_message": null,
      "triggered_on_record_id": 5001,
      "triggered_on_record_revision_id": 4,
      "triggered_by_automation_id": null
    },
    {
      "id": "8974",
      "automation_id": 88,
      "automation_name": "Notify on new lead",
      "automation_revision_id": "3",
      "app_id": 42,
      "app_name": "Leads",
      "workspace_id": 7,
      "status": "completed",
      "type": "regular",
      "created_at": "2024-01-17 22:47:51",
      "completed_at": "2024-01-17 22:47:55",
      "num_consumed_actions": 1,
      "failure_reason": null,
      "error_message": null,
      "triggered_on_record_id": 4987,
      "triggered_on_record_revision_id": 1,
      "triggered_by_automation_id": 71
    }
  ],
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3b3JrZmxvd1J1bklkIjo4OTc0LCJleHAiOjE2NTA2MTg3Nzh9.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g"
}`}
</ContextCodeBlock>

**Response fields**

| Field             | Type      | Description                                                                                       |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------- |
| `total`           | `integer` | Number of runs matching the filters, across all pages. See [Pagination](#pagination).             |
| `automation_runs` | `array`   | The page itself. Each entry is a run — see [The run object](#the-run-object).                     |
| `cursor`          | `string`  | Cursor of the last run on this page. Pass it back to fetch the next one. `null` on the last page. |

### The run object

Each entry in `automation_runs` — and the `automation_run` returned when retrieving a single run — has these fields:

| Field                             | Type               | Description                                                                                                                                                                                                                                 |
| --------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                              | `string`           | ID of the run. A 64-bit integer, returned as a string so it is safe to handle in any language.                                                                                                                                              |
| `automation_id`                   | `integer`          | The automation this run executed.                                                                                                                                                                                                           |
| `automation_name`                 | `string`           | Name of the automation.                                                                                                                                                                                                                     |
| `automation_revision_id`          | `string`           | The revision of the automation this run executed. A 64-bit integer, returned as a string.                                                                                                                                                   |
| `app_id`                          | `integer`          | The app the automation belongs to.                                                                                                                                                                                                          |
| `app_name`                        | `string`           | Name of that app.                                                                                                                                                                                                                           |
| `workspace_id`                    | `integer`          | The workspace the app belongs to.                                                                                                                                                                                                           |
| `status`                          | `string`           | See [Statuses](#statuses).                                                                                                                                                                                                                  |
| `type`                            | `string`           | Execution kind of the run — one of `regular`, `manual`, `simulation`.                                                                                                                                                                       |
| `created_at`                      | `string`           | When the run was created, in UTC (`YYYY-MM-DD HH:mm:ss`).                                                                                                                                                                                   |
| `filtering_at`                    | `string` \| `null` | When the run's filtering was scheduled (enqueued), in UTC. `null` before then.                                                                                                                                                              |
| `started_at`                      | `string` \| `null` | When the run started executing (entered `running`), in UTC. `null` before then.                                                                                                                                                            |
| `completed_at`                    | `string` \| `null` | When the run finished (reached a terminal state), in UTC. `null` while still `pending` or `running`.                                                                                                                                        |
| `execution_duration_ms`           | `integer` \| `null` | Duration of the run's execution, in milliseconds. `null` until the run completes.                                                                                                                                                          |
| `waiting_duration_ms`             | `integer` \| `null` | Time the run waited (scheduled) before it started executing, in milliseconds. `null` until the run starts.                                                                                                                                 |
| `num_consumed_actions`            | `integer`          | Number of action credits this run consumed.                                                                                                                                                                                                 |
| `failure_reason`                  | `string` \| `null` | Why the run failed, if it did — one of `filters_setup_failed`, `filters_failed`, `actions_setup_failed`, `actions_failed`, `actions_timeout`, `actions_resource_limit_exceeded`, `exit_on_purpose`. `null` for any run that has not failed. |
| `error_message`                   | `string` \| `null` | Human-readable error detail for a failed run. `null` otherwise.                                                                                                                                                                             |
| `triggered_on_record_id`          | `integer`          | The record this run executed on. `null` if the run was not triggered by a record.                                                                                                                                                           |
| `triggered_on_record_revision_id` | `integer`          | The revision of that record. `null` if the run was not triggered by a record.                                                                                                                                                               |
| `triggered_by_automation_id`      | `integer`          | The automation that started this run, if it was called by another automation. `null` otherwise.                                                                                                                                             |

Timestamps use the Tape API datetime format described under [Date & Timezone](/docs/api/date-timezone) — always
UTC, with no `T` separator, no `Z` suffix and no milliseconds.

### Statuses

| Status      | Description                                             |
| ----------- | ------------------------------------------------------- |
| `pending`   | The run is scheduled and has not started executing yet. |
| `running`   | The run is currently executing.                         |
| `completed` | The run finished successfully.                          |
| `failed`    | The run finished with an error.                         |
| `cancelled` | The run was cancelled before it could finish.           |

### Filtering by date

`created_at_from` and `created_at_to` restrict the listing to runs whose `created_at` falls within a window. Both
use the Tape API datetime format — `YYYY-MM-DD HH:mm:ss`, always UTC, no `T` separator and no `Z` suffix (see
[Date & Timezone](/docs/api/date-timezone)) — and both bounds are **inclusive**. Either may be given on its own.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation-run \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "created_at_from": "2024-01-18 00:00:00",
    "created_at_to": "2024-01-18 23:59:59"
  }'`}
</ContextCodeBlock>

- `created_at_from` never reaches past retention: a value older than the retained window is treated as the start of
  the window, so you can safely pass an open-ended lower bound.
- `created_at_to` has no such bound.
- `created_at_from` must be at or before `created_at_to`; otherwise the request is rejected with a `400`.

### Pagination

Results are [paginated](/docs/api/pagination) with a cursor. To fetch the next page, send the `cursor` from the
previous response **on its own** — optionally alongside `limit`:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation-run \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'`}
</ContextCodeBlock>

The filters that produced a page are carried inside the cursor, so you must not re-send them with it. A request
containing both a `cursor` and any of `app_ids`, `automation_ids`, `workspace_ids`, `status`, `created_at_from` or
`created_at_to` is rejected with a `400` rather than one silently winning over the other.

Runs are returned **newest first** (descending by run ID). You have reached the end of the list when `cursor` is
`null`.

:::info `total` is a snapshot
`total` is measured once, when you request the first page, and then held constant for the rest of the walk.
Automations keep running and old runs keep ageing out of the retention window while you paginate, so the number of
runs you actually receive may differ slightly from it.
:::

:::info Retention
Only runs from the last **30 days** are available. Beyond that they are neither listable nor retrievable. Runs of
deleted automations are not returned, and simulation runs from the automation editor are excluded from this listing
(the [per-automation listing](#list-runs-for-an-automation) is the one exception).
:::

## List runs for an app

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation-run/app/{app_id}" />

List the runs of the automations belonging to the app with the specified `app_id`, newest first. This is a
scope-locked variant of [List automation runs](#list-automation-runs): the app is fixed by the path, so the body
carries pagination only — `cursor` and `limit`, exactly as [described above](#pagination). The filters and date
bounds of the general list are **not** accepted here; sending any other property returns a `400`. Simulation runs
are excluded, as in the general list. You must administrate the workspace the app lives in, and the app must be a
database app.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation-run/app/42 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "limit": 2
  }'`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 37,
  "automation_runs": [
    {
      "id": "9001",
      "automation_id": 88,
      "automation_name": "Notify on new lead",
      "automation_revision_id": "3",
      "app_id": 42,
      "app_name": "Leads",
      "workspace_id": 7,
      "status": "completed",
      "type": "regular",
      "created_at": "2024-01-18 08:12:04",
      "completed_at": "2024-01-18 08:12:09",
      "num_consumed_actions": 2,
      "failure_reason": null,
      "error_message": null,
      "triggered_on_record_id": 5001,
      "triggered_on_record_revision_id": 4,
      "triggered_by_automation_id": null
    }
  ],
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
</ContextCodeBlock>

Each entry is a [run object](#the-run-object). An `app_id` that is not available to you returns a `404`,
indistinguishable from a missing id — the same [existence-oracle protection](#retrieve-an-automation-run) as the
other endpoints — and an id that refers to an app which is not a database app returns a `400`, since only database
apps can have automations.

## List runs for a workspace

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation-run/workspace/{workspace_id}" />

List the runs of the automations belonging to the workspace with the specified `workspace_id`, newest first. As with
[List runs for an app](#list-runs-for-an-app), the body carries pagination only (`cursor`, `limit`), simulation runs
are excluded, and the response shape is identical. You must administrate the workspace.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation-run/workspace/7 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "limit": 2
  }'`}
</ContextCodeBlock>

A `workspace_id` that is not available to you returns a `404`, indistinguishable from a missing one.

## List runs for an automation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation-run/automation/{automation_id}" />

List the runs of the automation with the specified `automation_id`, newest first. The body carries pagination only
(`cursor`, `limit`) and the response shape is identical to [List runs for an app](#list-runs-for-an-app). You must
administrate the workspace the automation lives in.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation-run/automation/88 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "limit": 2
  }'`}
</ContextCodeBlock>

:::info This endpoint includes simulation runs
Unlike every other listing, this one mirrors the per-automation run history you see in the product, so it includes
**simulation (preview) runs** — the ones produced by testing the automation in the editor — in both `total` and
`automation_runs`. The general list and the per-app and per-workspace endpoints all exclude them.
:::

An `automation_id` that is missing, deleted, or not one you administrate returns the same `404`.

## Retrieve an automation run

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation-run/{automation_run_id}" />

Retrieve the run with the specified `automation_run_id`, including its logs. The run itself carries the same fields
as in a listing (see [The run object](#the-run-object)), plus a `logs` array. Simulation runs can be retrieved
here too, even though they are excluded from most listings.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/automation-run/9042 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "automation_run": {
    "id": "9042",
    "automation_id": 88,
    "automation_name": "Notify on new lead",
    "automation_revision_id": "3",
    "app_id": 42,
    "app_name": "Leads",
    "workspace_id": 7,
    "status": "failed",
    "type": "regular",
    "created_at": "2024-01-18 08:12:04",
    "completed_at": "2024-01-18 08:12:09",
    "num_consumed_actions": 2,
    "failure_reason": "actions_failed",
    "error_message": "Required field \\"Name\\" is missing.",
    "triggered_on_record_id": 5001,
    "triggered_on_record_revision_id": 4,
    "triggered_by_automation_id": null,
    "logs": [
      {
        "id": "9042-trigger",
        "type": "trigger",
        "status": "success",
        "label": "Trigger",
        "messages": [],
        "action_id": null,
        "record_id": 5001,
        "logged_at": "2024-01-18 08:12:04"
      },
      {
        "id": "9042-filter",
        "type": "filter",
        "status": "success",
        "label": "Filter",
        "messages": [],
        "action_id": null,
        "record_id": 5001,
        "logged_at": "2024-01-18 08:12:05"
      },
      {
        "id": "9042-action-a1b2c3-1",
        "type": "action",
        "status": "success",
        "label": "Send email",
        "messages": [
          { "message": "Email sent to dan@tapeapp.com", "level": "success" }
        ],
        "action_id": "a1b2c3",
        "record_id": 5001,
        "logged_at": "2024-01-18 08:12:07"
      },
      {
        "id": "9042-action-d4e5f6-1",
        "type": "action",
        "status": "failure",
        "label": "Create record",
        "messages": [
          { "message": "Required field \\"Name\\" is missing.", "level": "error" }
        ],
        "action_id": "d4e5f6",
        "record_id": null,
        "logged_at": "2024-01-18 08:12:09"
      }
    ]
  }
}`}
</ContextCodeBlock>

### The log object

A run is a sequence of **steps**: the trigger that started it, the filter that decided whether to proceed, and an
entry per executed action. This is the same view of a run you get in the Automation Center and in its CSV export —
not the raw internal event stream.

:::caution Not every action emits its own step
A `completed` run does **not** guarantee a per-action `success` step for every top-level action. Control-flow
containers (`conditional`, `for_loop`) log their **nested** actions, not themselves; and some actions can reach a
clean `completed` with no `success` step of their own id (e.g. a codegen-skipped `authenticated_http_call`,
`collected_records_collect_referenced_records`, or a no-op update). Match on the specific `action_id` you expect — the
absence of a step is not proof the run failed.
:::

:::info Logs arrive asynchronously
Structured logs are buffered and land **after** the run flips to a terminal status — the trigger/filter steps first,
an action's step a beat later. When polling, wait for the **specific** log you need (the step for your `action_id`),
not merely for `logs.length > 0`, or you may read the run before its action steps are in.
:::

| Field       | Type      | Description                                                                                                       |
| ----------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| `id`        | `string`  | Stable identifier of the step within its run — a durable handle, not a position. See below.                       |
| `type`      | `string`  | `trigger`, `filter`, `action`, or `exception`.                                                                    |
| `status`    | `string`  | Outcome of the step: `in_progress`, `success`, `failure`, `skipped` or `cancelled`.                               |
| `label`     | `string`  | Human-readable name of the step, e.g. `"Trigger"` or `"Send email"`.                                              |
| `messages`  | `array`   | The messages the step logged. Each has a `message` and a `level` (`info`, `warn`, `error`, `success`, or `null`). |
| `action_id` | `string`  | The automation action this step executed. `null` for `trigger`, `filter` and `exception` steps.                   |
| `record_id` | `integer` | The record this step acted on, where it acted on one. `null` otherwise.                                           |
| `logged_at` | `string`  | When the step was logged, in UTC (`YYYY-MM-DD HH:mm:ss`).                                                         |

Step ids are `"{run_id}-trigger"` and `"{run_id}-filter"` for the trigger and filter. An action step also carries
the execution it belongs to — `"{run_id}-action-{action_id}-{execution_id}"` — because an action inside a loop runs
more than once, and each execution is its own step. An `exception` step is synthesized when a run failed without any
individual step recording the failure.

:::info Log labels and messages are always English
`type`, `status` and `level` are stable, machine-readable values and are never translated. `label` and `message` are
prose, and this endpoint always renders them in English, regardless of the language of the user whose API key is
used.
:::

:::info Unavailable runs return `404`, never a distinguishable error
Tape IDs are globally unique, so a run ID belonging to another organization is still a perfectly well-formed ID.
To avoid turning this endpoint into a way of probing which run IDs exist, every run that is not available to you
answers the same `404` — whether it does not exist, was deleted, has aged out of the retention window, or lives in
a workspace you do not administrate. A run authenticated with the wrong kind of key (not a user API key) still
returns `401`, and a run ID that is not an integer returns `400`.
:::

## Validation errors

A malformed body returns a `400` validation error. For example, sending a `cursor` together with a filter:

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "status_code": 400,
  "endpoint": "/v1/automation-run",
  "error_code": "input_validation",
  "error_message": "Invalid input: data must match exactly one schema in oneOf ([...])"
}`}
</ContextCodeBlock>

The same applies to a `limit` outside `1`–`500`, a filter array with more than 100 ids, an unknown `status`, a
`created_at_from` or `created_at_to` that is not a valid `YYYY-MM-DD HH:mm:ss` datetime, an unknown body property,
or a run ID that is not an integer.

A `created_at_from` later than `created_at_to` is likewise a `400`:

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "status_code": 400,
  "endpoint": "/v1/automation-run",
  "error_code": "validation",
  "error_message": "\\"created_at_from\\" must be before or equal to \\"created_at_to\\"."
}`}
</ContextCodeBlock>

See [Errors](/docs/api/errors) for the full list of error codes.

## Rate limit credits

Any of the listing endpoints — the general list and the per-app, per-workspace and per-automation variants — costs
`2x` the base credits; retrieving a single run costs `1x`. See
[Request limits](/docs/api/request-limits) for details on how rate limiting works.
