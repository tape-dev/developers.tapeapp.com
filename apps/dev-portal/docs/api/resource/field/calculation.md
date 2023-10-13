---
id: calculation
title: Calculation Field
sidebar_label: Calculation
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

## What is a Calculation field?

Calculation fields are a special field type within Tape that are calculate values based on other fields of a record, or related records.
To calculate values, a calculation field has a property `script` with javascript code that is executed whenever a record is created or updated.
More information on how to use the calculation field can be found in the [Calculation field documentation](/docs/calculation/introduction).

The key difference in developing scripts for the `calculation` field in the script editor of the web-application and doing so via the API lies in how fields are referenced.

## Properties

In addition to the common field properties, a calculation field definition has a `settings` property containing the following properties:

- `script`: The script that is executed to calculate the value of the field. The script is a string containing javascript code and at least one field reference (see below).
- `decimals` (optional): The number of decimals of the calculated value. Only applicable if the return type is "number".
- `unit` (optional): The unit of the calculated value. Only applicable if the return type is "number".
- `unit_location` (optional): The location of the unit of the calculated value. Can be one of ["prefix", "suffix"]. Only applicable if the return type is "number".
- `calendar` (optional): Boolean flag wether the records of the field-values should be displayed in the calendar sidebar and included to the iCal export. Only applicable if the return type is "date".
- `time` (optional): The time of the calculated value. Can be one of ["start", "end"]. Only applicable if the return type is "date".

## Writing Scripts for Calculation fields via the API

### Referencing fields of the same app as the calculation field

To reference a field of the same app as the calculation field, you can use the following scheme:

```
@[*Field name*](field_*field ID*)
```

A field reference starts with an `@` symbol followed by the fields name enclosed in square brackets and the field id prefixed with `field_` and enclosed in parentheses.

An example of referencing a `single_text` field named "Title" with ID 123 would be:

```
@[Title](field_123)
```

### Referencing fields of a different app than the calculation field via an outgoing relation field

In case the app of the calculation field has a `single_relation` or `multi_relation` field that references another app, you can reference fields of the referenced app in the following ways

#### Referencing a single field of all related records

To reference the set of all field-values for a given field over all related records you can use the following scheme:

```
@[All of Title](out_*field ID*_*relation field ID*)
```

This scheme starts with an `@` symbol followed by the string `All of` and the name of the referenced app enclosed in square brackets.
The name of the referenced app is followed by the prefix `out_` and the field id of the relation field that references the app.
The field id of the relation field is followed by an underscore and the field id of the relation field itself.

This is the equivalend of using the `[] All of Title` token in the script editor of the web-application, and includes all field values for field with ID 123 of the records that are referenced by the relation field.
In case a record has no value for a field, the record is ignored.

#### Referencing a single field of all related records with nulls

To reference the set of all field-values for a given field over all **related** records you can use the following scheme:

```
@[All of Title with nulls](outn_*field ID*_*relation field ID*)
```

An example of using this scheme to reference all field-values of the title field with ID 123 via the relation field with ID 654 would be:

```
@[All of Title with nulls](outn_123_654)
```

This is the equivalend of using the `[] All of Title with nulls` token in the script editor of the web-application, and includes all field values for field with ID 1 of the records that are referenced by the relation field.
In case a record has no value for a field, the record is included with a null value for the field.

#### Referencing a single field of all relating records (incoming relations from relation fields that reference the app of the calculation field)

To reference the set of all field-values for a given field over all **relating** records you can use the following scheme:

```
@[All of Title](in_*field ID*_*relation field ID*)
```

An example of using this scheme to reference all field-values of the title field with ID 123 via the relation field with ID 654 would be:

```
@[All of Title](in_123_654)
```

This is the equivalend of using the `[] All of Title` token in the script editor of the web-application, and includes all field values for field with ID 1 of the records that are referenced by the relation field.
In case a record has no value for a field, the record is ignored.

#### Referencing a single field of all relating records with nulls (incoming relations from relation fields that reference the app of the calculation field)

To reference the set of all field-values for a given field over all **relating** records you can use the following scheme:

```
@[All of Title with nulls](inn_*field ID*_*relation field ID*)
```

An example of using this scheme to reference all field-values of the title field with ID 123 via the relation field with ID 654 would be:

```
@[All of Title with nulls](inn_123_654)
```

