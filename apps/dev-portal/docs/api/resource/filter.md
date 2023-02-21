---
id: filter
title: Filter
sidebar_label: Filter
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Filter inputs are used to retrieve Records with one or more filter criterions from an App. They can be provided when retrieving Records with one of the following endpoints:

Retrieve filtered Records for an App: [Get filtered Records](record#retrieve-filtered-records-for-an-app)

For every supported endpoint, multiple filters can be provided which get concatenated with the boolean `AND` operator.

The following example matches all records that have a field value for field with ID 1 containing the text `"John"` and a field value for field with ID 2 equal to `123`:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single Text Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "single_text",
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
      "field_type": "status",
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

This is an example on how to filter records by a `single_text` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single Text Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "single_text",
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

The following `match_type` values are supported for `single_text` fields:

|   Match type   | Description                                                                                                                                                                                                                 |
| :------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `equal`     | Matches all records whose field value is equal to the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` is equal to `"john doe"`                                                  |
|  `not_equal`   | Matches all records whose field value is not equal to the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` is equal to `"john doe"`, `"johnny doe"` is not equal to `"john doe"` |
|   `contains`   | Matches all records whose field value contains the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` contains `"doe"`                                                             |
| `not_contains` | Matches all records whose field value does not contain the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` does not contain `"Johnny"`                                          |
|    `empty`     | Matches all records whose field value is empty                                                                                                                                                                              |
|  `not_empty`   | Matches all records whose field value is not empty                                                                                                                                                                          |

## Multi Text

This is an example on how to filter records by a `multi_text` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Text Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_text",
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

The following `match_type` values are supported for `multi_text` fields:

|   Match type   | Description                                                                                                                                                                                                                             |
| :------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `equal`     | Matches all records whose unformatted field value is equal to the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` is equal to `"john doe"`                                                  |
|  `not_equal`   | Matches all records whose unformatted field value is not equal to the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` is equal to `"john doe"`, `"johnny doe"` is not equal to `"john doe"` |
|   `contains`   | Matches all records whose unformatted field value contains the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` contains `"doe"`                                                             |
| `not_contains` | Matches all records whose unformatted field value does not contain the provided match value. Comparison is case insensitive and spaces are ignored. `" John Doe "` does not contain `"Johnny"`                                          |
|    `empty`     | Matches all records whose field value is empty                                                                                                                                                                                          |
|  `not_empty`   | Matches all records whose field value is not empty                                                                                                                                                                                      |

## Single Category

This is an example on how to filter records by a `single_category` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single Category Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "single_category",
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
The following `match_type` values are supported for `single_category` fields:

| Match type  | Description                                                                                                                                                               |
| :---------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `equal`   | Matches all records whose field value references the category option specified by the match value. Comparison is case insensitive and spaces are ignored.                 |
| `not_equal` | Matches all records whose field value does not reference the category option specified by the match value. Comparison is case insensitive and spaces are ignored.         |
|    `any`    | Matches all records whose field value references any of the category options specified by the match value. Comparison is case insensitive and spaces are ignored.         |
|   `none`    | Matches all records whose field value does not reference any of the category options specified by the match value. Comparison is case insensitive and spaces are ignored. |
|   `empty`   | Matches all records whose field value is empty                                                                                                                            |
| `not_empty` | Matches all records whose field value is not empty                                                                                                                        |

## Multi Category

This is an example on how to filter records by a `multi_category` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Category Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_category",
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
The following `match_type` values are supported for `multi_category` fields:

| Match type  | Description                                                                                                                                                                                                          |
| :---------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `equal`   | Matches all records whose field value exactly references all category options specified by the match value and no more. Comparison is case insensitive, spaces are ignored and the order of options has no influence |
| `not_equal` | Matches all records whose field value exactly references all category options specified by the match value and no more. Comparison is case insensitive, spaces are ignored and the order of options has no influence |
|    `any`    | Matches all records whose field value references any category option of those provided by the match value. Comparison is case insensitive and spaces are ignored                                                     |
|   `none`    | Matches all records whose field value references no category option of those provided by the match value. Comparison is case insensitive and spaces are ignored                                                      |
|   `empty`   | Matches all records whose field value is empty                                                                                                                                                                       |
| `not_empty` | Matches all records whose field value is not empty                                                                                                                                                                   |

## Status

This is an example on how to filter records by a `status` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Status Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "status",
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
The following `match_type` values are supported for `status` fields:

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

This is an example on how to filter records by a `number` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Number Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "number",
      "match_type": "smaller",
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

## Single Date

This is an example on how to filter records by a `single_date` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single Date Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "single_date",
      "match_type": "is_before",
      "relative_date_type": "exact_date",
      "values": [
        {
          "value": "2020-01-01"
        }
      ],
      "type": "date"
    },
    {
      "field_id": "1",
      "field_type": "single_date",
      "match_type": "is_after",
      "relative_date_type": "num_weeks_before",
      "values": [
        {
          "value": "2020-01-01",
          "offset_amount": 1
        }
      ],
      "type": "date"
    }
  ]
}
```

</TabItem>
</Tabs>

In addition to the match type, a relative date type needs to be provided when filtering for a Single Date Field:
`num_days_after`, `num_days_before`, `num_weeks_after`, `num_months_before`, `num_months_after`, `exact_date`.

The combination of the provided match value, the offset amount and the relative date type will be used to calculate the date to match against.
E.g. if the match value is `2020-01-01`, the offset amount is `1` and the relative date type is `num_days_before`, the date to match against will be `2019-12-31`.

|   Match type   | Description                                                                                                                         |
| :------------: | ----------------------------------------------------------------------------------------------------------------------------------- |
|    `equal`     | Matches all records whose field value is equal to the the date of the provided match value + offset_amount + relative_date_type     |
|  `not_equal`   | Matches all records whose field value is not equal to the the date of the provided match value + offset_amount + relative_date_type |
|    `before`    | Matches all records whose field value is before the date of the provided match value + offset_amount + relative_date_type           |
| `on_or_before` | Matches all records whose field value is before the date of the provided match value + offset_amount + relative_date_type           |
|    `after`     | Matches all records whose field value is after the date of the provided match value + offset_amount + relative_date_type            |
| `on_or_after`  | Matches all records whose field value is after the date of the provided match value + offset_amount + relative_date_type            |
|    `empty`     | Matches all records whose field value is empty                                                                                      |
|  `not_empty`   | Matches all records whose field value is not empty                                                                                  |

## Created At

This is an example on how to filter records by a `created_at` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Created At Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "created_at",
      "match_type": "is_before",
      "relative_date_type": "exact_date",
      "values": [
        {
          "value": "2020-01-01"
        }
      ],
      "type": "date"
    },
    {
      "field_id": "1",
      "field_type": "created_at",
      "match_type": "is_after",
      "relative_date_type": "num_weeks_before",
      "values": [
        {
          "value": "2020-01-01",
          "offset_amount": 1
        }
      ],
      "type": "date"
    }
  ]
}
```

</TabItem>
</Tabs>

In addition to the match type, a relative date type needs to be provided when filtering for a Created At Field:
`num_days_after`, `num_days_before`, `num_weeks_after`, `num_months_before`, `num_months_after`, `exact_date`.

The combination of the provided match value, the offset amount and the relative date type will be used to calculate the date to match against.
E.g. if the match value is `2020-01-01`, the offset amount is `1` and the relative date type is `num_days_before`, the date to match against will be `2019-12-31`.

|   Match type   | Description                                                                                                                           |
| :------------: | ------------------------------------------------------------------------------------------------------------------------------------- |
|    `equal`     | Matches all records whose creation date is equal to the the date of the provided match value + offset_amount + relative_date_type     |
|  `not_equal`   | Matches all records whose creation date is not equal to the the date of the provided match value + offset_amount + relative_date_type |
|    `before`    | Matches all records whose creation date is before the date of the provided match value + offset_amount + relative_date_type           |
| `on_or_before` | Matches all records whose creation date is before the date of the provided match value + offset_amount + relative_date_type           |
|    `after`     | Matches all records whose creation date is after the date of the provided match value + offset_amount + relative_date_type            |
| `on_or_after`  | Matches all records whose creation date is after the date of the provided match value + offset_amount + relative_date_type            |

## Last Modified At

This is an example on how to filter records by a `last_modified_at` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Last Modified At Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "last_modified_at",
      "match_type": "is_before",
      "relative_date_type": "exact_date",
      "values": [
        {
          "value": "2020-01-01"
        }
      ],
      "type": "date"
    },
    {
      "field_id": "1",
      "field_type": "last_modified_at",
      "match_type": "is_after",
      "relative_date_type": "num_weeks_before",
      "values": [
        {
          "value": "2020-01-01",
          "offset_amount": 1
        }
      ],
      "type": "date"
    }
  ]
}
```

