---
id: pagination
title: Pagination
sidebar_label: Pagination
---

Many endpoints that return a collection are **cursor-paginated**: you request a page of results and receive a
`cursor` in the response, which you pass back to fetch the next page. Repeating this walks the whole collection (or
just the part you need).

Not every collection endpoint paginates — some return the full collection in a single response. Those are called
out on their own resource pages; see [Non-paginated collections](#non-paginated-collections) below.

## Requests

Cursor-paginated endpoints accept the following parameters:

| Parameter | Type                 | Description                                                                                                                                            |
| :-------- | :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cursor`  | `string` (optional)  | A `cursor` returned from a previous response, used to request the next page. Treat it as opaque. Omit it (default) to start from the beginning.        |
| `limit`   | `integer` (optional) | The maximum number of items to return in the page. The response may contain fewer. Defaults and maximums vary per endpoint — commonly `50` and `500`. |

:::info The `limit` default and maximum are per-endpoint
`50` / `500` is the common case (for example the record listing and filter endpoints, and the automation-run
endpoints), but it is not universal — record comments cap at `100`, and related-records defaults to `1000`. Each
endpoint page states its own default and maximum.
:::

:::info Where the parameters go depends on the method
For endpoints using the HTTP `GET` method, `cursor` and `limit` are passed in the request **query string**. For
endpoints using `POST`, they are passed in the request **body** — **except** the record
[filter](/docs/api/resource/record) and [related-records](/docs/api/resource/record) endpoints, which are `POST`
but read `cursor` and `limit` from the **query string** (their pages show this). When in doubt, follow the example
on the endpoint's own page.
:::

## Responses

A cursor-paginated response contains the following properties:

| Property       | Type      | Description                                                                                                                                                     |
| :------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `total`        | `integer` | The number of items matching the request across all pages. Measured when the first page is requested; treat it as an approximate snapshot, not a live count.   |
| `cursor`       | `string`  | An opaque cursor pointing at the last item on this page. Pass it back as the `cursor` parameter to fetch the next page. Some endpoints return `null` at the end. |
| _`collection`_ | `array`   | The page of results. The property is named for the resource — `records`, `comments`, `automation_runs`, and so on — **not** a generic `results`.                  |

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

To walk the whole collection, repeat the request with the `cursor` from the previous response until a page comes
back with **fewer items than `limit`** — an empty or short page marks the end. Some endpoints additionally return
`cursor: null` on the final page, but not all do (several always return a cursor, even on the last page), so the
reliable signal is a page shorter than `limit`.

## Non-paginated collections

Some endpoints return their **entire** collection in one response and accept no `cursor` or `limit` — typically as
`{ "total": <n>, "<collection>": [ ... ] }`, and occasionally as just the array. These are documented as such on
their own resource pages. Do not assume a collection endpoint is pageable unless its page documents `cursor` and
`limit`.
