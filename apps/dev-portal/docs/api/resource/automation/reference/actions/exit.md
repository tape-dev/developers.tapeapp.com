---
id: exit
title: exit
sidebar_label: exit
description: Config reference for the Tape automation exit action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Exit** — ends the current automation run, marking it as a success or a failure. `group: "action"`. No specific trigger context is required.

Part of the [Flow control](/docs/api/resource/automation/reference/actions#flow-control) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `exit_type` | enum | **yes** | Whether the run exits as a success or a failure. |

**`exit_type` tokens** (lower-case): `success`, `failure`.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "exit",
  "config": {
    "exit_type": "success"
  }
}
```

## Validation & behavior

- `exit_type` is the only member and is **required** — it has no canonical default, since ending a run as a success is meaningfully different from ending it as a failure, so the caller must state which.
- `exit_type` must be one of `success` or `failure`.
- The action stops the current run at this point; subsequent actions in the definition do not execute.
- **Resulting run status:** `exit_type: "success"` ends the run with status `completed`. `exit_type: "failure"` ends it with status `failed` and `failure_reason: "exit_on_purpose"` — a deliberate stop, distinguishable in the [run object](/docs/api/resource/automation-run#the-run-object) from an action error (which reports a different `failure_reason`).

## See also

- [Actions catalog](/docs/api/resource/automation/reference/actions) — the [Flow control](/docs/api/resource/automation/reference/actions#flow-control) family
- [Action examples](/docs/api/resource/automation/action-examples) · [Discovery](/docs/api/resource/automation/discovery)
