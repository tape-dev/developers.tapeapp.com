# redirect_user

> Config reference for the Tape automation redirect_user action, with its config key and an example.

Use this action to send the person who opened a weblink to another URL.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Redirect users to another web page** in the [Automation calls & weblinks](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#automation-calls--weblinks) family. Its `group` is `action`, and the editor offers it only with the `weblink_clicked` trigger.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

A manager opens the weblink to approve a task. This action sends the manager to a confirmation page with the task number:

```json
{
  "type": "redirect_user",
  "config": {
    "redirect_url": ["https://acme.com/approvals/done?task=", { "kind": "variable", "source": "meta", "meta_type": "app_record_id", "app_id": 87 }]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `redirect_url` | [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** The URL to send the person to. | `["https://acme.com/approvals/done"]` |

## General behavior

-   `redirect_url` is the only key, and it's required. It has no default.
-   `redirect_url` is a template value. References in it resolve when the automation runs.
-   The redirect happens when the person opens the weblink and the automation reaches this action.
-   Validation doesn't check the trigger for this action. A wrong trigger doesn't show up as a broken reason, so pick `weblink_clicked` yourself.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   The automation needs the `weblink_clicked` trigger.

## Next steps

[

current\_record\_generate\_automation\_weblink

create the weblink that starts this automation.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-generate-automation-weblink)[

display\_webpage

show a page instead of a redirect.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/display-webpage)[

Dynamic values

put record data into `redirect_url`.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Triggers

set up `weblink_clicked`.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
