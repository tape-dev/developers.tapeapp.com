---
id: record-revision
title: Record Revision
sidebar_label: Record Revision
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Admonition from '@theme/Admonition';

As Records in Tape change over time, it is important to understand what changes were made, by whom and when. Revisions can be retrieved via the API.

## Revisions concept

Every record in Tape has a `revision` number property, that starts with `0` upon creation and is increased with each change made to the Record.

Record revisions will include the author of the revision as `created_by`, the date and time of the revision `created_on` and the revision number.

## Retrieve Revisions for a Record

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}/revision" />

The following example fetches the revisions of record with ID `1`, that was created and updated once by the user `Dan Jacob` with ID `600`:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X GET #BASE_URL/v1/record/1/revision  \\
  -u #USER_API_KEY: \\
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "total": 2,
  "revisions": [
    {
      "created_by": {
        "user_id": 600,
        "name": "Dan Jacob",
        "type": "user",
        "image": null
      },
      "created_on": "2022-03-16 14:25:00",
      "type": "creation",
      "revision": 0
    },
    {
      "created_by": {
        "user_id": 600,
        "name": "Dan Jacob",
        "type": "user",
        "image": null
      },
      "created_on": "2022-03-16 14:30:00",
      "type": "update",
      "revision": 1
    }
  ]
}
```

:::caution Note
Note that **_Revisions_** do not contain the actual changes made, but only the meta data. Use the endpoint described in the next section to fetch individual revision changes.
:::

## Retrieve Revision delta

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}/revision/previous/{toRevisionId}" />

In order to understand how a record changed over time, the Tape-API provides consumers with the concept of **_Revision Deltas_**. Revision deltas will include a `from` and `to` property, describing the transition of individual fields from one value (or no value) to another (or none). These properties follow the same form as record field `values` property, check the [field value section](/docs/api/resource/field-value/general) for more details.

A single record revision may include deltas for multiple fields, if the changes were made at the same time by the same entity.

The following example fetches the revision delta of revision number `1` of record with ID `1` to its previous revision number `0` to understand the changes made from the previous example. One may now see that a single text field with external_id `notes` was updated from no value to the value `Some important notes`.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X GET #BASE_URL/v1/record/1/revision/previous/1  \\
  -u #USER_API_KEY: \\
`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "total": 2,
  "revision_deltas": [
    {
      "from": [],
      "external_id": "notes",
      "field_id": 2000,
      "label": "Notes",
      "to": [
        {
          "value": "Some important notes"
        }
      ],
      "type": "contact",
      "config": {
        "description": null,
        "required": false,
        "label": "Notes"
      }
    }
  ]
}
```
