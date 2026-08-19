---
id: date-timezone
title: Date & Timezone
sidebar_label: Date & Timezone
---

# Date & Timezone

Every temporal value in the Tape API is a **string** — never an epoch number, never an object. This page
describes the three string formats the API uses, how each value is returned twice (once in your timezone and
once in UTC), how a whole calendar day is distinguished from a point in time, and what the API accepts when
you send a date.

## Formats

| Format     | Shape                 | Example               | Used for                                     |
| :--------- | :-------------------- | :-------------------- | :------------------------------------------- |
| Datetime   | `YYYY-MM-DD HH:mm:ss` | `2021-03-04 05:30:00` | A point in time.                             |
| Date       | `YYYY-MM-DD`          | `2021-03-04`          | The date part of a value; a calendar day.    |
| Time       | `HH:mm:ss`            | `05:30:00`            | The time-of-day part of a value.             |

The datetime format is deliberately close to ISO 8601, but not identical:

```
2021-03-04 05:30:00     ← Tape
2021-03-04T05:30:00Z    ← the equivalent in standardized ISO 8601
```

A space replaces the `T` separator, and there is **no `Z` suffix, no numeric offset, and no fractional
seconds**. The format was chosen for readability and is parsed by most languages and libraries out of the
box. Because a returned datetime carries no offset, the string alone does not tell you which zone it is
in — the property name does.

:::info Seconds are present in responses, with one exception
Datetime properties always emit `:ss`, even when it is `00` — `2021-03-04 05:30:00`, never
`2021-03-04 05:30`. Seconds are optional in **request** bodies, but do not rely on the shorter form coming
back. The one exception is the pre-formatted `value` / `value_string` of a
[calculation field value](/docs/api/resource/field-value/calculation), which is a display string rendered
**without** seconds (`YYYY-MM-DD HH:mm`, or bare `YYYY-MM-DD` for a whole day).
:::

## Local and UTC are returned side by side

**Every** temporal property in the API is returned twice, and the rule is the same everywhere:

- The **unsuffixed** property (`start`, `created_on`, `due_at`, `logged_at`) is the value in the **acting
  user's timezone**. Use it for display.
- The **`_utc`** property (`start_utc`, `created_on_utc`, `due_at_utc`, `logged_at_utc`) is the same instant
  in **UTC**. Use it for comparison, sorting, storage, and arithmetic.

There is no resource where you have to look up which convention applies. If a property holds a date or a
datetime, a `_utc` sibling exists next to it, and the unsuffixed half is local.

Field values expose each half at three granularities — the full datetime, the date part, and the time part —
so a date field value carries six properties per date:

| Property         | Timezone        | Format                | Example               |
| :--------------- | :-------------- | :-------------------- | :-------------------- |
| `start`          | acting user     | `YYYY-MM-DD HH:mm:ss` | `2021-03-03 22:30:00` |
| `start_date`     | acting user     | `YYYY-MM-DD`          | `2021-03-03`          |
| `start_time`     | acting user     | `HH:mm:ss`            | `22:30:00`            |
| `start_utc`      | UTC             | `YYYY-MM-DD HH:mm:ss` | `2021-03-04 05:30:00` |
| `start_date_utc` | UTC             | `YYYY-MM-DD`          | `2021-03-04`          |
| `start_time_utc` | UTC             | `HH:mm:ss`            | `05:30:00`            |

A `range_date` field value repeats all six with an `end` prefix: `end`, `end_date`, `end_time`, `end_utc`,
`end_date_utc`, `end_time_utc`. Single-instant properties elsewhere in the API come as a simple pair —
`created_on` / `created_on_utc`, `completed_at` / `completed_at_utc`, and so on.

:::warning The two halves can disagree on the calendar day
The example above is one instant — `2021-03-04 05:30:00` UTC — read by a user in `America/Phoenix` (UTC-7).
The local half falls on **March 3rd**, the UTC half on **March 4th**. Grouping records by `start_date` and
grouping them by `start_date_utc` will not produce the same buckets. Pick one deliberately.
:::

