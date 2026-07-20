---
id: delay
title: delay
sidebar_label: delay
description: Config reference for the Tape automation delay action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Delay** — pauses the run for a fixed amount of time before continuing. `group: "action"`. No specific trigger context is required.

Part of the [Flow control](/docs/api/resource/automation/reference/actions#flow-control) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `delay_ms` | enum | **yes** | How long the run pauses before continuing, in milliseconds. |

**`delay_ms` tokens** (numeric): `15000`, `30000`, `45000`, `60000`. The public number maps 1:1 onto the internal
delay-amount enum; only these four values are accepted.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "delay",
  "config": {
    "delay_ms": 30000
  }
}
```

## Validation & behavior

- `delay_ms` is the only member and is **required** — it has no canonical default, so an omitting caller has no meaningful fallback.
- Only the four enum values `15000`, `30000`, `45000`, and `60000` are accepted; any other value is rejected.
- The run pauses for the given number of milliseconds, then continues with the next action.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