</TabItem>
</Tabs>

In addition to the match type, a relative date type needs to be provided when filtering for a Last Modified At Field:
`num_days_after`, `num_days_before`, `num_weeks_after`, `num_months_before`, `num_months_after`, `exact_date`.

The combination of the provided match value, the offset amount and the relative date type will be used to calculate the date to match against.
E.g. if the match value is `2020-01-01`, the offset amount is `1` and the relative date type is `num_days_before`, the date to match against will be `2019-12-31`.

|   Match type   | Description                                                                                                                                       |
| :------------: | ------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `equal`     | Matches all records whose date of last modification is equal to the the date of the provided match value + offset_amount + relative_date_type     |
|  `not_equal`   | Matches all records whose date of last modification is not equal to the the date of the provided match value + offset_amount + relative_date_type |
|    `before`    | Matches all records whose date of last modification is before the date of the provided match value + offset_amount + relative_date_type           |
| `on_or_before` | Matches all records whose date of last modification is before the date of the provided match value + offset_amount + relative_date_type           |
|    `after`     | Matches all records whose date of last modification is after the date of the provided match value + offset_amount + relative_date_type            |
| `on_or_after`  | Matches all records whose date of last modification is after the date of the provided match value + offset_amount + relative_date_type            |

## Multi Email

