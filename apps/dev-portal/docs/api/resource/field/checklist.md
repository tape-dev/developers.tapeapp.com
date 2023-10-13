---
id: checklist
title: Checklist Field
sidebar_label: Checklist
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There is only type of checklist fields: `checklist`.

`checklist` field-values can only hold one or more checklist entries.

In addition to the common field properties, a checklist field has the following settings:

- `show_in_focus` (optional): boolean flag, whether the checklist entries of this field are shown in a users focus section. For further information on the Focus feature, please refer to https://help.tapeapp.com/en/articles/6394049-focus

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A checklist field can be created as part of an App creation. Here is an example request body for creating an excerpt for a tasks app within a workspace with ID 1.
The app contains a `checklist` field "Subtasks". Other useful fields for a tasks app, like "Title", "Description" or "Due date" are omitted for brevity.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X POST #BASE_URL/v1/app/ \\
   -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \\
   --data '{
    "workspace_id": 1,
    "name": "Tasks",
    "item_name": "Task",
    "fields": [
      {
        "field_type": "checklist",
        "config": {
          "label": "Subtasks",
          "description": "Subtasks of the task.",
          "required": false,
          "settings": {
            "show_in_focus": true
          }
        }
      }
    ] 
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "workspace_id": 1,
  "name": "Tasks",
  "item_name": "Task",
  "fields": [
    {
      "field_type": "checklist",
      "config": {
        "label": "Subtasks",
        "description": "Subtasks of the task.",
        "required": false,
        "settings": {
          "show_in_focus": true
        }
      }
    }
  ]
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "tasks",
  "name": "Tasks",
  "record_name": "Task",
  "item_name": "Task",
  "position": 0,
  "config": {
    "item_name": "Task",
    "name": "Tasks"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "subtasks",
      "label": "Subtasks",
      "field_type": "checklist",
      "type": "checklist",
      "config": {
        "label": "Subtasks",
        "slug": "subtasks",
        "description": "Subtasks of the task.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "show_in_focus": true
        }
      }
    }
  ]
}
```

## App update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

A checklist field can be created or updated as part of an App update. Here is an example request body for updating the previously created tasks app with ID 1.
The update sets the `show_in_focus` flag to false, so that checklist entries of the fields values do not show up in the assignee-users focus.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
  -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \
   --data '{
    "app_id": 1,
    "name": "Tasks",
    "item_name": "Task",
    "fields": [
       {
        "field_id": 1,
        "config": {
          "label": "Subtasks",
          "description": "Subtasks of the task.",
          "required": false,
          "settings": {
            "show_in_focus": true
          }
        }
      }
    ] 
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "app_id": 1,
  "name": "Tasks",
  "item_name": "Task",
  "fields": [
    {
      "field_id": 1,
      "config": {
        "label": "Subtasks",
        "description": "Subtasks of the task.",
        "required": false,
        "settings": {
          "show_in_focus": true
        }
      }
    }
  ]
}
```

</TabItem>
</Tabs>

````json title="⬅️      Response"
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "tasks",
  "name": "Tasks",
  "item_name": "Task",
  "position": 0,
  "config": {
    "item_name": "Task",
    "name": "Tasks"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "subtasks",
      "label": "Subtasks",
      "field_type": "checklist",
      "type": "checklist",
      "config": {
        "label": "Subtasks",
        "slug": "subtasks",
        "description": "Subtasks of the task.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "show_in_focus": true
        }
      }
    }
  ]
}```

````
