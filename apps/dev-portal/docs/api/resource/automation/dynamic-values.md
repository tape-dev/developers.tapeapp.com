---
id: dynamic-values
title: Dynamic values & references
sidebar_label: Dynamic values
description: How Tape automation values reference live record and run data — the dynamic-value array and reference model.
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

Wherever a value can pull in live data — a trigger or action config field, a filter comparison — it is a **dynamic
value**: an ordered **array** that interleaves **literal strings** with **references**. A literal string is used
verbatim; a reference is resolved against the triggering record and run at execution time.

An email subject "Hi \{first name\}!" is:

<ContextCodeBlock language="json" title='A dynamic value'>
{`[
  "Hi ",
  { "kind": "variable", "source": "field", "field_id": 42, "field_type": "single_text", "previous": false, "collection": false, "triggering": false },
  "!"
]`}
</ContextCodeBlock>

A literal-only value is just a one-element array — `["shipped"]`. A field typed as a plain scalar (a number, a
boolean, an ID) is **not** wrapped in an array; only template/code-typed fields are.

A reference can also stand **alone** as an unwrapped object at a config key — not every reference lives inside an
interleaved array. Non-template config slots that carry a single reference hold it as a bare object: a `for_loop`'s
`iterable`, a collection action's `record_collection`, or a sort key is one reference object (e.g.
`{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 87 }`), not a one-element
array. See [Action examples](/docs/api/resource/automation/action-examples) for the collect → consume pattern.

## Two flavors

| Flavor       | Contains                                                                 | Used for                                                         |
| ------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Template** | literals + **any** reference (variable or value)                         | text / template fields, filter `text` values                     |
| **Code**     | literals + **variable** references only (no constant `value` references) | numeric / code expressions, filter `number` values, date offsets |

## References

Every reference has a `kind`, and an optional **`property`** (e.g. a user reference's `email`, a date's
`start_date_utc`) — omitted means the reference's default whole value.

### `kind: "variable"` — live data, by `source`

| `source`  | Extra fields                                                              | Points at                      |
| --------- | ------------------------------------------------------------------------- | ------------------------------ |
| `field`   | `field_id`, `field_type`, `previous`, `collection`, `triggering`          | A field's value on the record. |
| `trigger` | `trigger_type` (+ `key_path`, `data_type` for `webhook_payload_property`) | The trigger's output.          |
| `action`  | `action_type`, `app_id?`                                                  | A prior action's output.       |
| `global`  | `global_type`                                                             | An automation-wide value.      |
| `meta`    | `meta_type`, `app_id?`, `previous`, `collection`, `triggering`            | Record metadata.               |
| `custom`  | `custom_type`, `label`                                                    | A user-declared variable.      |

**Vocabularies** (the exhaustive token sets):

- `global_type`: `current_date`, `current_datetime`, `current_time`, `current_automation`, `current_automation_run`,
  `actions_left_in_hour`, `most_recent_error`
- `trigger_type`: `webhook_payload`, `webhook_payload_property`, `webhook_file_collection`,
  `periodic_execution_datetime`, `periodic_next_execution_datetime`, `weblink_click_count`, `weblink_created_at`,
  `record_comment_or_reply_id`, `record_comment_or_reply_content`, `record_comment_or_reply_created_by`,
  `record_comment_or_reply_attachments`, `record_comment_or_reply_entity_type`
- `meta_type`: `record_id`, `record_url`, `app_record_id`, `revision`, `created_at`, `last_modified_at`,
  `created_by`, `last_modified_by`, `all_comments`
- `action_type`: `record_collection`, `created_record`, `file_collection`
- `custom_type`: `any`, `single_file`, `multi_file`, `single_link`, `html_table_rows`

### `kind: "value"` — a fixed entity or constant, by `value_type`

| `value_type` | Extra fields            | `property`                                     |
| ------------ | ----------------------- | ---------------------------------------------- |
| `option`     | `field_id`, `option_id` | optional                                       |
| `user`       | `user_id`               | optional                                       |
| `record`     | `record_id`             | optional                                       |
| `pdf`        | —                       | required (`page_number` / `page_count`)        |
| `date`       | —                       | required (`current_date` / `current_datetime`) |
| `time`       | —                       | required (`current_time`)                      |

## Notes for writers

- **`property` tokens are stored-value-derived**, so they can look unlike the UI label (a status option serializes as
  `completed`, a checklist assignee as `assign_user_formatted`).
- **Referenced IDs aren't validated when you write** — a structurally valid but nonexistent/foreign ID passes here and
  surfaces at [validate](/docs/api/resource/automation/execution) / activate time. Even then, validation is **not
  exhaustive**: some references (and some plain config ids) are only checked at run time, so `valid: true` does not
  guarantee an executable run.
- **A reference's *structure* is validated on write.** IDs aren't checked for existence, but a reference whose
  discriminator is unrecognized — an unknown `source` on a `kind: "variable"` ref, an unknown `value_type` on a
  `kind: "value"` ref, or a `field` ref missing its `field_type` — is rejected with a `400` (it used to persist and then
  fail every read). `previous` / `collection` / `triggering` are optional on write and each default to `false` when omitted.
- **`meta` references preserve `previous` / `collection` / `triggering` on write** — like `field` references. These
  flags are emitted on read **only when `true`**, so a bare `meta` reference reads back without them. A
  collection-scoped meta reference (`collection: true`, with `app_id`) is what collection actions consume — e.g. it is
  required as a `sort_record_collection` sort key (a non-collection meta ref there fails validation).
- **One reference is still lossy in v1** — `html_table_rows` custom variables don't round-trip their inner template.
- **Template/code members accept a bare string on write** — shorthand for a one-element literal array
  (`"application/json"` ≡ `["application/json"]`). The read path always returns them **array-wrapped**, and the
  coercion applies **recursively** to nested template members (e.g. each `http_call_headers[].value`, and the
  template/code strings inside `field_assignments`). So a written config never echoes back byte-for-byte for these
  fields — don't diff write against read.
- **On a `field` reference, `field_type` is required on write** — the input mapper rejects a reference without it. The
  three boolean flags scope the value: `previous: true` reads the value **before** the triggering change;
  `triggering: true` binds to the record that fired the trigger; `collection: true` selects the **per-collected-record**
  value across an upstream collection (what collection actions consume), vs. the current record when `false`.
