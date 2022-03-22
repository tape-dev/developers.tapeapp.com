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

<Tabs>
<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/#RECORD_ID  \\
  -u #USER_API_KEY:
`}
</ContextCodeBlock>
</TabItem>
</Tabs>

<ContextCodeBlock language="shell" title='⬅️      Response'>
{`
`}
</ContextCodeBlock>

## Update a Record

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

Updates the record with the specified `record_id` and returns the updated record:

## Delete a Record

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/record/{record_id}" />

Delete the record with the specified `record_id`.

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
