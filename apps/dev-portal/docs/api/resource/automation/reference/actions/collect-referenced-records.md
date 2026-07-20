---
id: collect-referenced-records
title: collect_referenced_records
sidebar_label: collect_referenced_records
description: Config reference for the Tape automation collect_referenced_records action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Collect referenced records** — collects records reached from the triggering records by following relations. `group: "action"`. No specific trigger context is required.

Part of the [Record collections](/docs/api/resource/automation/reference/actions#record-collections) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `ref_collection_defs` | array of reference-collection definitions (see below) | no | The reference-collection definitions followed to collect referenced records. Empty when omitted. |

Each entry in `ref_collection_defs` is one way records are reached — a relation `direction`, optionally scoped to
`via_field_ids` and a target `app_id`, then optionally narrowed by a per-entry `match_condition`:

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `direction` | enum | **yes** | Which relation direction to follow when collecting referenced records. |
| `match_type` | enum | **yes** | Whether all reachable records match (`all`) or only those passing `match_condition` (`filtered`). |
| `id` | string | no | Stable entry id; server-minted when omitted. |
| `app_id` | integer | no | The app whose records are reached by this reference collection. Carried through only when set; each `app_id` must be related to the source. |
| `match_condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | no | Per-entry records filter. The empty "match all" condition when omitted; `null` composes back from an empty condition. |
| `via_field_ids` | array of integers | no | The relation fields to follow. Carried through only when set. |

**`direction` tokens** (lower-case): `outgoing`, `incoming`, `both`.

**`match_type` tokens** (lower-case): `all`, `filtered`. `all` collects every reachable record; `filtered` restricts to
records passing the entry's `match_condition`.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "collect_referenced_records",
  "config": {
    "ref_collection_defs": [
      {
        "direction": "outgoing",
        "match_type": "filtered",
        "app_id": 1204,
        "via_field_ids": [88123],
        "match_condition": null
      }
    ]
  }
}
```

## Validation & behavior

- `ref_collection_defs` is optional at input; an omitted list defaults to `[]`, so the action collects nothing.
- Within each entry, `direction` and `match_type` are the required discriminators and have no canonical default; both use lower-case tokens.
- `app_id` and `via_field_ids` are carried through only when present, and each `app_id` must be related to the source records the definition traverses from.
- This action is a producer: it fills a record collection that downstream actions can consume; `match_condition` narrows an entry only when `match_type` is `filtered`.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Filters](/docs/api/resource/automation/reference/filters) — the filter-group shape used by `match_condition`
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
