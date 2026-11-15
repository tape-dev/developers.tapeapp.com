---
id: calculation
title: Calculation field
sidebar_label: Calculation
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use a calculation field to compute a value from other fields of a record or from related records.

<a id="what-is-a-calculation-field"></a>

Tape has one calculation field type: `calculation` is the **Calculation** field. It has a JavaScript `script` that Tape runs for every new record and whenever one of the referenced values changes.

The script returns text, a number or a date. The [Calculation field documentation](https://help.tapeapp.com/en/articles/18449157-calculation-syntax-examples) shows how to write scripts.

Through the API, you write the same script as in Tape. The difference is how the script references fields. See [Writing scripts for calculation fields via the API](#writing-scripts-for-calculation-fields-via-the-api).

<a id="properties"></a>

A calculation field has the [common field properties](/docs/api/resource/field/overview#common-properties) and the `settings` below. A calculation field can't be required. Tape ignores `required: true`. To read the computed values of a record, see [Calculation field value](/docs/api/resource/field-value/calculation).

```json title="Calculation field object"
{
  "field_id": 3,
  "external_id": "price_per_square_meter",
  "slug": "price_per_square_meter",
  "label": "Price per Square Meter",
  "type": "calculation",
  "field_type": "calculation",
  "config": {
    "label": "Price per Square Meter",
    "slug": "price_per_square_meter",
    "external_id": "price_per_square_meter",
    "description": "Asking price divided by living area.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
    "settings": {
      "decimals": 2,
      "return_type": "number",
      "script": "@[Price](field_1) / @[Living Area](field_2)",
      "script_last_modified_at": null,
      "script_last_modified_at_utc": null,
      "script_last_modified_by_user_id": null,
      "script_created_at": "2026-11-11 10:30:00",
      "script_created_at_utc": "2026-11-11 09:30:00",
      "script_created_by_user_id": 1,
      "unit_location": "suffix",
      "calendar": false,
      "unit": "€/m²",
      "time": "enabled",
      "trigger_webhooks": false,
      "trigger_automations": false
    }
  }
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"calculation"`. | `"calculation"` |
| `field_type` | `string` | `"calculation"`. | `"calculation"` |
| `config.settings.script` | `string` | The JavaScript code Tape runs to compute the value. It references fields with tokens, see [Writing scripts](#writing-scripts-for-calculation-fields-via-the-api). | `"@[Price](field_1) / @[Living Area](field_2)"` |
| `config.settings.return_type` | `string` | What the script returns: `"text"`, `"number"` or `"date"`. Tape works it out from the script when you create or update the field. | `"number"` |
| `config.settings.decimals` | `number` | Number results only. Number of decimal places. | `2` |
| `config.settings.unit` | `string` | Number results only. Unit shown with the value. | `"€/m²"` |
| `config.settings.unit_location` | `string` | Number results only. Where Tape shows the unit: `"prefix"` or `"suffix"`. Responses can show `"prefix_and_suffix"` for fields set up in Tape. `unit` then holds only the prefix. The API can't set a prefix and a suffix together. | `"suffix"` |
| `config.settings.calendar` | `boolean` | Date results only. Whether Tape shows the records in the calendar sidebar and includes them in the iCal export. | `false` |
| `config.settings.time` | `string` | Date results only. Whether the date has a time: `"disabled"`, `"enabled"` or `"required"`. | `"enabled"` |
| `config.settings.trigger_webhooks` | `boolean` | Whether a change of the computed value triggers webhooks. A field you create through the API starts with `false`. | `false` |
| `config.settings.trigger_automations` | `boolean` | Whether a change of the computed value triggers automations. A field you create through the API starts with `false`. | `false` |
| `config.settings.script_created_at` (read-only) | `string` | When the script was created, in your timezone. `null` for fields that are older than this property. | `"2026-11-11 10:30:00"` |
| `config.settings.script_created_by_user_id` (read-only) | `number` | ID of the user who created the script. `null` for older fields or deleted users. | `1` |
| `config.settings.script_last_modified_at` (read-only) | `string` | When a user last changed the script, in your timezone. `null` if nobody changed it yet. | `null` |
| `config.settings.script_last_modified_by_user_id` (read-only) | `number` | ID of the user who last changed the script. `null` if nobody changed it yet or the user was deleted. | `null` |

`script_created_at` and `script_last_modified_at` also come as `script_created_at_utc` and `script_last_modified_at_utc` in UTC.

## Writing scripts for calculation fields via the API {#writing-scripts-for-calculation-fields-via-the-api}

The API reads and writes the script in its stored form. In the stored form, every reference to a field is a token:

```
@[Display name](variable_name)
```

The variable name in parentheses holds the field IDs and says which field Tape reads. The display name in square brackets only labels the token.

In Tape, the calculation editor shows these tokens as JavaScript names, for example `Price` or `Tasks.Title.all`. Tape converts between both forms when the editor opens and saves the script.

### Referencing fields of the same app as the calculation field

To reference a field of the same app, use its field ID. Find it in the [Developer view of the app](/docs/api/resource/app#find-app-and-field-ids).

```
@[Field name](field_<field ID>)
```

The example references a `number` field "Price" with ID `1`:

```
@[Price](field_1)
```

The calculation editor shows this as `Price`. Spaces in field names become underscores, so "Living Area" shows as `Living_Area`.

- For a **Date** field with an end date, add `_start_date` or `_end_date`, for example `@[Sprint](field_5_end_date)`. The calculation editor shows `Sprint.start` and `Sprint.end`.
- To reference the ID of the record, use `@[Record ID](meta_recordId)`. The calculation editor shows `Record_ID`.
- Relation fields can't be referenced with `field_`. Use the tokens below to read the related records.

### Referencing fields of related records {#referencing-fields-of-a-different-app-than-the-calculation-field-via-an-outgoing-relation-field}

If the app has a relation field (`single_relation` or `multi_relation`), the script can read fields of the related records. These tokens carry two IDs: first the field on the related records, then the relation field.

The examples use a projects app with the calculation field. Its relation field "Tasks" (ID `654`) links each project to task records. The tasks app has a field "Title" (ID `123`) and a field "Hours" (ID `321`).

#### Referencing a single field of all related records

To get the values of one field of all related records, use:

```
@[All of Field name](out_<field ID>_<relation field ID>)
```

The example gets the titles of all tasks of the project:

```
@[All of Title](out_123_654)
```

The token becomes an array with the values. Records without a value are left out. The calculation editor shows this as `Tasks.Title.all`.

A script that ends with the array itself stores no value. Turn it into text or a number first, for example with `.join(", ")` or `.length`.

#### Referencing a single field of all related records with nulls

To keep the records without a value, use:

```
@[All of Field name with nulls](outn_<field ID>_<relation field ID>)
```

The example gets the titles of all tasks, with `null` for tasks without a title:

```
@[All of Title with nulls](outn_123_654)
```

The token becomes an array with one entry per related record. The calculation editor shows this as `Tasks.Title.allWithNull`.

#### Referencing a single field of all relating records {#referencing-a-single-field-of-all-relating-records-incoming-relations-from-relation-fields-that-reference-the-app-of-the-calculation-field}

Relating records are records of another database app whose relation field points to this record. For these tokens, the relation field ID is the ID of the relation field in the other app.

In the example, the tasks app has a relation field "Project" (ID `655`) that links each task to a project. In the projects app, the script gets the titles of all tasks that link to the project:

```
@[All of Title](in_123_655)
```

The token becomes an array with the values. Records without a value are left out. The calculation editor names the namespace after the other app and shows this as `Tasks.Title.all`.

#### Referencing a single field of all relating records with nulls {#referencing-a-single-field-of-all-relating-records-with-nulls-incoming-relations-from-relation-fields-that-reference-the-app-of-the-calculation-field}

To keep the relating records without a value, use `inn_`:

```
@[All of Title with nulls](inn_123_655)
```

The token becomes an array with one entry per relating record, with `null` for records without a value. The calculation editor shows this as `Tasks.Title.allWithNull`.

#### Referencing a number field of all related records (incoming or outgoing)

For `number` fields, a token can return the sum, the average, the minimum or the maximum of all values instead of an array. Add the aggregation after `out_` or `in_`:

| Aggregation | Outgoing relation | Incoming relation | Calculation editor |
| :-- | :-- | :-- | :-- |
| Sum | `@[Sum of Hours](out_sum_321_654)` | `@[Sum of Hours](in_sum_321_655)` | `Tasks.Hours.sum` |
| Average | `@[Average of Hours](out_avg_321_654)` | `@[Average of Hours](in_avg_321_655)` | `Tasks.Hours.avg` |
| Minimum | `@[Minimum of Hours](out_min_321_654)` | `@[Minimum of Hours](in_min_321_655)` | `Tasks.Hours.min` |
| Maximum | `@[Maximum of Hours](out_max_321_654)` | `@[Maximum of Hours](in_max_321_655)` | `Tasks.Hours.max` |

Date fields support the minimum and the maximum. Tokens with nulls (`outn_`, `inn_`) don't take an aggregation. An aggregation on another field type, for example `out_sum_` on a text field, returns `500` with `unknown`.

The example script returns the hours of all tasks of the project as text:

```
@[Sum of Hours](out_sum_321_654) + " hours"
```

## App creation

You can't create calculation fields together with a new app. Create the app first. Then add the calculation fields with an [app update](#app-update).

**Errors**

- A request to the [create app endpoint](/docs/api/resource/app#create-an-app) with a `calculation` field returns `400` with a message that starts with `Cannot create Calculation Field upon App creation.`

## App update

Use the [update app endpoint](/docs/api/resource/app#update-an-app) to create new calculation fields in an app or to change existing ones.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

The example adds a calculation field to a listings app with ID `1`. The app has two `number` fields: "Price" (ID `1`) and "Living Area" (ID `2`). The new field "Price per Square Meter" divides the price by the living area.

Find the app ID and the field IDs in the [Developer view of the app](/docs/api/resource/app#find-app-and-field-ids).

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": [
      {
        "field_type": "calculation",
        "config": {
          "label": "Price per Square Meter",
          "description": "Asking price divided by living area.",
          "settings": {
            "script": "@[Price](field_1) / @[Living Area](field_2)",
            "decimals": 2,
            "unit": "€/m²",
            "unit_location": "suffix"
          }
        }
      }
    ]
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "fields": [
    {
      "field_type": "calculation",
      "config": {
        "label": "Price per Square Meter",
        "description": "Asking price divided by living area.",
        "settings": {
          "script": "@[Price](field_1) / @[Living Area](field_2)",
          "decimals": 2,
          "unit": "€/m²",
          "unit_location": "suffix"
        }
      }
    }
  ]
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "listings",
  "external_id": "listings",
  "name": "Listings",
  "record_name": "Listing",
  "item_name": "Listing",
  "type": "database",
  "config": {
    "item_name": "Listing",
    "name": "Listings"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "price",
      "slug": "price",
      "label": "Price",
      "type": "number",
      "field_type": "number",
      "config": {
        "label": "Price",
        "slug": "price",
        "external_id": "price",
        "description": "Asking price of the property.",
        "show_description": true,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "unit_location": "suffix",
          "decimals": 0,
          "unit_label": "€",
          "unit": "€"
        }
      }
    },
    {
      "field_id": 2,
      "external_id": "living_area",
      "slug": "living_area",
      "label": "Living Area",
      "type": "number",
      "field_type": "number",
      "config": {
        "label": "Living Area",
        "slug": "living_area",
        "external_id": "living_area",
        "description": "Living area of the property.",
        "show_description": true,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "unit_location": "suffix",
          "decimals": 0,
          "unit_label": "m²",
          "unit": "m²"
        }
      }
    },
    {
      "field_id": 3,
      "external_id": "price_per_square_meter",
      "slug": "price_per_square_meter",
      "label": "Price per Square Meter",
      "type": "calculation",
      "field_type": "calculation",
      "config": {
        "label": "Price per Square Meter",
        "slug": "price_per_square_meter",
        "external_id": "price_per_square_meter",
        "description": "Asking price divided by living area.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "decimals": 2,
          "return_type": "number",
          "script": "@[Price](field_1) / @[Living Area](field_2)",
          "script_last_modified_at": null,
          "script_last_modified_at_utc": null,
          "script_last_modified_by_user_id": null,
          "script_created_at": "2026-11-11 10:30:00",
          "script_created_at_utc": "2026-11-11 09:30:00",
          "script_created_by_user_id": 1,
          "unit_location": "suffix",
          "calendar": false,
          "unit": "€/m²",
          "time": "enabled",
          "trigger_webhooks": false,
          "trigger_automations": false
        }
      }
    }
  ]
}
```

**General behavior**

- Tape runs the script with sample values to work out `return_type`. Here, the script returns a number.
- Tape computes the values of the existing records in the background.
- A new calculation field doesn't trigger webhooks or automations. Set `trigger_webhooks` or `trigger_automations` to `true` to change that. In a field update, leaving them out keeps their values.
- An empty script or a script that fails to run doesn't fail the request. Tape saves the field and marks it as invalid.
- A new calculation field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.
- A field with `field_id` updates that field. In a field update, a `script` you leave out stays as it is.
- Send `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](/docs/api/resource/field/overview#create-and-update-fields).
- Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.
- A `return_type` that doesn't match the result of the script returns `400` with the message `inferred result type from script execution does not match provided return type`.
- A script that references fields that don't exist, or calculation fields that reference each other in a loop, returns `400`.

## Next steps

- [Calculation field value](/docs/api/resource/field-value/calculation): read the computed values of a record.
- [Calculation field documentation](https://help.tapeapp.com/en/articles/18449157-calculation-syntax-examples): write scripts, with examples.
- [Editors](https://help.tapeapp.com/en/articles/18449157-calculation-syntax-examples): the calculation editor and its syntax.
- [Field](/docs/api/resource/field/overview): the properties all field types share.
- [App](/docs/api/resource/app#update-an-app): add calculation fields to an app.
- [Capabilities](/docs/api/capabilities): what `apps:edit` allows.
