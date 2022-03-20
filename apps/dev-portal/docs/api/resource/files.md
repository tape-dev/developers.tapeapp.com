---
id: files
title: File
sidebar_label: File
---

import ApiKeyCodeblock from '@site/src/components/api-key-code-block/api-key-code-block.component';
import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Files have a name, a mime-type, a size and a download link.
Since most files are binary, use `multipart/form-data` instead of JSON when uploading files.

## Uploading a file

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

## Upload multiple files at once

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/file/upload" />

You can also upload multiple files at the same time by providing the `file` parameter:

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

```json title="No file provided validation error"
{
  "status_code": 400,
  "endpoint": "/v1/file/upload",
  "error_code": "validation",
  "error_message": "No file provided to upload endpoint '/v1/file/upload/' via multipart/form-data name: 'file'"
}
```
