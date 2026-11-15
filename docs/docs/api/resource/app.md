# App

> Use these endpoints to create, read, update and delete the apps of a workspace.

Use these endpoints to create, read, update and delete the apps of a workspace.

An *app* belongs to exactly one workspace. A database app holds records of one kind. To find an app by name across all workspaces, use the [Search resource](https://developers.tapeapp.com/docs/api/resource/search).

> Which capability do I need?
> 
> Endpoints that read apps need `apps:read`. Endpoints that change apps need `apps:edit`. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).

> Where do I find the app ID and field IDs?
> 
> In Tape, open the app menu (**Follow, export and more…**) and select **Developer**. It shows the **Workspace ID**, the **App ID** and, for each field, its **Field ID** and **External ID** (the field's slug). Through the API, [Retrieve all available apps](#retrieve-all-available-apps) returns every `app_id`, and [Retrieve a single app](#retrieve-a-single-app) returns the `field_id` and `slug` of every field.

## The app object

[Retrieve a single app](#retrieve-a-single-app), [Create an app](#create-an-app) and [Update an app](#update-an-app) return the full app object with all its fields:

*App*

```json
{
  "app_id": 1,
  "workspace_id": 1,
  "workspace_name": "CRM",
  "slug": "contacts",
  "external_id": "contacts",
  "name": "Contacts",
  "record_name": "Contact",
  "item_name": "Contact",
  "type": "database",
  "description": "A simple contact app.",
  "position": 0,
  "config": {
    "description": "A simple contact app.",
    "item_name": "Contact",
    "name": "Contacts",
    "icon": {
      "type": "graphic",
      "id": "contacts"
    },
    "item_icon": {
      "type": "graphic",
      "id": "person"
    }
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "name",
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Name",
        "slug": "name",
        "external_id": "name",
        "description": "The full name of the contact.",
        "show_description": true,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "formatted": false,
          "format": "plain"
        }
      }
    }
  ]
}
```

The list endpoints [Retrieve apps for a workspace](#retrieve-apps-for-a-workspace) and [Retrieve all available apps](#retrieve-all-available-apps) return a preview of each app: the same properties without `fields`, and `config` without `icon` and `item_icon`.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `app_id` | number | The app ID. | `1` |
| `workspace_id` | number | The workspace the app belongs to. | `1` |
| `workspace_name` | string | Name of that workspace. | `"CRM"` |
| `slug` | string | Slug of the app, unique in its workspace. | `"contacts"` |
| `external_id` | string | *Deprecated.* Same as `slug`. | `"contacts"` |
| `name` | string | Name of the app. | `"Contacts"` |
| `record_name` | string | Name of one record, for example `Contact`. | `"Contact"` |
| `item_name` | string | *Deprecated.* Same as `record_name`. | `"Contact"` |
| `type` | `"database"` | `"dashboard"` | `"form"` | The kind of app. Untyped and legacy apps return `"database"`. | `"database"` |
| `description` | string | Description of the app. Missing when the app has no description. | `"A simple contact app."` |
| `position` | number | Position of the app in its workspace. | `0` |
| `config` | object | Copy of `description`, `item_name` and `name`, plus `icon` and `item_icon` when set. See [Icon](https://developers.tapeapp.com/docs/api/resource/icon). | `{ "name": "Contacts", "item_name": "Contact" }` |
| `fields` | array | Every field of the app, in the order of the app. See [The field object](#the-field-object). | `[{ "field_id": 1, … }]` |

### The field object

Each entry in `fields` describes one field. The format of `config.settings` depends on the field type. See [Fields](https://developers.tapeapp.com/docs/api/resource/field/overview).

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `field_id` | number | The field ID. | `1` |
| `slug` | string | Slug of the field, unique in its app. Use it as a key in the `fields` of a record. | `"name"` |
| `external_id` | string | *Deprecated.* Same as `slug`. | `"name"` |
| `label` | string | Name of the field. | `"Name"` |
| `field_type` | string | The field type. It tells single and multi fields apart, for example `single_category` and `multi_category`. | `"single_text"` |
| `type` | string | The data type, the same for single and multi fields. Prefer `field_type`. | `"text"` |
| `config.label` | string | Same as `label`. | `"Name"` |
| `config.slug` | string | Same as `slug`. | `"name"` |
| `config.external_id` | string | *Deprecated.* Same as `slug`. | `"name"` |
| `config.description` | string | Help text of the field. Missing when the field has none. | `"The full name of the contact."` |
| `config.show_description` | boolean | `true` if records show the help text. A new `single_text` or `multi_text` field with a `description` gets `true`, a new field of another type gets `false`. For updates, see [Fields](https://developers.tapeapp.com/docs/api/resource/field/overview). | `true` |
| `config.required` | boolean | `true` if every record needs a value. | `true` |
| `config.always_hidden` | boolean | `true` if every record hides the field. | `false` |
| `config.hidden_if_empty` | boolean | `true` if records hide the field while it has no value. | `false` |
| `config.primary` | boolean | `true` for the primary field. Its value names each record. Some database apps have no primary field. | `true` |
| `config.settings` | object | Settings of the field type. | `{ "formatted": false, "format": "plain" }` |

## Retrieve apps for a workspace

Use this endpoint to list all apps of one workspace.

`GET https://api.tapeapp.com/v1/app/workspace/{workspace_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/app/workspace/200 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "total": 2,
  "apps": [
    {
      "app_id": 1,
      "workspace_id": 200,
      "name": "Tasks",
      "record_name": "Task",
      "slug": "tasks",
      "type": "database",
      "config": {
        "item_name": "Task",
        "name": "Tasks"
      }
    },
    {
      "app_id": 2,
      "workspace_id": 200,
      "name": "Projects",
      "record_name": "Project",
      "slug": "projects",
      "type": "database",
      "config": {
        "item_name": "Project",
        "name": "Projects"
      }
    }
  ]
}
```

The example lists the apps of the workspace with ID `200`, without their fields. To read the fields, retrieve the app by its ID.

**Requirements:** `apps:read`. Works with a personal access token, an OAuth access token or a user API key.

## Retrieve all available apps

Use this endpoint to list the apps of all workspaces you have access to.

`GET https://api.tapeapp.com/v1/app`

*Request*

```shell
curl https://api.tapeapp.com/v1/app \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "total": 3,
  "apps": [
    {
      "app_id": 1,
      "workspace_id": 200,
      "workspace_name": "Task management",
      "name": "Tasks",
      "record_name": "Task",
      "slug": "tasks",
      "type": "database",
      "config": {
        "item_name": "Task",
        "name": "Tasks"
      }
    },
    {
      "app_id": 2,
      "workspace_id": 200,
      "workspace_name": "Task management",
      "name": "Projects",
      "record_name": "Project",
      "slug": "projects",
      "type": "database",
      "config": {
        "item_name": "Project",
        "name": "Projects"
      }
    },
    {
      "app_id": 3,
      "workspace_id": 300,
      "workspace_name": "CRM",
      "name": "Contacts",
      "record_name": "Contact",
      "slug": "contacts",
      "type": "database",
      "config": {
        "item_name": "Contact",
        "name": "Contacts"
      }
    }
  ]
}
```

Every app carries `workspace_id` and `workspace_name`. The response doesn't contain the fields.

**Requirements:** `apps:read`. Works with a personal access token, an OAuth access token or a user API key.

## Retrieve a single app

Use this endpoint to read one app together with all its fields.

`GET https://api.tapeapp.com/v1/app/{app_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "app_id": 1,
  "workspace_id": 200,
  "name": "Tasks",
  "record_name": "Task",
  "slug": "tasks",
  "type": "database",
  "config": {
    "item_name": "Task",
    "name": "Tasks"
  },
  "fields": [
    {
      "field_id": 1,
      "slug": "full_name",
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Full Name",
        "show_description": false,
        "required": false,
        "primary": true,
        "settings": {
          "formatted": false,
          "format": "plain"
        }
      }
    }
  ]
}
```

The response is the full [app object](#the-app-object), with every field of the app.

**Requirements:** `apps:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

## Retrieve views for an app

Use this endpoint to list the public views of an app.

`GET https://api.tapeapp.com/v1/app/{app_id}/views`

*Request*

```shell
curl https://api.tapeapp.com/v1/app/1/views \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "views": [
    {
      "id": 500,
      "view_id": 500,
      "name": "Open Tasks",
      "app_id": 1,
      "is_default": true,
      "layout": "list",
      "private": false
    },
    {
      "id": 501,
      "view_id": 501,
      "name": "Completed Tasks",
      "app_id": 1,
      "is_default": false,
      "layout": "table",
      "private": false
    }
  ],
  "total": 2
}
```

Each entry is a *preview* with the ID, name, layout and default flag of the view. To read the full definition of a view, or to create, update, promote or delete views, use the [View resource](https://developers.tapeapp.com/docs/api/resource/view).

**Requirements:** `apps:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

## Create an app

Use this endpoint to create an app in a workspace, with or without fields.

`POST https://api.tapeapp.com/v1/app`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/app/ \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "workspace_id": 1,
    "name": "Contacts",
    "item_name": "Contact",
    "description": "A simple contact app.",
    "icon": {
      "id": "contacts",
      "type": "graphic"
    },
    "item_icon": {
      "id": "person",
      "type": "graphic"
    },
    "fields": [
      {
        "field_type": "single_text",
        "config": {
          "label": "Name",
          "description": "The full name of the contact.",
          "required": true
        }
      },
      {
        "field_type": "multi_text",
        "config": {
          "label": "Notes",
          "description": "Notes about the contact.",
          "required": false
        }
      }
    ]
  }'
```

**JSON**

*Request*

```json
{
  "workspace_id": 1,
  "name": "Contacts",
  "item_name": "Contact",
  "description": "A simple contact app.",
  "icon": {
    "id": "contacts",
    "type": "graphic"
  },
  "item_icon": {
    "id": "person",
    "type": "graphic"
  },
  "fields": [
    {
      "field_type": "single_text",
      "config": {
        "label": "Name",
        "description": "The full name of the contact.",
        "required": true
      }
    },
    {
      "field_type": "multi_text",
      "config": {
        "label": "Notes",
        "description": "Notes about the contact.",
        "required": false
      }
    }
  ]
}
```

*Response*

```json
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "contacts",
  "external_id": "contacts",
  "name": "Contacts",
  "record_name": "Contact",
  "item_name": "Contact",
  "type": "database",
  "description": "A simple contact app.",
  "position": 0,
  "config": {
    "description": "A simple contact app.",
    "item_name": "Contact",
    "name": "Contacts",
    "icon": {
      "type": "graphic",
      "id": "contacts"
    },
    "item_icon": {
      "type": "graphic",
      "id": "person"
    }
  },
  "fields": [
    {
      "field_id": 10,
      "external_id": "name",
      "slug": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Name",
        "slug": "name",
        "external_id": "name",
        "description": "The full name of the contact.",
        "show_description": true,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "formatted": false
        }
      }
    },
    {
      "field_id": 20,
      "external_id": "notes",
      "slug": "notes",
      "label": "Notes",
      "type": "text",
      "field_type": "multi_text",
      "config": {
        "label": "Notes",
        "slug": "notes",
        "external_id": "notes",
        "description": "Notes about the contact.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "formatted": true
        }
      }
    }
  ]
}
```

The example creates a contacts app in the workspace with ID `1`. The app gets a `single_text` field "Name" and a `multi_text` field "Notes".

The response has status `201` and contains the new app with all its fields.

**General behavior**

-   Tape creates the fields in the order of the `fields` array.
-   Set the record name with `item_name`. The response returns it as `record_name`.
-   Without `position`, the new app goes after the last app of the workspace.

> Workspace has 500 apps?
> 
> A workspace holds at most 500 apps. Further create requests then return an error. Delete an existing app to create a new one.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

**Body parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `workspace_id` | `integer` | Required. ID of the workspace to create the app in. |
| `name` | `string` | Required. Name of the app. |
| `item_name` | `string` | Name of one record, for example `Contact` (default: the app `name`). |
| `description` | `string` | Description of the app. |
| `position` | `number` | Position of the app in the workspace, the same `position` value apps return (default: after the last app of the workspace). |
| `fields` | `Array` | Fields to create with the app, in this order. See [Fields](https://developers.tapeapp.com/docs/api/resource/field/overview). |
| `icon` | `object` | Icon of the app. See [Icon](https://developers.tapeapp.com/docs/api/resource/icon). |
| `item_icon` | `object` | Icon of the records. See [Icon](https://developers.tapeapp.com/docs/api/resource/icon). |

## Update an app

Use this endpoint to rename an app, change its icons, or add, change and delete fields.

`PUT https://api.tapeapp.com/v1/app/{app_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": [
      {
        "field_type": "single_text",
        "config": {
          "label": "First Name",
          "description": "The first name of the contact.",
          "required": true
        }
      },
      {
        "field_type": "single_text",
        "config": {
          "label": "Last Name",
          "description": "The last name of the contact.",
          "required": true
        }
      }
    ],
    "fields_to_delete": [
      {
        "field_id": 10
      }
    ]
  }'
```

**JSON**

*Request*

```json
{
  "fields": [
    {
      "field_type": "single_text",
      "config": {
        "label": "First Name",
        "description": "The first name of the contact.",
        "required": true
      }
    },
    {
      "field_type": "single_text",
      "config": {
        "label": "Last Name",
        "description": "The last name of the contact.",
        "required": true
      }
    }
  ],
  "fields_to_delete": [
    {
      "field_id": 10
    }
  ]
}
```

*Response*

```json
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "contacts",
  "name": "Contacts",
  "record_name": "Contact",
  "item_name": "Contact",
  "type": "database",
  "description": "A simple contact app.",
  "position": 0,
  "config": {
    "description": "A simple contact app.",
    "item_name": "Contact",
    "name": "Contacts",
    "icon": {
      "type": "graphic",
      "id": "contacts"
    }
  },
  "fields": [
    {
      "field_id": 20,
      "external_id": "notes",
      "slug": "notes",
      "label": "Notes",
      "type": "text",
      "field_type": "multi_text",
      "config": {
        "label": "Notes",
        "slug": "notes",
        "description": "Notes about the contact.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "formatted": true
        }
      }
    },
    {
      "field_id": 30,
      "external_id": "first_name",
      "slug": "first_name",
      "label": "First Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "First Name",
        "slug": "first_name",
        "description": "The first name of the contact.",
        "show_description": true,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "formatted": false
        }
      }
    },
    {
      "field_id": 40,
      "external_id": "last_name",
      "slug": "last_name",
      "label": "Last Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Last Name",
        "slug": "last_name",
        "description": "The last name of the contact.",
        "show_description": true,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "formatted": false
        }
      }
    }
  ]
}
```

The example updates the contacts app from [Create an app](#create-an-app). It deletes the "Name" field and adds two `single_text` fields, "First Name" and "Last Name". The "Notes" field is in neither `fields` nor `fields_to_delete`, so it stays unchanged.

The response contains the updated app with all its fields.

**General behavior**

-   Send only the properties you want to change.
-   A field in `fields` with a `field_id` updates that existing field. A field without `field_id` creates a new field. Tape adds new fields after the existing ones, in the order of the array.
-   To delete a field, add it to `fields_to_delete` with its `field_id`. This also deletes its values in every record. Entries copied from the app's `fields` property work too.
-   Fields that are in neither array stay unchanged.
-   To delete options of a category or status field, send `options_to_delete` in the `config.settings` of that field. See [Category](https://developers.tapeapp.com/docs/api/resource/field/category#app-update) and [Status](https://developers.tapeapp.com/docs/api/resource/field/status#app-update).
-   Want to make sure a request never deletes anything? Set `reject_deletions` to `true`.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

With `reject_deletions=true`, a request that deletes a field (`fields_to_delete`) or an option (`options_to_delete`) returns `400` with `deletions_rejected`. Tape applies nothing from that request, not even the other changes in the body:

```json
{
  "status_code": 400,
  "endpoint": "/v1/app/1",
  "error_code": "deletions_rejected",
  "error_message": "This request asks for something to be deleted ('fields_to_delete' names 1 field(s)), and it was sent with 'reject_deletions=true'. Nothing was applied — not the deletions, and not the rest of the body. Remove the deletion from the request, or send it without 'reject_deletions'."
}
```

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `reject_deletions` | `boolean` | Reject the request with `400` (`deletions_rejected`) if it deletes a field (`fields_to_delete`) or an option (`options_to_delete`). Nothing is applied then (default: `false`). |

**Body parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Name of the app. |
| `item_name` | `string` | Name of one record, for example `Contact`. |
| `description` | `string` | Description of the app. |
| `fields` | `Array` | Fields to create or update. A field with `field_id` is updated, a field without one is created. See [Fields](https://developers.tapeapp.com/docs/api/resource/field/overview). |
| `fields_to_delete` | `Array` | Fields to delete, each with its `field_id`. |
| `icon` | `object` | Icon of the app. See [Icon](https://developers.tapeapp.com/docs/api/resource/icon). |
| `item_icon` | `object` | Icon of the records. See [Icon](https://developers.tapeapp.com/docs/api/resource/icon). |

## Update an app's field order

Use this endpoint to change the order of the fields in an app.

`PUT https://api.tapeapp.com/v1/app/{app_id}/fields/order`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/app/1/fields/order \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": [
      {
        "field_id": 20
      },
      {
        "field_id": 30
      },
      {
        "field_id": 40
      }
    ]
  }'
