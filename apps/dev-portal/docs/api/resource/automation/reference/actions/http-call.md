---
id: http-call
title: http_call
sidebar_label: http_call
description: Config reference for the Tape automation http_call action, with its config keys, defaults and an example.
---

Use this action to send an HTTP request from an automation and keep the response for later actions.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Send a HTTP request** in the [HTTP requests](/docs/api/resource/automation/reference/actions#http-requests) family. Its `group` is `action`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

When an invoice in database app `87` is approved, this action posts the invoice number to the accounting system and saves the response:

```json
{
  "type": "http_call",
  "config": {
    "http_call_type": "post",
    "http_call_url": ["https://accounting.acme.com/api/invoices"],
    "http_call_headers": [
      { "key": "Content-Type", "value": ["application/json"] }
    ],
    "http_call_body": ["{\"invoice\": \"", { "kind": "variable", "source": "meta", "meta_type": "app_record_id", "app_id": 87 }, "\", \"status\": \"approved\"}"],
    "http_call_follow_redirects": false,
    "custom_variable_defs": [
      { "custom_type": "any", "label": "HTTP response" }
    ]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `http_call_type` | enum | **Required.** HTTP method: `get`, `post`, `put`, `patch` or `delete`. | `"post"` |
| `http_call_url` | [template value](/docs/api/resource/automation/dynamic-values) | **Required.** Request URL. | `["https://accounting.acme.com/api/invoices"]` |
| `http_call_body` | [template value](/docs/api/resource/automation/dynamic-values) | Request body. Empty when left out. | `["{\"status\": \"approved\"}"]` |
| `http_call_headers` | array of [headers](#headers) | Request headers. Empty when left out. | `[]` |
| `http_call_follow_redirects` | boolean | Follows `3xx` redirects. Default `false`. | `false` |
| `custom_variable_defs` | array of variable declarations | Variables this action declares. Empty when left out. | `[{ "custom_type": "any", "label": "HTTP response" }]` |

`custom_variable_defs[].custom_type` takes one of `any`, `single_file`, `multi_file`, `single_link`, `html_table_rows`. Each declaration also needs a `label`.

### Headers

Each entry in `http_call_headers` is one request header:

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `key` | string | **Required.** Header name. | `"Content-Type"` |
| `value` | [template value](/docs/api/resource/automation/dynamic-values) | **Required.** Header value. Send `""` or `[]` for a blank value. | `["application/json"]` |
| `id` | string | Stable ID of the entry. Tape creates one when you leave it out and returns it on read. | `"h1"` |

## Use the response in a later action

Tape stores the response body in the first variable of `custom_variable_defs`. A later action reads it with a `custom` reference that has the same `custom_type` and `label`:

```json
{ "kind": "variable", "source": "custom", "custom_type": "any", "label": "HTTP response" }
```

Without a declared variable, Tape sends the request and keeps no response. The editor declares one variable called **HTTP response**.

A response with `Content-Type: application/json` arrives as parsed JSON. Any other response arrives as a string.

- To loop over a JSON array in the response, pass the reference as `iterable` of a [`for_loop`](/docs/api/resource/automation/reference/actions/for-loop). When the array sits inside an object, first pick it out with a [`custom_variable`](/docs/api/resource/automation/reference/actions/custom-variable), for example `[<reference>, ".items"]`, and loop over that variable.
- To branch on the response, give a [`conditional`](/docs/api/resource/automation/reference/actions/conditional) a [filter](/docs/api/resource/automation/reference/filters) row with `code`, for example `{ "code": [<reference>, " != null"] }`. A `custom` reference as `subject` returns `400`.

## General behavior {#validation--behavior}

- `http_call_type` and `http_call_url` are required. Neither has a default.
- Every other key has a default: an empty body, no headers, no redirects and no declared variables.
- `http_call_url`, `http_call_body` and each header `value` are template values. References in them resolve when the automation runs.
- With an empty `http_call_url`, Tape skips the action when the automation runs.
- Outbound requests have [SSRF protection](https://help.tapeapp.com/en/articles/18448976-automation-ip-addresses). Tape refuses hosts that resolve to private or internal addresses.
- With `http_call_follow_redirects` set to `false`, Tape doesn't follow `3xx` responses.
- Tape keeps only the response body, not the status code. A `4xx` or `5xx` response doesn't fail the action. A network error does.
- Tape sends `http_call_body` as text and adds no `Content-Type`. Set the header yourself, as in the example.
- A `custom` reference resolves only when its `custom_type` and `label` match a declaration in `custom_variable_defs`.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.
- The target server accepts requests from Tape's IP addresses.

<a id="see-also"></a>

## Next steps

- [authenticated_http_call](/docs/api/resource/automation/reference/actions/authenticated-http-call): send a request through an OAuth 2.0 connection.
- [IP addresses](https://help.tapeapp.com/en/articles/18448976-automation-ip-addresses): where requests come from and which hosts Tape refuses.
- [for_loop](/docs/api/resource/automation/reference/actions/for-loop): loop over a list in the response.
- [custom_variable](/docs/api/resource/automation/reference/actions/custom-variable): pick one value out of the response.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): template values and `custom` references.
- [Action examples](/docs/api/resource/automation/action-examples): the smallest `http_call` config to copy.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
