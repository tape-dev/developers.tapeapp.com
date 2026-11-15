---
id: phone
title: Phone field
sidebar_label: Phone
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import MediaFrame from '@site/src/components/media-frame/media-frame.component';
import PhoneLabelsPng from '@site/static/docs/api/resource/field/phone/phone-labels.png';

Use a phone field to store one or more phone numbers in a record.

Tape has one phone field type: `multi_phone` is the **Phone** field. It holds one or more phone numbers, each with a type label such as `mobile` or `work`.

A phone field has the [common field properties](/docs/api/resource/field/overview#common-properties) and its own `settings`. To read and write the phone numbers of a record, see [Phone field value](/docs/api/resource/field-value/phone).

```json title="Phone field object"
{
  "field_id": 3,
  "external_id": "phone",
  "slug": "phone",
  "label": "Phone",
  "type": "phone",
  "field_type": "multi_phone",
  "config": {
    "label": "Phone",
    "slug": "phone",
    "external_id": "phone",
    "description": "The phone numbers of the lead.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
    "settings": {
      "call_link_scheme": "tel",
      "only_allow_single_entry": false,
      "label_setting": "default"
    }
  }
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"phone"` for a phone field. | `"phone"` |
| `field_type` | `string` | `"multi_phone"`. | `"multi_phone"` |
| `config.settings.call_link_scheme` | `string` | The link Tape opens when users select a phone number: `"tel"` or `"callto"`. Default: `"tel"`. | `"tel"` |
| `config.settings.only_allow_single_entry` | `boolean` | If `true`, users can add only one phone number in Tape. The API still accepts more than one. Default: `false`. | `false` |
| `config.settings.label_setting` (read-only) | `string` | Which type labels the field offers: `"default"` (`mobile`, `work`, `home`, `main`, `other`), `"extended"` (adds `work_fax`, `home_fax` and `pager`), `"custom_only"` (only the field's own labels) or `"none"`. With `"none"`, Tape ignores a `type` you send with a field value. | `"default"` |

You can't set `label_setting` through the API. Choose the labels of a phone field in Tape.

<MediaFrame><img src={PhoneLabelsPng} alt="Settings of a Phone field with the choice of type labels" /></MediaFrame>

## App creation

Use the [create app endpoint](/docs/api/resource/app#create-an-app) to create phone fields together with a new app.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

The example creates a leads app in the workspace with ID `1`. The app gets a `single_text` field "Name" and a `multi_phone` field "Phone".

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
    "name": "Leads",
    "item_name": "Lead",
    "fields": [
      {
        "field_type": "single_text",
        "config": {
          "label": "Name",
          "description": "The full name of the lead.",
          "required": true
        }
      },
      {
        "field_type": "multi_phone",
        "config": {
          "label": "Phone",
          "description": "The phone numbers of the lead.",
          "required": false,
          "settings": {
            "only_allow_single_entry": false,
            "call_link_scheme": "tel"
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
  "name": "Leads",
  "item_name": "Lead",
  "fields": [
    {
      "field_type": "single_text",
      "config": {
        "label": "Name",
        "description": "The full name of the lead.",
        "required": true
      }
    },
    {
      "field_type": "multi_phone",
      "config": {
        "label": "Phone",
        "description": "The phone numbers of the lead.",
        "required": false,
        "settings": {
          "only_allow_single_entry": false,
          "call_link_scheme": "tel"
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
  "slug": "leads",
  "external_id": "leads",
  "name": "Leads",
  "record_name": "Lead",
  "item_name": "Lead",
  "type": "database",
  "config": {
    "item_name": "Lead",
    "name": "Leads"
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
        "description": "The full name of the lead.",
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
      "field_id": 3,
      "external_id": "phone",
      "slug": "phone",
      "label": "Phone",
      "type": "phone",
      "field_type": "multi_phone",
      "config": {
        "label": "Phone",
        "slug": "phone",
        "external_id": "phone",
        "description": "The phone numbers of the lead.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "call_link_scheme": "tel",
          "only_allow_single_entry": false,
          "label_setting": "default"
        }
      }
    }
  ]
}
```

**General behavior**

- Without `call_link_scheme`, the field uses `"tel"`. Without `only_allow_single_entry`, it's `false`.
- A new phone field offers the default labels (`"label_setting": "default"`).
- Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Name".
- A new phone field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- A `call_link_scheme` other than `"tel"` or `"callto"` returns `400`.

## App update

Use the [update app endpoint](/docs/api/resource/app#update-an-app) to create new phone fields in an app or to change existing ones.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

The example changes the call link of the "Phone" field (ID `3`) of the leads app to `callto`.

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
        "field_id": 3,
        "config": {
          "label": "Phone",
          "description": "The phone numbers of the lead.",
          "required": false,
          "settings": {
            "only_allow_single_entry": false,
            "call_link_scheme": "callto"
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
      "field_id": 3,
      "config": {
        "label": "Phone",
        "description": "The phone numbers of the lead.",
        "required": false,
        "settings": {
          "only_allow_single_entry": false,
          "call_link_scheme": "callto"
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
  "slug": "leads",
  "external_id": "leads",
  "name": "Leads",
  "record_name": "Lead",
  "item_name": "Lead",
  "type": "database",
  "config": {
    "item_name": "Lead",
    "name": "Leads"
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
        "description": "The full name of the lead.",
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
      "field_id": 3,
      "external_id": "phone",
      "slug": "phone",
      "label": "Phone",
      "type": "phone",
      "field_type": "multi_phone",
      "config": {
        "label": "Phone",
        "slug": "phone",
        "external_id": "phone",
        "description": "The phone numbers of the lead.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "call_link_scheme": "callto",
          "only_allow_single_entry": false,
          "label_setting": "default"
        }
      }
    }
  ]
}
```

**General behavior**

- A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
- Send `call_link_scheme` with every update of a phone field. Without it, Tape sets the call link back to `"tel"`.
- Without `only_allow_single_entry`, the setting stays as it is.
- Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](/docs/api/resource/field/overview#create-and-update-fields).
- Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.
- A `call_link_scheme` other than `"tel"` or `"callto"` returns `400`.

## Next steps

- [Phone field value](/docs/api/resource/field-value/phone): read and write the phone numbers of a record.
- [Field](/docs/api/resource/field/overview): the properties all field types share.
- [App](/docs/api/resource/app): create, update and delete apps with their fields.
- [Capabilities](/docs/api/capabilities): what `apps:edit` allows.
