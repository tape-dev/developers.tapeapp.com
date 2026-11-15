---
id: automation-run
title: Automation run
sidebar_label: Automation run
description: List and retrieve Tape automation runs and their step logs through the Developer API.
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Admonition from '@theme/Admonition';

Use these endpoints to list the runs of your automations and to read a single run with its step logs.

An automation run is one execution of an automation. You see the runs of automations in workspaces you *administer*.

The listings leave out simulation runs, which you create when you test an automation in the editor or [simulate](/docs/api/resource/automation/execution#simulate-an-automation) it through the API. The [per-automation listing](#list-runs-for-an-automation) includes them, and you can retrieve any of them by ID.

:::info Which credential and capability do I need?
All endpoints on this page need `automations:read` ([Capabilities](/docs/api/capabilities)) and a credential that acts for a user: a [personal access token](/docs/api/personal-access-tokens), an [OAuth access token](/docs/api/oauth/overview) or a [user API key](/docs/api/authentication#user-api-key).

An automation API key has no workspace role to check and returns `401` with the message `Automation runs can only be listed with a user API key.` (or `... retrieved with ...` for a single run). The message names only the user API key, but a personal access token or an OAuth access token works too.
:::

## List automation runs

Use this endpoint to list the runs you may see, newest first.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation-run" />

The example asks for the 2 most recent successful runs.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation-run \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "status": ["completed"],
    "limit": 2
  }'`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "status": ["completed"],
  "limit": 2
}
```

</TabItem>
</Tabs>

<ContextCodeBlock language="json" title='Response'>
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
      "created_at_utc": "2024-01-18 07:12:04",
      "completed_at": "2024-01-18 08:12:09",
      "completed_at_utc": "2024-01-18 07:12:09",
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
      "created_at_utc": "2024-01-17 21:47:51",
      "completed_at": "2024-01-17 22:47:55",
      "completed_at_utc": "2024-01-17 21:47:55",
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

The example comes from a user whose timezone is one hour ahead of UTC. Each plain timestamp is in that timezone, and its `_utc` twin is the same instant in UTC. The example is shortened: every run also carries `filtering_at`, `started_at`, their `_utc` twins, `execution_duration_ms` and `waiting_duration_ms`.

**Response fields**

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `total` | `integer` | Number of runs that match the filters, across all pages. See [Pagination](#pagination). | `37` |
| `automation_runs` | `array` | The page itself. Each entry is a run. See [The run object](#the-run-object). | `[{ "id": "9001", … }]` |
| `cursor` | `string` | Cursor of the last run on this page. Send it back to get the next page. `null` on the last page. | `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."` |

**General behavior**

- The response contains one page of runs, without logs.
- All body parameters are optional. An empty object `{}` lists every run you may see. A request without a body returns `400`.
- An ID that *exists but that you don't administer* returns `404`. This applies to an app, an automation or a workspace, including one in another organization.
- A *completely unknown* ID is handled differently per filter. An unknown `app_ids` or `workspace_ids` value returns `404`.
- An unknown `automation_ids` value is a *filter, not a lookup*. An ID that never existed, or a soft-deleted automation whose runs you would otherwise see, matches no runs. The response is `200` with an empty list, not `404`.
- Don't use this endpoint to test whether an automation exists. Use `GET /v1/automation/{id}`, which returns `404` in those cases.

**Requirements:** `automations:read`, and the **Admin** role in the workspaces whose runs you list. Works with a personal access token, an OAuth access token or a user API key.

**Body parameters**