:::tip Default to the `_utc` values
If you are building an integration, read `_utc` and convert to your own display timezone yourself. The
unsuffixed values are a display convenience whose meaning depends on whose API key is in use, which makes
them a poor fit for anything cached, compared, or persisted. Daylight saving makes this concrete: the local
half of a stored instant shifts by an hour twice a year while its `_utc` half never moves, so two local
values recorded either side of a transition are not directly comparable.
:::

### Where "local" comes from

The timezone is taken from the **timezone setting of the user who owns the credential** used for the request.
It is not a property of the request:

- There is **no timezone header, query parameter, or body property** on `/v1/*` routes.
- Two API keys belonging to two users with different timezone settings will return **different** unsuffixed
  values for the very same record. The `_utc` values will be identical.
- For a credential owned by an automation rather than a user, the automation's timezone is used instead.

Because there is no endpoint that reports the timezone, the reliable way to discover the offset your
credential renders in is to **compare the two halves of any timestamp** — for example `created_on` against
`created_on_utc` on any record.

### Example

A single record read with two API keys — one owned by a user set to `America/Phoenix`, one to
`Europe/Amsterdam`:

```json title="⬅️      Phoenix (UTC-7)"
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

```json title="⬅️      Amsterdam (UTC+1)"
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

Two places do not follow the rule above. Both are deliberate.

| Where | Behaviour |
| :---- | :--------- |
| [Calculation field value](/docs/api/resource/field-value/calculation) — `value`, `value_string` | Pre-formatted **display strings**, built from the local `start_date` / `start_time` and rendered without seconds. They have **no `_utc` sibling**. To compare or store a calculation date result, read `start_utc` from the same value object rather than parsing `value`. |
| [Automation usage report](/docs/api/resource/automation-usage-report) — `from`, `to` | Reporting-window boundaries that define UTC buckets, not event timestamps. The `_utc` siblings exist so the API is uniform, but **all four values are UTC** — localizing a bucket edge would misstate which bucket a run fell into. |

### A note on `_on` versus `_at`

Property names use two different suffixes for the same concept — `created_on` in some places, `created_at` in
others. The split is historical, not semantic: the API's earliest resources (records, comments, replies,
revisions, files, organizations, attachment and image previews) use `_on`, while resources and values added
later (automations and runs, checklist entries, calculation script config, and the authorship metadata on
email, phone and link values) use `_at`. Both carry identical formats and semantics, and both are paired with
a `_utc` sibling in the same way.

## Calendar days

A date field value can hold either a **point in time** or a **whole calendar day** with no time component.
There is no `all_day` flag in the API. A calendar day is expressed by two signals:

1. **`start_time` and `start_time_utc` are `null`.**
2. **The local and UTC halves are byte-identical.** A calendar day is deliberately not converted between
   timezones — March 4th is March 4th for every user, in every zone.

```json title="A whole day — 2021-03-04"
{
  "start": "2021-03-04 00:00:00",
  "start_date": "2021-03-04",
  "start_time": null,
  "start_utc": "2021-03-04 00:00:00",
  "start_date_utc": "2021-03-04",
  "start_time_utc": null
}
```

```json title="A point in time — 2021-03-04 at midnight UTC, read in Amsterdam"
{
  "start": "2021-03-04 01:00:00",
  "start_date": "2021-03-04",
  "start_time": "01:00:00",
  "start_utc": "2021-03-04 00:00:00",
  "start_date_utc": "2021-03-04",
  "start_time_utc": "00:00:00"
}
```

:::warning `start` is a midnight timestamp even for a whole day
A calendar day still serializes `start` and `start_utc` as a full `YYYY-MM-DD 00:00:00` datetime. Reading
only `start` cannot tell a whole day apart from a real midnight timestamp — the second example above proves
it. **Test `start_time === null`**, or read the date-only `start_date`.
:::

