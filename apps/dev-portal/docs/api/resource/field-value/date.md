---
id: date
title: Date Field Value
sidebar_label: Date
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A date field value consists of its `value` property which holds a start date and optionally an end date. A start date has the properties `start` (datetime string), `start_date` (date string), `start_time` (HH:mm:ss formatted string), an end date is structured in the same way. A `SINGLE_DATE` field value can only hold a start date while a `RANGE_DATE` field value can hold an additional end date.

More details on date and datetime strings can be found [here](/docs/api/date-timezone).

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A date field value can be created as part of a record creation. Here is an example request body for creating a record with a value for the "Date of employment" field with ID 2, type `SINGLE_DATE` and external ID `date_of_employment` and a value for the "Onboarding week" field with ID 3, type `RANGE_DATE` and external ID `onboarding_week`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "date_of_employment": "2022-03-01",
      "onboarding_week": "2022-03-07 - 2022-03-14"
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "date_of_employment": "2022-03-01",
    "onboarding_week": "2022-03-07 - 2022-03-14"
  }
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "record_id": 1,
  "title": "Tuesday, 1. March 2022",
  "fields": [
    {
      "field_id": 2,
      "external_id": "date_of_employment",
      "label": "Date of employment",
      "type": "date",
      "field_type": "SINGLE_DATE",
      "values": [
        {
          "start": "2022-03-01 00:00:00",
          "start_date": "2022-03-01",
          "start_time": null,
          "start_utc": "2022-03-01 00:00:00",
          "start_date_utc": "2022-03-01",
          "start_time_utc": null
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "onboarding_week",
      "label": "Onboarding week",
      "field_type": "RANGE_DATE",
      "type": "date",
      "values": [
        {
          "start": "2022-03-07 00:00:00",
          "start_date": "2022-03-07",
          "start_time": "00:00:00",
          "start_utc": "2022-03-07 00:00:00",
          "start_date_utc": "2022-03-07",
          "start_time_utc": "00:00:00",
          "end": "2022-03-14 00:00:00",
          "end_date": "2022-03-14",
          "end_time": "00:00:00",
          "end_utc": "2022-03-14 00:00:00",
          "end_date_utc": "2022-03-14",
          "end_time_utc": "00:00:00"
        }
      ]
    }
  ]
}
```

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A date field value can be retrieved as part of a record retrieval:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Tuesday, 1. March 2022",
  "fields": [
    {
      "field_id": 2,
      "external_id": "date_of_employment",
      "label": "Date of employment",
      "type": "date",
      "field_type": "SINGLE_DATE",
      "values": [
        {
          "start": "2022-03-01 00:00:00",
          "start_date": "2022-03-01",
          "start_time": null,
          "start_utc": "2022-03-01 00:00:00",
          "start_date_utc": "2022-03-01",
          "start_time_utc": null
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "onboarding_week",
      "label": "Onboarding week",
      "field_type": "RANGE_DATE",
      "type": "date",
      "values": [
        {
          "start": "2022-03-07 00:00:00",
          "start_date": "2022-03-07",
          "start_time": "00:00:00",
          "start_utc": "2022-03-07 00:00:00",
          "start_date_utc": "2022-03-07",
          "start_time_utc": "00:00:00",
          "end": "2022-03-14 00:00:00",
          "end_date": "2022-03-14",
          "end_time": "00:00:00",
          "end_utc": "2022-03-14 00:00:00",
          "end_date_utc": "2022-03-14",
          "end_time_utc": "00:00:00"
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more date field values can be updated as part of a record update. Here is an example request body for updating multiple date field values of a record:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
        "date_of_employment": "2022-03-02",
        "onboarding_week": "2022-03-08 - 2022-03-15"
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "date_of_employment": "2022-03-02",
    "onboarding_week": "2022-03-08 - 2022-03-15"
  }
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "Wednesday, 2. March 2022",
  "fields": [
    {
      "field_id": 2,
      "external_id": "date_of_employment",
      "label": "Date of employment",
      "type": "date",
      "field_type": "SINGLE_DATE",
      "values": [
        {
          "start": "2022-03-02 00:00:00",
          "start_date": "2022-03-02",
          "start_time": null,
          "start_utc": "2022-03-02 00:00:00",
          "start_date_utc": "2022-03-02",
          "start_time_utc": null
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "onboarding_week",
      "label": "Onboarding week",
      "field_type": "RANGE_DATE",
      "type": "date",
      "values": [
        {
          "start": "2022-03-08 00:00:00",
          "start_date": "2022-03-08",
          "start_time": "00:00:00",
          "start_utc": "2022-03-08 00:00:00",
          "start_date_utc": "2022-03-08",
          "start_time_utc": "00:00:00",
          "end": "2022-03-15 00:00:00",
          "end_date": "2022-03-15",
          "end_time": "00:00:00",
          "end_utc": "2022-03-15 00:00:00",
          "end_date_utc": "2022-03-15",
          "end_time_utc": "00:00:00"
        }
      ]
    }
  ]
}
```
