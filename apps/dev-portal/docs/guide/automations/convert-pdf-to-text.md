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

<MediaFrame><img src={AutomationPng} /></MediaFrame>

## Code Action

```ts
const { data } = await http.upload(
  'https://v2.convertapi.com/convert/pdf/to/txt?Secret=YOUR_SECRET_HERE',
  task_field_attachment_file_url
);

var_pdf_plaintext = Buffer.from(data.Files[0].FileData, 'base64');
```

# Example video

<MediaFrame>
<video width="100%" controls muted preload="metadata"  src={AutomationMp4}>
</video>
</MediaFrame>
