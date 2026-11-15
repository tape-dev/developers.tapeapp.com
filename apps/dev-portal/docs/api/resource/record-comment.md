---
id: record-comment
title: Record comment
sidebar_label: Record comment
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Admonition from '@theme/Admonition';

Use these endpoints to create, read and delete the comments and replies on a record.

Comments and replies appear in the activity of a record, next to its field changes.

:::info Which capability do I need?
Endpoints that read comments and replies need `records.comments:read`. Endpoints that create or delete them need `records.comments:edit`. See [Capabilities](/docs/api/capabilities).
:::

## The comment object

Every comment endpoint returns comments in this format. The example comment has one attached file:

```json title="Comment"
{
  "comment_id": 1000,
  "value": "The contract is attached.",
  "ref": { "type": "record", "id": 1 },
  "files": [
    {
      "file_id": "comment-file-5001",
      "name": "contract.pdf",
      "mimetype": "application/pdf",
      "size": 48213,
      "created_on": "2022-03-01 12:00:00",
      "created_on_utc": "2022-03-01 11:00:00"
    }
  ],
  "created_on": "2022-03-01 12:00:00",
  "created_on_utc": "2022-03-01 11:00:00",
  "created_by": {
    "user_id": 600,
    "type": "user",
    "org_id": 1,
    "mail": ["juliet@acme.com"],
    "name": "Juliet Adams"
  },
  "user": {
    "user_id": 600,
    "type": "user",
    "org_id": 1,
    "mail": ["juliet@acme.com"],
    "name": "Juliet Adams"
  }
}
```

