---
id: collect-app-records
title: collect_app_records
sidebar_label: collect_app_records
description: Config reference for the Tape automation collect_app_records action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Collect app records** — collects records from an app into a record collection. `group: "action"`. No specific trigger context is required.

Part of the [Record collections](/docs/api/resource/automation/reference/actions#record-collections) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `app_id` | integer | no | Id of the app whose records are collected. Carried through only when set. |
| `match_condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | no | Records filter. Empty "match all" condition when omitted; `null` composes back from an empty condition. |
| `limit` | integer | no | Maximum number of records to collect. Default `1`. |
| `limit_enabled` | boolean | no | Whether `limit` is applied. Default `false`. |

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "collect_app_records",
  "config": {
    "app_id": 4821,
    "match_condition": {
      "operator": "and",
      "rows": [
        {
          "subject": {
            "kind": "variable",
            "source": "field",
            "field_id": 55012,
            "field_type": "single_text",
            "previous": false,
            "collection": false,
            "triggering": false
          },
          "operator": "is_not_empty"
        }
      ]
    },
    "limit": 100,
    "limit_enabled": true
  }
}
```

## Validation & behavior

- Every member is optional; an omitting caller still yields a complete internal action via the mapper's defaults.
- `match_condition` defaults to the empty "match all" condition, so with no filter the whole app is collected.
- `limit` defaults to `1` and only takes effect when `limit_enabled` is `true`; with `limit_enabled: false` the configured `limit` is ignored.
- This action is a producer: it publishes a `record_collection`. Every collect is capped at **1000 records** at run time **regardless of `limit_enabled`**. A configured `limit` above 1000 is stored and read back **unchanged** (there is no write-time or `validate` warning), then truncated to 1000 when the run executes. See [Limitations](/docs/automations/limitations).

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Filters](/docs/api/resource/automation/reference/filters) — the filter-group shape used by `match_condition`
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
