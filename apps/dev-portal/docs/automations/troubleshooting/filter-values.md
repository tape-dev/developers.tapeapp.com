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

The Developer API now refuses a *statically* empty comparison at the write boundary, but a value that composes to empty
at **run time** still matches every record. Both halves matter:

:::info Write-time: a literal empty or wrong-channel comparison is now a `400`
On create/update, the Developer API rejects a comparison it can see is empty or mistyped, naming the offending
condition: a value tagged for a channel the field doesn't have, an empty comparison value (e.g. `{ "type": "text",
"text": [] }`), or an arity mismatch. So you can no longer *store* one of these through the API — the error names the
match-every-record risk and points you at `is_empty` / `is_not_empty` if that's what you meant.
:::

:::danger Run-time: a value that resolves to empty still matches everything
The rejection above sees only the literal you send. A value built from a **reference** — a field, variable, or prior
action's output — is accepted on write (the reference is present) but can still resolve to **empty for a particular
record** at run time. When it does, the condition leaf compiles to a match-all short-circuit, evaluates to `true` for
every record, and under the default `and` group the whole filter passes — the automation runs its actions against
**every** record in scope, with no error. This is especially dangerous when a bulk action follows (an "update all" /
"delete all" pattern): a scoped automation can quietly operate on your entire dataset, consuming credits on every
record. Definitions stored before this check, or through the in-app editor, can also carry an empty comparison
(create/update don't re-validate existing rows).
:::

Because a reference is resolved at run time, a filter can pass both create/update and `validate` and still behave this
way — it depends on the actual values in play when the automation runs. **Always
[`simulate`](/docs/api/resource/automation/execution) a new or edited filter before activating it**, and confirm it
matches only the records you expect.

### How a value ends up empty

- **A referenced value resolved to nothing.** If the value pulls in a field, variable, or a prior action's output and
  that source is empty for the record at run time, the composed value is empty. This is the remaining path to an
  over-matching filter, since it can't be caught when you write the definition.
- **The value's channel did not match the field** (now caught on write). On create/update the server picks the value
  channel from the subject **field's type** — number / unique-id → `number`, date fields → `date`, category / status /
  relation / user → `ids`, text → `text`. A value tagged with the wrong channel used to be silently dropped, leaving an
  empty comparison; it is now **rejected with a `400`**. See
  [Filters → the value union](/docs/api/resource/automation/reference/filters) for the channel rules.

### How to avoid it

- **Guard the source.** If the value comes from a reference that can be empty, wrap the filter or action in a
  `conditional` that first checks the source is present, or supply a fallback value. This is the main defence against
  the run-time case.
- **Match the value channel to the field type** so the write isn't rejected. See the channel rules linked above.
- **Simulate before you activate.** A [`simulate`](/docs/api/resource/automation/execution) run exercises the filter
  against a real record with no side effects, so an over-matching filter shows up before it can fire on your whole app.
- **To match everything on purpose, remove the condition** — or send `filter: null`. A filter with no conditions always
  runs; an explicitly empty top-level group is itself rejected with a `400`.

## Why `validate` does not flag an empty value

`GET /v1/automation/{id}/validate` returns `valid: true` for a condition whose comparison value is empty, and that is
structurally correct: an empty comparison is a valid definition. `validate` is **semantic-only** — it does not run the
write-time syntactic checks above, and it can't know that a reference will resolve to empty for some record at run time.
So it is **not** a safeguard against an over-matching filter; use [`simulate`](/docs/api/resource/automation/execution)
for that.

`validate` does catch **dangling references**, which are a different problem from an empty value:

- a condition whose **subject** references a field that no longer exists reports `filter_variable_missing`;
- a **value** that references a deleted field or variable reports `filter_value_variable_missing`.

So `filter_value_variable_missing` signals a *missing reference* (for example a deleted field), **not** a blank value —
do not expect it for an empty comparison. (An earlier `filter_value_missing` code was never emitted and has been
retired.)
