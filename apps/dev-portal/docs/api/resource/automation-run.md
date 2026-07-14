---
id: automation-run
title: Automation Run
sidebar_label: Automation Run
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
of runs are retained, and simulation runs (the ones produced by testing an automation in the editor) are never
returned.

:::info Requires a user API key
Both endpoints require a **user API key**. An automation API key authenticates an automation, not a person, and
therefore carries no workspace role to check — using one here returns a `401`. See
[Authentication](/docs/api/authentication).
:::

## List automation runs

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation-run" />

Returns a page of runs, newest first, without their logs. All body parameters are optional — an empty body lists
every run you may see.

**Body Parameters**

| Parameter       | Type        | Description                                                                                                    |
| --------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| `cursor`        | `string`    | Cursor of the previous page. Mutually exclusive with the filters below — see [Pagination](#pagination).        |
| `limit`         | `integer`   | Page size. Between `1` and `500`. Defaults to `50`.                                                            |
| `app_ids`       | `integer[]` | Only runs of automations belonging to these apps. Max 100 ids. Only database apps can have automations.        |
| `workflow_ids`  | `integer[]` | Only runs of these automations. Max 100 ids.                                                                   |
| `workspace_ids` | `integer[]` | Only runs of automations in these workspaces. Max 100 ids.                                                     |
| `status`        | `string[]`  | Only runs in these statuses. One or more of `pending`, `running`, `completed`, `failed`, `cancelled`.          |

Every id you name must be one you may see: an app, automation or workspace you do not administrate is rejected with
a `401` rather than silently dropped from the filter.

The example below requests the 2 most recent failed runs of the automations in the app with ID 42.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation-run \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "app_ids": [42],
    "status": ["failed"],
    "limit": 2
  }'`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "app_ids": [42],
  "status": ["failed"],
  "limit": 2
}
```

</TabItem>
</Tabs>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 37,
  "workflow_runs": [
    {
      "id": 9001,
      "workflow_automation_id": 88,
      "workflow_automation_revision_id": 3,
      "status": "failed",
      "created_at": "2024-01-18 08:12:04",
      "completed_at": "2024-01-18 08:12:09",
      "num_consumed_actions": 2,
      "triggered_on_record_id": 5001,
      "triggered_on_record_revision_id": 4,
      "triggered_by_automation_id": null
    },
    {
      "id": 8974,
      "workflow_automation_id": 88,
      "workflow_automation_revision_id": 3,
      "status": "failed",
      "created_at": "2024-01-17 22:47:51",
      "completed_at": "2024-01-17 22:47:55",
      "num_consumed_actions": 1,
      "triggered_on_record_id": 4987,
      "triggered_on_record_revision_id": 1,
      "triggered_by_automation_id": 71
    }
  ],
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3b3JrZmxvd1J1bklkIjo4OTc0LCJleHAiOjE2NTA2MTg3Nzh9.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g"
}`}
</ContextCodeBlock>

**Response fields**