This is an example on how to filter records by a `multi_email` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Email Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_email",
      "match_type": "fully_includes",
      "values": [
        {
          "value": "john.doe@gmail.com"
        }
      ],
      "type": "email"
    }
  ]
}
```

</TabItem>
</Tabs>

|    Match type    | Description                                                                                                                                                                             |
| :--------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fully_includes` | Matches all records whose field value includes at least one email entry containing the full number specified by the match value. Comparison is case insensitive and spaces are ignored. |
|  `starts_with`   | Matches all records whose field value includes at least one email entry that starts with the match value. Comparison is case insensitive and spaces are ignored.                        |
|   `ends_with`    | Matches all records whose field value includes at least one email entry that ends with the match value. Comparison is case insensitive and spaces are ignored.                          |
|    `contains`    | Matches all records whose field value includes at least one email entry that contains the match value. Comparison is case insensitive and spaces are ignored.                           |
|  `not_contains`  | Matches all records whose field value includes at least one email entry that does not contain the match value. Comparison is case insensitive and spaces are ignored.                   |
|     `empty`      | Matches all records whose field value is empty. I.e. does not contain any email entry                                                                                                   |
|   `not_empty`    | Matches all records whose field value is not empty. I.e. contains at least one email entry                                                                                              |

## Multi Phone

This is an example on how to filter records by a `multi_phone` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Phone Filter">
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_phone",
      "match_type": "starts_with",
      "values": [
        {
          "value": "+49"
        }
      ],
      "type": "phone"
    }
  ]
}
```

</TabItem>
</Tabs>

|    Match type    | Description                                                                                                                                                                              |
| :--------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fully_includes` | Matches all records whose field value includes at least one phone entry containing the full address specified by the match value. Comparison is case insensitive and spaces are ignored. |
|  `starts_with`   | Matches all records whose field value includes at least one phone entry that starts with the match value. Comparison is case insensitive and spaces are ignored.                         |
|   `ends_with`    | Matches all records whose field value includes at least one phone entry that ends with the match value. Comparison is case insensitive and spaces are ignored.                           |
|    `contains`    | Matches all records whose field value includes at least one phone entry that contains the match value. Comparison is case insensitive and spaces are ignored.                            |
|  `not_contains`  | Matches all records whose field value includes at least one phone entry that does not contain the match value. Comparison is case insensitive and spaces are ignored.                    |
|     `empty`      | Matches all records whose field value is empty. I.e. does not contain any phone entry                                                                                                    |
|   `not_empty`    | Matches all records whose field value is not empty. I.e. contains at least one phone entry                                                                                               |
