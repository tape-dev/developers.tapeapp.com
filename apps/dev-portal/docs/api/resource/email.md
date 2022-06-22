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

For communication that happens outside of tape, the API offers an endpoint to send emails.

## Sending an Email

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/email/send" />

To send an email to one or more recipients, make a POST request to that endpoint. The POST body must contain the `to` property with one or more recipient email addresses, the `subject` property, and the `html` property which contains the formatted email body.

Optionally, the request can contain `cc`, `bcc` and `reply_to` properties, all of which can contain a list of email addresses.

Further specify `attachment_ids`, an array of existing file IDs analog to the attachment field type (temporary file ids are not yet supported). More details on file inputs can be found [here](/docs/api/resource/field-value/attachment).

:::info
If a POST request with a valid payload is submitted to this endpoint, the email is queued and not sent directly in the request transaction.
The response to the request only contains information about whether the email passed input validation and was successfully queued, not whether the email was successfully delivered.
Currently, there is no way to query the delivery status of an email through the API.

If an email could not be delivered, the job is rescheduled after 10, 100 and 1000 seconds. If the email could not be delivered after the 4th attempt, the job is canceled.
:::

The following example sends an email with subject, and body to `recipient@example.com` with the default sender address.
In case the recipient clicks on reply-to in its email client, the recipient of the reply is `reply-to@example.com`

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/email/send  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "to": "recipient@example.com",
    "subject": "Hello World",
    "html": "<p> Today we show you how to use the reply_to property in emails. </p>",
    "reply_to": "reply-to@example.com",
}'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "value": "This is a comment on record with ID 1.",
  "to": "recipient@example.com",
  "subject": "Hello World",
  "html": "<p> This is the email body. </p>",
  "reply_to": "reply-to@example.com"
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "status": "SUCCESSFULLY_SCHEDULED"
}
```

By default, emails are sent from the address `reply.automations@tape-app.com`.

<b>Coming Soon: </b><br/>
If your organization has configured its own SMTP server in the organization settings, the email can also be sent from your own email address. To do this, specify the `use_organization_smtp_config` flag and the `from` property that contains the sender address. Note that your SMTP server must be authorized to send email on behalf of this address for the email to be sent successfully.

<br/>
<br/>
The next example sends an email with subject, and body to "recipient-one@example.com" and "recipient-two@example.com" with the sender address "sender@example.com".
The addresses "carbon-copy-one@example.com" and "carbon-copy-two@example.com" recieve a copy of the email.
In addition, the email contains an attachment with file ID 42, which is present in an attachment or image field-value in a record in your organization.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/email/send  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "from": "sender@example.com",
    "to": ["recipient-one@example.com", "recipient-two@example.com"],
    "subject": "Hello World",
    "html": "<p> Today we show you how to use the cc property in emails. </p>",
    "cc": ["carbon-copy-one@example.com", "carbon-copy-two@example.com"],
    "attachment_ids": [42]
}'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "from": "sender@example.com",
  "to": ["recipient-one@example.com", "recipient-two@example.com"],
  "subject": "Hello World",
  "html": "<p> Today we show you how to use the cc property in emails. </p>",
  "cc": ["carbon-copy-one@example.com", "carbon-copy-two@example.com"],
  "attachment_ids": [42]
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "status": "SUCCESSFULLY_SCHEDULED"
}
```

## limits

The following limits are enforced for each email:

| Variable                      | Limit |
| :---------------------------- | :---- |
| Maximum total attachment size | 20MB  |

## Rate limit credits

Emails are rate limited based on their number of recipient addresses (sum of addresses contained in the properties `to`, `cc` and `bcc` of the request body). Every request consumes an additional credit:

```
Sending to 1 recipient:  2x credits
Sending to 2 recipients: 3x credits
...
Sending to 10 recipients: 11x credits
...
```

As you can see, sending the same email to multiple recipients at one costs less credits than sending the same email to multiple recipients separately.
Note that with the first option, each recipient sees the other recipients. Depending on the use case, this could conflict with your privacy policy.
