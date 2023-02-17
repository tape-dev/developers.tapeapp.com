---
id: filter
title: filter
sidebar_label: Filter
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Filters are used to filter Records in an App. They can be provided when retrieving Records with one of the following endpoints:

Retrieve filtered Records for an App: [Get filtered Records](record#retrieve-filtered-Records-for-an-app)

## Single Text

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single Text Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "SINGLE_TEXT",
      "match_type": "contains",
      "values": [
        {
          "value": "John"
        }
      ],
      "type": "text"
    }
  ]
}
```

</TabItem>
</Tabs>

The following `match_type` values are supported for `SINGLE_TEXT` fields:

|   Match type   | Description                                                                                                                                                                                                                 |
| :------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `equal`     | Matches all records whose field value is equal to the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` is equal to `"john doe"`                                                  |
|  `not_equal`   | Matches all records whose field value is not equal to the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` is equal to `"john doe"`, `"johnny doe"` is not equal to `"john doe"` |
|   `contains`   | Matches all records whose field value contains the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` contains `"doe"`                                                             |
| `not_contains` | Matches all records whose field value does not contain the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` does not contain `"Johnny"`                                          |
|    `empty`     | Matches all records whose field value is empty                                                                                                                                                                              |
|  `not_empty`   | Matches all records whose field value is not empty                                                                                                                                                                          |

## Multi Text

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Text Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "MULTI_TEXT",
      "match_type": "contains",
      "values": [
        {
          "value": "John"
        }
      ],
      "type": "text"
    }
  ]
}
```

</TabItem>
</Tabs>

The following `match_type` values are supported for `MULTI_TEXT` fields:

|   Match type   | Description                                                                                                                                                                                                                             |
| :------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `equal`     | Matches all records whose unformatted field value is equal to the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` is equal to `"john doe"`                                                  |
|  `not_equal`   | Matches all records whose unformatted field value is not equal to the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` is equal to `"john doe"`, `"johnny doe"` is not equal to `"john doe"` |
|   `contains`   | Matches all records whose unformatted field value contains the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` contains `"doe"`                                                             |
| `not_contains` | Matches all records whose unformatted field value does not contain the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` does not contain `"Johnny"`                                          |
|    `empty`     | Matches all records whose field value is empty                                                                                                                                                                                          |
|  `not_empty`   | Matches all records whose field value is not empty                                                                                                                                                                                      |
