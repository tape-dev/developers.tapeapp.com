---
id: attachment
title: Attachment Field
sidebar_label: Attachment
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There are two types of attachment fields: `single_attachment` and `multi_attachment`.
`single_attachment` fields can only a single file while `multi_attachment` fields can hold multiple files.

A attachment field definition consists only of the common field properties and has no settings.

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A attachment field can be created as part of an App creation. Here is an example request body for creating an excerpt for a bug-report app within a workspace with ID 1.
The app contains a `multi_attachment` field "Screenshots". Other useful fields for a bug-report app, like "Title", "Description" or "Priority" are omitted for brevity.

`single_attachment` fields are created in the same way as `multi_attachment` fields.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{` curl -X POST #BASE_URL/v1/app/ \\
   -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \\
   --data '{
    "workspace_id": 1,
    "name": "Bug Reports",
    "item_name": "Report",
    "fields": [
      {
        "field_type": "multi_attachment",
        "config": {
          "label": "Screenshots", 
          "description": "Screenshots of the bug.",
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
  "name": "Bug Reports",
  "item_name": "Report",
  "fields": [
    {
      "field_type": "multi_attachment",
      "config": {
        "label": "Screenshots",
        "description": "Screenshots of the bug.",
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
  "slug": "bug-reports",
  "name": "Bug Reports",
  "record_name": "Report",
  "item_name": "Report",
  "position": 0,
  "config": {
    "item_name": "Report",
    "name": "Bug Reports"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "screenshots",
      "label": "Screenshots",
      "type": "file",
      "field_type": "multi_attachment",
      "config": {
        "label": "Screenshots",
        "slug": "screenshots",
        "description": "Screenshots of the bug.",
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

A attachment field can be created or updated as part of an App update. Here is an example request body for updating the previously created bug-reports app with ID 1.
The update sets the required property of "Screenshots" to true and adds a second multi_attachment field "Other Files".

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
    -u #USER_API_KEY: \\
   --data '{
    "app_id": 1,
    "fields": [
      {
        "field_id": 2,
        "config": {
          "label": "Screenshots",
          "description": "Screenshots of the bug.",
          "required": true
        }
      },
      {
        "field_type": "multi_attachment",
        "config": {
          "label": "Other Files",
          "description": "Other files related to the bug.",
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
      "field_id": 2,
      "config": {
        "label": "Screenshots",
        "description": "Screenshots of the bug.",
        "required": true
      }
    },
    {
      "field_type": "multi_attachment",
      "config": {
        "label": "Other Files",
        "description": "Other files related to the bug.",
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
  "slug": "bug-reports",
  "name": "Bug Reports",
  "record_name": "Report",
  "item_name": "Report",
  "position": 0,
  "config": {
    "item_name": "Report",
    "name": "Bug Reports"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "screenshots",
      "label": "Screenshots",
      "type": "file",
      "field_type": "multi_attachment",
      "config": {
        "label": "Screenshots",
        "slug": "screenshots",
        "description": "Screenshots of the bug.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": true
        }
      }
    },
    {
      "field_id": 2,
      "external_id": "other_files",
      "slug": "other_files",
      "label": "Other Files",
      "type": "file",
      "field_type": "multi_attachment",
      "config": {
        "label": "Other Files",
        "slug": "other_files",
        "description": "Other files related to the bug.",
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
