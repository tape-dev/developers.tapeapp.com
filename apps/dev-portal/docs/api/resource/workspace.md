---
id: workspace
title: Workspace
sidebar_label: Workspace
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

## Retrieve workspaces

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/workspace/org" />

Retrieve all workspaces that you have access to (inside the active user organization with ID `1337`):

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/workspace/org \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 2,
  "workspaces": [
    {
      "workspace_id": 1,
      "name": "Task management",
      "slug": "task-management",
      "type": "closed",
      "description": "Manage all tasks and projects inside this workspace.",
      "org_id": 1337
    },
    {
      "workspace_id": 2,
      "name": "Contact directory",
      "slug": "contact-directory",
      "type": "default",
      "description": "Keep track of our contacts here.",
      "org_id": 1337
    }
  ]
}`}
</ContextCodeBlock>

## Create a workspace

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/workspace" />

Create a new workspace:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/workspace \\
  -u #USER_API_KEY:\\
  -H "Content-Type: application/json" \\
  --data '{
    "name": "Task management",
    "type": "closed",
    "description": "Manage all tasks and projects inside this workspace."
  }' 
  `}
</ContextCodeBlock>

The created workspace will be returned in the response:

<ContextCodeBlock language="json" title='⬅️      Response'>
{`
  {
    "workspace_id": 1,
    "name": "Task management",
    "slug": "task-management",
    "type": "closed",
    "description": "Manage all tasks and projects inside this workspace.",
    "org_id": 1337
  }
`}
</ContextCodeBlock>

:::info Workspace type

The `type` property to create workspaces needs to be one of `"closed"`, `"open"`, `"default"` and `"private"`. This corresponds to the workspace types [documented in the help center](https://help.tapeapp.com/en/articles/8000930-intro-to-workspaces).

:::

## Update a workspace

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/workspace/{workspaceId}" />

Update an existing workspace via its ID:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/workspace/1 \\
  -u #USER_API_KEY:\\
  -H "Content-Type: application/json" \\
  --data '{
    "name": "Task management (NEW)",
    "type": "closed",
    "description": "Manage all tasks and projects inside this NEW workspace."
  }' 
  `}
</ContextCodeBlock>

The updated workspace will be returned in the response:

<ContextCodeBlock language="json" title='⬅️      Response'>
{`
  {
    "workspace_id": 1,
    "name": "Task management (NEW)",
    "slug": "task-management-new",
    "type": "closed",
    "description": "Manage all tasks and projects inside this NEW workspace.",
    "org_id": 1337
  }
`}
</ContextCodeBlock>

## Delete a workspace

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/workspace/{workspaceId}" />

Delete a workspace via its ID:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X DELETE #BASE_URL/v1/workspace/1 \\
  -u #USER_API_KEY:\\
  -H "Content-Type: application/json" 
  `}
</ContextCodeBlock>

The deleted workspace will be returned in the response:

<ContextCodeBlock language="json" title='⬅️      Response'>
{`
  {
    "workspace_id": 1,
    "name": "Task management (NEW)",
    "slug": "task-management-new",
    "type": "closed",
    "description": "Manage all tasks and projects inside this NEW workspace.",
    "org_id": 1337
  }
`}
</ContextCodeBlock>

## Notes

:::caution Note

Currently it is not possible to change the type of a workspace via the API. Be sure to properly create workspaces with the desired type.

:::
