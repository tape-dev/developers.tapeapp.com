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

## Create a record

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

To create a new record for the app with the specified `app_id`, issue a POST request to this endpoint. The POST body specifies has to contain the `fields` property with the key-value pairs of the field values to create for this record.
The following query paramters are available:

| Query param | Type      | Description                                                         |
| :---------- | :-------- | :------------------------------------------------------------------ |
| `silent`    | `boolean` | Do not generate notifications for this operation (default: `false`) |
| `hook`      | `boolean` | Execute webhooks for this operation (default: `true`)               |
| `workflow`  | `boolean` | Trigger workflows for this operation (default: `true`)              |

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1 \\
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

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Adam Smith",
  "created_on": "2022-03-01 12:00:00",
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "values": [
        {
          "value": "Adam Smith"
        }
      ]
    }
  ]
}
```

The example above only specifies a `single_text` field value as part of the record creation. See the [field value](field-value/overview) documentation section for examples of all supported field types.

## Retrieve a record

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

Retrieve the record with the specified `record_id`.

| Query param       | Type      | Description                                                                          |
| :---------------- | :-------- | :----------------------------------------------------------------------------------- |
| `include_deleted` | `boolean` | Include records that are deleted but still accessible via a trash (default: `false`) |

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Adam Smith",
  "created_on": "2022-03-01 12:00:00",
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "values": [
        {
          "value": "Adam Smith"
        }
      ]
    }
  ]
}
```

The example response above only contains a `single_text` field value. See the [field value](field-value/overview) documentation section for examples of all supported field types.

Attempting to retrieve a deleted record returns the following error:

<ContextCodeBlock language="json">
{`{
"status_code": 400,
"endpoint": "/v1/record/17",
"error_code": "record_deleted",
"error_message": "Record is deleted(17)!"
}`}
</ContextCodeBlock>

## Update a record

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

Updates the record with the specified `record_id` and returns the updated record.
The following query paramters are available:

| Query param | Type      | Description                                                         |
| :---------- | :-------- | :------------------------------------------------------------------ |
| `silent`    | `boolean` | Do not generate notifications for this operation (default: `false`) |
| `hook`      | `boolean` | Execute webhooks for this operation (default: `true`)               |
| `workflow`  | `boolean` | Trigger Workflows for this operation (default: `true`)              |

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1 \\
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
  "record_id": 1,
  "title": "Andrea Lim",
  "created_on": "2022-03-01 12:00:00",
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "values": [
        {
          "value": "Andrea Lim"
        }
      ]
    }
  ]
}
```

The example above only specifies a `single_text` field value as part of the record update. See the [field value](field-value/overview) documentation section for examples of all supported field types.

## Delete a record

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/record/{record_id}" />

Delete the record with the specified `record_id`.
The following query paramters are available:

| Query param  | Type      | Description                                                                                        |
| :----------- | :-------- | :------------------------------------------------------------------------------------------------- |
| `silent`     | `boolean` | Do not generate notifications for this operation (default: `false`)                                |
| `hook`       | `boolean` | Execute webhooks for this operation (default: `true`)                                              |
| `skip_trash` | `boolean` | Do not place the deleted record in any trashes. Instead, remove it permanently. (default: `false`) |

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X DELETE #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Adam Smith",
  "created_on": "2022-03-01 12:00:00",
  "deleted_on": "2022-03-01 13:00:00",
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "values": [
        {
          "value": "Adam Smith"
        }
      ]
    }
  ]
}
```

If the record has already been deleted, the following error is returned:

<ContextCodeBlock language="json">
{`{
  "status_code": 400,
  "endpoint": "/v1/record/1",
  "error_code": "record_deleted",
  "error_message": "Record is deleted(1)!"
}`}
</ContextCodeBlock>

## Restore a record

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/{record_id}/restore" />

Restore the record with the specified `record_id`. This is only allowed if the record is in a trash you have access to.
The following query paramters are available:

| Query param | Type      | Description                                                         |
| :---------- | :-------- | :------------------------------------------------------------------ |
| `silent`    | `boolean` | Do not generate notifications for this operation (default: `false`) |
| `hook`      | `boolean` | Execute webhooks for this operation (default: `true`)               |

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/1/restore \\
  -u #USER_API_KEY:
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Adam Smith",
  "created_on": "2022-03-01 12:00:00",
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "values": [
        {
          "value": "Adam Smith"
        }
      ]
    }
  ]
}
```

## Retrieve records for an app

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

Retrieve records for the app with the specified `app_id`:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/app/1?limit=2 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 2,
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFiRGVmSWQiOjgsInZhbHVlcyI6WzE1OV0sImV4cCI6MTY1MDYxODc3OH0.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g",
  "records": [
    {
      "record_id": 2,
      "title": "Adam Smith",
      "created_on": "2022-03-23 08:48:42",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Adam Smith"
            }
          ]
        }
      ]
    },
    {
      "record_id": 1,
      "title": "Andrea Lim",
      "created_on": "2022-03-23 08:43:03",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Andrea Lim"
            }
          ]
        }
      ]
    }
  ]
}`}
</ContextCodeBlock>

