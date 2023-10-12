---
id: relation
title: Relation Field
sidebar_label: Relation
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There are two types of relation fields: `single_relation` and `multi_relation`.

`single_relation` fields can only hold a single record reference while `multi_relation` fields can hold multiple record references.

In addition to the common field properties, a relation field definition has a `settings` property `referenced_apps` containing the IDs of the apps that can be referenced by the field.
When creating a record with a relation field value, only records of apps specified in the field definitions `referenced_apps` can be referenced.

The `referenced_apps` property is an array of objects with the following properties:

- `app_id` (required): The ID of the referenced app. You can only reference Apps to which you have access to.
- `view_id` (optional): The ID of the view that is used to restrict the referencable records with filters. (currently no enpoints to create or update views exist, but views can be created and updated via the web application)

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A relation field can be created as part of an App creation. Here is an example request body for creating an excerp of a Development-Issues app within a workspace with ID 1.

The app contains a `single_relation` field "Belongs to Epic" with a reference to the "Epics" app with ID 2.

`multi_relation` fields are created in the same way as `single_relation` fields.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X POST http://localhost:3000/v1/app/ \\
   -u user_key_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiLvv73vv71pRFx1MDAxZO-_vVx1MDAxOVx1MDAxMO-_ve-_vSIsInNjb3BlIjoidWtfdjEifQ.Ha7x9lzDY05K_-CtKjc92RKP6XlofiU1dhgWHAiUr_4: \\
   -H "Content-Type: application/json" \\
   --data '{
    "workspace_id": 1,
    "name": "Development-Issues",
    "item_name": "Issue",
    "fields": [
      {
        "field_type": "single_relation",
        "config": {
          "label": "Belongs to Epic",
          "description": "The epic this issue belongs to.",
          "required": true,
          "settings": {
            "referenced_apps": [
              {
                "app_id": 2
              }
            ]
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
  "name": "Development-Issues",
  "item_name": "Issue",
  "fields": [
    {
      "field_type": "single_relation",
      "config": {
        "label": "Belongs to Epic",
        "description": "The epic this issue belongs to.",
        "required": true,
        "settings": {
          "referenced_apps": [
            {
              "app_id": 2
            }
          ]
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
  "slug": "development-issues",
  "name": "Development-Issues",
  "record_name": "Issue",
  "item_name": "Issue",
  "config": {
    "item_name": "Issue",
    "name": "Development-Issues"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "belongs_to_epic",
      "label": "Belongs to Epic",
      "type": "app",
      "field_type": "single_relation",
      "config": {
        "label": "Belongs to Epic",
        "slug": "belongs_to_epic",
        "external_id": "belongs_to_epic",
        "description": "The epic this issue belongs to.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": false,
          "referenced_apps": [
            {
              "app_id": 2,
              "app": {
                "app_id": 2,
                "icon": "event_available",
                "name": "Epics",
                "slug": "epics",
                "item_name": "Epic",
                "workspace_id": 1,
                "config": {
                  "name": "Epics",
                  "icon": "event_available",
                  "record_name": "Epic",
                  "workspace_id": 1
                }
              }
            }
          ]
        }
      }
    }
  ]
}
```

## App update

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app/{appId}" />

A relation field can be created or updated as part of an App update. Here is an example request body for updating the previously created Development-Issues app with ID 1.
The update adds a reference to the "Sprints" app with ID 3 to the "Belongs to Epic" field, and renames the field to "Belongs to".
When updating a relation field, you need to specify all referenced apps again, not just the ones you want to add or remove. Referenced apps that exist in a field and are not specified in the update request are removed from the field.

`multi_relation` fields are updated in the same way as `single_relation` fields.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X PUT http://localhost:3000/v1/app/1 \\
   -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \\
   --data '{
    "app_id": 1,
    "fields": [
      {
        "field_type": "single_relation",
        "config": {
          "label": "Belongs to",
          "description": "The epic or sprint this issue belongs to.",
          "required": true,
          "settings": {
            "referenced_apps": [
              {
                "app_id": 2
              },
              {
                "app_id": 3
              }
            ]
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
  "fields": [
    {
      "field_type": "single_relation",
      "config": {
        "label": "Belongs to",
        "description": "The epic or sprint this issue belongs to.",
        "required": true,
        "settings": {
          "referenced_apps": [
            {
              "app_id": 2
            },
            {
              "app_id": 3
            }
          ]
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
  "slug": "development-issues",
  "name": "Development-Issues",
  "record_name": "Issue",
  "item_name": "Issue",
  "config": {
    "item_name": "Issue",
    "name": "Development-Issues"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "belongs_to_epic",
      "label": "Belongs to Epic",
      "type": "app",
      "field_type": "single_relation",
      "config": {
        "label": "Belongs to Epic",
        "slug": "belongs_to_epic",
        "external_id": "belongs_to_epic",
        "description": "The epic this issue belongs to.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": false,
          "referenced_apps": [
            {
              "app_id": 2,
              "app": {
                "app_id": 2,
                "icon": "event_available",
                "name": "Epics",
                "slug": "epics",
                "item_name": "Epic",
                "workspace_id": 1,
                "config": {
                  "name": "Epics",
                  "icon": "event_available",
                  "record_name": "Epic",
                  "workspace_id": 1
                }
              }
            },
            {
              "app_id": 3,
              "app": {
                "app_id": 3,
                "icon": "event_available",
                "name": "Sprints",
                "slug": "sprints",
                "item_name": "Sprint",
                "workspace_id": 1,
                "config": {
                  "name": "Sprints",
                  "icon": "event_available",
                  "record_name": "Sprint",
                  "workspace_id": 1
                }
              }
            }
          ]
        }
      }
    }
  ]
}
```

````
