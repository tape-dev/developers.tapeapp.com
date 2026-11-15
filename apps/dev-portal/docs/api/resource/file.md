---
id: file
title: File
sidebar_label: File
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Use these endpoints to upload files to Tape, so you can attach them to records, comments and emails.

A file can be a spreadsheet, an image, a PDF, a video or any other data. Tape identifies each uploaded file by its `file_id`.

:::info Which capability do I need?
All upload endpoints need `records:edit`. See [Capabilities](/docs/api/capabilities).
:::

:::info Why does uploading take two steps?
An upload can fail, for example because the file is too large or the network drops. So that this doesn't break a bigger operation like creating a record, attaching a file takes two steps:

1. Upload the file to Tape. The response contains a file ID.
2. Use the file ID to attach the file to a record, a comment or another resource.

To attach it to a record, send the file ID as the value of an [attachment field](/docs/api/resource/field-value/attachment#record-creation), for example `"fields": { "contract": "temporary-file-1" }`. On an existing record, also send the files to keep, because an [update](/docs/api/resource/field-value/attachment#record-update) replaces the field's files. Unlike the Podio API, Tape has no separate attach endpoint.
:::

Upload files with the `multipart/form-data` content type. Every uploaded file has a `file_id`, a `name`, a `size` and a `link`.

**General behavior**

- The `link` URL expires after some hours. After that, you can't download the file through it. Retrieve the record that holds the file again to get a new `link`.
- Once you attach an uploaded file to a resource, you can retrieve it only through that resource.
- Tape deletes uploaded files that you don't attach within 24 hours.
- Upload responses have no [thumbnail](#thumbnails) yet, also not for an image. `thumbnail` is missing or `null` there.

## Upload a file

Use this endpoint to upload one file.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/file/upload" />

Send the file in the form field `file`.

<Tabs>
<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title="Request">
{`curl #BASE_URL/v1/file/upload \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -F 'file=@./filename.txt'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="http" label="HTTP">
<ContextCodeBlock language="http" title="Request">
{`POST /v1/file/upload HTTP/1.1
Host: api.tapeapp.com
Authorization: Bearer $TAPE_TOKEN
Accept: */*
Content-Length: 20
Content-Type: multipart/form-data`}
</ContextCodeBlock>
</TabItem>
</Tabs>

The response has status `201` and is a file object:

```json title="Response"
{
  "file_id": "temporary-file-1",
  "name": "filename.txt",
  "size": 20,
  "mimetype": "text/plain",
  "created_on": "2022-01-01 12:00:00",
  "created_on_utc": "2022-01-01 11:00:00",
  "link": "https://s3.eu-central-1.amazonaws.com/tape-attachments/9d43730ffad8d249e3ac313193cd83?Expires=1648134130&Signature=VzrbvlfI35hp4iU7jMa%2BK%2FnutPU%3D"
}
```

:::info Why is the response an object, not an array?
The request contained one file. For one file, the response is a single file object. With more than one file, it's an array.
:::

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

## Upload multiple files

Use this endpoint to upload several files in one request.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/file/upload" />

Repeat the form field `file` once per file.

<Tabs>
<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title="Request">
{`curl #BASE_URL/v1/file/upload \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -F 'file=@./filename1.txt' \\
  -F 'file=@./filename2.txt'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="http" label="HTTP">
<ContextCodeBlock language="http" title="Request">
{`POST /v1/file/upload HTTP/1.1
Host: api.tapeapp.com
Authorization: Bearer $TAPE_TOKEN
Accept: */*
Content-Length: 40
Content-Type: multipart/form-data`}
</ContextCodeBlock>
</TabItem>
</Tabs>

The response is an array of file objects:

```json title="Response"
[
  {
    "file_id": "temporary-file-2",
    "name": "filename1.txt",
    "size": 20,
    "mimetype": "text/plain",
    "created_on": "2022-01-01 12:00:00",
    "created_on_utc": "2022-01-01 11:00:00",
    "link": "https://s3.eu-central-1.amazonaws.com/tape-attachments/d429d8095b14a641f05a1a45e946c9?Expires=1648134279&Signature=5fS7eq7HVBXNauF94KpejfIZbjo%3D"
  },
  {
    "file_id": "temporary-file-3",
    "name": "filename2.txt",
    "size": 20,
    "mimetype": "text/plain",
    "created_on": "2022-01-01 12:00:00",
    "created_on_utc": "2022-01-01 11:00:00",
    "link": "https://s3.eu-central-1.amazonaws.com/tape-attachments/fab57aefe677c3c07c6e6425c441cf?Expires=1648134325&Signature=Zx1ENKO%2FcHOqvAJSOYzv7Dta%2F1U%3D"
  }
]
```

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

## Create a signed upload URL

Use this endpoint to get a URL that accepts one upload without your credential.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/file/upload/url" />

Use it when the client that sends the file can't hold your credential, for example an agent that works through an MCP client.

<ContextCodeBlock language="shell" title="Request">
{`curl -X POST #BASE_URL/v1/file/upload/url \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

```json title="Response"
{
  "upload_url": "https://api.tapeapp.com/v1/file/upload/signed?token=eyJhbGciOiJIUzI1NiJ9...",
  "expires_at": "2022-01-01T12:00:00.000Z",
  "method": "POST",
  "content_type": "multipart/form-data",
  "form_field_name": "file"
}
```

The example leaves out `max_file_size_bytes` and `max_files_per_request`.

Send the file to `upload_url` as `multipart/form-data`, in the form field `form_field_name`. Don't send an `Authorization` header. The response is the same file object as in [Upload a file](#upload-a-file).

**Key fields**

- `upload_url`: the URL for the upload. It contains a token and works for one request. A second upload to it returns `400` with `Invalid or expired upload ticket`.
- `expires_at`: the upload must start before this time, in UTC (ISO 8601).
- `max_file_size_bytes` and `max_files_per_request`: the upload limits. Read them from the response instead of hard-coding them.

:::caution Can I log or store the URL?
No. Anyone with the URL can upload one file in your name until it expires. Treat it like a credential.
:::

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

## Thumbnails

Tape tries to create thumbnail images in several sizes for each uploaded file. Use them for profile pictures, file previews and similar places:

- `small`: JPG, 100px wide and 100px high
- `medium`: JPG, 200px wide and 200px high
- `large`: JPG in the original width and height of the image

An example thumbnail object:

```json
{
  "small": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/def09e9319ca30e9ab2bc13e061982",
  "medium": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/82f3c2669deca95c16d1ad955734e0",
  "large": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/f8f105f4daaced0f3f714b5ebb76ae"
}
```

## Upload limits

Tape enforces these limits for all upload endpoints:

| Variable | Limit |
| :-- | :-- |
| Maximum file size | 100MB |

## Rate limit credits

The credits of an upload depend on the file size, added up over all files of a request. An upload costs at least 2x the credits of a normal request. A file of 50MB costs 3x credits, a file of 100MB costs 4x credits:

```
Uploading 1KB: 2x credits
Uploading 50MB: 3x credits
Uploading 100MB: 4x credits
Uploading 150MB: 5x credits
Uploading 200MB: 6x credits
Uploading 300MB: 8x credits
...
```

Uploading several files in one request costs fewer credits than uploading each file on its own.

## Validation errors

Tape returns a detailed error message for most failed uploads.

```json title="No file provided validation error"
{
  "status_code": 400,
  "endpoint": "/v1/file/upload",
  "error_code": "validation",
  "error_message": "No file provided to upload endpoint via multipart/form-data field name: 'file'"
}
```

## Next steps

- [Attachment field value](/docs/api/resource/field-value/attachment): attach an uploaded file to a record.
- [Record comment](/docs/api/resource/record-comment#create-a-record-comment): attach an uploaded file to a comment.
- [Email](/docs/api/resource/email): send an uploaded file as an email attachment.
- [Request limits](/docs/api/request-limits): how credits work.
- [Capabilities](/docs/api/capabilities): what `records:edit` allows.
