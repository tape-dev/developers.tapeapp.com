---
id: errors
title: Errors & broken reasons
sidebar_label: Errors & broken reasons
description: HTTP status codes and the broken-reason codes returned across the Tape Automation API.
---

Use these codes to handle Automation API errors and to find out why an automation is broken.

## HTTP errors

The Automation endpoints use the standard Tape [error](/docs/api/errors) envelope. On this resource:

| Status | When                                                                                                                                                                                               |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400`  | A malformed body, a path ID that isn't an integer, or a run body that doesn't match the automation's trigger. The two [Advanced / sandbox](/docs/api/resource/automation/advanced) endpoints also return `400` for a missing automation or record. |
| `401`  | The request carries no credential, or the credential doesn't act on behalf of a user where the endpoint needs one, for example an automation API key.                                            |
| `403`  | A personal access token or OAuth access token lacks the capability the endpoint needs. The response carries `WWW-Authenticate: Bearer error="insufficient_scope"`. See [Capabilities](/docs/api/capabilities). |
| `404`  | The automation, app, workspace, revision or *record* isn't available to you. See [The 404 collapse](#the-404-collapse). Manual run and simulate also return `404` when the target record is missing or you can't view it. |
| `409`  | A conflict with the automation's state: activating, running or simulating a broken automation.                                                                                                     |

### What returns `400` in a definition body

Besides a malformed envelope, the input schema of a definition rejects the following when you write it:

- An action *without a `config` key*, or with a `config` that lacks a member its `config_schema` requires. An empty `config: {}` passes only for types without required members, for example `current_record_update` or `collect_app_records`. `custom_code` without `code` returns `400`.
- A *malformed dynamic-value reference*: an unknown `source` on a `kind: "variable"` reference, an unknown `value_type` on a `kind: "value"` reference, or a `field` reference without `field_type`.
- An *unknown enum value*, for example an invalid `assignment_type` inside a `field_assignments` or `call_arguments` entry, or any config enum value that isn't one of the listed lower-case values.
- A `filter` or `actions` tree nested *deeper than the maximum block depth*.
- A *malformed `filter` comparison*, in the top-level `filter` or in a condition inside an action:
  - a value tagged for a channel the field doesn't have,
  - an empty comparison value,
  - a value-arity mismatch: a value on an operator with arity `none` such as `is_empty`, or a missing value on an operator that needs one.
- An explicitly *empty top-level `filter` group* (`rows: []`). Send `filter: null` to run without a filter.
- A *malformed `value` union in a filter condition*:
  - a payload key that belongs to a different channel than its `type` tag (each `type` branch accepts only its own keys),
  - a relative `date` value with an `operator` or `unit` outside the listed values,
  - a scalar `amount` (it must be a code-value array),
  - an unknown member.

Problems of meaning don't return `400` on write. Examples: a member that only validation requires, a referenced ID that doesn't exist, or an operator outside a field's channel. They show up as [broken-reason codes](#broken-reason-codes) when you `validate` or activate, and some only when the automation runs. One exception: an action `app_id` that never existed (not a deleted app) makes `validate` and activate return `404`.

### The 404 collapse

Tape IDs are unique across all organizations, so existence and access *collapse into a single `404`*. An automation that is missing, soft-deleted, in another organization (*not `403`*), in a workspace you don't administer or outside your personal access token's [content access](/docs/api/personal-access-tokens#content-selection) returns the *same `404`*. The API never reveals which IDs exist.

## The broken state

An automation's `broken_reason` is `{ errors: [...] }` or `null`. It's also `null` when `broken` is `true` because Tape marked the automation broken during a run. [`GET /v1/automation/{id}/validate`](/docs/api/resource/automation/execution) returns `{ valid, errors }` with the same entry shape, computed fresh.

Each error entry:

| Property                                                                                    | Type               | Description                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code`                                                                                      | `string`           | Machine-readable reason. See [Broken-reason codes](#broken-reason-codes).                                                                                                                         |
| `message`                                                                                   | `string`           | English description. Not translated.                                                                                                                                                              |
| `deactivated`                                                                               | `boolean`          | `true` when the fault is inside a deactivated block, which doesn't break the automation. `false` on filter and action entries in an active block. Absent on trigger entries. Treat a missing value as `false`: test `!entry.deactivated`, not `=== false`. |
| `block_id` / `action_id`                                                                    | `string` \| `null` | The node at fault. `action_id` is `null` for a top-level fault, for example a filter or field assignment reason.                                                                                  |
| `app_id` / `field_id` / `view_id` / `automation_id` / `user_id` / `record_id` / `option_id` | `integer`          | The referenced entity at fault, depending on `code`.                                                                                                                                             |
| `match_type`                                                                                | `string`           | Present for `filter_match_type_invalid`: the invalid filter match type.                                                                                                                          |
| `assignment_type`                                                                           | `string`           | Present for `field_assignment_type_invalid`: the invalid field assignment type.                                                                                                                  |
| `call_argument`                                                                             | `string`           | Present for `action_call_argument_invalid`: the ID of the invalid call argument.                                                                                                                 |

:::note Why can `broken` lag behind the current definition?
`broken` shows the last verdict Tape *stored*: create, update, `activate` and `validate` never write it, and a failed `activate` returns `409` with the object unchanged. Call `validate` for a current verdict. [The automation object](/docs/api/resource/automation/reference/object#the-broken-flag) has the full `broken` model.
:::

## Broken-reason codes

The codes use public names, never internal ones. **Where** shows where the fault sits. **Description** is the English `message` that Tape returns with the code.

| Code | Where | Description |
| --- | --- | --- |
| `trigger_variable_missing` | Trigger | The trigger references a variable that no longer exists. |
| `trigger_app_missing` | Trigger | The trigger references an app that no longer exists. |
| `trigger_date_field_not_date` | Trigger | The date-arrived trigger references a calculation field that does not produce a date. |
| `trigger_periodic_week_days_empty` | Trigger | The weekly periodic trigger has no weekdays selected. |
| `trigger_periodic_month_days_empty` | Trigger | The monthly periodic trigger has no days selected. |
| `trigger_updated_fields_empty` | Trigger | The record-updated trigger has an empty list of watched fields. |
| `filter_match_type_invalid` | Filter | A filter condition uses an operator that is not valid in this context. |
| `filter_variable_missing` | Filter | A filter condition references a variable that no longer exists. |
| `filter_value_missing` | Filter | *Reserved.* A filter condition references a value that no longer exists. No validation path returns it, see the note below. |
| `filter_value_variable_missing` | Filter | A filter condition's value references a variable that no longer exists. |
| `filter_value_value_missing` | Filter | A filter condition's value references a value that no longer exists. |
| `filter_user_missing` | Filter | A filter condition references a user that no longer exists. |
| `filter_app_missing` | Filter | A filter condition references an app that no longer exists. |
| `filter_record_missing` | Filter | A filter condition references a record that no longer exists. |
| `filter_option_missing` | Filter | A filter condition references a select option that no longer exists. |
| `field_assignment_type_invalid` | Field assignment | A field assignment has an invalid type. |
| `field_assignment_end_date_disabled` | Field assignment | A field assignment sets an end date on a field that has end dates disabled. |
| `field_assignment_variable_missing` | Field assignment | A field assignment references a field that no longer exists. |
| `field_assignment_value_missing` | Field assignment | A field assignment references a value that no longer exists. |
| `field_assignment_value_variable_missing` | Field assignment | A field assignment's value references a variable that no longer exists. |
| `field_assignment_value_variable_invalid` | Field assignment | A field assignment's value references a variable that is not valid here. |
| `field_assignment_value_value_missing` | Field assignment | A field assignment's value references a value that no longer exists. |
| `field_assignment_user_missing` | Field assignment | A field assignment references a user that no longer exists. |
| `field_assignment_app_missing` | Field assignment | A field assignment references an app that no longer exists. |
| `field_assignment_record_missing` | Field assignment | A field assignment references a record that no longer exists. |
| `field_assignment_option_missing` | Field assignment | A field assignment references a select option that no longer exists. |
| `checklist_property_value_variable_missing` | Checklist property | A checklist property assignment references a variable that no longer exists. |
| `checklist_property_value_value_missing` | Checklist property | A checklist property assignment references a value that no longer exists. |
| `checklist_property_user_missing` | Checklist property | A checklist property assignment references a user that no longer exists. |
| `action_invalid` | Action | An action is invalid. |
| `action_variable_missing` | Action | An action references a variable that no longer exists. |
| `action_value_missing` | Action | An action references a value that no longer exists. |
| `action_user_missing` | Action | An action references a user that no longer exists. |
| `action_app_missing` | Action | An action references an app that no longer exists. |
| `action_app_invalid` | Action | An action references an app that is not valid here. |
| `action_view_missing` | Action | An action references an app view that no longer exists. |
| `action_automation_missing` | Action | An action calls an automation that no longer exists. |
| `action_automation_invalid` | Action | An action calls an automation that is not callable here. |
| `action_call_argument_invalid` | Action | An action passes a call argument that the target automation does not accept. |

:::note What about `filter_value_missing`?
`filter_value_missing` is still part of the published `AutomationBrokenReasonCode` type, but no validation path returns it. Treat it as *reserved*: your code can keep handling it, but don't expect it.

`validate` checks only meaning, and create and [update](/docs/api/resource/automation/manage) already reject a malformed value with `400`. A value that references a deleted field or variable returns `filter_value_variable_missing`. A value that resolves to empty isn't a `validate` fault: it [matches every record when the automation runs](/docs/automations/troubleshooting/filter-values).
:::

## Next steps

- [Run & simulate](/docs/api/resource/automation/execution): validate an automation on demand.
- [Automation object](/docs/api/resource/automation/reference/object): `broken` and `broken_reason` on the object.
- [Filters](/docs/api/resource/automation/reference/filters): avoid `400` with matching value tags.
- [Automation run](/docs/api/resource/automation-run#the-run-object): why a run failed, in `failure_reason` and `error_message`.
- [Errors](/docs/api/errors): the error envelope and codes for the whole API.
