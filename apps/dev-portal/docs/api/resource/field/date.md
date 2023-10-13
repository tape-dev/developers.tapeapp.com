---
id: date
title: Date Field
sidebar_label: Date
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There are two types of date fields: `single_date` and `range_date`.
`single_date` field-values can only hold a single date, while `range_date` fields can hold a both, single dates as well as date ranges consisting of a start and end date.

In addition to the common field properties, a `single_date` field definition has a `settings` property containing the following properties:

- `calendar` (optional): boolean flag (default: false) whether the records that have a value for this field should be shown in the sidebar-calendar or be included in the iCal exports
- `time` (optional): This property specifies whether the date field values should/ have to include a time component. Can be one of ["disabled", "enabled", "required"];
- `is_due_date_of_status_field` (optional): boolean flag (default: false) whether the date field values should be used as due date of the status field of the app. Can only be set if the app has a status field.

In addition to the common field properties, a `range_date` field definition has a `settings` property containing the following properties:

- `calendar` (optional): boolean flag (default: false) whether the records that have a value for this field should be shown in the sidebar-calendar or be included in the iCal exports
- `time` (optional): This property specifies whether the date field values should/ have to include a time component. Can be one of ["disabled", "enabled", "required"];
- `is_due_date_of_status_field` (optional): boolean flag (default: false) whether the date field values should be used as due date of the status field of the app. Can only be set if the app has a status field.
- `end` (required): This property specifies whether the date field values should/ have to include an end date component. Can be one of ["enabled", "required"]. Use a `single_date` field if you want to disable setting an end date in the field values.

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A date field can be created as part of an App creation. Here is an example request body for creating an excerpt for a Event app within a workspace with ID 1.
The app contains a `single_date` field "Event date", and a `range_date` field "Preparation period". Other useful fields for an event app, like "Name" or "Location" are omitted for brevity.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X POST #BASE_URL/v1/app/ \\
   -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \\
   --data '{
    "workspace_id": 1,
    "name": "Events",
    "item_name": "Event",
    "fields": [
      {
        "field_type": "single_date",
        "config": {
          "label": "Event date",
          "description": "The date of the event.",
          "required": true,
          "settings": {
            "calendar": false,
            "time": "disabled",
            "is_due_date_of_status_field": false
          }
        }
      },
      {
        "field_type": "range_date",
        "config": {
          "label": "Preparation period",
          "description": "The period of time before the event.",
          "required": false,
          "settings": {
            "calendar": false,
            "time": "disabled",
            "is_due_date_of_status_field": false,
            "end": "required"
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
  "name": "Events",
  "item_name": "Event",
  "fields": [
    {
      "field_type": "single_date",
      "config": {
        "label": "Event date",
        "description": "The date of the event.",
        "required": true,
        "settings": {
          "calendar": false,
          "time": "disabled",
          "is_due_date_of_status_field": false
        }
      }
    },
    {
      "field_type": "range_date",
      "config": {
        "label": "Preparation period",
        "description": "The period of time before the event.",
        "required": false,
        "settings": {
          "calendar": false,
          "time": "disabled",
          "is_due_date_of_status_field": false,
          "end": "required"
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
  "slug": "events",
  "name": "Events",
  "item_name": "Event",
  "position": 0,
  "config": {
    "item_name": "Event",
    "name": "Events"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "event_date",
      "label": "Event date",
      "type": "date",
      "field_type": "single_date",
      "config": {
        "label": "Event date",
        "slug": "event_date",
        "description": "The date of the event.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "calendar": false,
          "time": "disabled",
          "is_due_date_of_status_field": false
        }
      }
    },
    {
      "field_id": 2,
      "slug": "preparation_period",
      "label": "Preparation period",
      "type": "date",
      "field_type": "range_date",
      "config": {
        "label": "Preparation period",
        "slug": "preparation_period",
        "description": "The period of time before the event.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "calendar": false,
          "time": "disabled",
          "end": "required",
          "is_due_date_of_status_field": false
        }
      }
    }
  ]
}
```

## App update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

A date field can be created or updated as part of an App update. Here is an example request body for updating the previously created events app with ID 1.
The update sets the `calendar` property of the "Event date" field to `true` sets the `end` property of the "Preparation period" field to `enabled`.

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
        "field_id": 1,
        "config": {
          "label": "Event date",
          "description": "The date of the event.",
          "required": true,
          "settings": {
            "calendar": true,
            "time": "disabled",
            "is_due_date_of_status_field": false
          }
        }
      },
      {
        "field_id": 2,
        "config": {
          "label": "Preparation period",
          "description": "The period of time before the event.",
          "required": false,
          "settings": {
            "end": "enabled",
            "calendar": false,
            "time": "disabled",
            "is_due_date_of_status_field": false
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
        "label": "Event date",
        "description": "The date of the event.",
        "required": true,
        "settings": {
          "calendar": true,
          "time": "disabled",
          "is_due_date_of_status_field": false
        }
      }
    },
    {
      "field_id": 2,
      "config": {
        "label": "Preparation period",
        "description": "The period of time before the event.",
        "required": false,
        "settings": {
          "end": "enabled",
          "calendar": false,
          "time": "disabled",
          "is_due_date_of_status_field": false
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
  "slug": "events",
  "name": "Events",
  "item_name": "Event",
  "position": 0,
  "config": {
    "item_name": "Event",
    "name": "Events"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "event_date",
      "label": "Event date",
      "type": "date",
      "field_type": "single_date",
      "config": {
        "label": "Event date",
        "slug": "event_date",
        "description": "The date of the event.",
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "calendar": true,
          "time": "disabled",
          "is_due_date_of_status_field": false
        }
      }
    },
    {
      "field_id": 2,
      "external_id": "preparation_period",
      "slug": "preparation_period",
      "label": "Preparation period",
      "type": "date",
      "field_type": "range_date",
      "config": {
        "label": "Preparation period",
        "slug": "preparation_period",
        "description": "The period of time before the event.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "calendar": false,
          "time": "disabled",
          "end": "enabled",
          "is_due_date_of_status_field": false
        }
      }
    }
  ]
}```

````
