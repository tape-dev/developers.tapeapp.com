---
id: webhook
title: Webhook
sidebar_label: Webhook
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Create a webhook

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
  "url": "https://webhook.example.org/example-webhook-endpoint",
  "status": "inactive"
}
```

## Request hook verification

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/hook/{hook_id}/verify/request" />

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/hook/1/verify/request \\
  -u #USER_API_KEY:
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "hook_id": 1,
  "url": "https://webhook.example.org/example-webhook-endpoint",
  "status": "inactive"
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
  "url": "https://webhook.example.org/example-webhook-endpoint",
  "status": "active"
}
```

## Delete a webhook

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/hook/{hook_id}" />

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X DELETE #BASE_URL/v1/hook/1 \\
  -u #USER_API_KEY:
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "hook_id": 1
}
```

## Webhook types

### Record created

`record.create`
<Tabs>
<TabItem value="json" label="JSON">

```json title='⬅️      Incoming request'
{
  "hook_id": 1,
  "record_id": 100,
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
  "type": "record.create"
}
```

</TabItem>
</Tabs>

### Record updated

`record.update`

<Tabs>
<TabItem value="json" label="JSON">

```json title='⬅️      Incoming request'
{
  "hook_id": 1,
  "record_id": 100,
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
  "type": "record.update"
}
```

</TabItem>
</Tabs>

### Record deleted

`record.delete`

<Tabs>
<TabItem value="json" label="JSON">

```json title='⬅️      Incoming request'
{
  "hook_id": 1,
  "record_id": 100,
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
  "type": "record.delete"
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
