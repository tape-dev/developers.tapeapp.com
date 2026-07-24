---
id: filter
title: Filter
sidebar_label: Filter
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Filter inputs select which Records are returned from an App. The **same filter object** is used in two places:

- to [retrieve filtered Records](record#retrieve-filtered-records-for-an-app) (`POST /v1/record/filter/app/{app_id}`), and
- to define the filters of an [app view](view).

Anything documented here applies to both, unchanged. Multiple filters can be provided; they are combined with the boolean `AND` operator (there is no `OR`) — a Record is returned only if it matches **every** filter.

Each **field filter** is a JSON object with:

| Key          | Description                                                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `field_id`   | The id of the field to filter on. **Required.**                                                                               |
| `field_type` | The field's type, e.g. `single_text`, `status`, `single_date` (see the sections below). Required for [view](view) filters; optional for record filtering, where the field is identified by `field_id` (sending it is still recommended). |
| `type`       | The legacy data-type discriminator that goes with the field type, e.g. `text`, `status`, `date`. **Required** — a filter without it returns a `400`. |
| `match_type` | The operator, e.g. `contains`, `equal`, `before`. The operators each field type accepts are listed per section below.         |
| `values`     | The operand(s), as an array of `{ "value": … }` objects. Omitted for the `empty` / `not_empty` operators.                     |

Some field types accept additional optional operand keys (for relative dates, weekdays, the "@me" flag, checklist sub-properties, …). These are documented under [Operand keys](#operand-keys).

The following example matches all records whose field `1` contains the text `"John"` **and** whose field `2` (a status field) references option `123`:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Combined Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "single_text",
      "match_type": "contains",
      "values": [{ "value": "John" }],
      "type": "text"
    },
    {
      "field_id": "2",
      "field_type": "status",
      "match_type": "equal",
      "values": [{ "value": 123 }],
      "type": "status"
    }
  ]
}
```

</TabItem>
</Tabs>

Tape also supports a few field-less [metadata filters](#record-metadata-filters) — by creation date, modification date, or record id — that need no field on the App.

## Single Text

This is an example on how to filter records by a `single_text` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single Text Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "single_text",
      "match_type": "contains",
      "values": [{ "value": "John" }],
      "type": "text"
    }
  ]
}
```

</TabItem>
</Tabs>

`contains`, `not_contains`, `starts_with` and `ends_with` compare **case-insensitively**; `equal` and `not_equal` are **case-sensitive** exact matches. Leading and trailing whitespace in the match value is trimmed for every operator. The `empty` and `not_empty` match types take no `values`.

The following `match_type` values are supported for `single_text` fields:

|   Match type   | Description                                                              |
| :------------: | ----------------------------------------------------------------------- |
|    `equal`     | Matches all records whose field value is equal to the match value.      |
|  `not_equal`   | Matches all records whose field value is not equal to the match value.  |
|   `contains`   | Matches all records whose field value contains the match value.         |
| `not_contains` | Matches all records whose field value does not contain the match value. |
| `starts_with`  | Matches all records whose field value starts with the match value.      |
|  `ends_with`   | Matches all records whose field value ends with the match value.        |
|    `empty`     | Matches all records whose field value is empty.                         |
|  `not_empty`   | Matches all records whose field value is not empty.                     |

## Multi Text

This is an example on how to filter records by a `multi_text` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Text Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_text",
      "match_type": "contains",
      "values": [{ "value": "John" }],
      "type": "text"
    }
  ]
}
```

</TabItem>
</Tabs>

`multi_text` filters match against the field's unformatted (plain-text) value. `contains`, `not_contains`, `starts_with` and `ends_with` compare **case-insensitively**; `equal` and `not_equal` are **case-sensitive** exact matches. Leading and trailing whitespace is trimmed for every operator. The `empty` and `not_empty` match types take no `values`.

The following `match_type` values are supported for `multi_text` fields:

|   Match type   | Description                                                                          |
| :------------: | ----------------------------------------------------------------------------------- |
|    `equal`     | Matches all records whose unformatted field value is equal to the match value.      |
|  `not_equal`   | Matches all records whose unformatted field value is not equal to the match value.  |
|   `contains`   | Matches all records whose unformatted field value contains the match value.         |
| `not_contains` | Matches all records whose unformatted field value does not contain the match value. |
| `starts_with`  | Matches all records whose unformatted field value starts with the match value.      |
|  `ends_with`   | Matches all records whose unformatted field value ends with the match value.        |
|    `empty`     | Matches all records whose field value is empty.                                     |
|  `not_empty`   | Matches all records whose field value is not empty.                                 |

## Number

This is an example on how to filter records by a `number` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Number Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "number",
      "match_type": "smaller",
      "values": [{ "value": 12.34 }],
      "type": "number"
    }
  ]
}
```

</TabItem>
</Tabs>

Provide the number to compare against as a bare numeric scalar in `values[0].value`. Omit `values` entirely for `empty` / `not_empty`.

The following `match_type` values are supported for `number` fields:

|     Match type     | Description                                                                        |
| :----------------: | --------------------------------------------------------------------------------- |
|      `equal`       | Matches all records whose field value is equal to the provided match value        |
|    `not_equal`     | Matches all records whose field value is not equal to the provided match value    |
|     `smaller`      | Matches all records whose field value is smaller than the provided match value    |
| `smaller_or_equal` | Matches all records whose field value is smaller than or equal to the match value |
|      `larger`      | Matches all records whose field value is larger than the provided match value     |
| `larger_or_equal`  | Matches all records whose field value is larger than or equal to the match value  |
|      `empty`       | Matches all records whose field value is empty                                    |
|    `not_empty`     | Matches all records whose field value is not empty                                |

## Unique ID

This is an example on how to filter records by a `unique_id` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Unique ID Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "unique_id",
      "match_type": "larger_or_equal",
      "values": [{ "value": 1000 }],
      "type": "number"
    }
  ]
}
```

</TabItem>
</Tabs>

A Unique ID field surfaces a record's auto-generated, App-specific record number (its [`app_record_id`](field/unique-id) — the first record created in an App is `1`, the second `2`, and so on). The match value is a **bare numeric scalar** with no prefix, and `unique_id` filters compare on the underlying number, so this field uses the numeric `type` discriminator `"number"` (not `"unique_id"`). Omit `values` for `empty` / `not_empty` — though, because every record always has an App-specific number, `empty` matches no records and `not_empty` matches every record.

:::note
To filter by the record number on an App that has **no** Unique ID field, use the field-less [`app_record_id` metadata filter](#app-record-id-metadata) instead — it targets the same underlying value without requiring a field.
:::

The following `match_type` values are supported for `unique_id` fields (identical to the `number` set):

|     Match type     | Description                                                                        |
| :----------------: | --------------------------------------------------------------------------------- |
|      `equal`       | Matches the record whose ID is equal to the provided match value                  |
|    `not_equal`     | Matches all records whose ID is not equal to the provided match value             |
|     `smaller`      | Matches all records whose ID is smaller than the provided match value             |
| `smaller_or_equal` | Matches all records whose ID is smaller than or equal to the provided match value |
|      `larger`      | Matches all records whose ID is larger than the provided match value              |
| `larger_or_equal`  | Matches all records whose ID is larger than or equal to the provided match value  |
|      `empty`       | Matches all records whose field value is empty                                    |
|    `not_empty`     | Matches all records whose field value is not empty                                |

## Single Category

This is an example on how to filter records by a `single_category` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single Category Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "single_category",
      "match_type": "any",
      "values": [{ "value": 1 }, { "value": "Not Started" }],
      "type": "category"
    }
  ]
}
```

