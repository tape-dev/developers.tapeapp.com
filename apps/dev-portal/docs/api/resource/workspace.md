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

Retrieve all workspaces that the active user has access to (inside the active user organization with ID `1337`):

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/workspace/org \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 2,
  "workspaces": [
    {
      workspace_id: 1,
      name: "Task management",
      slug: "task-management",
      description: "Manage all tasks and projects inside this workspace.",
      org_id: 1337
    },
    {
      workspace_id: 2,
      name: "Contact directory",
      slug: "contact-directory",
      description: "Keep track of our contacts here.",
      org_id: 1337
    },
  ]
}`}
</ContextCodeBlock>

## Create, delete or update workspaces

:::caution Not available

Modifying **Workspace** endpoints are not available yet. Contact us if those are important for your integrations.

:::
