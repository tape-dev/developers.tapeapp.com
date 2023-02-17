---
id: filter
title: Filter
sidebar_label: Filter
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Filters are used to filter Records in an App. They can be provided when retrieving Records with one of the following endpoints:

Retrieve filtered Records for an App: [Get filtered Records](record#retrieve-filtered-Records-for-an-app)

For every supported endpoints, multiple filters can be provided which get concatenated with the boolean `AND`operator.

The following example matches all records that have a field value for field with ID 1 containing the text `John` and a field value for field with ID 2 equal to `123`:
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
    },
    {
      "field_id": "2",
      "field_type": "NUMBER",
      "match_type": "equal",
      "values": [
        {
          "value": 123
        }
      ],
      "type": "number"
    }
  ]
}
```

</TabItem>
</Tabs>

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

## Single Category

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single Category Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "SINGLE_CATEGORY",
      "match_type": "any",
      "values": [
        {
          "value": 1
        },
        {
          "value": "Not Started"
        }
      ],
      "type": "category"
    }
  ]
}
```

</TabItem>
</Tabs>

Either the id of the respective category option or the label of the option can be provided as match value.
The following `match_type` values are supported for `SINGLE_CATEGORY` fields:

| Match type  | Description                                                                                                                                                               |
| :---------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `equal`   | Matches all records whose field value references the category option specified by the match value. Comparison is case insensitive and spaces are ignored.                 |
| `not_equal` | Matches all records whose field value does not reference the category option specified by the match value. Comparison is case insensitive and spaces are ignored.         |
|    `any`    | Matches all records whose field value references any of the category options specified by the match value. Comparison is case insensitive and spaces are ignored.         |
|   `none`    | Matches all records whose field value does not reference any of the category options specified by the match value. Comparison is case insensitive and spaces are ignored. |
|   `empty`   | Matches all records whose field value is empty                                                                                                                            |
| `not_empty` | Matches all records whose field value is not empty                                                                                                                        |

## Multi Category

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Category Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "MULTI_CATEGORY",
      "match_type": "any",
      "values": [
        {
          "value": 1
        },
        {
          "value": "Not Started"
        }
      ],
      "type": "category"
    }
  ]
}
```

</TabItem>
</Tabs>

Either the id of the respective category option or the label of the option can be provided as match value.
The following `match_type` values are supported for `MULTI_CATEGORY` fields:

| Match type  | Description                                                                                                                                                                                                          |
| :---------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `equal`   | Matches all records whose field value exactly references all category options specified by the match value and no more. Comparison is case insensitive, spaces are ignored and the order of options has no influence |
| `not_equal` | Matches all records whose field value exactly references all category options specified by the match value and no more. Comparison is case insensitive, spaces are ignored and the order of options has no influence |
|    `any`    | Matches all records whose field value references any category option of those provided by the match value. Comparison is case insensitive and spaces are ignored                                                     |
|   `none`    | Matches all records whose field value references no category option of those provided by the match value. Comparison is case insensitive and spaces are ignored                                                      |
|   `empty`   | Matches all records whose field value is empty                                                                                                                                                                       |
| `not_empty` | Matches all records whose field value is not empty                                                                                                                                                                   |

## Status

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Status Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "STATUS",
      "match_type": "any",
      "values": [
        {
          "value": 1
        },
        {
          "value": "Not Started"
        }
      ],
      "type": "category"
    }
  ]
}
```

</TabItem>
</Tabs>

Either the id of the respective status option or the label of the option can be provided as match value.
The following `match_type` values are supported for `STATUS` fields:

|  Match type  | Description                                                                                                                                                               |
| :----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `equal`    | Matches all records whose field value references the status option specified by the match value. Comparison is case insensitive and spaces are ignored.                   |
| `not_equal`  | Matches all records whose field value does not reference the status specified by the match value. Comparison is case insensitive and spaces are ignored.                  |
|    `any`     | Matches all records whose field value references any of the category options specified by the match value. Comparison is case insensitive and spaces are ignored.         |
|    `none`    | Matches all records whose field value does not reference any of the category options specified by the match value. Comparison is case insensitive and spaces are ignored. |
|   `empty`    | Matches all records whose field value is empty                                                                                                                            |
| `not_empty`  | Matches all records whose field value is not empty                                                                                                                        |
| `completed`  | Matches all records whose referenced option is set to `completed`                                                                                                         |
| `incomplete` | Matches all records whose referenced option is set to `incomplete`                                                                                                        |

## Number

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Number Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "NUMBER",
      "match_type": "any",
      "values": [
        {
          "value": 12.34
        }
      ],
      "type": "number"
    }
  ]
}
```

</TabItem>
</Tabs>

|     Match type     | Description                                                                                                                                              |
| :----------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
|      `equal`       | Matches all records whose field value is equal to the provided match value                                                                               |
|     `smaller`      | Matches all records whose field value is smaller than the provided match value                                                                           |
| `smaller_or_equal` | Matches all records whose field value is smaller or equal to the provided match value                                                                    |
|      `larger`      | Matches all records whose field value is larger than the provided match value                                                                            |
| `larger_or_equal`  | Matches all records whose field value is larger or equal to the provided match value                                                                     |
|    `not_equal`     | Matches all records whose field value does not reference the status specified by the match value. Comparison is case insensitive and spaces are ignored. |
|      `empty`       | Matches all records whose field value is empty                                                                                                           |
|    `not_empty`     | Matches all records whose field value is not empty                                                                                                       |
