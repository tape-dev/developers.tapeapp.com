---
id: number
title: Number Field Value
sidebar_label: Number
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A number field value consists of its `value` property of type `number`. The value is a decimal like 1, 1.0 or 1.5. A `number` field value holds at most one value.

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A number field value can be created as part of a record creation. Here is an example request body for creating a record with a value for the "Salary" field with ID 2, type `number` and external ID `salary`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "salary": 2000
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "salary": 2000
  }
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "record_id": 1,
  "title": "2000$",
  "fields": [
    {
      "field_Id": 2,
      "external_id": "salary",
      "type": "number",
      "field_type": "number",
      "label": "Salary",
      "values": [{ "value": 2000 }]
    }
  ]
}
```

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A number field value can be retrieved as part of a record retrieval:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "2000$",
  "fields": [
    {
      "field_Id": 2,
      "external_id": "salary",
      "type": "number",
      "field_type": "number",
      "label": "Salary",
      "values": [{ "value": 2000 }]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more number field values can be updated as part of a record update. Here is an example request body for updating a record with a value for the "Salary" field with ID 2, type `number` and external ID `salary`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "salary": 4000
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "salary": 4000
  }
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "record_id": 1,
  "title": "4000$",
  "fields": [
    {
      "field_Id": 2,
      "external_id": "salary",
      "type": "number",
      "field_type": "number",
      "label": "Salary",
      "values": [{ "value": 4000 }]
    }
  ]
}
```
