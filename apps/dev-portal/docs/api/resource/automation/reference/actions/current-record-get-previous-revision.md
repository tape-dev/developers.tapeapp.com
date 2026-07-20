---
id: current-record-get-previous-revision
title: current_record_get_previous_revision
sidebar_label: current_record_get_previous_revision
description: Config reference for the Tape automation current_record_get_previous_revision action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Get previous revision** — resolves the previous revision of the run's current record. `group: "action"`. Requires any record-context trigger.

Part of the [Current record](/docs/api/resource/automation/reference/actions#current-record) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

This action carries no config-specific members of its own — its behaviour is fully determined by the action type, so
its `config` is an empty object.

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| _(none)_ | — | — | This action takes no config members. |

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "current_record_get_previous_revision",
  "config": {}
}
```

## Validation & behavior

- The `config` is an empty object — pass `"config": {}` (the served schema advertises zero properties and rejects any additional key).
- Behaviour is fixed by the action type: it resolves the previous revision of the run's current record.
- Requires a record-context trigger so that a current record exists to resolve a previous revision from.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
