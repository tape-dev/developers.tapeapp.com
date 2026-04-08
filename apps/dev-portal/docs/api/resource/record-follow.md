---
id: record-follow
title: Record Follow
sidebar_label: Record Follow
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Record following allows users to subscribe to updates on specific records. The following endpoints allow managing record follow state via the API.

## Unfollow all records in an app

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/app/unfollow-all/{app_id}" />

Unfollow all users from all records inside the app with the specified `app_id`. This is a blocking operation that processes all follow edges in batches and returns once complete. Requires **full access** permission on the app.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/app/unfollow-all/1 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{}'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "total_unfollowed_count": 6
}
```

**Response Properties**

| Property                 | Type        | Description                                                    |
| :----------------------- | :---------- | :------------------------------------------------------------- |
| `total_unfollowed_count` | `integer`   | Total number of follow edges that were removed.                |

If no users are following any records in the app, the response will contain `0` for `total_unfollowed_count`.
