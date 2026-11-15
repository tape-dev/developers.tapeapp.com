# Number field

> Use a number field to store an amount, a quantity or any other number in a record.

Use a number field to store an amount, a quantity or any other number in a record.

Tape has one number field type: `number` is the **Number** field. It holds one number per record.

A number field has the [common field properties](https://developers.tapeapp.com/docs/api/resource/field/overview#common-properties) and the `settings` below. To read and write the number of a record, see [Number field value](https://developers.tapeapp.com/docs/api/resource/field-value/number).

*Number field object*

```json
{
  "field_id": 2,
  "external_id": "closing_amount",
  "slug": "closing_amount",
  "label": "Closing Amount",
  "type": "number",
  "field_type": "number",
  "config": {
    "label": "Closing Amount",
    "slug": "closing_amount",
    "external_id": "closing_amount",
    "description": "The amount of the deal.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
    "settings": {
      "unit_location": "suffix",
      "decimals": 2,
      "unit_label": "€",
      "unit": "€"
    }
  }
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"number"`. | `"number"` |
| `field_type` | `string` | `"number"`. | `"number"` |
| `config.settings.decimals` | `number` or `null` | Number of decimal places, from 0 to 8. `null` means automatic precision. A new field without `decimals` gets `0`. | `2` |
| `config.settings.unit` | `string` | Unit shown with the value, for example `"€"`, `"kg"` or `"kWh"`. | `"€"` |
| `config.settings.unit_location` | `string` | Where Tape shows the unit: `"prefix"` before the value, `"suffix"` after it. Without `unit_location`, Tape shows the unit before the value. Responses can show `"prefix_and_suffix"` for fields set up in Tape. `unit` then holds only the prefix. The API can't set a prefix and a suffix together. | `"suffix"` |
| `config.settings.unit_label` (read-only) | `string` | Same as `unit`, kept for backwards compatibility. | `"€"` |

## App creation

Use the [create app endpoint](https://developers.tapeapp.com/docs/api/resource/app#create-an-app) to create number fields together with a new app.

`POST https://api.tapeapp.com/v1/app`

**cURL**

*Request*

```shell

curl -X POST https://api.tapeapp.com/v1/app/ \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
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
        "field_type": "number",
        "config": {
          "label": "Closing Amount",
          "description": "The amount of the deal.",
          "required": false,
          "settings": {
            "decimals": 2,
            "unit": "€",
            "unit_location": "suffix"
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
      "field_type": "number",
      "config": {
        "label": "Closing Amount",
        "description": "The amount of the deal.",
        "required": false,
        "settings": {
          "decimals": 2,
          "unit": "€",
          "unit_location": "suffix"
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
      "external_id": "closing_amount",
      "slug": "closing_amount",
      "label": "Closing Amount",
      "type": "number",
      "field_type": "number",
      "config": {
        "label": "Closing Amount",
        "slug": "closing_amount",
        "external_id": "closing_amount",
        "description": "The amount of the deal.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "unit_location": "suffix",
          "decimals": 2,
          "unit_label": "€",
          "unit": "€"
        }
      }
    }
  ]
}
```

The example creates a deals app in the workspace with ID `1`. The app gets a `single_text` field "Deal Name" and a `number` field "Closing Amount" with two decimal places and the unit "€" after the value.

Find the workspace ID with [Retrieve workspaces](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspaces).

**General behavior**

-   Without `decimals`, the field gets `0` decimal places. Send `"decimals": null` for automatic precision.
-   Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Deal Name".
-   A new number field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   `decimals` below 0 or above 8 returns `400`.

## App update

Use the [update app endpoint](https://developers.tapeapp.com/docs/api/resource/app#update-an-app) to create new number fields in an app or to change existing ones.

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
          "label": "Closing Amount",
          "description": "The amount of the deal in US dollars.",
          "required": false,
          "settings": {
            "decimals": 2,
            "unit": "$",
            "unit_location": "prefix"
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
        "label": "Closing Amount",
        "description": "The amount of the deal in US dollars.",
        "required": false,
        "settings": {
          "decimals": 2,
          "unit": "$",
          "unit_location": "prefix"
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
      "external_id": "closing_amount",
      "slug": "closing_amount",
      "label": "Closing Amount",
      "type": "number",
      "field_type": "number",
      "config": {
        "label": "Closing Amount",
        "slug": "closing_amount",
        "external_id": "closing_amount",
        "description": "The amount of the deal in US dollars.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "unit_location": "prefix",
          "decimals": 2,
          "unit_label": "$",
          "unit": "$"
        }
      }
    }
  ]
}
```

The example changes the "Closing Amount" field (ID `2`) of the deals app to US dollars. The unit becomes "$" and moves in front of the value. The "Deal Name" field isn't in the request, so it stays unchanged.

Find the app ID and the field IDs in the [Developer view of the app](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

**General behavior**

-   A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
-   Settings you leave out keep their values. Without `decimals`, the number of decimal places stays the same.
-   Changing `decimals` to a number rounds the stored values of the field to that number of decimal places. Changing it to `null` keeps the stored values as they are.
-   Changing `unit` or `unit_location` changes only how Tape shows the values.
-   Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](https://developers.tapeapp.com/docs/api/resource/field/overview#create-and-update-fields).
-   Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.
-   `decimals` below 0 or above 8 returns `400`.

## Next steps

[

Number field value

read and write the number of a record.

](https://developers.tapeapp.com/docs/api/resource/field-value/number)[

Calculation field

compute numbers from other fields.

](https://developers.tapeapp.com/docs/api/resource/field/calculation)[

Field

the properties all field types share.

](https://developers.tapeapp.com/docs/api/resource/field/overview)[

App

create, update and delete apps with their fields.

](https://developers.tapeapp.com/docs/api/resource/app)[

Capabilities

what `apps:edit` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
