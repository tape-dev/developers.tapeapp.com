---
id: email
title: Email Field Value
sidebar_label: Email
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

An email field value consists of its `value` property which holds one or multiple email address entries. An entry contains the email address itself, plus its type, e.g. `work` or `home`. If no type is provided, email address entries always default to `work`.

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

An email field value can be created as part of a record creation. It is possible to provide either a string, an object following the email address entry structure or an array of those two. It is advised to use an array of objects for the best accuracy of the provided data.

Here is an example request body for creating a record with a value for the "Customer email" field with ID 2, type `multi_email` and external ID `customer_email` :

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "customer_email": 
        [
          {"type": "work", "email": "johndoe@samplebusiness.com"},
          {"type": "home", "email": "john@doe.com"}
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
    "customer_email": [
      { "type": "work", "email": "johndoe@samplebusiness.com" },
      { "type": "home", "email": "john@doe.com" }
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
      "external_id": "customer_email",
      "label": "Customer email",
      "type": "email",
      "field_type": "multi_email",
      "values": [
        {
          "id": 100,
          "value": "johndoe@samplebusiness.com",
          "type": "work"
        },
        {
          "id": 101,
          "value": "john@doe.com",
          "type": "home"
        }
      ]
    }
  ]
}
```

Note that the individual email address entries contain an ID. Be sure to include them in updates, to keep existing email entries. If you omit the ID, new entries will be created instead and the respective existing ones will be removed.

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

An email field value can be retrieved as part of a record retrieval:

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
      "external_id": "customer_email",
      "label": "Customer email",
      "type": "email",
      "field_type": "multi_email",
      "values": [
        {
          "id": 100,
          "value": "johndoe@samplebusiness.com",
          "type": "work"
        },
        {
          "id": 101,
          "value": "john@doe.com",
          "type": "home"
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more email field values can be updated as part of a record update, and individual entries can be updated via their ID. Here is an example request body for updating the email entries of an email field with external ID `customer_email` of a record:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "customer_email": 
      [
        { "id": 100, "type": "work", "email": "johndoeNEW@samplebusiness.com" },
        { "type": "other", "email": "johndoe@gmail.com" }
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
    "customer_email": [
      { "id": 100, "type": "work", "email": "johndoeNEW@samplebusiness.com" },
      { "type": "other", "email": "johndoe@gmail.com" }
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
      "external_id": "customer_email",
      "label": "Customer email",
      "type": "email",
      "field_type": "multi_email",
      "values": [
        {
          "id": 100,
          "value": "johndoeNEW@samplebusiness.com",
          "type": "work"
        },
        {
          "id": 102,
          "value": "johndoe@gmail.com",
          "type": "other"
        }
      ]
    }
  ]
}
```
