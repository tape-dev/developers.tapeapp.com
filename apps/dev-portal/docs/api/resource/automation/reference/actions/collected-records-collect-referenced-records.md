---
id: collected-records-collect-referenced-records
title: collected_records_collect_referenced_records
sidebar_label: collected_records_collect_referenced_records
description: Config reference for the Tape automation collected_records_collect_referenced_records action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Collect referenced records (from collection)** — collects referenced records starting from the records in a prior action's collection, following the given reference-collection definitions. `group: "action"`. No specific trigger context is required.

Part of the [Record collections](/docs/api/resource/automation/reference/actions#record-collections) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `record_collection` | [reference](/docs/api/resource/automation/dynamic-values) | no | Action-variable reference to a prior action's collection output — the records to collect referenced records from. Omitted when unset. |
| `ref_collection_defs` | array of reference-collection definitions | no | The reference-collection definitions describing which relations to traverse. Empty when omitted. |

Each `ref_collection_defs` entry follows relations from the source records: `direction` (enum, required) and
`match_type` (enum, required) are the discriminators; optional `app_id` (integer) targets an app, `via_field_ids`
(array of integers) scopes to specific relation fields, `match_condition` ([filter group](/docs/api/resource/automation/reference/filters) `| null`)
narrows `filtered` matches, and `id` (string) is server-minted when omitted.

**`direction` tokens** (lower-case): `outgoing`, `incoming`, `both`. **`match_type` tokens** (lower-case): `all`,
`filtered` — `all` reaches every related record; `filtered` keeps only those passing the entry's `match_condition`.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "collected_records_collect_referenced_records",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 87 },
    "ref_collection_defs": [
      {
        "app_id": 91,
        "direction": "outgoing",
        "match_type": "all",
        "via_field_ids": [55012]
      }
    ]
  }
}
```

## Validation & behavior

- Both members are optional at input; an omitting caller still yields a complete internal action, with `ref_collection_defs` defaulting to `[]`.
- This action is both a consumer and a producer: it reads the upstream `record_collection` reference as its starting set, then publishes the collected referenced records as a record collection. It emits no per-action success log.
- `record_collection` has no canonical default — it is carried through when present and dropped when unset; with no source set, the action starts from an empty set.
- Within each `ref_collection_defs` entry, `direction` and `match_type` are required; `match_condition` only applies to `filtered` entries and defaults to the empty "match all" condition.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Filters](/docs/api/resource/automation/reference/filters) — the filter-group shape used by each entry's `match_condition`
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
