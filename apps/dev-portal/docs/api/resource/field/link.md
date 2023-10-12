---
id: link
title: Link Field
sidebar_label: Link
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There is only type of link field: `multi_link`.

`multi_link` fields can hold a one or more link entries.

A `multi_link` field definition consists only of the common field properties and has no settings.

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A multi_link field can be created as part of an App creation. Here is an example request body for creating an excerpt for a contacts app within a workspace with ID 1.
The app contains a `multi_link` field "Social Media". Other useful fields for a contacts app, like "First Name", "Last Name" or "Notes" are omitted for brevity.

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
        "field_type": "multi_link",
        "config": {
          "label": "Social Media",
          "description": "The social media profiles of the contact.",
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
      "field_type": "multi_link",
      "config": {
        "label": "Social Media",
        "description": "The social media profiles of the contact.",
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
  "item_name": "Contact",
  "position": 0,
  "config": {
    "item_name": "Contact",
    "name": "Contacts"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "social_media",
      "slug": "social_media",
      "label": "Social Media",
      "field_type": "multi_link",
      "type": "embed",
      "config": {
        "label": "Social Media",
        "slug": "social_media",
        "description": "The social media profiles of the contact.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false
      }
    }
  ]
}
```

## App update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

A `multi_link` field can be created or updated as part of an App update. Here is an example request body for updating the previously created contacts app with ID 1.
The update changes the name of the "Social Media" field to "Social Media Profiles".

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
   -u #BASE_URL: \\
   --data '{
    "app_id": 1,
    "fields": [
      {
        "field_id": 1,
        "config": {
          "label": "Social Media Profiles",
          "description": "The social media profiles of the contact.",
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
        "label": "Social Media Profiles",
        "description": "The social media profiles of the contact.",
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
  "external_id": "contacts",
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
      "external_id": "social_media",
      "slug": "social_media",
      "label": "Social Media Profiles",
      "field_type": "multi_link",
      "type": "embed",
      "config": {
        "label": "Social Media Profiles",
        "slug": "social_media",
        "description": "The social media profiles of the contact.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false
      }
    }
  ]
}```

````
