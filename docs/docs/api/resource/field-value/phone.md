# Phone field value

> Use a phone field value to read and write the phone numbers of a record.

Use a phone field value to read and write the phone numbers of a record.

The value of a [phone field](https://developers.tapeapp.com/docs/api/resource/field/phone) is a list of phone numbers in `values`. Each phone number has an `id`, the number in `value` and a type label in `type`.

*Phone field value object*

```json
{
  "field_id": 3,
  "external_id": "phone",
  "label": "Phone",
  "type": "phone",
  "field_type": "multi_phone",
  "values": [
    {
      "id": 100,
      "value": "+1 202 555 0143",
      "type": "mobile",
      "created_at": "2026-11-11 10:15:00",
      "created_at_utc": "2026-11-11 09:15:00",
      "last_modified_at": "2026-11-11 10:15:00",
      "last_modified_at_utc": "2026-11-11 09:15:00",
      "created_by_user_id": 1,
      "created_by_workflow_def_id": null,
      "created_by_share_session_id": null,
      "last_modified_by_user_id": 1,
      "last_modified_by_workflow_def_id": null,
      "last_modified_by_share_session_id": null
    }
  ]
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"phone"` for a phone field. | `"phone"` |
| `field_type` | `string` | `"multi_phone"`. | `"multi_phone"` |
| `values[].id` | `number` | ID of the phone number. Send it with the phone number in an update to keep the ID. | `100` |
| `values[].value` | `string` | The phone number as it was entered. | `"+1 202 555 0143"` |
| `values[].type` | `string` | Type label: `"mobile"`, `"work"`, `"home"`, `"main"`, `"work_fax"`, `"home_fax"`, `"pager"`, `"other"` or the text of a custom label of the field. | `"mobile"` |
| `values[].created_at`, `values[].last_modified_at` | `string` | When the phone number was added and last changed, in your timezone. | `"2026-11-11 10:15:00"` |
| `values[].created_at_utc`, `values[].last_modified_at_utc` | `string` | The same times in UTC. | `"2026-11-11 09:15:00"` |
| `values[].created_by_user_id`, `values[].last_modified_by_user_id` | `number` or `null` | ID of the user who added or last changed the phone number. | `1` |
| `values[].created_by_workflow_def_id`, `values[].last_modified_by_workflow_def_id` | `number` or `null` | ID of the automation that added or last changed the phone number. | `null` |
| `values[].created_by_share_session_id`, `values[].last_modified_by_share_session_id` | `string` or `null` | Session ID (UUID) of an anonymous visitor who added or changed the phone number through a shared link. | `null` |

Each field in a record response also contains the field's `config`. The examples on this page leave it out. They also leave out the times and author IDs of each phone number.

## Record creation

Use the [create record endpoint](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) to set phone numbers on a new record.

`POST https://api.tapeapp.com/v1/record/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "name": "Juliet Adams",
      "phone": [
        { "type": "mobile", "phone": "+1 202 555 0143" },
        { "type": "work", "phone": "+1 202 555 0178" }
      ]
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "name": "Juliet Adams",
    "phone": [
      { "type": "mobile", "phone": "+1 202 555 0143" },
      { "type": "work", "phone": "+1 202 555 0178" }
    ]
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Juliet Adams",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Juliet Adams" }]
    },
    {
      "field_id": 3,
      "external_id": "phone",
      "label": "Phone",
      "type": "phone",
      "field_type": "multi_phone",
      "values": [
        { "id": 100, "value": "+1 202 555 0143", "type": "mobile" },
        { "id": 101, "value": "+1 202 555 0178", "type": "work" }
      ]
    }
  ]
}
```

The example sets two phone numbers in the "Phone" field (ID `3`, type `multi_phone`, slug `phone`) of a new lead.

**General behavior**

-   Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
-   Send an array of phone numbers. Each one is an object `{ "phone": "...", "type": "..." }` or a string. `value` works in place of `phone`.
-   Send `type` in lowercase. Without `type`, or with a `type` Tape doesn't know, the phone number gets the label `work`.
-   The API accepts all eight built-in labels, even if the field's `label_setting` offers fewer.
-   A `type` that matches the text of a custom label of the field (not case-sensitive) gets that label.
-   If the field's `label_setting` is `"none"`, Tape ignores `type`.
-   Tape stores the phone number as you send it. It removes spaces at the start and the end and skips empty phone numbers.
-   A required phone field needs at least one phone number on a new record. An empty array `[]` counts as missing.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   A `type` that matches more than one custom label of the field returns `400`. Use a unique label.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record) to read the phone numbers of a record.

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
  "title": "Juliet Adams",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Juliet Adams" }]
    },
    {
      "field_id": 3,
      "external_id": "phone",
      "label": "Phone",
      "type": "phone",
      "field_type": "multi_phone",
      "values": [
        { "id": 100, "value": "+1 202 555 0143", "type": "mobile" },
        { "id": 101, "value": "+1 202 555 0178", "type": "work" }
      ]
    }
  ]
}
```

**General behavior**

-   A phone number without a label shows `"type": "work"`. This includes all phone numbers of a field with `"label_setting": "none"`.

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](https://developers.tapeapp.com/docs/api/resource/record#update-a-record) to change the phone numbers of a record.

`PUT https://api.tapeapp.com/v1/record/{record_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "phone": [
        { "id": 100, "type": "mobile", "phone": "+1 202 555 0199" },
        { "type": "main", "phone": "+1 202 555 0100" }
      ]
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "phone": [
      { "id": 100, "type": "mobile", "phone": "+1 202 555 0199" },
      { "type": "main", "phone": "+1 202 555 0100" }
    ]
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Juliet Adams",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Juliet Adams" }]
    },
    {
      "field_id": 3,
      "external_id": "phone",
      "label": "Phone",
      "type": "phone",
      "field_type": "multi_phone",
      "values": [
        { "id": 100, "value": "+1 202 555 0199", "type": "mobile" },
        { "id": 102, "value": "+1 202 555 0100", "type": "main" }
      ]
    }
  ]
}
```

The example changes the mobile number with ID `100`, removes the work number and adds a main number.

**General behavior**

-   The new list replaces the old list. Tape removes phone numbers that aren't in the request.
-   A phone number sent with its `id` keeps that ID. Tape removes an entry with only `id`. A phone number without `id` becomes a new one.
-   To clear the field, send `null` or an empty array `[]`. This also works for a required phone field.
-   Fields that aren't in the request keep their values.

*Request: clear the field*

```json
{
  "fields": {
    "phone": null
  }
}
```

A cleared field isn't in the `fields` of the response.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

Same errors as under [Record creation](#record-creation). An update also returns these errors:

-   A phone number that isn't a string, like `{ "phone": 5 }`, returns `400` with `validation` and the message `Invalid input for Phone field with ID …`.
-   An entry that's `null`, or an object without `phone`, `value`, `type` or `id`, returns the same error.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Next steps

[

Phone field

create and change phone fields.

](https://developers.tapeapp.com/docs/api/resource/field/phone)[

Field value

how all field values work.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Record

create, read, update and delete records.

](https://developers.tapeapp.com/docs/api/resource/record)[

Filter

find records by their phone numbers.

](https://developers.tapeapp.com/docs/api/resource/filter#multi-phone)
