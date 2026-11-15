# authenticated_http_call

> Config reference for the Tape automation authenticated_http_call action, with its config keys, defaults and an example.

Use this action to send an HTTP request through an OAuth 2.0 connection and keep the response for later actions.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Send an API request** in the [HTTP requests](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#http-requests) family. Its `group` is `action`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

When a deal is won, this action sends the deal to a sales system through a connection and saves the response:

```json
{
  "type": "authenticated_http_call",
  "config": {
    "http_call_type": "post",
    "http_call_url": ["https://crm.acme.com/api/v2/deals"],
    "http_call_headers": [
      { "key": "Content-Type", "value": ["application/json"] }
    ],
    "http_call_body": ["{\"deal\": \"", { "kind": "variable", "source": "meta", "meta_type": "app_record_id", "app_id": 87 }, "\", \"stage\": \"won\"}"],
    "http_call_follow_redirects": false,
    "authentication_provider_id": 44,
    "custom_variable_defs": [
      { "custom_type": "any", "label": "API response" }
    ]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `http_call_type` | enum | **Required.** HTTP method: `get`, `post`, `put`, `patch` or `delete`. | `"post"` |
| `http_call_url` | [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** Request URL. | `["https://crm.acme.com/api/v2/deals"]` |
| `authentication_provider_id` | integer | ID of the connection that signs the request. Optional in the schema, but without it Tape skips the action when the automation runs. | `44` |
| `http_call_body` | [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Request body. Empty when left out. | `["{\"stage\": \"won\"}"]` |
| `http_call_headers` | array of headers | Request headers. Each entry is `{ "key", "value" }`, both required, with an optional `id`. Empty when left out. | `[]` |
| `http_call_follow_redirects` | boolean | Follows `3xx` redirects. Default `false`. | `false` |
| `custom_variable_defs` | array of variable declarations | Variables this action declares. Empty when left out. | `[{ "custom_type": "any", "label": "API response" }]` |

The headers and `custom_variable_defs` work the same way as in [`http_call`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/http-call#headers).

## Connections

In the editor, the connection is the **Connection** field of the action. It's an OAuth 2.0 connection that an organization admin sets up in Tape.

-   The public API has *no endpoint to create or list connections*.
-   To find `authentication_provider_id`, select the connection in this action in the automation editor, then [retrieve the automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#retrieve-an-automation).
-   You can define the action through the API without a valid ID. Tape saves it, and validation doesn't report it. When the automation runs, Tape skips the action without a per-action log.

## Use the response in a later action

Tape stores the response body in the first variable of `custom_variable_defs`. A later action reads it with a `custom` reference that has the same `custom_type` and `label`:

```json
{ "kind": "variable", "source": "custom", "custom_type": "any", "label": "API response" }
```

Without a declared variable, Tape sends the request and keeps no response. The editor declares one variable called **API response**.

## General behavior

-   `http_call_type` and `http_call_url` are required. Neither has a default.
-   Every other key except `authentication_provider_id` has a default: an empty body, no headers, no redirects and no declared variables.
-   With an empty `http_call_url`, Tape skips the action when the automation runs.
-   Outbound requests have [SSRF protection](https://help.tapeapp.com/en/articles/18448976-automation-ip-addresses). Tape refuses hosts that resolve to private or internal addresses.
-   Each header needs `key` and `value`. Send `""` or `[]` for a blank value.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   An organization admin has set up the connection in Tape.

## Next steps

[

http\_call

send a request without a connection.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/http-call)
- [IP addresses](https://developers.tapeapp.comhttps://help.tapeapp.com/en/articles/18448976-automation-ip-addresses): where requests come from and which hosts Tape refuses.[

Dynamic values

template values and `custom` references.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Action examples

why an action can save but do nothing.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
