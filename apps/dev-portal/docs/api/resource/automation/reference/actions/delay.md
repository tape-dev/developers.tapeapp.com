---
id: delay
title: delay
sidebar_label: delay
description: Config reference for the Tape automation delay action, with its config key, allowed values and an example.
---

Use this action to pause an automation run for a fixed time before the next action.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Delay execution** in the [Flow control](/docs/api/resource/automation/reference/actions#flow-control) family. Its `group` is `action`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action waits 30 seconds, for example to give a teammate time to finish editing a task before the next action reads it:

```json
{
  "type": "delay",
  "config": {
    "delay_ms": 30000
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `delay_ms` | enum (integer) | **Required.** How long the run pauses, in milliseconds. See [Delay values](#delay-values). | `30000` |

### Delay values

`delay_ms` takes one of these numbers:

- `15000`: 15 seconds.
- `30000`: 30 seconds.
- `45000`: 45 seconds.
- `60000`: 60 seconds.

## General behavior {#validation--behavior}

- `delay_ms` is the only key, and it's required. It has no default.
- Tape accepts only `15000`, `30000`, `45000` and `60000`. It rejects any other value.
- The run pauses for the given time, then goes on with the next action.
- For a longer wait, use the `date_field_arrived` or `periodic` [trigger](/docs/api/resource/automation/reference/triggers).
- With a trigger that has a record, Tape reloads the current record after the pause. Later actions see its latest field values.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.

<a id="see-also"></a>

## Next steps

- [exit](/docs/api/resource/automation/reference/actions/exit): end the run early.
- [conditional](/docs/api/resource/automation/reference/actions/conditional): run actions only when a condition holds.
- [Action examples](/docs/api/resource/automation/action-examples): configs to copy for the common actions.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
