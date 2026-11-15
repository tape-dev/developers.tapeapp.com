# Filters

> The Tape automation filter model — the recursive and/or condition tree, the operators, and the tagged value union.

Use a filter to decide *whether* an automation runs.

A filter is a recursive `and`/`or` tree of conditions that the triggering record must match.

## The tree: groups and conditions

*Filter — "Priority is High AND Amount ≥ 1000"*

```json
{
  "operator": "and",
  "rows": [
    {
      "subject": { "kind": "variable", "source": "field", "field_id": 512, "field_type": "single_category", "previous": false, "collection": false, "triggering": false },
      "operator": "is_any_of",
      "value": { "type": "ids", "ids": [9001] }
    },
    {
      "subject": { "kind": "variable", "source": "field", "field_id": 513, "field_type": "number", "previous": false, "collection": false, "triggering": false },
      "operator": "greater_or_equal_than",
      "value": { "type": "number", "number": ["1000"] }
    }
  ]
}
```

A *group* combines its `rows`, nested groups or conditions, with `and` (match all) or `or` (match any). The *root* group has no `id`.

| Property | Type | On | Description |
| --- | --- | --- | --- |
| `id` | `string` | Nested nodes | Opaque node ID. Optional on input, Tape creates one when you leave it out. Present on every read. |
| `operator` | `string` | Group | `and` or `or`. |
| `rows` | `array` | Group | Nested groups and conditions. |
| `subject` | `object` | Condition | A [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) to the value being tested: a field, record metadata, a trigger output or an action's file collection. See [v1 limitations](#v1-limitations). |
| `operator` | `string` | Condition | One of the [operators](#operators) below. |
| `value` | `object` | Condition | The tagged comparison value, see [The value union](#the-value-union). Absent for operators without a value. |
| `code` | `array` | Condition | A raw code condition, a [code dynamic value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values). A *script condition* has `code` *instead of* `subject`, `operator` and `value`. |

**General behavior**

-   An automation without a filter has `filter: null` and runs every time.
-   To run without a filter, send `filter: null` explicitly. An explicitly *empty* top-level group (`rows: []`) returns `400`. It narrows nothing and would fire on every record.
-   An empty group is still allowed *inside* an action, for example a `conditional` `condition` that is true every time, or a `match_condition` that keeps everything. The trigger filter already limits which records the automation runs on.

> Where else is this tree used?
> 
> The same public tree (`operator: "and" | "or"`, `rows`) appears everywhere conditions do:
> 
> -   an automation's `filter`,
> -   a control-flow action's `condition`, `break_condition` and `continue_condition`,
> -   a condition inside an action's `config`, for example the `match_condition` of `collect_app_records` or `filter_record_collection`.
> 
> All of them use the same lower-case `operator` and `rows`. See [Actions](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions).

## Operators

Each operator has a `value_arity`: `none` (no value, for example `is_empty`), `single` or `multiple`. The valid operators differ per field type. [`GET /v1/automation/meta/filter?field_type=…`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) returns the exact set.

| Operator | Arity |  | Operator | Arity |
| --- | --- | --- | --- | --- |
| `is` | single |  | `has_any_of` | multiple |
| `is_not` | single |  | `has_all_of` | multiple |
| `contains` | single |  | `has_none_of` | multiple |
| `does_not_contain` | single |  | `is_exactly` | multiple |
| `starts_with` | single |  | `is_any_of` | multiple |
| `ends_with` | single |  | `is_none_of` | multiple |
| `greater_than` | single |  | `has_changed_to_any_of` | multiple |
| `greater_or_equal_than` | single |  | `is_empty` | none |
| `less_than` | single |  | `is_not_empty` | none |
| `less_or_equal_than` | single |  | `is_completed` | none |
| `is_before` | single |  | `is_incomplete` | none |
| `is_after` | single |  | `has_changed` | none |
| `glob_pattern` | single |  |  |  |
| `has_changed_to` | single |  |  |  |

### File name patterns

`glob_pattern` (label **Matches pattern**) checks whether file names match a glob pattern, for example `"*.pdf"`.

-   It works only on subjects that carry files: `single_attachment`, `multi_attachment`, `multi_image`, an action's file collection, webhook payload files and comment attachments.
-   Tape rejects it in `collect_app_records`, `collect_referenced_records`, `collected_records_collect_referenced_records` and in the `search_condition` of a relation field assignment.

### Change tracking

`has_changed`, `has_changed_to` and `has_changed_to_any_of` compare a field with the previous revision of the record.

-   They're valid only under a `record_updated` trigger, or after a `current_record_get_previous_revision` action on the same app. Otherwise `validate` reports the automation as invalid.
-   `has_changed` (label **Has changed**) takes no value.
-   `has_changed_to` (label **Has changed to**) works on subjects with a single choice: status, single category, single user, single relation, last modified by, and on a checklist.
-   `has_changed_to_any_of` (label **Has changed to any of**) works on subjects with multiple choices: multi category, multi user, multi relation.

## The value union

The condition `value` is tagged by `type`, so you can read it without knowing the rules for each field:

| `type` | Payload | Meaning |
| --- | --- | --- |
| `text` | `text`: a [template dynamic value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Text or template comparison. |
| `number` | `number`: a [code dynamic value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Number comparison as a code expression. |
| `ids` | `ids`: array of `number` or [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | A set of option, status, relation or user IDs. |
| `date` | `date`: `{ base?, operator, unit, amount }` | Relative date. `operator` is `"plus"` or `"minus"`, `unit` is `"hour"`, `"day"`, `"week"` or `"month"`. See [Relative dates](#relative-dates). |
| `boolean` | `boolean` | Boolean comparison. Comes from a webhook payload property subject. Sends back without change. |
| `entity_type` | `entity_type`: `string` | Comparison of the comment or reply entity type. Sends back without change. |

[Retrieve a single app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app) returns the option IDs for `ids` in `config.settings.options` of each field.

### Relative dates

-   `base` is *optional*. Without it, Tape uses the `current_date` global. Tape stores it on write, so it reads back and sends back unchanged. Set a `base` reference to count from something other than today.
-   `operator` and `unit` only accept the listed values. Anything else returns `400`. Leave them out to keep the defaults `plus` and `day`.
-   `amount` is a code dynamic value: an *array of strings* (for example `["1"]`) or a plain *string* (`"1"`, returned as `["1"]`). A plain *number* (`1`) returns `400`. A read returns the array form, so a retrieved definition sends back unchanged.

### Match the value type to the field

Tape reads a value by its tag, but *writes* it by field. On create and update, Tape picks the value channel from the *type of the subject field*:

-   number and unique ID → `number`
-   date fields → `date`
-   category, status, relation and user → `ids`
-   text → `text`

On create and update:

-   A value whose `type` doesn't match the field's channel returns `400`. The check goes through *all levels* of nested groups. The response names the condition (by its `id`, or by its JSON path, for example `filter.rows[1].rows[0]`) and the tag it expected.
-   An *empty* comparison value returns `400` the same way. So does an *arity* mismatch: a value on an operator with arity `none` such as `is_empty`, or a missing value on an operator that needs one.
-   Existing rows aren't checked again. Definitions saved before this check, or in the automation editor in Tape, can still hold an empty comparison.
-   An *operator* outside the field type's channel is *not* rejected if it's otherwise well-formed, for example a text operator on a number field with a number value. It passes `validate` and never matches when the automation runs.

`meta/filter` returns only operators, not the accepted tag. Match the tag to the field yourself, and use only the operators it returns for the field's type.

> Why does my filter match every record?
> 
> A value built from a *reference* (a field, a variable or the output of an earlier action) passes the write check, but it can resolve to *empty* for a record. An empty value matches everything, so under the default `and` group the filter matches *every* record. [Guard such references](https://developers.tapeapp.com/docs/automations/troubleshooting/filter-values). A [simulation](https://developers.tapeapp.com/docs/api/resource/automation/execution) skips the filter, a manual run applies it.

## v1 limitations

-   **A subject needs a condition it can be tested with.** On create and update, a condition's `subject` can be a *field* reference, most *record metadata* references (`app_record_id`, `created_at`, `last_modified_at`, `created_by`, `last_modified_by`), a *trigger output* reference (for example `webhook_payload_property`) or the *file collection* of an earlier action. All of these are writable and send back unchanged. Tokens that only carry a value and can't be tested (`meta_type` `record_id`, `record_url`, `revision`, `all_comments`, the raw `webhook_payload`) and `global` or `custom` references return `400` on write.
-   **Collection-change conditions are read-only.** **Has been added** and **Has been deleted** on an attachment, image or checklist field, and **Changed item contains** on a checklist field, have no public operator. They read as an `{ id, subject }` without an operator and *can't be sent back* unchanged. Other change-tracking conditions use the public operators `has_changed`, `has_changed_to` and `has_changed_to_any_of` and send back without problems.

A `GET` followed by an unchanged `PUT` fails only for an automation with such a collection-change condition, so remove these conditions first. All other subjects send back unchanged, including the `boolean` and `entity_type` value kinds.

## Next steps

[

Discovery

the operators for each field type.

](https://developers.tapeapp.com/docs/api/resource/automation/discovery)[

Dynamic values

subjects and values as references.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Actions

conditions in `conditional` and `for_loop`.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#control-flow-actions)[

Revisions

roll back a definition with filters.

](https://developers.tapeapp.com/docs/api/resource/automation/revisions)[

Run & simulate

run one record by hand or as a simulation.

](https://developers.tapeapp.com/docs/api/resource/automation/execution)