</TabItem>
</Tabs>

Provide either the numeric id of a category option or its label as the match value. Label matching is case-insensitive and ignores leading and trailing whitespace; if a label matches more than one option the request is rejected — use the id in that case. On read, operands are always returned as option ids. The `empty` and `not_empty` match types take no `values`.

The following `match_type` values are supported for `single_category` fields:

| Match type  | Description                                                                     |
| :---------: | ------------------------------------------------------------------------------ |
|   `equal`   | Matches all records whose field value references the option specified.         |
| `not_equal` | Matches all records whose field value does not reference the option specified. |
|    `any`    | Matches all records whose field value references any of the options specified. |
|   `none`    | Matches all records whose field value references none of the options specified.|
|   `empty`   | Matches all records whose field value is empty.                                |
| `not_empty` | Matches all records whose field value is not empty.                            |

## Multi Category

This is an example on how to filter records by a `multi_category` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Category Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_category",
      "match_type": "contains",
      "values": [{ "value": 1 }, { "value": "Not Started" }],
      "type": "category"
    }
  ]
}
```

</TabItem>
</Tabs>

A `multi_category` field holds a set of options, so the match types compare sets: `equal` requires the field's set to be exactly the given options (order ignored), `contains` requires the field to include all of the given options (it may hold more), while `any` and `none` test for overlap with the given options. Provide either the numeric id of an option or its label; label matching is case-insensitive and ignores leading and trailing whitespace (an ambiguous label is rejected — use the id). On read, operands are always returned as option ids. The `empty` and `not_empty` match types take no `values`.

The following `match_type` values are supported for `multi_category` fields:

| Match type  | Description                                                                                              |
| :---------: | ------------------------------------------------------------------------------------------------------- |
|   `equal`   | Matches all records whose field value references exactly the options specified and no others.           |
| `contains`  | Matches all records whose field value references all of the options specified (and may reference more). |
|    `any`    | Matches all records whose field value references at least one of the options specified.                 |
|   `none`    | Matches all records whose field value references none of the options specified.                         |
|   `empty`   | Matches all records whose field value is empty.                                                         |
| `not_empty` | Matches all records whose field value is not empty.                                                     |

## Status

This is an example on how to filter records by a `status` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Status Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "status",
      "match_type": "any",
      "values": [{ "value": 1 }, { "value": "Not Started" }],
      "type": "status"
    }
  ]
}
```

</TabItem>
</Tabs>

Provide either the numeric id of a status option or its label as the match value. Label matching is case-insensitive and ignores leading and trailing whitespace (an ambiguous label is rejected — use the id). On read, operands are always returned as option ids. The `completed`, `incomplete`, `empty` and `not_empty` match types take no `values` — `completed`/`incomplete` test the completion state of the record's currently referenced status option.

The following `match_type` values are supported for `status` fields:

|  Match type  | Description                                                                            |
| :----------: | ------------------------------------------------------------------------------------- |
|   `equal`    | Matches all records whose field value references the status option specified.         |
| `not_equal`  | Matches all records whose field value does not reference the status option specified. |
|    `any`     | Matches all records whose field value references any of the status options specified. |
|    `none`    | Matches all records whose field value references none of the status options specified.|
|   `empty`    | Matches all records whose field value is empty.                                       |
| `not_empty`  | Matches all records whose field value is not empty.                                   |
| `completed`  | Matches all records whose referenced status option is marked as completed.            |
| `incomplete` | Matches all records whose referenced status option is not marked as completed.        |

## Single Relation

This is an example on how to filter records by a `single_relation` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single Relation Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "single_relation",
      "match_type": "any",
      "values": [{ "value": 1 }],
      "type": "app"
    }
  ]
}
```

</TabItem>
</Tabs>

Provide the related record ids as match values. On read, operands are always returned as record ids. The `empty` and `not_empty` match types take no `values`.

The following `match_type` values are supported for `single_relation` fields:

| Match type  | Description                                                                     |
| :---------: | ------------------------------------------------------------------------------ |
|   `equal`   | Matches all records whose field value references the record specified.         |
| `not_equal` | Matches all records whose field value does not reference the record specified. |
|    `any`    | Matches all records whose field value references any of the records specified. |
|   `none`    | Matches all records whose field value references none of the records specified.|
|   `empty`   | Matches all records whose field value is empty.                                |
| `not_empty` | Matches all records whose field value is not empty.                            |

## Multi Relation

This is an example on how to filter records by a `multi_relation` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Relation Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_relation",
      "match_type": "contains",
      "values": [{ "value": 1 }, { "value": 2 }],
      "type": "app"
    }
  ]
}
```

</TabItem>
</Tabs>

A `multi_relation` field holds a set of related records, so the match types compare sets: `equal` requires the field's set to be exactly the given records (order ignored), `contains` requires the field to include all of the given records (it may hold more), while `any` and `none` test for overlap. Provide the related record ids as match values. On read, operands are always returned as record ids. The `empty` and `not_empty` match types take no `values`.

The following `match_type` values are supported for `multi_relation` fields:

| Match type  | Description                                                                                              |
| :---------: | ------------------------------------------------------------------------------------------------------- |
|   `equal`   | Matches all records whose field value references exactly the records specified and no others.           |
| `contains`  | Matches all records whose field value references all of the records specified (and may reference more). |
|    `any`    | Matches all records whose field value references at least one of the records specified.                 |
|   `none`    | Matches all records whose field value references none of the records specified.                         |
|   `empty`   | Matches all records whose field value is empty.                                                         |
| `not_empty` | Matches all records whose field value is not empty.                                                     |

## Single User

This is an example on how to filter records by a `single_user` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single User Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "single_user",
      "match_type": "any",
      "values": [{ "value": 1 }],
      "type": "contact"
    }
  ]
}
```

</TabItem>
</Tabs>

Provide the user ids to filter by. The acting user can be added to the filter's referenced users with the `include_active_user` operand (the "@me" reference) — see [Operand keys](#operand-keys). On read, operands are always returned as user ids. The `empty` and `not_empty` match types take no `values` (and cannot be combined with `include_active_user`).

The following `match_type` values are supported for `single_user` fields:

| Match type  | Description                                                                  |
| :---------: | --------------------------------------------------------------------------- |
|   `equal`   | Matches all records whose field value references the user specified.        |
| `not_equal` | Matches all records whose field value does not reference the user specified.|
|    `any`    | Matches all records whose field value references any of the users specified.|
|   `none`    | Matches all records whose field value references none of the users specified.|
|   `empty`   | Matches all records whose field value is empty.                             |
| `not_empty` | Matches all records whose field value is not empty.                         |

## Multi User

This is an example on how to filter records by a `multi_user` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi User Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_user",
      "match_type": "contains",
      "values": [{ "value": 1 }, { "value": 2 }],
      "type": "contact"
    }
  ]
}
```

</TabItem>
</Tabs>

