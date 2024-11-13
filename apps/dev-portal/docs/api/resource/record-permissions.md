---
id: record-permissions
title: Record Permissions
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Records are the place where work gets done inside a Tape organization. Records permissions can be changed via the developer API.

## Batch update multiple records' permissions

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/permission/batch" isNew="true" />

To update record permissions, issue a PUT request to this endpoint. The PUT body has to contain the `inputs` property with an array of objects that have a `record_id` property to specify for which record permissions should be alterered, and two arrays `add_permissions` and `remove_permissions`.

Optionally specifying `add_permissions`, each entry must contain either a `user_id` or an `email` property for the respective organization user to be added. If there is no user inside the organization that matches `email`, a new one will be created and an invitation to join Tape will be sent. Additionally, a numeric `permission_level` needs to be specified.

Valid permission levels to be specified for the `permission_level` property are:

- 4 / (can edit)
- 5 / (full access)

Optionally specifying `remove_permissions`, each entry must be either a user ID or an email. Access for the respective user will be removed, if it was added prior. This does not affect access that a user might have via workspace memberships or app permissions.

Currently, only for a maximum of **50 records** the permissions can be batch updated at the same time. An error will be thrown if the `inputs` array exceeds that limit. If you need more, issue seperate requests.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/permission/batch \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "inputs": [
      {
        "record_id": 1,
        "add_permissions": [
          {
            "user_id": 100,
            "permission_level": 5
          }
        ],
        "remove_permissions": [101]
      },
      {
        "record_id": 2,
        "add_permissions": [
          {
            "user_id": 100,
            "permission_level": 5
          },
          {
            "email": "john@doe.com",
            "permission_level": 4
          },
        ],
        "remove_permissions": [101]
      }
    ]
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "input": [
    {
      "record_id": 1,
      "add_permissions": [
        {
          "user_id": 100,
          "permission_level": 5
        }
      ],
      "remove_permissions": [101]
    },
    {
      "record_id": 2,
      "add_permissions": [
        {
          "user_id": 100,
          "permission_level": 5
        },
        {
          "email": "john@doe.com",
          "permission_level": 4
        }
      ],
      "remove_permissions": [101]
    }
  ]
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{}
```

The example above alters permissions for two records with id `1` and `2`, adding the user with ID `100` two both records gaining full access, and additionally adding a second user gaining access to record with ID `2` via email. The user would be created and invited if there is no user matching the email in the active organization. Further, user with ID `101` is revoked the access two both records.