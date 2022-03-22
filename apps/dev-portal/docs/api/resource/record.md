---
id: record
title: Record
sidebar_label: Record
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Records are the place where work gets done inside a Tape organization.

## Create a Record

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

Creates a new record for the App with the specified `app_id` and returns the newly created record:

<ContextCodeBlock title='➡️      Request'>
{`{
  "external_id": The external ID of the record.
  "fields": The values for each field,
  {
    "{field_id/external_id}": The values for the given field in one of the formats:
      [
        {
          "{sub_id}":{value},
          ... (more sub_ids and values)
        },
        ... (more values)
      ]
      or
      [
        {value},
        ... (more values)
      ]
      or
      {
        "{sub_id}":{value},
        ... (more sub_ids and values)
      }
      or
      {value}
    },
    .... (more fields)
  },
}
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "record_id": "The ID of the newly created record",
  "title": "The title of the newly created record"
}
```

## Retrieve a Record

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

Returns the record with the specified `record_id`.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/#RECORD_ID  \\
  -u #USER_API_KEY:
`}
</ContextCodeBlock>

<ContextCodeBlock language="shell" title='⬅️      Response'>
{`{
  "id": 1,
  "title": "Module 5",
  "app": {
    "app_id": 16,
    "icon": "star",
    "name": "Modules",
    "record_name": "Module",
    "workspace_id": 4,
    "config": {
      "name": "Modules",
      "icon": "star",
      "record_name": "Module",
      "workspace_id": 4
    }
  },
  "created_on": "2022-03-22 13:32:37",
  "fields": [
    {
      "field_id": 93,
      "slug": "title",
      "label": "Title",
      "type": "text",
      "field_type": "SINGLE_TEXT",
      "config": {
        "label": "Title",
        "delta": "A",
        "required": true,
        "settings": {
          "formatted": false
        }
      },
      "values": [
        {
          "value": "Module 5"
        }
      ]
    }
  ]
}`}
</ContextCodeBlock>

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

<ContextCodeBlock title='➡️      Request'>
{`{
  "external_id": The external ID of the record.
  "fields": The values for each field,
  {
    "{field_id/external_id}": The values for the given field in one of the formats:
      [
        {
          "{sub_id}":{value},
          ... (more sub_ids and values)
        },
        ... (more values)
      ]
      or
      [
        {value},
        ... (more values)
      ]
      or
      {
        "{sub_id}":{value},
        ... (more sub_ids and values)
      }
      or
      {value}
    },
    .... (more fields)
  },
}
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{}
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
