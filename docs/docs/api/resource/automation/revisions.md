# Revisions

> Every automation edit appends an immutable revision — list and retrieve the version history, and roll a definition back.

Use these endpoints to read the version history of an automation and to roll its definition back.

Every change to an automation adds a *revision*: a frozen, unchangeable snapshot of its definition. There is no pointer to an "active version". To [roll back](#roll-back-to-a-revision), retrieve a revision and send its definition back with [`PUT`](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation).

> Which capability do I need?
> 
> Both endpoints need **Read automations** (`automations:read`) and the **Admin** role in the app's workspace. They work with a [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens), an [OAuth access token](https://developers.tapeapp.com/docs/api/oauth/overview) or a [user API key](https://developers.tapeapp.com/docs/api/authentication#user-api-key). Each request costs `1x` base credits.

## List revisions

Use this endpoint to list the full history of an automation.

`GET https://api.tapeapp.com/v1/automation/{automation_id}/revision`

*Request*

```shell
curl https://api.tapeapp.com/v1/automation/4021/revision \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "revisions": [
    {
      "id": "90071992547409929",
      "automation_id": 4021,
      "created_at": "2024-05-20 18:03:08",
      "created_at_utc": "2024-05-20 16:03:08",
      "name": "Email the owner on a new high-priority lead",
      "paused": false,
      "broken": false,
      "trigger": { "type": "record_created", "config": {} },
      "filter": null,
      "actions": []
    }
  ]
}
```

**General behavior**

-   Revisions are sorted *newest first*.
-   The list has *no pagination*: no `cursor` and no `total`.
-   Simulation snapshots aren't included.

**Requirements:** `automations:read`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

## Retrieve a revision

Use this endpoint to read one revision of an automation.

`GET https://api.tapeapp.com/v1/automation/{automation_id}/revision/{revision_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/automation/4021/revision/90071992547409929 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

The response is `{ revision }`.

**General behavior**

-   The revision must belong to this automation.
-   The endpoint never reveals which revision IDs exist. See [Errors](#errors).

**Requirements:** `automations:read`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

## Roll back to a revision

A revision is a *read* snapshot. Its envelope is wider than the [update](https://developers.tapeapp.com/docs/api/resource/automation/manage) body accepts, so a `PUT` of the whole revision fails with `400`.

The first revision in the list is the current state. Pausing and activating add revisions too. Pick the revision whose `filter` and `actions` you want back.

Send back only its definition members: `name`, `trigger`, `filter` and `actions`. The `PUT` needs `automations:edit`. Then [validate](https://developers.tapeapp.com/docs/api/resource/automation/execution#validate-an-automation) the automation: an older definition can point to fields that no longer exist.

-   The envelope keys `id`, `automation_id`, `created_at`, `created_at_utc`, `paused` and `broken` aren't writable. The update body rejects unknown keys.
-   A `filter` or action condition with a *collection-change condition* (**Has been added**, **Has been deleted** or **Changed item contains**) has no writable form. Remove it first. See [Filters](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters#v1-limitations).
-   Conditions with `has_changed`, `has_changed_to` and `has_changed_to_any_of` are writable. So are conditions on fields, record metadata, trigger outputs and action outputs.
-   The server-assigned `webhook_url` of a `webhook_received` trigger is on the live automation object, but not in a revision. It never causes a `400` on rollback.

> Why doesn't a rollback restore the description?
> 
> A revision has *no `description`*. `description` keeps its current value, so reset it separately if you need to revert it too.

## The revision object

A revision is a snapshot of the automation's *definition* at one edit.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `id` | `string` | The revision ID, a 64-bit value returned as a string. | `"90071992547409929"` |
| `automation_id` | `integer` | The automation this revision belongs to. | `4021` |
| `created_at` | `string` | When the revision was created, `YYYY-MM-DD HH:mm:ss`, in your timezone. | `"2024-05-20 18:03:08"` |
| `created_at_utc` | `string` | Same instant as `created_at`, in UTC. | `"2024-05-20 16:03:08"` |
| `name` | `string` | The name at this revision. | `"Email the owner on a new high-priority lead"` |
| `paused` / `broken` | `boolean` | The state at this revision. | `false` |
| `trigger` | `object` | `null` | The [trigger](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers) at this revision. | `{ "type": "record_created", "config": {} }` |
| `filter` | `object` | `null` | The [filter](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) at this revision. | `null` |
| `actions` | `array` | The [actions](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions) at this revision. | `[]` |

A revision has fewer fields than the [automation object](https://developers.tapeapp.com/docs/api/resource/automation/reference/object). It has no `description`, `broken_reason`, `updated_at`, `app_id` or `workspace_id`.

## Errors

-   An automation ID that isn't an integer returns `400`.
-   A credential that doesn't act on behalf of a user, for example an automation API key, returns `401`.
-   A token without `automations:read` returns `403`.
-   An automation or revision that isn't available to you returns `404`. A `revision_id` that is unknown, malformed or belongs to another automation returns the same `404`.

See [Errors & broken reasons](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors) for the Automation API and [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Next steps

[

Manage

send a revision's definition back with update.

](https://developers.tapeapp.com/docs/api/resource/automation/manage)[

Filters

which conditions can't be written back.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters#v1-limitations)[

Automation object

the full live object.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/object)
