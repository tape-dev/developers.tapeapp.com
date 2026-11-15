# Image field

> Use an image field to store photos and other images in a record.

Use an image field to store photos and other images in a record.

Tape has one image field type: `multi_image` is the **Image** field. It holds one or more images.

An image field has the [common field properties](https://developers.tapeapp.com/docs/api/resource/field/overview#common-properties) and read-only `settings`. To read and write the images of a record, see [Image field value](https://developers.tapeapp.com/docs/api/resource/field-value/image).

*Image field object*

```json
{
  "field_id": 1,
  "external_id": "photos",
  "slug": "photos",
  "label": "Photos",
  "type": "file",
  "field_type": "multi_image",
  "config": {
    "label": "Photos",
    "slug": "photos",
    "external_id": "photos",
    "description": "Photos of the property.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
    "settings": {
      "multiple": true
    }
  }
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"file"` for the image field. | `"file"` |
| `field_type` | `string` | `"multi_image"`. | `"multi_image"` |
| `config.settings.multiple` (read-only) | `boolean` | `true`. | `true` |

You can't set `settings` through the API.

## App creation

Use the [create app endpoint](https://developers.tapeapp.com/docs/api/resource/app#create-an-app) to create image fields together with a new app.

`POST https://api.tapeapp.com/v1/app`

**cURL**

*Request*

```shell

curl -X POST https://api.tapeapp.com/v1/app/ \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "workspace_id": 1,
    "name": "Properties",
    "item_name": "Property",
    "fields": [
      {
        "field_type": "multi_image",
        "config": {
          "label": "Photos",
          "description": "Photos of the property.",
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
  "name": "Properties",
  "item_name": "Property",
  "fields": [
    {
      "field_type": "multi_image",
      "config": {
        "label": "Photos",
        "description": "Photos of the property.",
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
  "slug": "properties",
  "external_id": "properties",
  "name": "Properties",
  "record_name": "Property",
  "item_name": "Property",
  "type": "database",
  "config": {
    "item_name": "Property",
    "name": "Properties"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "photos",
      "slug": "photos",
      "label": "Photos",
      "type": "file",
      "field_type": "multi_image",
      "config": {
        "label": "Photos",
        "slug": "photos",
        "external_id": "photos",
        "description": "Photos of the property.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "multiple": true
        }
      }
    }
  ]
}
```

The example creates a properties app in the workspace with ID `1`. The app gets a `multi_image` field "Photos". The example leaves out other fields of a properties app, like "Name", "Address" or "Price".

Find the workspace ID with [Retrieve workspaces](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspaces).

**General behavior**

-   Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Photos".
-   A new image field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

## App update

Use the [update app endpoint](https://developers.tapeapp.com/docs/api/resource/app#update-an-app) to create new image fields in an app or to change existing ones.

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
          "label": "Photos",
          "description": "Interior and exterior photos of the property.",
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
      "field_id": 1,
      "config": {
        "label": "Photos",
        "description": "Interior and exterior photos of the property.",
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
  "slug": "properties",
  "external_id": "properties",
  "name": "Properties",
  "record_name": "Property",
  "item_name": "Property",
  "type": "database",
  "config": {
    "item_name": "Property",
    "name": "Properties"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "photos",
      "slug": "photos",
      "label": "Photos",
      "type": "file",
      "field_type": "multi_image",
      "config": {
        "label": "Photos",
        "slug": "photos",
        "external_id": "photos",
        "description": "Interior and exterior photos of the property.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "multiple": true
        }
      }
    }
  ]
}
```

The example changes the description of the "Photos" field (ID `1`) of the properties app.

Find the app ID and the field IDs in the [Developer view of the app](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

**General behavior**

-   A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
-   Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](https://developers.tapeapp.com/docs/api/resource/field/overview#create-and-update-fields).
-   Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.

## Next steps

[

Image field value

read and write the images of a record.

](https://developers.tapeapp.com/docs/api/resource/field-value/image)[

File

upload images before you add them to a record.

](https://developers.tapeapp.com/docs/api/resource/file)[

Attachment field

a field that holds files of any type.

](https://developers.tapeapp.com/docs/api/resource/field/attachment)[

Field

the properties all field types share.

](https://developers.tapeapp.com/docs/api/resource/field/overview)[

App

create, update and delete apps with their fields.

](https://developers.tapeapp.com/docs/api/resource/app)[

Capabilities

what `apps:edit` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
