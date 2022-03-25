---
id: relation
title: Relation Field Value
sidebar_label: Relation
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A relation field value consists of its `value` property which holds a reference to another record. A relation to another record has the properties `record_id` (unique record ID), `app_id` (unique ID of the record's app), `title` (title of the record) and others.
A `single_relation` field value holds at most one record reference while a `multi_relation` field value can hold multiple record references.

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A relation field value can be created as part of a record creation. Here is an example request body for creating a record with a value for the "Belongs to Company" field with ID 2, type `single_relation` and external ID `belongs_to_company` and a value for the "Tasks assigned" field with ID 3, type `multi_relation` and external ID `tasks_assigned`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "belongs_to_company": 100,
      "tasks_assigned": [110, 111]
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "belongs_to_company": 100,
    "tasks_assigned": [110, 111]
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
      "external_id": "belongs_to_company",
      "label": "Belongs to Company",
      "type": "relation",
      "field_type": "single_relation",
      "values": [
        {
          "value": {
            "record_id": 100,
            "app_id": 7,
            "title": "Tape Technologies GmbH"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "tasks_assigned",
      "label": "Tasks assigned",
      "field_type": "multi_relation",
      "type": "relation",
      "values": [
        {
          "value": {
            "record_id": 110,
            "app_id": 8,
            "title": "Complete onboarding"
          }
        },
        {
          "value": {
            "record_id": 111,
            "app_id": 8,
            "title": "Fill out compliance documents"
          }
        }
      ]
    }
  ]
}
```

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A relation field value can be retrieved as part of a record retrieval:

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
      "external_id": "belongs_to_company",
      "label": "Belongs to Company",
      "type": "relation",
      "field_type": "single_relation",
      "values": [
        {
          "value": {
            "record_id": 100,
            "app_id": 7,
            "title": "Tape Technologies GmbH"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "tasks_assigned",
      "label": "Tasks assigned",
      "field_type": "multi_relation",
      "type": "relation",
      "values": [
        {
          "value": {
            "record_id": 110,
            "app_id": 8,
            "title": "Complete onboarding"
          }
        },
        {
          "value": {
            "record_id": 111,
            "app_id": 8,
            "title": "Fill out compliance documents"
          }
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more relation field values can be updated as part of a record update. Here is an example request body for updating multiple relation field values of a record:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "belongs_to_company": 101,
      "tasks_assigned": [111]
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "belongs_to_company": 101,
    "tasks_assigned": [111]
  }
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Delaney Beatty",
  "fields": [
    {
      "field_id": 2,
      "external_id": "belongs_to_company",
      "label": "Belongs to Company",
      "type": "relation",
      "field_type": "single_relation",
      "values": [
        {
          "value": {
            "record_id": 101,
            "app_id": 7,
            "title": "Microsoft Corporation"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "tasks_assigned",
      "label": "Tasks assigned",
      "field_type": "multi_relation",
      "type": "relation",
      "values": [
        {
          "value": {
            "record_id": 111,
            "app_id": 8,
            "title": "Fill out compliance documents"
          }
        }
      ]
    }
  ]
}
```
