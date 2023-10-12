---
id: app
title: App
sidebar_label: App
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

## Retrieve apps for a workspace

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/app/workspace/{workspaceId}" />

Retrieve all apps for the workspace with ID `200` (Note that the response does not contain the fields):

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/app/workspace/200 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 2,
  "apps": [
    {
      "app_id": 1,
      "workspace_id": 200,
      "name": "Tasks",
      "slug": "tasks",
      "config": {
        "item_name": "Task",
        "name": "Tasks",
        "description": ""
      }
    },
    {
      "app_id": 2,
      "workspace_id": 200,
      "name": "Projects",
      "slug": "projects",
      "config": { 
        "item_name": "Project",
        "name": "Projects",
        "description": ""
      }
    }
]
}`}
</ContextCodeBlock>

## Retrieve all available apps

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/app/workspace/{workspaceId}" />

Retrieve all apps inside the workspaces that you have access to (Note that the response does not contain the fields):

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/app \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 3,
  "apps": [
    {
      "app_id": 1,
      "workspace_id": 200,
      "name": "Tasks",
      "slug": "tasks",
      "config": {
        "item_name": "Task",
        "name": "Tasks",
        "description": ""
      }
    },
    {
      "app_id": 2,
      "workspace_id": 200,
      "name": "Projects",
      "slug": "projects",
      "config": { 
        "item_name": "Project",
        "name": "Projects",
        "description": ""
      },
    },
    {
    "app_id": 3,
    "workspace_id": 300,
    "name": "Contacts",
    "slug": "contacts",
    "config": { 
      "item_name": "Contact",
      "name": "Contacts",
      "description": ""
    }
  }
]
}`}
</ContextCodeBlock>

## Retrieve a single app

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/app/{appId}" />

Retrieve an app with fields by its ID `1`:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/app/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`
  {
    "app_id": 1,
    "workspace_id": 200,
    "name": "Tasks",
    "slug": "tasks",
    "config": {
      "item_name": "Task",
      "name": "Tasks",
      "description": ""
    },
    "fields": [
      {
        "field_id": 1,
        "external_id": "full_name",
        "label": "Full Name",
        "type": "text",
        "field_type": "single_text",
        "config": {
          "description": null,
          "required": false,
          "label": "FST",
          "settings": {
            "format": "plain",
            "size": "small"
          }
        },
      }
    ]
  }
`}
</ContextCodeBlock>

## Create an App

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

Create a new app within a workspace. The request body contains the following fields:

- workspace_id: The ID of the workspace to create the app in. The requesting user needs to have permission to "create and edit" apps in this workspace.
- name (required): Name of the app.
- item_name (required): Name of the records within the app.
- description (optional): Description of the app.
- fields (optional): An array of fields to create with the app. See the [field documentation](/docs/api/resource/field) for more information. The provided fields will be created with the same order as provided in the array.
- icon (optional): Icon of the app. See the [icon documentation](/docs/api/resource/icon) (coming soon) for more information.
- item_icon (optional): Icon of the records within the app. See the [icon documentation](/docs/api/resource/icon) (coming soon) for more information.

