---
id: errors
title: Errors & broken reasons
sidebar_label: Errors & broken reasons
---

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

## HTTP errors

The Automation endpoints use the standard Tape [error](/docs/api/errors) envelope. Across this resource:

| Status | When |
| --- | --- |
| `400` | Malformed body, a path ID that is not an integer, or a run body that doesn't match the automation's trigger. |
| `401` | Not authenticated with a user API key (where one is required). |
| `404` | The automation, app, workspace, revision or **record** is not available to you — see the collapse below. (Manual-run and simulate also `404` when the target record is missing or you can't view it.) |
| `409` | A lifecycle/state conflict — activating, running or simulating a broken automation. |

### The 404 collapse

Tape IDs are globally unique, so existence and tenancy **collapse into a single `404`**. An automation that is missing,
soft-deleted, in another organization, or in a workspace you don't administrate all answer the **identical `404`** —
the API is never an existence oracle. Cross-tenant access is `404`, **not `403`**.

## The broken state

An automation carries `broken` (boolean) and `broken_reason` (`{ errors: [...] }`, or `null` when not broken).
[`GET /v1/automation/{id}/validate`](/docs/api/resource/automation/execution) returns `{ valid, errors }` with the
same entry shape, recomputed fresh.

Each error entry:

| Field | Type | Description |
| --- | --- | --- |
| `code` | `string` | Machine-readable reason (below). |
| `message` | `string` | English description. Not localized. |
| `deactivated` | `boolean` | Optional — `true` when the fault is inside a deactivated block (doesn't itself break the automation). **Absent when not deactivated**; treat a missing value as `false` (test `!entry.deactivated`, not `=== false`). |
| `block_id` / `action_id` | `string` \| `null` | The node at fault. `action_id` is `null` for a top-level fault (e.g. a filter or field-assignment reason). |
| `app_id` / `field_id` / `view_id` / `automation_id` / `user_id` / `record_id` / `option_id` | `integer` | The referenced entity at fault, depending on `code`. |
| `match_type` | `string` | Present for `filter_match_type_invalid` — the invalid filter match type. |
| `assignment_type` | `string` | Present for `field_assignment_type_invalid` — the invalid field-assignment type. |
| `call_argument` | `string` | Present for `action_call_argument_invalid` — the id of the invalid call argument. |

## Broken-reason codes

Grouped by where the fault sits. Codes are worded in the public vocabulary; internal names never appear.

**Trigger**
`trigger_variable_missing` · `trigger_app_missing` · `trigger_date_field_not_date` ·
`trigger_periodic_week_days_empty` · `trigger_periodic_month_days_empty` · `trigger_updated_fields_empty`

**Filter**
`filter_match_type_invalid` · `filter_variable_missing` · `filter_value_missing` · `filter_value_variable_missing` ·
`filter_value_value_missing` · `filter_user_missing` · `filter_app_missing` · `filter_record_missing` ·
`filter_option_missing`

**Field assignment**
`field_assignment_type_invalid` · `field_assignment_end_date_disabled` · `field_assignment_variable_missing` ·
`field_assignment_value_missing` · `field_assignment_value_variable_missing` ·
`field_assignment_value_variable_invalid` · `field_assignment_value_value_missing` · `field_assignment_user_missing` ·
`field_assignment_app_missing` · `field_assignment_record_missing` · `field_assignment_option_missing`

**Checklist property**
`checklist_property_value_variable_missing` · `checklist_property_value_value_missing` ·
`checklist_property_user_missing`

**Action**
`action_invalid` · `action_variable_missing` · `action_value_missing` · `action_user_missing` · `action_app_missing` ·
`action_app_invalid` · `action_view_missing` · `action_automation_missing` · `action_automation_invalid` ·
`action_call_argument_invalid`

:::note `broken` can lag the current definition
Create and update don't re-validate, so `broken` / `broken_reason` on the object reflect the **last activation-time**
check. Call [`validate`](/docs/api/resource/automation/execution) for a verdict on the current definition, or
[`activate`](/docs/api/resource/automation/manage) (which recomputes and refuses a broken automation with `409`).
:::
