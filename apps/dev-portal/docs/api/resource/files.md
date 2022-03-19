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

## Uploading Files

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
Content-Length: 123
Content-Type: multipart/form-data`}
</ApiKeyCodeblock>
</TabItem>
</Tabs>

You receive a file reference, that can then be used when creating or updating a resource. See below exaple to attach a file to a single attachment field:

```json
{
  "temporaryFileId": "12341234-12341234-12341234",
  "size": 1024,
  "downloadUrl": "https://files.tapeapp.com/4312sadfdsa41sdfsdaf324324321413243asfsdf"
}
```
