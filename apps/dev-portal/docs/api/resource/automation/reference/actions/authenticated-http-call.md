---
id: authenticated-http-call
title: authenticated_http_call
sidebar_label: authenticated_http_call
description: Config reference for the Tape automation authenticated_http_call action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Authenticated HTTP request** — makes an HTTP request signed by an authentication provider. `group: "action"`. No specific trigger context is required.

Part of the [HTTP requests](/docs/api/resource/automation/reference/actions#http-requests) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `http_call_type` | enum | **yes** | HTTP method. |
| `http_call_url` | [template value](/docs/api/resource/automation/dynamic-values) | **yes** | Request URL. |
| `http_call_body` | [template value](/docs/api/resource/automation/dynamic-values) | no | Request body. Empty when omitted. |
| `http_call_headers` | array of header objects | no | Request headers — each a `{ key, value }` pair whose `value` is a [template value](/docs/api/resource/automation/dynamic-values). Empty `[]` when omitted. |
| `http_call_follow_redirects` | boolean | no | Whether to follow 3xx redirects. `false` when omitted. |
| `authentication_provider_id` | integer | no | Authentication provider that signs the request. Absent when omitted → the action is skipped at run time. |
| `custom_variable_defs` | array of custom variable defs | no | Custom variables the action declares (e.g. its response variable) for its own code or later actions. Empty `[]` when omitted. |

**`http_call_type` tokens** (lower-case): `get`, `post`, `put`, `patch`, `delete`.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "authenticated_http_call",
  "config": {
    "http_call_type": "post",
    "http_call_url": ["https://api.example.com/records/", { "kind": "variable", "source": "meta", "meta_type": "app_record_id" }],
    "http_call_headers": [
      { "key": "Content-Type", "value": ["application/json"] }
    ],
    "http_call_body": ["{\"status\":\"synced\"}"],
    "http_call_follow_redirects": false,
    "authentication_provider_id": 44
  }
}
```

## Validation & behavior

- `http_call_type` and `http_call_url` are the only required members; `http_call_body` defaults to empty, `http_call_headers` and `custom_variable_defs` default to `[]`, and `http_call_follow_redirects` defaults to `false`.
- Like `http_call`, this action signs the request with the referenced `authentication_provider_id`. The id is optional in the schema, but the action is **skipped at run time** when it is absent — an authenticated call cannot be made without a provider.
- Authentication providers are **not creatable through this API**; reference one configured in the Tape UI.
- Requests are SSRF-protected.
- Each header entry requires both `key` and `value`; send `""` (or `[]`) for a deliberately blank value.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Filters](/docs/api/resource/automation/reference/filters) — the filter-group shape used by other actions
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
