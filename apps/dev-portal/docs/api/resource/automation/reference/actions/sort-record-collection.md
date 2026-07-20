---
id: sort-record-collection
title: sort_record_collection
sidebar_label: sort_record_collection
description: Config reference for the Tape automation sort_record_collection action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Sort collection** — sorts the records in a record collection by one or more variables. `group: "action"`. No specific trigger context is required.

Part of the [Record collections](/docs/api/resource/automation/reference/actions#record-collections) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `record_collection` | [reference](/docs/api/resource/automation/dynamic-values) | no | The record collection to sort — an action-variable reference to a prior action's collection output. Omitted when unset. |
| `sorts` | array of sort entries | no | Ordered list of sort entries applied to the collection. Empty when omitted. |

Each entry in `sorts` is an object:

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | no | Stable entry id; server-minted when omitted, and round-trips on read. |
| `variable_def` | [reference](/docs/api/resource/automation/dynamic-values) | **yes** | The variable to sort by — a reference to one of the record collection's app fields (or a meta field). |
| `direction` | enum | **yes** | Sort direction. |

**`direction` tokens** (lower-case): `asc`, `desc`.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "sort_record_collection",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "variable_def_id": 4021 },
    "sorts": [
      {
        "variable_def": { "kind": "variable", "source": "action", "variable_def_id": 4055 },
        "direction": "asc"
      }
    ]
  }
}
```

## Validation & behavior

- Both members are optional: an omitted `record_collection` is dropped, and an omitted `sorts` defaults to the empty list `[]`.
- Within each `sorts` entry, `variable_def` and `direction` are required; `id` is server-minted when omitted and round-trips on a GET→PUT.
- This is a **consumer** action — its sort keys must reference a variable scoped to the collection being sorted (a record-collection app field or meta field).
- Sort entries are applied in the order given, so later entries act as tie-breakers for earlier ones.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Actions catalog](/docs/api/resource/automation/reference/actions) · [Record collections family](/docs/api/resource/automation/reference/actions#record-collections)
- [Action examples](/docs/api/resource/automation/action-examples)
