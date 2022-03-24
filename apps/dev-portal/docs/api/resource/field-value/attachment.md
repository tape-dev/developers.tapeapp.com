---
id: attachment
title: Attachment Field Value
sidebar_label: Attachment
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A attachment field value consists of its `value` property which holds a reference to an attachment. An attachment has the properties `id` (unique ID), `filename` (the filename), `size` (filesize in bytes), `download_url` (URL to download the file) and others.
A `SINGLE_ATTACHMENT` field value holds at most one attachment reference while a `MULTI_ATTACHMENT` field value can hold multiple attachment references.

More details on the file object and the two-step file upload process can be found [here](/docs/api/resource/file).

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A attachment field value can be created as part of a record creation. Here is an example request body for creating a record with a value for the "Letter of recommendation" field with ID 2, type `SINGLE_ATTACHMENT` and external ID `letter_of_recommendation` and a value for the "HR documents" field with ID 3, type `MULTI_ATTACHMENT` and external ID `hr_documents`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "letter_of_recommendation": "temporary-file-1",
      "hr_documents": ["temporary-file-2", "temporary-file-3"]
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "letter_of_recommendation": "temporary-file-1",
    "hr_documents": ["temporary-file-2", "temporary-file-3"]
  }
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "id": 1,
  "title": "200301_letter-of-recommendation.pdf",
  "fields": [
    {
      "field_id": 2,
      "slug": "letter_of_recommendation",
      "label": "Letter of recommendation",
      "type": "user",
      "field_type": "SINGLE_ATTACHMENT",
      "values": [
        {
          "value": {
            "id": 100,
            "filename": "200301_letter-of-recommendation.pdf",
            "size": 12300
          }
        }
      ]
    },
    {
      "field_id": 3,
      "slug": "hr_documents",
      "label": "HR Documents",
      "field_type": "MULTI_ATTACHMENT",
      "type": "user",
      "values": [
        {
          "value": {
            "user_id": 101,
            "mail": ["dan@tapeapp.com"],
            "image": null,
            "name": "Dan Jacob",
            "org_id": 1,
            "type": "user"
          }
        },
        {
          "value": {
            "user_id": 102,
            "mail": ["sierra@tapeapp.com"],
            "image": null,
            "name": "Sierra Johns",
            "org_id": 1,
            "type": "user"
          }
        }
      ]
    }
  ]
}
```

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A attachment field value can be retrieved as part of a record retrieval:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "id": 1,
  "title": "Zoe Maxwell",
  "fields": [
    {
      "field_id": 2,
      "slug": "letter_of_recommendation",
      "label": "Letter of recommendation",
      "type": "user",
      "field_type": "SINGLE_ATTACHMENT",
      "values": [
        {
          "value": {
            "user_id": 1,
            "mail": ["zoe@tapeapp.com"],
            "image": null,
            "name": "Zoe Maxwell",
            "org_id": 1,
            "type": "user"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "slug": "hr_documents",
      "label": "HR Documents",
      "field_type": "MULTI_ATTACHMENT",
      "type": "user",
      "values": [
        {
          "value": {
            "user_id": 101,
            "mail": ["dan@tapeapp.com"],
            "image": null,
            "name": "Dan Jacob",
            "org_id": 1,
            "type": "user"
          }
        },
        {
          "value": {
            "user_id": 102,
            "mail": ["sierra@tapeapp.com"],
            "image": null,
            "name": "Sierra Johns",
            "org_id": 1,
            "type": "user"
          }
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more attachment field values can be updated as part of a record update. Both existing IDs (integers) as well as temporary file IDs (strings) can be provided as input.
Here is an example request body for updating multiple attachment field values of a record:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1  \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "letter_of_recommendation": "temporary-file-2",
      "hr_documents": ["temporary-file-6", 102]
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "letter_of_recommendation": "temporary-file-2",
    "hr_documents": ["temporary-file-6", 102]
  }
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "id": 1,
  "title": "Delaney Beatty",
  "fields": [
    {
      "field_id": 2,
      "slug": "letter_of_recommendation",
      "label": "Letter of recommendation",
      "type": "user",
      "field_type": "SINGLE_ATTACHMENT",
      "values": [
        {
          "value": {
            "user_id": 2,
            "mail": ["delaney@tapeapp.com"],
            "image": null,
            "name": "Delaney Beatty",
            "org_id": 1,
            "type": "user"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "slug": "hr_documents",
      "label": "HR Documents",
      "field_type": "MULTI_ATTACHMENT",
      "type": "user",
      "values": [
        {
          "value": {
            "user_id": 102,
            "mail": ["sierra@tapeapp.com"],
            "image": null,
            "name": "Sierra Johns",
            "org_id": 1,
            "type": "user"
          }
        }
      ]
    }
  ]
}
```
