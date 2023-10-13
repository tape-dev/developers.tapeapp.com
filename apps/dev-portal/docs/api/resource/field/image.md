---
id: image
title: Image Field
sidebar_label: Image
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There is only type of image fields: `multi_image`.

`multi_image` fields can only hold one or more multi_image entries.

A `multi_image` field definition consists only of the common field properties and has no settings.

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

An image field can be created as part of an App creation. Here is an example request body for creating an excerpt for a Contacts app within a workspace with ID 1.
The app contains a `multi_image` field "Portraits". Other useful fields for a contacts app, like "First Name", "Last Name" or "Notes" are omitted for brevity.

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
        "field_type": "multi_image",
        "config": {
          "label": "Portraits",
          "description": "Portraits of the contact.",
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
      "field_type": "multi_image",
      "config": {
        "label": "Portraits",
        "description": "Portraits of the contact.",
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
  "position": 0,
  "config": {
    "item_name": "Contact",
    "name": "Contacts"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "portraits",
      "label": "Portraits",
      "type": "file",
      "field_type": "multi_image",
      "config": {
        "label": "Portraits",
        "slug": "portraits",
        "description": "Portraits of the contact.",
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

An image field can be created or updated as part of an App update. Here is an example request body for updating the previously created portraits app with ID 1.
The changes the description of the "Portraits" field to "Photos of the contact".

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
   -u #USERAPI_KEY: \\
   --data '{
    "app_id": 1,
    "name": "Contacts",
    "item_name": "Contact",
    "fields": [
      {
        "field_id": 1,
        "config": {
          "label": "Portraits",
          "description": "Photos of the contact.",
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
  "name": "Contacts",
  "item_name": "Contact",
  "fields": [
    {
      "field_id": 1,
      "config": {
        "label": "Portraits",
        "description": "Photos of the contact.",
        "required": false
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
  "name": "Contacts",
  "item_name": "Contact",
  "position": 0,
  "config": {
    "item_name": "Contact",
    "name": "Contacts"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "portraits",
      "label": "Portraits",
      "type": "file",
      "field_type": "multi_image",
      "config": {
        "label": "Portraits",
        "slug": "portraits",
        "description": "Photos of the contact.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": true
        }
      }
    }
  ]
}```

````
