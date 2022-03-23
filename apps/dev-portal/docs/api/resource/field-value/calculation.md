---
id: calculation
title: Calculation Field Value
sidebar_label: Calculation
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A calculation field value consists of its `value` property of type `string` or `number`. The value can be a plaintext string (`'Example text'`), a rich-text string containing Markdown/ HTML (`'# <span style="color: red">Red</span> Headline'`) or a number (`123.456`)

Calculation field values are always calculated by the server and therefore cannot be provided to record creation or update endpoints.

## Record retrieval

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

A calculation field value can be retrieved as part of a record retrieval:

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title='⬅️      Response'
{
  "id": 1,
  "title": "12 days",
  "fields": [
    {
      "field_Id": 2,
      "external_id": "vacation_days",
      "type": "calculation",
      "field_type": "CALCULATION",
      "label": "Vacation days left",
      "values": [{ "value": 12 }]
    }
  ]
}
```
