# Location field

> Use a location field to store an address in a record, such as the address of a property or a solar site.

Use a location field to store an address in a record, such as the address of a property or a solar site.

Tape has one location field type: `single_location` is the **Location** field. It holds one address with its parts and, if you add them, its coordinates.

A location field has the [common field properties](https://developers.tapeapp.com/docs/api/resource/field/overview#common-properties) and its own `settings`. To read and write the address of a record, see [Location field value](https://developers.tapeapp.com/docs/api/resource/field-value/location).

*Location field object*

```json
{
  "field_id": 2,
  "external_id": "address",
  "slug": "address",
  "label": "Address",
  "type": "location",
  "field_type": "single_location",
  "config": {
    "label": "Address",
    "slug": "address",
    "external_id": "address",
    "description": "The address of the property.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
    "settings": {
      "has_map": true
    }
  }
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"location"` for a location field. | `"location"` |
| `field_type` | `string` | `"single_location"`. | `"single_location"` |
| `config.settings.has_map` | `boolean` | If `true`, Tape shows a map with the address in the record. Default: `false`. | `true` |

The map needs coordinates. Tape doesn't look them up for an address from the API. Send `latitude` and `longitude` with the [field value](https://developers.tapeapp.com/docs/api/resource/field-value/location#record-creation).

## App creation

Use the [create app endpoint](https://developers.tapeapp.com/docs/api/resource/app#create-an-app) to create location fields together with a new app.

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
        "field_type": "single_text",
        "config": {
          "label": "Name",
          "description": "The name of the property.",
          "required": true
        }
      },
      {
        "field_type": "single_location",
        "config": {
          "label": "Address",
          "description": "The address of the property.",
          "required": false,
          "settings": {
            "has_map": true
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
  "name": "Properties",
  "item_name": "Property",
  "fields": [
    {
      "field_type": "single_text",
      "config": {
        "label": "Name",
        "description": "The name of the property.",
        "required": true
      }
    },
    {
      "field_type": "single_location",
      "config": {
        "label": "Address",
        "description": "The address of the property.",
        "required": false,
        "settings": {
          "has_map": true
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
      "external_id": "name",
      "slug": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Name",
        "slug": "name",
        "external_id": "name",
        "description": "The name of the property.",
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
      "external_id": "address",
      "slug": "address",
      "label": "Address",
      "type": "location",
      "field_type": "single_location",
      "config": {
        "label": "Address",
        "slug": "address",
        "external_id": "address",
        "description": "The address of the property.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "has_map": true
        }
      }
    }
  ]
}
```

The example creates a properties app in the workspace with ID `1`. The app gets a `single_text` field "Name" and a `single_location` field "Address" with a map.

Find the workspace ID with [Retrieve workspaces](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspaces).

**General behavior**

-   Without `has_map`, the field shows no map.
-   Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Name".
-   A new location field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

## App update

Use the [update app endpoint](https://developers.tapeapp.com/docs/api/resource/app#update-an-app) to create new location fields in an app or to change existing ones.

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
          "label": "Address",
          "description": "The address of the property.",
          "required": false,
          "settings": {
            "has_map": false
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
        "label": "Address",
        "description": "The address of the property.",
        "required": false,
        "settings": {
          "has_map": false
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
      "external_id": "name",
      "slug": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Name",
        "slug": "name",
        "external_id": "name",
        "description": "The name of the property.",
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
      "external_id": "address",
      "slug": "address",
      "label": "Address",
      "type": "location",
      "field_type": "single_location",
      "config": {
        "label": "Address",
        "slug": "address",
        "external_id": "address",
        "description": "The address of the property.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "has_map": false
        }
      }
    }
  ]
}
```

The example turns off the map of the "Address" field (ID `2`) of the properties app.

Find the app ID and the field IDs in the [Developer view of the app](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

**General behavior**

-   A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
-   Without `has_map`, the setting stays as it is.
-   Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](https://developers.tapeapp.com/docs/api/resource/field/overview#create-and-update-fields).
-   Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.

## Next steps

[

Location field value

read and write the address of a record.

](https://developers.tapeapp.com/docs/api/resource/field-value/location)[

Field

the properties all field types share.

](https://developers.tapeapp.com/docs/api/resource/field/overview)[

App

create, update and delete apps with their fields.

](https://developers.tapeapp.com/docs/api/resource/app)[

Capabilities

what `apps:edit` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
