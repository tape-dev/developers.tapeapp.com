---
id: relation
title: Relation field
sidebar_label: Relation
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use a relation field to link a record to records of other database apps.

Tape has two relation field types. Both are the **Relation** field in Tape:

- `single_relation` holds one related record.
- `multi_relation` holds several related records.

A relation field has the [common field properties](/docs/api/resource/field/overview#common-properties) and `settings` with the apps it can link to. To read and write the related records of a record, see [Relation field value](/docs/api/resource/field-value/relation).

```json title="Relation field object"
{
  "field_id": 1,
  "external_id": "belongs_to_epic",
  "slug": "belongs_to_epic",
  "label": "Belongs to Epic",
  "type": "app",
  "field_type": "single_relation",
  "config": {
    "label": "Belongs to Epic",
    "slug": "belongs_to_epic",
    "external_id": "belongs_to_epic",
    "description": "The epic this issue belongs to.",
    "show_description": true,
    "required": true,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
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
            "external_id": "epics",
            "record_name": "Epic",
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
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"app"` for both relation field types. | `"app"` |
| `field_type` | `string` | `"single_relation"` or `"multi_relation"`. | `"single_relation"` |
| `config.settings.multiple` (read-only) | `boolean` | `false` for `single_relation`, `true` for `multi_relation`. | `false` |
| `config.settings.referenced_apps` | `array` | The apps whose records the field can link to. | |
| `config.settings.referenced_apps[].app_id` | `number` | ID of a linked app. Required when you create or change the field. See [Where do I find the app ID?](/docs/api/resource/app#find-app-and-field-ids). | `2` |
| `config.settings.referenced_apps[].view_id` | `number` | ID of a view of the linked app. Its filters limit the records you can select in Tape. Appears only if the field has a view. | `5` |
| `config.settings.referenced_apps[].app` (read-only) | `object` | A short preview of the linked app with `app_id`, `icon`, `name`, `slug`, `record_name`, `workspace_id` and `config`. `external_id` and `item_name` repeat `slug` and `record_name` for older integrations. | |

Find the view IDs with [Retrieve views for an app](/docs/api/resource/app#retrieve-views-for-an-app). Create and change views with the [view endpoints](/docs/api/resource/view) or in Tape.

## App creation

Use the [create app endpoint](/docs/api/resource/app#create-an-app) to create relation fields together with a new app.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

The example creates an issues app in the workspace with ID `1`. The app gets a `single_relation` field "Belongs to Epic" that links to the "Epics" app with ID `2`. Create a `multi_relation` field the same way.

Find the workspace ID with [Retrieve workspaces](/docs/api/resource/workspace#retrieve-workspaces).

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`
curl -X POST #BASE_URL/v1/app/ \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
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

```json title="Request"
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

```json title="Response"
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "development-issues",
  "external_id": "development-issues",
  "name": "Development-Issues",
  "record_name": "Issue",
  "item_name": "Issue",
  "type": "database",
  "config": {
    "item_name": "Issue",
    "name": "Development-Issues"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "belongs_to_epic",
      "slug": "belongs_to_epic",
      "label": "Belongs to Epic",
      "type": "app",
      "field_type": "single_relation",
      "config": {
        "label": "Belongs to Epic",
        "slug": "belongs_to_epic",
        "external_id": "belongs_to_epic",
        "description": "The epic this issue belongs to.",
        "show_description": false,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
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
                "external_id": "epics",
                "record_name": "Epic",
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

**General behavior**

- Each object in `referenced_apps` needs an `app_id`. `view_id` is optional and must be a number.
- Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Belongs to Epic".
- A new relation field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, a workspace role that may edit apps in the workspace, and at least **Can view** access to the linked apps. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- A mix of linked apps with and without `view_id` in `referenced_apps` returns `400` with the message `View with id undefined does not exist`. If one linked app has a `view_id`, every linked app needs one.

## App update

Use the [update app endpoint](/docs/api/resource/app#update-an-app) to create new relation fields in an app or to change existing ones.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

The example changes the field "Belongs to Epic" (ID `1`) of the issues app. It renames the field to "Belongs to" and adds the "Sprints" app with ID `3`. The views with ID `4` for "Epics" and ID `5` for "Sprints" limit the records you can select.

Change a `multi_relation` field the same way. Find the app ID and the field IDs in the [Developer view of the app](/docs/api/resource/app#find-app-and-field-ids).

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": [
      {
        "field_id": 1,
        "config": {
          "label": "Belongs to",
          "description": "The epic or sprint this issue belongs to.",
          "required": true,
          "settings": {
            "referenced_apps": [
              {
                "app_id": 2,
                "view_id": 4
              },
              {
                "app_id": 3,
                "view_id": 5
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

```json title="Request"
{
  "fields": [
    {
      "field_id": 1,
      "config": {
        "label": "Belongs to",
        "description": "The epic or sprint this issue belongs to.",
        "required": true,
        "settings": {
          "referenced_apps": [
            {
              "app_id": 2,
              "view_id": 4
            },
            {
              "app_id": 3,
              "view_id": 5
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

```json title="Response"
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "development-issues",
  "external_id": "development-issues",
  "name": "Development-Issues",
  "record_name": "Issue",
  "item_name": "Issue",
  "type": "database",
  "config": {
    "item_name": "Issue",
    "name": "Development-Issues"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "belongs_to_epic",
      "slug": "belongs_to_epic",
      "label": "Belongs to",
      "type": "app",
      "field_type": "single_relation",
      "config": {
        "label": "Belongs to",
        "slug": "belongs_to_epic",
        "external_id": "belongs_to_epic",
        "description": "The epic or sprint this issue belongs to.",
        "show_description": true,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "multiple": false,
          "referenced_apps": [
            {
              "app_id": 2,
              "view_id": 4,
              "app": {
                "app_id": 2,
                "icon": "event_available",
                "name": "Epics",
                "slug": "epics",
                "external_id": "epics",
                "record_name": "Epic",
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
              "view_id": 5,
              "app": {
                "app_id": 3,
                "icon": "event_available",
                "name": "Sprints",
                "slug": "sprints",
                "external_id": "sprints",
                "record_name": "Sprint",
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

**General behavior**

- A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
- Send all linked apps in `referenced_apps`, not only the ones you add. Tape removes linked apps that aren't in the request.
- Without `settings`, Tape removes all linked apps of the field.
- Renaming a field keeps its `slug`. The renamed field "Belongs to" still has the slug `belongs_to_epic`.
- Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](/docs/api/resource/field/overview#create-and-update-fields).
- Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, **Full access** to the app, and at least **Can view** access to the linked apps. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.
- A mix of linked apps with and without `view_id` in `referenced_apps` returns `400` with the message `View with id undefined does not exist`. If one linked app has a `view_id`, every linked app needs one.

## Next steps

- [Relation field value](/docs/api/resource/field-value/relation): read and write the related records of a record.
- [Find relatable records](/docs/api/resource/record#find-relatable-records-for-a-relation-field): search for records you can add to a relation field.
- [View](/docs/api/resource/view): create the views that limit the records you can select.
- [Field](/docs/api/resource/field/overview): the properties all field types share.
- [App](/docs/api/resource/app): create, update and delete apps with their fields.
- [Capabilities](/docs/api/capabilities): what `apps:edit` allows.
