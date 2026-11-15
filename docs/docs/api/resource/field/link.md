# Link field

> Use a link field to store one or more web addresses in a record, such as a company website or social profiles.

Use a link field to store one or more web addresses in a record, such as a company website or social profiles.

Tape has one link field type: `multi_link` is the **Link** field. It holds one or more links. Tape adds a preview with title and description to each link.

A link field has the [common field properties](https://developers.tapeapp.com/docs/api/resource/field/overview#common-properties) and read-only `settings`. To read and write the links of a record, see [Link field value](https://developers.tapeapp.com/docs/api/resource/field-value/link).

*Link field object*

```json
{
  "field_id": 2,
  "external_id": "website",
  "slug": "website",
  "label": "Website",
  "type": "embed",
  "field_type": "multi_link",
  "config": {
    "label": "Website",
    "slug": "website",
    "external_id": "website",
    "description": "The website and social profiles of the company.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
    "settings": {
      "label_setting": "default"
    }
  }
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"embed"` for a link field. | `"embed"` |
| `field_type` | `string` | `"multi_link"`. | `"multi_link"` |
| `config.settings.label_setting` (read-only) | `string` | Which type labels the field offers: `"default"` (all built-in labels), `"url"` (`homepage`, `work`, `home`, `other`), `"social_profile"` (`linkedin`, `x`, `instagram`, `facebook`, `youtube`, `tiktok`, `threads`, `reddit`, `bluesky`, `other`), `"custom_only"` (only the field's own labels) or `"none"`. With `"none"`, Tape ignores a `type` you send with a field value. | `"default"` |

You can't set `settings` through the API. Choose the labels of a link field in Tape.

## App creation

Use the [create app endpoint](https://developers.tapeapp.com/docs/api/resource/app#create-an-app) to create link fields together with a new app.

`POST https://api.tapeapp.com/v1/app`

**cURL**

*Request*

```shell

curl -X POST https://api.tapeapp.com/v1/app/ \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "workspace_id": 1,
    "name": "Companies",
    "item_name": "Company",
    "fields": [
      {
        "field_type": "single_text",
        "config": {
          "label": "Name",
          "description": "The name of the company.",
          "required": true
        }
      },
      {
        "field_type": "multi_link",
        "config": {
          "label": "Website",
          "description": "The website and social profiles of the company.",
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
  "name": "Companies",
  "item_name": "Company",
  "fields": [
    {
      "field_type": "single_text",
      "config": {
        "label": "Name",
        "description": "The name of the company.",
        "required": true
      }
    },
    {
      "field_type": "multi_link",
      "config": {
        "label": "Website",
        "description": "The website and social profiles of the company.",
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
  "slug": "companies",
  "external_id": "companies",
  "name": "Companies",
  "record_name": "Company",
  "item_name": "Company",
  "type": "database",
  "config": {
    "item_name": "Company",
    "name": "Companies"
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
        "description": "The name of the company.",
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
      "external_id": "website",
      "slug": "website",
      "label": "Website",
      "type": "embed",
      "field_type": "multi_link",
      "config": {
        "label": "Website",
        "slug": "website",
        "external_id": "website",
        "description": "The website and social profiles of the company.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "label_setting": "default"
        }
      }
    }
  ]
}
```

The example creates a companies app in the workspace with ID `1`. The app gets a `single_text` field "Name" and a `multi_link` field "Website".

Find the workspace ID with [Retrieve workspaces](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspaces).

**General behavior**

-   Tape ignores `settings` in the request.
-   A new link field offers all built-in labels (`"label_setting": "default"`).
-   Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Name".
-   A new link field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

## App update

Use the [update app endpoint](https://developers.tapeapp.com/docs/api/resource/app#update-an-app) to create new link fields in an app or to change existing ones.

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
          "label": "Web profiles",
          "description": "The website and social profiles of the company.",
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
  "fields": [
    {
      "field_id": 2,
      "config": {
        "label": "Web profiles",
        "description": "The website and social profiles of the company.",
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
  "slug": "companies",
  "external_id": "companies",
  "name": "Companies",
  "record_name": "Company",
  "item_name": "Company",
  "type": "database",
  "config": {
    "item_name": "Company",
    "name": "Companies"
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
        "description": "The name of the company.",
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
      "external_id": "website",
      "slug": "website",
      "label": "Web profiles",
      "type": "embed",
      "field_type": "multi_link",
      "config": {
        "label": "Web profiles",
        "slug": "website",
        "external_id": "website",
        "description": "The website and social profiles of the company.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "label_setting": "default"
        }
      }
    }
  ]
}
```

The example renames the "Website" field (ID `2`) of the companies app to "Web profiles".

Find the app ID and the field IDs in the [Developer view of the app](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

**General behavior**

-   A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
-   Renaming a field keeps its `slug`. The renamed field "Web profiles" still has the slug `website`.
-   Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](https://developers.tapeapp.com/docs/api/resource/field/overview#create-and-update-fields).
-   Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.

## Next steps

[

Link field value

read and write the links of a record.

](https://developers.tapeapp.com/docs/api/resource/field-value/link)[

Field

the properties all field types share.

](https://developers.tapeapp.com/docs/api/resource/field/overview)[

App

create, update and delete apps with their fields.

](https://developers.tapeapp.com/docs/api/resource/app)[

Capabilities

what `apps:edit` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
