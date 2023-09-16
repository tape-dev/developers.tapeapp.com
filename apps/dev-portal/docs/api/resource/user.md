---
id: user
title: User
sidebar_label: User
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

## Retrieve Users

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/org/user" />

Retrieve your current organization's users (e.g. the organization with ID `1337`):

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/org/user \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "users": [
    {
      "user_id": 10000,
      "name": "John Doe",
      "org_id": 1337,
      "status": "active",
      "email": "john@doe.com",
      "phone": "555 123 456",
      "role": "owner",
      "job_description": "Founder & CEO"
    },
    {
      "user_id": 10001,
      "name": "Zoe Maxwell",
      "org_id": 1337,
      "status": "active",
      "email": "zoemaxwell10001@me.com",
      "phone": "555 123 457",
      "role": "member",
      "job_description": "Executive"
    }
  ]
}`}
</ContextCodeBlock>

## Create, update or delete users

:::caution Not available

Modifying **User** endpoints are not available yet. [Create a community feature request](https://community.tapeapp.com/c/requests/8) if those are important for your integrations.

:::
