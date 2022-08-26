---
id: image
title: Image Field Value
sidebar_label: Image
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

An image field value consists of its `value` property which holds a reference to an image. An image has the properties `id` (unique ID), `filename` (the filename), `size` (filesize in bytes), `download_url` (URL to download the file) and others. Right now, there is only a `multi_image` field, where the value can hold multiple image references.

Image fields behave quite similarly to [attachment fields](/docs/api/resource/field-value/attachment), allowing only image files.

More details on the file object and the two-step file upload process can be found [here](/docs/api/resource/file).

## Record creation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

A image field value can be created as part of a record creation. Files can be specified as temporary file IDs (strings), existing file IDs of the same field (integers) and existing file IDs of different Attachment or Image fields (integers). Existing files of Attachment fields can only be used as inputs to the image field, in case the files are of type `jpeg`, `jpg`, `png`, `gif`, `tiff`, `svg`, `bmp` or `webp`.
Here is an example request body for creating a record with a value for the "Recruting Photos" field with ID 3, type `multi_image` and external ID `recruiting_photos`:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/record/app/1 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "recruiting_photos": ["temporary-file-2", "temporary-file-3"]
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "recruiting_photos": ["temporary-file-2", "temporary-file-3"]
  }
}
```

</TabItem>
</Tabs>

```json title="⬅️      Response"
{
  "record_id": 1,
  "title": "200301_recruiting_photo_1.jpeg",
  "fields": [
    {
      "field_id": 3,
      "external_id": "recruiting_photos",
      "label": "Recruiting Photos",
      "field_type": "multi_image",
      "type": "image",
      "values": [
        {
          "value": {
            "id": 100,
            "filename": "200301_recruiting_photo_1.jpeg",
            "size": 12300
          }
        },
        {
          "value": {
            "id": 101,
            "filename": "200301_recruiting_photo_2.jpeg",
            "size": 11300
          }
        }
      ]
    }
  ]
}
```

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A image field value can be retrieved as part of a record retrieval:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "200301_recruiting_photo_1.jpeg",
  "fields": [
    {
      "field_id": 3,
      "external_id": "recruiting_photos",
      "label": "Recruiting Photos",
      "field_type": "multi_image",
      "type": "image",
      "values": [
        {
          "value": {
            "id": 100,
            "filename": "200301_recruiting_photo_1.jpeg",
            "size": 12300
          }
        },
        {
          "value": {
            "id": 101,
            "filename": "200301_recruiting_photo_2.jpeg",
            "size": 11300
          }
        }
      ]
    }
  ]
}
```

## Record update

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

One or more image field values can be updated as part of a record update. Both existing IDs (integers) as well as temporary file IDs (strings) can be provided as input. Existing IDs of the same field (integers), existing IDs of different Attachment or Image fields (integers) as well as temporary file IDs (strings) can be provided as input. Existing files of Attachment fields can only be used as inputs to the image field, in case the files are of type `jpeg`, `jpg`, `png`, `gif`, `tiff`, `svg`, `bmp` or `webp`.
Here is an example request body for updating multiple image field values of a record:

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "letter_of_recommendation": "temporary-file-2",
      "recruiting_photos": ["temporary-file-6", 102]
    }
  }' 
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request">
{
  "fields": {
    "recruiting_photos": ["temporary-file-6", 102]
  }
}
```

</TabItem>
</Tabs>

```json title='⬅️      Response'
{
  "record_id": 1,
  "title": "200301_recruiting_photo_1.jpeg",
  "fields": [
    {
      "field_id": 3,
      "external_id": "recruiting_photos",
      "label": "Recruiting Photos",
      "field_type": "multi_image",
      "type": "image",
      "values": [
        {
          "value": {
            "id": 100,
            "filename": "200301_recruiting_photo_1.jpeg",
            "size": 12300
          }
        },
        {
          "value": {
            "id": 101,
            "filename": "200301_recruiting_photo_2.jpeg",
            "size": 11300
          }
        }
      ]
    }
  ]
}
```
