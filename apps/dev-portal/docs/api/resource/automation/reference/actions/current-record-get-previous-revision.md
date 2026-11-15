---
id: current-record-get-previous-revision
title: current_record_get_previous_revision
sidebar_label: current_record_get_previous_revision
description: Config reference for the Tape automation current_record_get_previous_revision action, with its config and an example.
---

Use this action to load the previous revision of the record that an automation runs on.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Get previous values of the current record** in the [Current record](/docs/api/resource/automation/reference/actions#current-record) family. Its `group` is `action`, and it needs a trigger with a record: `record_created`, `record_updated`, `record_deleted`, `record_comment_or_reply_created`, `date_field_arrived`, `automation_called` or `weblink_clicked`.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

Put this action before an action that compares a deal's old and new amount:

```json
{
  "type": "current_record_get_previous_revision",
  "config": {}
}
```

## Config

This action takes no config. Send an empty object: `"config": {}`.

## Use the previous values in a later action

Later actions read a value of the previous revision with a field [reference](/docs/api/resource/automation/dynamic-values) that has `"previous": true`. This reference reads the old deal amount:

```json
{ "kind": "variable", "source": "field", "field_id": 601, "field_type": "number", "previous": true, "collection": false, "triggering": false }
```

To find the field IDs, see [App and field IDs](/docs/api/resource/app#find-app-and-field-ids).

## General behavior {#validation--behavior}

- The schema has no properties and refuses any extra key. Leaving out the `config` key returns `400`.
- The action loads the revision before the current one.
- Without a trigger that has a record, validation reports the [broken reason](/docs/api/resource/automation/reference/errors#broken-reason-codes) `action_invalid`. `periodic` and `webhook_received` have no record.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.
- The automation needs a trigger with a record.

<a id="see-also"></a>

## Next steps

- [Dynamic values](/docs/api/resource/automation/dynamic-values): read previous values with field references.
- [Record revisions](/docs/api/resource/record-revision): the revisions of a record in the API.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
