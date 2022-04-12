---
id: record-comment
title: Record Comment
sidebar_label: Record Comment
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Admonition from '@theme/Admonition';

While data is stored inside records, communication in Tape usually happens inside comments on those records. Comments can be created, retrieved, updated and deleted via the API.

<Admonition type="caution" icon="🚧" title="In development">
The records API is in active development. Feel free to use the endpoints, but as of March 28, 2022 this is actively developed.
</Admonition>

## Create a record comment

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/comment/record/{record_id}" />

To create a new record comment for the record with the specified `record_id`, issue a POST request to this endpoint. The POST body has to contain the `value` property with the text of the comment. It may further specify `file_ids`, an array of temporary file IDs analog to the attachment field type. More details on file uploads can be found [here](/docs/api/resource/file).

Apart from plain text, the comment `value` property supports limited formatting and extra options:

- Forcing newlines using `\n`
- Adding a user mention using the proper syntax, e.g. for this user with ID 123 and name "Dan Jacob": `@[Dan Jacob](user:123)`

The following example creates a plain text comment on the record with ID 1:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/comment/record/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "value": "This is a comment on record with ID 1."
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "value": "This is a comment on record with ID 1."
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "comment_id": 1000,
  "value": "This is a comment on record with ID 1.",
  "created_on": "2022-03-01 12:00:00",
  "ref": { "type": "record", "id": 1 },
  "created_by": {
    "user_id": 600,
    "mail": ["dan@tapeapp.com"],
    "image": null,
    "name": "Dan Jacob",
    "org_id": 1,
    "type": "user"
  }
}
```

## Retrieve a comment

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/comment/{comment_id}" />

Retrieve the comment with the specified `comment_id`:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/comment/1000 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "comment_id": 1000,
  "value": "This is a comment on record with ID 1.",
  "created_on": "2022-03-01 12:00:00",
  "ref": { "type": "record", "id": 1 },
  "created_by": {
    "user_id": 600,
    "mail": ["dan@tapeapp.com"],
    "image": null,
    "name": "Dan Jacob",
    "org_id": 1,
    "type": "user"
  }
}
```

## Delete a comment

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/comment/{comment_id}" />

Delete the comment with the specified `comment_id`:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X DELETE #BASE_URL/v1/comment/1  \\
  -u #USER_API_KEY:
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{}
```

## Retrieve comments for a record

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/comment/record/{record_id}" />

Retrieve comments for the record with the specified `record_id`. Note that results are [paginated](/docs/api/pagination).

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/app/1?limit=2 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "total": 2,
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFiRGVmSWQiOjgsInZhbHVlcyI6WzE1OV0sImV4cCI6MTY1MDYxODc3OH0.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g",
  "comments": [
    {
      "comment_id": 1000,
      "value": "This is a comment on record with ID 1.",
      "created_on": "2022-03-01 12:00:00",
      "ref": { "type": "record", "id": 1 },
      "created_by": {
        "user_id": 600,
        "mail": ["dan@tapeapp.com"],
        "image": null,
        "name": "Dan Jacob",
        "org_id": 1,
        "type": "user"
      }
    },
    {
      "comment_id": 1001,
      "value": "This is another comment on record with ID 1.",
      "created_on": "2022-03-01 13:00:00",
      "ref": { "type": "record", "id": 1 },
      "created_by": {
        "user_id": 600,
        "mail": ["dan@tapeapp.com"],
        "image": null,
        "name": "Dan Jacob",
        "org_id": 1,
        "type": "user"
      }
    }
  ]
}`}
</ContextCodeBlock>

**Query Parameters**

| Parameter | Type      | ** Type**                                      | Min | Max |
| --------- | --------- | ---------------------------------------------- | --- | --- |
| `limit`   | `integer` | Number of comments to return. Defaults to 100. | 0   | 100 |
| `cursor`  | `string`  | Cursor for pagination                          | -   | -   |
