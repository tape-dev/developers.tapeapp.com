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

### Record create

### Record update
