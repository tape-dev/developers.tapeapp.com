# Email field

> Use an email field to store one or more email addresses in a record.

Use an email field to store one or more email addresses in a record.

Tape has one email field type: `multi_email` is the **Email** field. It holds one or more email addresses, each with a type label such as `work` or `home`.

An email field has the [common field properties](https://developers.tapeapp.com/docs/api/resource/field/overview#common-properties) and its own `settings`. To read and write the email addresses of a record, see [Email field value](https://developers.tapeapp.com/docs/api/resource/field-value/email).

*Email field object*

```json
{
  "field_id": 2,
  "external_id": "email",
  "slug": "email",
  "label": "Email",
  "type": "email",
  "field_type": "multi_email",
  "config": {
    "label": "Email",
    "slug": "email",
    "external_id": "email",
    "description": "The email addresses of the contact.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
    "settings": {
      "only_allow_single_entry": false,
      "label_setting": "default"
    }
  }
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"email"` for an email field. | `"email"` |
| `field_type` | `string` | `"multi_email"`. | `"multi_email"` |
| `config.settings.only_allow_single_entry` | `boolean` | If `true`, users can add only one email address in Tape. The API still accepts more than one. Default: `false`. | `false` |
| `config.settings.label_setting` (read-only) | `string` | Which type labels the field offers: `"default"` (`home`, `work`, `other`), `"custom_only"` (only the field's own labels) or `"none"`. With `"none"`, Tape ignores a `type` you send with a field value. | `"default"` |

You can't set `label_setting` through the API. Choose the labels of an email field in Tape.

## App creation

Use the [create app endpoint](https://developers.tapeapp.com/docs/api/resource/app#create-an-app) to create email fields together with a new app.

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
        "field_type": "multi_email",
        "config": {
          "label": "Email",
          "description": "The email addresses of the contact.",
          "required": false,
          "settings": {
            "only_allow_single_entry": false
          }
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
      "field_type": "multi_email",
      "config": {
        "label": "Email",
        "description": "The email addresses of the contact.",
        "required": false,
        "settings": {
          "only_allow_single_entry": false
        }
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
      "external_id": "email",
      "slug": "email",
      "label": "Email",
      "type": "email",
      "field_type": "multi_email",
      "config": {
        "label": "Email",
        "slug": "email",
        "external_id": "email",
        "description": "The email addresses of the contact.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "only_allow_single_entry": false,
          "label_setting": "default"
        }
      }
    }
  ]
}
```

The example creates a contacts app in the workspace with ID `1`. The app gets a `single_text` field "Name" and a `multi_email` field "Email".

Find the workspace ID with [Retrieve workspaces](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspaces).

**General behavior**

-   Without `settings`, `only_allow_single_entry` is `false`.
-   A new email field offers the built-in labels (`"label_setting": "default"`).
-   Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Name".
-   A new email field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

## App update

Use the [update app endpoint](https://developers.tapeapp.com/docs/api/resource/app#update-an-app) to create new email fields in an app or to change existing ones.

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
        "field_id": 2,
        "config": {
          "label": "Email",
          "description": "The email address of the contact.",
          "required": false,
          "settings": {
            "only_allow_single_entry": true
          }
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
      "field_id": 2,
      "config": {
        "label": "Email",
        "description": "The email address of the contact.",
        "required": false,
        "settings": {
          "only_allow_single_entry": true
        }
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
      "external_id": "email",
      "slug": "email",
      "label": "Email",
      "type": "email",
      "field_type": "multi_email",
      "config": {
        "label": "Email",
        "slug": "email",
        "external_id": "email",
        "description": "The email address of the contact.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "only_allow_single_entry": true,
          "label_setting": "default"
        }
      }
    }
  ]
}
```

The example changes the "Email" field (ID `2`) of the contacts app so that users can add only one email address in Tape.

Find the app ID and the field IDs in the [Developer view of the app](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

**General behavior**

-   A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
-   Without `only_allow_single_entry`, the setting stays as it is.
-   `only_allow_single_entry` changes only what users can do in Tape. Email addresses that a record already has stay.
-   Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](https://developers.tapeapp.com/docs/api/resource/field/overview#create-and-update-fields).
-   Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.

## Next steps

[

Email field value

read and write the email addresses of a record.

](https://developers.tapeapp.com/docs/api/resource/field-value/email)[

Field

the properties all field types share.

](https://developers.tapeapp.com/docs/api/resource/field/overview)[

App

create, update and delete apps with their fields.

](https://developers.tapeapp.com/docs/api/resource/app)[

Capabilities

what `apps:edit` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
