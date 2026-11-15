---
id: execution
title: Run & simulate
sidebar_label: Run & simulate
description: Run and simulate a Tape automation against a record, and validate a definition — including the asynchronous run model.
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use these endpoints to run an automation for real, simulate it without side effects, and validate its definition.

:::info Which capability do I need?
Run and simulate need **Run automations** (`automations:run`), validate needs **Read automations** (`automations:read`). All three need the **Admin** role in the app's workspace and work with a [personal access token](/docs/api/personal-access-tokens), an [OAuth access token](/docs/api/oauth/overview) or a [user API key](/docs/api/authentication#user-api-key). See [Capabilities](/docs/api/capabilities).
:::

## The run body is trigger-aware

Manual run and simulate share one body. Send the payload that the automation's *trigger* expects. The automation in the path already fixes the trigger, so you don't name it again.

| Trigger                                                                                                                                       | Body                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Record-based (`record_created`, `record_updated`, `record_deleted`, `date_field_arrived`, `record_comment_or_reply_created`, `automation_called`, `weblink_clicked`) | `{ "record_id": <id> }`                                                                             |
| `webhook_received`                                                                                                                            | `{ "webhook_payload": <object or string> }` *or* `{ "use_last_received_webhook_payload": true }` |
| `periodic`, or no trigger                                                                                                                     | `{}`                                                                                                |

A well-formed body that doesn't match the automation's *actual* trigger returns `400`.

:::note Does a paused automation still run?
Yes. Manual run and simulate use the automation's *stored definition, whether it's paused or not*, so you can test without setting it live. Only a *broken* definition returns `409`.

The [call automation endpoint](/docs/api/resource/automation/advanced) works differently: it creates *no run* for a paused target and reports no error.
:::

:::info Why is there no run ID in the response?
Both endpoints queue the work for a background worker and answer `202` with a fixed message. A manual run creates its run only after the record passes the filter. A simulation skips the filter. To see the result, poll [List runs for an automation](/docs/api/resource/automation-run#list-runs-for-an-automation) and match `triggered_on_record_id` to your record. `type` tells real and simulation runs apart (`manual` or `simulation`).
:::

:::note When do run logs show up?
A run's per-action `logs` arrive *after* the run reaches a final status (`completed` or `failed`). The trigger and filter steps are there from the start.

- Poll for the *specific* log entry you need. Don't wait for `logs.length > 0`, which can return before an action's entry is in.
- Some successful steps write no per-action `success` entry: the control-flow containers (`conditional`, `for_loop`), `collected_records_collect_referenced_records` and `create_pdf`. For those, a final `completed` without a setup failure is the success signal.
- An action with `deactivate: true` writes no entry. Tape removes it before the run starts, so it's *missing* from the log, not listed as `skipped`. See [Automation run](/docs/api/resource/automation-run) for how the two differ and when `skipped` appears.
:::

## Run an automation

Use this endpoint to run an automation on a record, with *real side effects*.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation/{automation_id}/manual-run" />

To find `automation_id`, see [List automations](/docs/api/resource/automation/manage#list-automations). In the automation editor, it's the number after `/edit-workflow/` in the address.

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation/4021/manual-run \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{ "record_id": 5001 }'`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='Response'>
{`{ "message": "Use the automation-run API to poll the run. Based on queueing and limitations, this may be delayed." }`}
</ContextCodeBlock>

To check the run, follow step 3 of [Run an existing automation](/docs/api/resource/automation/overview#run-an-existing-automation).

**General behavior**

- This is the API version of **Manual run** in the automation editor, for one record. See [Execution types](/docs/automations/execution-types).
- Tape queues the run with at-least-once delivery. One request can run the automation more than once.
- Tape applies the filter. A record that doesn't match creates no run.
- Each request costs `1x` base credits. A real run also uses automation *action credits*, reported as `num_consumed_actions`.
- `record_id` must point to a *live* record in the automation's app. A deleted record, a record in another database app or an unknown ID returns `404` before Tape schedules the run.
- To test `current_record_restore`, delete the record *within* the run: put a `current_record_delete` step before it.

:::note Why does my comment automation create no run?
For a `record_comment_or_reply_created` automation, a manual run uses the record's *most recent* comment or reply as the current comment. A record *without* comments or replies creates *no run*. The endpoint still answers `202`.
:::

**Requirements:** `automations:run`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- An automation ID that isn't an integer, or a body that doesn't match the trigger, returns `400`.
- A credential that doesn't act on behalf of a user returns `401`.
- A token without `automations:run` returns `403`.
- An automation or record that isn't available to you returns `404`.
- A broken automation returns `409`.

## Simulate an automation

Use this endpoint to run the automation's stored definition as a dry run, with *no side effects*.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation/{automation_id}/simulate" />

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation/4021/simulate \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{ "record_id": 5001 }'`}
</ContextCodeBlock>

The response is the same `202` with `{ "message": … }` as for [Run](#run-an-automation), with no run ID.

**General behavior**

- A simulation creates a *simulation* run every time. Most run lists leave it out. [List runs for an automation](/docs/api/resource/automation-run#list-runs-for-an-automation) shows it, and you can retrieve it by ID.
- The body is the same as for [Run](#run-an-automation). Each request costs `1x` base credits.
- You also need view access to the target record.

**Requirements:** `automations:run`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

The same causes as for [Run](#run-an-automation) return `400`, `401`, `403`, `404` and `409`.

## Validate an automation

Use this endpoint to check whether the current definition can run.

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation/{automation_id}/validate" />

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/automation/4021/validate \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='Response'>
{`{
  "valid": false,
  "errors": [
    { "code": "action_app_missing", "message": "An action references an app that no longer exists.", "action_id": "a1b2c3", "app_id": 42, "deactivated": false }
  ]
}`}
</ContextCodeBlock>

**Key fields**

- `valid`: `true` when no error sits in an active part of the automation. An entry with `deactivated: true` doesn't count.
- `errors`: one entry per fault. Each entry has the same shape and the same [broken-reason codes](/docs/api/resource/automation/reference/errors) as `broken_reason` on the automation object.

**General behavior**

- No request body.
- Tape computes a fresh verdict. It can differ from the stored `broken` flag, because create and update don't store a new verdict.

:::note What does `validate` check?
`validate` checks *meaning*, not syntax: whether a stored definition still points to things that exist and can be reached. Typical faults are a deleted field or app, a removed connection, or an action that uses a collection no earlier action creates. These faults can appear *after* a successful save, without any change to the definition.

Payload *format* is checked earlier. Create and update reject a [malformed body](/docs/api/resource/automation/reference/errors#what-returns-400-in-a-definition-body) with `400`, for example an unknown enum value, a broken dynamic-value reference or a tree nested too deep.
:::

:::caution Does `valid: true` mean the run succeeds?
Not necessarily. `validate` checks the *listed* faults, and some references only for presence. For example, Tape only checks that the `app_view_id` of a `collect_app_view_records` action isn't empty, so a wrong view ID fails only when the automation *runs*.
:::

**Requirements:** `automations:read`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- An automation ID that isn't an integer returns `400`.
- A credential that doesn't act on behalf of a user returns `401`.
- A token without `automations:read` returns `403`.
- An automation that isn't available to you returns `404`.

## Next steps

- [Automation run](/docs/api/resource/automation-run): poll the run and read its logs.
- [Errors & broken reasons](/docs/api/resource/automation/reference/errors): every code `validate` can return.
- [Advanced / sandbox](/docs/api/resource/automation/advanced): call an automation or create a weblink.
- [Manage](/docs/api/resource/automation/manage): activate or pause an automation.
