---
id: status
title: Status Field Value
sidebar_label: Status
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A status field value consists of its `value` property which holds a reference to a status option. A status option has the properties `id` (unique ID), `text` (the label), `color` (hexcolor value) and `means_completed` (whether the status indicates completion). A `status` field value holds at most one status option.

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A status field value can be created as part of a record creation. Here is an example request body for creating a record with a value for the "Onboarding status" field with ID 2, type `status` and external ID `onboarding_status`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "onboarding_status": 1
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "onboarding_status": 1
  }
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "record_id": 1,
  "title": "Not started",
  "fields": [
    {
      "field_id": 2,
      "external_id": "onboarding_status",
      "label": "Onboarding status",
      "type": "status",
      "field_type": "status",
      "values": [
        {
          "value": {
            "id": 1,
            "text": "Not started",
            "color": "DF245E",
            "means_completed": false
          }
        }
      ]
    }
  ]
}
```

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A status field value can be retrieved as part of a record retrieval:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Not started",
  "fields": [
    {
      "field_id": 2,
      "external_id": "onboarding_status",
      "label": "Onboarding status",
      "type": "status",
      "field_type": "status",
      "values": [
        {
          "value": {
            "id": 1,
            "text": "Not started",
            "color": "DF245E",
            "means_completed": false
          }
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more status field values can be updated as part of a record update. Here is an example request body for updating multiple status field values of a record:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "onboarding_status": 2
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "onboarding_status": 2
  }
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Done",
  "fields": [
    {
      "field_id": 2,
      "external_id": "onboarding_status",
      "label": "Onboarding status",
      "type": "status",
      "field_type": "status",
      "values": [
        {
          "value": {
            "id": 2,
            "text": "Done",
            "color": "007959",
            "means_completed": true
          }
        }
      ]
    }
  ]
}
```
