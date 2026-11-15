---
id: record-permissions
title: Record sharing & permissions
sidebar_label: Record sharing & permissions
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use this endpoint to share records with individual users and to change or remove their access.

In the Podio API, a record permission is a grant.

:::info Which capability do I need?
This endpoint needs `records:share`. See [Capabilities](/docs/api/capabilities).
:::

## Batch update multiple records' permissions

Use this endpoint to add, change and remove the permissions of users on up to 50 records in one request.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/permission/batch" isNew="true" />

Send one object per record in the `inputs` array. Each object has a `record_id` and up to three lists: `add_permissions`, `update_permissions` and `remove_permissions`.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X PUT #BASE_URL/v1/record/permission/batch \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
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
            "email": "juliet@acme.com",
            "permission_level": 4
          }
        ],
        "remove_permissions": [101]
      }
    ]
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
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
          "email": "juliet@acme.com",
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

```json title="Response"
{}
```

The example changes the permissions of records `1` and `2`:

- User `100` gets **Full access** to both records.
- `juliet@acme.com` gets access to record `2` with the level **Can share**.
- User `101` loses access to both records.

**General behavior**

- One request changes at most 50 records. A longer `inputs` array returns an error. For more records, send several requests.
- All records of one request must belong to the same database app.
- A personal access token with limited content access shares only records in apps its content access includes. If one record lies outside, the whole request returns `404`.

**Requirements:** `records:share`, and **Can share** or **Full access** on each record. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- A permission level that isn't a number from `0` to `5`, or records from more than one database app, return `400` with `validation`.
- An `email` in `update_permissions` that belongs to no user in your organization returns `500` with `unknown` and the message `User with email … not found`.
- A request without a credential returns `401`.
- A token without `records:share` returns `403`.
- A record outside the content access of a personal access token returns `404`.

See [Errors](/docs/api/errors) for all error codes.

### Add permissions

Each entry in `add_permissions` has a `user_id` or an `email`, and a `permission_level`. If no user in your organization has the `email`, Tape creates a new user and sends an invitation to join Tape. To find a user ID, see [Retrieve organization users](/docs/api/resource/user#retrieve-organization-users).

### Update permissions

Each entry in `update_permissions` has a `user_id` or an `email`, and a `permission_level`. Tape changes the existing permission of that user. The `email` must belong to a user in your organization.

Unlike `add_permissions`, `update_permissions` sends no invitation email. Use it to change a user's permission without notifying them.

### Remove permissions

Each entry in `remove_permissions` is a user ID or an email address. Tape removes the access you gave this user on the record. Access through a workspace membership or app permissions stays.

### Permission levels

Send `permission_level` as a number:

| Number | Level |
| :-- | :-- |
| `5` | Full access |
| `4` | Can share |
| `3` | Can edit |
| `2` | Can comment |
| `1` | Can view |
| `0` | No access |

A name such as `CAN_SHARE` or any other value returns `400` with `validation`. The message reads `expected a valid permission level (3, 4 or 5)`, but all six numbers work.

## Next steps

- [Record](/docs/api/resource/record): create and update the records you share.
- [User](/docs/api/resource/user): find the `user_id` of an organization user.
- [Capabilities](/docs/api/capabilities): what `records:share` allows.
- [Personal access tokens](/docs/api/personal-access-tokens): choose the content a token can reach.
