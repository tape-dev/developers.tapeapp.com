---
id: webhook
title: Webhook
sidebar_label: Webhook
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A webhook enables Tape to push real-time notifications to your app. Tape uses HTTP or HTTPS to send these notifications to your app as a JSON payload. You can then use these notifications to execute actions in your backend systems.

## Create a webhook

A webhook can be created via the API by providing a URL and the type of events you want to get notified for. See the list of available webhook types [below](#webhook-types).

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/hook/app/{app_id}" />

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/hook/app/1 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "type": "record.create",
    "url": "https://webhook.example.org/example-webhook-endpoint"
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "type": "record.create",
  "url": "https://webhook.example.org/example-webhook-endpoint"
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "hook_id": 1,
  "app_id": 1,
  "status": "inactive",
  "type": "record.create",
  "url": "https://webhook.example.org/example-webhook-endpoint"
}
```

## Request hook verification

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/hook/{hook_id}/verify/request" />

To avoid potential abuse of webhooks and increase security, every webhook URL must be verified first before Tape starts sending requests to that URL. You can request the verification code via the API. This will cause the webhook to send a request to the URL with the parameter `type` set to `hook.verify` and `code` set to the verification code. The endpoint must then call the validate method with the code to complete the verification.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/hook/1/verify/request \\
  -u #USER_API_KEY:
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "hook_id": 1,
  "status": "inactive",
  "type": "record.create",
  "url": "https://webhook.example.org/example-webhook-endpoint"
}
```

The Tape server will send a POST request to the provided URL with the following body:

```json title='⬅️      Incoming request'
{
  "hook_id": 1,
  "type": "hook.verify",
  "code": "f43d05e6"
}
```

## Validate hook verification

Validates the hook using the code received from the verify call. On successful validation the hook will become active.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/hook/{hook_id}/verify/validate" />

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/hook/1/verify/validate \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "code": "f43d05e6"
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "code": "f43d05e6"
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "hook_id": 1,
  "status": "active",
  "type": "record.create",
  "url": "https://webhook.example.org/example-webhook-endpoint"
}
```

## Retrieve app webhooks

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/hook/app/{app_id}" />

All existing webhooks for an app can be retrieved via the API by providing the ID of the app.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X GET #BASE_URL/v1/hook/app/1 \\
  -u #USER_API_KEY:
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "webhooks": [
    {
      "hook_id": 1,
      "status": "active",
      "type": "record.create",
      "url": "https://webhook.example.org/example-webhook-endpoint"
    }
  ]
}
```

## Delete a webhook

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/hook/{hook_id}" />

A webhook can be deleted via the API by providing the ID of the webhook.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X DELETE #BASE_URL/v1/hook/1 \\
  -u #USER_API_KEY:
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "hook_id": 1,
  "status": "inactive",
  "type": "record.create",
  "url": "https://webhook.example.org/example-webhook-endpoint"
}
```

## Webhook types

Webhooks have to specify a `type`, which indicates which events should be sent to this webhook. The types of webhooks currently available are the following:

### Record created

The `record.create` webhook type allows you to get notified whenever a record was created in the app the webhook is registered for. Here is an example incoming POST request payload:

<Tabs>
<TabItem value="json" label="JSON">

```json title='⬅️      Incoming request'
{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 0,
  "type": "record.create"
}
```

</TabItem>

<TabItem value="http" label="HTTP">

```http title='⬅️      Incoming request'
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  51
Host            localhost:3009
Connection      close

{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 0,
  "type": "record.create"
}
```

</TabItem>
</Tabs>

### Record updated

The `record.update` webhook type allows you to get notified whenever a record was updated in the app the webhook is registered for. Here is an example incoming POST request payload:

<Tabs>
<TabItem value="json" label="JSON">

```json title='⬅️      Incoming request'
{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 1,
  "type": "record.update"
}
```

</TabItem>

<TabItem value="http" label="HTTP">

```http title='⬅️      Incoming request'
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  51
Host            localhost:3009
Connection      close

{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 1,
  "type": "record.update"
}
```

</TabItem>
</Tabs>

### Record deleted

The `record.delete` webhook type allows you to get notified whenever a record was deleted in the app the webhook is registered for. Here is an example incoming POST request payload:

<Tabs>
<TabItem value="json" label="JSON">

```json title='⬅️      Incoming request'
{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 2,
  "type": "record.delete"
}
```

</TabItem>

<TabItem value="http" label="HTTP">

```http title='⬅️      Incoming request'
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  51
Host            localhost:3009
Connection      close

{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 2,
  "type": "record.delete"
}
```

</TabItem>
</Tabs>

### Record restored

The `record.restore` webhook type allows you to get notified whenever a record was restored in the app the webhook is registered for. Here is an example incoming POST request payload:

<Tabs>
<TabItem value="json" label="JSON">

```json title='⬅️      Incoming request'
{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 3,
  "type": "record.restore"
}
```

</TabItem>

<TabItem value="http" label="HTTP">

```http title='⬅️      Incoming request'
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  51
Host            localhost:3009
Connection      close

{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 3,
  "type": "record.restore"
}
```

</TabItem>
</Tabs>

### Comment created

The `comment.create` webhook type allows you to get notified whenever a comment was created for a record in the app the webhook is registered for. Here is an example incoming POST request payload:

<Tabs>
<TabItem value="json" label="JSON">

```json title='⬅️      Incoming request'
{
  "hook_id": 1,
  "record_id": 100,
  "comment_id": 500,
  "type": "comment.create"
}
```

</TabItem>

<TabItem value="http" label="HTTP">

```http title='⬅️      Incoming request'
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  51
Host            localhost:3009
Connection      close

{
  "hook_id": 1,
  "record_id": 100,
  "comment_id": 500,
  "type": "comment.create"
}
```

</TabItem>
</Tabs>

### Comment deleted

The `comment.delete` webhook type allows you to get notified whenever a comment was deleted for a record in the app the webhook is registered for. Here is an example incoming POST request payload:

<Tabs>
<TabItem value="json" label="JSON">

```json title='⬅️      Incoming request'
{
  "hook_id": 1,
  "record_id": 100,
  "comment_id": 500,
  "type": "comment.delete"
}
```

</TabItem>

<TabItem value="http" label="HTTP">

```http title='⬅️      Incoming request'
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  51
Host            localhost:3009
Connection      close

{
  "hook_id": 1,
  "record_id": 100,
  "comment_id": 500,
  "type": "comment.delete"
}
```

</TabItem>
</Tabs>

## Error handling

The webhook must respond with a 2xx status code. If the status code is different from 2xx more than 50 consecutive times the webhook will return to being unverified and will have to be verified again to be active. Additionally, your webhook may return to unverified if you do not send responses in a timely manner (5 seconds). You should handle any heavy processing asynchronously.

Only hooks on port 80 and 443 are supported, i.e. you cannot use `http://www.example.org/webhook:8080`, only `http://www.example.org/webhook` or `https://www.example.org/webhook`.

## Rate Limits

Webhook executions are rate limited. The current rate limit is 100 webhook executions per minute per app.

:::caution Rate limits may change
In the future, Tape plans to adjust rate limits to balance for demand and reliability. Tape may also introduce distinct rate limits for organizations in different pricing plans.
:::
