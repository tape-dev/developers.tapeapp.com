# Date, time & timezones

> Read, format and set dates in automations, and avoid timezone surprises in your scripts.

Read, format and set dates in automations, and avoid timezone surprises in your scripts.

## Datetime format

Automations use the same date and time formats as the Tape API:

| Format | Shape | Example |
| --- | --- | --- |
| Datetime | `YYYY-MM-DD HH:mm:ss` | `2023-02-01 15:00:00` |
| Date | `YYYY-MM-DD` | `2023-02-01` |
| Time | `HH:mm:ss` | `15:00:00` |

These strings have no `Z` suffix and no offset. The variable name tells you the timezone: a name that ends in `_utc` holds UTC, the same name without `_utc` holds the same moment in the timezone of the automation.

## Variables

Each date field gives you several variables, named after the record name of the app, then `field` and the field name. Example: an app named `Tasks` with the record name `Task` has a date field named `Date`, with time and without an end date:

| Variable | Description | Example value |
| --- | --- | --- |
| `task_field_date_start_time` | Time in the timezone of the automation. | `15:00:00` |
| `task_field_date_start_time_utc` | Same time in UTC. | `14:00:00` |
| `task_field_date_start_date` | Date in the timezone of the automation. | `2023-02-01` |
| `task_field_date_start_date_utc` | Same date in UTC. Can be a different day than the local date near midnight. | `2023-02-01` |
| `task_field_date_formatted` | Date and time as one display string in the timezone of the automation, without seconds. Leaves out the time for a whole day. | `2023-02-01 15:00` |

> What about whole-day values?
> 
> If the date field holds a whole day and no time, both `_start_time` variables are `null`. The local date and the `_utc` date are the same, because Tape doesn't convert a calendar day between timezones. See [Calendar days](https://developers.tapeapp.com/docs/api/date-timezone#calendar-days).

Use the UTC values when you set or update field values, as [Timezones](#timezones) explains.

## Formatting dates

Use the built-in `date_fns` library to format dates. Call its `format` function:

```js
date_fns.format(new Date(task_field_date_start_date), 'y') // the year
```

Test your format strings in the [interactive date-fns playground](https://date-fns-interactive.netlify.app/).

## Timezones

Automations run in UTC, and Tape's built-in actions handle this for you. Example: an action that copies a date from one record to another keeps the date and time people see in Tape.

Take care when you set dates in code, for example in **Perform a calculation** or **Execute a script**. The script reads every date string as UTC.

Example: a user in Amsterdam (UTC+1 in winter) wants to set a date field to 15:00 local time:

```js
var_target_datetime = new Date('2023-02-01 15:00');
```

The script reads `2023-02-01 15:00` as 15:00 UTC. After the record update, the user sees 16:00 instead of 15:00.

Convert the local time to UTC first with `zonedTimeToUtc` from `date_fns_tz`, and pass the timezone of the user:

```js
var_target_datetime = date_fns_tz.zonedTimeToUtc(new Date('2023-02-01 15:00'), 'Europe/Amsterdam');
```

Now the record shows 1 February 2023, 15:00 in the user's timezone. To use the timezone of the automation instead, pass `current_workflow_timezone`.

An automation with this conversion looks like this:

![The automation editor with a Perform a calculation action that runs date_fns_tz.zonedTimeToUtc and an Update the current record action that sets the date](https://developers.tapeapp.com/assets/images/automations-date-timezone-flow-b475c289783cac2dfc706a9407402669.png)

## Next steps

-   [Date & timezone](https://developers.tapeapp.com/docs/api/date-timezone): formats, calendar days and UTC values.
-   [Libraries](https://developers.tapeapp.com/docs/automations/libraries): all libraries you can use in scripts, with versions.
-   [Automations](https://developers.tapeapp.com/docs/automations/introduction): execution variables like `current_workflow_timezone`.
-   [Code editor](https://help.tapeapp.com/en/articles/18448952-execute-script-action): autocompletion for `date_fns` and `date_fns_tz`.
-   In the Help Center: [Dates and time zones in automations](https://help.tapeapp.com/en/articles/18448996-dates-and-time-zones-in-automations)