The example comes from a user whose timezone is one hour ahead of UTC.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `comment_id` | number | The comment ID. | `1000` |
| `value` | string | Text of the comment, as plain text. Line breaks are `\n`. Mentions use the same syntax as in [Create a record comment](#create-a-record-comment). | `"The contract is attached."` |
| `ref` | object | What the comment belongs to. `type` is `record`, `id` is the record ID. | `{ "type": "record", "id": 1 }` |
| `files` | array | Files attached to the comment. Empty when there are none. See [Comment files](#comment-files). | `[]` |
| `created_on` | string | When the comment was written, as `YYYY-MM-DD HH:mm:ss` in your timezone. See [Date & timezone](/docs/api/date-timezone). | `"2022-03-01 12:00:00"` |
| `created_on_utc` | string | The same moment as `created_on`, in UTC. | `"2022-03-01 11:00:00"` |
| `created_by` | object \| null | The user who wrote the comment, or `null` if no user is the author. | `{ "user_id": 600, "type": "user", … }` |
| `user` | object \| null | Same as `created_by`. | `{ "user_id": 600, "type": "user", … }` |

The author object has `user_id`, `type` (`"user"`), `org_id`, `mail` (a list with the email address of the user) and `name`.

### Comment files

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `file_id` | string | ID of the file, with the prefix `comment-file-`. Use it in `attachment_ids` of the [Email resource](/docs/api/resource/email#attachments). | `"comment-file-5001"` |
| `name` | string | File name. | `"contract.pdf"` |
| `mimetype` | string | MIME type of the file. | `"application/pdf"` |
| `size` | number | File size in bytes. | `48213` |
| `created_on` | string | When the file was uploaded, in your timezone. | `"2022-03-01 12:00:00"` |
| `created_on_utc` | string | The same moment as `created_on`, in UTC. | `"2022-03-01 11:00:00"` |

## Create a record comment

Use this endpoint to add a comment to a record.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/comment/record/{record_id}" />

Send the text of the comment in `value`. The example adds a plain text comment to the record with ID `1`.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/comment/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "value": "This is a comment on record with ID 1."
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "value": "This is a comment on record with ID 1."
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "comment_id": 1000,
  "value": "This is a comment on record with ID 1.",
  "created_on": "2022-03-01 12:00:00",
  "ref": { "type": "record", "id": 1 },
  "files": [],
  "created_by": {
    "user_id": 600,
    "mail": ["juliet@acme.com"],
    "name": "Juliet Adams",
    "org_id": 1,
    "type": "user"
  },
  "user": {
    "user_id": 600,
    "mail": ["juliet@acme.com"],
    "name": "Juliet Adams",
    "org_id": 1,
    "type": "user"
  }
}
```

**General behavior**

- `value` supports plain text with a few formatting options:
  - Force a line break with `\n`.
  - Mention a user with the ID and name of the user, for example `@[Juliet Adams](user:123)` for the user with ID `123`. To find a user ID, see [Retrieve organization users](/docs/api/resource/user#retrieve-organization-users).
- To attach files, send their temporary file IDs in `file_ids`, like for the attachment field type. See [File](/docs/api/resource/file).

**Requirements:** `records.comments:edit`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `silent` | `boolean` | Don't send notifications for this change (default: `false`). |
| `hook` | `boolean` | Run webhooks for this change (default: `true`). |
| `workflow` | `boolean` | Trigger automations for this change (default: `true`). |

**Body parameters**

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `value` | `string` | Required. Text of the comment. |
| `file_ids` | `Array` | Temporary file IDs of the files to attach. |

## Retrieve a comment

Use this endpoint to read one comment by its ID.

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/comment/{comment_id}" />

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/comment/1000 \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

```json title="Response"
{
  "comment_id": 1000,
  "value": "This is a comment on record with ID 1.",
  "created_on": "2022-03-01 12:00:00",
  "ref": { "type": "record", "id": 1 },
  "files": [],
  "created_by": {
    "user_id": 600,
    "mail": ["juliet@acme.com"],
    "name": "Juliet Adams",
    "org_id": 1,
    "type": "user"
  },
  "user": {
    "user_id": 600,
    "mail": ["juliet@acme.com"],
    "name": "Juliet Adams",
    "org_id": 1,
    "type": "user"
  }
}
```

`ref` points to the record the comment belongs to.

**Requirements:** `records.comments:read`. Works with a personal access token, an OAuth access token or a user API key.

## Delete a comment

Use this endpoint to delete a comment by its ID.

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/comment/{comment_id}" />

<ContextCodeBlock language="shell" title='Request'>
{`curl -X DELETE #BASE_URL/v1/comment/1000 \\
  -H "Authorization: Bearer $TAPE_TOKEN"
`}
</ContextCodeBlock>

```json title="Response"
{}
```

**General behavior**

- You can delete only your own comments.
- To delete a reply, use [Delete a comment or reply](#delete-a-comment-or-reply).

**Requirements:** `records.comments:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Query parameters**

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `silent` | `boolean` | Don't send notifications for this change (default: `false`). |
| `hook` | `boolean` | Run webhooks for this change (default: `true`). |

## Retrieve comments for a record

Use this endpoint to list the comments on a record, page by page.

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/comment/record/{record_id}" />

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/comment/record/1?limit=2 \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='Response'>
{`{
  "total": 2,
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFiRGVmSWQiOjgsInZhbHVlcyI6WzE1OV0sImV4cCI6MTY1MDYxODc3OH0.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g",
  "comments": [
    {
      "comment_id": 1000,
      "value": "This is a comment on record with ID 1.",
      "created_on": "2022-03-01 12:00:00",
      "files": [],
      "ref": { "type": "record", "id": 1 },
      "created_by": {
        "user_id": 600,
        "mail": ["juliet@acme.com"],
        "name": "Juliet Adams",
        "org_id": 1,
        "type": "user"
      },
      "user": {
        "user_id": 600,
        "mail": ["juliet@acme.com"],
        "name": "Juliet Adams",
        "org_id": 1,
        "type": "user"
      }
    },
    {
      "comment_id": 1001,
      "value": "This is another comment on record with ID 1.",
      "created_on": "2022-03-01 13:00:00",
      "files": [],
      "ref": { "type": "record", "id": 1 },
      "created_by": {
        "user_id": 600,
        "mail": ["juliet@acme.com"],
        "name": "Juliet Adams",
        "org_id": 1,
        "type": "user"
      },
      "user": {
        "user_id": 600,
        "mail": ["juliet@acme.com"],
        "name": "Juliet Adams",
        "org_id": 1,
        "type": "user"
      }
    }
  ]
}`}
</ContextCodeBlock>

The results are [paginated](/docs/api/pagination). Pass `cursor` from the response to get the next page. `total` counts all comments on the record, not only this page, and no replies.

**Requirements:** `records.comments:read`. Works with a personal access token, an OAuth access token or a user API key.

**Query parameters**

| Parameter | Type | Description | Min | Max |
| --- | --- | --- | --- | --- |
| `limit` | `integer` | Number of comments to return (default: `50`). | 1 | 100 |
| `cursor` | `string` | Cursor of the next page. | - | - |

## Reply to a comment

Use this endpoint to reply to a comment or to another reply.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/reply/comment-or-reply/{comment_or_reply_id}" />

To find a `comment_id` or `reply_id`, see [Retrieve comments for a record](#retrieve-comments-for-a-record) and [Retrieve replies for a record](#retrieve-replies-for-a-record).

Send the text of the reply in `value`. The example replies to the comment with ID `1000`.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/reply/comment-or-reply/1000 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "value": "Thanks, I will check it today."
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "value": "Thanks, I will check it today."
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "reply_id": 2000,
  "ref": { "type": "record", "id": 1 },
  "parent": { "type": "comment", "id": 1000 },
  "created_on": "2022-03-01 14:00:00",
  "created_on_utc": "2022-03-01 13:00:00",
  "last_edit_on": null,
  "last_edit_on_utc": null,
  "files": [],
  "value": "Thanks, I will check it today.",
  "user": {
    "mail": ["will@acme.com"],
    "user_id": 601,
    "org_id": 1,
    "name": "Will Dawson",
    "type": "user"
  },
  "created_by": {
    "mail": ["will@acme.com"],
    "user_id": 601,
    "org_id": 1,
    "name": "Will Dawson",
    "type": "user"
  }
}
```

`ref` points to the record. `parent` points to the activity the reply answers, here the comment with ID `1000`.

**General behavior**

- `value` supports the same formatting as a comment: line breaks with `\n` and user mentions.
- To attach files, send their temporary file IDs in `file_ids`.
- Replies have one level. A reply to a reply goes to the same parent as the reply you answer.
- `created_by` and `user` are `null` if Tape can't show the author, for example when an automation wrote the reply.
- Unlike a comment, a reply runs webhooks and automations only if you set `hook` and `workflow` to `true`.

**Requirements:** `records.comments:edit`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `silent` | `boolean` | Don't send notifications for this change (default: `false`). |
| `hook` | `boolean` | Run webhooks for this change (default: `false`). |
| `workflow` | `boolean` | Trigger automations for this change (default: `false`). |

**Body parameters**

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `value` | `string` | Required. Text of the reply. |
| `file_ids` | `Array` | Temporary file IDs of the files to attach. |

## Retrieve replies for a record

Use this endpoint to list all replies on a record, page by page.

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/reply/record/{record_id}" />

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/reply/record/1?limit=2 \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='Response'>
{`{
  "total": 3,
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFiRGVmSWQiOjgsInZhbHVlcyI6WzE1OV0sImV4cCI6MTY1MDYxODc3OH0.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g",
  "replies": [
    {
      "reply_id": 2000,
      "ref": { "type": "record", "id": 1 },
      "parent": { "type": "comment", "id": 1000 },
      "created_on": "2022-03-01 14:00:00",
      "created_on_utc": "2022-03-01 13:00:00",
      "last_edit_on": null,
      "last_edit_on_utc": null,
      "files": [],
      "value": "Thanks, I will check it today.",
      "user": {
        "mail": ["will@acme.com"],
        "user_id": 601,
        "org_id": 1,
        "name": "Will Dawson",
        "type": "user"
      },
      "created_by": {
        "mail": ["will@acme.com"],
        "user_id": 601,
        "org_id": 1,
        "name": "Will Dawson",
        "type": "user"
      }
    },
    {
      "reply_id": 2001,
      "ref": { "type": "record", "id": 1 },
      "parent": { "type": "comment", "id": 1000 },
      "created_on": "2022-03-01 15:00:00",
      "created_on_utc": "2022-03-01 14:00:00",
      "last_edit_on": null,
      "last_edit_on_utc": null,
      "files": [],
      "value": "Great, thank you.",
      "user": {
        "mail": ["juliet@acme.com"],
        "user_id": 600,
        "org_id": 1,
        "name": "Juliet Adams",
        "type": "user"
      },
      "created_by": {
        "mail": ["juliet@acme.com"],
        "user_id": 600,
        "org_id": 1,
        "name": "Juliet Adams",
        "type": "user"
      }
    }
  ]
}`}
</ContextCodeBlock>

The results are paginated. Pass `cursor` from the response to get the next page.

**General behavior**

- The response contains every reply on the record. A reply can answer a comment, a field change or the creation of the record. `parent.type` tells you which: `comment`, `revision`, `created`, `deleted`, `restored` or `invitation`.
- Replies come grouped by the activity they answer, oldest activity first and oldest reply first. Replies with the same `parent.id` belong to the same thread.
- `total` is the number of all replies on the record. Only the first page contains it. Pages you get with a `cursor` return `null`.
- `cursor` is `null` on the last page.
- Use a `cursor` only with this endpoint and the same record. Any other cursor returns an error.

**Requirements:** `records.comments:read`. Works with a personal access token, an OAuth access token or a user API key.

**Query parameters**

| Parameter | Type | Description | Min | Max |
| --- | --- | --- | --- | --- |
| `limit` | `integer` | Number of replies to return (default: `50`). | 1 | 100 |
| `cursor` | `string` | Cursor of the next page. | - | - |

## Delete a comment or reply

Use this endpoint to delete a comment or a reply by its ID.

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/comment-or-reply/{comment_or_reply_id}" />

<ContextCodeBlock language="shell" title='Request'>
{`curl -X DELETE #BASE_URL/v1/comment-or-reply/2000 \\
  -H "Authorization: Bearer $TAPE_TOKEN"
`}
</ContextCodeBlock>

```json title="Response"
{}
```

**General behavior**

- Send the ID of a comment (`comment_id`) or of a reply (`reply_id`).
- You can delete only your own comments and replies.

**Requirements:** `records.comments:edit`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `silent` | `boolean` | Don't send notifications for this change (default: `false`). |

## Errors

- A record you can't view or comment on returns `400` with `record_no_permission`.
- Deleting a comment or reply that isn't your own returns `401`. So does a request without a credential.
- A token without `records.comments:read` or `records.comments:edit` returns `403`.
- A comment or reply that doesn't exist returns `404`.

See [Errors](/docs/api/errors) for all error codes.

## Next steps

- [Record](/docs/api/resource/record): read the record a comment belongs to.
- [File](/docs/api/resource/file): upload files to attach to comments and replies.
- [Pagination](/docs/api/pagination): read long lists of comments and replies page by page.
- [Webhook](/docs/api/resource/webhook): get notified when someone comments on a record.
- [Capabilities](/docs/api/capabilities): what `records.comments:read` and `records.comments:edit` allow.
