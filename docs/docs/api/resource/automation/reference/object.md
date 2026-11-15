# The automation object

> The Tape automation object — its fields, the paused/broken status model, and identifiers.

The automation object describes one automation: its trigger, filter and actions, its state and its timestamps.

Retrieve, create, update, the lifecycle endpoints and delete return it wrapped as `{ "automation": … }`. The [list endpoints](https://developers.tapeapp.com/docs/api/resource/automation/manage) return it in `automations[]`.

*Response*

```json
{
  "automation": {
    "id": 4021,
    "app_id": 87,
    "workspace_id": 12,
    "name": "Email the owner on a new high-priority lead",
    "description": "Notifies the record owner whenever a lead is created.",
    "paused": false,
    "broken": false,
    "broken_reason": null,
    "trigger": { "type": "record_created", "config": {} },
    "filter": {
      "operator": "and",
      "rows": [
        {
          "id": "6a1f…",
          "subject": { "kind": "variable", "source": "field", "field_id": 512, "field_type": "single_category", "previous": false, "collection": false, "triggering": false },
          "operator": "is_any_of",
          "value": { "type": "ids", "ids": [9001] }
        }
      ]
    },
    "actions": [
      { "id": "3f9a2c", "type": "send_email", "group": "action", "config": { "to_address": ["juliet@acme.com"], "subject": ["A new lead was created"] } }
    ],
    "created_at": "2024-05-14 11:12:31",
    "created_at_utc": "2024-05-14 09:12:31",
    "updated_at": "2024-05-20 18:03:08",
    "updated_at_utc": "2024-05-20 16:03:08"
  }
}
```

The example comes from a user whose timezone is two hours ahead of UTC.

## Automation object properties

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `id` | `integer` | ID of the automation. | `4021` |
| `app_id` | `integer` | The app the automation belongs to. Only database apps can have automations. | `87` |
| `workspace_id` | `integer` | The workspace the app belongs to. | `12` |
| `name` | `string` | Name of the automation. | `"Email the owner on a new high-priority lead"` |
| `description` | `string` | Optional. Absent when the automation has none. | `"Notifies the record owner whenever a lead is created."` |
| `paused` | `boolean` | Whether the automation is paused. See [Status and lifecycle](https://developers.tapeapp.com/docs/api/resource/automation/overview#status-and-lifecycle). | `false` |
| `broken` | `boolean` | Whether the definition can't run. Shows the last verdict Tape *stored*, not your current edit. See [The `broken` flag](#the-broken-flag). | `false` |
| `broken_reason` | `object` | `null` | `{ errors: [...] }` when Tape recorded reasons, otherwise `null`. Can be `null` even when `broken` is `true`, see [The `broken` flag](#the-broken-flag). The entries have the same shape as in [validate](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors). | `null` |
| `trigger` | `object` | `null` | The single [trigger](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers) `{ type, config }`, or `null`. | `{ "type": "record_created", "config": {} }` |
| `filter` | `object` | `null` | The root [filter group](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters), or `null` when there is no filter. | See the example above. |
| `actions` | `array` | The ordered list of [actions](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions). `[]` when there are none. | See the example above. |
| `created_at` | `string` | Creation time, `YYYY-MM-DD HH:mm:ss`, in your timezone. | `"2024-05-14 11:12:31"` |
| `created_at_utc` | `string` | Same instant as `created_at`, in UTC. | `"2024-05-14 09:12:31"` |
| `updated_at` | `string` | Last-modified time, `YYYY-MM-DD HH:mm:ss`, in your timezone. | `"2024-05-20 18:03:08"` |
| `updated_at_utc` | `string` | Same instant as `updated_at`, in UTC. | `"2024-05-20 16:03:08"` |

The object has *no `status` field*. The state is the pair `paused` and `broken`. It also has *no owner or author field* in this release.

## The `broken` flag

`broken` shows the last verdict Tape *stored*. Create, update, `activate` and `validate` never write it, and a failed `activate` returns `409` with the object unchanged. So a newly saved definition that can't run still reads `broken: false`, and `broken_reason` can differ from what [`validate`](https://developers.tapeapp.com/docs/api/resource/automation/execution) returns.

Tape *does* set `broken: true` when a run finds that a valid automation stopped working, for example because:

-   its filter can't be built anymore,
-   a field it watches is deleted,
-   a connection it uses is removed.

Until such a run, the object still reads `broken: false`: `activate` refuses with `409`, but a manual run or a simulation is accepted and fails. Once `broken` is `true`:

-   the trigger doesn't fire the automation,
-   a manual run or a simulation returns `409`,
-   `broken_reason` can be `null`.

Call [`validate`](https://developers.tapeapp.com/docs/api/resource/automation/execution) for a current verdict.

## Identifiers

`id`, `app_id` and `workspace_id` are plain JSON *integers*. A [revision](https://developers.tapeapp.com/docs/api/resource/automation/revisions) ID is a 64-bit value, sent as a string.

Node IDs inside `filter` and `actions` are opaque *strings*: treat them as handles, not numbers. Tape keeps an ID you send and creates a UUID when you leave it out.

## Next steps

[

Automation API

concepts, capabilities and the lifecycle.

](https://developers.tapeapp.com/docs/api/resource/automation/overview)[

Triggers

the `trigger` block.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers)[

Filters

the `filter` block.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters)[

Actions

the `actions` block.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)[

Errors & broken reasons

what `broken_reason` can contain.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors)
