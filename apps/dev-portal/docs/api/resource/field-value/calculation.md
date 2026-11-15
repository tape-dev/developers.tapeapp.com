---
id: calculation
title: Calculation field value
sidebar_label: Calculation
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use a calculation field value to read the computed value of a record.

Tape computes the value of a [calculation field](/docs/api/resource/field/calculation) from its script. The value is text, a number or a date, depending on the `return_type` of the field. Text can be plain text or rich text with Markdown or HTML.

```json title="Calculation field value object"
{
  "field_id": 4,
  "external_id": "vacation_days_left",
  "label": "Vacation Days Left",
  "type": "calculation",
  "field_type": "calculation",
  "values": [
    {
      "value": 12,
      "value_string": "12",
      "decimal": 12,
      "start": null,
      "start_utc": null,
      "start_date": null,
      "start_date_utc": null,
      "start_time": null,
      "start_time_utc": null
    }
  ]
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"calculation"`. | `"calculation"` |
| `field_type` | `string` | `"calculation"`. | `"calculation"` |
| `values[].value` | `string` or `number` | The computed value. A string for text, a number for numbers, the date as text for dates. | `12` |
| `values[].value_string` | `string` | The value as text. For numbers, with the decimal places and the unit of the field. | `"12"` |
| `values[].decimal` | `number` or `null` | Number results only. The number. `null` otherwise. | `12` |
| `values[].start` | `string` or `null` | Date results only. Date and time in your [timezone](/docs/api/date-timezone). `null` otherwise. | `"2026-12-01 09:00:00"` |
| `values[].start_date` | `string` or `null` | Date results only. The date in your timezone. `null` otherwise. | `"2026-12-01"` |
| `values[].start_time` | `string` or `null` | Date results only. The time in your timezone. `null` for a date without time and for other results. | `"09:00:00"` |
| `values[].start_utc`, `values[].start_date_utc`, `values[].start_time_utc` | `string` or `null` | Date results only. The same values in UTC. `null` otherwise. | `"2026-12-01 08:00:00"` |

Each field in a record response also contains the field's `config`. The examples on this page leave it out.

## Record retrieval

Use the [retrieve record endpoint](/docs/api/resource/record#retrieve-a-record) to read the calculation values of a record.

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

The example reads an employee record with three calculation fields: "Vacation Days Left" returns a number, "Next Review" a date and "Profile Link" HTML.

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

```json title='Response'
{
  "record_id": 1,
  "title": "Juliet Adams",
  "fields": [
    {
      "field_id": 4,
      "external_id": "vacation_days_left",
      "label": "Vacation Days Left",
      "type": "calculation",
      "field_type": "calculation",
      "values": [
        {
          "value": 12,
          "value_string": "12",
          "decimal": 12,
          "start": null,
          "start_utc": null,
          "start_date": null,
          "start_date_utc": null,
          "start_time": null,
          "start_time_utc": null
        }
      ]
    },
    {
      "field_id": 5,
      "external_id": "next_review",
      "label": "Next Review",
      "type": "calculation",
      "field_type": "calculation",
      "values": [
        {
          "value": "2026-12-01 09:00",
          "value_string": "2026-12-01 09:00",
          "decimal": null,
          "start": "2026-12-01 09:00:00",
          "start_utc": "2026-12-01 08:00:00",
          "start_date": "2026-12-01",
          "start_date_utc": "2026-12-01",
          "start_time": "09:00:00",
          "start_time_utc": "08:00:00"
        }
      ]
    },
    {
      "field_id": 6,
      "external_id": "profile_link",
      "label": "Profile Link",
      "type": "calculation",
      "field_type": "calculation",
      "values": [
        {
          "value": "<a href='https://acme.com/team/juliet' target='_blank'>Team profile</a>",
          "value_string": "<a href='https://acme.com/team/juliet' target='_blank'>Team profile</a>",
          "decimal": null,
          "start": null,
          "start_utc": null,
          "start_date": null,
          "start_date_utc": null,
          "start_time": null,
          "start_time_utc": null
        }
      ]
    }
  ]
}
```

**General behavior**

- Tape computes calculation values. It ignores them in create and update requests and returns no error. See [Read-only field values](/docs/api/resource/field-value/overview#field-type).
- A calculation that never had a result isn't in `fields`. One whose result became empty, for example after you clear a value it uses, stays in `fields` with an empty `values` array.
- A number result of 0 also comes back with an empty `values` array.
- Tape computes the result after the write. The response to a create or update can still show the previous result, so read the record again for the new one.
- For a date result, `value` holds the date and the time without seconds.

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

Reading calculation values has no field-specific errors. See [Errors](/docs/api/errors) for all error codes.

## Next steps

- [Calculation field](/docs/api/resource/field/calculation): create calculation fields and write their scripts.
- [Date & timezone](/docs/api/date-timezone): how Tape returns dates and times.
- [Field value](/docs/api/resource/field-value/overview): how all field values work.
- [Record](/docs/api/resource/record): create, read, update and delete records.
