---
id: file
title: File
sidebar_label: File
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A file is a container for data and primarily identified by its file name. A file could be a spreadsheet, an image, PDF, video, or just binary data. Tape supports various file formats to be attached to resources like records, comments and chat messages.

:::info
There are many reasons why a file upload via HTTP can fail (file too large, bad network connection, ...). To prevent critical operations like creating a record to fail due to an unsuccessful upload, attaching a file to a resource is a two-step process:

1. The file is uploaded to Tape and the server returns a unique file ID.
2. The file ID is used to attach the uploaded file to a resource (record, comment, ...).

:::

Files can be uploaded to Tape via the API by using the `multipart/form-data` HTTP content type. Once uploaded, file objects have a unique `id`, a `filename`, `size` and `download_url`.
Files that are uploaded but not attached to a resource will be deleted automatically after 24 hours.

## Upload a file

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/file/upload" />

A single file can be uploaded via the `/file/upload` endpoint via the `file` field:

<Tabs>
<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell"  title="➡️      Request">
{`curl #BASE_URL/v1/file/upload \\
  -u #USER_API_KEY: \\
  -F 'file=@./filename.txt'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="http" label="HTTP">
<ContextCodeBlock language="http"  title="➡️      Request">
{`POST /v1/file/upload HTTP/1.1
Host: api.tapeapp.com
Authorization: Bearer #USER_API_KEY
Accept: */*
Content-Length: 20
Content-Type: multipart/form-data`}
</ContextCodeBlock>
</TabItem>
</Tabs>

The response will be a file object containing information of the uploaded file:

```json title="⬅️      Response"
{
  "id": "temporary-file-1",
  "filename": "filename.txt",
  "size": 20,
  "created_on": "2022-01-01 12:00:00",
  "download_url": "https://s3.eu-central-1.amazonaws.com/tape-attachments/9d43730ffad8d249e3ac313193cd83?Expires=1648134130&Signature=VzrbvlfI35hp4iU7jMa%2BK%2FnutPU%3D",
  "thumbnail": {
    "small": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/def09e9319ca30e9ab2bc13e061982",
    "medium": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/82f3c2669deca95c16d1ad955734e0",
    "large": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/f8f105f4daaced0f3f714b5ebb76ae"
  }
}
```

The `thumbnail` property is optional and will only be available in case a [thumbnail](#thumbnails) could be generated for the uploaded file (e.g., if it is an image).

## Upload multiple files

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/file/upload" />

Multiple files can be uploaded at the same time via the `/file/upload` endpoint by providing the `file` field multiple times:

<Tabs>
<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title="➡️      Request">
{`curl #BASE_URL/v1/file/upload \\
  -u #USER_API_KEY: \\
  -F 'file=@./filename1.txt' \\
  -F 'file=@./filename2.txt'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="http" label="HTTP">
<ContextCodeBlock language="http"  title="➡️      Request">
{`POST /v1/file/upload HTTP/1.1
Host: api.tapeapp.com
Authorization: Bearer #USER_API_KEY
Accept: */*
Content-Length: 40
Content-Type: multipart/form-data`}
</ContextCodeBlock>
</TabItem>
</Tabs>

The response will be an array of file objects containing information of the uploaded files:

```json title="⬅️      Response"
[
  {
    "id": "temporary-file-2",
    "filename": "filename1.txt",
    "size": 20,
    "created_on": "2022-01-01 12:00:00",
    "download_url": "https://s3.eu-central-1.amazonaws.com/tape-attachments/d429d8095b14a641f05a1a45e946c9?Expires=1648134279&Signature=5fS7eq7HVBXNauF94KpejfIZbjo%3D"
  },
  {
    "id": "temporary-file-3",
    "filename": "filename2.txt",
    "size": 20,
    "created_on": "2022-01-01 12:00:00",
    "download_url": "https://s3.eu-central-1.amazonaws.com/tape-attachments/fab57aefe677c3c07c6e6425c441cf?Expires=1648134325&Signature=Zx1ENKO%2FcHOqvAJSOYzv7Dta%2F1U%3D",
    "thumbnail": {
      "small": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/def09e9319ca30e9ab2bc13e061982",
      "medium": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/82f3c2669deca95c16d1ad955734e0",
      "large": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/f8f105f4daaced0f3f714b5ebb76ae"
    }
  }
]
```

The `thumbnail` property is optional and will only be available in case a [thumbnail](#thumbnails) could be generated for the uploaded file (e.g., if it is an image).

If you intended to upload multiple files but only provided one, you receive a single file object instead of an array. The API will always return a file object if only one file was uploaded and an array of file objects if more than one file was uploaded.

## Thumbnails

Tape tries to generate thumbnail images for uploaded files in multiple sizes. Thumbnails are optimized for displaying them as a user avatar, a file thumbnail or something similar. Thumbnails will be available in different sizes depending on their use:

- `small`: JPG with 100px width and 100px height
- `medium`: JPG with 200px width and 200px height
- `large`: JPG with the image's original width and height

An example thumbnail object:

```json
{
  "small": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/def09e9319ca30e9ab2bc13e061982",
  "medium": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/82f3c2669deca95c16d1ad955734e0",
  "large": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/f8f105f4daaced0f3f714b5ebb76ae"
}
```

## Upload limits

The following limits are enforced for all file upload enpoints:

| Variable          | Limit |
| :---------------- | :---- |
| Maximum file size | 100MB |

## Rate limit credits

File uploads are rate limited based on their filesize. For uploading multiple files, the sum of all filesizes is used. The filesize limit for a single file is 100MB. Uploading a file always cost 2x credits of a normal request. Uploading a file with the maximum filesize costs 4x credits. Uploading a file with half of the maximum file size costs 3x credits:

```
Uploading 1KB: 2x credits
Uploading 50MB: 3x credits
Uploading 100MB: 4x credits
Uploading 150MB: 5x credits
Uploading 200MB: 6x credits
Uploading 300MB: 8x credits
...
```

As you can see, uploading multiple files at once costs less credits than uploading every file individually.

## Validation errors

A lot can go wrong when uploading files via HTTP. Tape handles most error cases and returns detailed error messages.

```json title="No file provided validation error"
{
  "status_code": 400,
  "endpoint": "/v1/file/upload",
  "error_code": "validation",
  "error_message": "No file provided to upload endpoint '/v1/file/upload/' via multipart/form-data name: 'file'"
}
```
