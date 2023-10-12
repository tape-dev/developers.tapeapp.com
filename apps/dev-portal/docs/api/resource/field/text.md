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
curl -X POST https://api.tapeapp.com/v1/app/ \
   -u user_key_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiLvv73vv71bRu-_vVROXGJdLiIsInNjb3BlIjoidWtfdjEiLCJ0eXBlIjoiVVNFUl9BUElfS0VZIn0.OLtPIKQbwTTc4aKF2IKL3Pc3Y3wtTr7-P5L_oE-Rnjc: 
  -H "Content-Type: application/json" \
  --data '{
    "workspace_id": 9011,
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
        "config: {
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
  "label": "Contacts",
  "record_name": "Contact",
  "fields": [
    {
      "label": "Name",
      "description": "The full name of the contact.",
      "field_type": "single_text",
      "required": true
    },
    {
      "label": "Notes",
      "description": "Notes about the contact.",
      "field_type": "multi_text",
      "required": false
    }
  ]
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "app_id": 1,
  "label": "Contacts",
  "external_id": "contacts",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "description": "The full name of the contact.",
      "field_type": "single_text",
      "required": true,
      "hidden_if_empty": false,
      "always_hidden": false
    },
    {
      "field_id": 2,
      "external_id": "notes",
      "label": "Notes",
      "description": "Notes about the contact.",
      "field_type": "multi_text",
      "required": false,
      "hidden_if_empty": false,
      "always_hidden": false
    }
  ]
}
```
