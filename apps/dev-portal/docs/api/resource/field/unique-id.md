---
id: unique-id
title: Unique ID field
sidebar_label: Unique ID
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use a unique ID field to give every record of a database app a readable ID, like `DEAL-0012`.

Tape has one unique ID field type: `unique_id` is the **Unique ID** field. Tape fills it and counts up per database app: the first record gets `1`, the second `2`, and so on. You can't set the value yourself.

The number is the record's `app_record_id`, which every record returns, with or without a **Unique ID** field. The field adds a prefix, a suffix and leading zeros to it.

A unique ID field has the [common field properties](/docs/api/resource/field/overview#common-properties) and the `settings` below. To read the unique ID of a record, see [Field value](/docs/api/resource/field-value/overview#field-type).

```json title="Unique ID field object"
{
  "field_id": 2,
  "external_id": "deal_id",
  "slug": "deal_id",
  "label": "Deal ID",
  "type": "unique_id",
  "field_type": "unique_id",
  "config": {
    "label": "Deal ID",
    "slug": "deal_id",
    "external_id": "deal_id",
    "description": "The ID of the deal.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
    "settings": {
      "prefix": "DEAL-",
      "min_digits": 4,
      "unit_location": "prefix",
      "unit_label": "DEAL-",
      "unit": "DEAL-"
    }
  }
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"unique_id"`. | `"unique_id"` |
| `field_type` | `string` | `"unique_id"`. | `"unique_id"` |
| `config.settings.min_digits` | `number` | Minimum number of digits, from 1 to 12. Tape fills shorter numbers with leading zeros. A new field without `min_digits` gets `1`. | `4` |
| `config.settings.prefix` | `string` | Text in front of the number, for example `"DEAL-"` for deals or `"TASK-"` for tasks. | `"DEAL-"` |
| `config.settings.suffix` | `string` | Text after the number. | `"-EU"` |
| `config.settings.unit_location` | `string` | Which labels Tape shows: `"prefix"`, `"suffix"` or `"prefix_and_suffix"`. | `"prefix"` |
| `config.settings.unit` | `string` | The prefix, or the suffix if `unit_location` is `"suffix"`. Kept for compatibility with number fields. | `"DEAL-"` |
| `config.settings.unit_label` (read-only) | `string` | Same as `unit`, kept for backwards compatibility. | `"DEAL-"` |

Record responses return the value of a unique ID field like other field values, for example `{ "value": 12, "formatted": "DEAL-0012" }`. `value` is the number without prefix and suffix, `formatted` is the ID as Tape shows it.

## App creation

Use the [create app endpoint](/docs/api/resource/app#create-an-app) to create unique ID fields together with a new app.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

The example creates a deals app in the workspace with ID `1`. The app gets a `single_text` field "Deal Name" and a `unique_id` field "Deal ID" with the prefix "DEAL-" and at least four digits.

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
    "name": "Deals",
    "item_name": "Deal",
    "fields": [
      {
        "field_type": "single_text",
        "config": {
          "label": "Deal Name",
          "description": "The name of the deal.",
          "required": true
        }
      },
      {
        "field_type": "unique_id",
        "config": {
          "label": "Deal ID",
          "description": "The ID of the deal.",
          "settings": {
            "prefix": "DEAL-",
            "min_digits": 4
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
  "name": "Deals",
  "item_name": "Deal",
  "fields": [
    {
      "field_type": "single_text",
      "config": {
        "label": "Deal Name",
        "description": "The name of the deal.",
        "required": true
      }
    },
    {
      "field_type": "unique_id",
      "config": {
        "label": "Deal ID",
        "description": "The ID of the deal.",
        "settings": {
          "prefix": "DEAL-",
          "min_digits": 4
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
  "slug": "deals",
  "external_id": "deals",
  "name": "Deals",
  "record_name": "Deal",
  "item_name": "Deal",
  "type": "database",
  "config": {
    "item_name": "Deal",
    "name": "Deals"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "deal_name",
      "slug": "deal_name",
      "label": "Deal Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Deal Name",
        "slug": "deal_name",
        "external_id": "deal_name",
        "description": "The name of the deal.",
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
      "external_id": "deal_id",
      "slug": "deal_id",
      "label": "Deal ID",
      "type": "unique_id",
      "field_type": "unique_id",
      "config": {
        "label": "Deal ID",
        "slug": "deal_id",
        "external_id": "deal_id",
        "description": "The ID of the deal.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "prefix": "DEAL-",
          "min_digits": 4,
          "unit_location": "prefix",
          "unit_label": "DEAL-",
          "unit": "DEAL-"
        }
      }
    }
  ]
}
```

**General behavior**

- Without `primary`, Tape makes the first field of the request the primary field. It skips `unique_id` fields when the request has fields of other types.
- Without `unit_location`, Tape sets it from the labels you send: `"prefix"` for a prefix, `"suffix"` for a suffix, `"prefix_and_suffix"` for both.
- A new unique ID field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- `min_digits` above 12 returns `400`.

## App update

Use the [update app endpoint](/docs/api/resource/app#update-an-app) to create new unique ID fields in an app or to change existing ones.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

The example changes the "Deal ID" field (ID `2`) of the deals app. It sets `min_digits` to `5` and adds the suffix "-EU". The 12th deal then shows as `DEAL-00012-EU`.

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
        "field_id": 2,
        "config": {
          "label": "Deal ID",
          "description": "The ID of the deal.",
          "settings": {
            "prefix": "DEAL-",
            "suffix": "-EU",
            "min_digits": 5
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
      "field_id": 2,
      "config": {
        "label": "Deal ID",
        "description": "The ID of the deal.",
        "settings": {
          "prefix": "DEAL-",
          "suffix": "-EU",
          "min_digits": 5
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
  "slug": "deals",
  "external_id": "deals",
  "name": "Deals",
  "record_name": "Deal",
  "item_name": "Deal",
  "type": "database",
  "config": {
    "item_name": "Deal",
    "name": "Deals"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "deal_name",
      "slug": "deal_name",
      "label": "Deal Name",
      "type": "text",
      "field_type": "single_text",
      "config": {
        "label": "Deal Name",
        "slug": "deal_name",
        "external_id": "deal_name",
        "description": "The name of the deal.",
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
      "external_id": "deal_id",
      "slug": "deal_id",
      "label": "Deal ID",
      "type": "unique_id",
      "field_type": "unique_id",
      "config": {
        "label": "Deal ID",
        "slug": "deal_id",
        "external_id": "deal_id",
        "description": "The ID of the deal.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "prefix": "DEAL-",
          "suffix": "-EU",
          "min_digits": 5,
          "unit_location": "prefix_and_suffix",
          "unit_label": "DEAL-",
          "unit": "DEAL-"
        }
      }
    }
  ]
}
```

**General behavior**

- A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
- Send `prefix` and `suffix` together, even if only one of them changes. Without `unit_location`, Tape sets it from the labels in the request, so a request with only `suffix` shows only the suffix.
- Without `min_digits`, the minimum number of digits stays the same.
- Changing the settings changes only how Tape shows the IDs. The numbers of the records stay the same.
- Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](/docs/api/resource/field/overview#create-and-update-fields).
- Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.
- `min_digits` above 12 returns `400`.

## Next steps

- [Field value](/docs/api/resource/field-value/overview#field-type): read the unique ID of a record.
- [Filter](/docs/api/resource/filter#unique-id): find records by their unique ID.
- [Field](/docs/api/resource/field/overview): the properties all field types share.
- [App](/docs/api/resource/app): create, update and delete apps with their fields.
- [Capabilities](/docs/api/capabilities): what `apps:edit` allows.
