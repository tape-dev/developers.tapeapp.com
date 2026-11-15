# Text field

> Use a text field to store a name, a note or any other text in a record.

Use a text field to store a name, a note or any other text in a record.

Tape has two text field types:

-   `single_text` is the **Single line text** field. It holds plain text with up to 500 characters.
-   `multi_text` is the **Multi line text** field. It holds rich text (HTML) with up to 150000 characters.

A text field has the [common field properties](https://developers.tapeapp.com/docs/api/resource/field/overview#common-properties) and read-only `settings`. To read and write the text of a record, see [Text field value](https://developers.tapeapp.com/docs/api/resource/field-value/text).

*Text field object*

```json
{
  "field_id": 2,
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
      "formatted": true,
      "format": "html"
    }
  }
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"text"` for both text field types. | `"text"` |
| `field_type` | `string` | `"single_text"` or `"multi_text"`. | `"multi_text"` |
| `config.settings.formatted` (read-only) | `boolean` | `false` for `single_text`, `true` for `multi_text`. | `true` |
| `config.settings.format` (read-only) | `string` | Text format of the field. `"plain"` for `single_text`. `"html"`, `"plain"` or `"code"` for `multi_text`, depending on the text format chosen in Tape. | `"html"` |

You can't set `settings` through the API. Choose the text format of a `multi_text` field in Tape.

## App creation

Use the [create app endpoint](https://developers.tapeapp.com/docs/api/resource/app#create-an-app) to create text fields together with a new app.

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
  "config": {
    "item_name": "Contact",
    "name": "Contacts"
  },
  "fields": [
    {
      "field_id": 1,
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
          "formatted": false,
          "format": "plain"
        }
      }
    },
    {
      "field_id": 2,
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
          "formatted": true,
          "format": "html"
        }
      }
    }
  ]
}
```

The example creates a contacts app in the workspace with ID `1`. The app gets a `single_text` field "Name" and a `multi_text` field "Notes".

Find the workspace ID with [Retrieve workspaces](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspaces).

**General behavior**

-   Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Name".
-   A new `multi_text` field uses rich text (`"format": "html"`).

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

## App update

Use the [update app endpoint](https://developers.tapeapp.com/docs/api/resource/app#update-an-app) to create new text fields in an app or to change existing ones.

`PUT https://api.tapeapp.com/v1/app/{appId}`

**cURL**

*Request*

```shell

curl -X PUT https://api.tapeapp.com/v1/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": [
      {
        "field_id": 1,
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
    ]
  }'
```

**JSON**

*Request*

```json
{
  "fields": [
    {
      "field_id": 1,
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
  "config": {
    "item_name": "Contact",
    "name": "Contacts"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "slug": "name",
      "label": "First Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "First Name",
        "slug": "name",
        "external_id": "name",
        "description": "The first name of the contact.",
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
    },
    {
      "field_id": 2,
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
          "formatted": true,
          "format": "html"
        }
      }
    },
    {
      "field_id": 3,
      "external_id": "last_name",
      "slug": "last_name",
      "label": "Last Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Last Name",
        "slug": "last_name",
        "external_id": "last_name",
        "description": "The last name of the contact.",
        "show_description": true,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "formatted": false,
          "format": "plain"
        }
      }
    }
  ]
}
```

The example splits the "Name" field of the contacts app into "First Name" and "Last Name". It renames the field with ID `1` to "First Name" and creates a new `single_text` field "Last Name". The "Notes" field isn't in the request, so it stays unchanged.

Find the app ID and the field IDs in the [Developer view of the app](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

**General behavior**

-   A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`. Tape adds new fields after the existing ones.
-   Renaming a field keeps its `slug`. The renamed field "First Name" still has the slug `name`.
-   Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](https://developers.tapeapp.com/docs/api/resource/field/overview#create-and-update-fields).
-   Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.

## Next steps

[

Text field value

read and write the text of a record.

](https://developers.tapeapp.com/docs/api/resource/field-value/text)[

Field

the properties all field types share.

](https://developers.tapeapp.com/docs/api/resource/field/overview)[

App

create, update and delete apps with their fields.

](https://developers.tapeapp.com/docs/api/resource/app)[

Capabilities

what `apps:edit` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
