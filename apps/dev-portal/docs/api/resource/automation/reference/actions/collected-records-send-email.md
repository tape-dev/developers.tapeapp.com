---
id: collected-records-send-email
title: collected_records_send_email
sidebar_label: collected_records_send_email
description: Config reference for the Tape automation collected_records_send_email action, with its config keys, defaults and an example.
---

Use this action to send one email for each record in a collection that an earlier action built.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Send an email to all collected records** in the [Email & documents](/docs/api/resource/automation/reference/actions#email--documents) family. Its `group` is `action`, and it works with every trigger but needs an earlier action that creates the record collection.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action reminds the buyer of every collected viewing, using the email field of each record:

```json
{
  "type": "collected_records_send_email",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 640 },
    "to_address": [{ "kind": "variable", "source": "field", "field_id": 6120, "field_type": "multi_email", "previous": false, "collection": true, "triggering": false }],
    "subject": ["Your viewing tomorrow"],
    "message_body": ["<p>See you at the property tomorrow. Reply to this email to reschedule.</p>"],
    "reply_address": ["juliet@acme.com"],
    "smtp_account_id": 812
  }
}
```

## Config

The config matches [`send_email`](/docs/api/resource/automation/reference/actions/send-email), plus `record_collection` and `fields_expanded`.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `record_collection` | [reference](/docs/api/resource/automation/dynamic-values) | **Required.** The collection whose records get one email each, created by an earlier action. The schema lets you save without it, but validation then reports `action_invalid`. | `{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 640 }` |
| `to_address` | [template value](/docs/api/resource/automation/dynamic-values) | Recipient address or addresses. Empty when left out. Without it, Tape skips the action when the automation runs. | `["romeo@acme.com"]` |
| `subject` | [template value](/docs/api/resource/automation/dynamic-values) | Subject line. Empty when left out. | `["Your viewing tomorrow"]` |
| `reply_address` | [template value](/docs/api/resource/automation/dynamic-values) | Reply-to address. Empty when left out. | `["juliet@acme.com"]` |
| `cc_address` | [template value](/docs/api/resource/automation/dynamic-values) | CC address or addresses. Empty when left out. | `["romeo@acme.com"]` |
| `bcc_address` | [template value](/docs/api/resource/automation/dynamic-values) | BCC address or addresses. Empty when left out. | `["archive@acme.com"]` |
| `from_address` | [template value](/docs/api/resource/automation/dynamic-values) | Sender address. Empty when left out. | `["sales@acme.com"]` |
| `from_name` | [template value](/docs/api/resource/automation/dynamic-values) | Sender display name. Empty when left out. | `["Acme Realty"]` |
| `message_body` | [template value](/docs/api/resource/automation/dynamic-values) | HTML body. Empty when left out. | `["<p>Hello</p>"]` |
| `smtp_account_id` | integer | ID of the SMTP account to send from. Left out, Tape uses the organization's *default* SMTP account. See [Sender address](/docs/api/resource/email#sender-address). Same ID as `smtp_settings_id` of the [email endpoint](/docs/api/resource/email#sending-an-email). | `812` |
| `attach_files_variable_defs` | array of [references](/docs/api/resource/automation/dynamic-values) | File variables Tape can attach: attachment or image fields, file custom variables such as the PDF from [`create_pdf`](/docs/api/resource/automation/reference/actions/create-pdf), or the files of the trigger. Empty when left out. | `[]` |
| `attach_files_match_type` | enum | Which of those files Tape attaches. Default `all`. See [Attachment modes](#attachment-modes). | `"all"` |
| `attach_files_match_condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | Limits the attached files in the `filtered` and `most_recent_filtered` modes. An empty AND group when left out or `null`. | `null` |
| `fields_expanded` | boolean | Editor only: whether the address fields show expanded in the automation editor. Tape keeps it on read and write. Left out when not set. | `false` |

To find `smtp_account_id`, select the account in this action in the automation editor, then [retrieve the automation](/docs/api/resource/automation/manage#retrieve-an-automation). The API has no endpoint that lists SMTP accounts.

### Attachment modes

`attach_files_match_type` takes one of these lower-case tokens:

- `all`: attaches every candidate file. Ignores the condition.
- `most_recent`: attaches the most recent file. Ignores the condition.
- `filtered`: attaches the files that match `attach_files_match_condition`.
- `most_recent_filtered`: attaches the most recent file that matches `attach_files_match_condition`.

## General behavior {#validation--behavior}

- Tape sends one email for each record in the collection. A field or meta reference with `collection: true` reads that record's value, like the email field in the example.
- Unlike `send_email`, the schema marks no key as required. Without `record_collection`, Tape saves the action, and validation reports `action_invalid`.
- A `record_collection` without a matching earlier action fails validation with `action_variable_missing`.
- Without `to_address`, Tape skips the action when the automation runs. Set `to_address` and `subject` for a useful email.
- Every other address, name and body defaults to empty.
- Every email an automation sends counts against the organization's shared 24-hour send quota.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.
- An earlier action in the automation must create the collection in `record_collection`, for example [`collect_app_records`](/docs/api/resource/automation/reference/actions/collect-app-records).

<a id="see-also"></a>

## Next steps

- [send_email](/docs/api/resource/automation/reference/actions/send-email): send a single email.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): build template values and references.
- [Filters](/docs/api/resource/automation/reference/filters): the filter group used by `attach_files_match_condition`.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
