# Date field value

> Use a date field value to read and write the dates and date ranges of a record.

Use a date field value to read and write the dates and date ranges of a record.

The value of a [date field](https://developers.tapeapp.com/docs/api/resource/field/date) is one object in `values`. It holds the start date in six properties: three in the timezone of the user who makes the request, three in UTC. A `range_date` value can add the same six properties for the end date.

For the formats and the timezone rules, see [Date & timezone](https://developers.tapeapp.com/docs/api/date-timezone).

*Date field value object*

```json
{
  "field_id": 1,
  "external_id": "site_visit",
  "label": "Site Visit",
  "type": "date",
  "field_type": "single_date",
  "values": [
    {
      "start": "2026-03-10 09:30:00",
      "start_date": "2026-03-10",
      "start_time": "09:30:00",
      "start_utc": "2026-03-10 08:30:00",
      "start_date_utc": "2026-03-10",
      "start_time_utc": "08:30:00"
    }
  ]
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"date"` for both date field types. | `"date"` |
| `field_type` | `string` | `"single_date"` or `"range_date"`. | `"single_date"` |
| `values[].start` | `string` | Start as `YYYY-MM-DD HH:mm:ss` in your timezone. | `"2026-03-10 09:30:00"` |
| `values[].start_date` | `string` | Date part of `start`. | `"2026-03-10"` |
| `values[].start_time` | `string` or `null` | Time part of `start`. `null` for a whole calendar day. | `"09:30:00"` |
| `values[].start_utc` | `string` | Start in UTC. | `"2026-03-10 08:30:00"` |
| `values[].start_date_utc` | `string` | Date part of `start_utc`. | `"2026-03-10"` |
| `values[].start_time_utc` | `string` or `null` | Time part of `start_utc`. `null` for a whole calendar day. | `"08:30:00"` |
| `values[].end`, `end_date`, `end_time`, `end_utc`, `end_date_utc`, `end_time_utc` | `string` or `null` | `range_date` only, if the value has an end date. Same format as the start properties. | `"2026-04-17 00:00:00"` |

A whole calendar day has `start_time: null`, and its local and UTC properties are equal. Tape doesn't convert a calendar day between timezones. See [Calendar days](https://developers.tapeapp.com/docs/api/date-timezone#calendar-days).

Each field in a record response also contains the field's `config`. The examples on this page leave it out.

## Record creation

Use the [create record endpoint](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) to set dates on a new record.

`POST https://api.tapeapp.com/v1/record/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "site_visit": "2026-03-10 08:30",
      "installation_window": "2026-03-23 - 2026-03-27"
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "site_visit": "2026-03-10 08:30",
    "installation_window": "2026-03-23 - 2026-03-27"
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Tuesday, 10. March 2026",
  "fields": [
    {
      "field_id": 1,
      "external_id": "site_visit",
      "label": "Site Visit",
      "type": "date",
      "field_type": "single_date",
      "values": [
        {
          "start": "2026-03-10 09:30:00",
          "start_date": "2026-03-10",
          "start_time": "09:30:00",
          "start_utc": "2026-03-10 08:30:00",
          "start_date_utc": "2026-03-10",
          "start_time_utc": "08:30:00"
        }
      ]
    },
    {
      "field_id": 2,
      "external_id": "installation_window",
      "label": "Installation Window",
      "type": "date",
      "field_type": "range_date",
      "values": [
        {
          "start": "2026-03-23 00:00:00",
          "start_date": "2026-03-23",
          "start_time": null,
          "start_utc": "2026-03-23 00:00:00",
          "start_date_utc": "2026-03-23",
          "start_time_utc": null,
          "end": "2026-03-27 00:00:00",
          "end_date": "2026-03-27",
          "end_time": null,
          "end_utc": "2026-03-27 00:00:00",
          "end_date_utc": "2026-03-27",
          "end_time_utc": null
        }
      ]
    }
  ]
}
```

The example creates an installation with two fields. "Site Visit" (ID `1`, type `single_date`, slug `site_visit`) has time enabled. "Installation Window" (ID `2`, type `range_date`, slug `installation_window`) has time disabled.

The responses on this page belong to a user in the `Europe/Berlin` timezone (UTC+1 until daylight saving time starts on March 29, 2026).

**General behavior**

-   Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
-   Send `YYYY-MM-DD` for a whole calendar day and `YYYY-MM-DD HH:mm` or `YYYY-MM-DD HH:mm:ss` for a point in time.
-   For a `range_date` value, send `"<start> - <end>"` or an object with `start` and `end`. Tape also reads `start_date` and `end_date`, `start_utc` and `end_utc`, and an array with one value.
-   For a `single_date` value, don't send only `start_date` and `start_time`. Tape then saves no value and returns no error. Use `start` or `start_utc` for a date with time.
-   Tape reads a point in time without an offset as UTC. Here, `08:30` UTC reads back as `09:30` in Berlin.
-   To send a time in another timezone, add its offset, like `2026-03-10 09:30:00+01:00`.
-   To send your local time without an offset, add the query parameter `apply_user_timezone_on_date_inputs=true`. Tape never shifts `start_utc`, `end_utc` or a value with its own offset.
-   The `time` setting of the field decides what Tape stores. With `"disabled"`, Tape keeps only the date. With `"required"`, a bare date becomes midnight UTC. With `"enabled"`, Tape stores what you send.
-   You can write a value from a record response back unchanged. Its `_utc` properties take precedence.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   A value without an end date returns `400` if the `range_date` field has `"end": "required"`.
-   A start after the end returns `400`.
-   An end date without a start date returns `400`.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record) to read the dates of a record.

`GET https://api.tapeapp.com/v1/record/{record_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "record_id": 1,
  "title": "Tuesday, 10. March 2026",
  "fields": [
    {
      "field_id": 1,
      "external_id": "site_visit",
      "label": "Site Visit",
      "type": "date",
      "field_type": "single_date",
      "values": [
        {
          "start": "2026-03-10 09:30:00",
          "start_date": "2026-03-10",
          "start_time": "09:30:00",
          "start_utc": "2026-03-10 08:30:00",
          "start_date_utc": "2026-03-10",
          "start_time_utc": "08:30:00"
        }
      ]
    },
    {
      "field_id": 2,
      "external_id": "installation_window",
      "label": "Installation Window",
      "type": "date",
      "field_type": "range_date",
      "values": [
        {
          "start": "2026-03-23 00:00:00",
          "start_date": "2026-03-23",
          "start_time": null,
          "start_utc": "2026-03-23 00:00:00",
          "start_date_utc": "2026-03-23",
          "start_time_utc": null,
          "end": "2026-03-27 00:00:00",
          "end_date": "2026-03-27",
          "end_time": null,
          "end_utc": "2026-03-27 00:00:00",
          "end_date_utc": "2026-03-27",
          "end_time_utc": null
        }
      ]
    }
  ]
}
```

**General behavior**

-   Tape returns the unsuffixed properties in the timezone setting of the user who owns the token. The `_utc` properties are the same for every user.

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](https://developers.tapeapp.com/docs/api/resource/record#update-a-record) to change the dates of a record.

`PUT https://api.tapeapp.com/v1/record/{record_id}`

**cURL**

*Request*

```shell
curl -X PUT "https://api.tapeapp.com/v1/record/1?apply_user_timezone_on_date_inputs=true" \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "site_visit": "2026-03-12 14:00",
      "installation_window": { "start": "2026-03-30", "end": "2026-04-03" }
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "site_visit": "2026-03-12 14:00",
    "installation_window": { "start": "2026-03-30", "end": "2026-04-03" }
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Thursday, 12. March 2026",
  "fields": [
    {
      "field_id": 1,
      "external_id": "site_visit",
      "label": "Site Visit",
      "type": "date",
      "field_type": "single_date",
      "values": [
        {
          "start": "2026-03-12 14:00:00",
          "start_date": "2026-03-12",
          "start_time": "14:00:00",
          "start_utc": "2026-03-12 13:00:00",
          "start_date_utc": "2026-03-12",
          "start_time_utc": "13:00:00"
        }
      ]
    },
    {
      "field_id": 2,
      "external_id": "installation_window",
      "label": "Installation Window",
      "type": "date",
      "field_type": "range_date",
      "values": [
        {
          "start": "2026-03-30 00:00:00",
          "start_date": "2026-03-30",
          "start_time": null,
          "start_utc": "2026-03-30 00:00:00",
          "start_date_utc": "2026-03-30",
          "start_time_utc": null,
          "end": "2026-04-03 00:00:00",
          "end_date": "2026-04-03",
          "end_time": null,
          "end_utc": "2026-04-03 00:00:00",
          "end_date_utc": "2026-04-03",
          "end_time_utc": null
        }
      ]
    }
  ]
}
```

The example moves the site visit of the record with ID `1` to 14:00 Berlin time and the installation to the following week. It adds `apply_user_timezone_on_date_inputs=true`, so Tape reads `14:00` in the user's timezone. The range uses the object form.

**General behavior**

-   The new date replaces the old date.
-   To clear the field, send `null`.
-   You can't clear a required field. The request returns `400`.
-   Fields that aren't in the request keep their values.

*Request: clear the field*

```json
{
  "fields": {
    "installation_window": null
  }
}
```

A cleared field isn't in the `fields` of the response.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

Same errors as under [Record creation](#record-creation).

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Next steps

[

Date field

create date fields and set their time and end date settings.

](https://developers.tapeapp.com/docs/api/resource/field/date)[

Date & timezone

all accepted input formats and the timezone rules.

](https://developers.tapeapp.com/docs/api/date-timezone#writing-field-values)[

Field value

how all field values work.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Record

create, read, update and delete records, with all query parameters.

](https://developers.tapeapp.com/docs/api/resource/record)[

Filter

find records by their dates.

](https://developers.tapeapp.com/docs/api/resource/filter#single-date)