A `multi_user` field holds a set of users, so the match types compare sets: `equal` requires the field's set to be exactly the given users (order ignored), `contains` requires the field to include all of the given users (it may hold more), while `any` and `none` test for overlap. Provide the user ids to filter by. The acting user can be added with the `include_active_user` operand (the "@me" reference) — see [Operand keys](#operand-keys). On read, operands are always returned as user ids. The `empty` and `not_empty` match types take no `values` (and cannot be combined with `include_active_user`).

The following `match_type` values are supported for `multi_user` fields:

| Match type  | Description                                                                                          |
| :---------: | --------------------------------------------------------------------------------------------------- |
|   `equal`   | Matches all records whose field value references exactly the users specified and no others.         |
| `contains`  | Matches all records whose field value references all of the users specified (and may reference more).|
|    `any`    | Matches all records whose field value references at least one of the users specified.               |
|   `none`    | Matches all records whose field value references none of the users specified.                       |
|   `empty`   | Matches all records whose field value is empty.                                                     |
| `not_empty` | Matches all records whose field value is not empty.                                                 |

## Created By

This is an example on how to filter records by a `created_by` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Created By Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "created_by",
      "match_type": "any",
      "values": [{ "value": 1 }],
      "type": "contact"
    }
  ]
}
```

</TabItem>
</Tabs>

A `created_by` field references the user who created the record. Provide the user ids to filter by. The acting user can be added with the `include_active_user` operand (the "@me" reference) — see [Operand keys](#operand-keys) — so `any` with `include_active_user` selects the records you created. On read, operands are always returned as user ids. Note the `type` discriminator is `contact` (the same as a user field), not `created_by`. The `empty` and `not_empty` match types take no `values` (and cannot be combined with `include_active_user`).

The following `match_type` values are supported for `created_by` fields:

| Match type  | Description                                                |
| :---------: | --------------------------------------------------------- |
|   `equal`   | Matches all records created by the user specified.        |
| `not_equal` | Matches all records not created by the user specified.    |
|    `any`    | Matches all records created by any of the users specified.|
|   `none`    | Matches all records created by none of the users specified.|
|   `empty`   | Matches all records whose field value is empty.           |
| `not_empty` | Matches all records whose field value is not empty.       |

## Last Modified By

This is an example on how to filter records by a `last_modified_by` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Last Modified By Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "last_modified_by",
      "match_type": "any",
      "values": [{ "value": 1 }],
      "type": "contact"
    }
  ]
}
```

</TabItem>
</Tabs>

A `last_modified_by` field references the user who last modified the record. Provide the user ids to filter by. The acting user can be added with the `include_active_user` operand (the "@me" reference) — see [Operand keys](#operand-keys) — so `any` with `include_active_user` selects the records you last modified. On read, operands are always returned as user ids. Note the `type` discriminator is `contact` (the same as a user field), not `last_modified_by`. The `empty` and `not_empty` match types take no `values` (and cannot be combined with `include_active_user`).

The following `match_type` values are supported for `last_modified_by` fields:

| Match type  | Description                                                     |
| :---------: | -------------------------------------------------------------- |
|   `equal`   | Matches all records last modified by the user specified.       |
| `not_equal` | Matches all records not last modified by the user specified.   |
|    `any`    | Matches all records last modified by any of the users specified.|
|   `none`    | Matches all records last modified by none of the users specified.|
|   `empty`   | Matches all records whose field value is empty.                |
| `not_empty` | Matches all records whose field value is not empty.            |

## Single Date

This is an example on how to filter records by a `single_date` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single Date Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "single_date",
      "match_type": "before",
      "relative_date_type": "exact_date",
      "values": [{ "value": { "date": "2020-01-01T00:00:00.000Z" } }],
      "type": "date"
    }
  ]
}
```

</TabItem>
</Tabs>

The date operand is nested: the target date is `values[0].value.date` (an ISO-8601 string), with an optional integer `values[0].value.offset_amount` used by the relative `num_*` types. A bare scalar (`values[0].value: "2020-01-01"`) is also accepted on input, but the nested object is the canonical form a `GET` emits and re-accepts. Omit `values` for `empty` / `not_empty`.

The date actually matched against is computed from `values[0].value.date`, the `relative_date_type`, and — for the `num_days_*` / `num_weeks_*` / `num_months_*` types — `values[0].value.offset_amount`. For example, `relative_date_type: "num_days_before"` with an offset of `1` and a date of `2020-01-01` resolves to `2019-12-31`. The zero-argument relative types (`today`, `tomorrow`, `yesterday`) need no value at all. See [Operand keys](#operand-keys) for the full list of `relative_date_type` values.

Four operators select a period rather than a single day and read a dedicated operand key (values enumerated under [Operand keys](#operand-keys)):

- `within` — pairs with `relative_date_range_type` to match a named or bounded range (e.g. `current_week`, `past_num_days`, `exact_range`). For `exact_range`, supply the window start via `values[0].value.date` and the window end via the top-level `end_date`; for `next_num_days` / `past_num_days`, supply the count via `offset_amount`.
- `on_weekday` — pairs with `weekday` (`monday`–`sunday`).
- `in_quarter_of_year` — pairs with `quarter_of_year` (`q1`–`q4`).
- `in_month_of_year` — pairs with `month_of_year` (`january`–`december`).

:::caution Date field filters are day-granular
The supplied date is expanded to a full day — `[start of day, end of day]` in the caller's timezone — and the time of day in the value is ignored. As a result the boundary operators are **not** all inclusive: `before` matches strictly before the **start** of the target day and `after` strictly after its **end** (both exclude the day itself), while `on_or_before` includes the whole day through its **end** and `on_or_after` includes it from its **start**. `equal` matches the whole target day; `not_equal` matches everything outside it.
:::

The following `match_type` values are supported for `single_date` fields:

|      Match type      | Description                                                                                        |
| :------------------: | ------------------------------------------------------------------------------------------------- |
|       `equal`        | Matches all records whose field date falls on the target day                                      |
|     `not_equal`      | Matches all records whose field date does not fall on the target day                              |
|       `before`       | Matches all records whose field date is before the **start** of the target day (day excluded)     |
|    `on_or_before`    | Matches all records whose field date is on or before the target day (whole day included)          |
|       `after`        | Matches all records whose field date is after the **end** of the target day (day excluded)        |
|    `on_or_after`     | Matches all records whose field date is on or after the target day (whole day included)           |
|       `within`       | Matches all records whose field date falls within the range selected by `relative_date_range_type`|
|     `on_weekday`     | Matches all records whose field date falls on the supplied `weekday`                              |
| `in_quarter_of_year` | Matches all records whose field date falls in the supplied `quarter_of_year`                      |
|  `in_month_of_year`  | Matches all records whose field date falls in the supplied `month_of_year`                        |
|       `empty`        | Matches all records whose field value is empty                                                    |
|     `not_empty`      | Matches all records whose field value is not empty                                                |

## Range Date

This is an example on how to filter records by a `range_date` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Range Date Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "range_date",
      "match_type": "within",
      "relative_date_range_type": "exact_range",
      "values": [{ "value": { "date": "2020-01-01T00:00:00.000Z" } }],
      "end_date": "2020-12-31T00:00:00.000Z",
      "type": "date"
    }
  ]
}
```

</TabItem>
</Tabs>

