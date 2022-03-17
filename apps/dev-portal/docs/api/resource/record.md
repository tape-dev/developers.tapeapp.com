---
id: record
title: Record
sidebar_label: Record
---

## Get Record

:::info URL
**GET** https://api.tapeapp.com/v1/record/{recordId}
:::

_Returns the record with the specified `recordId`._

## Create Record

:::info URL
**POST** https://api.tapeapp.com/v1/record/app/{appId}
:::

_Creates a new record for the App with the specified `appId` and returns the newly created record.`._

## Update Record

:::info URL
**PUT** https://api.tapeapp.com/v1/record/{recordId}
:::

_Updates the record with the specified `recordId` and returns the updated record.`._

## Get Records for App

:::info URL
**GET** https://api.tapeapp.com/v1/record/app/{appId}
:::

_Returns records for the App with the specified `appId`._

### Query Parameters

| Parameter | Type    | ** Type**                                    | Min | Max |
| --------- | ------- | -------------------------------------------- | --- | --- |
| limit     | Integer | Number of records to return. Defaults to 50. | 0   | 500 |
| cursor    | String  | Cursor for pagination                        | -   | -   |
| sort_by   | String  | Slug of the field that should be sorted by.  | -   | -   |

## Filter Records for App

:::info URL
**POST** https://api.tapeapp.com/v1/record/app/{appId}/filter
:::

_Returns records for the App with the specified `appId` based on the filters and sorts._

### Query Parameters

| Parameter | Type    | Description                                  | Min | Max |
| --------- | ------- | -------------------------------------------- | --- | --- |
| limit     | Integer | Number of records to return. Defaults to 50. | 0   | 500 |
| cursor    | String  | Cursor for pagination                        | -   | -   |
| sort_by   | String  | Slug of the field that should be sorted by.  | -   | -   |

### Request body
