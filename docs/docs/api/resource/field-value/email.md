# Email field value

> Use an email field value to read and write the email addresses of a record.

Use an email field value to read and write the email addresses of a record.

The value of an [email field](https://developers.tapeapp.com/docs/api/resource/field/email) is a list of email addresses in `values`. Each email address has an `id`, the address in `value` and a type label in `type`.

*Email field value object*

```json
{
  "field_id": 2,
  "external_id": "email",
  "label": "Email",
  "type": "email",
  "field_type": "multi_email",
  "values": [
    {
      "id": 100,
      "value": "juliet@acme.com",
      "type": "work",
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
| `type` | `string` | `"email"` for an email field. | `"email"` |
| `field_type` | `string` | `"multi_email"`. | `"multi_email"` |
| `values[].id` | `number` | ID of the email address. Send it with the email address in an update to keep the ID. | `100` |
| `values[].value` | `string` | The email address. | `"juliet@acme.com"` |
| `values[].type` | `string` | Type label: `"work"`, `"home"`, `"other"` or the text of a custom label of the field. | `"work"` |
| `values[].created_at`, `values[].last_modified_at` | `string` | When the email address was added and last changed, in your timezone. | `"2026-11-11 10:15:00"` |
| `values[].created_at_utc`, `values[].last_modified_at_utc` | `string` | The same times in UTC. | `"2026-11-11 09:15:00"` |
| `values[].created_by_user_id`, `values[].last_modified_by_user_id` | `number` or `null` | ID of the user who added or last changed the email address. | `1` |
| `values[].created_by_workflow_def_id`, `values[].last_modified_by_workflow_def_id` | `number` or `null` | ID of the automation that added or last changed the email address. | `null` |
| `values[].created_by_share_session_id`, `values[].last_modified_by_share_session_id` | `string` or `null` | Session ID (UUID) of an anonymous visitor who added or changed the email address through a shared link. | `null` |

Each field in a record response also contains the field's `config`. The examples on this page leave it out. They also leave out the times and author IDs of each email address.

## Record creation

Use the [create record endpoint](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) to set email addresses on a new record.

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
      "email": [
        { "type": "work", "email": "juliet@acme.com" },
        { "type": "home", "email": "juliet.adams@acme.com" }
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
    "email": [
      { "type": "work", "email": "juliet@acme.com" },
      { "type": "home", "email": "juliet.adams@acme.com" }
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
      "field_id": 2,
      "external_id": "email",
      "label": "Email",
      "type": "email",
      "field_type": "multi_email",
      "values": [
        { "id": 100, "value": "juliet@acme.com", "type": "work" },
        { "id": 101, "value": "juliet.adams@acme.com", "type": "home" }
      ]
    }
  ]
}
```

The example sets two email addresses in the "Email" field (ID `2`, type `multi_email`, slug `email`) of a new contact.

**General behavior**

-   Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
-   Send an array of email addresses. Each one is an object `{ "email": "...", "type": "..." }` or a string. `value` works in place of `email`.
-   Tape reads `type` case-insensitively. Without `type`, or with a `type` Tape doesn't know, the email address gets the label `work`.
-   A `type` that matches the text of a custom label of the field (not case-sensitive) gets that label.
-   If the field's `label_setting` is `"none"`, Tape ignores `type`.
-   Tape removes spaces at the start and the end of each email address and skips empty ones.
-   Tape doesn't check the format of an email address.
-   A required email field needs at least one email address on a new record. An empty array `[]` counts as missing.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   A `type` that matches more than one custom label of the field returns `400`. Use a unique label.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record) to read the email addresses of a record.

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
      "field_id": 2,
      "external_id": "email",
      "label": "Email",
      "type": "email",
      "field_type": "multi_email",
      "values": [
        { "id": 100, "value": "juliet@acme.com", "type": "work" },
        { "id": 101, "value": "juliet.adams@acme.com", "type": "home" }
      ]
    }
  ]
}
```

**General behavior**

-   An email address without a label shows `"type": "work"`. This includes all email addresses of a field with `"label_setting": "none"`.

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](https://developers.tapeapp.com/docs/api/resource/record#update-a-record) to change the email addresses of a record.

`PUT https://api.tapeapp.com/v1/record/{record_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "email": [
        { "id": 100, "type": "work", "email": "juliet.adams@acme.com" },
        { "type": "other", "email": "sales@acme.com" }
      ]
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "email": [
      { "id": 100, "type": "work", "email": "juliet.adams@acme.com" },
      { "type": "other", "email": "sales@acme.com" }
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
      "field_id": 2,
      "external_id": "email",
      "label": "Email",
      "type": "email",
      "field_type": "multi_email",
      "values": [
        { "id": 100, "value": "juliet.adams@acme.com", "type": "work" },
        { "id": 102, "value": "sales@acme.com", "type": "other" }
      ]
    }
  ]
}
```

The example changes the work email address with ID `100`, removes the home email address and adds a new one with the label `other`.

**General behavior**

-   The new list replaces the old list. Tape removes email addresses that aren't in the request.
-   An email address sent with its `id` keeps that ID. Tape removes an entry with only `id`. An email address without `id` becomes a new one.
-   To clear the field, send `null` or an empty array `[]`. This also works for a required email field.
-   Fields that aren't in the request keep their values.

*Request: clear the field*

```json
{
  "fields": {
    "email": null
  }
}
```

A cleared field isn't in the `fields` of the response.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

Same errors as under [Record creation](#record-creation). An update also returns these errors:

-   An email address that isn't a string, like `{ "email": 5 }`, returns `400` with `validation` and the message `Invalid input for email field with ID …`.
-   An entry that's `null`, or an object without `email`, `value`, `type` or `id`, returns the same error.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Next steps

[

Email field

create and change email fields.

](https://developers.tapeapp.com/docs/api/resource/field/email)[

Field value

how all field values work.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Record

create, read, update and delete records.

](https://developers.tapeapp.com/docs/api/resource/record)[

Filter

find records by their email addresses.

](https://developers.tapeapp.com/docs/api/resource/filter#multi-email)
