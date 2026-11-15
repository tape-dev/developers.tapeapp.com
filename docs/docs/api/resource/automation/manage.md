# Manage automations

> Create, retrieve, list, update, replace the trigger, activate, pause, and delete Tape automations through the Developer API.

Use these endpoints to create, read, list, change, activate, pause and delete automations.

Every endpoint returns the [automation object](https://developers.tapeapp.com/docs/api/resource/automation/reference/object), wrapped as `{ automation }`, except the list endpoints.

> Which credential and capability do I need?
> 
> All endpoints on this page need a credential that acts on behalf of a user: a [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens), an [OAuth access token](https://developers.tapeapp.com/docs/api/oauth/overview) or a [user API key](https://developers.tapeapp.com/docs/api/authentication#user-api-key). Retrieve and list need `automations:read`, all other endpoints need `automations:edit` (see [Capabilities](https://developers.tapeapp.com/docs/api/capabilities)).
> 
> You need the **Admin** role in the app's workspace. Automations you can't use return the same `404`. See [Authentication and permissions](https://developers.tapeapp.com/docs/api/resource/automation/overview#authentication-and-permissions).

## Create an automation

Use this endpoint to create an automation in an app.

`POST https://api.tapeapp.com/v1/automation/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/automation/app/87 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "Email the owner on a new high-priority lead",
    "trigger": { "type": "record_created", "config": {} }
  }'
```

**JSON**

*Request*

```json
{
  "name": "Email the owner on a new high-priority lead",
  "trigger": { "type": "record_created", "config": {} }
}
```

The response is `201` with the new automation.

**General behavior**

-   A new automation starts *paused and not broken*: a valid draft that you finish and then [activate](#activate-an-automation).
-   Node IDs inside `filter` and `actions` are optional. Tape creates them when you leave them out.
-   `description` and `trigger` don't accept `null` here, unlike in [update](#update-an-automation).
-   Tape checks create and update bodies against a *closed schema*. Any top-level property that isn't in the table below returns `400`. So does an unknown key inside a trigger's `config`.
-   Each action in `actions[]` needs both `type` and `config`. The `config` can be an empty `{}`. An action without a `config` key returns `400`.

> What happens to `app_id` in a trigger config?
> 
> Tape accepts a legacy `app_id` key in a trigger's `config`, checks that it's an integer (otherwise `400`) and drops it unread. The automation's app comes from the automation itself, so a wrong or unknown `app_id` has no effect. Leave it out in new integrations.

> How many automations can an app hold?
> 
> An app can hold at most 500 automations. When an app reaches this limit, Tape rejects further create requests with an error until you delete an automation.

**Requirements:** `automations:edit`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

**Body parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | yes | 1 to 5000 characters. |
| `description` | `string` | no | Up to 25000 characters. |
| `trigger` | `object` | no | A [trigger](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers) `{ type, config }`. |
| `filter` | `object` | no | A [filter group](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters). |
| `actions` | `array` | no | An ordered list of [actions](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions). |

## Retrieve an automation

Use this endpoint to read one automation with its trigger, filter and actions.

`GET https://api.tapeapp.com/v1/automation/{automation_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/automation/4021 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

The response is `{ automation }` with its `trigger`, `filter` and `actions` inlined.

**Requirements:** `automations:read`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

## List automations

Use these endpoints to list the automations in an app, in a workspace, or in every workspace you administer in your organization.

`GET https://api.tapeapp.com/v1/automation/app/{app_id}`

`GET https://api.tapeapp.com/v1/automation/workspace/{workspace_id}`

`GET https://api.tapeapp.com/v1/automation/org`

*Request*

```shell
curl "https://api.tapeapp.com/v1/automation/app/87?limit=2" \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "total": 12,
  "automations": [ { "id": 4021, "name": "Email the owner on a new high-priority lead", "paused": false, "broken": false }  ],
  "cursor": "eyJhbGciOiJI..."
}
```

Each entry is a full automation object. The example is shortened.

**General behavior**

-   The `org` variant takes the organization from your credential. It has no path scope. If you administer nothing, it returns an *empty page*, not `404`.
-   With a personal access token, the `org` variant lists only automations in apps of the token's [content access](https://developers.tapeapp.com/docs/api/personal-access-tokens#content-selection). The `workspace` variant needs the whole workspace in the content access. Selected apps alone return `404` there.
-   Looking for one automation? Add `query` with part of its name.
-   Results are sorted *oldest first*, by ID.
-   `total` is a snapshot taken on the first page. `cursor` is `null` on the last page. See [Pagination](https://developers.tapeapp.com/docs/api/pagination).
-   The `cursor` is *bound to its scope*: this app, this workspace or your organization. A cursor sent to a different scope returns `400`, not an empty page. Send each cursor back only to the list call that produced it.

**Requirements:** `automations:read`, and the **Admin** role in the workspaces you list. Works with a personal access token, an OAuth access token or a user API key.

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `cursor` | `string` | The `cursor` of the previous response. Leave it out for the first page. |
| `limit` | `integer` | Page size, `1` to `100`. Defaults to `50`. |
| `query` | `string` | Only automations whose name contains this text, ignoring case. An empty value returns `400`. Leave it out to list all. |

## Update an automation

Use this endpoint to change some fields of an automation and keep the rest.

`PUT https://api.tapeapp.com/v1/automation/{automation_id}`

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/automation/4021 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{ "description": "Notifies the owner of new leads." }'
```

The response is `200` with the whole automation, wrapped as `{ "automation": { … } }`.

**General behavior**

-   This is a *partial update*. A field you leave out stays unchanged.
-   An explicit `null` clears `description`, `trigger` or `filter`. `name` can't be `null`.
-   `actions`, when present, *replaces the whole list*. Send `[]` to empty it.
-   Every update that changes the automation creates a new [revision](https://developers.tapeapp.com/docs/api/resource/automation/revisions).

> Why doesn't `broken` change when I save?
> 
> `broken` shows the last verdict Tape *stored*: create, update, `activate` and `validate` never write it, and a failed `activate` returns `409` with the object unchanged. Call [`validate`](https://developers.tapeapp.com/docs/api/resource/automation/execution) for a current verdict. [The automation object](https://developers.tapeapp.com/docs/api/resource/automation/reference/object#the-broken-flag) has the full `broken` model.

**Requirements:** `automations:edit`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

**Body parameters** (all optional)

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | New name, 1 to 5000 characters. |
| `description` | `string` | `null` | Set, or `null` to clear. |
| `trigger` | `object` | `null` | Replace, or `null` to remove. |
| `filter` | `object` | `null` | Replace, or `null` to clear. |
| `actions` | `array` | Replace the whole list. |

## Replace the trigger

Use this endpoint to swap the trigger of an automation.

`PUT https://api.tapeapp.com/v1/automation/{automation_id}/trigger`

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/automation/4021/trigger \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{ "type": "record_updated", "config": {} }'
```

The response is `200` with the whole automation, wrapped as `{ "automation": { … } }`.

**General behavior**

-   The *whole body is the trigger*, `{ type, config }`.
-   It replaces any existing trigger and creates a revision.
-   To *remove* a trigger, use [update](#update-an-automation) with `trigger: null`.

**Requirements:** `automations:edit`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

## Activate an automation

Use this endpoint to set an automation live.

`POST https://api.tapeapp.com/v1/automation/{automation_id}/activate`

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/automation/4021/activate \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

The response is `200` with the whole automation, wrapped as `{ "automation": { … } }`.

**General behavior**

-   No request body.
-   Tape checks the definition again on every call. A broken definition returns `409`. Use `validate` to see the reasons.
-   Activating an automation that is already live succeeds and changes nothing, as long as the definition stays valid.

**Requirements:** `automations:edit`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

## Pause an automation

Use this endpoint to stop the trigger from firing an automation.

`POST https://api.tapeapp.com/v1/automation/{automation_id}/pause`

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/automation/4021/pause \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

The response is `200` with the whole automation, wrapped as `{ "automation": { … } }`.

**General behavior**

-   No request body.
-   Pausing twice changes nothing. A broken definition never blocks a pause.

**Requirements:** `automations:edit`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

## Delete an automation

Use this endpoint to delete an automation.

`DELETE https://api.tapeapp.com/v1/automation/{automation_id}`

*Request*

```shell
curl -X DELETE https://api.tapeapp.com/v1/automation/4021 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

**General behavior**

-   This is a *soft delete*, the same as in Tape. The automation drops out of every list and can't be retrieved, but the data stays.
-   The response is `200` with the final, soft-deleted automation as confirmation, not `204`.

**Requirements:** `automations:edit`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

## Rate limit credits

The three *list* endpoints cost `2x` base credits. Every other endpoint on this page costs `1x`. See [Request limits](https://developers.tapeapp.com/docs/api/request-limits).

## Errors

-   A body with a property the schema doesn't know, an action without `config`, a path ID that isn't an integer, or a `cursor` sent to another scope returns `400`.
-   A credential that doesn't act on behalf of a user, for example an automation API key, returns `401`.
-   A token without `automations:read` or `automations:edit` returns `403`.
-   An automation, app or workspace that isn't available to you returns `404`. This includes automations in workspaces you don't administer and apps outside your personal access token's content access.
-   [Activating](#activate-an-automation) a broken automation returns `409`.

See [Errors & broken reasons](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors) for the Automation API and [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Next steps

[

Run & simulate

validate, run and simulate an automation.

](https://developers.tapeapp.com/docs/api/resource/automation/execution)[

Revisions

read the version history and roll a definition back.

](https://developers.tapeapp.com/docs/api/resource/automation/revisions)[

Automation object

every property in detail.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/object)[

Filters

build the condition tree.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters)[

Action examples

ready-made action configs to copy.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)