This is the equivalend of using the `[] All of Title with nulls` token in the script editor of the web-application, and includes all field values for field with ID 1 of the records that are referenced by the relation field.
In case a record has no value for a field, the record is included with a null value for the field.

#### Referencing a number field of all related records (incoming or outgoing)

In the previous examples we referenced a single field of all related records. During script execution, this reference would be replaced by an array of all field values of the referenced field.
For number fields, you can also reference the sum, average, minimum or maximum of all field values of the referenced field.

To reference the sum of all field-values for a given field over all related records you can use the following scheme:

```
@[Sum of Number](out_sum_*field ID*_*relation field ID*) // Relations that go from the app of the calculation field to a different app
@[Sum of Number](in*sum*_field ID*_*relation field ID*) // Relations that go from a different app to the app of the calculation field
```

To reference the average of all field-values for a given field over all related records you can use the following scheme:

```
@[Average of Number](out_avg_*field ID*_*relation field ID*) // Relations that go from the app of the calculation field to a different app
@[Average of Number](in_avg_*field ID*_*relation field ID*) // Relations that go from a different app to the app of the calculation field
```

To reference the minimum of all field-values for a given field over all related records you can use the following scheme:

```
@[Minimum of Number](out_min_*field ID*_*relation field ID*) // Relations that go from the app of the calculation field to a different app
@[Minimum of Number](in_min_*field ID*_*relation field ID*) // Relations that go from a different app to the app of the calculation field
```

To reference the maximum of all field-values for a given field over all related records you can use the following scheme:

```
@[Maximum of Number](out_max_*field ID*_*relation field ID*) // Relations that go from the app of the calculation field to a different app
@[Maximum of Number](in_max_*field ID*_*relation field ID*) // Relations that go from a different app to the app of the calculation field
```

## App creation

`calculation` fields cannot be created upon app creation. They can only be created or updated as part of an App update.

## App update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

A calculation field can be created or updated as part of an App update. Here is an example request body of updating an existing contacts app with ID 1.
The contacts app has two fields, a `single_text` field "First Name" with ID 1 and a `single_text` field "Last Name" with ID 2.
The update adds a calculation field "Full Name" that concatenates the values of the "First Name" and "Last Name" fields.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
   -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \\
   --data '{
    "app_id": 1,
    "fields": [
      {
        "field_id": 1,
        "config": {
          "label": "First Name",
          "settings": {
            "description": "The first name of the contact.",
            "required": true
          }
        }
      },
      {
        "field_id": 2,
        "config": {
          "label": "Last Name",
          "settings": {
            "description": "The last name of the contact.",
            "required": true
          }
        }
      },
      {
        "field_type": "calculation",
        "config": {
          "label": "Full Name",
          "settings": {
            "description": "The full name of the contact.",
            "script": "@[First Name](field_1) +\" \"+ @[Last Name](field_2)"
          }
        }
      }
    ]
}'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "app_id": 1,
  "fields": [
    {
      "field_id": 1,
      "config": {
        "label": "First Name",
        "settings": {
          "description": "The first name of the contact.",
          "required": true
        }
      }
    },
    {
      "field_id": 2,
      "config": {
        "label": "Last Name",
        "settings": {
          "description": "The last name of the contact.",
          "required": true
        }
      }
    },
    {
      "field_type": "calculation",
      "config": {
        "label": "Full Name",
        "settings": {
          "description": "The full name of the contact.",
          "script": "@[First Name](field_1) +\" \"+ @[Last Name](field_2)"
        }
      }
    }
  ]
}
```

</TabItem>
</Tabs>

````json title="⬅️      Response"
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "meetings",
  "name": "Meetings",
  "item_name": "Meeting",
  "position": 0,
  "config": {
    "item_name": "Meeting",
    "name": "Meetings"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "first_name",
      "label": "First Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "First Name",
        "slug": "first_name",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "formatted": false
        }
      }
    },
    {
      "field_id": 2,
      "slug": "last_name",
      "label": "Last Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Last Name",
        "slug": "last_name",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "formatted": false
        }
      }
    },
    {
      "field_id": 3,
      "slug": "full_name",
      "label": "Full Name",
      "type": "calculation",
      "field_type": "calculation",
      "config": {
        "label": "Full Name",
        "slug": "full_name",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "decimals": 0,
          "return_type": "text",
          "script": "@[First Name](field_1) +\" \"+ @[Last Name](field_2)",
          "calendar": false,
          "unit": null,
          "time": "enabled"
        }
      }
    }
  ]
}
```

````
