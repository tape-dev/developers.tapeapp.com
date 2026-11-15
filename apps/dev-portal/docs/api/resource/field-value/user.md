---
id: user
title: User field value
sidebar_label: User
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use a user field value to read and write the users of a record.

Each value of a [user field](/docs/api/resource/field/user) is a short preview of one user of your organization. A `single_user` field holds at most one user. A `multi_user` field holds several users.

```json title="User field value object"
{
  "field_id": 1,
  "external_id": "responsible_for_note_taking",
  "label": "Responsible for Note taking",
  "type": "contact",
  "field_type": "single_user",
  "values": [
    {
      "value": {
        "user_id": 1,
        "name": "Juliet Adams",
        "email": "juliet@acme.com",
        "mail": ["juliet@acme.com"],
        "phone": "+1 555 0100",
        "org_id": 1,
        "type": "user",
        "image": null
      }
    }
  ]
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"contact"` for both user field types. | `"contact"` |
| `field_type` | `string` | `"single_user"` or `"multi_user"`. | `"single_user"` |
| `values[].value.user_id` | `number` | ID of the user. | `1` |
| `values[].value.name` | `string` | Name of the user. | `"Juliet Adams"` |
| `values[].value.email` | `string` | Email address of the user. | `"juliet@acme.com"` |
| `values[].value.mail` | `string[]` | The email address as an array, for older integrations. Use `email` instead. | `["juliet@acme.com"]` |
| `values[].value.phone` | `string` or `null` | Phone number of the user, or `null` if the user has none. | `"+1 555 0100"` |
| `values[].value.org_id` | `number` | ID of the user's organization. | `1` |
| `values[].value.type` | `string` | `"user"`. | `"user"` |
| `values[].value.image` | `null` | Not filled. The value is `null`. | `null` |

Each field in a record response also contains the field's `config`. The examples on this page leave it out.

## Record creation

Use the [create record endpoint](/docs/api/resource/record#create-a-record) to assign users to a new record.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

The example creates the meeting "Quarterly pipeline review" in the meetings app from [User field](/docs/api/resource/field/user). It sets the "Responsible for Note taking" field (ID `1`, type `single_user`, slug `responsible_for_note_taking`) and the "Participants" field (ID `2`, type `multi_user`, slug `participants`). The second participant is set by email address.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/record/app/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "title": "Quarterly pipeline review",
      "responsible_for_note_taking": 1,
      "participants": [4, "sierra@acme.com"]
    }
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "fields": {
    "title": "Quarterly pipeline review",
    "responsible_for_note_taking": 1,
    "participants": [4, "sierra@acme.com"]
  }
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "record_id": 1,
  "title": "Quarterly pipeline review",
  "fields": [
    {
      "field_id": 4,
      "external_id": "title",
      "label": "Title",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Quarterly pipeline review" }]
    },
    {
      "field_id": 1,
      "external_id": "responsible_for_note_taking",
      "label": "Responsible for Note taking",
      "type": "contact",
      "field_type": "single_user",
      "values": [
        {
          "value": {
            "user_id": 1,
            "name": "Juliet Adams",
            "email": "juliet@acme.com",
            "mail": ["juliet@acme.com"],
            "phone": "+1 555 0100",
            "org_id": 1,
            "type": "user",
            "image": null
          }
        }
      ]
    },
    {
      "field_id": 2,
      "external_id": "participants",
      "label": "Participants",
      "type": "contact",
      "field_type": "multi_user",
      "values": [
        {
          "value": {
            "user_id": 4,
            "name": "Dan Jacob",
            "email": "dan@acme.com",
            "mail": ["dan@acme.com"],
            "phone": null,
            "org_id": 1,
            "type": "user",
            "image": null
          }
        },
        {
          "value": {
            "user_id": 5,
            "name": "Sierra Johns",
            "email": "sierra@acme.com",
            "mail": ["sierra@acme.com"],
            "phone": null,
            "org_id": 1,
            "type": "user",
            "image": null
          }
        }
      ]
    }
  ]
}
```

**General behavior**

- Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
- Identify a user by user ID, email address or name. Tape compares email addresses and names case-insensitively and looks only at users of your organization. Tape also accepts objects like `{ "user_id": 1 }` or `{ "value": 1 }`, and arrays of these.
- Find user IDs with [Retrieve organization users](/docs/api/resource/user#retrieve-organization-users).
- Send one user to a `single_user` field. If you send an array, Tape uses its first user.
- Tape drops a user ID that belongs to no user.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- An email address or name that matches no user of your organization returns `400` with the message `Could not resolve a user for "<value>".`

See [Errors](/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](/docs/api/resource/record#retrieve-a-record) to read the users assigned to a record.

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

```json title='Response'
{
  "record_id": 1,
  "title": "Quarterly pipeline review",
  "fields": [
    {
      "field_id": 4,
      "external_id": "title",
      "label": "Title",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Quarterly pipeline review" }]
    },
    {
      "field_id": 1,
      "external_id": "responsible_for_note_taking",
      "label": "Responsible for Note taking",
      "type": "contact",
      "field_type": "single_user",
      "values": [
        {
          "value": {
            "user_id": 1,
            "name": "Juliet Adams",
            "email": "juliet@acme.com",
            "mail": ["juliet@acme.com"],
            "phone": "+1 555 0100",
            "org_id": 1,
            "type": "user",
            "image": null
          }
        }
      ]
    },
    {
      "field_id": 2,
      "external_id": "participants",
      "label": "Participants",
      "type": "contact",
      "field_type": "multi_user",
      "values": [
        {
          "value": {
            "user_id": 4,
            "name": "Dan Jacob",
            "email": "dan@acme.com",
            "mail": ["dan@acme.com"],
            "phone": null,
            "org_id": 1,
            "type": "user",
            "image": null
          }
        },
        {
          "value": {
            "user_id": 5,
            "name": "Sierra Johns",
            "email": "sierra@acme.com",
            "mail": ["sierra@acme.com"],
            "phone": null,
            "org_id": 1,
            "type": "user",
            "image": null
          }
        }
      ]
    }
  ]
}
```

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](/docs/api/resource/record#update-a-record) to change the users assigned to a record.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

The example hands note taking for the meeting with ID `1` to the user with ID `2` and keeps only Sierra Johns as participant.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X PUT #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "responsible_for_note_taking": 2,
      "participants": [5]
    }
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "fields": {
    "responsible_for_note_taking": 2,
    "participants": [5]
  }
}
```

