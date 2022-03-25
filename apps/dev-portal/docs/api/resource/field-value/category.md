---
id: category
title: Category Field Value
sidebar_label: Category
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A category field value consists of its `value` property which holds a reference to a category option. A category option has the properties `id` (unique ID), `text` (the label) and `color` (hexcolor value). A `SINGLE_CATEGORY` field value holds at most one category option while a `MULTI_CATEGORY` field value can hold multiple category options.

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A category field value can be created as part of a record creation. Here is an example request body for creating a record with a value for the "Salutation" field with ID 2, type `SINGLE_CATEGORY` and external ID `salutation` and a value for the "Tags" field with ID 3, type `MULTI_CATEGORY` and external ID `tags`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "salutation": 1,
      "tags": [4, 5]
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "salutation": 1,
    "tags": [4, 5]
  }
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "record_id": 1,
  "title": "Mr.",
  "fields": [
    {
      "field_id": 2,
      "external_id": "salutation",
      "label": "Salutation",
      "type": "category",
      "field_type": "SINGLE_CATEGORY",
      "values": [
        {
          "value": {
            "id": 1,
            "text": "Mr.",
            "color": "CDCCC9"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "tags",
      "label": "Tags",
      "field_type": "MULTI_CATEGORY",
      "type": "category",
      "values": [
        {
          "value": {
            "id": 4,
            "color": "CDCCC9",
            "text": "Interview outstanding"
          }
        },
        {
          "value": {
            "id": 5,
            "color": "6E7174",
            "text": "Missing contact details"
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
  "record_id": 1,
  "title": "Mr.",
  "fields": [
    {
      "field_id": 2,
      "external_id": "salutation",
      "label": "Salutation",
      "type": "category",
      "field_type": "SINGLE_CATEGORY",
      "values": [
        {
          "value": {
            "id": 1,
            "text": "Mr.",
            "color": "CDCCC9"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "tags",
      "label": "Tags",
      "field_type": "MULTI_CATEGORY",
      "type": "category",
      "values": [
        {
          "value": {
            "id": 4,
            "color": "CDCCC9",
            "text": "Interview outstanding"
          }
        },
        {
          "value": {
            "id": 5,
            "color": "6E7174",
            "text": "Missing contact details"
          }
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more category field values can be updated as part of a record update. Here is an example request body for updating multiple category field values of a record:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "salutation": 2,
      "tags": [5]
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "salutation": 2,
    "tags": [5]
  }
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Mrs.",
  "fields": [
    {
      "field_id": 2,
      "external_id": "salutation",
      "label": "Salutation",
      "type": "category",
      "field_type": "SINGLE_CATEGORY",
      "values": [
        {
          "value": {
            "id": 2,
            "text": "Mrs.",
            "color": "DC0080"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "tags",
      "label": "Tags",
      "field_type": "MULTI_CATEGORY",
      "type": "category",
      "values": [
        {
          "value": {
            "id": 5,
            "color": "6E7174",
            "text": "Missing contact details"
          }
        }
      ]
    }
  ]
}
```
