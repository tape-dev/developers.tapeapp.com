---
id: collect-app-view-records
title: collect_app_view_records
sidebar_label: collect_app_view_records
description: Config reference for the Tape automation collect_app_view_records action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Collect app view records** — collects the records of an app view into a record collection. `group: "action"`. No
specific trigger context is required.

Part of the [Record collections](/docs/api/resource/automation/reference/actions#record-collections) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `app_id` | integer | no | Id of the app to collect records from. |
| `app_view_id` | integer | no | Id of the app view to collect records from. |
| `limit` | integer | no | Maximum number of records to collect. Defaults to the editor default when omitted. |
| `limit_enabled` | boolean | no | Whether `limit` is applied. `false` when omitted. |

:::note `app_id` / `app_view_id` are effectively required
Both ids are optional in the discovery schema and the typed DTO (a not-yet-configured action may have neither), but
validation reports `action_app_missing` / `action_app_view_missing` when either is absent — a usable action must supply
both. Treat `app_id` + `app_view_id` as effectively required, enforced at validate/activate rather than at write.
:::

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "collect_app_view_records",
  "config": {
    "app_id": 4201,
    "app_view_id": 9317,
    "limit": 100,
    "limit_enabled": true
  }
}
```

## Validation & behavior

- This is a producer: it needs a real `app_id` and `app_view_id` to collect anything, and validation rejects an action
  missing either.
- `app_view_id` is only checked for presence at validate time — a syntactically valid but non-existent view passes
  validation and then fails at run time.
- `limit` defaults to the editor default when omitted, and `limit_enabled` defaults to `false`, so an omitting caller
  still yields a complete action.
- Every collect is capped at **1000 records** at run time **regardless of `limit_enabled`**. A configured `limit` above
  1000 — or with `limit_enabled: false` — is stored and read back **unchanged** (there is no write-time or `validate`
  warning); the collection is truncated to 1000 only when the run executes. See
  [Limitations](/docs/automations/limitations).

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Filters](/docs/api/resource/automation/reference/filters) — filter-group shape used by other record-collection actions
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
