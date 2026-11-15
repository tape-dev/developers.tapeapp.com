---
id: category
title: Category field
sidebar_label: Category
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use a category field to let a record pick from a fixed list of options, like a pipeline stage or a product.

Tape has two category field types:

- `single_category` is the **Single select** field. A record holds at most one option.
- `multi_category` is the **Multiple select** field. A record holds any number of options.

A category field has the [common field properties](/docs/api/resource/field/overview#common-properties) and `settings` with its options and layout. To read and set the selected options of a record, see [Category field value](/docs/api/resource/field-value/category).

```json title="Category field object"
{
  "field_id": 1,
  "external_id": "pipeline_stage",
  "slug": "pipeline_stage",
  "label": "Pipeline Stage",
  "type": "category",
  "field_type": "single_category",
  "config": {
    "label": "Pipeline Stage",
    "slug": "pipeline_stage",
    "external_id": "pipeline_stage",
    "description": "The current stage of the lead in the sales pipeline.",
    "show_description": true,
    "required": true,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": true,
    "settings": {
      "multiple": false,
      "layout": "dropdown",
      "options": [
        { "id": 1, "text": "New", "color": "6E7174" },
        { "id": 2, "text": "Contacted", "color": "0077DE" },
        { "id": 3, "text": "Won", "color": "00866A" },
        { "id": 4, "text": "Lost", "color": "FE001A" }
      ]
    }
  }
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"category"` for both category field types. | `"category"` |
| `field_type` | `string` | `"single_category"` or `"multi_category"`. | `"single_category"` |
| `config.settings.multiple` (read-only) | `boolean` | `false` for `single_category`, `true` for `multi_category`. | `false` |
| `config.settings.layout` | `string` | Older layout setting: `"dropdown"` (default), `"list"` or `"inline"`. Tape stores and returns the value, but it doesn't change how the options look. Set that in the record layout of the app. | `"dropdown"` |
| `config.settings.options` | `array` | The options of the field, in their order. | |
| `config.settings.options[].id` | `number` | ID of the option. Use it to change the option or to select it in a record. | `2` |
| `config.settings.options[].text` | `string` | Label of the option. Required for every option you send. | `"Contacted"` |
| `config.settings.options[].color` | `string` | Color of the option. Responses return a hex value without `#`. See [Option colors](#option-colors). | `"0077DE"` |
| `config.settings.options_to_delete` (write-only) | `array` | App update only. The IDs of the options to delete. | `[{ "id": 4 }]` |

### Option colors

Send a color by name or as its hex value without `#`. Tape reads names case-insensitively.

An unknown color gives the option the `default` color (`CDCCC9`), without an error. This includes a hex value with `#`.

| Name | Hex value |
| :-- | :-- |
| `default` | `CDCCC9` |
| `gray` | `6E7174` |
| `brown` | `8B2E00` |
| `orange` | `F45D00` |
| `yellow` | `DEA700` |
| `green` | `00866A` |
| `blue` | `0077DE` |
| `purple` | `6724DD` |
| `pink` | `DC0080` |
| `red` | `FE001A` |

## App creation

Use the [create app endpoint](/docs/api/resource/app#create-an-app) to create category fields together with a new app.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

The example creates a leads app for a solar installer in the workspace with ID `1`. The app gets a `single_category` field "Pipeline Stage" and a `multi_category` field "Products". The example leaves out other fields of a leads app, like "Name" or "Company".

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
        "field_type": "single_category",
        "config": {
          "label": "Pipeline Stage",
          "description": "The current stage of the lead in the sales pipeline.",
          "required": true,
          "settings": {
            "options": [
              { "text": "New", "color": "gray" },
              { "text": "Contacted", "color": "blue" },
              { "text": "Won", "color": "green" },
              { "text": "Lost", "color": "red" }
            ]
          }
        }
      },
      {
        "field_type": "multi_category",
        "config": {
          "label": "Products",
          "description": "The products the lead is interested in.",
          "settings": {
            "layout": "list",
            "options": [
              { "text": "Solar panels", "color": "yellow" },
              { "text": "Battery storage", "color": "green" },
              { "text": "Heat pump" }
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
  "name": "Leads",
  "item_name": "Lead",
  "fields": [
    {
      "field_type": "single_category",
      "config": {
        "label": "Pipeline Stage",
        "description": "The current stage of the lead in the sales pipeline.",
        "required": true,
        "settings": {
          "options": [
            { "text": "New", "color": "gray" },
            { "text": "Contacted", "color": "blue" },
            { "text": "Won", "color": "green" },
            { "text": "Lost", "color": "red" }
          ]
        }
      }
    },
    {
      "field_type": "multi_category",
      "config": {
        "label": "Products",
        "description": "The products the lead is interested in.",
        "settings": {
          "layout": "list",
          "options": [
            { "text": "Solar panels", "color": "yellow" },
            { "text": "Battery storage", "color": "green" },
            { "text": "Heat pump" }
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
      "external_id": "pipeline_stage",
      "slug": "pipeline_stage",
      "label": "Pipeline Stage",
      "type": "category",
      "field_type": "single_category",
      "config": {
        "label": "Pipeline Stage",
        "slug": "pipeline_stage",
        "external_id": "pipeline_stage",
        "description": "The current stage of the lead in the sales pipeline.",
        "show_description": false,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "multiple": false,
          "layout": "dropdown",
          "options": [
            { "id": 1, "text": "New", "color": "6E7174" },
            { "id": 2, "text": "Contacted", "color": "0077DE" },
            { "id": 3, "text": "Won", "color": "00866A" },
            { "id": 4, "text": "Lost", "color": "FE001A" }
          ]
        }
      }
    },
    {
      "field_id": 2,
      "external_id": "products",
      "slug": "products",
      "label": "Products",
      "type": "category",
      "field_type": "multi_category",
      "config": {
        "label": "Products",
        "slug": "products",
        "external_id": "products",
        "description": "The products the lead is interested in.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "multiple": true,
          "layout": "list",
          "options": [
            { "id": 5, "text": "Solar panels", "color": "DEA700" },
            { "id": 6, "text": "Battery storage", "color": "00866A" },
            { "id": 7, "text": "Heat pump", "color": "6E7174" }
          ]
        }
      }
    }
  ]
}
```

**General behavior**

- Tape keeps the order of `options` from the request.
- Without `layout`, a new field uses `"dropdown"`.
- Without `color`, a new option is gray (`6E7174`). Here, that's "Heat pump".
- Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Pipeline Stage".
- A new category field doesn't show its `description` as help text (`show_description` is `false`).

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- An option without `text` returns `400`.
- A `layout` other than `"dropdown"`, `"list"` or `"inline"` returns `400`.

## App update

Use the [update app endpoint](/docs/api/resource/app#update-an-app) to create new category fields in an app or to change existing ones.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

The example changes the "Pipeline Stage" field (ID `1`) of the leads app. It adds the option "Negotiating" between "Contacted" and "Won", changes the color of "Lost" to orange and sets `layout` to `"list"`. The "Products" field isn't in the request, so it stays unchanged.

Find the app ID and the field IDs in the [Developer view of the app](/docs/api/resource/app#find-app-and-field-ids). Find the option IDs in `config.settings.options` of the field, for example with [Retrieve a single app](/docs/api/resource/app#retrieve-a-single-app).

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
          "label": "Pipeline Stage",
          "required": true,
          "settings": {
            "layout": "list",
            "options": [
              { "id": 1, "text": "New", "color": "gray" },
              { "id": 2, "text": "Contacted", "color": "blue" },
              { "text": "Negotiating", "color": "yellow" },
              { "id": 3, "text": "Won", "color": "green" },
              { "id": 4, "text": "Lost", "color": "orange" }
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
        "label": "Pipeline Stage",
        "required": true,
        "settings": {
          "layout": "list",
          "options": [
            { "id": 1, "text": "New", "color": "gray" },
            { "id": 2, "text": "Contacted", "color": "blue" },
            { "text": "Negotiating", "color": "yellow" },
            { "id": 3, "text": "Won", "color": "green" },
            { "id": 4, "text": "Lost", "color": "orange" }
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
      "external_id": "pipeline_stage",
      "slug": "pipeline_stage",
      "label": "Pipeline Stage",
      "type": "category",
      "field_type": "single_category",
      "config": {
        "label": "Pipeline Stage",
        "slug": "pipeline_stage",
        "external_id": "pipeline_stage",
        "description": "The current stage of the lead in the sales pipeline.",
        "show_description": false,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "multiple": false,
          "layout": "list",
          "options": [
            { "id": 1, "text": "New", "color": "6E7174" },
            { "id": 2, "text": "Contacted", "color": "0077DE" },
            { "id": 8, "text": "Negotiating", "color": "DEA700" },
            { "id": 3, "text": "Won", "color": "00866A" },
            { "id": 4, "text": "Lost", "color": "F45D00" }
          ]
        }
      }
    },
    {
      "field_id": 2,
      "external_id": "products",
      "slug": "products",
      "label": "Products",
      "type": "category",
      "field_type": "multi_category",
      "config": {
        "label": "Products",
        "slug": "products",
        "external_id": "products",
        "description": "The products the lead is interested in.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "multiple": true,
          "layout": "list",
          "options": [
            { "id": 5, "text": "Solar panels", "color": "DEA700" },
            { "id": 6, "text": "Battery storage", "color": "00866A" },
            { "id": 7, "text": "Heat pump", "color": "6E7174" }
          ]
        }
      }
    }
  ]
}
```

**General behavior**

- A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
- An option with `id` changes that option. To rename it, send its `id` with the new `text`. An option without `id` creates a new option.
- Options you leave out of `options` stay unchanged. To set a new order, send all existing options in that order.
- An option you send without the other options moves to the end of the list, also when you only rename it. To keep the order, send all options in the order you want.
- To delete options, list their IDs in `settings.options_to_delete`, for example `"options_to_delete": [{ "id": 4 }]`. Tape also accepts plain IDs: `[4]`. An option that is also in `options` stays.
- Without `layout`, the field keeps its layout.
- Send `required`, `always_hidden` and `hidden_if_empty` with every field you update. Tape sets left-out switches to `false`. `show_description` stays as it is, with or without `description`. See [Create and update fields](/docs/api/resource/field/overview#create-and-update-fields).
- Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.
- An option without `text` returns `400`.
- An option ID in `options` or `options_to_delete` that doesn't belong to the field returns `400`.
- A `layout` other than `"dropdown"`, `"list"` or `"inline"` returns `400`.

## Next steps

- [Category field value](/docs/api/resource/field-value/category): read and set the selected options of a record.
- [Status field](/docs/api/resource/field/status): options that mark a record as open or done.
- [Field](/docs/api/resource/field/overview): the properties all field types share.
- [App](/docs/api/resource/app): create, update and delete apps with their fields.
- [Capabilities](/docs/api/capabilities): what `apps:edit` allows.