Here is an example request body for creating a contacts app within a workspace with ID 1.
The app contains a `single_text` field "Name", and a `multi_text` field "Notes"

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X POST #BASE_URL/v1/app/ \\
   -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \\
   --data '{
    "workspace_id": 1,
    "name": "Contacts",
    "item_name": "Contact",
    "description": "A simple contact app.",
    "icon": {
      "id": "person",
      "type": "graphic"
    },
    "item_icon": {
      "emoji": "🧑",
      "type": "emoji"
    },
    "fields": [
      {
        "field_type": "single_text",
        "config": {
          "label": "Name",
          "description": "The full name of the contact.",
          "required": true
        }
      },
      {
        "field_type": "multi_text",
        "config": {
          "label": "Notes",
          "description": "Notes about the contact.",
          "required": false
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
  "name": "Contacts",
  "item_name": "Contact",
  "description": "A simple contact app.",
  "icon": {
    "id": "person",
    "type": "graphic"
  },
  "item_icon": {
    "emoji": "🧑",
    "type": "emoji"
  },
  "fields": [
    {
      "field_type": "single_text",
      "config": {
        "label": "Name",
        "description": "The full name of the contact.",
        "required": true
      }
    },
    {
      "field_type": "multi_text",
      "config": {
        "label": "Notes",
        "description": "Notes about the contact.",
        "required": false
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
  "slug": "contacts",
  "external_id": "contacts",
  "name": "Contacts",
  "record_name": "Contact",
  "item_name": "Contact",
  "description": "A simple contact app.",
  "position": 0,
  "config": {
    "description": "A simple contact app.",
    "item_name": "Contact",
    "name": "Contacts",
    "icon": {
      "type": "graphic",
      "id": "person"
    },
    "item_icon": {
      "emoji": "🧑",
      "type": "emoji"
    }
  },
  "fields": [
    {
      "field_id": 10,
      "external_id": "name",
      "slug": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Name",
        "slug": "name",
        "external_id": "name",
        "delta": "O1",
        "position": "O1",
        "description": "The full name of the contact.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "formatted": false
        }
      }
    },
    {
      "field_id": 20,
      "external_id": "notes",
      "slug": "notes",
      "label": "Notes",
      "type": "text",
      "field_type": "multi_text",
      "config": {
        "label": "Notes",
        "slug": "notes",
        "external_id": "notes",
        "delta": "f{",
        "position": "f{",
        "description": "Notes about the contact.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "formatted": true
        }
      }
    }
  ]
}
```

## Update an App

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

Update an existing app. The request body contains the following fields:

- name (optional): Name of the app.
- item_name (optional): Name of the records within the app.
- description (optional): Description of the app.
- fields (optional): An array of fields to create with the app. See the [field documentation](/docs/api/resource/field) for more information. The provided fields will be created with the same order as provided in the array.
- fields_to_delete (optional): An array of fields to delete within the request. Existing elements from the fields property can be added to this array to delete them. The field_id of the field to delete needs to be provided.
- icon (optional): Icon of the app. See the [icon documentation](/docs/api/resource/icon) (coming soon) for more information.
- item_icon (optional): Icon of the records within the app. See the [icon documentation](/docs/api/resource/icon) (coming soon) for more information.

Here is an example request body for updating the previously created contacts app.

The request removes the "Name" field and adds a new `single_text` field "First Name" and a `single_text` field "Last Name".
The Notes field is neither provided within the fields array nor the fields_to_delete array, so it will not be changed.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
   -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \\
   --data '{
    "fields": [
      {
        "field_type": "single_text",
        "config": {
          "label": "First Name",
          "description": "The first name of the contact.",
          "required": true
        }
      },
      {
        "field_type": "single_text",
        "config": {
          "label": "Last Name",
          "description": "The last name of the contact.",
          "required": true
        }
      }
    ], 
    "fields_to_delete": [
      {
        "field_id": 10
      }
    ]
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": [
    {
      "field_type": "single_text",
      "config": {
        "label": "First Name",
        "description": "The first name of the contact.",
        "required": true
      }
    },
    {
      "field_type": "single_text",
      "config": {
        "label": "Last Name",
        "description": "The last name of the contact.",
        "required": true
      }
    }
  ],
  "fields_to_delete": [
    {
      "field_id": 10
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
  "slug": "contacts",
  "name": "Contacts",
  "item_name": "Contact",
  "description": "A simple contact app.",
  "position": 0,
  "config": {
    "description": "A simple contact app.",
    "item_name": "Contact",
    "name": "Contacts",
    "icon": {
      "type": "graphic",
      "id": "person"
    }
  },
  "fields": [
    {
      "field_id": 3,
      "slug": "first_name",
      "label": "First Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "First Name",
        "slug": "first_name",
        "description": "The first name of the contact.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "formatted": false
        }
      }
    },
    {
      "field_id": 4,
      "external_id": "last_name",
      "slug": "last_name",
      "label": "Last Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Last Name",
        "slug": "last_name",
        "description": "The last name of the contact.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "formatted": false
        }
      }
    },
    {
      "field_id": 20,
      "external_id": "notes",
      "slug": "notes",
      "label": "Notes",
      "type": "text",
      "field_type": "multi_text",
      "config": {
        "label": "Notes",
        "slug": "notes",
        "description": "Notes about the contact.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "formatted": true
        }
      }
    }
  ]
}
```

## Delete an App

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/app/{appId}" />

Deleting an existing app. ATTENTION: This action cannot be undone. All records and fields will be deleted as well.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X DELETE #BASE_URL/v1/app/1 \\
   -u #USER_API_KEY: `}
</ContextCodeBlock>
</TabItem>

</Tabs>
