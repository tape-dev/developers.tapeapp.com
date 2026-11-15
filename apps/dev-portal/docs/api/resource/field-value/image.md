---
id: image
title: Image field value
sidebar_label: Image
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use an image field value to read and write the images of a record.

Each value of an [image field](/docs/api/resource/field/image) is one image. The `multi_image` field holds one or more images. Image fields work like [attachment fields](/docs/api/resource/field-value/attachment), but accept only images.

```json title="Image field value object"
{
  "field_id": 3,
  "external_id": "photos",
  "label": "Photos",
  "type": "file",
  "field_type": "multi_image",
  "values": [
    {
      "value": {
        "file_id": 100,
        "name": "living-room.jpg",
        "size": 412000,
        "mimetype": "image/jpeg",
        "download_url": "https://s3.eu-central-1.amazonaws.com/tape-attachments/4be1c09a7d2f8e63b5a0f1d29c7e48?Expires=1772442000&Signature=VzrbvlfI35hp4iU7jMa%2BK%2FnutPU%3D",
        "view_url": "https://s3.eu-central-1.amazonaws.com/tape-attachments/4be1c09a7d2f8e63b5a0f1d29c7e48?Expires=1772442000&Signature=Hk2c8vQx1pLm9sTnW4yR%2FaB7dEo%3D",
        "link": "https://s3.eu-central-1.amazonaws.com/tape-attachments/4be1c09a7d2f8e63b5a0f1d29c7e48?Expires=1772442000&Signature=VzrbvlfI35hp4iU7jMa%2BK%2FnutPU%3D",
        "thumbnail": "5501",
        "created_by": null,
        "created_on": "2026-03-02 09:15:00",
        "created_on_utc": "2026-03-02 08:15:00",
        "last_modified_on": "2026-03-02 09:15:00",
        "last_modified_on_utc": "2026-03-02 08:15:00"
      }
    }
  ]
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"file"` for the image field. | `"file"` |
| `field_type` | `string` | `"multi_image"`. | `"multi_image"` |
| `values[].value.file_id` | `number` | ID of the image in this field. | `100` |
| `values[].value.name` | `string` | File name. | `"living-room.jpg"` |
| `values[].value.size` | `number` | File size in bytes. | `412000` |
| `values[].value.mimetype` | `string` | Media type of the image. | `"image/jpeg"` |
| `values[].value.download_url` | `string` | Signed URL that downloads the image. | |
| `values[].value.view_url` | `string` | Signed URL that opens the image in the browser. | |
| `values[].value.link` | `string` | Same as `download_url`, for older integrations. Use `download_url` instead. | |
| `values[].value.thumbnail` | `string` | ID of the image's thumbnail. Appears only if Tape created a thumbnail. | `"5501"` |
| `values[].value.created_by` | `null` | Not filled. The value is `null`. | `null` |
| `values[].value.created_on` | `string` | When the image was added, in your timezone. | `"2026-03-02 09:15:00"` |
| `values[].value.created_on_utc` | `string` | When the image was added, in UTC. | `"2026-03-02 08:15:00"` |
| `values[].value.last_modified_on` | `string` | When the image last changed, in your timezone. | `"2026-03-02 09:15:00"` |
| `values[].value.last_modified_on_utc` | `string` | When the image last changed, in UTC. | `"2026-03-02 08:15:00"` |

The signed URLs expire after some hours. Retrieve the record again to get new ones.

Each field in a record response also contains the field's `config`. The examples on this page leave it out. They also shorten each image to `file_id`, `name`, `size` and `mimetype`.

## Record creation