</TabItem>
</Tabs>

```json title='Response'
{
  "record_id": 1,
  "title": "Quarterly pipeline review",
  "fields": [
    {
      "field_id": 4,
      "external_id": "title",
      "label": "Title",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Quarterly pipeline review" }]
    },
    {
      "field_id": 1,
      "external_id": "responsible_for_note_taking",
      "label": "Responsible for Note taking",
      "type": "contact",
      "field_type": "single_user",
      "values": [
        {
          "value": {
            "user_id": 2,
            "name": "Delaney Beatty",
            "email": "delaney@acme.com",
            "mail": ["delaney@acme.com"],
            "phone": null,
            "org_id": 1,
            "type": "user",
            "image": null
          }
        }
      ]
    },
    {
      "field_id": 2,
      "external_id": "participants",
      "label": "Participants",
      "type": "contact",
      "field_type": "multi_user",
      "values": [
        {
          "value": {
            "user_id": 5,
            "name": "Sierra Johns",
            "email": "sierra@acme.com",
            "mail": ["sierra@acme.com"],
            "phone": null,
            "org_id": 1,
            "type": "user",
            "image": null
          }
        }
      ]
    }
  ]
}
```

**General behavior**

- The new users replace the old ones. To add a user to a `multi_user` field, send the existing users together with the new one.
- To clear the field, send `null`. For a `multi_user` field, an empty array `[]` also works.
- You can't clear a required field. The request returns `400`.
- Fields that aren't in the request keep their values.

```json title="Request: clear the field"
{
  "fields": {
    "participants": null
  }
}
```

A cleared field isn't in the `fields` of the response.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

Same errors as under [Record creation](#record-creation).

See [Errors](/docs/api/errors) for all error codes.

## Next steps

- [User field](/docs/api/resource/field/user): create and change user fields.
- [User](/docs/api/resource/user): find the users of your organization and their IDs.
- [Field value](/docs/api/resource/field-value/overview): how all field values work.
- [Record](/docs/api/resource/record): create, read, update and delete records.
- [Filter](/docs/api/resource/filter): find records by their assigned users.
