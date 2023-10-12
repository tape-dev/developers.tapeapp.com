---
id: location
title: Location Field
sidebar_label: Location
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There is only type of location field: `single_location`.

`single_location` fields can only hold a single location, including the address properties and a map preview.

In addition to the common field properties, a location field has the following settings:

- `has_map` (optional): boolean flag, whether the google maps embed should be shown in the location field values of this field. (default: false)

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A location field can be created as part of an App creation. Here is an example request body for creating an excerpt for a meetings app within a workspace with ID 1.
The app contains a `single_location` field "Location". Other useful fields for a meetings app, like "Date", "Participants" or "Notes" are omitted for brevity.

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
        "field_type": "single_location",
        "config": {
          "label": "Location",
          "description": "The location of the meeting.",
          "required": false,
          "settings": {
            "has_map": true
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
  "name": "Meetings",
  "item_name": "Meeting",
  "fields": [
    {
      "field_type": "single_location",
      "config": {
        "label": "Location",
        "description": "The location of the meeting.",
        "required": false,
        "settings": {
          "has_map": true
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
  "slug": "meetings",
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
      "slug": "location",
      "label": "Location",
      "type": "location",
      "field_type": "single_location",
      "config": {
        "label": "Location",
        "slug": "location",
        "description": "The location of the meeting.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "has_map": true
        }
      }
    }
  ]
}
```

## App update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

A location field can be created or updated as part of an App update. Here is an example request body for updating the previously created meetings app with ID 1.
The update sets the `has_map` flag to false.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
  -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \
   --data '{
    "app_id": 1,
    "name": "Meetings",
    "item_name": "Meeting",
    "fields": [
      {
        "field_id": 1,
        "config": {
          "label": "Location",
          "description": "The location of the meeting.",
          "required": false,
          "settings": {
            "has_map": false
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
  "name": "Meetings",
  "item_name": "Meeting",
  "fields": [
    {
      "field_id": 1,
      "config": {
        "label": "Location",
        "description": "The location of the meeting.",
        "required": false,
        "settings": {
          "has_map": false
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
    "slug": "meetings",
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
        "external_id": "location",
        "slug": "location",
        "label": "Location",
        "type": "location",
        "field_type": "single_location",
        "config": {
          "label": "Location",
          "slug": "location",
          "description": "The location of the meeting.",
          "required": false,
          "always_hidden": false,
          "hidden_if_empty": false,
          "settings": {
            "has_map": false
          }
        }
      }
    ]
}```

````
