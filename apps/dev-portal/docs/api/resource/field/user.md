---
id: user
title: User Field
sidebar_label: User
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There are two types of user fields: `single_user` and `multi_user`.
`single_user` fields can only hold a reference to a single user while `multi_user` fields can hold references to multiple users.

A user field definition consists only of the common field properties and has no settings.

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A user field can be created as part of an App creation. Here is an example request body for creating an excerpt for a meetings app within a workspace with ID 1.
The app contains a `single_user` field "Note taker", and a `multi_user` field "Participants". Other useful fields for a meetings app, like "Date", "Location" or "Notes" are omitted for brevity.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X POST #BASE_URL/v1/app/ \\
   -u #USER_API_KEY: \\
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
          "description": "The person responsible for taking notes during the meeting.",
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

```json title="➡️      Request">
{
  "workspace_id": 1,
  "name": "Meetings",
  "item_name": "Meeting",
  "fields": [
    {
      "field_type": "single_user",
      "config": {
        "label": "Responsible for Note taking",
        "description": "The person responsible for taking notes during the meeting.",
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

```json title="⬅️      Response"
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "meetings",
  "external_id": "meetings",
  "name": "Meetings",
  "record_name": "Meeting",
  "item_name": "Meeting",
  "position": 0,
  "config": {
    "item_name": "Meeting",
    "name": "Meetings"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "responsible_for_note_taking",
      "label": "Responsible for Note taking",
      "type": "contact",
      "field_type": "single_user",
      "config": {
        "label": "Responsible for Note taking",
        "slug": "responsible_for_note_taking",
        "description": "The person responsible for taking notes during the meeting.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": false
        }
      }
    },
    {
      "field_id": 2,
      "slug": "participants",
      "label": "Participants",
      "type": "contact",
      "field_type": "multi_user",
      "config": {
        "label": "Participants",
        "slug": "participants",
        "description": "The participants of the meeting.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": true
        }
      }
    }
  ]
}
```

## App update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

A user field can be created or updated as part of an App update. Here is an example request body for updating the previously created meetings app with ID 1.
The update splits the "Participants" field into "Internal Participants" and "External Participants" fields. Therefore, the "Participants" field with ID 2 is being renamed (updated) to "Internal Participants" and a new field "External Participants" is being created.
The "Responsible for note taking" field is not provided in the request body and therefore remains unchanged.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
   -u #USERAPI_KEY: \\
   --data '{
    "app_id": 1,
    "fields": [
      {
        "field_id": 2,
        "config": {
          "label": "Internal Participants",
          "description": "The company-internal participants of the meeting.",
          "required": false
        }
      },
      {
        "field_type": "multi_user",
        "config": {
          "label": "External Participants",
          "description": "The company-external participants of the meeting.",
          "required": false
        }
      }
    ] 
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "app_id": 1,
  "fields": [
    {
      "field_id": 1,
      "config": {
        "label": "First Name",
        "description": "The first name of the contact.",
        "required": true
      }
    },
    {
      "field_type": "single_user",
      "config": {
        "label": "Last Name",
        "description": "The last name of the contact.",
        "required": true
      }
    }
  ]
}
```

</TabItem>
</Tabs>

````json title="⬅️      Response"
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "meetings",
  "external_id": "meetings",
  "name": "Meetings",
  "record_name": "Meeting",
  "item_name": "Meeting",
  "config": {
    "item_name": "Meeting",
    "name": "Meetings"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "responsible_for_note_taking",
      "label": "Responsible for Note taking",
      "type": "contact",
      "field_type": "single_user",
      "config": {
        "label": "Responsible for Note taking",
        "slug": "responsible_for_note_taking",
          "description": "The person responsible for taking notes during the meeting.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": false
        }
      }
    },
    {
      "field_id": 2,
      "slug": "participants",
      "label": "Internal Participants",
      "type": "contact",
      "field_type": "multi_user",
      "config": {
        "label": "Internal Participants",
        "slug": "participants",
        "description": "The company-internal participants of the meeting.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": true
        }
      }
    },
    {
      "field_id": 3,
      "slug": "external_participants",
      "label": "External Participants",
      "type": "contact",
      "field_type": "multi_user",
      "config": {
        "label": "External Participants",
        "slug": "external_participants",
        "description": "The company-external participants of the meeting.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": true
        }
      }
    },
  ]
}```

````
