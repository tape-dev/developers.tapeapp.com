---
id: status
title: Status Field
sidebar_label: Status
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

## What is a Status field?

Status fields are a special field type within Tape that are used to represent task-like records.
Status fields are created or updated like `single_category` fields, with one difference: The options of a status field have a required `means_completed` property.

An option with `means_completed` set to true means that the record is resolved. Descriptive labels for such an option could be e.g. ("Done", "Discarded", "Duplicate")
An option with `means_completed` set to false means that the record is not yet resolved. Descriptive labels for such an option could be e.g. ("Open", "In Progress", "Blocked")

The `means_completed` property of a status option determines whether the record that has this option selected within its status field value, is added to, or removed from the Focus section within the Home section of Tape.
For further information on the Focus feature or on how to configure an App so that its records land in a users Focus section, please refer to https://help.tapeapp.com/en/articles/6394049-focus

## Working with Status fields

`status` field values can only hold a single selected option. There is no multi-select version of a `status` field.

Within Tape, a record can have maximally one status, therefore you can only add up to one `status` field to an App.

A `status` field must be set to `required`. In case an App has a `status` field, each record within this app needs to select an option for this field in order to be created or updated.

A `status` field must specify at least one option with `means_completed` set to true and at least one option with `means_completed` set to false.

## Properties

In addition to the common field properties, a status field definition has a `settings` property containing the selectable `options` of the field.
The `options` property is an array of objects with the following properties:

- `id`: Once an option has been created, the id property can be used to update the option. This is also the id of the option that is used to specify an option within record update or creation.
- `text` (required): The text (=label) of the option. This is the name of the option that is displayed to the user.
- `means_completed` (required): Whether this status-options means that the task it refers to is completed or not.
- `color` (optional): The color of the option. This is the color of the option that is displayed to the user. The color can be one of ["gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"]

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A status field can be created as part of an App creation. Here is an example request body for creating an excerp of a Tasks app within a workspace with ID 1.

The app contains a `status` field "Status". Other useful fields for a Tasks app, like "Title", "Due Date" or "Description" are omitted for brevity.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X POST http://localhost:3000/v1/app/ \\
   -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \\
   --data '{
    "workspace_id": 1,
    "name": "Tasks",
    "item_name": "Task",
    "fields": [
      {
        "field_type": "status",
        "config": {
          "label": "Status",
          "description": "The current status of the task.",
          "required": true,
          "settings": {
            "options": [
              {
                "text": "Open",
                "color": "blue",
                "means_completed": false
              },
              {
                "text": "In Progress",
                "color": "yellow",
                "means_completed": false
              },
              {
                "text": "Done",
                "color": "green",
                "means_completed": true
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
  "name": "Tasks",
  "item_name": "Task",
  "fields": [
    {
      "field_type": "status",
      "config": {
        "label": "Status",
        "description": "The current status of the task.",
        "required": true,
        "settings": {
          "options": [
            {
              "text": "Open",
              "color": "blue",
              "means_completed": false
            },
            {
              "text": "In Progress",
              "color": "yellow",
              "means_completed": false
            },
            {
              "text": "Done",
              "color": "green",
              "means_completed": true
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
  "slug": "tasks",
  "external_id": "tasks",
  "name": "Tasks",
  "item_name": "Task",
  "config": {
    "item_name": "Task",
    "name": "Tasks"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "status",
      "label": "Status",
      "field_type": "status",
      "type": "category",
      "config": {
        "label": "Status",
        "slug": "status",
        "description": "The current status of the task.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": false,
          "options": [
            {
              "id": 1,
              "text": "Open",
              "color": "BLUE",
              "means_completed": false
            },
            {
              "id": 2,
              "text": "In Progress",
              "color": "YELLOW",
              "means_completed": false
            },
            {
              "id": 3,
              "text": "Done",
              "color": "GREEN",
              "means_completed": true
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

A status field can be created or updated as part of an App update. Here is an example request body for updating the previously created contacts app with ID 1.
The update adds an option "Discarded" to the "Status" field.
When updating a status field, the order of the options in the input is preserved in case you specify all existing options.

In case you want to remove one or multiple options from a `status` field, you can specify the property `options_to_delete` within the `settings` property of the field.
Just add the options you want to delete to the `options_to_delete` array. The options are identified by their `id` property.

Attention: In case you delete a status option, all status field values that have this option selected, will be migrated to the first option (smallest position/index) of the status field that has the same means_completed property as the deleted option.
In our example below: If we would delete the "Open" option, all status field values that have the "Open" option selected, would be migrated to the "In Progress" option, because both options have `means_completed` set to false.

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
            "label": "Status",
            "options": [
              {
                "id": 1,
                "text": "Open",
                "color": "blue",
                "means_completed": false
              },
              {
                "id": 2,
                "text": "In Progress",
                "color": "yellow",
                "means_completed": false
              },
              {
                "id": 3,
                "text": "Done",
                "color": "green",
                "means_completed": true
              },
              {
                "text": "Discarded",
                "color": "red",
                "means_completed": true
              }
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
        "settings": {
          "options": [
            {
              "id": 1,
              "text": "Open",
              "color": "blue",
              "means_completed": false
            },
            {
              "id": 2,
              "text": "In Progress",
              "color": "yellow",
              "means_completed": false
            },
            {
              "id": 3,
              "text": "Done",
              "color": "green",
              "means_completed": true
            },
            {
              "text": "Discarded",
              "color": "red",
              "means_completed": true
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
  "slug": "tasks",
  "external_id": "tasks",
  "name": "Tasks",
  "item_name": "Task",
  "config": {
    "item_name": "Task",
    "name": "Tasks"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "status",
      "label": "Status",
      "field_type": "status",
      "type": "category",
      "config": {
        "label": "Status",
        "slug": "status",
        "description": "The current status of the task.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "multiple": false,
          "options": [
            {
              "id": 1,
              "text": "Open",
              "color": "BLUE",
              "means_completed": false
            },
            {
              "id": 2,
              "text": "In Progress",
              "color": "YELLOW",
              "means_completed": false
            },
            {
              "id": 3,
              "text": "Done",
              "color": "GREEN",
              "means_completed": true
            }
          ]
        }
      }
    }
  ]
}
```

````
