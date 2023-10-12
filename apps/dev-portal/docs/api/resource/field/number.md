---
id: number
title: Number Field
sidebar_label: Number
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

There is only type of number field: `number`.

`number` fields can hold a single number value.

In addition to the common field properties, a number field has the following settings:

- `decimals` (optional): number of decimal places of the numeric field-values. Can be any integer between 0 and 8. (default: 0)
- `unit` (optional): label of the unit of the numeric field-values. Can be any string, e.g. "m" for meters, "kg" for kilograms, "€" for euros, etc.
- `unit_location` (optional): location of the unit of the numeric field-values. Can be one of ["prefix", "suffix"]. If set to "prefix", the unit will be prepended to the numeric field-values, if set to "suffix", the unit will be appended to the numeric field-values

## App creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/app" />

A number field can be created as part of an App creation. Here is an example request body for creating an excerpt for a Deals app within a workspace with ID 1.
The app contains a `number` field "Closing Amount". Other useful fields for a deals app, like "Name", "Stage" or "Closing Date" are omitted for brevity.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X POST #BASE_URL/v1/app/ \\
   -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \\
   --data '{
    "workspace_id": 1,
    "name": "Deals",
    "item_name": "Deal",
    "fields": [
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
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "workspace_id": 1,
  "name": "Deals",
  "item_name": "Deal",
  "fields": [
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

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "deals",
  "name": "Deals",
  "item_name": "Deal",
  "position": 0,
  "config": {
    "item_name": "Deal",
    "name": "Deals"
  },
  "fields": [
    {
      "field_id": 921,
      "slug": "closing_amount",
      "label": "Closing Amount",
      "type": "number",
      "field_type": "number",
      "config": {
        "label": "Closing Amount",
        "slug": "closing_amount",
        "description": "The amount of the deal.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
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

## App update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

A number field can be created or updated as part of an App update. Here is an example request body for updating the previously created deals app with ID 1.
The update sets the `unit` to "$" and the `unit_location` to "prefix".

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`
curl -X PUT #BASE_URL/v1/app/1 \\
  -u #USER_API_KEY: \\
   -H "Content-Type: application/json" \
   --data '{
    "app_id": 1,
    "name": "Contacts",
    "item_name": "Contact",
    "fields": [
      {
        "field_id": 1,
         "config": {
            "label": "Closing Amount",
            "description": "The amount of the deal.",
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
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "app_id": 1,
  "name": "Contacts",
  "item_name": "Contact",
  "fields": [
    {
      "field_id": 1,
      "config": {
        "label": "Closing Amount",
        "description": "The amount of the deal.",
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

</TabItem>
</Tabs>

````json title="⬅️      Response"
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "deals",
  "external_id": "deals",
  "name": "Deals",
  "record_name": "Deal",
  "item_name": "Deal",
  "position": 0,
  "config": {
    "item_name": "Deal",
    "name": "Deals"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "closing_amount",
      "slug": "closing_amount",
      "label": "Closing Amount",
      "type": "number",
      "field_type": "number",
      "config": {
        "label": "Closing Amount",
        "slug": "closing_amount",
        "description": "The amount of the deal.",
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "settings": {
          "unit_location": "prefix",
          "decimals": 2,
          "unit_label": "$",
          "unit": "$"
        }
      }
    }
  ]
}```

````
