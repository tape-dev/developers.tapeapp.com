---
id: pagination
title: Pagination
sidebar_label: Pagination
---

Use a `cursor` to page through endpoints that return long collections.

Many collection endpoints are *cursor-paginated*. Each response carries a `cursor`. Pass it back to fetch the next page. Some collection endpoints don't paginate. See [Non-paginated collections](#non-paginated-collections).

## Requests

Cursor-paginated endpoints accept these parameters:

| Parameter | Type                 | Description                                                                                                                                            |
| :-------- | :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cursor`  | `string` (optional)  | A `cursor` from a previous response, used to request the next page. Treat it as opaque. Omit it (default) to start from the beginning.        |
| `limit`   | `integer` (optional) | The maximum number of items to return in the page. The response may contain fewer. Defaults and maximums vary per endpoint. |

:::info What are the default and maximum for `limit`?
`50` / `500` is the common case, for example for the record listing and filter endpoints and the automation run endpoints. It isn't universal: record comments cap at `100`, and related records default to `1000`. Each endpoint page states its own default and maximum.
:::

:::info Where do the parameters go?
For `GET` endpoints, pass `cursor` and `limit` in the *query string*. For `POST` endpoints, pass them in the request *body*.

The exception: the record [filter](/docs/api/resource/record#retrieve-filtered-records-for-an-app) endpoint uses `POST` but reads `cursor` and `limit` from the *query string*. The [related records](/docs/api/resource/record#retrieve-related-records-for-a-set-of-records) endpoint reads only `limit` there and has no pagination. When in doubt, follow the example on the endpoint's own page.
:::

## Responses

A cursor-paginated response contains these properties:

| Property       | Type      | Description                                                                                                                                                     |
| :------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `total`        | `integer` | The number of items that match the request across all pages. Tape measures it when you request the first page. Treat it as an approximate snapshot, not a live count.   |
| `cursor`       | `string`  | An opaque cursor that points at the last item on this page. Pass it back as the `cursor` parameter to fetch the next page. Some endpoints return `null` at the end. |
| _`collection`_ | `array`   | The page of results. The property is named for the resource, such as `records`, `comments` or `automation_runs`. It's *not* a generic `results`.                  |

A response looks like this (here the collection is `records`):

```json
{
  "total": 128,
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "records": [
    { "record_id": 2 },
    { "record_id": 3 }
  ]
}
```

For example, request the next page of [records of a database app](/docs/api/resource/record#retrieve-records-for-an-app) with `GET /v1/record/app/1?limit=50&cursor=eyJhbGci...`.

## Walk the whole collection

Repeat the request with the `cursor` from the previous response until a page has *fewer items than `limit`*, or `cursor` is `null`. Without `limit`, compare with the endpoint's default.

:::caution Paging search or shared records?
Several endpoints return a cursor even on the last page, so a short page marks the end. [Search](/docs/api/resource/search#pagination) and [shared records](/docs/api/resource/record#retrieve-shared-records) are the exception: page them until `cursor` is `null`. A full page can be the last one, and a search page can be short and still not be the last.
:::

## Non-paginated collections

Some endpoints return their *entire* collection in one response and accept no `cursor` or `limit`. They typically return `{ "total": <n>, "<collection>": [ ... ] }`, and sometimes only the array. Their resource pages document this.

Don't assume a collection endpoint is pageable unless its page documents `cursor` and `limit`.

## Next steps

- [Record](/docs/api/resource/record): list and filter records page by page.
- [Request limits](/docs/api/request-limits): the request budget behind every page.
- [Errors](/docs/api/errors): handle error responses.
