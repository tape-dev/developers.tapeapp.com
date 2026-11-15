---
id: current-record-generate-automation-weblink
title: current_record_generate_automation_weblink
sidebar_label: current_record_generate_automation_weblink
description: Config reference for the Tape automation current_record_generate_automation_weblink action, with its config keys, defaults and an example.
---

Use this action to create a weblink that runs another automation on the current record when someone opens it.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Create a web link for the current record** in the [Automation calls & weblinks](/docs/api/resource/automation/reference/actions#automation-calls--weblinks) family. Its `group` is `action`, and it needs a trigger with a record: `record_created`, `record_updated`, `record_deleted`, `record_comment_or_reply_created`, `date_field_arrived`, `automation_called` or `weblink_clicked`. The current record is the record that this automation runs on.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

When a new hire is added, this action creates a weblink that lets them confirm their start date. The link runs the confirmation automation and expires after a week:

```json
{
  "type": "current_record_generate_automation_weblink",
  "config": {
    "automation_id": 4023,
    "call_arguments": [
      {
        "variable_def": { "custom_type": "any", "label": "Confirmed via" },
        "assignment_type": "set",
        "value": ["Onboarding email"]
      }
    ],
    "custom_variable_def": { "custom_type": "single_link", "label": "Weblink" },
    "weblink_expiration": "one_week"
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `automation_id` | integer | **Required.** ID of the automation that the weblink runs. The schema lets you save without it, but validation then reports `action_automation_missing`. | `4023` |
| `call_arguments` | array of call arguments | Values for the inputs that the target automation declares. Empty when left out. | `[]` |
| `custom_variable_def` | object | The variable that holds the generated weblink, as `{ "custom_type", "label" }`. Both keys are required in the object. Default `{ "custom_type": "single_link", "label": "Weblink" }`. | `{ "custom_type": "single_link", "label": "Weblink" }` |
| `weblink_expiration` | enum | When the weblink stops working. Default `never`. See [Expiration values](#expiration-values). | `"one_week"` |

To find `automation_id`, see [List automations](/docs/api/resource/automation/manage#list-automations). It returns the ID of each automation as `id`.

Each `call_arguments` entry has the same shape as in [`current_record_call_automation`](/docs/api/resource/automation/reference/actions/current-record-call-automation#call-arguments):

- `variable_def` (*required*): the input to fill, as `{ "custom_type", "label" }`.
- `assignment_type`: `set` uses `value` (a template value), `set_code` uses `code` (a code value). Default `set`.
- `id`: stable ID of the entry. Tape creates one when you leave it out and returns it on read.

`custom_variable_def.custom_type` takes one of `any`, `single_file`, `multi_file`, `single_link`, `html_table_rows`. The weblink is a link, so use `single_link`.

### Expiration values

`weblink_expiration` takes one of these lower-case tokens. The editor name is in brackets.

- `never` (**Never**): the weblink keeps working.
- `on_click` (**On click**): the weblink stops working after the first click.
- `one_day` (**In a day**): the weblink stops working after one day.
- `one_week` (**In a week**): the weblink stops working after one week.
- `one_month` (**In a month**): the weblink stops working after one month.
- `one_year` (**In a year**): the weblink stops working after one year.

:::note Copying from the generate-weblink endpoint?
[`POST /v1/automation/weblink/generate`](/docs/api/resource/automation/advanced#generate-a-weblink) is a different surface. Its parameter is `expiration_type`, its tokens are upper-case (`NEVER`, `ONE_DAY`, `ONE_WEEK`, `ONE_MONTH`, `ONE_YEAR`), and it has no `on_click` (the endpoint uses `expire_after_first_click` for that). In this action's `config`, use `weblink_expiration` with lower-case tokens.
:::

## Use the weblink in a later action

The action stores the weblink in the variable from `custom_variable_def`. A later action reads it with a `custom` reference that has the same `custom_type` and `label`. This `send_email` entry puts the link into the email body:

```json
{
  "type": "send_email",
  "config": {
    "to_address": ["juliet@acme.com"],
    "subject": ["Please confirm your start date"],
    "message_body": [
      "<p>Welcome to Acme. Confirm your start date here: ",
      { "kind": "variable", "source": "custom", "custom_type": "single_link", "label": "Weblink" },
      "</p>"
    ]
  }
}
```

## General behavior {#validation--behavior}

- No key is required by the schema. Left out, `call_arguments` is empty, `custom_variable_def` is the `Weblink` variable and `weblink_expiration` is `never`.
- The target automation must exist. Otherwise validation reports `action_automation_missing`.
- The target must live in the same database app as this automation's trigger and use the `weblink_clicked` trigger. Otherwise validation reports `action_automation_invalid`.
- Each `call_arguments` label must match a custom variable of the target's trigger, with `custom_variable_defs_enabled` set to `true`. Otherwise validation reports `action_call_argument_invalid`.
- Without a trigger that has a record, validation reports the [broken reason](/docs/api/resource/automation/reference/errors#broken-reason-codes) `action_invalid`. `periodic` and `webhook_received` have no record.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.
- The automation needs a trigger with a record.
- The target automation uses the `weblink_clicked` trigger and lives in the same database app.

<a id="see-also"></a>

## Next steps

- [display_webpage](/docs/api/resource/automation/reference/actions/display-webpage): show a page to the person who opens the weblink.
- [redirect_user](/docs/api/resource/automation/reference/actions/redirect-user): send that person to another URL.
- [Triggers](/docs/api/resource/automation/reference/triggers): set up `weblink_clicked` and its custom variables on the target.
- [Advanced / sandbox](/docs/api/resource/automation/advanced#generate-a-weblink): generate a weblink through the endpoint.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): `custom` references and template values.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
