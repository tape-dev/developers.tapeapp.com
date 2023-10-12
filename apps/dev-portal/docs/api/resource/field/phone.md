---
id: phone
title: Phone Field
sidebar_label: Phone
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There is only type of phone field: `multi_phone`.

`multi_phone` fields can hold a one or more phone entries.

In addition to the common field properties, a phone field has the following settings:

- `only_allow_single_entry`: boolean flag, whether only a single phone entry should be allowed. (default: false). This property is not used for server side validation. If set to true, users can only add a single entry to the phone field value via the web-client. However, the API will still accept multiple entries in the field value. This property is only used for the web-client.
- `call_link_scheme`: the scheme that should be used for the call links in the web-client. Can be one of ["tel", "callto"]. (default: "tel")

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A phone field can be created as part of an App creation. Here is an example request body for creating an excerpt for a contacts app within a workspace with ID 1.
The app contains a `multi_phone` field "Phone". Other useful fields for a contacts app, like "Name", "Email" or "Address" are omitted for brevity.

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
        "field_type": "multi_phone",
        "config": {
          "label": "Phone",
          "description": "The phone of the contact.",
          "required": false,
          "settings": {
            "only_allow_single_entry": false,
            "call_link_scheme": "tel"
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
      "field_type": "multi_phone",
      "config": {
        "label": "Phone",
        "description": "The phone number(s) of the contact.",
        "required": false,
        "settings": {
          "only_allow_single_entry": false,
          "call_link_scheme": "tel"
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
  "app_id": 255,
  "workspace_id": 1,
  "slug": "contacts-1",
  "external_id": "contacts-1",
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
      "field_id": 920,
      "external_id": "phone",
      "slug": "phone",
      "label": "Phone",
      "field_type": "multi_phone",
      "type": "phone",
      "config": {
        "label": "Phone",
        "slug": "phone",
        "external_id": "phone",
        "delta": "O^",
        "position": "O^",
        "description": "The phone number(s) of the contact.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "call_link_scheme": "tel",
          "only_allow_single_entry": false
        }
      }
    }
  ]
}
```

## App update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

A phone field can be created or updated as part of an App update. Here is an example request body for updating the previously created deals app with ID 1.
The update sets the call_link_scheme to "callto".

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
          "label": "Phone",
          "description": "The phone number(s) of the contact.",
          "required": false,
          "settings": {
            "only_allow_single_entry": false,
            "call_link_scheme": "callto"
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
        "label": "Phone",
        "description": "The phone number(s) of the contact.",
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
      "slug": "phone",
      "label": "Phone",
      "field_type": "multi_phone",
      "type": "phone",
      "config": {
        "label": "Phone",
        "slug": "phone",
        "description": "The phone number(s) of the contact.",
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
