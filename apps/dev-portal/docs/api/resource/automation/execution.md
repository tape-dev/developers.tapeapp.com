---
id: execution
title: Run & simulate
sidebar_label: Execution
description: Run and simulate a Tape automation against a record, and validate a definition — including the asynchronous run model.
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

Run an automation against a payload (real side effects), simulate it (a dry run with none), and validate a definition
without executing it. All require a **user API key** and workspace-admin access.

## The run body is trigger-aware

Manual run and simulate share one body. You send the payload the automation's **trigger** expects — the automation
(named in the path) already fixes the trigger, so there's no discriminator to restate:

| Trigger | Body |
| --- | --- |
| record-based (`record_created`, `record_updated`, `record_deleted`, `date_field_arrived`, comment, `automation_called`, `weblink_clicked`) | `{ "record_id": <id> }` |
| `webhook_received` | `{ "webhook_payload": <object or string> }` **or** `{ "use_last_received_webhook_payload": true }` |
| `periodic` / no trigger | `{}` |

A well-formed body that doesn't match the automation's **actual** trigger is rejected with a `400`.

:::note Manual-run and simulate ignore `paused`
Both execute the automation's **stored definition regardless of its `paused` flag** — activation is **not** a
precondition. Only a **broken** definition is refused (`409`). This is deliberately different from the
[call-automation endpoint](/docs/api/resource/automation/advanced), which silently produces **no run** for a paused
target. So `manual-run` is the way to test-fire an automation without taking it live; pausing does not protect against it.
:::

:::info Asynchronous — no run ID is returned
Both answer `202` with a fixed message and **no run ID** (the run row is minted only after filtering, in the worker).
To observe the result, poll the [Automation Run](/docs/api/resource/automation-run) API — its per-automation listing
includes both real and simulation runs — and match on the record. Both endpoints cost `1x` base credits; a real run
additionally consumes automation **action credits**, reported as `num_consumed_actions` on the run.
:::

:::note Reading run logs — they arrive after the run turns terminal
A run's per-action `logs` are buffered and land **asynchronously after** the run flips to a terminal status
(`completed` / `failed`), a beat behind the always-present trigger and filter steps. Poll for the **specific** log entry
you need rather than gating on `logs.length > 0`, which can return before an action's entry is in. And not every
successful step yields a per-action `success` log: control-flow containers (`conditional`, `for_loop`),
`collected_records_collect_referenced_records`, and `create_pdf` complete at the run level with no per-action entry —
for those, treat a terminal `completed` without a setup failure as the success signal. An action with `deactivate: true`
likewise produces no entry: it is removed before the run executes, so it is **absent** from the log rather than present
with a `skipped` status — see [Automation run → run logs](/docs/api/resource/automation-run) for how the two differ and
when `skipped` does appear.
:::

## Run an automation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation/{automation_id}/manual-run" />

Executes the automation with **real side effects**, at-least-once. The trigger filter is applied — a record that does
not match produces no run.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation/4021/manual-run \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{ "record_id": 5001 }'`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{ "message": "Use the automation-run API to poll the run. Based on queueing and limitations, this may be delayed." }`}
</ContextCodeBlock>

Errors: `404` (automation or record unavailable), `409` (the automation is broken), `401`, `400` (bad ID or a body
that doesn't match the trigger). `record_id` must resolve to a **live** record in the automation's app — a
soft-deleted, foreign-app or non-existent id all `404` before the run is scheduled. (This is why
`current_record_restore` can only be exercised by deleting the record *within* the run, via an upstream
`current_record_delete`.)

:::note Comment-trigger runs need an existing comment
For a `record_comment_or_reply_created` automation, a manual run resolves the record's **most-recent** existing
comment/reply as the trigger's current-comment context. A record that has **no** comment/reply produces **no run** —
the endpoint still answers `202`, but nothing is created.
:::

## Simulate an automation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation/{automation_id}/simulate" />

A dry run with **no side effects**, over the automation's stored definition. It always produces a **simulation** run,
which is excluded from most run listings but visible in the per-automation listing and retrievable by ID. The body is
identical to [Run](#run-an-automation). Simulating also requires you can view the target record.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation/4021/simulate \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{ "record_id": 5001 }'`}
</ContextCodeBlock>

## Validate an automation

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation/{automation_id}/validate" />

Recomputes, server-side, whether the current definition is executable — a fresh verdict that can differ from the
stored `broken` flag (create and update don't re-validate). No request body.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/automation/4021/validate -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "valid": false,
  "errors": [
    { "code": "action_app_missing", "message": "An action references an app that no longer exists.", "action_id": "a1b2c3", "app_id": 42, "deactivated": false }
  ]
}`}
</ContextCodeBlock>

`valid` is `true` when there is no active (non-deactivated) error. Each entry uses the same shape and
[broken-reason codes](/docs/api/resource/automation/reference/errors) as `broken_reason` on the automation object.

:::note `validate` checks **semantics**, not syntax
`validate` re-checks whether a stored definition still refers to things that exist and are reachable — a deleted field
or app, a removed authentication provider, an action that consumes a collection no upstream action produces. These can
turn a definition non-executable **after** a successful write without the definition changing, which is why they are
recomputed on demand. Payload **well-formedness** is not its job: a structurally malformed body (an unknown enum token,
a broken dynamic-value reference, a tree past the maximum depth) is rejected earlier, at
[create/update](/docs/api/resource/automation/manage) with a `400` — see
[what returns 400 in a definition body](/docs/api/resource/automation/reference/errors#what-returns-400-in-a-definition-body).
So a `valid: true` verdict confirms reachability; it does **not** re-affirm that the payload was well-formed (that was
settled at write) or guarantee the run will succeed (below).
:::

:::caution `valid: true` is not a guarantee of an executable run
Validation is **not exhaustive**. Some references are only checked for presence, not resolved — for example a
`collect_app_view_records` `app_view_id` is checked only for being non-empty, so a bogus view id passes `validate` and
fails only at **run** time. Treat `validate` as catching the *catalogued* faults, not as proof the run will succeed.
:::

:::note Calling another automation, or a weblink?
The endpoints that let one automation call another, or mint a weblink, are the execution backends of those actions —
see [Advanced / Sandbox](/docs/api/resource/automation/advanced).
:::
