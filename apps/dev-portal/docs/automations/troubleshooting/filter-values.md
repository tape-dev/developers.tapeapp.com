---
id: filter-values
title: Filter values
sidebar_label: Filter values
---

A filter — and an in-action search condition — compares a field against a **value**. That value is composed at run
time from literal input and references (a field, a variable, a prior action's output). Because it is evaluated when the
automation runs, a filter that looks complete in the editor can still resolve to an **empty** value for a particular
record or run. This page explains the behavior you may see and how to avoid it.

## An empty filter value matches every record

:::danger An empty filter value is not refused — it matches everything
When a filter or in-action search value composes to empty at run time, Tape does **not** stop the run and does **not**
narrow the filter. The condition leaf compiles to a match-all short-circuit, so it evaluates to `true` for every
record; under the default `and` group the whole filter passes and the automation runs its actions against **every**
record in scope. There is no protective error — an empty value is silently treated as "match anything."

This is especially dangerous when a bulk action follows (for example an "update all" or "delete all" pattern): a
scoped automation can quietly become one that operates on your entire dataset, consuming credits on every record.
:::

Because the value is resolved at run time, a filter can pass validation and still behave this way — it depends on the
actual values in play when the automation runs. **Always [`simulate`](/docs/api/resource/automation/execution) a new or
edited filter before activating it**, and confirm it matches only the records you expect.

### How a value ends up empty

- **The value's channel did not match the field.** On create/update the server picks the value channel from the
  subject **field's type** — number / unique-id → `number`, date fields → `date`, category / status / relation / user →
  `ids`, text → `text` — and reads **only** that tag. A value tagged with the wrong channel is **silently dropped**,
  leaving the condition with an empty comparison. See
  [Filters → the value union](/docs/api/resource/automation/reference/filters) for the channel rules. This is the most
  common way an API-built filter ends up matching everything.
- **A referenced value resolved to nothing.** If the value pulls in a field, variable, or a prior action's output and
  that source is empty for the record at run time, the composed value is empty.

### How to avoid it

- **Match the value channel to the field type** so the value is not dropped on write. This is the most common cause
  when building filters through the API.
- **Guard the source.** If the value comes from a reference that can be empty, wrap the filter or action in a
  `conditional` that first checks the source is present, or supply a fallback value.
- **Simulate before you activate.** A [`simulate`](/docs/api/resource/automation/execution) run exercises the filter
  against a real record with no side effects, so an over-matching filter shows up before it can fire on your whole app.
- **To match everything on purpose, remove the condition.** A filter with no conditions always runs; expressing that
  intent explicitly is clearer than relying on an empty comparison, and it avoids the silent-drop trap.

## Why `validate` does not flag an empty value

`GET /v1/automation/{id}/validate` returns `valid: true` for a condition whose comparison value is empty, and that is
structurally correct: an empty comparison is a valid definition. But note that an empty value is **not** enforced
anywhere at run time either — as described above, it matches every record rather than being rejected. `validate` is
therefore not a safeguard against an over-matching filter; use [`simulate`](/docs/api/resource/automation/execution)
for that.

`validate` does catch **dangling references**, which are a different problem from an empty value:

- a condition whose **subject** references a field that no longer exists reports `filter_variable_missing`;
- a **value** that references a deleted field or variable reports `filter_value_variable_missing`.

So `filter_value_variable_missing` signals a *missing reference* (for example a deleted field), **not** a blank value —
do not expect it for an empty comparison. (An earlier `filter_value_missing` code was never emitted and has been
retired.)
