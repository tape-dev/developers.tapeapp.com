---
id: checklist
title: Checklist Field Value
sidebar_label: Checklist
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A checklist field value consists of its `value` property which holds one or multiple checklist entries. An entry contains a `title` a `description`, an `assignee`, and a `due_at` property. It further includes a boolean `completed` status indicating whether that individual entry has been completed.

`due_at` will be a date or datetime, depending on the data. More details on date and datetime strings can be found [here](/docs/api/date-timezone).

The `assignee` has to be a user inside the same organization. Use the `user_id` as `assignee` when updating or creating entries.

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A checklist field value can be created as part of a record creation. It is possible to provide either a string, a checklist entry object or an array of those two. It is advised to use an array of objects for the best accuracy of the provided data.

Here is an example request body for creating a record with a value for the "Subtasks" field with ID 2, type `checklist` and external ID `subtasks` :

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "subtasks": 
        [
            {
                "title": "Clean the kitchen",
                "description": "Please do not forget the sink.",
                "due": "2022-03-15"
            },
            {
                "title": "Tidy up the living room",
                "due": "2022-03-15 15:00"
            }
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
    "subtasks": [
      {
        "title": "Clean the kitchen",
        "description": "Please do not forget the sink.",
        "due": "2022-03-15",
        "assignee": 600
      },
      {
        "title": "Tidy up the living room",
        "due": "2022-03-15 15:00"
      }
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
      "external_id": "subtasks",
      "label": "Subtasks",
      "type": "checklist",
      "field_type": "checklist",
      "values": [
        {
          "id": 300,
          "title": "Clean the kitchen",
          "description": "Please do not forget the sink.",
          "due": "2022-03-15",
          "completed": false,
          "completed_at": null,
          "assignee": {
            "user_id": 600,
            "mail": ["dan@tapeapp.com"],
            "image": null,
            "name": "Dan Jacob",
            "org_id": 1,
            "type": "user"
          }
        },
        {
          "id": 301,
          "title": "Tidy up the living room",
          "description": "",
          "due": "2022-03-15 15:00",
          "completed": false,
          "completed_at": null,
          "assignee": null
        }
      ]
    }
  ]
}
```

Note that the individual checklist entries contain an ID. Be sure to include them in updates, to keep existing checklist entries and to update them. If you omit the ID, new entries will be created instead and the respective existing ones will be removed.

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A checklist field value can be retrieved as part of a record retrieval:

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
      "external_id": "subtasks",
      "label": "Subtasks",
      "type": "checklist",
      "field_type": "checklist",
      "values": [
        {
          "id": 300,
          "title": "Clean the kitchen",
          "description": "Please do not forget the sink.",
          "due": "2022-03-15",
          "completed": false,
          "completed_at": null,
          "assignee": {
            "user_id": 600,
            "mail": ["dan@tapeapp.com"],
            "image": null,
            "name": "Dan Jacob",
            "org_id": 1,
            "type": "user"
          }
        },
        {
          "id": 301,
          "title": "Tidy up the living room",
          "description": "",
          "due": "2022-03-15 15:00",
          "completed": false,
          "completed_at": null,
          "assigne": null
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more checklist field values can be updated as part of a record update, and individual entries can be updated via their ID. Here is an example request body for updating the entries of a checklist field with external ID `subtasks` of a record, reassigning the first entry to another user and marking the second as completed:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "subtasks": 
      [
        {
          "id": 300,
          "title": "Clean the kitchen",
          "description": "Please do not forget the sink.",
          "due": "2022-03-15",
          "completed": false,
          "assignee": 601
        },
        {
          "id": 301,
          "title": "Tidy up the living room",
          "description": "",
          "due": "2022-03-15 15:00",
          "completed": true
        }
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
    "subtasks": [
      {
        "id": 300,
        "title": "Clean the kitchen",
        "description": "Please do not forget the sink.",
        "due": "2022-03-15",
        "completed": false,
        "assignee": 601
      },
      {
        "id": 301,
        "title": "Tidy up the living room",
        "description": "",
        "due": "2022-03-15 15:00",
        "completed": true
      }
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
      "external_id": "subtasks",
      "label": "Subtasks",
      "type": "checklist",
      "field_type": "checklist",
      "values": [
        {
          "id": 300,
          "title": "Clean the kitchen",
          "description": "Please do not forget the sink.",
          "due": "2022-03-15",
          "completed": false,
          "completed_at": null,
          "assignee": {
            "user_id": 601,
            "mail": ["luke@tapeapp.com"],
            "image": null,
            "name": "Luke Walker",
            "org_id": 1,
            "type": "user"
          }
        },
        {
          "id": 301,
          "title": "Tidy up the living room",
          "description": "",
          "due": "2022-03-15 15:00",
          "completed": true,
          "completed_at": "2022-03-15 14:55",
          "assigne": null
        }
      ]
    }
  ]
}
```
