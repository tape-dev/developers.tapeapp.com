---
id: files
title: Files
sidebar_label: Files
---

import ApiKeyCodeblock from '@site/src/components/api-key-code-block/api-key-code-block.component';
import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Files have a name, a mime-type, a size and a download link.
Since most files are binary, use `multipart/form-data` instead of JSON when uploading files.

## Uploading a file

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/upload" />

When uploading files to Tape, use the dedicated endpoint to create a temporary file reference first:

<Tabs>
<TabItem value="curl" label="cURL">
<ApiKeyCodeblock language="shell">
{`curl #BASE_URL/v1/upload \\
  -u #USER_API_KEY: \\
  -F 'file=@./filename.txt'
`}
</ApiKeyCodeblock>
</TabItem>

<TabItem value="http" label="HTTP">
<ApiKeyCodeblock language="http">
{`POST /v1/upload HTTP/1.1
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

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/upload" />

You can also upload multiple files at the same time by providing the `file` parameter:

<Tabs>
<TabItem value="curl" label="cURL">
<ApiKeyCodeblock language="shell">
{`curl #BASE_URL/v1/upload \\
  -u #USER_API_KEY: \\
  -F 'file=@./filename1.txt' \\
  -F 'file=@./filename2.txt'
`}
</ApiKeyCodeblock>
</TabItem>

<TabItem value="http" label="HTTP">
<ApiKeyCodeblock language="http">
{`POST /v1/upload HTTP/1.1
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

## Rate limit credits

Uploading a file takes 3 times the credits of a normal request. As uploading multiple files at the same time allows for more efficient processing, every consecutive upload will only take 2 times the credits of a normal request.

```
Uploading 1 file: 3x credits
Uploading 2 files: 3x credits + 2x credits
Uploading 3 files: 3x credits + 2x credits + 2x credits
...
```

## Upload limits

| Variable | Limit |
| :------- | :---- |
|          |       |
|          |       |
|          |       |

## Validation errors

```json title="No file provided validation error"
{
  "status_code": 400,
  "endpoint": "/v1/upload",
  "error_code": "validation",
  "error_message": "No file provided to upload endpoint '/v1/upload/' via multipart/form-data name: 'file'"
}
```
