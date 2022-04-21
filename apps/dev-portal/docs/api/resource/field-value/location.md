---
id: location
title: Location Field Value
sidebar_label: Location
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A location field value consists of its `value` property, an object containing the properties describe a location. The value is a geographic location. A `location` field value holds at most one location value.

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A location field value can be created as part of a record creation. Here is an example request body for creating a record with a value for the "Company Address" field with ID 2, type `location` and external ID `company_address`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "company_address": {
        "city": "Munich",
        "country": "Germany",
        "value": "Hessstr. 6, 80799 Munich, Germany",
        "state": "Bavaria",
        "postal_code": "80799",
        "street_address": "Hessstr. 6"
      }
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "company_address": {
      "city": "Munich",
      "map_in_sync": true,
      "country": "Germany",
      "value": "Hessstr. 6, 80799 Munich, Germany",
      "state": "Bavaria",
      "postal_code": "80799",
      "street_address": "Hessstr. 6"
    }
  }
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "record_id": 1,
  "title": "Hessstr. 6, 80799 Munich, Germany",
  "fields": [
    {
      "field_Id": 2,
      "external_id": "company_address",
      "type": "location",
      "field_type": "single_location",
      "label": "Company Address",
      "values": [
        {
          "city": "Munich",
          "map_in_sync": true,
          "country": "Germany",
          "original_formatted_address": "Hessstr. 6, 80799 Munich, Germany",
          "value": "Hessstr. 6, 80799 Munich, Germany",
          "state": "Bavaria",
          "postal_code": "80799",
          "street_address": "Hessstr. 6"
        }
      ]
    }
  ]
}
```

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A location field value can be retrieved as part of a record retrieval:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Hessstr. 6, 80799 Munich, Germany",
  "fields": [
    {
      "field_Id": 2,
      "external_id": "company_address",
      "type": "location",
      "field_type": "single_location",
      "label": "Company Address",
      "values": [
        {
          "city": "Munich",
          "map_in_sync": true,
          "country": "Germany",
          "original_formatted_address": "Hessstr. 6, 80799 Munich, Germany",
          "value": "Hessstr. 6, 80799 Munich, Germany",
          "state": "Bavaria",
          "postal_code": "80799",
          "street_address": "Hessstr. 6"
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more location field values can be updated as part of a record update. Here is an example request body for updating a record with a value for the "Company Address" field with ID 2, type `location` and external ID `company_address`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "company_address": {
        "city": "Munich",
        "country": "Germany",
        "value": "Hessstr. 6, 80799 Munich, Germany",
        "state": "Bavaria",
        "postal_code": "80799",
        "street_address": "Hessstr. 6"
      }
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "company_address": {
      "city": "Munich",
      "map_in_sync": true,
      "country": "Germany",
      "value": "Hessstr. 6, 80799 Munich, Germany",
      "state": "Bavaria",
      "postal_code": "80799",
      "street_address": "Hessstr. 6"
    }
  }
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "record_id": 1,
  "title": "Hessstr. 6, 80799 Munich, Germany",
  "fields": [
    {
      "field_Id": 2,
      "external_id": "company_address",
      "type": "location",
      "field_type": "single_location",
      "label": "Company Address",
      "values": [
        {
          "city": "Munich",
          "map_in_sync": true,
          "country": "Germany",
          "original_formatted_address": "Hessstr. 6, 80799 Munich, Germany",
          "value": "Hessstr. 6, 80799 Munich, Germany",
          "state": "Bavaria",
          "postal_code": "80799",
          "street_address": "Hessstr. 6"
        }
      ]
    }
  ]
}
```
