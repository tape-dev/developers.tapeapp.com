# Text field value

> Use a text field value to read and write the text of a record.

Use a text field value to read and write the text of a record.

The value of a [text field](https://developers.tapeapp.com/docs/api/resource/field/text) is a `string`. For a `single_text` field, it's plain text. For a `multi_text` field, it's rich text (HTML), unless the field's `config.settings.format` sets another text format.

*Text field value object*

```json
{
  "field_id": 2,
  "external_id": "notes",
  "label": "Notes",
  "type": "text",
  "field_type": "multi_text",
  "values": [
    {
      "value": "<p>Registered <b>10</b> months ago.</p>",
      "unformatted_value": "Registered 10 months ago."
    }
  ]
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"text"` for both text field types. | `"text"` |
| `field_type` | `string` | `"single_text"` or `"multi_text"`. | `"multi_text"` |
| `values[].value` | `string` | The text. Plain text for `single_text`, rich text (HTML) for `multi_text`. | `"<p>Registered <b>10</b> months ago.</p>"` |
| `values[].unformatted_value` | `string` | `multi_text` only. The text without HTML tags. | `"Registered 10 months ago."` |

Each field in a record response also contains the field's `config`. The examples on this page leave it out.

## Record creation

Use the [create record endpoint](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) to set text values on a new record.

`POST https://api.tapeapp.com/v1/record/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "first_name": "Clara Weber",
      "notes": "<p>Registered <b>10</b> months ago.</p>"
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "first_name": "Clara Weber",
    "notes": "<p>Registered <b>10</b> months ago.</p>"
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Clara Weber",
  "fields": [
    {
      "field_id": 1,
      "external_id": "first_name",
      "label": "First Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Clara Weber" }]
    },
    {
      "field_id": 2,
      "external_id": "notes",
      "label": "Notes",
      "type": "text",
      "field_type": "multi_text",
      "values": [
        {
          "value": "<p>Registered <b>10</b> months ago.</p>",
          "unformatted_value": "Registered 10 months ago."
        }
      ]
    }
  ]
}
```

The example sets the "First Name" field (ID `1`, type `single_text`, slug `first_name`) and the "Notes" field (ID `2`, type `multi_text`, slug `notes`).

Use the field IDs and slugs of your app. A renamed field keeps its first slug, see the [Text field](https://developers.tapeapp.com/docs/api/resource/field/text#app-update) example.

**General behavior**

-   Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
-   Send the text as a string. Tape also accepts `{ "value": "..." }` or an array with one of these.
-   Tape removes spaces at the start and the end of the text.
-   A `single_text` value holds up to 500 characters, a `multi_text` value up to 150000 characters.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   A value that isn't text returns `400` with `validation` and the message `Invalid input for text field with ID …`.
-   Text above the length limit returns `400` with `validation`.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record) to read the text values of a record.

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
  "title": "Clara Weber",
  "fields": [
    {
      "field_id": 1,
      "external_id": "first_name",
      "label": "First Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Clara Weber" }]
    },
    {
      "field_id": 2,
      "external_id": "notes",
      "label": "Notes",
      "type": "text",
      "field_type": "multi_text",
      "values": [
        {
          "value": "<p>Registered <b>10</b> months ago.</p>",
          "unformatted_value": "Registered 10 months ago."
        }
      ]
    }
  ]
}
```

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](https://developers.tapeapp.com/docs/api/resource/record#update-a-record) to change the text values of a record.

`PUT https://api.tapeapp.com/v1/record/{record_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "first_name": "Andrea Lim",
      "notes": "<p>Has <b>not</b> registered yet.</p>"
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "first_name": "Andrea Lim",
    "notes": "<p>Has <b>not</b> registered yet.</p>"
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Andrea Lim",
  "fields": [
    {
      "field_id": 1,
      "external_id": "first_name",
      "label": "First Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Andrea Lim" }]
    },
    {
      "field_id": 2,
      "external_id": "notes",
      "label": "Notes",
      "type": "text",
      "field_type": "multi_text",
      "values": [
        {
          "value": "<p>Has <b>not</b> registered yet.</p>",
          "unformatted_value": "Has not registered yet."
        }
      ]
    }
  ]
}
```

The example changes the "First Name" field (slug `first_name`) and the "Notes" field (slug `notes`) of the record with ID `1`.

**General behavior**

-   The new text replaces the old text.
-   To clear the field, send `null` or an empty string `""`.
-   Tape doesn't stop you from clearing a required `single_text` field through the API. Send a value instead.
-   Clearing a required `multi_text` field returns `400`.
-   Fields that aren't in the request keep their values.

*Request: clear the field*

```json
{
  "fields": {
    "notes": null
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

Text field

create and change text fields.

](https://developers.tapeapp.com/docs/api/resource/field/text)[

Field value

how all field values work.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Record

create, read, update and delete records.

](https://developers.tapeapp.com/docs/api/resource/record)[

Filter

find records by their text values.

](https://developers.tapeapp.com/docs/api/resource/filter)
