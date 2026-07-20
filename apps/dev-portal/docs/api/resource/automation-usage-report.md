---
id: automation-usage-report
title: Automation Usage Report
sidebar_label: Automation Usage Report
description: Retrieve your organization's automation consumption — actions consumed and run outcomes — aggregated into time buckets.
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Admonition from '@theme/Admonition';

Retrieve your organization's historical automation consumption — actions consumed and automation run
outcomes — aggregated into time buckets.

The report is always scoped to the organization of the API key making the request. There is no way
to read another organization's usage.

## Retrieve an automation usage report

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation-usage-report" />

Returns usage buckets for the calling key's organization, most-recent first. Both query parameters
are required.

**Query Parameters**

| Parameter             | Type      | Required | Description                                                                                              |
| --------------------- | --------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `limit`               | `integer` | Yes      | Maximum number of buckets to return. Must be between `0` and `100` inclusive. `0` returns an empty list. |
| `interval_resolution` | `string`  | Yes      | Bucket size. One of `hourly`, `daily`, `weekly`, `monthly`, `yearly`.                                    |

The example below requests the 30 most recent daily buckets.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -G #BASE_URL/v1/automation-usage-report \\
  -u #USER_API_KEY: \\
  --data-urlencode "limit=30" \\
  --data-urlencode "interval_resolution=daily"`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "organization_id": 1337,
  "usage_reports": [
    {
      "organization_id": 1337,
      "from": "2024-01-18 08:12:04",
      "to": "2024-01-18 22:47:51",
      "num_consumed_actions": 320,
      "num_succeeded_runs": 540,
      "num_failed_runs": 12,
      "num_cancelled_runs": 3
    },
    {
      "organization_id": 1337,
      "from": "2024-01-17 00:03:11",
      "to": "2024-01-17 23:58:40",
      "num_consumed_actions": 412,
      "num_succeeded_runs": 690,
      "num_failed_runs": 20,
      "num_cancelled_runs": 5
    },
    {
      "organization_id": 1337,
      "from": "2024-01-15 09:30:00",
      "to": "2024-01-15 17:05:22",
      "num_consumed_actions": 88,
      "num_succeeded_runs": 130,
      "num_failed_runs": 4,
      "num_cancelled_runs": 1
    }
  ]
}`}
</ContextCodeBlock>

(Note that 2024-01-16 is absent above: buckets with no underlying activity are not returned.)

**Response fields**

Each entry in `usage_reports` describes a single time bucket:

| Field                         | Type      | Description                                                                                                                                |
| ----------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `organization_id`             | `integer` | The organization the report belongs to.                                                                                                    |
| `from`                        | `string`  | Earliest underlying record time in the bucket, in UTC (`YYYY-MM-DD HH:mm:ss`). May be later than the nominal start of the calendar bucket. |
| `to`                          | `string`  | Latest underlying record time in the bucket, in UTC (`YYYY-MM-DD HH:mm:ss`). May be earlier than the nominal end of the calendar bucket.   |
| `num_consumed_actions`        | `integer` | Total action credits consumed in the bucket.                                                                                               |
| `num_succeeded_runs`          | `integer` | Number of automation runs that finished successfully (`completed` status).                                                                 |
| `num_failed_runs`             | `integer` | Number of automation runs that finished with a failed status.                                                                              |
| `num_cancelled_runs`          | `integer` | Number of automation runs that finished with a cancelled status.                                                                           |

The top-level `organization_id` mirrors the organization of every bucket and is provided for
convenience. `from` and `to` use the Tape API datetime format described under
[Date & Timezone](/docs/api/date-timezone) — always UTC, with no `T` separator, no `Z` suffix and no
milliseconds.

### Ordering & bucketing

- Buckets are returned **most-recent first** (descending by bucket start), capped at `limit`.
- Only buckets that contain at least one underlying record are returned — there are no zero-filled
  gaps for periods without activity.
- Bucket boundaries follow the calendar in UTC. `weekly` uses the ISO week, anchored to Monday — a
  week starts on Monday at `00:00` UTC.

:::info
The figures are **not real-time**. They are built from periodic snapshots written by a background
reporting job, so the most recent bucket can lag live activity until the next reporting interval
runs. Treat this endpoint as historical / near-real-time usage reporting rather than live metering.
:::

## Validation errors

A missing, out-of-range or non-integer `limit`, or an unknown `interval_resolution`, returns a
`400` validation error. For example, requesting `limit=250`:

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "status_code": 400,
  "endpoint": "/v1/automation-usage-report",
  "error_code": "validation",
  "error_message": "Query param \\"limit\\" must be between 0 and 100, got 250."
}`}
</ContextCodeBlock>

See [Errors](/docs/api/errors) for the full list of error codes.

## Rate limit credits

Each call to this endpoint costs `2x` the base credits. See
[Request limits](/docs/api/request-limits) for details on how rate limiting works.