| Parameter             | Type        | Description                                                                                                    |
| --------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| `cursor`              | `string`    | Cursor of the previous page. Can't be combined with the filters below. See [Pagination](#pagination).          |
| `limit`               | `integer`   | Page size. Between `1` and `500`. Defaults to `50`.                                                            |
| `app_ids`             | `integer[]` | Only runs of automations that belong to these apps. Max 100 IDs. Only database apps can have automations.     |
| `automation_ids`      | `integer[]` | Only runs of these automations. Max 100 IDs.                                                                   |
| `workspace_ids`       | `integer[]` | Only runs of automations in these workspaces. Max 100 IDs.                                                     |
| `status`              | `string[]`  | Only runs in these statuses. One or more of `pending`, `running`, `completed`, `failed`, `cancelled`.          |
| `created_at_from`     | `string`    | Only runs created at or after this instant, read in your timezone. Inclusive. See [Filtering by date](#filtering-by-date). |
| `created_at_to`       | `string`    | Only runs created at or before this instant, read in your timezone. Inclusive. See [Filtering by date](#filtering-by-date). |
| `created_at_from_utc` | `string`    | Same bound as `created_at_from`, read as UTC. Wins over `created_at_from` when you send both. See [Filtering by date](#filtering-by-date). |
| `created_at_to_utc`   | `string`    | Same bound as `created_at_to`, read as UTC. Wins over `created_at_to` when you send both. See [Filtering by date](#filtering-by-date). |

### The run object

Each entry in `automation_runs` has these fields. So does the `automation_run` you get when you retrieve a single run.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `id` | `string` | ID of the run. A 64-bit integer, returned as a string so that every language can handle it safely. | `"9001"` |
| `automation_id` | `integer` | The automation this run executed. | `88` |
| `automation_name` | `string` | Name of the automation. | `"Notify on new lead"` |
| `automation_revision_id` | `string` | The revision of the automation this run executed. A 64-bit integer, returned as a string. | `"3"` |
| `app_id` | `integer` | The app the automation belongs to. | `42` |
| `app_name` | `string` | Name of that app. | `"Leads"` |
| `workspace_id` | `integer` | The workspace the app belongs to. | `7` |
| `status` | `string` | See [Statuses](#statuses). | `"completed"` |
| `type` | `string` | Execution kind of the run. One of `regular`, `manual`, `simulation`. | `"regular"` |
| `created_at` | `string` | When the run was created (`YYYY-MM-DD HH:mm:ss`), in your timezone. | `"2024-01-18 08:12:04"` |
| `created_at_utc` | `string` | Same instant as `created_at`, in UTC. | `"2024-01-18 07:12:04"` |
| `filtering_at` | `string` \| `null` | When the filtering of the run was scheduled (enqueued), in your timezone. `null` before then. | `"2024-01-18 08:12:04"` |
| `filtering_at_utc` | `string` \| `null` | Same instant as `filtering_at`, in UTC. | `"2024-01-18 07:12:04"` |
| `started_at` | `string` \| `null` | When the run started executing (entered `running`), in your timezone. `null` before then. | `"2024-01-18 08:12:05"` |
| `started_at_utc` | `string` \| `null` | Same instant as `started_at`, in UTC. | `"2024-01-18 07:12:05"` |
| `completed_at` | `string` \| `null` | When the run finished (reached a final status), in your timezone. `null` while the run is `pending` or `running`. | `"2024-01-18 08:12:09"` |
| `completed_at_utc` | `string` \| `null` | Same instant as `completed_at`, in UTC. | `"2024-01-18 07:12:09"` |
| `execution_duration_ms` | `integer` \| `null` | How long the run executed, in milliseconds. `null` until the run completes. | `4000` |
| `waiting_duration_ms` | `integer` \| `null` | How long the run waited (scheduled) before it started executing, in milliseconds. `null` until the run starts. | `1000` |
| `num_consumed_actions` | `integer` | Number of action credits this run consumed. | `2` |
| `failure_reason` | `string` \| `null` | Why the run failed, if it did. One of `filters_setup_failed`, `filters_failed`, `actions_setup_failed`, `actions_failed`, `actions_timeout`, `actions_resource_limit_exceeded`, `exit_on_purpose`. `null` for any run that has not failed. | `null` |
| `error_message` | `string` \| `null` | Readable error detail for a failed run. `null` otherwise. | `null` |
| `triggered_on_record_id` | `integer` \| `null` | The record this run executed on. `null` if no record triggered the run. | `5001` |
| `triggered_on_record_revision_id` | `integer` \| `null` | The revision of that record. `null` if no record triggered the run. | `4` |
| `triggered_by_automation_id` | `integer` \| `null` | The automation that started this run, if another automation called it. `null` otherwise. | `null` |

Timestamps use the [Tape API datetime format](/docs/api/date-timezone) `YYYY-MM-DD HH:mm:ss`, with no `T` separator, no `Z` suffix and no milliseconds. Each plain field is in your timezone, and its `_utc` twin carries the same instant in UTC. Use the plain field for display and the `_utc` field for comparing, sorting and storing.

### Statuses

| Status      | Description                                             |
| ----------- | ------------------------------------------------------- |
| `pending`   | The run is scheduled and has not started executing yet. |
| `running`   | The run is executing.                                   |
| `completed` | The run finished successfully.                          |
| `failed`    | The run finished with an error.                         |
| `cancelled` | The run was cancelled before it could finish.           |

### Filtering by date

Use `created_at_from` and `created_at_to` to list only runs whose `created_at` falls within a window. Both bounds are *inclusive*, and you can send either one on its own.

Both use the format of `created_at` and are read in your timezone, so you can send a value from a response back as a bound.

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation-run \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "created_at_from": "2024-01-18 00:00:00",
    "created_at_to": "2024-01-18 23:59:59"
  }'`}
</ContextCodeBlock>

Computing the bounds yourself? Use `created_at_from_utc` and `created_at_to_utc` instead. They take the same format, read as UTC, and pair with the `created_at_utc` of a run.

A wall-clock time in your timezone is ambiguous when daylight saving time ends. If you send both versions of a bound, the `_utc` version wins.

- `created_at_from` never reaches back beyond the 30 days Tape keeps runs. An older value counts as the start of that window, so you can safely send an open lower bound.
- `created_at_to` has no such limit.
- The lower bound must be at or before the upper bound. Otherwise the request returns `400`.

### Pagination

Results are [paginated](/docs/api/pagination) with a cursor. To get the next page, send the `cursor` from the previous response *on its own*. You can add `limit`:

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation-run \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'`}
</ContextCodeBlock>

The cursor carries the filters of the first page, so don't send them again. A request with a `cursor` and any of `app_ids`, `automation_ids`, `workspace_ids`, `status`, `created_at_from`, `created_at_to`, `created_at_from_utc` or `created_at_to_utc` returns `400`.

Runs come *newest first*, in descending order of run ID. When `cursor` is `null`, you have reached the end of the list.

:::info Why does the number of runs differ from `total`?
Tape counts `total` once, when you request the first page, and keeps it for the rest of the walk. Automations keep running and old runs leave the 30-day window while you page through, so the runs you receive may differ slightly from `total`.
:::

:::info How long are runs kept?
Only runs from the last 30 days are available. Older runs can't be listed or retrieved. Tape doesn't return runs of deleted automations.
:::

## List runs for an app

Use this endpoint to list the runs of all automations of one app, newest first.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation-run/app/{app_id}" />

This variant of [List automation runs](#list-automation-runs) is locked to the app in the path. The body carries [pagination](#pagination) only: `cursor` and `limit`.

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation-run/app/42 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "limit": 2
  }'`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='Response'>
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
      "created_at_utc": "2024-01-18 07:12:04",
      "completed_at": "2024-01-18 08:12:09",
      "completed_at_utc": "2024-01-18 07:12:09",
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

Each entry is a [run object](#the-run-object).

**General behavior**

- The filters and date bounds of the general list are *not* accepted here. Any other body property returns `400`.
- Simulation runs are left out, as in the general list.

**Requirements:** `automations:read`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key. The app must be a database app.

**Errors**

- An `app_id` that is not available to you returns `404`, the same as a missing ID. This is the [protection against probing IDs](#retrieve-an-automation-run) of all endpoints here.
- An ID of an app that is not a database app returns `400`, because only database apps can have automations.

## List runs for a workspace

Use this endpoint to list the runs of all automations in one workspace, newest first.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation-run/workspace/{workspace_id}" />

As in [List runs for an app](#list-runs-for-an-app), the body carries pagination only (`cursor`, `limit`), simulation runs are left out, and the response has the same shape.

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation-run/workspace/7 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "limit": 2
  }'`}
</ContextCodeBlock>

**Requirements:** `automations:read`, and the **Admin** role in the workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

A `workspace_id` that is not available to you returns `404`. You can't tell it apart from a missing one.

## List runs for an automation

Use this endpoint to list the runs of one automation, newest first.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation-run/automation/{automation_id}" />

The body carries pagination only (`cursor`, `limit`). The response has the same shape as in [List runs for an app](#list-runs-for-an-app).

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation-run/automation/88 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "limit": 2
  }'`}
</ContextCodeBlock>

After a [manual run](/docs/api/resource/automation/execution#run-an-automation) or a [simulation](/docs/api/resource/automation/execution#simulate-an-automation), find your run by `triggered_on_record_id` and `type` (`manual` or `simulation`).

:::info Why do I see simulation runs here?
This listing matches the run history of an automation in Tape, so it includes *simulation runs*. They count in `total` and appear in `automation_runs`.
:::

**Requirements:** `automations:read`, and the **Admin** role in the automation's workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

An `automation_id` that is missing, deleted or not one you administer returns the same `404`.

## Retrieve an automation run

Use this endpoint to read one run with its step logs.

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation-run/{automation_run_id}" />

To find `automation_run_id`, use the `id` of a run from a listing. The run has the same fields as [a run in a listing](#the-run-object), plus a `logs` array.

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/automation-run/9042 \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='Response'>
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
    "created_at_utc": "2024-01-18 07:12:04",
    "completed_at": "2024-01-18 08:12:09",
    "completed_at_utc": "2024-01-18 07:12:09",
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
        "label": "When a record is created triggered by Record ID 5001",
        "messages": [],
        "action_id": null,
        "record_id": 5001,
        "logged_at": "2024-01-18 08:12:04",
        "logged_at_utc": "2024-01-18 07:12:04"
      },
      {
        "id": "9042-filter",
        "type": "filter",
        "status": "success",
        "label": "And if the following conditions are met",
        "messages": [
          { "message": "[07:12:05.020] Filters executed successfully.", "level": null }
        ],
        "action_id": null,
        "record_id": 5001,
        "logged_at": "2024-01-18 08:12:05",
        "logged_at_utc": "2024-01-18 07:12:05"
      },
      {
        "id": "9042-action-a1b2c3-1",
        "type": "action",
        "status": "success",
        "label": "Send an email",
        "messages": [
          { "message": "[07:12:06.310] Action execution started.", "level": null },
          { "message": "[07:12:06.920] Sending email with subject \\"New lead\\" to \\"juliet@acme.com\\"", "level": null },
          { "message": "[07:12:07.412] Action execution succeeded.", "level": null }
        ],
        "action_id": "a1b2c3",
        "record_id": 5001,
        "logged_at": "2024-01-18 08:12:07",
        "logged_at_utc": "2024-01-18 07:12:07"
      },
      {
        "id": "9042-action-d4e5f6-1",
        "type": "action",
        "status": "failure",
        "label": "Update the current record performed on Record ID 5001",
        "messages": [
          { "message": "[07:12:08.120] Action execution started.", "level": null },
          { "message": "[07:12:09.033] Action execution failed with error:\\nRequired field \\"Name\\" is missing.", "level": "error" }
        ],
        "action_id": "d4e5f6",
        "record_id": 5001,
        "logged_at": "2024-01-18 08:12:09",
        "logged_at_utc": "2024-01-18 07:12:09"
      }
    ]
  }
}`}
</ContextCodeBlock>

**Requirements:** `automations:read`, and the **Admin** role in the automation's workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- A run that is not available to you returns `404`: it doesn't exist, was deleted, is older than 30 days, or belongs to a workspace you don't administer. Tape IDs are unique across all organizations, so one `404` for every case keeps anyone from probing which run IDs exist.
- An automation API key returns `401`.
- A run ID that is not an integer returns `400`.

### The log object

A run is a sequence of *steps*: the trigger that started it, the filter that decided whether to go on, and one entry per executed action. This is the same view of a run as under **Automations** → **Runs** in Tape and in its export (**Export runs**), not the raw internal event stream.

:::caution Missing the step of an action?
A `completed` run does *not* guarantee a `success` step for every top-level action. Control-flow containers (`conditional`, `for_loop`) log only their *nested* actions, and a *deactivated* action (`deactivate: true`) logs *no* entry, not even a `skipped` one. Some actions finish without a step, for example a skipped `authenticated_http_call`, `collected_records_collect_referenced_records`, or a `referenced_records_update` on a record without related records in its app. Match on the `action_id` you expect: a missing step doesn't prove that the run failed.
:::

:::info Don't see all steps of a run yet?
The trigger and filter steps are there from the start. Tape buffers the action steps, so they arrive *after* the run reaches its final status. When you poll, wait for the step of your `action_id`, not for `logs.length > 0`.
:::

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `id` | `string` | Stable ID of the step within its run. A durable handle, not a position. See below. | `"9042-action-a1b2c3-1"` |
| `type` | `string` | `trigger`, `filter`, `action` or `exception`. | `"action"` |
| `status` | `string` | Outcome of the step: `in_progress`, `success`, `failure`, `skipped` or `cancelled`. | `"success"` |
| `label` | `string` | Readable description of the step, as in the run log in Tape, for example `"When a record is created triggered by Record ID 5001"` or `"Send an email"`. An action with a custom name in the editor shows that name. | `"Send an email"` |
| `messages` | `array` | The messages the step logged. Each has a `message` and a `level` (`info`, `warn`, `error`, `success` or `null`). A message starts with its time in UTC, `[HH:mm:ss.SSS]`. | `[{ "message": "[07:12:06.310] Action execution started.", "level": null }]` |
| `action_id` | `string` \| `null` | The automation action this step executed. `null` for `trigger`, `filter` and `exception` steps. | `"a1b2c3"` |
| `record_id` | `integer` \| `null` | The record this step acted on, if it acted on one. `null` otherwise. | `5001` |
| `logged_at` | `string` | When the step was logged (`YYYY-MM-DD HH:mm:ss`), in your timezone. | `"2024-01-18 08:12:07"` |
| `logged_at_utc` | `string` | Same instant as `logged_at`, in UTC. | `"2024-01-18 07:12:07"` |

The trigger step has the ID `"{run_id}-trigger"` and the filter step `"{run_id}-filter"`. An action step also carries the execution it belongs to: `"{run_id}-action-{action_id}-{execution_id}"`. An action inside a loop runs more than once, and each execution is its own step. An action that changes several records in one execution, such as `collected_records_update`, writes one step per record with the same `id`. Tell them apart by `record_id`.

Tape adds an `exception` step when a run failed and no single step recorded the failure.

:::note When is a step `skipped`?
When the run did not execute it on purpose. That is the *trigger* step of a manual or simulation run, and the *filter* step of a simulation run. In a simulation, the steps of actions that change records, such as `record_create` or `current_record_update`, read `skipped` too. Other action steps of a simulation, for example `custom_variable` or `send_email`, read `success`, but the simulation still has no side effects. A regular run produces no `skipped` steps.
:::

:::info Why are labels and messages in English?
`type`, `status` and `level` are stable values for machines and are never translated. `label` and `message` are prose, and this endpoint returns them in English, whatever the language of the user behind the credential.
:::

## Validation errors

A malformed body returns a `400` validation error. For example, a `cursor` sent together with a filter:

<ContextCodeBlock language="json" title='Response'>
{`{
  "status_code": 400,
  "endpoint": "/v1/automation-run",
  "error_code": "input_validation",
  "error_message": "Invalid input: data must match exactly one schema in oneOf ([...])"
}`}
</ContextCodeBlock>

The same applies to:

- a `limit` outside `1`–`500`;
- a filter array with more than 100 IDs;
- an unknown `status` or an unknown body property;
- a date bound that is not a valid `YYYY-MM-DD HH:mm:ss` datetime;
- a run ID that is not an integer.

A lower date bound later than the upper bound also returns `400`. The message names the fields you sent, for example `created_at_from_utc` if you used the UTC version:

<ContextCodeBlock language="json" title='Response'>
{`{
  "status_code": 400,
  "endpoint": "/v1/automation-run",
  "error_code": "validation",
  "error_message": "\\"created_at_from\\" must be before or equal to \\"created_at_to\\"."
}`}
</ContextCodeBlock>

See [Errors](/docs/api/errors) for the full list of error codes.

## Rate limit credits

Each listing endpoint costs `2x` the base credits: the general list and the variants per app, per workspace and per automation. Retrieving a single run costs `1x`. See [Request limits](/docs/api/request-limits) for how rate limiting works.

## Next steps

- [Automation API](/docs/api/resource/automation/overview): create, change and run the automations behind these runs.
- [Date & timezone](/docs/api/date-timezone): how plain and `_utc` timestamps work.
- [Pagination](/docs/api/pagination): page through long lists of runs.
- [exit](/docs/api/resource/automation/reference/actions/exit): stop a run on purpose with `exit_on_purpose`.
- [Authentication](/docs/api/authentication): pick the right credential for these endpoints.
- [Capabilities](/docs/api/capabilities): what `automations:read` allows.
- [Errors](/docs/api/errors): the error envelope and all error codes.
