---
id: triggers
title: Triggers
sidebar_label: Triggers
description: The nine Tape automation trigger types and how to configure them.
---

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

A trigger decides **when** an automation runs. It is a flat object `{ type, config }`; an automation has zero or one.
The `config` keys are per the trigger type's `config_schema`, which — with the full, always-current catalog — is
served by [`GET /v1/automation/meta/trigger`](/docs/api/resource/automation/discovery). Build against that rather than
hard-coding.

## Trigger types

| `type` | Fires when… |
| --- | --- |
| `record_created` | A record is created in the app. |
| `record_updated` | A record is updated (optionally only when specific fields change). |
| `record_deleted` | A record is deleted. |
| `record_comment_or_reply_created` | A comment or reply is added to a record. |
| `date_field_arrived` | A date field's value arrives, relative to now. |
| `automation_called` | Another automation calls this one. |
| `periodic` | On a schedule. |
| `webhook_received` | An inbound webhook is received. |
| `weblink_clicked` | A generated weblink is clicked. |

## Config

Each type has its own `config` shape — see the `config_schema` from
[`GET /v1/automation/meta/trigger`](/docs/api/resource/automation/discovery). Values may be
[dynamic](/docs/api/resource/automation/dynamic-values) where the type allows it.

:::note Output-only config fields
Some config fields are **server-assigned and read-only** — for example a `webhook_received` trigger's `webhook_url`.
They appear on read but are **rejected on input**. The input `config_schema` is the read schema minus these fields.
:::

:::note Companion `_enabled` flags
Some config values are gated by a sibling boolean `<field>_enabled` — the value takes effect only when its `_enabled`
flag is `true`. The `automation_called` / `weblink_clicked` triggers pair `triggering_app_ids` with
`triggering_app_ids_enabled` and `custom_variable_defs` with `custom_variable_defs_enabled`. A minimal `{}` config is
accepted — all members are optional, and `app_id` is **not** a config field (it is stamped from the automation's own
app); send the paired `_enabled` flag whenever you set its value.
:::

:::note `record_updated`: which fields fire it
The `record_updated` trigger's `trigger_on_changes_field_ids` is tri-state: `null` or omitted fires on **any** field
change; a non-empty list restricts firing to those fields; an **empty `[]` never fires** (the definition validates as
broken).
:::

To set or replace a trigger, use [`PUT /v1/automation/{automation_id}/trigger`](/docs/api/resource/automation/manage)
(the whole body is the trigger), or include `trigger` in a [create or update](/docs/api/resource/automation/manage).
To remove one, send `trigger: null` on update.
