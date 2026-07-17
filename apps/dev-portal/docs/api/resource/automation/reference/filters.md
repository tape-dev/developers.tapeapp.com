---
id: filters
title: Filters
sidebar_label: Filters
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

A filter decides **whether** an automation runs: a recursive `and`/`or` tree of conditions the triggering record must
match. An automation's `filter` is `null` when it has none (it always runs). The same tree shape is reused for a
`conditional` action's `condition` and a `for_loop`'s break/continue conditions — see
[actions](/docs/api/resource/automation/reference/actions).

## The tree: groups and conditions

A **group** combines its `rows` with `and` (match all) or `or` (match any); rows are nested groups or leaf conditions.
The **root** group has no `id`; nested nodes carry one.

| Field | Type | On | Description |
| --- | --- | --- | --- |
| `id` | `string` | nested nodes | Opaque node ID. Optional on input (server-minted when omitted); always present on read. |
| `operator` | `string` | group | `and` or `or`. |
| `rows` | `array` | group | Nested groups and/or conditions. |
| `subject` | `object` | condition | A field [reference](/docs/api/resource/automation/dynamic-values) — the value being tested. |
| `operator` | `string` | condition | One of the operators below. |
| `value` | `object` | condition | The tagged comparison value (below). Absent for value-less operators. |
| `code` | `array` | condition | A raw code predicate — a [code dynamic value](/docs/api/resource/automation/dynamic-values). A **script condition** carries `code` *instead of* `subject`/`operator`/`value`. |

<ContextCodeBlock language="json" title='Filter — "Priority is High AND Amount ≥ 1000"'>
{`{
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
}`}
</ContextCodeBlock>

## Operators

There are **22** operators. Each has a `value_arity` — `none` (no value, e.g. `is_empty`), `single`, or `multiple`.
The operators valid for a given field type differ; the authoritative per-field-type set is returned by
[`GET /v1/automation/meta/filter?field_type=…`](/docs/api/resource/automation/discovery).

| Operator | Arity | | Operator | Arity |
| --- | --- | --- | --- | --- |
| `is` | single | | `has_any_of` | multiple |
| `is_not` | single | | `has_all_of` | multiple |
| `contains` | single | | `has_none_of` | multiple |
| `does_not_contain` | single | | `is_exactly` | multiple |
| `starts_with` | single | | `is_any_of` | multiple |
| `ends_with` | single | | `is_none_of` | multiple |
| `greater_than` | single | | `is_empty` | none |
| `greater_or_equal_than` | single | | `is_not_empty` | none |
| `less_than` | single | | `is_completed` | none |
| `less_or_equal_than` | single | | `is_incomplete` | none |
| `is_before` | single | | | |
| `is_after` | single | | | |

## The value union

The condition `value` is tagged by `type` so you can read it without the per-field rules:

| `type` | Payload | Meaning |
| --- | --- | --- |
| `text` | `text`: a [template dynamic value](/docs/api/resource/automation/dynamic-values) | Text / template comparison. |
| `number` | `number`: a [code dynamic value](/docs/api/resource/automation/dynamic-values) | Numeric comparison as a code expression. |
| `ids` | `ids`: array of `number` or [reference](/docs/api/resource/automation/dynamic-values) | Option / status / relation / user ID set. |
| `date` | `date`: `{ base?, operator: "plus"\|"minus", unit: "hour"\|"day"\|"week"\|"month", amount }` | Relative date; `base` omitted = now. |
| `boolean` | `boolean` | Boolean comparison. **Read-only** (see limitations). |
| `entity_type` | `entity_type`: `string` | Comment/reply entity-type comparison. **Read-only**. |

:::caution On write, the `type` tag must match the field
Reading a value is tag-driven, but **writing** one is field-driven. On create/update the server picks the value
channel from the subject **field's type** — number / unique-id → `number`; date fields → `date`; category / status /
relation / user → `ids`; text → `text` — and reads **only** that tag. A value whose `type` doesn't match the field's
channel is **silently dropped**: the condition is stored with an empty comparison and **no `400`**. The valid tag for
a field type is not served by [`meta/filter`](/docs/api/resource/automation/discovery) (which returns operators only),
so match the tag to the field yourself.
:::

## v1 limitations

- **Input accepts field subjects only.** On create/update, a structured condition's `subject` must be a **field**
  reference. Conditions whose subject is record metadata, a trigger output or a prior action's output are **read-only**
  — they round-trip on read but are rejected with a `400` on write.
- **Change-tracking conditions are read-only.** A "has changed" style condition has no public operator, so it reads as
  an operator-less `{ id, subject }` and **cannot be re-submitted** verbatim.
- The `boolean` and `entity_type` value kinds only arise from those read-only subjects, so they too are output-only.

Because of these, a verbatim `GET` → `PUT` of an automation that uses any of the above will fail. This is a known v1
limitation, not a bug.
