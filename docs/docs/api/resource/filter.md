# Filter

> Use filters to choose which records of a database app a request returns.

Use filters to choose which records of a database app a request returns.

The same filter object works in two places:

-   [Retrieve filtered records for an app](https://developers.tapeapp.com/docs/api/resource/record#retrieve-filtered-records-for-an-app) (`POST /v1/record/filter/app/{app_id}`) returns the records that match.
-   A [view](https://developers.tapeapp.com/docs/api/resource/view) stores filters and shows only the records that match.

Everything on this page applies to both, except the [metadata filters](#record-metadata-filters): a view stores only field filters. [View filters](https://developers.tapeapp.com/docs/api/resource/view#filters) lists the rules that apply to views only.

**Requirements:** `records:read` to retrieve filtered records, `apps:edit` and share access to the app to save filters in a view. Works with a personal access token, an OAuth access token or a user API key.

> Coming from the Podio API?
> 
> Send `filters` as an array with one filter object and a `match_type` per field. Use the field ID: the slug (`external_id`) doesn't work here. Several category options go in one filter with `any`. A date range with `from` and `to` becomes `within` with `exact_range` and `end_date`, see [Single date](#single-date). Send `sort_by` (field ID or slug), `sort_desc`, `limit` and `cursor` in the query string, not in the body. There is no `offset`.

## The filter object

Send your filters as an array in `filters`. A record matches only if it matches *every* filter (`AND`). There is no `OR`.

Each *field filter* is a JSON object with these keys:

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `field_id` | integer or string | ID of the field to filter on. **Required.** The slug (`external_id`) returns a `400`. | `"1"` |
| `field_type` | string | Type of the field, for example `single_text`, `status` or `single_date`. Required for view filters. Optional for filtered records, where `field_id` identifies the field, but send it anyway. | `"single_text"` |
| `type` | string | Legacy data type that goes with the field type, for example `text`, `status` or `date`. **Required.** A filter without it returns a `400`. | `"text"` |
| `match_type` | string | The operator, for example `contains`, `equal` or `before`. Each section below lists the operators a field type accepts. | `"contains"` |
| `values` | array | The operands, as `{ "value": … }` objects. Leave it out for `empty` and `not_empty`. | `[{ "value": "John" }]` |

Some field types accept more optional keys, for example for relative dates, weekdays, the "@me" flag or task list entries. See [Operand keys](#operand-keys).

This example matches all records whose field `1` contains the text `"John"` *and* whose status field `2` is set to option `123`:

**JSON**

*Combined filter*

```json
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

Send this body to `POST /v1/record/filter/app/{app_id}`. Every field in a record or in [Retrieve a single app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app) carries its `field_id` and `field_type`. Category and status fields list their option IDs there, in `config.settings.options`.

Sort and page in the query string with `sort_by`, `sort_desc`, `limit` and `cursor`, see [Pagination](https://developers.tapeapp.com/docs/api/pagination). To filter by creation date, last change or record number without a field, use the [metadata filters](#record-metadata-filters).

## Single text

Use this filter for **Single line text** fields (`single_text`).

**JSON**

*Single text filter*

```json
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

**General behavior**

-   `contains`, `not_contains`, `starts_with` and `ends_with` ignore case.
-   `equal` and `not_equal` are exact matches and case-sensitive.
-   Every operator trims leading and trailing whitespace from the match value.
-   `empty` and `not_empty` take no `values`.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose field value is equal to the match value. |
| `not_equal` | Matches all records whose field value is not equal to the match value. |
| `contains` | Matches all records whose field value contains the match value. |
| `not_contains` | Matches all records whose field value does not contain the match value. |
| `starts_with` | Matches all records whose field value starts with the match value. |
| `ends_with` | Matches all records whose field value ends with the match value. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Multi text

Use this filter for **Multi line text** fields (`multi_text`).

**JSON**

*Multi text filter*

```json
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

**General behavior**

-   The filter matches against the unformatted (plain text) value of the field.
-   `contains`, `not_contains`, `starts_with` and `ends_with` ignore case.
-   `equal` and `not_equal` are exact matches and case-sensitive.
-   Every operator trims leading and trailing whitespace.
-   `empty` and `not_empty` take no `values`.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose unformatted field value is equal to the match value. |
| `not_equal` | Matches all records whose unformatted field value is not equal to the match value. |
| `contains` | Matches all records whose unformatted field value contains the match value. |
| `not_contains` | Matches all records whose unformatted field value does not contain the match value. |
| `starts_with` | Matches all records whose unformatted field value starts with the match value. |
| `ends_with` | Matches all records whose unformatted field value ends with the match value. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Number

Use this filter for **Number** fields (`number`).

**JSON**

*Number filter*

```json
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

Send the number to compare against as a bare numeric value in `values[0].value`. Leave out `values` for `empty` and `not_empty`.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose field value is equal to the provided match value. |
| `not_equal` | Matches all records whose field value is not equal to the provided match value. |
| `smaller` | Matches all records whose field value is smaller than the provided match value. |
| `smaller_or_equal` | Matches all records whose field value is smaller than or equal to the match value. |
| `larger` | Matches all records whose field value is larger than the provided match value. |
| `larger_or_equal` | Matches all records whose field value is larger than or equal to the match value. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Unique ID

Use this filter for **Unique ID** fields (`unique_id`).

**JSON**

*Unique ID filter*

```json
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

A Unique ID field shows the record number Tape counts up per database app. This is the record's [`app_record_id`](https://developers.tapeapp.com/docs/api/resource/field/unique-id): the first record in a database app is `1`, the second `2`, and so on.

**General behavior**

-   Send the match value as a *bare number* without a prefix.
-   The filter compares the underlying number, so `type` is `"number"`, not `"unique_id"`.
-   Leave out `values` for `empty` and `not_empty`.
-   Every record has a record number. `empty` matches no records, and `not_empty` matches every record.

> Your database app has no Unique ID field?
> 
> Use the [`app_record_id` metadata filter](#app-record-id-metadata). It filters on the same number without a field.

**Match types**

The match types are the same as for `number`:

| Match type | Description |
| --- | --- |
| `equal` | Matches the record whose number is equal to the provided match value. |
| `not_equal` | Matches all records whose number is not equal to the provided match value. |
| `smaller` | Matches all records whose number is smaller than the provided match value. |
| `smaller_or_equal` | Matches all records whose number is smaller than or equal to the provided match value. |
| `larger` | Matches all records whose number is larger than the provided match value. |
| `larger_or_equal` | Matches all records whose number is larger than or equal to the provided match value. |
| `empty` | Matches no records, because every record has a number. |
| `not_empty` | Matches every record. |

## Single category

Use this filter for **Single select** fields (`single_category`).

**JSON**

*Single category filter*

```json
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

**General behavior**

-   Send the numeric ID of an option or its label as the match value.
-   Label matching ignores case and leading and trailing whitespace.
-   A label that matches more than one option returns an error. Use the option ID instead.
-   `equal` takes exactly one option. More than one returns a `400`. Use `any` for several options.
-   When you read the filter back, operands come as option IDs.
-   `empty` and `not_empty` take no `values`.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose field value references the option specified. |
| `not_equal` | Matches all records whose field value does not reference the option specified. |
| `any` | Matches all records whose field value references any of the options specified. |
| `none` | Matches all records whose field value references none of the options specified. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Multi category

Use this filter for **Multiple select** fields (`multi_category`).

**JSON**

*Multi category filter*

```json
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

A `multi_category` field holds a set of options, so the match types compare sets:

-   `equal` needs exactly the given options. Order doesn't matter.
-   `contains` needs all given options. The field may hold more.
-   `any` and `none` test for overlap with the given options.

**General behavior**

-   Send the numeric ID of an option or its label.
-   Label matching ignores case and leading and trailing whitespace.
-   An ambiguous label returns an error. Use the option ID instead.
-   When you read the filter back, operands come as option IDs.
-   `empty` and `not_empty` take no `values`.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose field value references exactly the options specified and no others. |
| `contains` | Matches all records whose field value references all of the options specified (and may reference more). |
| `any` | Matches all records whose field value references at least one of the options specified. |
| `none` | Matches all records whose field value references none of the options specified. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Status

Use this filter for **Status** fields (`status`).

**JSON**

*Status filter*

```json
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

**General behavior**

-   Send the numeric ID of a status option or its label.
-   Label matching ignores case and leading and trailing whitespace.
-   An ambiguous label returns an error. Use the option ID instead.
-   When you read the filter back, operands come as option IDs.
-   `completed`, `incomplete`, `empty` and `not_empty` take no `values`.
-   `completed` and `incomplete` test whether the status option the record has is marked as completed.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose field value references the status option specified. |
| `not_equal` | Matches all records whose field value does not reference the status option specified. |
| `any` | Matches all records whose field value references any of the status options specified. |
| `none` | Matches all records whose field value references none of the status options specified. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |
| `completed` | Matches all records whose referenced status option is marked as completed. |
| `incomplete` | Matches all records whose referenced status option is not marked as completed. |

## Single relation

Use this filter for **Relation** fields that hold one record (`single_relation`).

**JSON**

*Single relation filter*

```json
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

Send the IDs of the related records as match values. When you read the filter back, operands come as record IDs. `empty` and `not_empty` take no `values`.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose field value references the record specified. |
| `not_equal` | Matches all records whose field value does not reference the record specified. |
| `any` | Matches all records whose field value references any of the records specified. |
| `none` | Matches all records whose field value references none of the records specified. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Multi relation

Use this filter for **Relation** fields that hold several records (`multi_relation`).

**JSON**

*Multi relation filter*

```json
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

A `multi_relation` field holds a set of related records, so the match types compare sets:

-   `equal` needs exactly the given records. Order doesn't matter.
-   `contains` needs all given records. The field may hold more.
-   `any` and `none` test for overlap.

Send the IDs of the related records as match values. When you read the filter back, operands come as record IDs. `empty` and `not_empty` take no `values`.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose field value references exactly the records specified and no others. |
| `contains` | Matches all records whose field value references all of the records specified (and may reference more). |
| `any` | Matches all records whose field value references at least one of the records specified. |
| `none` | Matches all records whose field value references none of the records specified. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Single user

Use this filter for **Member** fields that hold one member (`single_user`).

**JSON**

*Single user filter*

```json
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

**General behavior**

-   Send the user IDs to filter by. [Retrieve organization users](https://developers.tapeapp.com/docs/api/resource/user#retrieve-organization-users) lists them.
-   To add yourself, set `include_active_user` (the "@me" reference). See [Operand keys](#operand-keys).
-   When you read the filter back, operands come as user IDs.
-   `empty` and `not_empty` take no `values` and don't work with `include_active_user`.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose field value references the user specified. |
| `not_equal` | Matches all records whose field value does not reference the user specified. |
| `any` | Matches all records whose field value references any of the users specified. |
| `none` | Matches all records whose field value references none of the users specified. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Multi user

Use this filter for **Member** fields that hold several members (`multi_user`).

**JSON**

*Multi user filter*

```json
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

A `multi_user` field holds a set of users, so the match types compare sets:

-   `equal` needs exactly the given users. Order doesn't matter.
-   `contains` needs all given users. The field may hold more.
-   `any` and `none` test for overlap.

**General behavior**

-   Send the user IDs to filter by.
-   To add yourself, set `include_active_user` (the "@me" reference). See [Operand keys](#operand-keys).
-   When you read the filter back, operands come as user IDs.
-   `empty` and `not_empty` take no `values` and don't work with `include_active_user`.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose field value references exactly the users specified and no others. |
| `contains` | Matches all records whose field value references all of the users specified (and may reference more). |
| `any` | Matches all records whose field value references at least one of the users specified. |
| `none` | Matches all records whose field value references none of the users specified. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Created by

Use this filter for **Created by** fields (`created_by`). The field holds the user who created the record.

**JSON**

*Created by filter*

```json
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

**General behavior**

-   Send the user IDs to filter by.
-   To add yourself, set `include_active_user` (the "@me" reference). See [Operand keys](#operand-keys). `any` with `include_active_user` selects the records you created.
-   When you read the filter back, operands come as user IDs.
-   The `type` is `contact`, as for a user field. It's not `created_by`.
-   `empty` and `not_empty` take no `values` and don't work with `include_active_user`.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records created by the user specified. |
| `not_equal` | Matches all records not created by the user specified. |
| `any` | Matches all records created by any of the users specified. |
| `none` | Matches all records created by none of the users specified. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Last modified by

Use this filter for **Last edited by** fields (`last_modified_by`). The field holds the user who last changed the record.

**JSON**

*Last modified by filter*

```json
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

**General behavior**

-   Send the user IDs to filter by.
-   To add yourself, set `include_active_user` (the "@me" reference). See [Operand keys](#operand-keys). `any` with `include_active_user` selects the records you changed last.
-   When you read the filter back, operands come as user IDs.
-   The `type` is `contact`, as for a user field. It's not `last_modified_by`.
-   `empty` and `not_empty` take no `values` and don't work with `include_active_user`.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records last modified by the user specified. |
| `not_equal` | Matches all records not last modified by the user specified. |
| `any` | Matches all records last modified by any of the users specified. |
| `none` | Matches all records last modified by none of the users specified. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Single date

Use this filter for **Date** fields with one date (`single_date`).

**JSON**

*Single date filter*

```json
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

Put the target date in the nested `values[0].value.date` as an ISO 8601 string. A bare value (`values[0].value: "2020-01-01"`) also works on input, but a `GET` returns the nested form, which you can send back unchanged. Leave out `values` for `empty` and `not_empty`.

Tape resolves the date to match from `values[0].value.date`, the `relative_date_type` and, for the `num_days_*`, `num_weeks_*` and `num_months_*` types, `values[0].value.offset_amount`. For example, `num_days_before` with an offset of `1` and a date of `2020-01-01` resolves to `2019-12-31`. `today`, `tomorrow` and `yesterday` need no value ([all values](#operand-keys)).

Four operators select a period instead of a single day. Each reads its own operand key (values under [Operand keys](#operand-keys)):

-   `within` pairs with `relative_date_range_type` and matches a named or bounded range, for example `current_week`, `past_num_days` or `exact_range`. For `exact_range`, send the start in `values[0].value.date` and the end in the top-level `end_date`. For `next_num_days` and `past_num_days`, send the count in `offset_amount`.
-   `on_weekday` pairs with `weekday` (`monday` to `sunday`).
-   `in_quarter_of_year` pairs with `quarter_of_year` (`q1` to `q4`).
-   `in_month_of_year` pairs with `month_of_year` (`january` to `december`).

> Does a date filter include the target day?
> 
> Tape expands the date to a full day, from start of day to end of day in your timezone. The time of day in the value doesn't count. So not all boundary operators include the day:
> 
> -   `before` matches strictly before the *start* of the target day. The day itself is excluded.
> -   `after` matches strictly after the *end* of the target day. The day itself is excluded.
> -   `on_or_before` includes the whole day up to its *end*.
> -   `on_or_after` includes the whole day from its *start*.
> -   `equal` matches the whole target day. `not_equal` matches everything outside it.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose field date falls on the target day. |
| `not_equal` | Matches all records whose field date does not fall on the target day. |
| `before` | Matches all records whose field date is before the *start* of the target day (day excluded). |
| `on_or_before` | Matches all records whose field date is on or before the target day (whole day included). |
| `after` | Matches all records whose field date is after the *end* of the target day (day excluded). |
| `on_or_after` | Matches all records whose field date is on or after the target day (whole day included). |
| `within` | Matches all records whose field date falls within the range selected by `relative_date_range_type`. |
| `on_weekday` | Matches all records whose field date falls on the supplied `weekday`. |
| `in_quarter_of_year` | Matches all records whose field date falls in the supplied `quarter_of_year`. |
| `in_month_of_year` | Matches all records whose field date falls in the supplied `month_of_year`. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Range date

Use this filter for **Date** fields with a start and an end date (`range_date`).

**JSON**

*Range date filter*

```json
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

The field stores a start and an end date. Operands and [operand keys](#operand-keys) are the same as for [Single date](#single-date). Leave out `values` for `empty` and `not_empty`.

The typical combination is `within` with `relative_date_range_type: "exact_range"`. It tests the stored range against a window from `values[0].value.date` (start) to the top-level `end_date` (end).

> How do range operators compare dates?
> 
> Tape expands each date to a full day, from start of day to end of day in your timezone. The time of day doesn't count. Each operator then tests the stored `[start, end]` interval against the target day or window:
> 
> -   `equal` and `within` match any range that *overlaps* it, not only ranges that equal it or sit inside it.
> -   `before`, `after`, `on_or_before` and `on_or_after` compare the ends of the range with the day boundary.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose range *overlaps* the target day. |
| `not_equal` | Matches all records whose range does *not* overlap the target day. |
| `before` | Matches all records whose range starts before the *start* of the target day. |
| `on_or_before` | Matches all records whose range falls on or before the target day. |
| `after` | Matches all records whose range falls after the *end* of the target day. |
| `on_or_after` | Matches all records whose range falls on or after the target day. |
| `within` | Matches all records whose range *overlaps* the range selected by `relative_date_range_type`. |
| `on_weekday` | Matches all records whose range falls on the supplied `weekday`. |
| `in_quarter_of_year` | Matches all records whose range falls in the supplied `quarter_of_year`. |
| `in_month_of_year` | Matches all records whose range falls in the supplied `month_of_year`. |
| `empty` | Matches all records whose field value is empty. |
| `not_empty` | Matches all records whose field value is not empty. |

## Created at

Use this filter for **Created on** fields (`created_on`). It filters by the creation date of the record.

> Your database app has no Created on field?
> 
> Use the [`created_at` metadata filter](#created-at-metadata). It works in every database app, with or without the field.

**JSON**

*Created at filter*

```json
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

The `field_type` is `created_on`, and the `type` is `date`. Operands, operators and [operand keys](#operand-keys) are the same as for [Single date](#single-date). Leave out `values` for `empty` and `not_empty`.

> Need exact timestamps?
> 
> Tape ignores the time of day and expands the date to a full day in your timezone. `before` and `after` exclude that day, `on_or_before` and `on_or_after` include it. The [`created_at` metadata filter](#created-at-metadata) compares exact timestamps and includes the bound for all four operators.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose creation date falls on the target day. |
| `not_equal` | Matches all records whose creation date does not fall on the target day. |
| `before` | Matches all records created before the *start* of the target day (day excluded). |
| `on_or_before` | Matches all records created on or before the target day (whole day included). |
| `after` | Matches all records created after the *end* of the target day (day excluded). |
| `on_or_after` | Matches all records created on or after the target day (whole day included). |
| `within` | Matches all records whose creation date falls within the range selected by `relative_date_range_type`. |
| `on_weekday` | Matches all records whose creation date falls on the supplied `weekday`. |
| `in_quarter_of_year` | Matches all records whose creation date falls in the supplied `quarter_of_year`. |
| `in_month_of_year` | Matches all records whose creation date falls in the supplied `month_of_year`. |
| `empty` | Matches all records with no creation date. |
| `not_empty` | Matches all records that have a creation date. |

## Last modified at

Use this filter for **Last edited on** fields (`last_modified_on`). It filters by the date of the last change to the record.

> Your database app has no Last edited on field?
> 
> Use the [`last_modified_at` metadata filter](#last-modified-at-metadata). It works in every database app, with or without the field.

**JSON**

*Last modified at filter*

```json
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

The `field_type` is `last_modified_on`, and the `type` is `date`. In the example, `num_weeks_before` with `offset_amount: 1` resolves to one week ago. Operands, operators and [operand keys](#operand-keys) are the same as for [Single date](#single-date). Leave out `values` for `empty` and `not_empty`.

> Need exact timestamps?
> 
> Tape ignores the time of day and expands the date to a full day in your timezone. `before` and `after` exclude that day, `on_or_before` and `on_or_after` include it. The [`last_modified_at` metadata filter](#last-modified-at-metadata) compares exact timestamps and includes the bound for all four operators.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches all records whose last-modified date falls on the target day. |
| `not_equal` | Matches all records whose last-modified date does not fall on the target day. |
| `before` | Matches all records last modified before the *start* of the target day (day excluded). |
| `on_or_before` | Matches all records last modified on or before the target day (whole day included). |
| `after` | Matches all records last modified after the *end* of the target day (day excluded). |
| `on_or_after` | Matches all records last modified on or after the target day (whole day included). |
| `within` | Matches all records whose last-modified date falls within the range selected by `relative_date_range_type`. |
| `on_weekday` | Matches all records whose last-modified date falls on the supplied `weekday`. |
| `in_quarter_of_year` | Matches all records whose last-modified date falls in the supplied `quarter_of_year`. |
| `in_month_of_year` | Matches all records whose last-modified date falls in the supplied `month_of_year`. |
| `empty` | Matches all records with no last-modified date. |
| `not_empty` | Matches all records that have a last-modified date. |

## Calculation

Use this filter for **Calculation** fields (`calculation`).

**JSON**

*Calculation filter*

```json
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

A calculation field returns a *text*, a *number* or a *date*, depending on its script. The result type decides which match types make sense. Send the same operand as for the matching field type:

-   **Number result:** use the number operators with a bare number in `values[0].value`, as for a [Number](#number) field.
-   **Text result:** use the text operators with a string in `values[0].value`, as for a [Single text](#single-text) field.
-   **Date result:** use the date operators with the nested `values[0].value.date` (with optional `offset_amount`) and the date operand keys, as for a [Single date](#single-date) field (see [Operand keys](#operand-keys)).

**General behavior**

-   `empty` and `not_empty` work for every result type. Leave out `values`.
-   `within`, `on_weekday`, `in_quarter_of_year` and `in_month_of_year` work only when the calculation returns a date.
-   The relative dates `today`, `tomorrow` and `yesterday` work only when the calculation returns a date.
-   Using a date-only operator on a text or number calculation returns a `400`.
-   A text operator on a number calculation, for example `contains`, returns a `500` with `unknown`. The date comparisons `before`, `after`, `on_or_before` and `on_or_after` can do the same. Use only the operators of the result type.

**Match types**

The table lists the match types of all result types together.

| Match type | Applies to | Description |
| --- | --- | --- |
| `empty` | any | Matches all records whose field value is empty. |
| `not_empty` | any | Matches all records whose field value is not empty. |
| `equal` | number, text, date | Matches all records whose field value is equal to the provided match value (day-granular for a date result). |
| `not_equal` | number, text, date | Matches all records whose field value is not equal to the provided match value. |
| `smaller` | number | Matches all records whose field value is smaller than the provided match value. |
| `smaller_or_equal` | number | Matches all records whose field value is smaller than or equal to the match value. |
| `larger` | number | Matches all records whose field value is larger than the provided match value. |
| `larger_or_equal` | number | Matches all records whose field value is larger than or equal to the match value. |
| `contains` | text | Matches all records whose field value contains the provided match value. |
| `not_contains` | text | Matches all records whose field value does not contain the provided match value. |
| `starts_with` | text | Matches all records whose field value starts with the provided match value. |
| `ends_with` | text | Matches all records whose field value ends with the provided match value. |
| `before` | date | Matches all records whose field date is before the *start* of the target day (day excluded). |
| `on_or_before` | date | Matches all records whose field date is on or before the target day (whole day included). |
| `after` | date | Matches all records whose field date is after the *end* of the target day (day excluded). |
| `on_or_after` | date | Matches all records whose field date is on or after the target day (whole day included). |
| `within` | date | Matches all records whose field date falls within the range selected by `relative_date_range_type`. |
| `on_weekday` | date | Matches all records whose field date falls on the supplied `weekday`. |
| `in_quarter_of_year` | date | Matches all records whose field date falls in the supplied `quarter_of_year`. |
| `in_month_of_year` | date | Matches all records whose field date falls in the supplied `month_of_year`. |

## Multi email

Use this filter for **Email** fields (`multi_email`).

**JSON**

*Multi email filter*

```json
{
  "filters": [
    {
      "field_id": "1",
      "field_type": "multi_email",
      "match_type": "fully_includes",
      "values": [{ "value": "juliet@acme.com" }],
      "type": "email"
    }
  ]
}
```

**General behavior**

-   An email field can hold several addresses. A record matches when *at least one* address meets the condition.
-   `not_contains` matches when *no* address contains the value. `empty` matches when there are no addresses.
-   Matching ignores case and leading and trailing whitespace in the match value.

**Match types**

| Match type | Description |
| --- | --- |
| `fully_includes` | Matches records that have at least one email entry *equal to* the match value in full. |
| `contains` | Matches records that have at least one email entry *containing* the match value. |
| `not_contains` | Matches records where *none* of the email entries contain the match value. |
| `starts_with` | Matches records that have at least one email entry *starting with* the match value. |
| `ends_with` | Matches records that have at least one email entry *ending with* the match value. |
| `empty` | Matches records whose field value is empty (no email entries). Omit `values`. |
| `not_empty` | Matches records whose field value is not empty (at least one email entry). Omit `values`. |

## Multi phone

Use this filter for **Phone** fields (`multi_phone`).

**JSON**

*Multi phone filter*

```json
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

**General behavior**

-   A phone field can hold several numbers. A record matches when *at least one* number meets the condition.
-   `not_contains` matches when *no* number contains the value. `empty` matches when there are no numbers.
-   Matching ignores case and leading and trailing whitespace in the match value.

**Match types**

| Match type | Description |
| --- | --- |
| `fully_includes` | Matches records that have at least one phone entry *equal to* the match value in full. |
| `contains` | Matches records that have at least one phone entry *containing* the match value. |
| `not_contains` | Matches records where *none* of the phone entries contain the match value. |
| `starts_with` | Matches records that have at least one phone entry *starting with* the match value. |
| `ends_with` | Matches records that have at least one phone entry *ending with* the match value. |
| `empty` | Matches records whose field value is empty (no phone entries). Omit `values`. |
| `not_empty` | Matches records whose field value is not empty (at least one phone entry). Omit `values`. |

## Multi link

Use this filter for **Link** fields (`multi_link`).

**JSON**

*Multi link filter*

```json
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

**General behavior**

-   The `type` for a link field is `embed`, not `link`.
-   A link field can hold several links. The filter matches the **URL** of each link and ignores case and surrounding whitespace.
-   A record matches when at least one URL meets the condition.
-   Link fields have *no exact match*. `equal` and `fully_includes` return a `400`. Use `contains`, `starts_with` or `ends_with` instead.

**Match types**

| Match type | Description |
| --- | --- |
| `contains` | Matches records that have at least one link whose URL *contains* the match value. |
| `not_contains` | Matches records where *none* of the link URLs contain the match value. |
| `starts_with` | Matches records that have at least one link whose URL *starts with* the match value. |
| `ends_with` | Matches records that have at least one link whose URL *ends with* the match value. |
| `empty` | Matches records whose field value is empty (no links). Omit `values`. |
| `not_empty` | Matches records whose field value is not empty (at least one link). Omit `values`. |

## Single location

Use this filter for **Location** fields (`single_location`).

**JSON**

*Single location filter*

```json
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

**General behavior**

-   The filter matches *free text in the formatted address*. This is street address, postal code, city, state, country and the original formatted address, joined together.
-   You can't filter on a single part, such as the city or the country alone.
-   Matching ignores case and leading and trailing whitespace in the match value.

**Match types**

| Match type | Description |
| --- | --- |
| `contains` | Matches records whose formatted address *contains* the match value. |
| `not_contains` | Matches records whose formatted address does *not* contain the match value (records with no address set also match). |
| `empty` | Matches records whose field value is empty (no address set). A coordinate-only value counts as *not* empty. Omit `values`. |
| `not_empty` | Matches records whose field value is not empty (an address or coordinates are set). Omit `values`. |

## Single attachment

Use this filter for **Files** fields that hold one file (`single_attachment`).

**JSON**

*Single attachment filter*

```json
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

**General behavior**

-   The `type` for an attachment field is `file`.
-   The filter matches the file *name*, never the file ID. Send the match value as a *string*.
-   Matching ignores case and leading and trailing whitespace in the match value.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches records whose attached file name *equals* the match value. |
| `not_equal` | Matches records whose attached file name does *not* equal the match value. |
| `contains` | Matches records whose attached file name *contains* the match value. |
| `not_contains` | Matches records whose attached file name does *not* contain the match value. |
| `starts_with` | Matches records whose attached file name *starts with* the match value. |
| `ends_with` | Matches records whose attached file name *ends with* the match value. |
| `empty` | Matches records with no file attached. Omit `values`. |
| `not_empty` | Matches records with a file attached. Omit `values`. |

## Multi attachment

Use this filter for **Files** fields that hold several files (`multi_attachment`).

**JSON**

*Multi attachment filter*

```json
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

**General behavior**

-   As for Single attachment, the `type` is `file` and the filter matches file *names*. Send a string.
-   The field can hold several files, so every match type checks all of them.
-   `equal` and `not_equal` compare the match value with each file name exactly.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches records where at least one attached file name *equals* the match value. |
| `not_equal` | Matches records where *no* attached file name equals the match value (records with no attachments also match). |
| `contains` | Matches records where an attached file name *contains* the match value. |
| `not_contains` | Matches records where *none* of the attached file names contain the match value. |
| `starts_with` | Matches records where at least one attached file name *starts with* the match value. |
| `ends_with` | Matches records where at least one attached file name *ends with* the match value. |
| `empty` | Matches records with no files attached. Omit `values`. |
| `not_empty` | Matches records with at least one file attached. Omit `values`. |

## Multi image

Use this filter for **Image** fields (`multi_image`).

**JSON**

*Multi image filter*

```json
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

**General behavior**

-   Image fields share the `type` `file` with attachment fields. `field_type` tells them apart.
-   The filter matches the image file *name*. Send a string.
-   The field can hold several images, so every match type checks all of them. `equal` and `not_equal` compare the match value with each file name exactly.
-   Matching ignores case and leading and trailing whitespace in the match value.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches records where at least one image file name *equals* the match value. |
| `not_equal` | Matches records where *no* image file name equals the match value (records with no images also match). |
| `contains` | Matches records where an image file name *contains* the match value. |
| `not_contains` | Matches records where *none* of the image file names contain the match value. |
| `starts_with` | Matches records where at least one image file name *starts with* the match value. |
| `ends_with` | Matches records where at least one image file name *ends with* the match value. |
| `empty` | Matches records with no images. Omit `values`. |
| `not_empty` | Matches records with at least one image. Omit `values`. |

## Checklist

Use this filter for **Task list** fields (`checklist`). Choose the entry property to filter on with `entry_property`: `title`, `assignee`, `status` or `due_date`.

**JSON**

*Task list filter*

```json
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

A task list holds entries (subtasks in Tape). Each entry has a *title*, an optional *assignee*, a completion *status* and an optional *due date*. Every match type checks all entries: `title` with `contains` matches a record when *any* entry title contains the value.

Without `entry_property`, the filter applies to the whole field and supports only `empty` and `not_empty`: the task list has no entries, or at least one entry.

The `type` is `checklist` for every task list filter. This table shows the match types and the operand for each `entry_property`. Any other combination returns a `400`.

| `entry_property` | Allowed `match_type` | Operand |
| --- | --- | --- |
| *(omitted)* | `empty`, `not_empty` | none, leave out `values` |
| `title` | `contains`, `not_contains`, `empty`, `not_empty` | `values: [{ "value": "<text>" }]` (a string); leave out `values` for `empty` / `not_empty` |
| `assignee` | `equal`, `not_equal`, `empty`, `not_empty` | `values: [{ "value": <user_id> }, …]` (one or more user IDs) and/or `include_active_user: true`; leave out `values` for `empty` / `not_empty` |
| `status` | `equal` | `values: [{ "value": <boolean> }]`: `true` = completed, `false` = incomplete |
| `due_date` | `equal`, `not_equal`, `empty`, `not_empty`, `before`, `after`, `on_or_before`, `on_or_after`, `within` | a date operand, see [Operand keys](#operand-keys); leave out `values` for `empty` / `not_empty` |

**General behavior**

-   **`status` uses a boolean, not a match type.** The [Status](#status) field uses the match types `completed` and `incomplete`. A task list status filter uses `match_type: "equal"` with a boolean: `false` for incomplete entries, `true` for completed entries.
-   **`include_active_user` works only for the assignee.** Use the "@me" flag `include_active_user: true` only with `entry_property: "assignee"`, and only with `equal` or `not_equal`, not with `empty` or `not_empty`. See [Operand keys](#operand-keys).
-   **`due_date` has no `exact_range`.** `within` needs a `relative_date_range_type`. Unlike date fields, task lists don't support `exact_range`, because there is no exact end date to store. Use a bounded range such as `next_num_days` or `current_week`.

**Example: incomplete entries** (status with a boolean value)

**JSON**

*Task list filter: incomplete entries*

```json
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

**Example: due within the next 7 days** (`due_date` with `within` and a relative range)

**JSON**

*Task list filter: due within the next 7 days*

```json
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

**Example: assigned to me** (`assignee` with `include_active_user`)

**JSON**

*Task list filter: assigned to me*

```json
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

**Match types**

| Match type | Valid `entry_property` | Description |
| --- | --- | --- |
| `equal` | `assignee`, `status`, `due_date` | An entry matches the operand: assigned to the given user / completion equals the boolean / due date equals the date. |
| `not_equal` | `assignee`, `due_date` | Negation of `equal`. |
| `contains` | `title` | An entry title contains the match value. |
| `not_contains` | `title` | No entry title contains the match value. |
| `empty` | *(omitted)*, `title`, `assignee`, `due_date` | Field level: the task list has no entries. Entry level: the title, assignee or due date of an entry is empty. Omit `values`. |
| `not_empty` | *(omitted)*, `title`, `assignee`, `due_date` | Complement of `empty`. Omit `values`. |
| `before` | `due_date` | An entry's due date is before the resolved date. |
| `after` | `due_date` | An entry's due date is after the resolved date. |
| `on_or_before` | `due_date` | An entry's due date is on or before the resolved date. |
| `on_or_after` | `due_date` | An entry's due date is on or after the resolved date. |
| `within` | `due_date` | An entry's due date falls within the given range. Requires `relative_date_range_type`. |

## Operand keys

Operand keys are optional properties next to `values` that refine the condition. Most apply to date filters: Single date, Range date, Created at, Last modified at, calculations that return a date, and task list `due_date` filters.

Use each key only with the field types listed below. Tape ignores a key that doesn't fit, without an error: `weekday` on a text filter changes nothing.

> Where does `offset_amount` go?
> 
> All operand keys below are *top-level* properties of the filter object, except `offset_amount`. It goes *inside* the value at `values[0].value.offset_amount`. At the top level, Tape ignores it, so a `num_days_before` filter with only a top-level `offset_amount` returns a `400`.

| Operand key | Where it goes | Applies to | Used with |
| --- | --- | --- | --- |
| `relative_date_type` | top-level | `date` filters, checklist `due_date` | resolves the target date for a comparison |
| `relative_date_range_type` | top-level | `date` filters, checklist `due_date` | `match_type: within` |
| `end_date` | top-level | `date` filters | `within` with `relative_date_range_type: exact_range` |
| `weekday` | top-level | `date` filters | `match_type: on_weekday` |
| `quarter_of_year` | top-level | `date` filters | `match_type: in_quarter_of_year` |
| `month_of_year` | top-level | `date` filters | `match_type: in_month_of_year` |
| `include_active_user` | top-level | user filters, checklist `assignee` | boolean "@me" flag |
| `entry_property` | top-level | `checklist` | selects the entry sub-property |
| `offset_amount` | nested in `values[0].value` | `date` filters, checklist `due_date` | the `num_*` / `next_num_days` / `past_num_days` types |

### `relative_date_type`

Resolves a comparison (`equal`, `before`, `after`, `on_or_before`, `on_or_after` and so on) to a single date. Supported values:

| `relative_date_type` | Value to provide | Meaning |
| --- | --- | --- |
| `today`, `tomorrow`, `yesterday` | none | the corresponding day |
| `exact_date` | `values[0].value.date` (ISO-8601 string) | an absolute calendar date |
| `num_days_before`, `num_days_after` | `values[0].value.offset_amount` (integer) | N days before / after |
| `num_weeks_before`, `num_weeks_after` | `values[0].value.offset_amount` (integer) | N weeks before / after |
| `num_months_before`, `num_months_after` | `values[0].value.offset_amount` (integer) | N months before / after |

**General behavior**

-   For `single_date` and `range_date` fields, Tape applies the `num_*` offset to the date in `values[0].value.date`.
-   For `created_on`, `last_modified_on` and task list `due_date` filters, Tape applies the offset to the current date and ignores any date you send.
-   `exact_date` accepts only an ISO 8601 *string*. A numeric epoch doesn't work. `end_date` accepts an epoch number.

### `relative_date_range_type`

Selects a date range for `match_type: within`. Supported values:

| `relative_date_range_type` | Value to provide |
| --- | --- |
| `current_week`, `current_month`, `current_year`, `past_week`, `past_month`, `past_year`, `next_week`, `next_month`, `next_year` | none |
| `next_num_days`, `past_num_days` | `values[0].value.offset_amount` (integer) |
| `exact_range` | `values[0].value.date` (start) *and* `end_date` (end) |

`exact_range` works only on `date` fields. Task list `due_date` filters support every value *except* `exact_range`.

### `end_date`

The *end* of the range for a `within` filter with `exact_range` on a `date` field. Send an ISO date string or an epoch number. The *start* of the range comes from `values[0].value.date`.

### `weekday`

One of `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`. Use it with `match_type: on_weekday` on `date` fields to match records whose date falls on this weekday.

### `quarter_of_year`

One of `q1`, `q2`, `q3`, `q4`. Use it with `match_type: in_quarter_of_year` on `date` fields.

### `month_of_year`

One of `january`, `february`, `march`, `april`, `may`, `june`, `july`, `august`, `september`, `october`, `november`, `december`. Use it with `match_type: in_month_of_year` on `date` fields.

### `include_active_user`

A boolean "@me" flag for the user your credential belongs to. Set `include_active_user: true` to match that user without a fixed user ID.

-   It works with user filters (`single_user`, `multi_user`, `created_by`, `last_modified_by`) and with task list `assignee` filters.
-   For a task list, it works *only* with `entry_property: "assignee"` and *only* with `equal` or `not_equal`, not with `empty` or `not_empty`.
-   You can combine it with user IDs in `values`.

### `entry_property`

Only for task lists: the entry property the filter applies to (`title`, `assignee`, `status` or `due_date`). Without it, the filter applies to the whole field and supports only `empty` and `not_empty` (see [Checklist](#checklist)).

### `offset_amount`

An integer *inside* the value object at `values[0].value.offset_amount`, not a top-level key. It gives the count for the `num_days_*`, `num_weeks_*` and `num_months_*` relative date types and for the `next_num_days` and `past_num_days` range types.

## Record metadata filters

Metadata filters match properties every record has, so they need *no field* in the database app. Set only `type` and leave out `field_id` and `field_type`:

| `type` | Filters on | Match `value` |
| --- | --- | --- |
| `created_at` | When the record was created | nested, `{ "date": "…" }` |
| `last_modified_at` | When the record was last modified | nested, `{ "date": "…" }` |
| `app_record_id` | The app-specific ID of the record (the `app_record_id` property) | bare value, for example `123` |

Put metadata filters in the same `filters` array as field filters. They combine with the same `AND`.

> Where does the timestamp match value go?
> 
> `created_at` and `last_modified_at` read the match value from `values[0].value.date`, a nested object. Field filters and `app_record_id` use a bare value at `values[0].value`.

### Created at (metadata)

Use this filter to find records by creation time, without a Created on field in the database app.

**JSON**

*Created at metadata filter: bounded window*

```json
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

**General behavior**

-   **Absolute UTC dates only.** Send a full ISO 8601 timestamp as `value.date`. Leave out `relative_date_type` or set it to `exact_date`. A relative value such as `num_days_before` or `num_weeks_after` returns a `400`. Tape accepts `offset_amount` but ignores it. Don't rely on it.
-   **All bounds are inclusive.** Every match type compares with `>=` or `<=`. `after` works like `on_or_after`, and `before` like `on_or_before`.
-   **Use two filters for a window:** one lower bound and one upper bound, as in the example. Repeating a bound in the same direction *narrows* the window: the latest lower bound and the earliest upper bound win. It never widens it.
-   **Invalid input returns a `400`** instead of being dropped: an unsupported `match_type`, a missing or unreadable `date`, or a year outside `1` to `9999`.

**Match types**

| Match type | Description |
| --- | --- |
| `after`, `on_or_after`, `larger`, `larger_or_equal` | Matches records created *on or after* the value. |
| `before`, `on_or_before`, `smaller`, `smaller_or_equal` | Matches records created *on or before* the value. |

Any other match type (`equal`, `empty`, `not_empty` and so on) returns a `400`.

For a database app with a Created on field, see [Created at](#created-at).

### Last modified at (metadata)

Use this filter to find records by the time of their last change. It works like [Created at (metadata)](#created-at-metadata) in every respect: same match types, inclusive bounds, absolute dates only and the same `400` behavior. Use `type: "last_modified_at"`.

**JSON**

*Last modified at metadata filter*

```json
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

> Why don't unedited records match?
> 
> A record nobody edited after creating it has no last-modified timestamp, so *no* `last_modified_at` filter matches it. To get everything created *or* modified since a point in time, merge two requests as in [Pattern: incremental sync](#pattern-incremental-sync).

### App record ID (metadata)

Use this filter to find records by their app-specific ID. This is the sequential [`app_record_id`](https://developers.tapeapp.com/docs/api/resource/field/unique-id) every record returns: the first record in a database app is `1`, the second `2`, and so on.

**JSON**

*App record ID metadata filter*

```json
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

**General behavior**

-   The match value is a *bare value* at `values[0].value`, not a nested object.
-   The value must be a number. A missing or non-numeric value returns a `400` for every match type, including `empty` and `not_empty`.
-   Any match type not in the table returns a `400`.
-   Every record has an `app_record_id`. `empty` matches nothing, and `not_empty` matches every record.

**Match types**

| Match type | Description |
| --- | --- |
| `equal` | Matches the record whose `app_record_id` equals the value. |
| `not_equal` | Matches all records whose `app_record_id` does not equal the value. |
| `larger` | Matches all records whose `app_record_id` is larger than the value. |
| `larger_or_equal` | Matches all records whose `app_record_id` is larger than or equal to the value. |
| `smaller` | Matches all records whose `app_record_id` is smaller than the value. |
| `smaller_or_equal` | Matches all records whose `app_record_id` is smaller than or equal to the value. |
| `empty` | Matches no records, because every record has an `app_record_id`. |
| `not_empty` | Matches every record. |

### Pattern: incremental sync

Use the timestamp metadata filters to get only the records that changed since your last run. You don't need Created on or Last edited on fields.

Filters have no `OR`, so "created *or* modified since `T`" takes two requests:

**Created since T**

*Request 1: records created since T*

```json
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

**Modified since T**

*Request 2: records modified since T*

```json
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

Merge the results and remove duplicates by `record_id`. Request 2 misses records nobody edited after creation. Request 1 catches them.

> Why does my sync return fewer records now?
> 
> Earlier, the API accepted the `created_at` and `last_modified_at` metadata filters but ignored them and returned all records. Now it applies them, so an integration that relied on the old behavior gets fewer records.

## Next steps

[

Record

send your filters and get the records that match.

](https://developers.tapeapp.com/docs/api/resource/record#retrieve-filtered-records-for-an-app)[

View

store filters in a view.

](https://developers.tapeapp.com/docs/api/resource/view)[

Field value

the value format of every field type.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Date & timezone

how the API reads and returns dates.

](https://developers.tapeapp.com/docs/api/date-timezone)[

Search

find records by text in any field, across all your database apps or only in some (`app_ids`).

](https://developers.tapeapp.com/docs/api/resource/search)[

Capabilities

what `records:read` and `apps:edit` allow.

](https://developers.tapeapp.com/docs/api/capabilities)
