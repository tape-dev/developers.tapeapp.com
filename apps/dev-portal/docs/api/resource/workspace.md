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


## Retrieve workspace members

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/workspace/{workspaceId}/member" />

Retrieve all workspace members for a given workspace:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/workspace/1/member \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "workspace_members": [
    {
      "workspace_id": 1,
      "user_id": 10000,
      "role": "'admin",
    },
    {
      "workspace_id": 1,
      "user_id": 10001,
      "role": "'member",
    }
  ]
}`}
</ContextCodeBlock>

## Add a workspace member

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/workspace/{workspaceId}/member" />

Add an existing organization user to a given workspace. If the user is already a member, the role will be updated according to the provided input.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/workspace/1/member \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "user_id": 10002,
    "role": "admin"
  }' 
  `}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
    "workspace_id": 1,
    "user_id": 10002,
    "role": "'admin"
}`}
</ContextCodeBlock>

:::info User Workspace Role

The `role` property to add members needs to be one of `"admin"`, `"member"` and`"guest"`. This corresponds to the workspace organization roles [documented in the help center](https://help.tapeapp.com/en/articles/8000930-intro-to-workspaces).
:::

## Remove a workspace member

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/workspace/{workspaceId}/member/{userId}" />

Remove a workspace member from a given workspace. Note that the user will continue to exist in the organization.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X DELETE #BASE_URL/v1/workspace/100/member/{userId} \\
  -u #USER_API_KEY:
  `}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
    "workspace_id": 100,
    "user_id": 10002,
    "role": "'admin"
}`}
</ContextCodeBlock>

## Notes

:::caution Note

Currently it is not possible to change the type of a workspace via the API. Be sure to properly create workspaces with the desired type.

:::
