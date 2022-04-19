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

Retrieve all apps for the workspace with ID `200`:

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
        "description": ""
      }
    }
]
}`}
</ContextCodeBlock>

## Create, delete or update Apps

:::caution Not available

Mutating **App** endpoints are not available yet. Contact us if those are important for your integrations.

:::