**Query Parameters**

| Parameter | Type      | ** Type**                                          | Min | Max |
| --------- | --------- | -------------------------------------------------- | --- | --- |
| `limit`   | `integer` | Number of records to return. Defaults to 50.       | 0   | 500 |
| `cursor`  | `string`  | Cursor for pagination                              | -   | -   |
| `sort_by` | `string`  | External ID of the field that should be sorted by. | -   | -   |

## Retrieve filtered records for an app

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/filter/app/{app_id}" />

Retrieve records for the app with the specified `app_id` with filters:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/filter/app/1 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "filters": [
      {
        "field_id": "1",
        "field_type": "SINGLE_TEXT",
        "match_type": "contains",
        "values": [
          {
            "value": "John"
          }
        ],
        "type": "text"
      }
    ]
  }' 
  
`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 2,
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFiRGVmSWQiOjgsInZhbHVlcyI6WzE1OV0sImV4cCI6MTY1MDYxODc3OH0.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g",
  "records": [
    {
      "record_id": 3,
      "title": "John Doe",
      "created_on": "2022-03-23 08:48:42",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "John Doe"
            }
          ]
        }
      ]
    },
    {
      "record_id": 2,
      "title": "Alison Johnsson",
      "created_on": "2022-03-23 08:43:03",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Alison Johnsson"
            }
          ]
        }
      ]
    },
     {
      "record_id": 1,
      "title": "Karl John III",
      "created_on": "2022-03-23 08:43:03",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Karl John III"
            }
          ]
        }
      ]
    }
  ]
}`}
</ContextCodeBlock>

**Query Parameters**

| Parameter | Type      | ** Type**                                          | Min | Max |
| --------- | --------- | -------------------------------------------------- | --- | --- |
| `limit`   | `integer` | Number of records to return. Defaults to 50.       | 0   | 500 |
| `cursor`  | `string`  | Cursor for pagination                              | -   | -   |
| `sort_by` | `string`  | External ID of the field that should be sorted by. | -   | -   |

**Request Body Parameters**

| Parameter | Type    | ** Type**                                                                                                                                                                                                                                                                                         |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filters` | `Array` | Set of filters to be applied when retrieving records for the specified app. Filters are concatenated with the boolean operator `AND`. The example above only specifies a `single_text` filter. See the [filter](filter/overview) documentation section for examples of all supported field types. |

## Retrieve related records for a set of records

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}/ref/{ref_app_id}" />

Retrieve related records for the app with the specified `app_id` and the records with IDs `100` and `101` provided via the `recordIds` array inside the request body.:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1/ref/2?limit=10 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{ "recordIds": [100, 101], "direction": "forward" }' 
  `}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 2,
  "records": [
    {
      "record_id": 2,
      "title": "Adam Smith",
      "created_on": "2022-03-23 08:48:42",
      "app": {
        "app_id": 2,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Adam Smith"
            }
          ]
        }
      ]
    },
    {
      "record_id": 1,
      "title": "Andrea Lim",
      "created_on": "2022-03-23 08:43:03",
      "app": {
        "app_id": 2,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Andrea Lim"
            }
          ]
        }
      ]
    }
  ]
}`}
</ContextCodeBlock>

**Query Parameters**

| Parameter | Type      | ** Type**                                    | Min | Max |
| --------- | --------- | -------------------------------------------- | --- | --- |
| `limit`   | `integer` | Number of records to return. Defaults to 50. | 0   | 500 |

**Request Body Parameters**

| Parameter          | Type        | ** Type**                                                                                                                            |
| ------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `direction`        | `string`    | Direction of the returned relations. Possible values are `forward`, `reverse` and `both`.                                            |
| `recordIds`        | `integer[]` | IDs of the records for which related records should be returned. All IDs need to belong to records of the same App with ID `app_id`. |
| `relationFieldIds` | `integer[]` | IDs of the relation fields, for which related records should be returned. Optional.                                                  |

## Find relatable records for a relation field

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/field/{field_id}/find" />

Find records that can be related for the relation field (single or multi) with the specified `field_id`, in this case there is an app relation for that field to the app Contacts with `app_id` 1.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/field/1/find?text=adam \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 2,
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFiRGVmSWQiOjgsInZhbHVlcyI6WzE1OV0sImV4cCI6MTY1MDYxODc3OH0.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g",
  "records": [
    {
      "record_id": 2,
      "title": "Adam Smith",
      "created_on": "2022-03-23 08:48:42",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      }
    }
  ]
}`}
</ContextCodeBlock>

**Query Parameters**

| Parameter | Type     | ** Type**              | Min | Max |
| --------- | -------- | ---------------------- | --- | --- |
| `text`    | `string` | The text to search for | -   | -   |
