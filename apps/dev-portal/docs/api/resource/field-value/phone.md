---
id: phone
title: Phone Field Value
sidebar_label: Phone
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A phone field value consists of its `value` property which holds one or multiple phone number entries. An entry contains the phone number itself, plus its type, e.g. `work` or `home`.

Currently the following values are allowed as type: `work`, `work_fax`, `home`, `home_fax`, `main`, `main_fax`, `mobile`, and `other`. If no type is provided, phone address entries always default to `work`.

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A phone field value can be created as part of a record creation. It is possible to provide either a string, an object following the phone number entry structure or an array of those two. It is advised to use an array of objects for the best accuracy of the provided data.

Here is an example request body for creating a record with a value for the "Customer phone" field with ID 2, type `multi_phone` and external ID `customer_phone` :

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "customer_phone": 
        [
          {"type": "work", "phone": "+1 444 555"},
          {"type": "home", "phone": "+1 777 111"}
        ]
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "customer_phone": [
      { "type": "work", "phone": "+1 444 555" },
      { "type": "home", "phone": "+1 777 111" }
    ]
  }
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "record_id": 1,
  "title": "Tape Technologies GmbH",
  "fields": [
    {
      "field_id": 2,
      "external_id": "customer_phone",
      "label": "Customer phone",
      "type": "phone",
      "field_type": "multi_phone",
      "values": [
        {
          "id": 100,
          "value": "+1 444 555",
          "type": "work"
        },
        {
          "id": 101,
          "value": "+1 777 111",
          "type": "home"
        }
      ]
    }
  ]
}
```

Note that the individual phone number entries contain an ID. Be sure to include them in updates, to keep existing phone entries. If you omit the ID, new entries will be created instead and the respective existing ones will be removed.

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A phone field value can be retrieved as part of a record retrieval:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Tape Technologies GmbH",
  "fields": [
    {
      "field_id": 2,
      "external_id": "customer_phone",
      "label": "Customer phone",
      "type": "phone",
      "field_type": "multi_phone",
      "values": [
        {
          "id": 100,
          "value": "+1 444 555",
          "type": "work"
        },
        {
          "id": 101,
          "value": "+1 777 111",
          "type": "home"
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more phone field values can be updated as part of a record update, and individual entries can be updated via their ID. Here is an example request body for updating the phone entries of a phone field with external ID `customer_phone` of a record:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "customer_phone": 
      [
        { "id": 100, "type": "work", "phone": "+1 444 333" },
        { "type": "other", "phone": "+1 888 888" }
      ]
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "customer_phone": [
      { "id": 100, "type": "work", "phone": "+1 444 333" },
      { "type": "other", "phone": "+1 888 888" }
    ]
  }
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Tape Technologies GmbH",
  "fields": [
    {
      "field_id": 2,
      "external_id": "customer_phone",
      "label": "Customer phone",
      "type": "phone",
      "field_type": "multi_phone",
      "values": [
        {
          "id": 100,
          "value": "+1 444 333",
          "type": "work"
        },
        {
          "id": 102,
          "value": "+1 888 888",
          "type": "other"
        }
      ]
    }
  ]
}
```
