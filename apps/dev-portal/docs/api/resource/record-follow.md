---
id: record-follow
title: Record follow
sidebar_label: Record follow
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use this endpoint to stop notifications about the records of a database app for everyone who follows them.

Users who follow a record get notified about its updates.

In the Podio API, a follow is a subscription.

## Unfollow all records in a database app {#unfollow-all-records-in-an-app}

Use this endpoint to remove every follower from every record of a database app.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/app/unfollow-all/{app_id}" />

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X PUT #BASE_URL/v1/record/app/unfollow-all/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{}'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "total_unfollowed_count": 6
}
```

The example unfollows all records of the database app with ID `1`. To find your app ID, see [Find the app ID and field IDs](/docs/api/resource/app#find-app-and-field-ids).

**General behavior**

- The request unfollows all users of your organization, not only you.
- The request blocks until Tape has removed all follows. On large databases, this takes a while.
- If nobody follows a record of the database, `total_unfollowed_count` is `0`.

**Requirements:** `records:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Errors**

- A request without **Full access** to the app returns `400` with `app_no_permission`.
- A request without a credential returns `401`.
- A token without `records:edit` returns `403`.
- A token whose content access doesn't include the app returns `404`.

See [Errors](/docs/api/errors) for all error codes.

**Response fields**

| Property | Type | Description |
| :-- | :-- | :-- |
| `total_unfollowed_count` | `integer` | Number of follows that were removed. |

## Next steps

- [Record](/docs/api/resource/record): create, update and delete records.
- [Record comment](/docs/api/resource/record-comment): read and post comments on a record.
- [Webhook](/docs/api/resource/webhook): get notified about record changes in your own backend instead.
- [Capabilities](/docs/api/capabilities): what `records:edit` allows.
