---
id: email
title: Email Field
sidebar_label: Email
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There is only type of email field: `multi_email`.

`multi_email` fields can hold a one or more email entries.

In addition to the common field properties, a email field has the following settings:

- `only_allow_single_entry` (optional): boolean flag, whether only a single email entry should be allowed. (default: false). This property is not used for server side validation. If set to true, users can only add a single entry to the email field value via the web-client. However, the API will still accept multiple entries in the field value. This property is only used for the web-client.

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A email field can be created as part of an App creation. Here is an example request body for creating an excerpt for a contacts app within a workspace with ID 1.
The app contains a `multi_email` field "Email". Other useful fields for a contacts app, like "Name", "Phone" or "Address" are omitted for brevity.

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
        "field_type": "multi_email",
        "config": {
          "label": "Email",
          "description": "The email(s) of the contact.",
          "required": false,
          "settings": {
            "only_allow_single_entry": false
          }
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
      "field_type": "multi_email",
      "config": {
        "label": "Email",
        "description": "The email(s) of the contact.",
        "required": false,
        "settings": {
          "only_allow_single_entry": false
        }
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
      "slug": "email",
      "label": "Email",
      "field_type": "multi_email",
      "type": "email",
      "config": {
        "label": "Email",
        "slug": "email",
        "description": "The email(s) of the contact.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "only_allow_single_entry": false
        }
      }
    }
  ]
}
```

## App update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

A email field can be created or updated as part of an App update. Here is an example request body for updating the previously created contacts app with ID 1.
The update sets the `only_allow_single_entry` setting to true.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
  -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \
   --data '{
    "app_id": 1,
    "name": "Contacts",
    "item_name": "Contact",
    "fields": [
      {
        "field_id": 1,
        "config": {
          "label": "Email",
          "description": "The email(s) of the contact.",
          "required": false,
          "settings": {
            "only_allow_single_entry": true
          }
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
        "label": "Email",
        "description": "The email(s) of the contact.",
        "required": false,
        "settings": {
          "only_allow_single_entry": true
        }
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
      "slug": "email",
      "label": "Email",
      "field_type": "multi_email",
      "type": "email",
      "config": {
        "label": "Email",
        "slug": "email",
        "description": "The email(s) of the contact.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "only_allow_single_entry": true
        }
      }
    }
  ]
}```

````
