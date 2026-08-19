---
id: date-timezone
title: Date, Time & Timezone
sidebar_label: Date, Time & Timezones
---

import DateTimezoneFlowPng from '@site/static/docs/automations/date-timezone/automations-date-timezone-flow.png';

# Date, Time & Timezones

## Datetime format

Tape automations use the same date and time formats as the
[Tape API](/docs/api/date-timezone):

| Format   | Shape                 | Example               |
| :------- | :-------------------- | :-------------------- |
| Datetime | `YYYY-MM-DD HH:mm:ss` | `2023-02-01 15:00:00` |
| Date     | `YYYY-MM-DD`          | `2023-02-01`          |
| Time     | `HH:mm:ss`            | `15:00:00`            |

These strings carry **no `Z` suffix and no numeric offset**, so the string alone does not tell you which
timezone a value is in — the variable name does. A variable ending in `_utc` holds UTC; the same variable
without that suffix holds the same instant in the user's timezone. See [Variables](#variables) below.

## Variables

When working with Tape date fields inside automations, multiple variables will be available to work with.

A date field named `Date` in Tape, with time and without an end date, produces these available record field value variables (where the app is called `Tasks`):

- `current_task_date_start_time`
  - The date field value's time in the user's timezone
  - Example value: `15:00:00`
- `current_task_date_start_time_utc`
  - The same time in UTC
  - Example value: `14:00:00`
- `current_task_date_start_date`
  - The date field value's date in the user's timezone
  - Example value: `2023-02-01`
- `current_task_date_start_date_utc`
  - The same date in UTC. Note this can be a **different calendar day** than the local one, when the local
    time falls near midnight
  - Example value: `2023-02-01`
- `current_task_date_start_date_formatted`
  - The date and time as one display string in the user's timezone. This is the only one rendered
    **without seconds**, and it drops the time entirely for a whole-day value
  - Example value: `2023-02-01 15:00`

:::info Whole-day values have no time
If the date field value is a whole calendar day rather than a point in time, both `_start_time` variables are
`null` and the local and `_utc` dates are identical — a calendar day is deliberately not converted between
timezones. See [Calendar days](/docs/api/date-timezone#calendar-days).
:::

Users are free to compose the variables above to yield different results, based on requirements. Be sure to use the UTC values when setting / updating field values, and also read the information on timezone handling below.

## Formatting dates

Tape exposes several ways of formatting dates; the preferred option is using the integrated `date_fns` library.

Use the `format` for your custom date variables:

```
date_fns.format(your_app_field_value, 'y') // yields the year
```

### Interactive playground

The most convenient way to test your date formatting is [the interactive date_fns playground](https://date-fns-interactive.netlify.app/).

## Timezones

Tape automations run in UTC to be universally applicable and non-opinionated. When using the built-in Tape actions, all date and time data will thereby yield the expected results, e.g. when a record is updated and set to another record's date field value, that value will match the date and time the user sees when opening the record in Tape.

Be careful when setting dates using code, e.g. via the "Perform Calculation" or "Execute script" automation actions. Without further steps, unexpected results may be encountered.

See this example below, where a user in Central European Time (UTC+1) utilized Tape automations to set a record date field's date and time:

```
var_target_datetime = new Date('2023-02-01 15:00');
```

When updating the record and setting the date / time to the variable's value, the record's field value will actually be updated to this value:

```
2023-02-01 14:00
```

This happens due to the fact that the execution environment of the automation runs in UTC, and will interpret inputs in UTC respectively. While there are many solutions to this, the simplest is for you to transform the data first using the date-fns-timezone library's `zonedTimeToUtc` function and the respective timezone identifier:

```
var_target_datetime = date_fns_tz.zonedTimeToUtc(new Date('2023-02-01 15:00'), 'Europe/Amsterdam');
```

Now, the record will be updated to Feb 1st, 2023 15:00 in the user's timezone as expected and this change will be reflected properly when opening the record in Tape.

A resulting example flow may look like this one:

<MediaFrame><img src={DateTimezoneFlowPng} /></MediaFrame>
