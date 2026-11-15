# Number field value

> Use a number field value to read and write the number of a record.

Use a number field value to read and write the number of a record.

The value of a [number field](https://developers.tapeapp.com/docs/api/resource/field/number) is a `number`, like `1`, `1.0` or `1.5`. A `number` field holds at most one value.

*Number field value object*

```json
{
  "field_id": 2,
  "external_id": "closing_amount",
  "label": "Closing Amount",
  "type": "number",
  "field_type": "number",
  "values": [{ "value": 85000, "formatted": "85,000.00€" }]
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"number"`. | `"number"` |
| `field_type` | `string` | `"number"`. | `"number"` |
| `values[].value` | `number` | The number. | `85000` |
| `values[].formatted` | `string` | The number with the decimal places and the unit from the field settings. | `"85,000.00€"` |

Each field in a record response also contains the field's `config`. The examples on this page leave it out.

## Record creation

Use the [create record endpoint](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) to set number values on a new record.

`POST https://api.tapeapp.com/v1/record/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "deal_name": "Solar roof for Acme Inc.",
      "closing_amount": 85000
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "deal_name": "Solar roof for Acme Inc.",
    "closing_amount": 85000
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Solar roof for Acme Inc.",
  "fields": [
    {
      "field_id": 1,
      "external_id": "deal_name",
      "label": "Deal Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Solar roof for Acme Inc." }]
    },
    {
      "field_id": 2,
      "external_id": "closing_amount",
      "label": "Closing Amount",
      "type": "number",
      "field_type": "number",
      "values": [{ "value": 85000, "formatted": "85,000.00€" }]
    }
  ]
}
```

The example creates a deal with the "Deal Name" field (ID `1`, type `single_text`, slug `deal_name`) and the "Closing Amount" field (ID `2`, type `number`, slug `closing_amount`). The "Closing Amount" field has two decimal places and the unit "€" after the value.

**General behavior**

-   Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
-   Send the number as a number or as a string, for example `85000` or `"85000.50"`. Tape also accepts `{ "value": 85000 }` or an array with one of these.
-   Tape removes spaces at the start and the end of a string.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   A value that isn't a number returns `400` with `validation` and the message `Invalid input for number field with ID …`.
-   A number outside the allowed range returns `400` with `validation`.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record) to read the number values of a record.

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
  "title": "Solar roof for Acme Inc.",
  "fields": [
    {
      "field_id": 1,
      "external_id": "deal_name",
      "label": "Deal Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Solar roof for Acme Inc." }]
    },
    {
      "field_id": 2,
      "external_id": "closing_amount",
      "label": "Closing Amount",
      "type": "number",
      "field_type": "number",
      "values": [{ "value": 85000, "formatted": "85,000.00€" }]
    }
  ]
}
```

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](https://developers.tapeapp.com/docs/api/resource/record#update-a-record) to change the number values of a record.

`PUT https://api.tapeapp.com/v1/record/{record_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "closing_amount": 92500.5
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "closing_amount": 92500.5
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Solar roof for Acme Inc.",
  "fields": [
    {
      "field_id": 1,
      "external_id": "deal_name",
      "label": "Deal Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Solar roof for Acme Inc." }]
    },
    {
      "field_id": 2,
      "external_id": "closing_amount",
      "label": "Closing Amount",
      "type": "number",
      "field_type": "number",
      "values": [{ "value": 92500.5, "formatted": "92,500.50€" }]
    }
  ]
}
```

The example changes the "Closing Amount" field (slug `closing_amount`) of the record with ID `1`.

**General behavior**

-   The new number replaces the old number.
-   To clear the field, send `null` or an empty string `""`.
-   Tape doesn't stop you from clearing a required number field through the API. Send a value instead.
-   Fields that aren't in the request keep their values.

*Request: clear the field*

```json
{
  "fields": {
    "closing_amount": null
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

Number field

create and change number fields.

](https://developers.tapeapp.com/docs/api/resource/field/number)[

Field value

how all field values work.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Record

create, read, update and delete records.

](https://developers.tapeapp.com/docs/api/resource/record)[

Filter

find records by their number values.

](https://developers.tapeapp.com/docs/api/resource/filter#number)
