---
id: record
title: Record
sidebar_label: Record
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Records are the place where work gets done inside a Tape organization. Records can be created, retrieved, updated and deleted via the API.

## Create a Record

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

To create a new record for the app with the specified `app_id`, issue a POST request to this endpoint. The POST body specifies has to contain the `fields` property with the key-value pairs of the field values to create for this record.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "first_name": "Adam Smith"
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "first_name": "Adam Smith"
  }
}
```

</TabItem>
</Tabs>

The example above only specifies a `SINGLE_TEXT` field value as part of the record creation. See the [field value](field-value/general) documentation section for examples of all supported field types.

Upon successful creation, the server returns the created record:

```json title='⬅️      Response'
{
  "id": 1,
  "title": "Adam Smith",
  "created_on": "2022-03-01 12:00:00",
  "app": {
    "app_id": 1,
    "icon": "event_available",
    "name": "Contacts",
    "record_name": "Contact",
    "workspace_id": 1,
    "config": {
      "name": "Contacts",
      "icon": "event_available",
      "record_name": "Contact",
      "workspace_id": 1
    }
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "SINGLE_TEXT",
      "config": {
        "label": "Full Name",
        "required": true,
        "settings": {
          "formatted": false
        }
      },
      "values": [
        {
          "value": "Adam Smith"
        }
      ]
    }
  ]
}
```

## Retrieve a Record

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

Retrieve the record with the specified `record_id`:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "id": 1,
  "title": "Adam Smith",
  "created_on": "2022-03-01 12:00:00",
  "app": {
    "app_id": 1,
    "icon": "event_available",
    "name": "Contacts",
    "record_name": "Contact",
    "workspace_id": 1,
    "config": {
      "name": "Contacts",
      "icon": "event_available",
      "record_name": "Contact",
      "workspace_id": 1
    }
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "SINGLE_TEXT",
      "config": {
        "label": "Full Name",
        "required": true,
        "settings": {
          "formatted": false
        }
      },
      "values": [
        {
          "value": "Adam Smith"
        }
      ]
    }
  ]
}
```

The example response above only contains a `SINGLE_TEXT` field value. See the [field value](field-value/general) documentation section for examples of all supported field types.

Attempting to retrieve a deleted record returns the following error:

<ContextCodeBlock language="json">
{`{
"status_code": 400,
"endpoint": "/v1/record/17",
"error_code": "record_deleted",
"error_message": "Record is deleted(17)!"
}`}
</ContextCodeBlock>

## Update a Record

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

Updates the record with the specified `record_id` and returns the updated record:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "first_name": "Andrea Lim"
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "first_name": "Andrea Lim"
  }
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "id": 1,
  "title": "Andrea Lim",
  "created_on": "2022-03-01 12:00:00",
  "app": {
    "app_id": 1,
    "icon": "event_available",
    "name": "Contacts",
    "record_name": "Contact",
    "workspace_id": 1,
    "config": {
      "name": "Contacts",
      "icon": "event_available",
      "record_name": "Contact",
      "workspace_id": 1
    }
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "SINGLE_TEXT",
      "config": {
        "label": "Full Name",
        "required": true,
        "settings": {
          "formatted": false
        }
      },
      "values": [
        {
          "value": "Andrea Lim"
        }
      ]
    }
  ]
}
```

## Delete a Record

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/record/{record_id}" />

Delete the record with the specified `record_id`:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X DELETE #BASE_URL/v1/record/#RECORD_ID  \\
  -u #USER_API_KEY:
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{}
```

If the record has already been deleted, the following error is returned:

<ContextCodeBlock language="json">
{`{
  "status_code": 400,
  "endpoint": "/v1/record/#RECORD_ID",
  "error_code": "record_deleted",
  "error_message": "Record is deleted(#RECORD_ID)!"
}`}
</ContextCodeBlock>

## Get Records for an App

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

Returns records for the App with the specified `app_id`.

**Query Parameters**

| Parameter | Type    | ** Type**                                    | Min | Max |
| --------- | ------- | -------------------------------------------- | --- | --- |
| limit     | Integer | Number of records to return. Defaults to 50. | 0   | 500 |
| cursor    | String  | Cursor for pagination                        | -   | -   |
| sort_by   | String  | Slug of the field that should be sorted by.  | -   | -   |

## Filter Records for an App

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}/filter" />

Returns records for the App with the specified `app_id` based on the filters and sorts.

**Query Parameters**

| Parameter | Type    | Description                                  | Min | Max |
| --------- | ------- | -------------------------------------------- | --- | --- |
| limit     | Integer | Number of records to return. Defaults to 50. | 0   | 500 |
| cursor    | String  | Cursor for pagination                        | -   | -   |
| sort_by   | String  | Slug of the field that should be sorted by.  | -   | -   |