A Range Date field stores a start date and an end date, so its operators test that **interval** for **overlap** with the target day or window rather than testing point equality. It otherwise accepts exactly the same operand shape, operators and operand keys as [Single Date](#single-date) above — the nested `values[0].value.date` (+ optional `offset_amount`), `relative_date_type`, `relative_date_range_type`, `weekday`, `quarter_of_year` and `month_of_year` (see [Operand keys](#operand-keys)). The distinctive combination is `within` + `relative_date_range_type: "exact_range"`, which tests the stored range against an explicit window whose bounds are `values[0].value.date` (start) and the top-level `end_date` (end). Omit `values` for `empty` / `not_empty`.

:::caution Range operators use interval-overlap semantics
Each supplied date is expanded to a full day (`[start of day, end of day]` in the caller's timezone; the time of day is ignored). A range operator then tests the stored `[start, end]` interval against the target day or window: `equal` and `within` match any range that **overlaps** it (not only ranges that equal it or sit inside it), while `before` / `after` / `on_or_before` / `on_or_after` compare the range's endpoints to the day boundary.
:::

The following `match_type` values are supported for `range_date` fields:

|      Match type      | Description                                                                                    |
| :------------------: | --------------------------------------------------------------------------------------------- |
|       `equal`        | Matches all records whose range **overlaps** the target day                                   |
|     `not_equal`      | Matches all records whose range does **not** overlap the target day                           |
|       `before`       | Matches all records whose range starts before the **start** of the target day                 |
|    `on_or_before`    | Matches all records whose range falls on or before the target day                             |
|       `after`        | Matches all records whose range falls after the **end** of the target day                      |
|    `on_or_after`     | Matches all records whose range falls on or after the target day                              |
|       `within`       | Matches all records whose range **overlaps** the range selected by `relative_date_range_type`  |
|     `on_weekday`     | Matches all records whose range falls on the supplied `weekday`                                |
| `in_quarter_of_year` | Matches all records whose range falls in the supplied `quarter_of_year`                        |
|  `in_month_of_year`  | Matches all records whose range falls in the supplied `month_of_year`                          |
|       `empty`        | Matches all records whose field value is empty                                                 |
|     `not_empty`      | Matches all records whose field value is not empty                                             |

## Created At

:::note Filtering without a Created-At field
This filter targets an App that has a dedicated Created-At field (it references a `field_id`). To filter by a record's creation time on **any** App — including those without such a field — use the field-less [`created_at` metadata filter](#created-at-metadata) instead.
:::

This is an example on how to filter records by a `created_on` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Created At Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "created_on",
      "match_type": "on_or_after",
      "relative_date_type": "exact_date",
      "values": [{ "value": { "date": "2020-01-01T00:00:00.000Z" } }],
      "type": "date"
    }
  ]
}
```

</TabItem>
</Tabs>

This filters the record's creation date. Note the `field_type` is `created_on` (and the `type` discriminator is `date`). It uses the identical operand shape and operators as [Single Date](#single-date): the nested `values[0].value.date` (+ optional `offset_amount`), `relative_date_type`, and the `within` / `on_weekday` / `in_quarter_of_year` / `in_month_of_year` operators with their `relative_date_range_type` / `weekday` / `quarter_of_year` / `month_of_year` operands (see [Operand keys](#operand-keys)). Omit `values` for `empty` / `not_empty`.

:::caution Day-granular, and distinct from the metadata filter
The supplied date is expanded to a full day in the caller's timezone (time of day ignored), so `before` / `after` are strict at the day boundary (excluding the target day) while `on_or_before` / `on_or_after` include the whole day. This differs from the field-less [`created_at` metadata filter](#created-at-metadata), which is instant-based (it compares exact timestamps) and treats all four bounds as inclusive.
:::

The following `match_type` values are supported for `created_on` fields:

|      Match type      | Description                                                                                    |
| :------------------: | --------------------------------------------------------------------------------------------- |
|       `equal`        | Matches all records whose creation date falls on the target day                               |
|     `not_equal`      | Matches all records whose creation date does not fall on the target day                       |
|       `before`       | Matches all records created before the **start** of the target day (day excluded)             |
|    `on_or_before`    | Matches all records created on or before the target day (whole day included)                  |
|       `after`        | Matches all records created after the **end** of the target day (day excluded)                |
|    `on_or_after`     | Matches all records created on or after the target day (whole day included)                   |
|       `within`       | Matches all records whose creation date falls within the range selected by `relative_date_range_type`|
|     `on_weekday`     | Matches all records whose creation date falls on the supplied `weekday`                        |
| `in_quarter_of_year` | Matches all records whose creation date falls in the supplied `quarter_of_year`                |
|  `in_month_of_year`  | Matches all records whose creation date falls in the supplied `month_of_year`                  |
|       `empty`        | Matches all records with no creation date                                                      |
|     `not_empty`      | Matches all records that have a creation date                                                  |

## Last Modified At

:::note Filtering without a Last-Modified field
This filter targets an App that has a dedicated Last-Modified field (it references a `field_id`). To filter by a record's last-modified time on **any** App — including those without such a field — use the field-less [`last_modified_at` metadata filter](#last-modified-at-metadata) instead.
:::

This is an example on how to filter records by a `last_modified_on` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Last Modified At Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "last_modified_on",
      "match_type": "on_or_after",
      "relative_date_type": "num_weeks_before",
      "values": [{ "value": { "offset_amount": 1 } }],
      "type": "date"
    }
  ]
}
```

</TabItem>
</Tabs>

This filters the record's last-modified date. Note the `field_type` is `last_modified_on` (and the `type` discriminator is `date`). The example above uses a relative date: `num_weeks_before` with `offset_amount: 1` resolves to "one week ago". It uses the identical operand shape and operators as [Single Date](#single-date) — nested `values[0].value.date` (+ optional `offset_amount`), `relative_date_type`, and the `within` / `on_weekday` / `in_quarter_of_year` / `in_month_of_year` operands (see [Operand keys](#operand-keys)). Omit `values` for `empty` / `not_empty`.

:::caution Day-granular, and distinct from the metadata filter
The supplied date is expanded to a full day in the caller's timezone (time of day ignored), so `before` / `after` are strict at the day boundary (excluding the target day) while `on_or_before` / `on_or_after` include the whole day. This differs from the field-less [`last_modified_at` metadata filter](#last-modified-at-metadata), which is instant-based (it compares exact timestamps) and treats all four bounds as inclusive.
:::

The following `match_type` values are supported for `last_modified_on` fields:

|      Match type      | Description                                                                                          |
| :------------------: | --------------------------------------------------------------------------------------------------- |
|       `equal`        | Matches all records whose last-modified date falls on the target day                                |
|     `not_equal`      | Matches all records whose last-modified date does not fall on the target day                        |
|       `before`       | Matches all records last modified before the **start** of the target day (day excluded)             |
|    `on_or_before`    | Matches all records last modified on or before the target day (whole day included)                  |
|       `after`        | Matches all records last modified after the **end** of the target day (day excluded)                |
|    `on_or_after`     | Matches all records last modified on or after the target day (whole day included)                   |
|       `within`       | Matches all records whose last-modified date falls within the range selected by `relative_date_range_type`|
|     `on_weekday`     | Matches all records whose last-modified date falls on the supplied `weekday`                          |
| `in_quarter_of_year` | Matches all records whose last-modified date falls in the supplied `quarter_of_year`                 |
|  `in_month_of_year`  | Matches all records whose last-modified date falls in the supplied `month_of_year`                   |
|       `empty`        | Matches all records with no last-modified date                                                       |
|     `not_empty`      | Matches all records that have a last-modified date                                                   |

