# exit

> Config reference for the Tape automation exit action, with its config key, allowed values and an example.

Use this action to end an automation run as a success or a failure.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **End run** in the [Flow control](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#flow-control) family. Its `group` is `action`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

Inside the else branch of a [`conditional`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/conditional), this action stops the run as failed when a job application has no CV attached:

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

## General behavior

-   `exit_type` is the only key, and it's required. It has no default, because a successful end and a failed end mean different things.
-   Tape stops the run at this action. Later actions don't run.
-   `success` ends the run with status `completed`.
-   `failure` ends the run with status `failed` and `failure_reason: "exit_on_purpose"`. The [run object](https://developers.tapeapp.com/docs/api/resource/automation-run#the-run-object) tells this deliberate stop apart from an action error, which has a different `failure_reason`.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.

## Next steps

[

conditional

end the run only when a condition holds.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/conditional)[

Automation run

read `status` and `failure_reason` of a run.

](https://developers.tapeapp.com/docs/api/resource/automation-run#the-run-object)[

Discovery

read the live `config` shape of every action.

](https://developers.tapeapp.com/docs/api/resource/automation/discovery)[

Action examples

configs to copy for the common actions.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
