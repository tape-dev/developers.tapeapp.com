---
id: dynamic-values
title: Dynamic values & references
sidebar_label: Dynamic values
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

## Two flavors

| Flavor | Contains | Used for |
| --- | --- | --- |
| **Template** | literals + **any** reference (variable or value) | text / template fields, filter `text` values |
| **Code** | literals + **variable** references only (no constant `value` references) | numeric / code expressions, filter `number` values, date offsets |

## References

Every reference has a `kind`, and an optional **`property`** (e.g. a user reference's `email`, a date's
`start_date_utc`) — omitted means the reference's default whole value.

### `kind: "variable"` — live data, by `source`

| `source` | Extra fields | Points at |
| --- | --- | --- |
| `field` | `field_id`, `field_type`, `previous`, `collection`, `triggering` | A field's value on the record. |
| `trigger` | `trigger_type` (+ `key_path`, `data_type` for `webhook_payload_property`) | The trigger's output. |
| `action` | `action_type`, `app_id?` | A prior action's output. |
| `global` | `global_type` | A workflow-wide value. |
| `meta` | `meta_type`, `app_id?` | Record metadata. |
| `custom` | `custom_type`, `label` | A user-declared variable. |

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

| `value_type` | Extra fields | `property` |
| --- | --- | --- |
| `option` | `field_id`, `option_id` | optional |
| `user` | `user_id` | optional |
| `record` | `record_id` | optional |
| `pdf` | — | required (`page_number` / `page_count`) |
| `date` | — | required (`current_date` / `current_datetime`) |
| `time` | — | required (`current_time`) |

## Notes for writers

- **`property` tokens are stored-value-derived**, so they can look unlike the UI label (a status option serializes as
  `completed`, a checklist assignee as `assign_user_formatted`).
- **Referenced IDs aren't validated when you write** — a structurally valid but nonexistent/foreign ID passes here and
  surfaces only at [validate](/docs/api/resource/automation/execution) / activate time.
- **A few references are lossy in v1** — `meta` references don't preserve `previous`/`collection`/`triggering` on a
  write, and `html_table_rows` custom variables don't round-trip their inner template.
