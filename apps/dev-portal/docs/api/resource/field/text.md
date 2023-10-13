---
id: text
title: Text Field
sidebar_label: Text
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There are two types of text fields: `single_text` and `multi_text`.
For both types, the respective field value consists of its `value` property which holds the text value of the field.
`single_text` field-values can only hold plain text values with up to 500 characters while `multi_text` fields can hold rich-text (HTML) values with up to 150000 characters.

A text field definition consists only of the common field properties and has no settings.

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A text field can be created as part of an App creation. Here is an example request body for creating a contacts app within a workspace with ID 1.
The app contains a `single_text` field "Name", and a `multi_text` field "Notes"

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X POST #BASE_URL/v1/app/ \\
   -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \\
   --data '{
    "workspace_id": 1,
    "name": "Contacts",
    "item_name": "Contact",
    "fields": [
      {
        "field_type": "single_text",
        "config": {
          "label": "Name",
          "description": "The full name of the contact.",
          "required": true
        }
      },
      {
        "field_type": "multi_text",
        "config": {
          "label": "Notes",
          "description": "Notes about the contact.",
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
  "name": "Contacts",
  "item_name": "Contact",
  "fields": [
    {
      "field_type": "single_text",
      "config": {
        "label": "Name",
        "description": "The full name of the contact.",
        "required": true
      }
    },
    {
      "field_type": "multi_text",
      "config": {
        "label": "Notes",
        "description": "Notes about the contact.",
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
  "slug": "contacts",
  "name": "Contacts",
  "record_name": "Contact",
  "item_name": "Contact",
  "config": {
    "item_name": "Contact",
    "name": "Contacts"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "slug": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Name",
        "slug": "name",
        "description": "The full name of the contact.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "formatted": false
        }
      }
    },
    {
      "field_id": 2,
      "slug": "notes",
      "label": "Notes",
      "type": "text",
      "field_type": "multi_text",
      "config": {
        "label": "Notes",
        "slug": "notes",
        "description": "Notes about the contact.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "formatted": true
        }
      }
    }
  ]
}
```

## App update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

A text field can be created or updated as part of an App update. Here is an example request body for updating the previously created contacts app with ID 1.
The update splits the "name" field into "First name" and "Last name" fields. Therefore, the "name" field is being renamed (updated) to "First name" and a new field "Last name" is being created.
The "notes" field is not provided in the request body and therefore remains unchanged.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
   -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \\
   --data '{
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
        "field_type": "single_text",
        "config": {
          "label": "Last Name",
          "description": "The last name of the contact.",
          "required": true
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
      "field_type": "single_text",
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
  "slug": "contacts",
  "external_id": "contacts",
  "name": "Contacts",
  "record_name": "Contact",
  "item_name": "Contact",
  "config": {
    "item_name": "Contact",
    "name": "Contacts"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "slug": "name",
      "label": "First Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "First Name",
        "slug": "name",
        "external_id": "name",
        "description": "The first name of the contact.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "formatted": false
        }
      }
    },
    {
      "field_id": 3,
      "slug": "last_name",
      "label": "Last Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Last Name",
        "slug": "last_name",
        "external_id": "last_name",
        "delta": "OB",
        "position": "OB",
        "description": "The last name of the contact.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "formatted": false
        }
      }
    },
    {
      "field_id": 2,
      "external_id": "notes",
      "slug": "notes",
      "label": "Notes",
      "type": "text",
      "field_type": "multi_text",
      "config": {
        "label": "Notes",
        "slug": "notes",
        "description": "Notes about the contact.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "formatted": true
        }
      }
    }
  ]
}
```

````
