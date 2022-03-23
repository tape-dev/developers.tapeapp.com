---
id: text
title: Text Field Value
sidebar_label: Text
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A text field value consists of its `value` property of type `string`. The value is plaintext if the type of its corresponding field is `SINGLE_TEXT` and rich-text (HTML) if the field's type is `MULTI_TEXT`.

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A text field value can be created as part of a record creation. Here is an example request body for creating a record with the text field value "Adam Smith" for the "First Name" field with ID 1, type `SINGLE_TEXT` and external ID `first_name` and a value for the "Notes" field with ID 2, type `MULTI_TEXT` and external ID `notes`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "first_name": "Adam Smith",
      "notes": "<p>Registered <b>10</b> month ago.</p>"
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "first_name": "Adam Smith",
    "notes": "<p>Registered <b>10</b> month ago.</p>"
  }
}
```

</TabItem>
</Tabs>

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

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A text field value can be retrieved as part of a record retrieval:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
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

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "first_name": "Andrea Lim",
      "notes": "<p>Has <b>not</b> registered yet.</p>"
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "first_name": "Andrea Lim",
    "notes": "<p>Has <b>not</b> registered yet.</p>"
  }
}
```

</TabItem>
</Tabs>

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
