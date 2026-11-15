---
id: overview
title: Field
sidebar_label: Overview
---

Use fields to define the structure of the records of a database app.

A field belongs to one app. A field is the definition: its name, type and settings. A field value is what one record holds for that field, see [Field value](/docs/api/resource/field-value/overview).

A "Contacts" app could have the fields "First Name" (**Single line text**), "Last Name" (**Single line text**) and "Phone" (**Phone**). Every record then has values for these fields.

You create, update and delete fields through the app endpoints, see [Create and update fields](#create-and-update-fields). Responses that return a full app also return its fields.

```json title="Field object"
{
  "field_id": 2,
  "external_id": "notes",
  "slug": "notes",
  "label": "Notes",
  "type": "text",
  "field_type": "multi_text",
  "config": {
    "label": "Notes",
    "slug": "notes",
    "external_id": "notes",
    "description": "Notes about the contact.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
    "settings": {
      "formatted": true,
      "format": "html"
    }
  }
}
```

## Common properties

All field types share these properties:

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `field_id` | `number` | ID of the field. | `2` |
| `slug` | `string` | Identifier of the field within its app. Tape creates it from the label when you create the field. Renaming the field keeps the slug. Use the field ID or the slug as the key of a field value in record requests. Records return the slug as `external_id`. | `"notes"` |
| `external_id` | `string` | Deprecated. Same as `slug`, kept for backwards compatibility. Use `slug`. | `"notes"` |
| `label` | `string` | Name of the field in Tape. | `"Notes"` |
| `type` | `string` | Kind of data the field holds. See [Field type](#field-type). | `"text"` |
| `field_type` | `string` | Exact type of the field. See [Field type](#field-type). | `"multi_text"` |
| `config.label` | `string` | Name of the field. Required when you create or update a field. | `"Notes"` |
| `config.slug` | `string` | Same as `slug`. | `"notes"` |
| `config.external_id` | `string` | Deprecated. Same as `slug`, kept for backwards compatibility. Use `slug`. | `"notes"` |
| `config.description` | `string` | Help text of the field. | `"Notes about the contact."` |
| `config.show_description` (read-only) | `boolean` | Whether Tape shows the `description` as help text inside the record. | `true` |
| `config.required` | `boolean` | Whether a record needs a value for this field. You can still clear `single_text`, `number`, relation, checklist, email, link and phone fields in an update. | `false` |
| `config.hidden_if_empty` | `boolean` | Whether Tape hides the field inside the record when it has no value. | `false` |
| `config.always_hidden` | `boolean` | Whether Tape hides the field inside the record, even when it has a value. | `false` |
| `config.primary` | `boolean` | Whether the field is the primary field of the app. The value of the primary field names a record wherever Tape refers to it. Any field type can be the primary field. An app has at most one primary field, and some apps have none. | `false` |
| `config.settings` | `object` | Settings of the field type. The structure depends on `field_type`. See the page of each field type. | `{ "formatted": true, "format": "html" }` |

## Field type

Each field has a `field_type` and a `type`. The `field_type` is the exact type of the field. The `type` is the kind of data it holds, so several field types share one `type`.

For field types that can hold one value or several values, the prefix of the `field_type` says which: `single_category` holds one option, `multi_category` holds several.

A `single_category` field value never has more than one option. Switching a field from `single_category` to `multi_category` converts the field and all its values.

| `field_type` | Field in Tape | `type` |
| :-- | :-- | :-- |
| [`single_text`](/docs/api/resource/field/text) | **Single line text** | `text` |
| [`multi_text`](/docs/api/resource/field/text) | **Multi line text** | `text` |
| [`single_category`](/docs/api/resource/field/category) | **Single select** | `category` |
| [`multi_category`](/docs/api/resource/field/category) | **Multiple select** | `category` |
| [`status`](/docs/api/resource/field/status) | **Status** | `category` |
| [`single_date`](/docs/api/resource/field/date) | **Date** | `date` |
| [`range_date`](/docs/api/resource/field/date) | **Date** with an end date | `date` |
| [`number`](/docs/api/resource/field/number) | **Number** | `number` |
| [`calculation`](/docs/api/resource/field/calculation) | **Calculation** | `calculation` |
| [`single_relation`](/docs/api/resource/field/relation) | **Relation** to one record | `app` |
| [`multi_relation`](/docs/api/resource/field/relation) | **Relation** to several records | `app` |
| [`single_user`](/docs/api/resource/field/user) | **Member**, one member | `contact` |
| [`multi_user`](/docs/api/resource/field/user) | **Member**, several members | `contact` |
| [`single_attachment`](/docs/api/resource/field/attachment) | **Files**, one file | `file` |
| [`multi_attachment`](/docs/api/resource/field/attachment) | **Files**, several files | `file` |
| [`multi_image`](/docs/api/resource/field/image) | **Image** | `file` |
| [`multi_email`](/docs/api/resource/field/email) | **Email** | `email` |
| [`multi_phone`](/docs/api/resource/field/phone) | **Phone** | `phone` |
| [`multi_link`](/docs/api/resource/field/link) | **Link** | `embed` |
| [`checklist`](/docs/api/resource/field/checklist) | **Task list** | `checklist` |
| [`single_location`](/docs/api/resource/field/location) | **Location** | `location` |
| [`unique_id`](/docs/api/resource/field/unique-id) | **Unique ID** | `unique_id` |
| [`created_on`](/docs/api/resource/field/missing-types) | **Created on** | `created_at` |
| [`created_by`](/docs/api/resource/field/missing-types) | **Created by** | `created_by` |
| [`last_modified_on`](/docs/api/resource/field/missing-types) | **Last edited on** | `last_modified_at` |
| [`last_modified_by`](/docs/api/resource/field/missing-types) | **Last edited by** | `last_modified_by` |

When you create a field, send one of these values as `field_type`. Tape rejects any other value with `400`.

Tape fills `calculation`, `unique_id`, `created_on`, `created_by`, `last_modified_on` and `last_modified_by` fields. You can create and configure these fields, but you can't write their values.

### Podio field types {#podio-field-types}

Find the Tape field type for each Podio field type. The Podio `external_id` of a field is the `slug` in Tape.

| Podio field type | Tape `field_type` | Note |
| :-- | :-- | :-- |
| `text` | [`single_text`, `multi_text`](/docs/api/resource/field/text) | `multi_text` holds rich text (HTML). |
| `number` | [`number`](/docs/api/resource/field/number) | |
| `money` | [`number`](/docs/api/resource/field/number) | No money type. The currency is the field's `unit`, not part of the value. |
| `duration` | [`number`](/docs/api/resource/field/number) | No duration type. Store the duration as a number, for example in seconds. |
| `progress` | [`number`](/docs/api/resource/field/number) | No progress type. Store 0 to 100, for example with the unit `%`. |
| `category` | [`single_category`, `multi_category`](/docs/api/resource/field/category), [`status`](/docs/api/resource/field/status) | |
| `date` | [`single_date`, `range_date`](/docs/api/resource/field/date) | |
| `contact` | [`single_user`, `multi_user`](/docs/api/resource/field/user) | Users of your organization only, guests included. Keep external contacts without a Tape account as records and link them with a relation field. |
| `app` (app reference) | [`single_relation`, `multi_relation`](/docs/api/resource/field/relation) | |
| `image` | [`multi_image`](/docs/api/resource/field/image) | |
| `embed` | [`multi_link`](/docs/api/resource/field/link) | |
| `location` | [`single_location`](/docs/api/resource/field/location) | |
| `calculation` | [`calculation`](/docs/api/resource/field/calculation) | Read-only. |
| `phone` (`tel`) | [`multi_phone`](/docs/api/resource/field/phone) | |
| `email` | [`multi_email`](/docs/api/resource/field/email) | |
| Files of an item | [`single_attachment`, `multi_attachment`](/docs/api/resource/field/attachment) | A record has no file list of its own. Add an attachment field. |

The `type` keeps the Podio names `app`, `contact` and `embed`. New in Tape: `status`, `checklist`, `unique_id` and the fields for creation and last edit.

## Create and update fields

Use the [create app endpoint](/docs/api/resource/app#create-an-app) to create fields together with a new app. Use the [update app endpoint](/docs/api/resource/app#update-an-app) to create new fields in an app, change existing fields or delete fields with `fields_to_delete`. The page of each field type has a full example.

Find the workspace ID, the app ID and the field IDs in the [Developer view of the app](/docs/api/resource/app#find-app-and-field-ids).

To change the order of the fields, use [Update an app's field order](/docs/api/resource/app#update-an-apps-field-order).

**General behavior**

- A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
- Every field you update needs `config.label`, even if the label stays the same.
- Send `required`, `always_hidden` and `hidden_if_empty` with every field update. Tape sets the ones you leave out to `false`. A **Status** field is the exception: without `required`, it stays required.
- A new `single_text` or `multi_text` field with a `description` shows it as help text. A new field of another type starts with `show_description` set to `false`.
- Send `description` with every field update to show the help text or keep it visible. Without `description`, Tape sets `show_description` to `false`. **Single select**, **Multiple select** and **Status** fields keep their `show_description` as it is in both cases.
- To change one property, read the field first with [Retrieve a single app](/docs/api/resource/app#retrieve-a-single-app) and send back what you keep. A relation field without `settings` loses its linked apps.
- Without `primary`, Tape makes the first field of a new app the primary field. It skips `unique_id`, `created_on`, `created_by`, `last_modified_on` and `last_modified_by` fields, unless the request has only fields of these types. Adding fields to an app that has fields leaves its primary field unchanged.
- Set `primary` to `true` to make a field the primary field. The field that was the primary field before loses the role. In a field update, leaving out `primary` keeps the primary field as it is.
- Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`. Creating an app needs a workspace role that may edit apps in the workspace, updating one needs **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- A field update without `config.label` returns `400` with `input_validation` and a message such as `Invalid input: data/fields/0/config must have required property 'label'`.
- A field update without `config` returns `400` with `validation`.
- A request that sets `primary` to `true` on more than one field returns `400`.
- A field update that sets `primary` to `false` on the primary field, without a new primary field, returns `400`. An app with a primary field keeps one.

## Next steps

- [Text field](/docs/api/resource/field/text): an example of a field type with all endpoints.
- [Field value](/docs/api/resource/field-value/overview): read and write the values of fields in a record.
- [App](/docs/api/resource/app): create, update and delete apps with their fields.
- [Capabilities](/docs/api/capabilities): what `apps:edit` allows.
