---
id: convert-pdf-to-text
title: Convert a PDF file to text
---

import AutomationPng from '@site/static/img/guide/automations/convert-pdf-to-text.png';
import ImageFrame from '@site/src/components/image-frame/image-frame.component';

## Automation

<ImageFrame><img src={AutomationPng}  /></ImageFrame>

## Code Action

```ts
const { data } = await http.upload(
  'https://v2.convertapi.com/convert/pdf/to/txt?Secret=YOUR_SECRET_HERE',
  task_field_attachment_file_url
);

var_pdf_plaintext = Buffer.from(data.Files[0].FileData, 'base64');
```
