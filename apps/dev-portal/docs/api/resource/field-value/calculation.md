---
id: calculation
title: Calculation Field Value
sidebar_label: Calculation
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A calculation field value consists of its `value` property of type `string`. The value is a decimal like `1`, `1.0` or `1.5`.

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
  "title": "10",
  "fields": [
    {
      "field_Id": 2,
      "external_id": "salary",
      "type": "calculation",
      "field_type": "NUMBER",
      "label": "Salary",
      "values": [{ "value": 10 }]
    }
  ]
}
```
