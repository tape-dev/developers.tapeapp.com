---
id: send-email
title: send_email
sidebar_label: send_email
description: Config reference for the Tape automation send_email action, with its config keys, defaults and an example.
---

Use this action to send an email from an automation.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Send an email** in the [Email & documents](/docs/api/resource/automation/reference/actions#email--documents) family. Its `group` is `action`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action tells juliet@acme.com about a new lead and puts the record ID in the subject:

```json
{
  "type": "send_email",
  "config": {
    "to_address": ["juliet@acme.com"],
    "subject": ["New record: ", { "kind": "variable", "source": "meta", "meta_type": "app_record_id", "app_id": 87 }],
    "message_body": ["<p>A new lead came in.</p>"],
    "smtp_account_id": 812
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `to_address` | [template value](/docs/api/resource/automation/dynamic-values) | **Required.** Recipient address or addresses. | `["juliet@acme.com"]` |
| `subject` | [template value](/docs/api/resource/automation/dynamic-values) | **Required.** Subject line. | `["New lead"]` |
| `reply_address` | [template value](/docs/api/resource/automation/dynamic-values) | Reply-to address. Empty when left out. | `["sales@acme.com"]` |
| `cc_address` | [template value](/docs/api/resource/automation/dynamic-values) | CC address or addresses. Empty when left out. | `["romeo@acme.com"]` |
| `bcc_address` | [template value](/docs/api/resource/automation/dynamic-values) | BCC address or addresses. Empty when left out. | `["archive@acme.com"]` |
| `from_address` | [template value](/docs/api/resource/automation/dynamic-values) | Sender address. Empty when left out. | `["sales@acme.com"]` |
| `from_name` | [template value](/docs/api/resource/automation/dynamic-values) | Sender display name. Empty when left out. | `["Acme Sales"]` |
| `message_body` | [template value](/docs/api/resource/automation/dynamic-values) | HTML body. Empty when left out. | `["<p>Hello</p>"]` |
| `smtp_account_id` | integer | ID of the SMTP account to send from. Left out, Tape uses the organization's *default* SMTP account. See [Sender address](/docs/api/resource/email#sender-address). Same ID as `smtp_settings_id` of the [email endpoint](/docs/api/resource/email#sending-an-email). | `812` |
| `attach_files_variable_defs` | array of [references](/docs/api/resource/automation/dynamic-values) | File variables Tape can attach: attachment or image fields, file custom variables such as the PDF from [`create_pdf`](/docs/api/resource/automation/reference/actions/create-pdf), or the files of the trigger. Empty when left out. | `[]` |
| `attach_files_match_type` | enum | Which of those files Tape attaches. Default `all`. See [Attachment modes](#attachment-modes). | `"all"` |
| `attach_files_match_condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | Limits the attached files in the `filtered` and `most_recent_filtered` modes. An empty AND group when left out. | `null` |

To find `smtp_account_id`, select the account in this action in the automation editor, then [retrieve the automation](/docs/api/resource/automation/manage#retrieve-an-automation). The API has no endpoint that lists SMTP accounts. Without the automation API, see [Sender address](/docs/api/resource/email#sender-address) for a way through the editor.

### Attachment modes

`attach_files_match_type` takes one of these lower-case tokens:

- `all`: attaches every candidate file. Ignores the condition.
- `most_recent`: attaches the most recent file. Ignores the condition.
- `filtered`: attaches the files that match `attach_files_match_condition`.
- `most_recent_filtered`: attaches the most recent file that matches `attach_files_match_condition`.

## General behavior {#validation--behavior}

- `to_address` and `subject` are the only required keys. Every other address, name and body defaults to empty.
- Without `message_body`, Tape sends the email with an empty body.
- Every email an automation sends counts against the organization's shared 24-hour send quota.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.

<a id="see-also"></a>

## Next steps

- [collected_records_send_email](/docs/api/resource/automation/reference/actions/collected-records-send-email): send one email per record in a collection.
- [create_pdf](/docs/api/resource/automation/reference/actions/create-pdf): create a PDF to attach.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): build template values and references.
- [Filters](/docs/api/resource/automation/reference/filters): the filter group used by `attach_files_match_condition`.
- [Action examples](/docs/api/resource/automation/action-examples): configs to copy for the common actions.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
