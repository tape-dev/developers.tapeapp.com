# Automation usage report

> Retrieve your organization's automation consumption, with actions consumed and run outcomes, aggregated into time buckets.

Use this endpoint to see how many actions and automation runs your organization used, per hour, day, week, month or year.

The report covers the organization of your credential. You can't read the usage of another organization.

## Retrieve an automation usage report

Use this endpoint to get usage buckets for your organization, newest first.

`GET https://api.tapeapp.com/v1/automation-usage-report`

*Request*

```shell
curl -G https://api.tapeapp.com/v1/automation-usage-report \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  --data-urlencode "limit=30" \
  --data-urlencode "interval_resolution=daily"
```

*Response*

```json
{
  "organization_id": 1337,
  "usage_reports": [
    {
      "organization_id": 1337,
      "from": "2024-01-18 08:12:04",
      "from_utc": "2024-01-18 08:12:04",
      "to": "2024-01-18 22:47:51",
      "to_utc": "2024-01-18 22:47:51",
      "num_consumed_actions": 320,
      "num_succeeded_runs": 540,
      "num_failed_runs": 12,
      "num_cancelled_runs": 3
    },
    {
      "organization_id": 1337,
      "from": "2024-01-17 00:03:11",
      "from_utc": "2024-01-17 00:03:11",
      "to": "2024-01-17 23:58:40",
      "to_utc": "2024-01-17 23:58:40",
      "num_consumed_actions": 412,
      "num_succeeded_runs": 690,
      "num_failed_runs": 20,
      "num_cancelled_runs": 5
    },
    {
      "organization_id": 1337,
      "from": "2024-01-15 09:30:00",
      "from_utc": "2024-01-15 09:30:00",
      "to": "2024-01-15 17:05:22",
      "to_utc": "2024-01-15 17:05:22",
      "num_consumed_actions": 88,
      "num_succeeded_runs": 130,
      "num_failed_runs": 4,
      "num_cancelled_runs": 1
    }
  ]
}
```

The example requests the 30 most recent daily buckets.

The response has no bucket for 2024-01-16, because nothing ran that day.

**General behavior**

-   Buckets come *newest first* (by bucket start), up to `limit`.
-   Tape returns only buckets with activity. Periods without activity don't appear as empty buckets.
-   Bucket boundaries follow the calendar in UTC. `weekly` uses the ISO week: a week starts on Monday at `00:00` UTC.
-   A personal access token limited to some apps still returns the totals of the whole organization. The report has no per-app breakdown.

> Don't see the latest activity?
> 
> A background job builds the report from regular snapshots. The newest bucket can lag behind live activity until the job runs again. Use the endpoint for usage history, not for live metering.

**Requirements:** `automations:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Errors**

A missing, out-of-range or non-integer `limit`, or an unknown `interval_resolution`, returns `400` with `validation`. For example, `limit=250` returns:

*Response*

```json
{
  "status_code": 400,
  "endpoint": "/v1/automation-usage-report",
  "error_code": "validation",
  "error_message": "Query param \"limit\" must be between 0 and 100, got 250."
}
```

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

**Query parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | `integer` | Yes | Number of buckets to return, from `0` to `100`. `0` returns an empty list. |
| `interval_resolution` | `string` | Yes | Size of a bucket. One of `hourly`, `daily`, `weekly`, `monthly` or `yearly`. |

**Response fields**

Each entry in `usage_reports` describes one time bucket:

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `organization_id` | `integer` | The organization of the report. | `1337` |
| `from` | `string` | Start of the earliest reporting interval with activity in the bucket, in UTC (`YYYY-MM-DD HH:mm:ss`). Can be later than the start of the calendar bucket. | `"2024-01-18 08:12:04"` |
| `from_utc` | `string` | Same value as `from`, in UTC. | `"2024-01-18 08:12:04"` |
| `to` | `string` | End of the latest reporting interval with activity in the bucket, in UTC (`YYYY-MM-DD HH:mm:ss`). Can be earlier or later than the end of the calendar bucket. | `"2024-01-18 22:47:51"` |
| `to_utc` | `string` | Same value as `to`, in UTC. | `"2024-01-18 22:47:51"` |
| `num_consumed_actions` | `integer` | Action credits consumed in the bucket. | `320` |
| `num_succeeded_runs` | `integer` | Automation runs that finished successfully (status `completed`). | `540` |
| `num_failed_runs` | `integer` | Automation runs that finished with a failed status. | `12` |
| `num_cancelled_runs` | `integer` | Automation runs that finished with a cancelled status. | `3` |

The top-level `organization_id` repeats the organization of every bucket. `from` and `to` stay in UTC, unlike most dates in the API, because they define the UTC buckets. They use the format described in [Date & timezone](https://developers.tapeapp.com/docs/api/date-timezone): no `T` separator, no `Z` suffix, no milliseconds.

## Rate limit credits

Each request to this endpoint costs `2x` the base credits. See [Request limits](https://developers.tapeapp.com/docs/api/request-limits) for how credits work.

## Next steps

[

Automation run

list single runs and their logs.

](https://developers.tapeapp.com/docs/api/resource/automation-run)[

Request limits

how credits work.

](https://developers.tapeapp.com/docs/api/request-limits)[

Date & timezone

the date format of the API.

](https://developers.tapeapp.com/docs/api/date-timezone)[

Capabilities

what `automations:read` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
