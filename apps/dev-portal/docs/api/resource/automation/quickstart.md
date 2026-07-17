---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

This walks the full lifecycle end to end: **discover → create → configure → validate → activate → run → observe**.
Every call uses a [user API key](/docs/api/authentication) and assumes you administrate the app's workspace.

## 1. Discover the vocabulary

Learn what triggers, actions and filter operators exist — never hard-code them.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/automation/meta/trigger -u #USER_API_KEY:`}
</ContextCodeBlock>

Do the same for `/meta/action` and `/meta/filter?field_type=number`. Each entry carries a `config_schema` you build
against. See [Discovery](/docs/api/resource/automation/discovery).

## 2. Create the automation

Create it in an app. A new automation lands **paused** and not broken — a draft you finish, then activate.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation/app/87 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "name": "Email the owner on a new high-priority lead",
    "trigger": { "type": "record_created", "config": { "app_id": 87 } }
  }'`}
</ContextCodeBlock>

The response is the [automation object](/docs/api/resource/automation/reference/object) wrapped as `{ "automation": … }`.
Note its `id` for the next steps.

## 3. Configure the filter and actions

Add a [filter](/docs/api/resource/automation/reference/filters) and [actions](/docs/api/resource/automation/reference/actions)
with a partial [update](/docs/api/resource/automation/manage). Omitted fields are left unchanged.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X PUT #BASE_URL/v1/automation/4021 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "filter": {
      "operator": "and",
      "rows": [
        {
          "subject": { "kind": "variable", "source": "field", "field_id": 512, "field_type": "single_category", "previous": false, "collection": false, "triggering": false },
          "operator": "is_any_of",
          "value": { "type": "ids", "ids": [9001] }
        }
      ]
    },
    "actions": [
      { "type": "send_email", "config": { "subject": ["A new high-priority lead was created"] } }
    ]
  }'`}
</ContextCodeBlock>

Node IDs are optional — omit them and the server mints them. [Dynamic values](/docs/api/resource/automation/dynamic-values)
(like the field reference above) are how a value pulls in live record data.

## 4. Validate

Check the definition before going live — create/update don't re-validate, so `broken` may lag.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/automation/4021/validate -u #USER_API_KEY:`}
</ContextCodeBlock>

A `{ "valid": true, "errors": [] }` means it's ready. Otherwise each entry names the fault — see
[Errors & broken reasons](/docs/api/resource/automation/reference/errors).

## 5. Activate

Go live. A broken definition is refused with `409` (validity is recomputed server-side).

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation/4021/activate -u #USER_API_KEY:`}
</ContextCodeBlock>

## 6. Run and observe

Trigger a run manually against a record (real side effects), then poll for the result. Execution is **asynchronous** —
the response is `202` with a message and **no run ID**.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation/4021/manual-run \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{ "record_id": 5001 }'`}
</ContextCodeBlock>

Observe the resulting run through the [Automation Run](/docs/api/resource/automation-run) API — list the automation's
runs and match on the record. See [Execution](/docs/api/resource/automation/execution) for the per-trigger run body
and the polling model.
