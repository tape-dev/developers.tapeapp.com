---
id: date-timezone
title: Date, Time & Timezone
sidebar_label: Date, Time & Timezones
---

import DateTimezoneFlowPng from '@site/static/docs/automations/date-timezone/automations-date-timezone-flow.png';

# Date, Time & Timezones

## Datetime format

Tape automations use the same date and time format used when working with [date & time using the Tape API](/docs/api/date-timezone):

```
2022-02-01 15:00
```

which would be equal to the following in standardized ISO 8601:

```
2022-02-01T15:00Z
```

## Variables

When working with Tape date fields inside automations, multiple variables will be available to work with.

A date field named `Date` in Tape, with time and without an end date, produces these available record field value variables (where the app is called `Tasks`):

- `current_task_date_start_time`
  - Contains the date field value's time in the user's timezone
  - Example value: `15:00`
- `current_task_date_start_time_utc` - `14:00`
  - Contains the date field value's time in UTC
  - Example value: `14:00`
- `current_task_date_start_date`
  - Contains the date field value's date in the user's timezone
  - Example value: `2023-02-01`
- `current_task_date_start_date_utc`
  - Contains the date field value's date in UTC
  - Example value: `2023-02-01`
- `current_task_date_start_date_formatted`
  - Contains the date field value's date and time as formatted string in the user's timezone
  - Example value: `2023-02-01 15:00`

Users are free to compose those above variable to yield different results, based on requirements. Be sure to use the UTC values when setting / updating field values, and also check below information on timezone handling

## Timezones

Tape workflows run in UTC to be universally applicable and non-opinionated. When using the built in Tape actions, all date and time data will thereby yield the expected results, e.g. when a record is updated and set to another record's date field value, that value will match the date and time the user sees when opening the record in Tape.

Be careful when setting dates using code, e.g. via the "Perform Calculation" or "Execute script" workflow actions. Without futher steps, unexpected results may be encountered.

See this example below, where a user in Central European Time (UTC+1) utilized Tape workflows to set a record date field's date and time:

```
var_target_datetime = new Date('2023-02-01 15:00');
```

When updating the record and setting the date / time to the variable's value, the record's field value will actually be updated to this value:

```
2023-02-01 14:00
```

This happens due to the fact that the execution environment of the worklow runs in UTC, and will interpret inputs in UTC respectively. While there are many solutions to this, the simplest is for you to transform the data first using the date-fns-timezone library's `zonedTimeToUtc` function and the respective timezone identifier:

```
var_target_datetime = date_fns_tz.zonedTimeToUtc(new Date('2023-02-01 15:00'), 'Europe/Amsterdam');
```

Now, the record will be updated to Feb 1st, 2023 15:00 in the user's timezone as expected and this change will be reflected properly when opening the record in Tape.

A resulting example flow may look like to this one:

<MediaFrame><img src={DateTimezoneFlowPng} /></MediaFrame>
