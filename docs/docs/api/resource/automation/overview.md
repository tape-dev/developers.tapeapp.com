# Automation

> The Tape Automation API — discover the catalog, then create, version, validate, and run automations (a trigger, an optional filter, and ordered actions) scoped to an app.

Use the Automation API to build, version, check and run automations in Tape through code.

Only want to start an automation that already exists in Tape? You build nothing: [find its ID and run it](#run-an-existing-automation).

An *automation* has a *trigger* that starts it, an optional *filter* that decides whether it goes on, and ordered *actions* that do the work. Each automation belongs to one [app](https://developers.tapeapp.com/docs/api/resource/app).

With this API you can:

-   Discover what an automation can be built from.
-   Create, update and version automations.
-   Validate an automation.
-   Run or simulate an automation on a record.

This API manages the *definitions*. Each time an automation fires, Tape creates an [automation run](https://developers.tapeapp.com/docs/api/resource/automation-run), which you read through its own endpoints.

Writing JavaScript inside an automation? See [Automations](https://developers.tapeapp.com/docs/automations/introduction#execution-environment) for script filters, **Perform a calculation** and **Execute a script**.

## Working with automations

| Page | What it covers |
| --- | --- |
| [Quickstart](https://developers.tapeapp.com/docs/api/resource/automation/quickstart) | The whole lifecycle end to end: discover, create, configure, validate, activate, run, observe. |
| [Discovery](https://developers.tapeapp.com/docs/api/resource/automation/discovery) | The catalog of trigger, action and filter types, with their config schemas. |
| [Manage](https://developers.tapeapp.com/docs/api/resource/automation/manage) | Create, retrieve, list, update, replace the trigger, activate, pause and delete. |
| [Revisions](https://developers.tapeapp.com/docs/api/resource/automation/revisions) | The version history of an automation. |
| [Run & simulate](https://developers.tapeapp.com/docs/api/resource/automation/execution) | Run and simulate on a record, and validate a definition. |
| [Advanced / sandbox](https://developers.tapeapp.com/docs/api/resource/automation/advanced) | The call automation and generate weblink endpoints behind those actions. |
| [Dynamic values](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | How values reference live record and run data. |
| Reference: [object](https://developers.tapeapp.com/docs/api/resource/automation/reference/object) · [triggers](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers) · [filters](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) · [actions](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions) · [errors](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors) | The full object, the lists of types and the error codes. |

## Run an existing automation

Start an automation that someone already built in Tape. You need the **Admin** role in the app's workspace and a [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens) with the capabilities **Read automations** (`automations:read`) and **Run automations** (`automations:run`).

**1\. Find the automation ID.** List the automations you administer. `query` keeps those whose name contains the text, ignoring case.

*Request*

```shell
curl "https://api.tapeapp.com/v1/automation/org?query=lead" \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "total": 1,
  "automations": [ { "id": 4021, "app_id": 87, "name": "Email the owner on a new high-priority lead", "paused": false, "broken": false } ],
  "cursor": null
}
```

Each entry is a full automation object. The example is shortened. Keep the `id`.

Have the automation open in Tape? Its ID is the number after `/edit-workflow/` in the address.

**2\. Run it on a record.** The record must be in the automation's app.

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/automation/4021/manual-run \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{ "record_id": 5001 }'
```

*Response*

```json
{ "message": "Use the automation-run API to poll the run. Based on queueing and limitations, this may be delayed." }
```

The response is `202` with no run ID. The run has real side effects. [The run body depends on the trigger](https://developers.tapeapp.com/docs/api/resource/automation/execution#the-run-body-is-trigger-aware).

**3\. Check the run.** List the runs of the automation and find the one with your `triggered_on_record_id`.

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/automation-run/automation/4021 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{ "limit": 5 }'
```

*Response*

```json
{
  "total": 1,
  "automation_runs": [ { "id": "9001", "automation_id": 4021, "status": "completed", "type": "manual", "triggered_on_record_id": 5001 } ],
  "cursor": null
}
```

The example is shortened. `status` is `pending` or `running` while the run works, then `completed`, `failed` or `cancelled`. [Retrieve the run](https://developers.tapeapp.com/docs/api/resource/automation-run#retrieve-an-automation-run) by its `id` to read the step logs.

> Does the automation have to be live?
> 
> No, a manual run also starts a paused automation. Only a broken one returns `409`. To test without side effects, [simulate](https://developers.tapeapp.com/docs/api/resource/automation/execution#simulate-an-automation) it.

> Want another system to start the automation without a token?
> 
> Give the automation a **Webhook received** trigger and send a `POST` to its webhook URL. [Retrieve the automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#retrieve-an-automation) to read it from `trigger.config.webhook_url`. See [Connect Google Forms to Tape](https://help.tapeapp.com/en/articles/18449044-save-form-responses-with-a-webhook).

## The anatomy of an automation

| Part | Cardinality | What it is |
| --- | --- | --- |
| **Trigger** | 0 or 1 | The event that starts the automation: a record is created, a date arrives, a schedule fires, a webhook comes in, and so on. See [Triggers](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers). |
| **Filter** | 0 or 1 | A recursive `and`/`or` tree of conditions the triggering record must match. Omitted or `null` means the automation runs every time. See [Filters](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters). |
| **Actions** | 0 or more | An ordered list of steps: send an email, create a record, branch, loop, and so on. See [The action object](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#the-action-object). |

The discovery endpoints serve the live *catalog* of trigger types, action types and filter operators, with the exact `config` each one accepts. Build against it instead of hard-coding the list: new types show up there without an API change.

> Coming from Podio?
> 
> A Podio flow or a Globiflow flow becomes an automation. Field references use the `field_id`, not the `external_id`. See [Move your flows](https://developers.tapeapp.com/docs/guide/api/coming-from-podio#move-your-flows) for the trigger and action of each flow step.

## Authentication and permissions

> Which credential and capability do I need?
> 
> Every endpoint on this resource needs a credential that acts on behalf of a user: a [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens), an [OAuth access token](https://developers.tapeapp.com/docs/api/oauth/overview) or a [user API key](https://developers.tapeapp.com/docs/api/authentication#user-api-key). A token also needs the matching capability from the table below. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).

| Capability | Endpoints |
| --- | --- |
| `automations:read` | Discovery, retrieve, list, revisions, validate |
| `automations:edit` | Create, update, replace the trigger, activate, pause, delete |
| `automations:run` | Run, simulate, and the two [Advanced / sandbox](https://developers.tapeapp.com/docs/api/resource/automation/advanced) endpoints |

For the endpoints on Manage, Revisions and Run & simulate, you need the **Admin** role in the app's workspace. That workspace must be in your own organization. A personal access token also needs the app in its [content access](https://developers.tapeapp.com/docs/api/personal-access-tokens#content-selection).

> Can I use an automation API key?
> 
> Only on the [discovery endpoints](#discovery-is-the-exception) and the two Advanced / sandbox endpoints (call automation and generate weblink). Everywhere else it returns `401`, because an [automation API key](https://developers.tapeapp.com/docs/api/authentication) authenticates an automation, not a person. The error message names only the user API key (`Automations can only be retrieved with a user API key.`), but a personal access token or an OAuth access token works too.

#### Discovery is the exception

The three discovery endpoints (`meta/trigger`, `meta/action`, `meta/filter`) return a *static catalog* that is the same for everyone. They have no workspace scope. A token still needs `automations:read`.

#### Unavailable automations return `404`

Tape IDs are unique across all organizations. Every automation you can't use returns the same `404`, so the API never reveals which IDs exist. That covers an automation that doesn't exist, was deleted, is an unsaved draft, is in a workspace you don't administer, or is outside your personal access token's content access.

## The automation object

[The automation object](https://developers.tapeapp.com/docs/api/resource/automation/reference/object) lists every property with an example. [Triggers](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers), [Filters](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) and [Actions](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#the-action-object) describe each part.

Config values can pull in live record data through [dynamic values](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values).

The object page also explains the `broken` flag. [Errors & broken reasons](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors) lists every code in `broken_reason`.

## Status and lifecycle

An automation has no single `status` field. Its state is the pair of booleans `paused` and `broken`:

| `paused` | `broken` | Meaning |
| --- | --- | --- |
| `false` | `false` | **Live.** The automation runs when its trigger fires. |
| `true` | `false` | **Paused.** A valid automation that its trigger doesn't fire. You can still run or simulate it manually. |
| any | `true` | **Broken.** The definition can't run, so it doesn't. |

-   A new automation starts *paused* and not broken: a valid draft that you set up and then activate.
-   **Activate** checks the definition again and refuses a broken one with `409`. **Pause** succeeds every time.
-   Every change creates a new, unchangeable [revision](https://developers.tapeapp.com/docs/api/resource/automation/revisions).

## Identifiers and timestamps

Most IDs on this resource are plain JSON *integers*: `id`, `app_id`, `workspace_id`, and the `automation_id` in a path. Two are *strings*:

-   A revision ID is a 64-bit value, returned as a string so any language can handle it safely.
-   Action `id`s are opaque. Treat them as handles, not numbers.

All timestamps use the Tape API datetime format `YYYY-MM-DD HH:mm:ss`, with no `T` separator, no `Z` suffix and no milliseconds. A plain timestamp such as `created_at` is in your timezone, and its `_utc` twin holds the same instant in UTC. See [Date & timezone](https://developers.tapeapp.com/docs/api/date-timezone).

## Rate limit credits

| Endpoints | Cost |
| --- | --- |
| The list endpoints (app, workspace, organization) | `2x` base credits |
| Everything else: discovery, retrieve, create, update, lifecycle, revisions, validate, run, simulate | `1x` base credits |

These [request credits](https://developers.tapeapp.com/docs/api/request-limits) are separate from the automation *action credits* that a real run uses and reports as `num_consumed_actions`. Runtime limits, such as the cap on actions per run, the cap of 1000 records per collection and the shared email quota, are on [Limits and throttling](https://developers.tapeapp.com/docs/automations/limitations).

## Errors

Errors use the standard envelope: `status_code`, `endpoint`, `error_code` and `error_message`. On this resource:

-   A malformed body, a path ID that isn't an integer, or a run body that doesn't match the trigger returns `400`.
-   A credential that doesn't act on behalf of a user, where the endpoint needs one, returns `401`.
-   A token without the capability the endpoint needs returns `403`. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   An automation, app, workspace, revision or record that isn't available to you returns `404`. See [Unavailable automations return `404`](#unavailable-automations-return-404).
-   Activating, running or simulating a broken automation returns `409`.

See [Errors & broken reasons](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors) for the Automation API and [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Next steps

- [Run an existing automation](https://developers.tapeapp.com#run-an-existing-automation): find the ID, run it and check the run.[

Quickstart

build and run your first automation end to end.

](https://developers.tapeapp.com/docs/api/resource/automation/quickstart)[

Discovery

read the catalog before you build.

](https://developers.tapeapp.com/docs/api/resource/automation/discovery)[

Manage

create, update and activate automations.

](https://developers.tapeapp.com/docs/api/resource/automation/manage)[

Run & simulate

validate, run and simulate.

](https://developers.tapeapp.com/docs/api/resource/automation/execution)[

Automation run

read the runs your automations create.

](https://developers.tapeapp.com/docs/api/resource/automation-run)