| Field           | Type      | Description                                                                                              |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| `total`         | `integer` | Number of runs matching the filters, across all pages. See [Pagination](#pagination).                    |
| `workflow_runs` | `array`   | The page itself. Each entry is a run — see [The run object](#the-run-object).                            |
| `cursor`        | `string`  | Cursor of the last run on this page. Pass it back to fetch the next one. `null` on the last page.        |

### The run object

Each entry in `workflow_runs` — and the `workflow_run` returned when retrieving a single run — has these fields:

| Field                             | Type      | Description                                                                                     |
| --------------------------------- | --------- | ------------------------------------------------------------------------------------------------- |
| `id`                              | `integer` | ID of the run.                                                                                  |
| `workflow_automation_id`          | `integer` | The automation this run executed.                                                               |
| `workflow_automation_revision_id` | `integer` | The revision of the automation this run executed.                                               |
| `status`                          | `string`  | See [Statuses](#statuses).                                                                      |
| `created_at`                      | `string`  | When the run was created, in UTC (`YYYY-MM-DD HH:mm:ss`).                                       |
| `completed_at`                    | `string`  | When the run finished, in UTC. `null` while the run is still `pending` or `running`.            |
| `num_consumed_actions`            | `integer` | Number of action credits this run consumed.                                                     |
| `triggered_on_record_id`          | `integer` | The record this run executed on. `null` if the run was not triggered by a record.               |
| `triggered_on_record_revision_id` | `integer` | The revision of that record. `null` if the run was not triggered by a record.                   |
| `triggered_by_automation_id`      | `integer` | The automation that started this run, if it was called by another automation. `null` otherwise. |

Timestamps use the Tape API datetime format described under [Date & Timezone](/docs/api/date-timezone) — always
UTC, with no `T` separator, no `Z` suffix and no milliseconds.

### Statuses

| Status      | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `pending`   | The run is scheduled and has not started executing yet.        |
| `running`   | The run is currently executing.                                |
| `completed` | The run finished successfully.                                 |
| `failed`    | The run finished with an error.                                |
| `cancelled` | The run was cancelled before it could finish.                  |

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
containing both a `cursor` and any of `app_ids`, `workflow_ids`, `workspace_ids` or `status` is rejected with a
`400` rather than one silently winning over the other.

Runs are returned **newest first** (descending by run ID). You have reached the end of the list when `cursor` is
`null`.

:::info `total` is a snapshot
`total` is measured once, when you request the first page, and then held constant for the rest of the walk.
Automations keep running and old runs keep ageing out of the retention window while you paginate, so the number of
runs you actually receive may differ slightly from it.
:::

:::info Retention
Only runs from the last **30 days** are available. Beyond that they are neither listable nor retrievable. Runs of
deleted automations, and simulation runs from the automation editor, are never returned.
:::

## Retrieve an automation run

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation-run/{workflow_run_id}" />

Retrieve the run with the specified `workflow_run_id`, including its logs. The run itself carries the same fields
as in a listing (see [The run object](#the-run-object)), plus a `logs` array.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/automation-run/9001 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "workflow_run": {
    "id": 9001,
    "workflow_automation_id": 88,
    "workflow_automation_revision_id": 3,
    "status": "failed",
    "created_at": "2024-01-18 08:12:04",
    "completed_at": "2024-01-18 08:12:09",
    "num_consumed_actions": 2,
    "triggered_on_record_id": 5001,
    "triggered_on_record_revision_id": 4,
    "triggered_by_automation_id": null,
    "logs": [
      {
        "id": "9001-trigger",
        "type": "trigger",
        "status": "success",
        "label": "Trigger",
        "messages": [],
        "action_id": null,
        "record_id": 5001,
        "logged_at": "2024-01-18 08:12:04"
      },
      {
        "id": "9001-filter",
        "type": "filter",
        "status": "success",
        "label": "Filter",
        "messages": [],
        "action_id": null,
        "record_id": 5001,
        "logged_at": "2024-01-18 08:12:05"
      },
      {
        "id": "9001-action-a1b2c3-1",
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
        "id": "9001-action-d4e5f6-1",
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

A run is a sequence of **steps**: the trigger that started it, the filter that decided whether to proceed, and one
entry per action executed. This is the same view of a run you get in the Automation Center and in its CSV export —
not the raw internal event stream.

| Field       | Type      | Description                                                                                                             |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string`  | Stable identifier of the step within its run — a durable handle, not a position. See below.                             |
| `type`      | `string`  | `trigger`, `filter`, `action`, or `exception`.                                                                          |
| `status`    | `string`  | Outcome of the step: `in_progress`, `success`, `failure`, `skipped` or `cancelled`.                                     |
| `label`     | `string`  | Human-readable name of the step, e.g. `"Trigger"` or `"Send email"`.                                                    |
| `messages`  | `array`   | The messages the step logged. Each has a `message` and a `level` (`info`, `warn`, `error`, `success`, or `null`).       |
| `action_id` | `string`  | The automation action this step executed. `null` for `trigger`, `filter` and `exception` steps.                         |
| `record_id` | `integer` | The record this step acted on, where it acted on one. `null` otherwise.                                                 |
| `logged_at` | `string`  | When the step was logged, in UTC (`YYYY-MM-DD HH:mm:ss`).                                                               |

Step ids are `"{run_id}-trigger"` and `"{run_id}-filter"` for the trigger and filter. An action step also carries
the execution it belongs to — `"{run_id}-action-{action_id}-{execution_id}"` — because an action inside a loop runs
more than once, and each execution is its own step. An `exception` step is synthesized when a run failed without any
individual step recording the failure.

:::info Log labels and messages are always English
`type`, `status` and `level` are stable, machine-readable values and are never translated. `label` and `message` are
prose, and this endpoint always renders them in English, regardless of the language of the user whose API key is
used.
:::

:::info Unavailable runs return `401`, never `404`
Tape IDs are globally unique, so a run ID belonging to another organization is still a perfectly well-formed ID.
To avoid turning this endpoint into a way of probing which run IDs exist, every run that is not available to you
answers the same `401` — whether it does not exist, was deleted, was a simulation, has aged out of the retention
window, or lives in a workspace you do not administrate.
:::

## Validation errors

A malformed body returns a `400` validation error. For example, sending a `cursor` together with a filter:

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "status_code": 400,
  "endpoint": "/v1/automation-run",
  "error_code": "validation_error",
  "error_message": "Body must match exactly one schema in oneOf."
}`}
</ContextCodeBlock>

The same applies to a `limit` outside `1`–`500`, a filter array with more than 100 ids, an unknown `status`, an
unknown body property, or a run ID that is not an integer. See [Errors](/docs/api/errors) for the full list of
error codes.

## Rate limit credits

Listing automation runs costs `2x` the base credits; retrieving a single run costs `1x`. See
[Request limits](/docs/api/request-limits) for details on how rate limiting works.