## Calculation

This is an example on how to filter records by a `calculation` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Calculation Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "calculation",
      "match_type": "smaller",
      "values": [{ "value": 12.34 }],
      "type": "calculation"
    }
  ]
}
```

</TabItem>
</Tabs>

A calculation field is **polymorphic**: depending on its script, it yields a **text**, a **number**, or a **date** result. Which match types are meaningful therefore depends on the calculation's result type, and you supply the same operand shape as the corresponding scalar field type:

- **Number result** — use the numeric comparison operators with a bare numeric `values[0].value`, exactly as for a [Number](#number) field.
- **Text result** — use the text operators with a string `values[0].value`, exactly as for a [Single Text](#single-text) field.
- **Date result** — use the date operators with the nested `values[0].value.date` (+ optional `offset_amount`) and the temporal operand keys, exactly as for a [Single Date](#single-date) field (see [Operand keys](#operand-keys)).

`empty` / `not_empty` apply to every result type (omit `values`). The calendar operators (`within`, `on_weekday`, `in_quarter_of_year`, `in_month_of_year`) and the zero-argument relative dates (`today`, `tomorrow`, `yesterday`) are only valid when the calculation returns a date — using them against a text- or number-typed calculation returns a `400`.

The following `match_type` values are supported for `calculation` fields (the union across all result types):

|     Match type       | Applies to   | Description                                                                     |
| :------------------: | ------------ | ------------------------------------------------------------------------------ |
|      `empty`         | any          | Matches all records whose field value is empty                                 |
|    `not_empty`       | any          | Matches all records whose field value is not empty                             |
|      `equal`         | number, text, date | Matches all records whose field value is equal to the provided match value (day-granular for a date result) |
|    `not_equal`       | number, text, date | Matches all records whose field value is not equal to the provided match value |
|     `smaller`        | number       | Matches all records whose field value is smaller than the provided match value |
| `smaller_or_equal`   | number       | Matches all records whose field value is smaller than or equal to the match value |
|      `larger`        | number       | Matches all records whose field value is larger than the provided match value  |
| `larger_or_equal`    | number       | Matches all records whose field value is larger than or equal to the match value |
|     `contains`       | text         | Matches all records whose field value contains the provided match value        |
|   `not_contains`     | text         | Matches all records whose field value does not contain the provided match value|
|   `starts_with`      | text         | Matches all records whose field value starts with the provided match value     |
|    `ends_with`       | text         | Matches all records whose field value ends with the provided match value       |
|      `before`        | date         | Matches all records whose field date is before the **start** of the target day (day excluded) |
|   `on_or_before`     | date         | Matches all records whose field date is on or before the target day (whole day included) |
|      `after`         | date         | Matches all records whose field date is after the **end** of the target day (day excluded) |
|   `on_or_after`      | date         | Matches all records whose field date is on or after the target day (whole day included) |
|      `within`        | date         | Matches all records whose field date falls within the range selected by `relative_date_range_type` |
|    `on_weekday`      | date         | Matches all records whose field date falls on the supplied `weekday`           |
| `in_quarter_of_year` | date         | Matches all records whose field date falls in the supplied `quarter_of_year`   |
|  `in_month_of_year`  | date         | Matches all records whose field date falls in the supplied `month_of_year`     |

## Multi Email

This is an example on how to filter records by a `multi_email` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Email Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_email",
      "match_type": "fully_includes",
      "values": [{ "value": "john.doe@gmail.com" }],
      "type": "email"
    }
  ]
}
```

</TabItem>
</Tabs>

An email field can hold several addresses. Most match types quantify over those entries — a record matches when **at least one** email entry satisfies the criterion (`not_contains` matches when **no** entry contains the value; `empty` when there are no entries). Comparison is case insensitive and leading/trailing whitespace in the match value is ignored.

The following `match_type` values are supported for `multi_email` fields:

|    Match type    | Description                                                                       |
| :--------------: | -------------------------------------------------------------------------------- |
| `fully_includes` | Matches records that have at least one email entry **equal to** the match value in full. |
|    `contains`    | Matches records that have at least one email entry **containing** the match value.|
|  `not_contains`  | Matches records where **none** of the email entries contain the match value.      |
|  `starts_with`   | Matches records that have at least one email entry **starting with** the match value. |
|   `ends_with`    | Matches records that have at least one email entry **ending with** the match value. |
|     `empty`      | Matches records whose field value is empty (no email entries). Omit `values`.     |
|   `not_empty`    | Matches records whose field value is not empty (at least one email entry). Omit `values`. |

## Multi Phone

This is an example on how to filter records by a `multi_phone` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Phone Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_phone",
      "match_type": "starts_with",
      "values": [{ "value": "+49" }],
      "type": "phone"
    }
  ]
}
```

</TabItem>
</Tabs>

A phone field can hold several numbers. Most match types quantify over those entries — a record matches when **at least one** phone entry satisfies the criterion (`not_contains` matches when **no** entry contains the value; `empty` when there are no entries). Comparison is case insensitive and leading/trailing whitespace in the match value is ignored.

The following `match_type` values are supported for `multi_phone` fields:

|    Match type    | Description                                                                       |
| :--------------: | -------------------------------------------------------------------------------- |
| `fully_includes` | Matches records that have at least one phone entry **equal to** the match value in full. |
|    `contains`    | Matches records that have at least one phone entry **containing** the match value.|
|  `not_contains`  | Matches records where **none** of the phone entries contain the match value.      |
|  `starts_with`   | Matches records that have at least one phone entry **starting with** the match value. |
|   `ends_with`    | Matches records that have at least one phone entry **ending with** the match value. |
|     `empty`      | Matches records whose field value is empty (no phone entries). Omit `values`.     |
|   `not_empty`    | Matches records whose field value is not empty (at least one phone entry). Omit `values`. |

## Multi Link

This is an example on how to filter records by a `multi_link` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Link Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_link",
      "match_type": "contains",
      "values": [{ "value": "github.com" }],
      "type": "embed"
    }
  ]
}
```

</TabItem>
</Tabs>

Note that the data `type` for a link field is `embed`, not `link`. A link field can hold several links; matching is performed over each entry's **URL** (case insensitive, surrounding whitespace ignored), and a record matches when at least one URL satisfies the criterion.

Link fields have **no exact-match arm** — `equal` and `fully_includes` are not supported and return a `400`. Use `contains` (or `starts_with` / `ends_with`) instead.

The following `match_type` values are supported for `multi_link` fields:

|   Match type   | Description                                                                       |
| :------------: | -------------------------------------------------------------------------------- |
|   `contains`   | Matches records that have at least one link whose URL **contains** the match value.|
| `not_contains` | Matches records where **none** of the link URLs contain the match value.          |
| `starts_with`  | Matches records that have at least one link whose URL **starts with** the match value. |
|  `ends_with`   | Matches records that have at least one link whose URL **ends with** the match value. |
|    `empty`     | Matches records whose field value is empty (no links). Omit `values`.             |
|  `not_empty`   | Matches records whose field value is not empty (at least one link). Omit `values`.|

## Single Location

