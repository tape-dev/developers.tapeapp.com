---
id: organization
title: Organization
sidebar_label: Organization
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use this endpoint to read the organization your credential belongs to.

## Retrieve organization

Use this endpoint to get the name, plan and other details of your organization.

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/org" />

The example reads the organization Acme Inc., which has the ID `1337`.

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/org \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='Response'>
{`{
  "org_id": 1337,
  "active_user_id": 2000,
  "name": "Acme Inc.",
  "slug": "acme",
  "url": "https://tapeapp.com/acme",
  "description": "Sales and customer success for the Acme product line",
  "website": "https://acme.com",
  "location": "Munich, Germany",
  "created_on": "2019-05-01 10:00:00",
  "created_on_utc": "2019-05-01 08:00:00",
  "plan": "premium",
  "activity_count": 345
}`}
</ContextCodeBlock>

**Key fields**

- `active_user_id`: the user your credential acts for.
- `created_on`: when the organization was created, in your timezone. `created_on_utc` holds the same moment in UTC. See [Date & timezone](/docs/api/date-timezone).
- `plan`: one of `free`, `basic`, `premium` or `enterprise`.

**General behavior**

- Tape takes the organization from your credential. The endpoint has no path parameter.
- Content access doesn't limit this endpoint. A token limited to one workspace still reads the organization of that workspace.

**Requirements:** `organization:read`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- An automation API key returns `400` with `validation`, because the endpoint needs a credential that belongs to a user.
- A request without a credential returns `401`.
- A token without `organization:read` returns `403`.

See [Errors](/docs/api/errors) for all error codes.

<a id="update-or-delete-organization"></a>

:::info Need to change or delete an organization?
The API has no endpoints to change or delete an organization. [Create a feature request in the Tape Community](https://community.tapeapp.com/c/requests/8).
:::

## Next steps

- [User](/docs/api/resource/user): list and search the users of your organization.
- [Workspace](/docs/api/resource/workspace): list the workspaces of your organization.
- [Date & timezone](/docs/api/date-timezone): how Tape formats `created_on` and `created_on_utc`.
- [Capabilities](/docs/api/capabilities): what `organization:read` allows.
