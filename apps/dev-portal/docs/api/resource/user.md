---
id: user
title: User
sidebar_label: User
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

## Retrieve Organization Users

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

## Add User to Organization

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/org/user" />

Add a new user to your current organization (e.g. the organization with ID `1337`). Include the `skip_invitation` flag in your request body to skip sending invitation email upon user creation. 

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/org/user \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "name": "Roger Sterling",
    "email": "rsterling-sc@me.com",
    "role": "admin",
    "skip_invitation": true
  }' 
  `}
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
    },
    {
      "user_id": 10002,
      "name": "Roger Sterling",
      "org_id": 1337,
      "status": "active",
      "email": "rsterling-sc@me.com",
      "phone": "555 123 458",
      "role": "admin",
      "job_description": "VP"
    }
  ]
}`}
</ContextCodeBlock>

:::info User Organization Role

The `role` property to create users needs to be one of `"admin"`, `"member"` and`"guest"`. This corresponds to the user organization roles [documented in the help center](https://help.tapeapp.com/en/articles/8000930-intro-to-workspaces). Note that adding admin and member users is a billable event. 💲
:::


## Resend User invitation email

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/org/user/{userId}/resend-invitation" />

Resend an invitation email for an organization user. This will be important when skipping invitations during user creation, and allows sending the invitation email at a dedicated point in time later or repetitively.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/org/user/10000/resend-invitation \\
  -u #USER_API_KEY:
  `}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
}`}
</ContextCodeBlock>

## Update or delete users

:::caution Not available

Modifying existing **User** endpoints are not available yet. [Create a community feature request](https://community.tapeapp.com/c/requests/8) if those are important for your integrations.
:::
