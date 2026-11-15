---
id: image
title: Image field
sidebar_label: Image
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use an image field to store photos and other images in a record.

Tape has one image field type: `multi_image` is the **Image** field. It holds one or more images.

An image field has the [common field properties](/docs/api/resource/field/overview#common-properties) and read-only `settings`. To read and write the images of a record, see [Image field value](/docs/api/resource/field-value/image).

```json title="Image field object"
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
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"file"` for the image field. | `"file"` |
| `field_type` | `string` | `"multi_image"`. | `"multi_image"` |
| `config.settings.multiple` (read-only) | `boolean` | `true`. | `true` |

You can't set `settings` through the API.

## App creation

Use the [create app endpoint](/docs/api/resource/app#create-an-app) to create image fields together with a new app.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

The example creates a properties app in the workspace with ID `1`. The app gets a `multi_image` field "Photos". The example leaves out other fields of a properties app, like "Name", "Address" or "Price".

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
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
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

</TabItem>
</Tabs>

```json title="Response"
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

**General behavior**

- Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Photos".
- A new image field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

## App update

Use the [update app endpoint](/docs/api/resource/app#update-an-app) to create new image fields in an app or to change existing ones.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

The example changes the description of the "Photos" field (ID `1`) of the properties app.

Find the app ID and the field IDs in the [Developer view of the app](/docs/api/resource/app#find-app-and-field-ids).

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
          "label": "Photos",
          "description": "Interior and exterior photos of the property.",
          "required": false
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
        "label": "Photos",
        "description": "Interior and exterior photos of the property.",
        "required": false
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

**General behavior**

- A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
- Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](/docs/api/resource/field/overview#create-and-update-fields).
- Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.

## Next steps

- [Image field value](/docs/api/resource/field-value/image): read and write the images of a record.
- [File](/docs/api/resource/file): upload images before you add them to a record.
- [Attachment field](/docs/api/resource/field/attachment): a field that holds files of any type.
- [Field](/docs/api/resource/field/overview): the properties all field types share.
- [App](/docs/api/resource/app): create, update and delete apps with their fields.
- [Capabilities](/docs/api/capabilities): what `apps:edit` allows.
