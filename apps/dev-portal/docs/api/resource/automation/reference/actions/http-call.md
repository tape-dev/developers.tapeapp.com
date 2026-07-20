---
id: http-call
title: http_call
sidebar_label: http_call
description: Config reference for the Tape automation http_call action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**HTTP request** — makes an outbound HTTP request. `group: "action"`. No specific trigger context is required.

Part of the [HTTP requests](/docs/api/resource/automation/reference/actions#http-requests) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `http_call_type` | enum | **yes** | HTTP method. |
| `http_call_url` | [template value](/docs/api/resource/automation/dynamic-values) | **yes** | Request URL. |
| `http_call_body` | [template value](/docs/api/resource/automation/dynamic-values) | no | Request body. Empty when omitted. |
| `http_call_headers` | array of objects | no | Request headers. Each entry is `{ key, value }` (plus a server-minted `id` that round-trips). `value` is a [template value](/docs/api/resource/automation/dynamic-values). Empty when omitted. |
| `http_call_follow_redirects` | boolean | no | Whether to follow 3xx redirects. Default `false`. |
| `custom_variable_defs` | array of [variable declarations](/docs/api/resource/automation/dynamic-values) | no | Custom variables this action declares (e.g. the response variable) for its own code or later actions. Empty when omitted. |

**`http_call_type` tokens** (lower-case): `get`, `post`, `put`, `patch`, `delete`.

**`custom_variable_defs[].custom_type` tokens** (lower-case): `any`, `single_file`, `multi_file`, `single_link`,
`html_table_rows`. Each declaration also carries a `label`; a `custom` variable reference resolves only when its
`custom_type` + `label` match a declaration.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "http_call",
  "config": {
    "http_call_type": "post",
    "http_call_url": ["https://api.example.com/records/", { "kind": "variable", "source": "meta", "meta_type": "app_record_id" }],
    "http_call_headers": [
      { "key": "Content-Type", "value": ["application/json"] }
    ],
    "http_call_body": ["{\"status\":\"created\"}"],
    "http_call_follow_redirects": false
  }
}
```

## Validation & behavior

- `http_call_type` and `http_call_url` are the only required members — neither has a canonical default. Everything else fills a default (`http_call_body` → empty, `http_call_headers` → `[]`, `http_call_follow_redirects` → `false`, `custom_variable_defs` → `[]`), so an omitting caller still yields a complete internal action.
- Each `http_call_headers` entry requires both `key` and `value`; a header without a value is meaningless — send `""` (or `[]`) for a deliberately blank value. `http_call_url`, `http_call_body`, and each header `value` are template values that resolve against the record / run at execution time.
- The request is SSRF-protected: private and internal hosts are refused.
- With `http_call_follow_redirects` `false` (the default), 3xx responses are not followed.
- A `custom` variable reference (from this action or a later action) resolves only when its `custom_type` + `label` match a declaration in `custom_variable_defs`.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values, references, and custom-variable declarations
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
