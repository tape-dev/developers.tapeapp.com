---
id: files
title: File
sidebar_label: File
---

import ApiKeyCodeblock from '@site/src/components/api-key-code-block/api-key-code-block.component';
import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A file is a container for data and primarily identified by its file name. A file could be a spreadsheet, an image, PDF, video, or just binary data. Tape supports various file formats to be attached to resources like records, comments and chat messages.

:::info
There are many reasons why a file upload via HTTP can fail (file too large, bad network connection, ...). To prevent critical operations like creating a record to fail due to an unsuccessful upload, attaching a file to a resource is a two-step process:

1. The file is uploaded to Tape and the server returns a unique file ID.
2. The file ID is used to attach the uploaded file to a resource (record, comment, ...).

:::

Files can be uploaded to Tape via the API by using the `multipart/form-data` HTTP content type. Once uploaded, file objects have a unique `id`, a `filename`, `mime_type`, `size` and `download_link`.
Files that are uploaded but not attached to a resource will be deleted automatically after 24 hours.

## Upload a file

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/file/upload" />

When uploading files to Tape, use the dedicated endpoint to create a temporary file reference first:

<Tabs>
<TabItem value="curl" label="cURL">
<ApiKeyCodeblock language="shell">
{`curl #BASE_URL/v1/file/upload \\
  -u #USER_API_KEY: \\
  -F 'file=@./filename.txt'
`}
</ApiKeyCodeblock>
</TabItem>

<TabItem value="http" label="HTTP">
<ApiKeyCodeblock language="http">
{`POST /v1/file/upload HTTP/1.1
Host: api.tapeapp.com
Authorization: Bearer #USER_API_KEY
Accept: */*
Content-Length: 20
Content-Type: multipart/form-data`}
</ApiKeyCodeblock>
</TabItem>
</Tabs>

You receive a file reference, that can then be used when creating or updating a resource. See the example below to attach a file to a single attachment field:

```json
{
  "id": 1,
  "filename": "filename.txt",
  "size": 20,
  "created_on": "2022-01-01 12:00:00",
  "download_url": "d8f205f4daaced0f3f714b5ebb76ad"
}
```

## Upload multiple files

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/file/upload" />

You can also upload multiple files at the same time by providing the `file` field multiple times:

<Tabs>
<TabItem value="curl" label="cURL">
<ApiKeyCodeblock language="shell">
{`curl #BASE_URL/v1/file/upload \\
  -u #USER_API_KEY: \\
  -F 'file=@./filename1.txt' \\
  -F 'file=@./filename2.txt'
`}
</ApiKeyCodeblock>
</TabItem>

<TabItem value="http" label="HTTP">
<ApiKeyCodeblock language="http">
{`POST /v1/file/upload HTTP/1.1
Host: api.tapeapp.com
Authorization: Bearer #USER_API_KEY
Accept: */*
Content-Length: 40
Content-Type: multipart/form-data`}
</ApiKeyCodeblock>
</TabItem>
</Tabs>

```json
[
  {
    "id": 2,
    "filename": "filename1.txt",
    "size": 20,
    "created_on": "2022-01-01 12:00:00",
    "download_url": "61bc95fa43c2bbef3e29a13bc3307d"
  },
  {
    "id": 3,
    "filename": "filename2.txt",
    "size": 20,
    "created_on": "2022-01-01 12:00:00",
    "download_url": "a0af01bf9c34413d15511608ec0e1d"
  }
]
```

## Upload limits

| Variable | Limit |
| :------- | :---- |
|          |       |
|          |       |
|          |       |

## Rate limit credits

File uploads are rate limited based on their filesize. For uploading multiple files, the sum of all filesizes is used. The filesize limit for a single file is 100MB. Uploading a file always cost 2x credits of a normal request. Uploading a file with the maximum filesize costs 4x credits. Uploading a file with half the maximum filesize costs 3x credits.

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
