---
id: attachment
title: Attachment Field Value
sidebar_label: Attachment
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

An attachment field value consists of its `value` property which holds a reference to an attachment. An attachment has the properties `id` (unique ID), `filename` (the filename), `size` (filesize in bytes), `download_url` (URL to download the file) and others.
A `single_attachment` field value holds at most one attachment reference while a `multi_attachment` field value can hold multiple attachment references.

Attachment fields behave quite similarly to [image fields](/docs/api/resource/field-value/image), also allowing non-image files.

More details on the file object and the two-step file upload process can be found [here](/docs/api/resource/file).

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A attachment field value can be created as part of a record creation. Files can be specified as temporary file IDs (strings), existing file IDs of the same field (integers) and existing file IDs of different Attachment or Image fields (integers). Here is an example request body for creating a record with a value for the "Letter of recommendation" field with ID 2, type `single_attachment` and external ID `letter_of_recommendation` and a value for the "HR documents" field with ID 3, type `multi_attachment` and external ID `hr_documents`:

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
  "record_id": 1,
  "title": "200301_letter-of-recommendation.pdf",
  "fields": [
    {
      "field_id": 2,
      "external_id": "letter_of_recommendation",
      "label": "Letter of recommendation",
      "type": "attachment",
      "field_type": "single_attachment",
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
      "external_id": "hr_documents",
      "label": "HR Documents",
      "field_type": "multi_attachment",
      "type": "attachment",
      "values": [
        {
          "value": {
            "id": 101,
            "filename": "200301_hr_document-1.pdf",
            "size": 15000
          }
        },
        {
          "value": {
            "id": 102,
            "filename": "200301_hr_document-2.pdf",
            "size": 16000
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
  "record_id": 1,
  "title": "200301_letter-of-recommendation.pdf",
  "fields": [
    {
      "field_id": 2,
      "external_id": "letter_of_recommendation",
      "label": "Letter of recommendation",
      "type": "attachment",
      "field_type": "single_attachment",
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
      "external_id": "hr_documents",
      "label": "HR Documents",
      "field_type": "multi_attachment",
      "type": "attachment",
      "values": [
        {
          "value": {
            "id": 101,
            "filename": "200301_hr_document-1.pdf",
            "size": 15000
          }
        },
        {
          "value": {
            "id": 102,
            "filename": "200301_hr_document-2.pdf",
            "size": 16000
          }
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more attachment field values can be updated as part of a record update. Existing IDs of the same field (integers), existing IDs of different Attachment or Image fields (integers) as well as temporary file IDs (strings) can be provided as input.
Here is an example request body for updating multiple attachment field values of a record:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1 \\
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
  "record_id": 1,
  "title": "200301_letter-of-recommendation.pdf",
  "fields": [
    {
      "field_id": 2,
      "external_id": "letter_of_recommendation",
      "label": "Letter of recommendation",
      "type": "attachment",
      "field_type": "single_attachment",
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
      "external_id": "hr_documents",
      "label": "HR Documents",
      "field_type": "multi_attachment",
      "type": "attachment",
      "values": [
        {
          "value": {
            "id": 101,
            "filename": "200301_hr_document-1.pdf",
            "size": 15000
          }
        },
        {
          "value": {
            "id": 102,
            "filename": "200301_hr_document-2.pdf",
            "size": 16000
          }
        }
      ]
    }
  ]
}
```
