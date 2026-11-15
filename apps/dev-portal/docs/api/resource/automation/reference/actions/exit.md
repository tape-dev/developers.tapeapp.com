---
id: exit
title: exit
sidebar_label: exit
description: Config reference for the Tape automation exit action, with its config key, allowed values and an example.
---

Use this action to end an automation run as a success or a failure.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **End run** in the [Flow control](/docs/api/resource/automation/reference/actions#flow-control) family. Its `group` is `action`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

Inside the else branch of a [`conditional`](/docs/api/resource/automation/reference/actions/conditional), this action stops the run as failed when a job application has no CV attached:

```json
{
  "type": "exit",
  "config": {
    "exit_type": "failure"
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `exit_type` | enum | **Required.** How the run ends: `success` or `failure`. | `"success"` |

## General behavior {#validation--behavior}

- `exit_type` is the only key, and it's required. It has no default, because a successful end and a failed end mean different things.
- Tape stops the run at this action. Later actions don't run.
- `success` ends the run with status `completed`.
- `failure` ends the run with status `failed` and `failure_reason: "exit_on_purpose"`. The [run object](/docs/api/resource/automation-run#the-run-object) tells this deliberate stop apart from an action error, which has a different `failure_reason`.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.

<a id="see-also"></a>

## Next steps

- [conditional](/docs/api/resource/automation/reference/actions/conditional): end the run only when a condition holds.
- [Automation run](/docs/api/resource/automation-run#the-run-object): read `status` and `failure_reason` of a run.
- [Discovery](/docs/api/resource/automation/discovery): read the live `config` shape of every action.
- [Action examples](/docs/api/resource/automation/action-examples): configs to copy for the common actions.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
