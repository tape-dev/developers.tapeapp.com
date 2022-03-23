---
id: category
title: Category Field Value
sidebar_label: Category
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A category field value consists of its `value` property which holds a reference to a category option. A category option has the properties `id`, `text` and `color`. A `SINGLE_CATEGORY` field value holds at most one category option while a `MULTI_CATEGORY` field value can hold multiple category options.

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A category field value can be created as part of a record creation. Here is an example request body for creating a record with the category field value "Adam Smith" for the "First Name" field with ID 1, type `SINGLE_TEXT` and external ID `first_name` and a value for the "Saluation" field with ID 2, type `SINGLE_CATEGORY` and external ID `salutation`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "first_name": "Adam Smith",
      "salutation": 1
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
    "salutation": 1
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
      "field_id": 2,
      "slug": "salutation",
      "label": "Salutation",
      "type": "category",
      "field_type": "SINGLE_CATEGORY",
      "values": [
        {
          "value": {
            "id": 1,
            "text": "Mr.",
            "color": "RED"
          }
        }
      ]
    }
  ]
}
```

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A category field value can be retrieved as part of a record retrieval:

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
      "field_id": 2,
      "slug": "salutation",
      "label": "Salutation",
      "type": "category",
      "field_type": "SINGLE_CATEGORY",
      "values": [
        {
          "value": {
            "id": 1,
            "text": "Mr.",
            "color": "RED"
          }
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more category field values can be updated as part of a record update. Here is an example request body for updating a record with the category field value "Andrea Lim" for the "First Name" field with ID 1, type `SINGLE_CATEGORY` and external ID `first_name` and a value for the "Notes" field with ID 2, type `MULTI_CATEGORY` and external ID `notes`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "salutation": 2
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "salutation": 2
  }
}
```

</TabItem>
</Tabs>

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
      "field_id": 2,
      "slug": "salutation",
      "label": "Salutation",
      "type": "category",
      "field_type": "SINGLE_CATEGORY",
      "values": [
        {
          "value": {
            "id": 2,
            "text": "Mrs.",
            "color": "BLUE"
          }
        }
      ]
    }
  ]
}
```
