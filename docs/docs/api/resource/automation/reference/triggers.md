# Triggers

> The nine Tape automation trigger types and how to configure them.

Use one of the nine trigger types to decide *when* an automation runs.

A trigger is a flat object `{ type, config }`, and an automation has zero or one. [`GET /v1/automation/meta/trigger`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) returns the full, current catalog with the `config_schema` of each type. Build against it instead of hard-coding.

## Trigger types

`Label` is the name that `meta/trigger` returns. **Name in Tape** is the name in the automation editor.

| `type` | Label | Name in Tape | Fires when … |
| --- | --- | --- | --- |
| `record_created` | Record created | **Record created** | A record is created in the app. |
| `record_updated` | Record updated | **Record updated** | A record is updated, optionally only when specific fields change. |
| `record_deleted` | Record deleted | **Record deleted** | A record is deleted. |
| `record_comment_or_reply_created` | Comment or reply created | **Comment added** | A comment or reply is added to a record. |
| `date_field_arrived` | Date arrived | **Date arrives** | A date from a field is reached, optionally with an offset. |
| `automation_called` | Automation called | **Automation calls** | Another automation calls this one. |
| `periodic` | Periodic | **On schedule** | A recurring schedule is due. |
| `webhook_received` | Webhook received | **Webhook received** | An inbound webhook comes in. |
| `weblink_clicked` | Weblink clicked | **Web link clicked** | Someone opens a generated weblink. |

![Trigger picker in the automation editor with the list of all nine triggers](https://developers.tapeapp.com/assets/images/trigger-picker-2de368882811db1d37c91f422fb565c4.png)

## Config

This trigger fires only when the field with ID `512` changes:

*Trigger*

```json
{ "type": "record_updated", "config": { "trigger_on_changes_field_ids": [512] } }
```

Each type has its own `config` shape, described by its `config_schema`. Values can be [dynamic](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) where the type allows it.

> Which field changes fire `record_updated`?
> 
> `trigger_on_changes_field_ids` has three states:
> 
> -   `null` or left out: fires on a change to *any* field.
> -   A list with field IDs: fires only on changes to those fields.
> -   An *empty `[]`: never fires*. `validate` reports `trigger_updated_fields_empty`.

`app_id` is *not* a config field. Tape takes the app from the automation itself and ignores a legacy `config.app_id`. See [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation).

> Why does Tape reject a config field it returned?
> 
> Some config fields are *set by Tape and read-only*, for example the `webhook_url` of a `webhook_received` trigger. They appear when you read a config, and Tape *rejects them on write*. The `config_schema` marks them with `"readOnly": true` (standard JSON Schema), so remove them before you send a config.

> What are the `_enabled` flags for?
> 
> Some config values only take effect when a boolean next to them, `<field>_enabled`, is `true`. The `automation_called` and `weblink_clicked` triggers pair `triggering_app_ids` with `triggering_app_ids_enabled`, and `custom_variable_defs` with `custom_variable_defs_enabled`.
> 
> A minimal `{}` config is accepted, because all members are optional. Send the paired `_enabled` flag whenever you set its value.

## Set or remove a trigger

-   To set or replace a trigger, use [`PUT /v1/automation/{automation_id}/trigger`](https://developers.tapeapp.com/docs/api/resource/automation/manage), where the whole body is the trigger. Or include `trigger` when you [create or update](https://developers.tapeapp.com/docs/api/resource/automation/manage) an automation.
-   To remove a trigger, send `trigger: null` in an update.

## Next steps

[

Discovery

read the `config_schema` of each trigger.

](https://developers.tapeapp.com/docs/api/resource/automation/discovery)[

Dynamic values

the outputs a trigger hands to the run.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Run & simulate

the run body each trigger expects.

](https://developers.tapeapp.com/docs/api/resource/automation/execution)[

Advanced / sandbox

fire `automation_called` and `weblink_clicked`.

](https://developers.tapeapp.com/docs/api/resource/automation/advanced)[

Actions

which actions need which trigger.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#trigger-context)
