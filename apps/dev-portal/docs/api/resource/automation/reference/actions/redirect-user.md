---
id: redirect-user
title: redirect_user
sidebar_label: redirect_user
description: Config reference for the Tape automation redirect_user action, with its config key and an example.
---

Use this action to send the person who opened a weblink to another URL.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Redirect users to another web page** in the [Automation calls & weblinks](/docs/api/resource/automation/reference/actions#automation-calls--weblinks) family. Its `group` is `action`, and the editor offers it only with the `weblink_clicked` trigger.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

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
| `redirect_url` | [template value](/docs/api/resource/automation/dynamic-values) | **Required.** The URL to send the person to. | `["https://acme.com/approvals/done"]` |

## General behavior {#validation--behavior}

- `redirect_url` is the only key, and it's required. It has no default.
- `redirect_url` is a template value. References in it resolve when the automation runs.
- The redirect happens when the person opens the weblink and the automation reaches this action.
- Validation doesn't check the trigger for this action. A wrong trigger doesn't show up as a broken reason, so pick `weblink_clicked` yourself.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.
- The automation needs the `weblink_clicked` trigger.

<a id="see-also"></a>

## Next steps

- [current_record_generate_automation_weblink](/docs/api/resource/automation/reference/actions/current-record-generate-automation-weblink): create the weblink that starts this automation.
- [display_webpage](/docs/api/resource/automation/reference/actions/display-webpage): show a page instead of a redirect.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): put record data into `redirect_url`.
- [Triggers](/docs/api/resource/automation/reference/triggers): set up `weblink_clicked`.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
