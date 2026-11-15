# Date & timezone

> Read, write and filter dates and datetimes in the Tape API, in your timezone or in UTC.

Read, write and filter dates and datetimes in the Tape API, in your timezone or in UTC.

Every temporal value in the Tape API is a *string*, never an epoch number or an object.

## Formats

| Format | Shape | Example | Used for |
| --- | --- | --- | --- |
| Datetime | `YYYY-MM-DD HH:mm:ss` | `2021-03-04 05:30:00` | A point in time. |
| Date | `YYYY-MM-DD` | `2021-03-04` | The date part of a value; a calendar day. |
| Time | `HH:mm:ss` | `05:30:00` | The time-of-day part of a value. |

The datetime format is close to ISO 8601, but not identical:

```text
2021-03-04 05:30:00     ← Tape
2021-03-04T05:30:00Z    ← the equivalent in standardized ISO 8601
```

A space replaces the `T` separator. There's *no `Z` suffix, no numeric offset, and no fractional seconds*, so the property name, not the string, tells you the zone.

> Do responses include seconds?
> 
> Datetime properties in responses include `:ss`, also when it's `00`: `2021-03-04 05:30:00`, never `2021-03-04 05:30`. Seconds are optional in *request* bodies, but don't expect the shorter form back.
> 
> The exception is the pre-formatted `value` / `value_string` of a [calculation field value](https://developers.tapeapp.com/docs/api/resource/field-value/calculation). It's a display string *without* seconds (`YYYY-MM-DD HH:mm`, or `YYYY-MM-DD` for a whole day).

## Local and UTC are returned side by side

The API returns *every* temporal property twice, with the same rule everywhere:

-   The *unsuffixed* property (`start`, `created_on`, `due_at`, `logged_at`) is the value in the *acting user's timezone*. Use it for display.
-   The `_utc` property (`start_utc`, `created_on_utc`, `due_at_utc`, `logged_at_utc`) is the same instant in *UTC*. Use it to compare, sort, store and calculate.

Only [two places](#the-two-exceptions) break this rule.

Field values give each half at three levels of detail: the full datetime, the date part and the time part. A date field value carries six properties per date:

| Property | Timezone | Format | Example |
| --- | --- | --- | --- |
| `start` | acting user | `YYYY-MM-DD HH:mm:ss` | `2021-03-03 22:30:00` |
| `start_date` | acting user | `YYYY-MM-DD` | `2021-03-03` |
| `start_time` | acting user | `HH:mm:ss` | `22:30:00` |
| `start_utc` | UTC | `YYYY-MM-DD HH:mm:ss` | `2021-03-04 05:30:00` |
| `start_date_utc` | UTC | `YYYY-MM-DD` | `2021-03-04` |
| `start_time_utc` | UTC | `HH:mm:ss` | `05:30:00` |

A `range_date` field value repeats all six with an `end` prefix: `end`, `end_date`, `end_time`, `end_utc`, `end_date_utc`, `end_time_utc`. Single-instant properties elsewhere in the API come as a pair: `created_on` / `created_on_utc`, `completed_at` / `completed_at_utc`, and so on.

> The two halves can disagree on the calendar day
> 
> The example above is one instant, `2021-03-04 05:30:00` UTC, read by a user in `America/Phoenix` (UTC-7). The local half falls on *March 3rd*, the UTC half on *March 4th*. Grouping by `start_date` and by `start_date_utc` gives different groups.

> Which values should an integration read?
> 
> Read `_utc` and convert to your own display timezone. The unsuffixed values depend on whose credential is in use, so they're a poor fit for anything cached, compared or stored. Daylight saving shows why: the local half of a stored instant shifts by an hour twice a year, while its `_utc` half never moves.

### Where "local" comes from

The timezone comes from the *timezone setting of the user who owns the credential*. It's not part of the request:

-   There's *no header, query parameter or body property* that sets the timezone on `/v1/*` routes.
-   Two credentials of two users with different timezone settings return *different* unsuffixed values for the same record. The `_utc` values are identical.
-   For an [automation API key](https://developers.tapeapp.com/docs/api/authentication#automation-api-key), Tape uses the automation's timezone.

No endpoint reports the timezone. To find the offset your credential uses, *compare the two halves of any timestamp*, for example `created_on` and `created_on_utc` on any record.

### Example

One record, read with two credentials: one owned by a user set to `America/Phoenix`, one by a user set to `Europe/Amsterdam`.

*Phoenix (UTC-7)*

```json
{
  "record_id": 1,
  "created_on": "2021-03-03 22:30:00",
  "created_on_utc": "2021-03-04 05:30:00",
  "fields": [
    {
      "field_id": 2,
      "external_id": "event_date",
      "type": "date",
      "field_type": "single_date",
      "values": [
        {
          "start": "2021-03-03 22:30:00",
          "start_date": "2021-03-03",
          "start_time": "22:30:00",
          "start_utc": "2021-03-04 05:30:00",
          "start_date_utc": "2021-03-04",
          "start_time_utc": "05:30:00"
        }
      ]
    }
  ]
}
```

*Amsterdam (UTC+1)*

```json
{
  "record_id": 1,
  "created_on": "2021-03-04 06:30:00",
  "created_on_utc": "2021-03-04 05:30:00",
  "fields": [
    {
      "field_id": 2,
      "external_id": "event_date",
      "type": "date",
      "field_type": "single_date",
      "values": [
        {
          "start": "2021-03-04 06:30:00",
          "start_date": "2021-03-04",
          "start_time": "06:30:00",
          "start_utc": "2021-03-04 05:30:00",
          "start_date_utc": "2021-03-04",
          "start_time_utc": "05:30:00"
        }
      ]
    }
  ]
}
```

### The two exceptions

Two places don't return a local and a UTC value side by side. Both are deliberate.

| Where | Behavior |
| --- | --- |
| [Calculation field value](https://developers.tapeapp.com/docs/api/resource/field-value/calculation): `value`, `value_string` | Pre-formatted *display strings*, built from the local `start_date` / `start_time` and rendered without seconds. They have *no `_utc` sibling*. To compare or store a calculation date result, read `start_utc` from the same value object rather than parsing `value`. |
| [Automation usage report](https://developers.tapeapp.com/docs/api/resource/automation-usage-report): `from`, `to` | Edges of the reporting intervals that had activity in the bucket, not event timestamps and not the edges of the calendar bucket. The `_utc` siblings exist so the API is uniform, but *all four values are UTC*. |

### A note on `_on` versus `_at`

Property names use two suffixes for the same concept: `created_on` in some places, `created_at` in others. The split is historical, not meaningful.

-   **`_on`:** the earliest resources, such as records, comments, replies, revisions, files, organizations, and attachment and image previews.
-   **`_at`:** resources and values added later, such as automations and runs, checklist entries, calculation script config, and the authorship metadata on email, phone and link values.

Both use the same formats and meaning, and both have a `_utc` sibling.

## Calendar days

A date field value holds either a *point in time* or a *whole calendar day* without a time. The API has no `all_day` flag. Two signals mark a calendar day:

1.  **`start_time` and `start_time_utc` are `null`.**
2.  **The local and UTC halves are identical.** Tape doesn't convert a calendar day between timezones: March 4th is March 4th for every user, in every zone.

*A whole day — 2021-03-04*

```json
{
  "start": "2021-03-04 00:00:00",
  "start_date": "2021-03-04",
  "start_time": null,
  "start_utc": "2021-03-04 00:00:00",
  "start_date_utc": "2021-03-04",
  "start_time_utc": null
}
```

*A point in time — 2021-03-04 at midnight UTC, read in Amsterdam*

```json
{
  "start": "2021-03-04 01:00:00",
  "start_date": "2021-03-04",
  "start_time": "01:00:00",
  "start_utc": "2021-03-04 00:00:00",
  "start_date_utc": "2021-03-04",
  "start_time_utc": "00:00:00"
}
```

> `start` is a midnight timestamp even for a whole day
> 
> A calendar day still returns `start` and `start_utc` as a full `YYYY-MM-DD 00:00:00` datetime. From `start` alone, you can't tell a whole day from a real midnight timestamp, as the second example shows. Test `start_time === null`, or read the date-only `start_date`.

A `range_date` value of whole days follows the same rule on both ends: `start_time` and `end_time` are both `null`, and every local property equals its `_utc` twin. A range can't mix a whole-day start with a timed end. Both ends are the same kind.

Checklist entry due dates use the same convention on `due_at_time` / `due_at_time_utc`.

## Writing field values

Requests accept the same three formats:

| Input | Interpreted as |
| --- | --- |
| `"2021-03-04"` | A whole calendar day. |
| `"2021-03-04 05:30"` | A point in time. Seconds may be omitted. |
| `"2021-03-04 05:30:00"` | A point in time. |
| `"2021-03-04 - 2021-03-06"` | A range. Split on a hyphen surrounded by single spaces. |

> Field values you write are read as UTC, not as your timezone
> 
> By default, Tape stores a datetime you send as UTC. Send `"2021-03-04 05:30:00"` as a user in `Europe/Amsterdam`, and the record reads back as `06:30:00` in `start` and `05:30:00` in `start_utc`. [Date filters](#filtering-by-date), by contrast, are read in your timezone.

Convert to UTC before sending, or add the query parameter `apply_user_timezone_on_date_inputs=true` to the record [create](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) and [update](https://developers.tapeapp.com/docs/api/resource/record#update-a-record) endpoints (single and batch). Tape then reads a datetime without an offset in the calling user's timezone.

The parameter applies to date, date range and checklist due date values. `start_utc`, `end_utc` and `due_at_utc` properties, and values that state their own offset, aren't shifted.

The field's `time` setting also decides whether a written value becomes a calendar day or a timestamp. See [Date field](https://developers.tapeapp.com/docs/api/resource/field/date).

| `settings.time` | Effect on a written value |
| --- | --- |
| `disabled` | Stored as a calendar day. Tape discards any time component you send. |
| `enabled` | A bare `YYYY-MM-DD` is stored as a calendar day; anything with a time as a timestamp. |
| `required` | Stored as a timestamp. A bare `YYYY-MM-DD` becomes midnight UTC. |

Field values also accept an object form. A `_utc` property in it takes precedence over its unsuffixed counterpart, so you can write a value read from the API straight back unchanged. See [Date field value](https://developers.tapeapp.com/docs/api/resource/field-value/date) for the accepted object shapes.

## Filtering by date

Endpoints that accept a date window take each bound in *both* forms. [Search](https://developers.tapeapp.com/docs/api/resource/search) accepts all eight parameters below. The general [automation run](https://developers.tapeapp.com/docs/api/resource/automation-run) listing accepts the four `created_at_*` bounds only.

| Parameter | Read as |
| --- | --- |
| `created_at_from` | Your timezone |
| `created_at_from_utc` | UTC |
| `created_at_to` | Your timezone |
| `created_at_to_utc` | UTC |
| `last_modified_at_from` | Your timezone |
| `last_modified_at_from_utc` | UTC |
| `last_modified_at_to` | Your timezone |
| `last_modified_at_to_utc` | UTC |

### General behavior

-   All bounds use `YYYY-MM-DD HH:mm:ss` and are inclusive.
-   Each bound is independent. Send only a `_from` for "since", only a `_to` for "until", or both for a closed window.
-   A `_from` later than its matching `_to` returns `400`.
-   Tape reads the unsuffixed form in the same timezone it uses for `created_on`. A value taken from a result means the same instant when you send it back as a bound.
-   If you send both forms of the same bound, the `_utc` one wins.

> Polling for changes?
> 
> Use the `_utc` bounds: a wall-clock time carries no offset, so it's ambiguous when daylight saving ends and the same local hour occurs twice. Pass `last_modified_at_from_utc` with the `last_modified_on_utc` of your last result. The loop then never reads a window twice or skips one.

## Automations

Automations use the same paired local and UTC variables. Scripts run in UTC, so convert a local time before you write it. See [Date, time & timezones](https://developers.tapeapp.com/docs/automations/date-timezone).

## Next steps

[

Date field value

the accepted object shapes for dates.

](https://developers.tapeapp.com/docs/api/resource/field-value/date)[

Date field

the `time` setting of a date field.

](https://developers.tapeapp.com/docs/api/resource/field/date)[

Search

filter by creation and change dates.

](https://developers.tapeapp.com/docs/api/resource/search)[

Record

create and update records with dates.

](https://developers.tapeapp.com/docs/api/resource/record)[

Date, time & timezones

dates in automations.

](https://developers.tapeapp.com/docs/automations/date-timezone)