This is an example on how to filter records by a `single_location` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single Location Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "single_location",
      "match_type": "contains",
      "values": [{ "value": "Berlin" }],
      "type": "location"
    }
  ]
}
```

</TabItem>
</Tabs>

A location filter matches **free text over the formatted address** — the street address, postal code, city, state, country and original formatted address concatenated together. There is no component-level filtering (you cannot filter on city or country in isolation). Comparison is case insensitive and leading/trailing whitespace in the match value is ignored.

The following `match_type` values are supported for `single_location` fields:

|   Match type   | Description                                                                                                            |
| :------------: | -------------------------------------------------------------------------------------------------------------------- |
|   `contains`   | Matches records whose formatted address **contains** the match value.                                                 |
| `not_contains` | Matches records whose formatted address does **not** contain the match value (records with no address set also match).|
|    `empty`     | Matches records whose field value is empty (no address set). A coordinate-only value counts as **not** empty. Omit `values`. |
|  `not_empty`   | Matches records whose field value is not empty (an address or coordinates are set). Omit `values`.                    |

## Single Attachment

This is an example on how to filter records by a `single_attachment` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Single Attachment Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "single_attachment",
      "match_type": "contains",
      "values": [{ "value": "invoice" }],
      "type": "file"
    }
  ]
}
```

</TabItem>
</Tabs>

Note that the data `type` for an attachment field is `file`. Attachment filters match on the file **name**, never on file ids — the match value must be a **string** file name. Comparison is case insensitive and leading/trailing whitespace in the match value is ignored.

The following `match_type` values are supported for `single_attachment` fields:

|   Match type   | Description                                                                    |
| :------------: | ----------------------------------------------------------------------------- |
|    `equal`     | Matches records whose attached file name **equals** the match value.           |
|  `not_equal`   | Matches records whose attached file name does **not** equal the match value.   |
|   `contains`   | Matches records whose attached file name **contains** the match value.         |
| `not_contains` | Matches records whose attached file name does **not** contain the match value. |
| `starts_with`  | Matches records whose attached file name **starts with** the match value.      |
|  `ends_with`   | Matches records whose attached file name **ends with** the match value.        |
|    `empty`     | Matches records with no file attached. Omit `values`.                          |
|  `not_empty`   | Matches records with a file attached. Omit `values`.                           |

## Multi Attachment

This is an example on how to filter records by a `multi_attachment` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Attachment Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_attachment",
      "match_type": "contains",
      "values": [{ "value": "invoice" }],
      "type": "file"
    }
  ]
}
```

</TabItem>
</Tabs>

Like Single Attachment, the data `type` is `file` and matching is on file **names** (provide a string). A multi-attachment field can hold several files, so every match type quantifies over them. `equal` / `not_equal` reach the exact-match arm over the file-name set.

The following `match_type` values are supported for `multi_attachment` fields:

|   Match type   | Description                                                                                       |
| :------------: | ------------------------------------------------------------------------------------------------ |
|    `equal`     | Matches records where at least one attached file name **equals** the match value.                 |
|  `not_equal`   | Matches records where **no** attached file name equals the match value (records with no attachments also match). |
|   `contains`   | Matches records where an attached file name **contains** the match value.                         |
| `not_contains` | Matches records where **none** of the attached file names contain the match value.                |
| `starts_with`  | Matches records where at least one attached file name **starts with** the match value.            |
|  `ends_with`   | Matches records where at least one attached file name **ends with** the match value.              |
|    `empty`     | Matches records with no files attached. Omit `values`.                                            |
|  `not_empty`   | Matches records with at least one file attached. Omit `values`.                                   |

## Multi Image

This is an example on how to filter records by a `multi_image` field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Multi Image Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_image",
      "match_type": "ends_with",
      "values": [{ "value": ".png" }],
      "type": "file"
    }
  ]
}
```

</TabItem>
</Tabs>

Image fields share the `file` data `type` with attachment fields — the discriminant is `field_type`. Matching is on the image file **name** (provide a string). An image field can hold several images, so every match type quantifies over them; `equal` / `not_equal` reach the exact-match arm over the file-name set. Comparison is case insensitive and leading/trailing whitespace in the match value is ignored.

The following `match_type` values are supported for `multi_image` fields:

|   Match type   | Description                                                                                    |
| :------------: | --------------------------------------------------------------------------------------------- |
|    `equal`     | Matches records where at least one image file name **equals** the match value.                 |
|  `not_equal`   | Matches records where **no** image file name equals the match value (records with no images also match). |
|   `contains`   | Matches records where an image file name **contains** the match value.                         |
| `not_contains` | Matches records where **none** of the image file names contain the match value.                |
| `starts_with`  | Matches records where at least one image file name **starts with** the match value.            |
|  `ends_with`   | Matches records where at least one image file name **ends with** the match value.              |
|    `empty`     | Matches records with no images. Omit `values`.                                                 |
|  `not_empty`   | Matches records with at least one image. Omit `values`.                                        |

## Checklist

A checklist field holds a list of entries, each with a **title**, an optional **assignee**, a completion **status**, and an optional **due date**. A checklist filter targets one of these entry properties through the `entry_property` operand (`title`, `assignee`, `status`, or `due_date`). Every checklist match type quantifies over the entries — e.g. `entry_property: "title"` with `contains` matches a record when **any** entry's title contains the value.

When `entry_property` is **omitted**, the filter applies to the field as a whole and supports only `empty` / `not_empty` (i.e. "the checklist has no entries at all" / "has at least one entry").

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Checklist Filter"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "checklist",
      "entry_property": "title",
      "match_type": "contains",
      "values": [{ "value": "Design review" }],
      "type": "checklist"
    }
  ]
}
```

</TabItem>
</Tabs>

The data `type` is always `checklist`. The following table lists which match types each `entry_property` accepts and the operand shape it expects (any other combination returns a `400`):

| `entry_property` | Allowed `match_type`                                                          | Operand                                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| _(omitted)_      | `empty`, `not_empty`                                                          | none — omit `values`                                                                                                              |
| `title`          | `contains`, `not_contains`, `empty`, `not_empty`                             | `values: [{ "value": "<text>" }]` (a string); omit `values` for `empty` / `not_empty`                                             |
| `assignee`       | `equal`, `not_equal`, `empty`, `not_empty`                                   | `values: [{ "value": <user_id> }, …]` (one or more user ids) and/or `include_active_user: true`; omit `values` for `empty` / `not_empty` |
| `status`         | `equal`                                                                       | `values: [{ "value": <boolean> }]` — `true` = completed, `false` = incomplete                                                     |
| `due_date`       | `equal`, `not_equal`, `empty`, `not_empty`, `before`, `after`, `on_or_before`, `on_or_after`, `within` | a date operand — see [Operand keys](#operand-keys); omit `values` for `empty` / `not_empty`                       |

A few rules that are easy to miss:

- **`status` uses a boolean, not a match type.** Unlike the top-level [Status](#status) field (which uses the `completed` / `incomplete` match types), a checklist status filter is `match_type: "equal"` with a boolean value: `false` for incomplete entries, `true` for completed entries.
- **`include_active_user` is assignee-only.** The `include_active_user: true` "@me" flag is valid only with `entry_property: "assignee"`, and only alongside `equal` / `not_equal` (not `empty` / `not_empty`). See [Operand keys](#operand-keys).
- **Checklist `due_date` has no `exact_range`.** The `within` match type requires a `relative_date_range_type`, and — unlike date fields — the checklist variant does not support `exact_range` (there is no exact end date to store). Use a bounded range such as `next_num_days` or `current_week`.

**Example — incomplete entries** (status, boolean value):

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Checklist Filter — incomplete entries"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "checklist",
      "entry_property": "status",
      "match_type": "equal",
      "values": [{ "value": false }],
      "type": "checklist"
    }
  ]
}
```

