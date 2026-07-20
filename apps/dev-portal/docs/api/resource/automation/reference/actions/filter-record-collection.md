---
id: filter-record-collection
title: filter_record_collection
sidebar_label: filter_record_collection
description: Config reference for the Tape automation filter_record_collection action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Filter collection** — filters a record collection produced by an earlier action down to the records matching a
condition. `group: "action"`. No specific trigger context is required.

Part of the [Record collections](/docs/api/resource/automation/reference/actions#record-collections) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `record_collection` | [reference](/docs/api/resource/automation/dynamic-values) | no | The record collection to filter — an action-variable reference to a prior action's collection output. Omitted when unset. |
| `match_condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | no | The filter to apply to the collection. Empty condition ("match all") when omitted or `null`. |

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "filter_record_collection",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "variable": "found_records" },
    "match_condition": {
      "operator": "and",
      "conditions": [
        { "field": "status", "comparison": "is", "value": ["open"] }
      ]
    }
  }
}
```

## Validation & behavior

- Both members are optional in the typed config; the DTO leaves `record_collection` optional and `match_condition` required internally but public-optional.
- This action is a **consumer**: `record_collection` should reference an upstream producer's collection output. When omitted it is carried through as unset — pair it with a producing action to have something to filter.
- `match_condition` defaults to the empty condition ("match all") when omitted or `null` — the mapper fills `emptyCondition()`, and it reads back as `null`.
- Operators available per field type are advertised by [`GET /v1/automation/meta/filter`](/docs/api/resource/automation/discovery); see [Filters](/docs/api/resource/automation/reference/filters) for the group shape.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Filters](/docs/api/resource/automation/reference/filters) — the filter-group shape used by `match_condition`
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
