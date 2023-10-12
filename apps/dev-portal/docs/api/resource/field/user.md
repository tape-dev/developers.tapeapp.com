---
id: user
title: User Field
sidebar_label: User
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A user field value consists of its `value` property which holds a reference to a user. A user has the properties `user_id` (unique ID), `name` (the username), `org_Id` (ID of the user's organization) and others.
A `single_user` field value holds at most one user reference while a `multi_user` field value can hold multiple user references.

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A user field value can be created as part of a record creation. Here is an example request body for creating a record with a value for the "Supervisor" field with ID 2, type `single_user` and external ID `supervisor` and a value for the "Interviewed by" field with ID 3, type `multi_user` and external ID `interviewed_by`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "supervisor": 1,
      "interviewed_by": [4, 5]
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "supervisor": 1,
    "interviewed_by": [4, 5]
  }
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "record_id": 1,
  "title": "Zoe Maxwell",
  "fields": [
    {
      "field_id": 2,
      "external_id": "supervisor",
      "label": "Supervisor",
      "type": "user",
      "field_type": "single_user",
      "values": [
        {
          "value": {
            "user_id": 1,
            "mail": ["zoe@tapeapp.com"],
            "image": null,
            "name": "Zoe Maxwell",
            "org_id": 1,
            "type": "user"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "interviewed_by",
      "label": "Interviewed by",
      "field_type": "multi_user",
      "type": "user",
      "values": [
        {
          "value": {
            "user_id": 4,
            "mail": ["dan@tapeapp.com"],
            "image": null,
            "name": "Dan Jacob",
            "org_id": 1,
            "type": "user"
          }
        },
        {
          "value": {
            "user_id": 5,
            "mail": ["sierra@tapeapp.com"],
            "image": null,
            "name": "Sierra Johns",
            "org_id": 1,
            "type": "user"
          }
        }
      ]
    }
  ]
}
```

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A user field value can be retrieved as part of a record retrieval:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Zoe Maxwell",
  "fields": [
    {
      "field_id": 2,
      "external_id": "supervisor",
      "label": "Supervisor",
      "type": "user",
      "field_type": "single_user",
      "values": [
        {
          "value": {
            "user_id": 1,
            "mail": ["zoe@tapeapp.com"],
            "image": null,
            "name": "Zoe Maxwell",
            "org_id": 1,
            "type": "user"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "interviewed_by",
      "label": "Interviewed by",
      "field_type": "multi_user",
      "type": "user",
      "values": [
        {
          "value": {
            "user_id": 4,
            "mail": ["dan@tapeapp.com"],
            "image": null,
            "name": "Dan Jacob",
            "org_id": 1,
            "type": "user"
          }
        },
        {
          "value": {
            "user_id": 5,
            "mail": ["sierra@tapeapp.com"],
            "image": null,
            "name": "Sierra Johns",
            "org_id": 1,
            "type": "user"
          }
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more user field values can be updated as part of a record update. Here is an example request body for updating multiple user field values of a record:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "supervisor": 2,
      "interviewed_by": [5]
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "supervisor": 2,
    "interviewed_by": [5]
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
      "external_id": "supervisor",
      "label": "Supervisor",
      "type": "user",
      "field_type": "single_user",
      "values": [
        {
          "value": {
            "user_id": 2,
            "mail": ["delaney@tapeapp.com"],
            "image": null,
            "name": "Delaney Beatty",
            "org_id": 1,
            "type": "user"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "interviewed_by",
      "label": "Interviewed by",
      "field_type": "multi_user",
      "type": "user",
      "values": [
        {
          "value": {
            "user_id": 5,
            "mail": ["sierra@tapeapp.com"],
            "image": null,
            "name": "Sierra Johns",
            "org_id": 1,
            "type": "user"
          }
        }
      ]
    }
  ]
}
```
