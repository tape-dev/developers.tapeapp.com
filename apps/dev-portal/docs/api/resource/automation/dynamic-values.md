---
id: dynamic-values
title: Dynamic values & references
sidebar_label: Dynamic values
description: How Tape automation values reference live record and run data — the dynamic-value array and reference model.
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use dynamic values to pull live record and run data into the config of a trigger, an action or a filter.

A *dynamic value* is an ordered *array* that mixes *literal strings* with *references*. Tape uses a literal string as is. It resolves a reference against the triggering record and the run when the automation runs.

An email subject "Hi \{first name\}!" looks like this:

<ContextCodeBlock language="json" title='A dynamic value'>
{`[
  "Hi ",
  { "kind": "variable", "source": "field", "field_id": 42, "field_type": "single_text", "previous": false, "collection": false, "triggering": false },
  "!"
]`}
</ContextCodeBlock>

- A value with only a literal is a one-element array: `["shipped"]`.
- A config key with a plain scalar type, such as a number, a boolean or an ID, is *not* wrapped in an array. Only template and code keys are.
- A config slot that holds one reference and no template takes the reference *alone*, as a bare object instead of an array: the `iterable` of a `for_loop`, the `record_collection` of a collection action, or a sort key. Example: `{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 87 }`. See [Action examples](/docs/api/resource/automation/action-examples) for the collect and consume pattern.

## Two flavors

| Flavor       | Contains                                                                 | Used for                                                          |
| ------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **Template** | Literals and *any* reference (variable or value)                       | Text and template fields, filter `text` values                    |
| **Code**     | Literals and *variable* references only (no constant `value` references) | Number and code expressions, filter `number` values, date offsets |

## References

Every reference has a `kind`. It can also have a **`property`**, for example the `email` of a user reference or the `start_date_utc` of a date. Without `property`, the reference returns its whole default value.

### `kind: "variable"` — live data, by `source`

| `source`  | Extra fields                                                                | Points to                       |
| --------- | --------------------------------------------------------------------------- | ------------------------------- |
| `field`   | `field_id`, `field_type`, `previous`, `collection`, `triggering`            | A field's value on the record.  |
| `trigger` | `trigger_type` (plus `key_path` and `data_type` for `webhook_payload_property`) | The trigger's output.       |
| `action`  | `action_type`, `app_id?`                                                    | The output of an earlier action. |
| `global`  | `global_type`                                                               | A value for the whole automation. |
| `meta`    | `meta_type`, `app_id`, `previous`, `collection`, `triggering`               | Record metadata.                |
| `custom`  | `custom_type`, `label`                                                      | A variable you declared, or the output of `http_call`, `create_pdf`, `rollup_iterable_values` or `current_record_generate_automation_weblink`. |

To find a `field_id`, see [Find the app ID and field IDs](/docs/api/resource/app#find-app-and-field-ids).

**Allowed values** (the complete lists):

- `global_type`: `current_date`, `current_datetime`, `current_time`, `current_automation`, `current_automation_run`, `actions_left_in_hour`, `most_recent_error`
- `trigger_type`: `webhook_payload`, `webhook_payload_property`, `webhook_file_collection`, `periodic_execution_datetime`, `periodic_next_execution_datetime`, `weblink_click_count`, `weblink_created_at`, `record_comment_or_reply_id`, `record_comment_or_reply_content`, `record_comment_or_reply_created_by`, `record_comment_or_reply_attachments`, `record_comment_or_reply_entity_type`
- `meta_type`: `record_id`, `record_url`, `app_record_id`, `revision`, `created_at`, `last_modified_at`, `created_by`, `last_modified_by`, `all_comments`
- `action_type`: `record_collection`, `created_record`, `file_collection`
- `custom_type`: `any`, `single_file`, `multi_file`, `single_link`, `html_table_rows`

A reference with `action_type: "created_record"`, the `app_id` of the new record and `"property": "id"` returns the ID of the record that [`record_create`](/docs/api/resource/automation/reference/actions/record-create) created.

### `kind: "value"` — a fixed entity or constant, by `value_type`

| `value_type` | Extra fields            | `property`                                       |
| ------------ | ----------------------- | ------------------------------------------------ |
| `option`     | `field_id`, `option_id` | Optional                                         |
| `user`       | `user_id`               | Optional                                         |
| `record`     | `record_id`             | Optional                                         |
| `pdf`        | none                    | Required (`page_number` or `page_count`)         |
| `date`       | none                    | Required (`current_date` or `current_datetime`)  |
| `time`       | none                    | Required (`current_time`)                        |

## Write and read dynamic values {#notes-for-writers}

- **`property` values come from the stored value.** They can look different from the label in Tape. A status option is sent as `completed`, a checklist assignee as `assign_user_formatted`.
- **Tape doesn't check referenced IDs when you write.** A well-formed ID that doesn't exist or belongs to someone else passes here. It shows up when you [validate](/docs/api/resource/automation/execution) or activate. Some references and plain config IDs are only checked when the automation runs.
- **Tape checks the *structure* of a reference when you write.** An unrecognized discriminator returns `400`: an unknown `source` on a `kind: "variable"` reference, an unknown `value_type` on a `kind: "value"` reference, or a `field` reference without `field_type`. `previous`, `collection` and `triggering` are optional on write and default to `false`.
- **A `meta` reference needs `app_id`,** the app of the record it reads. For the current record, that's the automation's app. Tape saves a reference without `app_id`, but `validate` reports `action_variable_missing` and activation fails.
- **`meta` references keep `previous`, `collection` and `triggering` on write,** like `field` references. A read returns these flags *only when they're `true`*, so a plain `meta` reference reads back without them. Collection actions use a collection-scoped meta reference (`collection: true`, with `app_id`). A `sort_record_collection` sort key needs one. A meta reference without `collection` fails validation there.
- **One reference loses data in v1.** Custom variables of type `html_table_rows` don't keep their inner template when you read and write them back.
- **Template and code members accept a plain string on write.** It's short for a one-element literal array: `"application/json"` equals `["application/json"]`. A read returns them *wrapped in an array*. This also applies to nested template members, for example each `http_call_headers[].value` and the template and code strings inside `field_assignments`. A written config doesn't come back byte for byte for these fields, so don't compare write and read.
- **Three flags set which value a `field` reference returns:**
  - `previous: true` reads the value *before* the triggering change.
  - `triggering: true` points to the record that fired the trigger.
  - `collection: true` reads the value *of each collected record* in an earlier collection, which is what collection actions use. With `false`, it reads the current record.

## Next steps

- [Action examples](/docs/api/resource/automation/action-examples): dynamic values in real action configs.
- [Filters](/docs/api/resource/automation/reference/filters): use references as filter subjects and values.
- [Triggers](/docs/api/resource/automation/reference/triggers): what each trigger hands to the run.
- [Run & simulate](/docs/api/resource/automation/execution): validate an automation before you run it.
