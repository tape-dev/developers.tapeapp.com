---
id: overview
title: Field value
sidebar_label: Overview
---

Use field values to read and write the data of a record.

A record of a database app has static properties like `record_id`, `title` or `created_on`, and a value for the fields of its app. A field is the definition in the app: its name, type and settings, see [Field](/docs/api/resource/field/overview). A field value is what one record holds for that field.

A "Contacts" app could have the fields "First Name" (**Single line text**), "Last Name" (**Single line text**) and "Phone" (**Phone**). To create a contact, send a value for each of these fields.

Looking for the format of one field type? See [Formats by field type](#formats-by-field-type).

The record endpoints return field values in the `fields` array of a record. A field without a value isn't in the array, except a [calculation](/docs/api/resource/field-value/calculation) whose result became empty. Each entry is a field value object:

```json title="Field value object"
{
  "field_id": 2,
  "external_id": "notes",
  "label": "Notes",
  "type": "text",
  "field_type": "multi_text",
  "values": [
    {
      "value": "<p>Called about the <b>solar roof</b> offer.</p>",
      "unformatted_value": "Called about the solar roof offer."
    }
  ]
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `field_id` | `number` | ID of the field. | `2` |
| `external_id` | `string` | Slug of the field. Use it or the field ID as the key when you write the value. | `"notes"` |
| `label` | `string` | Name of the field in Tape. | `"Notes"` |
| `type` | `string` | Kind of data the value holds. See [Field type](#field-type). | `"text"` |
| `field_type` | `string` | Exact type of the field. | `"multi_text"` |
| `config` | `object` | Configuration of the field, as in the [field object](/docs/api/resource/field/overview#common-properties). | |
| `values` | `array` | The values. The structure of one value depends on the field type. See the page of each field type. | `[{ "value": "..." }]` |

Each field in a record response also contains the field's `config`. The examples on this page leave it out.

## Field type

Each field value has a `type` and a `field_type`. The `type` is the kind of data returned, like `text`, `category` or `phone`. The `field_type` is the exact type of the field, like `single_text` or `multi_phone`.

The [field type table](/docs/api/resource/field/overview#field-type) lists all values. The `field_type` says whether a field holds one value or several values.

A `single_category` field value never has more than one option. Switching a field from `single_category` to `multi_category` converts the field and all its values.

**Read-only field values**

Tape computes the values of `calculation`, `unique_id`, `created_on`, `created_by`, `last_modified_on` and `last_modified_by` fields. You can't write them.

- `calculation` and `unique_id` values appear in the `fields` of a record. Tape ignores them in create and update requests.
- `created_on`, `created_by`, `last_modified_on` and `last_modified_by` values don't appear in `fields`. Read them from the record properties of the same name.

A `unique_id` value holds the number of the record within its app and the formatted ID:

```json title="Unique ID field value object"
{
  "field_id": 7,
  "external_id": "deal_id",
  "label": "Deal ID",
  "type": "unique_id",
  "field_type": "unique_id",
  "values": [{ "value": 12, "formatted": "DEAL-0012" }]
}
```

`value` is the number of the record within its app, the same number as the record's `app_record_id`. `formatted` adds the prefix, the suffix and the leading zeros from the [field settings](/docs/api/resource/field/unique-id).

## Write field values

Use the [create record endpoint](/docs/api/resource/record#create-a-record) and the [update record endpoint](/docs/api/resource/record#update-a-record) to write field values.

```json title="Request"
{
  "fields": {
    "first_name": "Juliet",
    "2": "<p>Called about the <b>solar roof</b> offer.</p>"
  }
}
```

**General behavior**

- Send the values in the `fields` object. Use the field ID or the field's slug (returned as `external_id` in records) as the key.
- Find the app ID, field IDs and slugs in the app's **Developer** window, see [Find the app ID and field IDs](/docs/api/resource/app#find-app-and-field-ids), or in the `fields` of [Retrieve a single app](/docs/api/resource/app#retrieve-a-single-app).
- Each field type accepts its own input formats. See [Formats by field type](#formats-by-field-type).
- When you create a record, send a value for every required field (`"required": true` in the field's `config`). A missing value returns `400`.
- In an update, fields that aren't in the request keep their values.
- To clear a value, send `null`. Some field types also accept an empty value.
- Clearing a required field returns `400` for these field types: `multi_text`, `single_category`, `multi_category`, `single_date`, `range_date`, `single_user`, `multi_user`, `single_attachment`, `multi_attachment`, `multi_image`, `single_location` and `status`. You can't clear a status value at all.
- Tape doesn't stop you from clearing a required field of the types `single_text`, `number`, `single_relation`, `multi_relation`, `checklist`, `multi_email`, `multi_link` and `multi_phone` in an update. Send a value instead. A new record still needs a value for them.
- A cleared field isn't in the `fields` of the response.

**Requirements:** `records:edit` to write field values, `records:read` to read them. Works with a personal access token, an OAuth access token or a user API key. The token from the [Quickstart](/docs/guide/api/getting-started) only reads records.

## Formats by field type

Each row shows one accepted input. The page of each field type has all input formats, a full request with its response, and the errors. Its examples read your token from `$TAPE_TOKEN` and use example IDs like `1`. Replace them with your own.

Know the field only by its name in Tape, like **Member** or **Files**? Find its `field_type` in the [field type table](/docs/api/resource/field/overview#field-type).

| Field value | `field_type` | To set, send | To clear, send |
| :-- | :-- | :-- | :-- |
| [Text](/docs/api/resource/field-value/text) | `single_text`, `multi_text` | `"Clara Weber"` | `null` or `""` |
| [Number](/docs/api/resource/field-value/number) | `number` | `85000` | `null` or `""` |
| [Category](/docs/api/resource/field-value/category) | `single_category`, `multi_category` | `"Contacted"` or `[5, 6]` | `null`, `""` or `[]` |
| [Status](/docs/api/resource/field-value/status) | `status` | `1` or `"Done"` | Not possible |
| [Date](/docs/api/resource/field-value/date) | `single_date`, `range_date` | `"2026-03-10 08:30"` (UTC) or `"2026-03-23 - 2026-03-27"` | `null` |
| [User](/docs/api/resource/field-value/user) | `single_user`, `multi_user` | `1` or `[4, "sierra@acme.com"]` | `null`. For a `multi_user` field, `[]` also works |
| [Relation](/docs/api/resource/field-value/relation) | `single_relation`, `multi_relation` | `100` or `[110, 111]` | `null` or `[]` |
| [Attachment](/docs/api/resource/field-value/attachment) | `single_attachment`, `multi_attachment` | `"temporary-file-1"` from [Upload a file](/docs/api/resource/file#upload-a-file) | `null` or `[]` |
| [Image](/docs/api/resource/field-value/image) | `multi_image` | `["temporary-file-1"]` | `null` or `[]` |
| [Checklist](/docs/api/resource/field-value/checklist) | `checklist` | `["Book welcome lunch"]` | `null` or `[]` |
| [Link](/docs/api/resource/field-value/link) | `multi_link` | `[{ "url": "https://acme.com", "type": "homepage" }]` | `null` or `[]` |
| [Location](/docs/api/resource/field-value/location) | `single_location` | `{ "street_address": "221 Elm Street", "city": "San Francisco" }` | `null` |
| [Email](/docs/api/resource/field-value/email) | `multi_email` | `[{ "email": "juliet@acme.com", "type": "work" }]` | `null` or `[]` |
| [Phone](/docs/api/resource/field-value/phone) | `multi_phone` | `[{ "phone": "+1 202 555 0143", "type": "mobile" }]` | `null` or `[]` |
| [Calculation](/docs/api/resource/field-value/calculation) | `calculation` | Read-only | Read-only |
| [Unique ID](#field-type) | `unique_id` | Read-only | Read-only |

:::info Coming from Podio?
Field values keep the shape of Podio item fields: a `fields` object keyed by field ID or slug when you write, a `values` array per field when you read. Find the Tape field type of each Podio field type in [Podio field types](/docs/api/resource/field/overview#podio-field-types), and its input format in the table above.
:::

## Next steps

- [Field](/docs/api/resource/field/overview): the field types and the properties all fields share.
- [Text field value](/docs/api/resource/field-value/text): an example of a field value with all endpoints.
- [Record](/docs/api/resource/record): create, read, update and delete records.
- [Filter](/docs/api/resource/filter): find records by their field values.
- [Capabilities](/docs/api/capabilities): what `records:read` and `records:edit` allow.
