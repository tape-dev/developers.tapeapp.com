---
id: filter-values
title: Filter values
sidebar_label: Filter values
---

A filter — and an in-action search condition — compares a field against a **value**. That value is composed at run
time from literal input and references (a field, a variable, a prior action's output). Because it is evaluated when the
automation runs, a filter that looks complete in the editor can still resolve to an **empty** value for a particular
record or run. This page explains the behavior you may see and how to avoid it.

## "Filtering value is empty, make sure to provide a search value"

A run may fail with:

> Filtering value is empty, make sure to provide a search value.

**This is expected, protective behavior — not a bug.** When a filter or search value composes to empty at execution
time, the automation stops with this error instead of running the filter. An empty filter value would otherwise match
**every** record — almost never what you intend, and potentially destructive when a bulk action follows (for example
"update all" or "delete all"). To keep an automation from silently operating on your entire dataset, the engine refuses
to run an empty filter. Tools that perform server-side filtering commonly apply the same safeguard.

Because the value is resolved at run time, a filter can pass validation and still hit this at execution — it depends on
the actual values in play when the automation runs.

### How a value ends up empty

- **The value's channel did not match the field.** On create/update the server picks the value channel from the
  subject **field's type** — number / unique-id → `number`, date fields → `date`, category / status / relation / user →
  `ids`, text → `text` — and reads **only** that tag. A value tagged with the wrong channel is **silently dropped**,
  leaving the condition with an empty comparison. See
  [Filters → the value union](/docs/api/resource/automation/reference/filters) for the channel rules.
- **A referenced value resolved to nothing.** If the value pulls in a field, variable, or a prior action's output and
  that source is empty for the record at run time, the composed value is empty.

### How to avoid it

- **Match the value channel to the field type** so the value is not dropped on write. This is the most common cause
  when building filters through the API.
- **Guard the source.** If the value comes from a reference that can be empty, wrap the filter or action in a
  `conditional` that first checks the source is present, or supply a fallback value.
- **To match everything on purpose, remove the condition** rather than sending an empty value. A filter with no
  conditions always runs; an empty comparison is refused by design.

## Why `validate` does not flag an empty value

`GET /v1/automation/{id}/validate` returns `valid: true` for a condition whose comparison value is empty, and that is
correct: an empty comparison is a structurally valid definition. Whether the value will be non-empty is only known when
the automation runs, so it is enforced there — at run time — not at validation.

`validate` does catch **dangling references**, which are a different problem from an empty value:

- a condition whose **subject** references a field that no longer exists reports `filter_variable_missing`;
- a **value** that references a deleted field or variable reports `filter_value_missing`.

So `filter_value_missing` signals a *missing reference* (for example a deleted field), **not** a blank value — do not
expect it for an empty comparison.
