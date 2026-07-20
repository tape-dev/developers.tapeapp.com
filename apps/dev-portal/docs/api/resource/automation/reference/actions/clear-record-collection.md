---
id: clear-record-collection
title: clear_record_collection
sidebar_label: clear_record_collection
description: Config reference for the Tape automation clear_record_collection action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Clear collection** — clears a record collection produced by an earlier action. `group: "action"`. No specific trigger context is required.

Part of the [Record collections](/docs/api/resource/automation/reference/actions#record-collections) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `record_collection` | [reference](/docs/api/resource/automation/dynamic-values) | no | The record collection to clear — an action-variable reference to a prior action's collection output. Omitted when unset. |

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "clear_record_collection",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 100 }
  }
}
```

## Validation & behavior

- `record_collection` is the only member and is **optional** — omitting it yields an internal action with no collection reference (no canonical default is applied).
- As a consumer, this action needs a `record_collection` reference to a prior action's collection output; without one there is nothing to clear.
- Reference an upstream collection variable (for example a `record_collection` action's output), not a one-element field variable.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Actions catalog](/docs/api/resource/automation/reference/actions) · [Action examples](/docs/api/resource/automation/action-examples)
