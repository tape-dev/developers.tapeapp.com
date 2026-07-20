---
id: collected-records-send-email
title: collected_records_send_email
sidebar_label: collected_records_send_email
description: Config reference for the Tape automation collected_records_send_email action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Send email for collected records** — sends one email per record in a collection produced by an earlier action. `group: "action"`. No specific trigger context is required.

Part of the [Email & documents](/docs/api/resource/automation/reference/actions#email--documents) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `to_address` | [template value](/docs/api/resource/automation/dynamic-values) | **yes** | Recipient address(es). |
| `subject` | [template value](/docs/api/resource/automation/dynamic-values) | **yes** | Email subject. |
| `record_collection` | [reference](/docs/api/resource/automation/dynamic-values) | no | The record collection to send one email for each of — a prior action's `record_collection` output. Omitted → the enclosing for-loop's collection. |
| `reply_address` | [template value](/docs/api/resource/automation/dynamic-values) | no | Reply-to address. Empty when omitted. |
| `cc_address` | [template value](/docs/api/resource/automation/dynamic-values) | no | CC address(es). Empty when omitted. |
| `bcc_address` | [template value](/docs/api/resource/automation/dynamic-values) | no | BCC address(es). Empty when omitted. |
| `from_address` | [template value](/docs/api/resource/automation/dynamic-values) | no | Sender address. Empty when omitted. |
| `from_name` | [template value](/docs/api/resource/automation/dynamic-values) | no | Sender display name. Empty when omitted. |
| `message_body` | [template value](/docs/api/resource/automation/dynamic-values) | no | HTML email body. Empty when omitted. |
| `smtp_account_id` | integer | no | Id of the SMTP account to send from. Omitted → the organization's **default** SMTP account. |
| `attach_files_variable_defs` | array of [references](/docs/api/resource/automation/dynamic-values) | no | File variables whose files are candidates for attachment. Empty when omitted. |
| `attach_files_match_type` | enum | no | Which candidate files are attached. Default `all`. |
| `attach_files_match_condition` | [filter group](/docs/api/resource/automation/reference/filters) \| `null` | no | Restricts attached files for the `filtered` / `most_recent_filtered` modes. Empty condition ("match all") when omitted or `null`. |
| `fields_expanded` | boolean | no | Editor-only flag: whether the address fields are expanded in the editor. Carried through when present. |

**`attach_files_match_type` tokens** (lower-case): `all`, `filtered`, `most_recent`, `most_recent_filtered`. `all` and
`most_recent` ignore the condition; `filtered` and `most_recent_filtered` restrict to files matching
`attach_files_match_condition`.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "collected_records_send_email",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 812 },
    "to_address": ["someone@example.com"],
    "subject": ["Record update: ", { "kind": "variable", "source": "meta", "meta_type": "app_record_id" }],
    "message_body": ["<p>One of the collected records changed.</p>"],
    "smtp_account_id": 812
  }
}
```

## Validation & behavior

- Structurally identical to [`send_email`](/docs/api/resource/automation/reference/actions/send-email), plus the optional `record_collection` reference: the action sends one email per record in the collection.
- The discovery schema serves `to_address` and `subject` as required; the typed DTO carries every template field as optional and the mapper fills the empty template (`[]`) when omitted (beta — see meta/action).
- With `record_collection` omitted, the action consumes the record collection bound by the enclosing for-loop.
- Every other address/name/body template defaults to empty; `attach_files_variable_defs` defaults to `[]`, `attach_files_match_type` to `all`, and `attach_files_match_condition` to the empty "match all" condition.
- With `smtp_account_id` omitted, the send uses the organization's default SMTP account. Automation email sends draw down the organization's shared 24-hour send quota.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Filters](/docs/api/resource/automation/reference/filters) — the filter-group shape used by `attach_files_match_condition`
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