```

**JSON**

*Request*

```json
{
  "fields": [
    {
      "field_id": 20
    },
    {
      "field_id": 30
    },
    {
      "field_id": 40
    }
  ]
}
```

*Response*

```json
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "contacts",
  "name": "Contacts",
  "record_name": "Contact",
  "item_name": "Contact",
  "type": "database",
  "description": "A simple contact app.",
  "position": 0,
  "config": {
    "description": "A simple contact app.",
    "item_name": "Contact",
    "name": "Contacts",
    "icon": {
      "type": "graphic",
      "id": "contacts"
    }
  },
  "fields": [
    {
      "field_id": 20,
      "external_id": "notes",
      "slug": "notes",
      "label": "Notes",
      "type": "text",
      "field_type": "multi_text",
      "config": {
        "label": "Notes",
        "slug": "notes",
        "description": "Notes about the contact.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "formatted": true
        }
      }
    },
    {
      "field_id": 30,
      "external_id": "first_name",
      "slug": "first_name",
      "label": "First Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "First Name",
        "slug": "first_name",
        "description": "The first name of the contact.",
        "show_description": true,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "formatted": false
        }
      }
    },
    {
      "field_id": 40,
      "external_id": "last_name",
      "slug": "last_name",
      "label": "Last Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Last Name",
        "slug": "last_name",
        "description": "The last name of the contact.",
        "show_description": true,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "formatted": false
        }
      }
    }
  ]
}
```

The example moves the `notes` field of the contacts app to the first position.

The response contains the app with its fields in the new order.

**General behavior**

-   Identify each field by its `field_id`.
-   To set the complete order, list all fields of the app.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Body parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `fields` | `Array` | Fields in the new order, each with its `field_id`. |

## Delete an app

Use this endpoint to delete an app.

`DELETE https://api.tapeapp.com/v1/app/{app_id}`

**cURL**

*Request*

```shell
curl -X DELETE https://api.tapeapp.com/v1/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "app_id": 1
}
```

> Can you undo deleting an app?
> 
> No. Deleting an app also deletes all its records and fields.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

## Next steps

[

Workspace

find the `workspace_id` to create an app in.

](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspaces)[

Field

the format of every field type in an app.

](https://developers.tapeapp.com/docs/api/resource/field/overview)[

Record

create and read the records of a database app.

](https://developers.tapeapp.com/docs/api/resource/record)[

View

read and change the views of an app.

](https://developers.tapeapp.com/docs/api/resource/view)[

Icon

set the icons of an app and its records.

](https://developers.tapeapp.com/docs/api/resource/icon)[

Webhook

get notified when an app or its records change.

](https://developers.tapeapp.com/docs/api/resource/webhook)[

Capabilities

what `apps:read` and `apps:edit` allow.

](https://developers.tapeapp.com/docs/api/capabilities)
