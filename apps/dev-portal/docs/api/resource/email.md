---
id: email
title: Email
sidebar_label: Email
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Admonition from '@theme/Admonition';

Use this endpoint to send emails from Tape to people outside Tape.

## Send an email {#sending-an-email}

Use this endpoint to send an email to one or more recipients.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/email/send" />

Send the recipients in `to`, the subject in `subject` and the formatted body in `html`.

The example sends an email to `riley@acme.com`. When Riley replies, the reply goes to `juliet@acme.com`.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/email/send \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "to": "riley@acme.com",
    "subject": "Your viewing on Friday",
    "html": "<p>Your viewing of 12 Harbor Street is confirmed for Friday at 10 am.</p>",
    "reply_to": "juliet@acme.com"
}'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "to": "riley@acme.com",
  "subject": "Your viewing on Friday",
  "html": "<p>Your viewing of 12 Harbor Street is confirmed for Friday at 10 am.</p>",
  "reply_to": "juliet@acme.com"
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "status": "SUCCESSFULLY_SCHEDULED"
}
```

:::info Did the email reach the recipient?
Tape hands the email to the mail server during the request. `SUCCESSFULLY_SCHEDULED` means the mail server accepted it, not that it reached the recipient. The API can't check delivery.
:::

**General behavior**

- Content access doesn't limit this endpoint. A token limited to one workspace can still send email.
- If the mail server rejects a recipient, Tape tries that recipient again a few times within the same request.
- Tape limits how many emails an organization sends per day through Tape's own servers. To send more, use your own SMTP server. See [Sender address](#sender-address).

**Requirements:** `email:send`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Errors**

- A request without a valid recipient in `to`, `cc` or `bcc` returns `400` with `email_send_failure`. The message reads `[EmailSendFailureException] Sending Email failed with reason: Error: No recipients defined`.
- A mail server that can't be reached, or still rejects the email at the last attempt, returns `400` with `email_send_failure`.
- An email over your organization's daily limit for Tape's own servers returns `400` with `email_send_failure`.
- Attachments over the maximum total size return `400` with `validation`. See [Limits](#limits).
- A file in `attachment_ids` you don't have access to returns `403`.

**Optional body parameters**

- `cc`, `bcc` and `reply_to`: one email address or a list of them.
- `from_name`: the sender name your recipients see.
- `attachment_ids`: a list of file IDs to attach. See [Attachments](#attachments).
- `from_address` and `smtp_settings_id`: send from your own address. See [Sender address](#sender-address).

### Attachments

`attachment_ids` accepts these file IDs:

- files in attachment or image fields of records. See [Attachment field value](/docs/api/resource/field-value/attachment).
- files you uploaded with the [File resource](/docs/api/resource/file).
- files attached to record comments or replies.

You need access to every file you attach.

### Sender address

Without your own email server, Tape sends from `noreply@automations.tapeapp.com`. If you set `reply_to`, Tape sends from `reply@automations.tapeapp.com`. Set `from_name` to show your own sender name.

To send from your own address, add an SMTP account in the **Send an email** action of an automation:

1. Open an automation and add the action **Send an email**.
2. Select **Show more**, open the **Account** menu and select **Add account**.
3. On the **SMTP** tab, enter the user name, password, server address and port, then select **Save account**.
4. To make the account the default of your organization, open the **Account** menu, select the three dots next to the account and select **Set as default**.

Tape then sends through your organization's default SMTP account. To pick another one, set `smtp_settings_id`.

The API has no endpoint that lists SMTP accounts, and the **Account** menu doesn't show the ID. To find it in the automation editor:

1. In a **Send an email** action, select the account in the **Account** menu.
2. In the action menu, select **Duplicate**.
3. In the action menu of the copy, select **Turn into** → **Execute script**. The script shows the ID in `smtp_settings_id`.
4. Remove the copy.

The [automation API](/docs/api/resource/automation/manage#retrieve-an-automation) returns the same ID as `smtp_account_id` of the action.

Set the sender address in `from_address`. Without it, Tape uses the user name of the SMTP server.

Your SMTP server must be allowed to send emails for this address. Otherwise, delivery fails.

The example sends an email from `juliet@acme.com` to two recipients, with two people in copy. It attaches the file with ID `42`, a file in an attachment field of a record.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/email/send \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "from_address": "juliet@acme.com",
    "from_name": "Juliet from Acme",
    "to": ["riley@acme.com", "sam@acme.com"],
    "subject": "Offer for 12 Harbor Street",
    "html": "<p>The signed offer is attached.</p>",
    "cc": ["will@acme.com", "nora@acme.com"],
    "attachment_ids": [42]
}'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "from_address": "juliet@acme.com",
  "from_name": "Juliet from Acme",
  "to": ["riley@acme.com", "sam@acme.com"],
  "subject": "Offer for 12 Harbor Street",
  "html": "<p>The signed offer is attached.</p>",
  "cc": ["will@acme.com", "nora@acme.com"],
  "attachment_ids": [42]
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "status": "SUCCESSFULLY_SCHEDULED"
}
```

## Limits

Tape enforces these limits for each email:

| Variable | Limit |
| :-- | :-- |
| Maximum total attachment size | 20 MB |

## Rate limit credits

Sending an email costs the [base request cost](/docs/api/request-limits) of 10 credits, whatever the number of recipients in `to`, `cc` and `bcc`.

One email to several recipients uses fewer credits than separate emails to each of them. Recipients in `to` and `cc` see each other. Put recipients in `bcc` if they shouldn't, and check that your choice fits your privacy policy.

## Next steps

- [File](/docs/api/resource/file): upload files to attach them.
- [Attachment field value](/docs/api/resource/field-value/attachment): find the file IDs of a record.
- [Request limits](/docs/api/request-limits): how credits work.
- [Capabilities](/docs/api/capabilities): what `email:send` allows.
