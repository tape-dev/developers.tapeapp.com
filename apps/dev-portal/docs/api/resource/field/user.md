---
id: user
title: User field
sidebar_label: User
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use a user field to assign users of your organization to a record.

Tape has two user field types. Both are the **Member** field in Tape:

- `single_user` holds one user.
- `multi_user` holds several users.

A user field has the [common field properties](/docs/api/resource/field/overview#common-properties) and read-only `settings`. To read and write the users of a record, see [User field value](/docs/api/resource/field-value/user).

```json title="User field object"
{
  "field_id": 2,
  "external_id": "participants",
  "slug": "participants",
  "label": "Participants",
  "type": "contact",
  "field_type": "multi_user",
  "config": {
    "label": "Participants",
    "slug": "participants",
    "external_id": "participants",
    "description": "The participants of the meeting.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
    "settings": {
      "multiple": true
    }
  }
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"contact"` for both user field types. | `"contact"` |
| `field_type` | `string` | `"single_user"` or `"multi_user"`. | `"multi_user"` |
| `config.settings.multiple` (read-only) | `boolean` | `false` for `single_user`, `true` for `multi_user`. | `true` |

You can't set `settings` through the API. The field type decides whether the field holds one or several users.

## App creation

Use the [create app endpoint](/docs/api/resource/app#create-an-app) to create user fields together with a new app.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

The example creates a meetings app in the workspace with ID `1`. The app gets a `single_user` field "Responsible for Note taking" and a `multi_user` field "Participants". The example leaves out other fields of a meetings app, like "Date" or "Notes".

Find the workspace ID with [Retrieve workspaces](/docs/api/resource/workspace#retrieve-workspaces).

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`
curl -X POST #BASE_URL/v1/app/ \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "workspace_id": 1,
    "name": "Meetings",
    "item_name": "Meeting",
    "fields": [
      {
        "field_type": "single_user",
        "config": {
          "label": "Responsible for Note taking",
          "description": "The person who takes notes during the meeting.",
          "required": false
        }
      },
      {
        "field_type": "multi_user",
        "config": {
          "label": "Participants",
          "description": "The participants of the meeting.",
          "required": false
        }
      }
    ]
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "workspace_id": 1,
  "name": "Meetings",
  "item_name": "Meeting",
  "fields": [
    {
      "field_type": "single_user",
      "config": {
        "label": "Responsible for Note taking",
        "description": "The person who takes notes during the meeting.",
        "required": false
      }
    },
    {
      "field_type": "multi_user",
      "config": {
        "label": "Participants",
        "description": "The participants of the meeting.",
        "required": false
      }
    }
  ]
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "meetings",
  "external_id": "meetings",
  "name": "Meetings",
  "record_name": "Meeting",
  "item_name": "Meeting",
  "type": "database",
  "config": {
    "item_name": "Meeting",
    "name": "Meetings"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "responsible_for_note_taking",
      "slug": "responsible_for_note_taking",
      "label": "Responsible for Note taking",
      "type": "contact",
      "field_type": "single_user",
      "config": {
        "label": "Responsible for Note taking",
        "slug": "responsible_for_note_taking",
        "external_id": "responsible_for_note_taking",
        "description": "The person who takes notes during the meeting.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "multiple": false
        }
      }
    },
    {
      "field_id": 2,
      "external_id": "participants",
      "slug": "participants",
      "label": "Participants",
      "type": "contact",
      "field_type": "multi_user",
      "config": {
        "label": "Participants",
        "slug": "participants",
        "external_id": "participants",
        "description": "The participants of the meeting.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "multiple": true
        }
      }
    }
  ]
}
```

**General behavior**

- Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Responsible for Note taking".
- A new user field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

## App update

Use the [update app endpoint](/docs/api/resource/app#update-an-app) to create new user fields in an app or to change existing ones.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

The example splits the "Participants" field of the meetings app into internal and external participants. It renames the field with ID `2` to "Internal Participants" and creates a new `multi_user` field "External Participants". The "Responsible for Note taking" field isn't in the request, so it stays unchanged.

Find the app ID and the field IDs in the [Developer view of the app](/docs/api/resource/app#find-app-and-field-ids).

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": [
      {
        "field_id": 2,
        "config": {
          "label": "Internal Participants",
          "description": "The participants from your company.",
          "required": false
        }
      },
      {
        "field_type": "multi_user",
        "config": {
          "label": "External Participants",
          "description": "The participants from outside your company.",
          "required": false
        }
      }
    ]
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "fields": [
    {
      "field_id": 2,
      "config": {
        "label": "Internal Participants",
        "description": "The participants from your company.",
        "required": false
      }
    },
    {
      "field_type": "multi_user",
      "config": {
        "label": "External Participants",
        "description": "The participants from outside your company.",
        "required": false
      }
    }
  ]
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "meetings",
  "external_id": "meetings",
  "name": "Meetings",
  "record_name": "Meeting",
  "item_name": "Meeting",
  "type": "database",
  "config": {
    "item_name": "Meeting",
    "name": "Meetings"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "responsible_for_note_taking",
      "slug": "responsible_for_note_taking",
      "label": "Responsible for Note taking",
      "type": "contact",
      "field_type": "single_user",
      "config": {
        "label": "Responsible for Note taking",
        "slug": "responsible_for_note_taking",
        "external_id": "responsible_for_note_taking",
        "description": "The person who takes notes during the meeting.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "multiple": false
        }
      }
    },
    {
      "field_id": 2,
      "external_id": "participants",
      "slug": "participants",
      "label": "Internal Participants",
      "type": "contact",
      "field_type": "multi_user",
      "config": {
        "label": "Internal Participants",
        "slug": "participants",
        "external_id": "participants",
        "description": "The participants from your company.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "multiple": true
        }
      }
    },
    {
      "field_id": 3,
      "external_id": "external_participants",
      "slug": "external_participants",
      "label": "External Participants",
      "type": "contact",
      "field_type": "multi_user",
      "config": {
        "label": "External Participants",
        "slug": "external_participants",
        "external_id": "external_participants",
        "description": "The participants from outside your company.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "multiple": true
        }
      }
    }
  ]
}
```

**General behavior**

- A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
- Renaming a field keeps its `slug`. The renamed field "Internal Participants" still has the slug `participants`.
- Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](/docs/api/resource/field/overview#create-and-update-fields).
- Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.

## Next steps

- [User field value](/docs/api/resource/field-value/user): read and write the users of a record.
- [User](/docs/api/resource/user): find the users of your organization and their IDs.
- [Field](/docs/api/resource/field/overview): the properties all field types share.
- [App](/docs/api/resource/app): create, update and delete apps with their fields.
- [Capabilities](/docs/api/capabilities): what `apps:edit` allows.
