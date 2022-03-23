---
id: pagination
title: Pagination
sidebar_label: Pagination
---

Endpoints which return a list of objects use pagination. Pagination allows an integration to request a part of the list, receiving an array of results and a `cursor` in the response. The integration can use the `cursor` in another request to receive the next part of the list. Using this technique, the integration can continue to make requests to receive the whole list (or just the parts the integration needs).

## Requests

Each paginated endpoint accepts the following request parameters:

| Parameter   | Type                | Description                                                                                                                                                                                                    |
| :---------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cursor`    | `string` (optional) | A `cursor` returned from a previous response, used to request the next page of results. Treat this as an opaque value. Default: `undefined`, which indicates to return results from the beginning of the list. |
| `page_size` | `number` (optional) | The number of items from the full list desired in the response. Default: `50` Maximum: `500` The response may contain fewer than this number of results.                                                       |

:::info Parameter location varies by endpoint
For endpoints using the HTTP `GET` method, these parameters are accepted in the request query string. For endpoints using the HTTP `POST` method, these parameters are accepted in the request body.
:::

## Responses

Responses from paginated endpoints contain the following properties:

| Property   | Type                                | Description                                                                                                                                              |
| :--------- | :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `has_more` | `boolean`                           | When the response includes the end of the list, `false`. Otherwise, `true`.                                                                              |
| `cursor`   | `string`                            | Only available when `has_more` is `true`. Used to retrieve the next page of results by passing the value as the `cursor` parameter to the same endpoint. |
| `results`  | array of endpoint-dependent objects | The page, or partial list, or results.                                                                                                                   |