</TabItem>
</Tabs>

**Example — due within the next 7 days** (due_date + `within`, using a relative range):

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Checklist Filter — due within the next 7 days"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "checklist",
      "entry_property": "due_date",
      "match_type": "within",
      "relative_date_range_type": "next_num_days",
      "values": [{ "value": { "offset_amount": 7 } }],
      "type": "checklist"
    }
  ]
}
```

</TabItem>
</Tabs>

**Example — assigned to me** (assignee + `include_active_user`):

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Checklist Filter — assigned to me"
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "checklist",
      "entry_property": "assignee",
      "match_type": "equal",
      "include_active_user": true,
      "type": "checklist"
    }
  ]
}
```

</TabItem>
</Tabs>

The following `match_type` values are supported for `checklist` fields. Which ones are valid depends on `entry_property` (see the matrix above):

|   Match type   | Valid `entry_property`                          | Description                                                                                      |
| :------------: | ----------------------------------------------- | ------------------------------------------------------------------------------------------------ |
|    `equal`     | `assignee`, `status`, `due_date`                | An entry matches the operand: assigned to the given user / completion equals the boolean / due date equals the date. |
|  `not_equal`   | `assignee`, `due_date`                          | Negation of `equal`.                                                                             |
|   `contains`   | `title`                                         | An entry title contains the match value.                                                         |
| `not_contains` | `title`                                         | No entry title contains the match value.                                                         |
|    `empty`     | _(omitted)_, `title`, `assignee`, `due_date`    | Field-level: the checklist has no entries. Entry-level: an entry's title / assignee / due date is empty. Omit `values`. |
|  `not_empty`   | _(omitted)_, `title`, `assignee`, `due_date`    | Complement of `empty`. Omit `values`.                                                            |
|    `before`    | `due_date`                                      | An entry's due date is before the resolved date.                                                 |
|    `after`     | `due_date`                                      | An entry's due date is after the resolved date.                                                  |
| `on_or_before` | `due_date`                                      | An entry's due date is on or before the resolved date.                                           |
| `on_or_after`  | `due_date`                                      | An entry's due date is on or after the resolved date.                                            |
|    `within`    | `due_date`                                      | An entry's due date falls within the given range. Requires `relative_date_range_type`.           |

## Operand keys

Beyond `values`, some filters carry optional **operand keys** that refine the criterion. They apply mainly to the temporal filters — every filter with `type: "date"` (Single Date, Range Date, Created At, Last Modified At, and date-typed Calculation) — and to Checklist filters with `entry_property: "due_date"`. Each key is validated per field type: supplying one where it is not accepted returns a `400`.

:::caution `offset_amount` is nested; the other keys are top-level
Every operand key below is a **top-level** property of the filter object — except `offset_amount`, which lives **inside** the value at `values[0].value.offset_amount`. Placing it at the top level has no effect.
:::

| Operand key                | Where it goes               | Applies to                           | Used with                                             |
| -------------------------- | --------------------------- | ------------------------------------ | ----------------------------------------------------- |
| `relative_date_type`       | top-level                   | `date` filters, checklist `due_date` | resolves the target date for a comparison             |
| `relative_date_range_type` | top-level                   | `date` filters, checklist `due_date` | `match_type: within`                                  |
| `end_date`                 | top-level                   | `date` filters                       | `within` with `relative_date_range_type: exact_range` |
| `weekday`                  | top-level                   | `date` filters                       | `match_type: on_weekday`                              |
| `quarter_of_year`          | top-level                   | `date` filters                       | `match_type: in_quarter_of_year`                      |
| `month_of_year`            | top-level                   | `date` filters                       | `match_type: in_month_of_year`                        |
| `include_active_user`      | top-level                   | user filters, checklist `assignee`   | boolean "@me" flag                                    |
| `entry_property`           | top-level                   | `checklist`                          | selects the entry sub-property                        |
| `offset_amount`            | nested in `values[0].value` | `date` filters, checklist `due_date` | the `num_*` / `next_num_days` / `past_num_days` types |

### `relative_date_type`

Resolves a comparison (`equal`, `before`, `after`, `on_or_before`, `on_or_after`, …) to a single date. Supported values:

| `relative_date_type`                    | Value to provide                           | Meaning                   |
| --------------------------------------- | ------------------------------------------ | ------------------------- |
| `today`, `tomorrow`, `yesterday`        | none                                       | the corresponding day     |
| `exact_date`                            | `values[0].value.date` (ISO-8601 string)   | an absolute calendar date |
| `num_days_before`, `num_days_after`     | `values[0].value.offset_amount` (integer)  | N days before / after     |
| `num_weeks_before`, `num_weeks_after`   | `values[0].value.offset_amount` (integer)  | N weeks before / after    |
| `num_months_before`, `num_months_after` | `values[0].value.offset_amount` (integer)  | N months before / after   |

For `single_date` and `range_date` fields the `num_*` offset is applied to the anchor `date` you pass in `values[0].value.date`. For `created_on`, `last_modified_on` and checklist `due_date` filters the offset is resolved relative to the current date (any anchor `date` is ignored). The `exact_date` value accepts only an ISO-8601 **string** — a numeric epoch is not honored (`end_date`, however, does accept an epoch number).

### `relative_date_range_type`

Used with `match_type: within` to select a date range. Supported values:

| `relative_date_range_type`                                                                                                     | Value to provide                                        |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `current_week`, `current_month`, `current_year`, `past_week`, `past_month`, `past_year`, `next_week`, `next_month`, `next_year` | none                                                    |
| `next_num_days`, `past_num_days`                                                                                               | `values[0].value.offset_amount` (integer)               |
| `exact_range`                                                                                                                  | `values[0].value.date` (start) **and** `end_date` (end) |

`exact_range` is available on `date` fields only. Checklist `due_date` filters support every value **except** `exact_range`.

### `end_date`

An ISO date string (or epoch number) giving the **end** of the range for a `within` + `exact_range` filter on a `date` field. The range **start** is taken from `values[0].value.date`.

### `weekday`

One of `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`. Used with `match_type: on_weekday` on `date` fields to match records whose date falls on the given weekday.

### `quarter_of_year`

One of `q1`, `q2`, `q3`, `q4`. Used with `match_type: in_quarter_of_year` on `date` fields.

### `month_of_year`

One of `january`, `february`, `march`, `april`, `may`, `june`, `july`, `august`, `september`, `october`, `november`, `december`. Used with `match_type: in_month_of_year` on `date` fields.

### `include_active_user`

A boolean "@me" flag that resolves to the current API key's owner. Set `include_active_user: true` to match against the calling user without hard-coding a user id. It is used by user-based filters (`single_user`, `multi_user`, `created_by`, `last_modified_by`) and by checklist `assignee` filters. For a checklist it is valid **only** with `entry_property: "assignee"` and **only** with `equal` / `not_equal` (not `empty` / `not_empty`); it may be combined with explicit user ids in `values`.

### `entry_property`

