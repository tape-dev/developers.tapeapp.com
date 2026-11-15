# Status field value

> Use a status field value to read and set the status of a record.

Use a status field value to read and set the status of a record.

The value of a [status field](https://developers.tapeapp.com/docs/api/resource/field/status) is one option with its `id`, `text`, `color` and `means_completed`. `means_completed` tells you whether the record is done.

*Status field value object*

```json
{
  "field_id": 1,
  "external_id": "status",
  "label": "Status",
  "type": "category",
  "field_type": "status",
  "values": [
    {
      "value": {
        "id": 1,
        "text": "Open",
        "color": "0077DE",
        "means_completed": false
      }
    }
  ]
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"category"`. A status field value has the same `type` as a category field value. | `"category"` |
| `field_type` | `string` | `"status"`. | `"status"` |
| `values[].value.id` | `number` | ID of the selected option. | `1` |
| `values[].value.text` | `string` | Label of the selected option. | `"Open"` |
| `values[].value.color` | `string` | Color of the option as a hex value without `#`. | `"0077DE"` |
| `values[].value.means_completed` | `boolean` | Whether the option marks the record as done. | `false` |

Each field in a record response also contains the field's `config`. The examples on this page leave it out.

## Record creation

Use the [create record endpoint](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) to set the status of a new record.

`POST https://api.tapeapp.com/v1/record/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "title": "Send signed lease to the tenant",
      "status": 1
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "title": "Send signed lease to the tenant",
    "status": 1
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Send signed lease to the tenant",
  "fields": [
    {
      "field_id": 2,
      "external_id": "title",
      "label": "Title",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Send signed lease to the tenant" }]
    },
    {
      "field_id": 1,
      "external_id": "status",
      "label": "Status",
      "type": "category",
      "field_type": "status",
      "values": [
        {
          "value": {
            "id": 1,
            "text": "Open",
            "color": "0077DE",
            "means_completed": false
          }
        }
      ]
    }
  ]
}
```

The example creates the task "Send signed lease to the tenant" in the tasks app from [Status field](https://developers.tapeapp.com/docs/api/resource/field/status). It sets the "Status" field (ID `1`, type `status`, slug `status`) to the option with ID `1`, "Open".

**General behavior**

-   Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
-   Select an option by its ID or by its label. Tape compares labels case-insensitively and ignores spaces at the start and the end.
-   Find the option IDs in `config.settings.options` of the field, for example with [Retrieve a single app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app).
-   Tape also accepts `{ "id": 1 }`, `{ "value": 1 }` and the option object of a record response.
-   If you send several options, Tape keeps the first option that matches.
-   If two options share a label, select the option by its ID.
-   Every status field is required. Send a status value with every new record.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   A new record without a status value returns `400`.
-   A value that matches no option returns `400`, with or without the query parameter `reject_unresolvable_option_values=true`.
-   A label that two options share returns `400`.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record) to read the status of a record.

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
  "title": "Send signed lease to the tenant",
  "fields": [
    {
      "field_id": 2,
      "external_id": "title",
      "label": "Title",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Send signed lease to the tenant" }]
    },
    {
      "field_id": 1,
      "external_id": "status",
      "label": "Status",
      "type": "category",
      "field_type": "status",
      "values": [
        {
          "value": {
            "id": 1,
            "text": "Open",
            "color": "0077DE",
            "means_completed": false
          }
        }
      ]
    }
  ]
}
```

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](https://developers.tapeapp.com/docs/api/resource/record#update-a-record) to change the status of a record.

`PUT https://api.tapeapp.com/v1/record/{record_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "status": "Done"
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "status": "Done"
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Send signed lease to the tenant",
  "fields": [
    {
      "field_id": 2,
      "external_id": "title",
      "label": "Title",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Send signed lease to the tenant" }]
    },
    {
      "field_id": 1,
      "external_id": "status",
      "label": "Status",
      "type": "category",
      "field_type": "status",
      "values": [
        {
          "value": {
            "id": 3,
            "text": "Done",
            "color": "00866A",
            "means_completed": true
          }
        }
      ]
    }
  ]
}
```

The example sets the "Status" field of the task with ID `1` to "Done". It selects the option by its label.

**General behavior**

-   The option you send replaces the current status.
-   You can't clear a status value.
-   Fields that aren't in the request keep their values.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   `null`, an empty string `""` or an empty array `[]` returns `400` with a message that the status field can't be unset.
-   A value that matches no option returns `400`.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Next steps

[

Status field

create status fields and change their options.

](https://developers.tapeapp.com/docs/api/resource/field/status)[

Category field value

select options without a completed state.

](https://developers.tapeapp.com/docs/api/resource/field-value/category)[

Field value

how all field values work.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Record

create, read, update and delete records, with all query parameters.

](https://developers.tapeapp.com/docs/api/resource/record)[

Filter

find open or completed records.

](https://developers.tapeapp.com/docs/api/resource/filter#status)
