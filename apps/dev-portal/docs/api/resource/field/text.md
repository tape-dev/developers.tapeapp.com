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
`single text` fields can only hold plain text values with up to 500 characters while `multi_text` fields can hold rich-text (HTML) values with up to 150000 characters.

A text field definition consists only of the common field properties.

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A text field can be created as part of an App creation. Here is an example request body for creating a contacts app within a workspace with ID 1.
The app contains a `single_text` field "Name", and a `multi_text` field "Notes"

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X POST http://localhost:3000/v1/app/ \\
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
