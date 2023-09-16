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

## Create, delete or update Apps

:::caution Not available

Mutating **App** endpoints are not available yet. [Create a community feature request](https://community.tapeapp.com/c/requests/8) if those are important for your integrations.

:::