A `range_date` value spanning whole days follows the same rule on both ends: `start_time` and `end_time` are
both `null`, and every local property equals its `_utc` twin. A range cannot mix a whole-day start with a
timed end — both ends are always the same kind.

Checklist entry due dates use the identical convention on `due_at_time` / `due_at_time_utc`.

## Writing field values

Requests accept the same three formats:

| Input                             | Interpreted as                                              |
| :-------------------------------- | :----------------------------------------------------------- |
| `"2021-03-04"`                    | A whole calendar day.                                        |
| `"2021-03-04 05:30"`              | A point in time. Seconds may be omitted.                     |
| `"2021-03-04 05:30:00"`           | A point in time.                                             |
| `"2021-03-04 - 2021-03-06"`       | A range. Split on a hyphen surrounded by single spaces.      |

:::warning Field values you write are read as UTC, not as your timezone
Unlike responses, the field-value write path applies **no timezone conversion**. A datetime you send is
stored as UTC. Sending `"2021-03-04 05:30:00"` as a user in `Europe/Amsterdam` stores `05:30` UTC, and the
record will read back as `06:30:00` in `start` and `05:30:00` in `start_utc` — not `05:30` local. Convert to
UTC before sending.

This differs from the [date filters](#filtering-by-date) below, which *are* read in your timezone. When
writing a field value, always send UTC.
:::

To write a **whole calendar day**, send exactly `YYYY-MM-DD` with no time component. Anything carrying a time
is stored as a point in time.

Whether a written value ends up a calendar day or a timestamp also depends on the field's `time` setting (see
[Date Field](/docs/api/resource/field/date)):

| `settings.time` | Effect on a written value                                                            |
| :-------------- | :------------------------------------------------------------------------------------ |
| `disabled`      | Always stored as a calendar day. Any time component you send is discarded.            |
| `enabled`       | A bare `YYYY-MM-DD` is stored as a calendar day; anything with a time as a timestamp. |
| `required`      | Always stored as a timestamp. A bare `YYYY-MM-DD` becomes midnight UTC.               |

Field values also accept an object form, where a `_utc` property takes precedence over its unsuffixed
counterpart — so a value read from the API can be written straight back unchanged. See
[Date Field Value](/docs/api/resource/field-value/date) for the accepted object shapes.

## Filtering by date

Endpoints that accept a date window take each bound in **both** flavours. [Search](/docs/api/resource/search)
accepts all eight parameters below; the [automation run](/docs/api/resource/automation-run) listings accept
the four `created_at_*` bounds only:

| Parameter                | Read as             |
| :----------------------- | :------------------- |
| `created_at_from`        | Your timezone        |
| `created_at_from_utc`    | UTC                  |
| `created_at_to`          | Your timezone        |
| `created_at_to_utc`      | UTC                  |
| `last_modified_at_from`  | Your timezone        |
| `last_modified_at_from_utc` | UTC               |
| `last_modified_at_to`    | Your timezone        |
| `last_modified_at_to_utc` | UTC                 |

All bounds use `YYYY-MM-DD HH:mm:ss` and are inclusive. Each is independent: send only a `_from` for "since",
only a `_to` for "until", or both for a closed window. A `_from` later than its matching `_to` is a `400`.

The unsuffixed form is read in the same timezone `created_on` is rendered in, so a value taken straight from
a result can be handed back as a bound and means the same instant. **If both spellings of the same bound are
sent, the `_utc` one wins.**

:::tip Use the `_utc` bounds when polling
A wall-clock time carries no offset, so it is ambiguous across a daylight-saving fall-back — the same local
hour occurs twice. For a sync loop that repeatedly asks "what changed since my last run", pass
`last_modified_at_from_utc` paired with the `last_modified_on_utc` your last result reported. That is what
keeps the loop from re-reading or skipping a window twice a year.
:::

## Automations

Automations expose the same paired local / UTC variables and run in UTC. See
[Date, Time & Timezones](/docs/automations/date-timezone) for automation-specific guidance.
