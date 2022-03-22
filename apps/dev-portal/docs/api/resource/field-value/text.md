---
id: text
title: Text Field Value
sidebar_label: Text
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'

A text field value consists of its `value` property of type `string`. The value is plaintext if the type of its corresponding field is `SINGLE_TEXT` and rich-text (HTML) if the field's type is `MULTI_TEXT`.

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A text field value can be created as part of a record creation. Here is an example request body for creating a record with the text field value "Adam Smith" for the "First Name" field with ID 1, type `SINGLE_TEXT` and external ID `first_name` and a value for the "Notes" field with ID 2, type `MULTI_TEXT` and external ID `notes`:

```json title="➡️      Request"
{
  "fields": {
    "first_name": {
      "value": "Adam Smith"
    },
    "notes": {
      "value": "<p>Registered <b>10</b> month ago.</p>"
    }
  }
}
```

```json title="⬅️      Response"
{
  "id": 1,
  "title": "Adam Smith",
  "fields": [
    {
      "field_Id": 1,
      "external_id": "first_name",
      "type": "text",
      "field_type": "SINGLE_TEXT",
      "label": "First Name",
      "values": [{ "value": "Adam Smith" }]
    },
    {
      "field_Id": 2,
      "external_id": "notes",
      "type": "text",
      "field_type": "MULTI_TEXT",
      "label": "Notes",
      "values": [{ "value": "<p>Registered <b>10</b> month ago.</p>" }]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more text field values can be updated as part of a record update. Here is an example request body for updating a record with the text field value "Andrea Lim" for the "First Name" field with ID 1, type `SINGLE_TEXT` and external ID `first_name` and a value for the "Notes" field with ID 2, type `MULTI_TEXT` and external ID `notes`:

```json title="➡️      Request"
{
  "fields": {
    "first_name": {
      "value": "Andrea Lim"
    },
    "notes": {
      "value": "<p>Has <b>not</b> registered yet.</p>"
    }
  }
}
```

```json title="⬅️      Response"
{
  "id": 1,
  "title": "Andrea Lim",
  "fields": [
    {
      "field_Id": 1,
      "external_id": "first_name",
      "type": "text",
      "field_type": "SINGLE_TEXT",
      "label": "First Name",
      "values": [{ "value": "Andrea Lim" }]
    },
    {
      "field_Id": 2,
      "external_id": "notes",
      "type": "text",
      "field_type": "MULTI_TEXT",
      "label": "Notes",
      "values": [{ "value": "<p>Has <b>not</b> registered yet.</p>" }]
    }
  ]
}
```

```

```
