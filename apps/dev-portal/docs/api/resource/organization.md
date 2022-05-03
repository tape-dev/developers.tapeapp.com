---
id: organization
title: Organization
sidebar_label: Organization
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

## Retrieve Organization

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/workspace/org" />

Retrieve your current organization (e.g. the organization with ID `1337`):

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/org \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
    "org_id": 1337,
    "name": "Tape Technologies",
    "slug": "tape",
    "description": "One shall dogfood all day all night",
    "website": "https://tapeapp.com",
    "location": "Munich, Germany",
    "created_at": "2019-05-01 10:00",
    "plan": "pro"
}`}
</ContextCodeBlock>

## Update or delete organization

:::caution Not available

Modifying **Organization** endpoints are not available yet. Contact us if those are important for your integrations.

:::