Checklist-only sub-discriminator: `title`, `assignee`, `status`, or `due_date`. Selects which checklist entry property the filter applies to; when omitted, the filter applies to the field as a whole (`empty` / `not_empty` only). See [Checklist](#checklist).

### `offset_amount`

An integer supplied **inside** the value object at `values[0].value.offset_amount` (not as a top-level key). It provides the count for the `num_days_*` / `num_weeks_*` / `num_months_*` relative date types and for the `next_num_days` / `past_num_days` range types.

## Record metadata filters {#record-metadata-filters}

All of the filters above target a **field** — each one carries a `field_id` and a `field_type`. Tape additionally supports a small set of **metadata filters** that match on a record's intrinsic properties. Because every record has these properties, a metadata filter needs **no field** on the App.

A metadata filter is identified by its `type` alone and omits `field_id` and `field_type`:

| `type`             | Filters on                                                                      | Match `value`                |
| ------------------ | ------------------------------------------------------------------------------- | ---------------------------- |
| `created_at`       | When the record was created                                                     | nested — `{ "date": "…" }`   |
| `last_modified_at` | When the record was last modified                                               | nested — `{ "date": "…" }`   |
| `app_record_id`    | The record's App-specific ID (the [`app_record_id`](field/unique-id) property)  | bare scalar — e.g. `123`     |

Metadata filters go in the same `filters` array as field filters and are combined with the same boolean `AND`.

:::caution The timestamp match value is nested
`created_at` and `last_modified_at` read the match value from `values[0].value.date` — a nested object. Field filters and `app_record_id` use a bare scalar at `values[0].value`. This asymmetry is an easy integration mistake to make.
:::

### Created At (metadata) {#created-at-metadata}

Filter records by their creation time, without the App having a Created-At field:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Created At Meta Filter — bounded window"
{
  "filters": [
    {
      "type": "created_at",
      "match_type": "on_or_after",
      "values": [{ "value": { "date": "2026-07-01T00:00:00.000Z" } }]
    },
    {
      "type": "created_at",
      "match_type": "on_or_before",
      "values": [{ "value": { "date": "2026-07-02T00:00:00.000Z" } }]
    }
  ]
}
```

</TabItem>
</Tabs>

- **Absolute UTC dates only.** Provide a full ISO-8601 timestamp as `value.date`. `relative_date_type` may be omitted or set to `exact_date`; any genuinely relative value (`num_days_before`, `num_weeks_after`, …) returns a `400`. The `offset_amount` sub-field is accepted by the type but ignored — do not rely on it.
- **All bounds are inclusive.** Every supported match type compares with `>=` or `<=`: `after` behaves exactly like `on_or_after`, and `before` like `on_or_before`.
- **Express a window with two filters** — one lower bound and one upper bound, as shown above. Repeating a bound in the same direction _narrows_ the window (the latest lower bound and the earliest upper bound win); it never widens it.
- **Invalid input fails loudly** with a `400` rather than being silently dropped — an unsupported `match_type`, a missing or unparseable `date`, or a calendar year outside `1`–`9999`.

The following `match_type` values are supported for `created_at`:

| Match type                                              | Description                                        |
| ------------------------------------------------------- | -------------------------------------------------- |
| `after`, `on_or_after`, `larger`, `larger_or_equal`     | Matches records created **on or after** the value  |
| `before`, `on_or_before`, `smaller`, `smaller_or_equal` | Matches records created **on or before** the value |

Any other match type (`equal`, `empty`, `not_empty`, …) returns a `400`.

For filtering an App that has a dedicated Created-At field, see [Created At](#created-at) above.

### Last Modified At (metadata) {#last-modified-at-metadata}

Identical to [Created At (metadata)](#created-at-metadata) in every respect — same match types, inclusive bounds, absolute-date rule and `400` behavior — using `type: "last_modified_at"`:

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      Last Modified At Meta Filter"
{
  "filters": [
    {
      "type": "last_modified_at",
      "match_type": "on_or_after",
      "values": [{ "value": { "date": "2026-07-01T00:00:00.000Z" } }]
    }
  ]
}
```

</TabItem>
</Tabs>

:::caution Never-modified records are excluded
A record that has not been edited since it was created has no last-modified timestamp, and matches **no** `last_modified_at` filter — not even a far-past `on_or_after`. To retrieve everything created **or** modified since a point in time, query `created_at` and `last_modified_at` separately and merge the results (see [Pattern: incremental sync](#pattern-incremental-sync)).
:::

### App Record ID (metadata) {#app-record-id-metadata}

Filter records by their App-specific ID — the sequential [`app_record_id`](field/unique-id) returned on every record (the first record created in an App is `1`, the second `2`, and so on):

<Tabs defaultValue="json">
<TabItem value="json" label="JSON">

```json title="➡️      App Record ID Meta Filter"
{
  "filters": [
    {
      "type": "app_record_id",
      "match_type": "larger_or_equal",
      "values": [{ "value": 1000 }]
    }
  ]
}
```

</TabItem>
</Tabs>

The match value is a **bare scalar** (`values[0].value`), not a nested object, and must be numeric — a missing or non-numeric value returns a `400` for every match type, including `empty` / `not_empty`.

The following `match_type` values are supported for `app_record_id`:

|    Match type      | Description                                                        |
| ------------------ | ----------------------------------------------------------------- |
| `equal`            | Matches the record whose App ID equals the value                  |
| `not_equal`        | Matches all records whose App ID does not equal the value         |
| `larger`           | Matches all records whose App ID is larger than the value         |
| `larger_or_equal`  | Matches all records whose App ID is larger than or equal to the value    |
| `smaller`          | Matches all records whose App ID is smaller than the value        |
| `smaller_or_equal` | Matches all records whose App ID is smaller than or equal to the value   |
| `empty`            | Matches records that have no App ID                               |
| `not_empty`        | Matches records that have an App ID                               |

Any other match type returns a `400`. Note that every record always has an `app_record_id`, so in practice `empty` matches nothing and `not_empty` matches every record.

### Pattern: incremental sync {#pattern-incremental-sync}

A common use of the timestamp metadata filters is an **incremental sync** — pulling only the records that changed since your last run, without having to add Created-At or Last-Modified fields to every App.

Because filters combine with `AND` (there is no `OR`), "created **or** modified since `T`" cannot be expressed in a single request. Issue two requests and union the results:

<Tabs defaultValue="created">
<TabItem value="created" label="Created since T">

```json title="➡️      Request 1 — records created since T"
{
  "filters": [
    {
      "type": "created_at",
      "match_type": "on_or_after",
      "values": [{ "value": { "date": "2026-07-22T00:00:00.000Z" } }]
    }
  ]
}
```

</TabItem>
<TabItem value="modified" label="Modified since T">

```json title="➡️      Request 2 — records modified since T"
{
  "filters": [
    {
      "type": "last_modified_at",
      "match_type": "on_or_after",
      "values": [{ "value": { "date": "2026-07-22T00:00:00.000Z" } }]
    }
  ]
}
```

</TabItem>
</Tabs>

De-duplicate the combined result by record `id`. Request 2 only returns records edited since creation (see the caveat above), which is why Request 1 is still needed to catch brand-new records.

:::info These filters previously had no effect
Before this change, the API accepted `created_at` and `last_modified_at` metadata filters but silently **ignored** them, returning the full unfiltered record set. They are now applied. An integration that was unknowingly relying on the old no-op behavior will see its result sets shrink.
:::
