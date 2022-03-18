---
id: record
title: Record
sidebar_label: Record
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'

## Get Record

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{recordId}" />

Returns the record with the specified `recordId`.

## Create Record

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{appId}" />

Creates a new record for the App with the specified `appId` and returns the newly created record.`.

## Update Record

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{recordId}" />

Updates the record with the specified `recordId` and returns the updated record.`.

## Get Records for App

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/app/{appId}" />

Returns records for the App with the specified `appId`.

### Query Parameters

| Parameter | Type    | ** Type**                                    | Min | Max |
| --------- | ------- | -------------------------------------------- | --- | --- |
| limit     | Integer | Number of records to return. Defaults to 50. | 0   | 500 |
| cursor    | String  | Cursor for pagination                        | -   | -   |
| sort_by   | String  | Slug of the field that should be sorted by.  | -   | -   |

## Filter Records for App

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{appId}/filter" />

Returns records for the App with the specified `appId` based on the filters and sorts.

### Query Parameters

| Parameter | Type    | Description                                  | Min | Max |
| --------- | ------- | -------------------------------------------- | --- | --- |
| limit     | Integer | Number of records to return. Defaults to 50. | 0   | 500 |
| cursor    | String  | Cursor for pagination                        | -   | -   |
| sort_by   | String  | Slug of the field that should be sorted by.  | -   | -   |

### Request body
