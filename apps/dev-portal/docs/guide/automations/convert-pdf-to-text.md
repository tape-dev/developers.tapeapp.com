---
id: convert-pdf-to-text
title: Convert a PDF file to text
---

import AutomationPng from '@site/static/guide/automations/convert-pdf-to-text.png';
import AutomationMp4 from '@site/static/guide/automations/convert-pdf-to-text-record.mp4';
import MediaFrame from '@site/src/components/media-frame/media-frame.component';

Working with files is important.
Tape allows you to work with files with ease
The `http.upload` function can upload a file (specified by its URL) to the given endpoint.

## Automation

The automation consists of the following steps:

1. Trigger when a new task record is created.
2. Only continue if the created task has an attachment.
3. Use the script action to send the attached file to a conversion API service via the `http.upload` function.
4. Process the HTTP response (it is base64 encoded so we decode it using `Buffer.from`) and store the result in our custom variable **PDF plaintext**
5. Update the created task's description with the content of the **PDF plaintext** variable

<MediaFrame><img src={AutomationPng} /></MediaFrame>

## Code Action

```ts
const { data } = await http.upload(
  'https://v2.convertapi.com/convert/pdf/to/txt?Secret=YOUR_SECRET_HERE',
  task_field_attachment_file_url
);

var_pdf_plaintext = Buffer.from(data.Files[0].FileData, 'base64');
```

## Demo Record Video

<MediaFrame>
<video width="100%" controls muted preload="metadata"  src={AutomationMp4}>
</video>
</MediaFrame>
