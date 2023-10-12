---
id: category
title: Category Field
sidebar_label: Category
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There are two types of category fields: `single_category` and `multi_category`.

`single_category` fields can only hold a single selected option while `multi_category` fields can hold multiple selected options.

In addition to the common field properties, a category field definition has a `settings` property containing the selectable `options` of the field.
The `options` property is an array of objects with the following properties:

- `id`: Once an option has been created, the id property can be used to update the option. This is also the id of the option that is used to specify an option within record update or creation.
- `text` (required): The text (= label) of the option. This is the name of the option that is displayed to the user.
- `color` (optional): The color of the option. This is the color of the option that is displayed to the user. The color can be one of ["gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"]

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A category field can be created as part of an App creation. Here is an example request body for creating an excerp of a leads app within a workspace with ID 1.

The app contains a `single_category` field "Pipeline Stage". Other useful fields for a leads app, like "Name", "Company" or "Notes" are omitted for brevity.
`multi_category` fields are created in the same way as `single_category` fields.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X POST http://localhost:3000/v1/app/ \\
   -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \\
   --data '{
    "workspace_id": 1,
    "name": "Leads",
    "item_name": "Lead",
    "fields": [
      {
        "field_type": "single_category",
        "config": {
          "label": "Pipeline Stage",
          "description": "The current stage of the lead in the sales pipeline.",
          "required": true,
          "settings": {
            "options": [
              {
                "text": "New",
                "color": "gray"
              },
              {
                "text": "Contacted",
                "color": "blue"
              },
              {
                "text": "Won",
                "color": "green"
              },
              {
                "text": "Lost",
                "color": "red"
              }
            ]
          }
        }
      },
    ] 
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "workspace_id": 1,
  "name": "Leads",
  "item_name": "Lead",
  "fields": [
    {
      "field_type": "single_category",
      "config": {
        "label": "Pipeline Stage",
        "description": "The current stage of the lead in the sales pipeline.",
        "required": true,
        "settings": {
          "options": [
            {
              "text": "New",
              "color": "gray"
            },
            {
              "text": "Contacted",
              "color": "blue"
            },
            {
              "text": "Won",
              "color": "green"
            },
            {
              "text": "Lost",
              "color": "red"
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
  "slug": "leads",
  "external_id": "leads",
  "name": "Leads",
  "item_name": "Lead",
  "config": {
    "item_name": "Lead",
    "name": "Leads"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "pipeline_stage",
      "label": "Pipeline Stage",
      "type": "category",
      "field_type": "single_category",
      "config": {
        "label": "Pipeline Stage",
        "slug": "pipeline_stage",
        "description": "The current stage of the lead in the sales pipeline.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": false,
          "options": [
            {
              "id": 1,
              "text": "New",
              "color": "GRAY"
            },
            {
              "id": 2,
              "text": "Contacted",
              "color": "BLUE"
            },
            {
              "id": 3,
              "text": "Won",
              "color": "GREEN"
            },
            {
              "id": 4,
              "text": "Lost",
              "color": "RED"
            }
          ]
        }
      }
    }
  ]
}
```

## App update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

A category field can be created or updated as part of an App update. Here is an example request body for updating the previously created contacts app with ID 1.
The update adds an option "Negoatiating" to the "Pipeline Stage" field and updates the color of the "Lost" option to "orange".
When updating a category field, the order of the options in the input is preserved in case you specify all existing options.

In case you want to remove one or multiple options from a `category` field, you can specify the property `options_to_delete` within the `settings` property of the field.
Just add the options you want to delete to the `options_to_delete` array. The options are identified by their `id` property.

`multi_category` fields are updated in the same way as `single_category` fields.

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
        "field_id": 1,
        "config": {
          "settings": {
            "label": "Pipeline Stage",
            "options": [
              {
                "id": 1,
                "text": "New",
                "color": "gray"
              },
              {
                "id": 2,
                "text": "Contacted",
                "color": "blue"
              },
              {
                "text": "Negoatiating",
                "color": "yellow"
              },
              {
                "id": 3,
                "text": "Won",
                "color": "green"
              },
              {
                "id": 4,
                "text": "Lost",
                "color": "orange"
              },
            ],
            "options_to_delete": []
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
      "field_id": 1,
      "config": {
        "label": "Pipeline Stage",
        "settings": {
          "options": [
            {
              "id": 1,
              "text": "New",
              "color": "gray"
            },
            {
              "id": 2,
              "text": "Contacted",
              "color": "blue"
            },
            {
              "text": "Negoatiating",
              "color": "yellow"
            },
            {
              "id": 3,
              "text": "Won",
              "color": "green"
            },
            {
              "id": 4,
              "text": "Lost",
              "color": "orange"
            }
          ],
          "options_to_delete": []
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
  "slug": "leads",
  "external_id": "leads",
  "name": "Leads",
  "record_name": "Lead",
  "item_name": "Lead",
  "position": 0,
  "config": {
    "item_name": "Lead",
    "name": "Leads"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "pipeline_stage",
      "slug": "pipeline_stage",
      "label": "Pipeline Stage",
      "type": "category",
      "field_type": "single_category",
      "config": {
        "label": "Pipeline Stage",
        "slug": "pipeline_stage",
        "description": "The current stage of the lead in the sales pipeline.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": false,
          "options": [
            {
              "id": 1,
              "text": "New",
              "color": "GRAY"
            },
            {
              "id": 6,
              "text": "Contacted",
              "color": "BLUE"
            },
            {
              "id": 3,
              "text": "Negoatiating",
              "color": "YELLOW"
            },
            {
              "id": 4,
              "text": "Won",
              "color": "GREEN"
            },
            {
              "id": 5,
              "text": "Lost",
              "color": "ORANGE"
            }
          ]
        }
      }
    }
  ]
}
```

````