Use the [create record endpoint](/docs/api/resource/record#create-a-record) to add images to a new record.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

First, [upload the images](/docs/api/resource/file#upload-a-file). Each upload returns a temporary file ID like `temporary-file-1`. Then send these IDs in the field value.

The example creates the property "12 Harbor View, Unit 4" and sets the "Photos" field (ID `3`, type `multi_image`, slug `photos`).

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/record/app/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "name": "12 Harbor View, Unit 4",
      "photos": ["temporary-file-1", "temporary-file-2"]
    }
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "fields": {
    "name": "12 Harbor View, Unit 4",
    "photos": ["temporary-file-1", "temporary-file-2"]
  }
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "record_id": 1,
  "title": "12 Harbor View, Unit 4",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "12 Harbor View, Unit 4" }]
    },
    {
      "field_id": 3,
      "external_id": "photos",
      "label": "Photos",
      "type": "file",
      "field_type": "multi_image",
      "values": [
        {
          "value": {
            "file_id": 100,
            "name": "living-room.jpg",
            "size": 412000,
            "mimetype": "image/jpeg"
          }
        },
        {
          "value": {
            "file_id": 101,
            "name": "kitchen.jpg",
            "size": 388000,
            "mimetype": "image/jpeg"
          }
        }
      ]
    }
  ]
}
```

**General behavior**

- Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
- A field value accepts these file IDs:
  - Temporary file IDs from your own uploads, like `"temporary-file-1"`.
  - File IDs of comment and reply attachments, like `"comment-file-12"` or `"reply-file-7"`. See [Record comment](/docs/api/resource/record-comment).
  - The `file_id` of a file in another image or attachment field, as a number. Tape copies the file, and the copy gets a new `file_id`.
- Tape also accepts objects like `{ "file_id": "temporary-file-1" }` or `{ "value": "temporary-file-1" }`, and arrays of these.
- Tape accepts images of type `jpeg`, `jpg`, `png`, `gif`, `tiff`, `bmp` and `webp`. It also accepts the media type `image/svg`, but not `image/svg+xml`, the usual type of SVG files.
- Tape skips files from attachment fields that aren't images.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- An uploaded file or a comment or reply attachment that isn't an image returns `400`.
- A temporary file ID that you didn't upload yourself returns `403`.

See [Errors](/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](/docs/api/resource/record#retrieve-a-record) to read the images of a record.

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

```json title='Response'
{
  "record_id": 1,
  "title": "12 Harbor View, Unit 4",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "12 Harbor View, Unit 4" }]
    },
    {
      "field_id": 3,
      "external_id": "photos",
      "label": "Photos",
      "type": "file",
      "field_type": "multi_image",
      "values": [
        {
          "value": {
            "file_id": 100,
            "name": "living-room.jpg",
            "size": 412000,
            "mimetype": "image/jpeg"
          }
        },
        {
          "value": {
            "file_id": 101,
            "name": "kitchen.jpg",
            "size": 388000,
            "mimetype": "image/jpeg"
          }
        }
      ]
    }
  ]
}
```

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](/docs/api/resource/record#update-a-record) to change the images of a record.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

The example adds a new upload to the "Photos" field of the property with ID `1` and keeps the image with ID `101`. The image with ID `100` isn't in the request, so Tape removes it from the field.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X PUT #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "photos": ["temporary-file-3", 101]
    }
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "fields": {
    "photos": ["temporary-file-3", 101]
  }
}
```

</TabItem>
</Tabs>

```json title='Response'
{
  "record_id": 1,
  "title": "12 Harbor View, Unit 4",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "12 Harbor View, Unit 4" }]
    },
    {
      "field_id": 3,
      "external_id": "photos",
      "label": "Photos",
      "type": "file",
      "field_type": "multi_image",
      "values": [
        {
          "value": {
            "file_id": 101,
            "name": "kitchen.jpg",
            "size": 388000,
            "mimetype": "image/jpeg"
          }
        },
        {
          "value": {
            "file_id": 102,
            "name": "terrace.jpg",
            "size": 455000,
            "mimetype": "image/jpeg"
          }
        }
      ]
    }
  ]
}
```

**General behavior**

- The images in the request replace the old images. To keep an image, send its `file_id` again. An image that's already in the field keeps its `file_id`.
- Tape lists the images in the order they were added, not in the order of the request. A kept image comes before a new one.
- To clear the field, send `null` or an empty array `[]`.
- You can't clear a required field. The request returns `400`.
- Fields that aren't in the request keep their values.

```json title="Request: clear the field"
{
  "fields": {
    "photos": null
  }
}
```

A cleared field isn't in the `fields` of the response.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

Same errors as under [Record creation](#record-creation). An update also returns this error:

- A numeric `file_id` that isn't a positive whole number, like `1.5`, returns `400` with `validation` and the message `… Expected a valid existing image ID …`. A number in a string, like `"100"`, returns the same error.

See [Errors](/docs/api/errors) for all error codes.

## Next steps

- [Image field](/docs/api/resource/field/image): create and change image fields.
- [File](/docs/api/resource/file): upload images and get temporary file IDs.
- [Attachment field value](/docs/api/resource/field-value/attachment): store files of any type in a record.
- [Field value](/docs/api/resource/field-value/overview): how all field values work.
- [Record](/docs/api/resource/record): create, read, update and delete records.
