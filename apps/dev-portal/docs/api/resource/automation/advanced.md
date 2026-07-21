---
id: advanced
title: Advanced / Sandbox
sidebar_label: Advanced / Sandbox
description: The sandbox endpoints behind a Tape automation's call-automation and generate-weblink actions.
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

These two endpoints are the **execution backends of specific automation actions** — the machinery an automation uses
under the hood when it runs. You rarely call them directly; they exist so an automation can call another automation,
or hand out a weblink, as part of its own run.

| Endpoint | Backs the action |
| --- | --- |
| [`POST /v1/automation/{automation_id}/trigger`](#call-an-automation) | **Call automation** — `current_record_call_automation`, `collected_records_call_automation` |
| [`POST /v1/automation/weblink/generate`](#generate-a-weblink) | **Generate weblink** — `current_record_generate_automation_weblink` |

See [Actions](/docs/api/resource/automation/reference/actions) for those action types.

:::note These behave differently from the rest of the resource
Because they are the sandbox execution backends, they don't follow the resource-wide conventions:

- They accept **either** a user API key **or** an automation API key (the rest of the resource is user-key only).
- They report problems as a **`400`** (validation error), **not** the [`404` collapse](/docs/api/resource/automation/reference/errors#the-404-collapse) the CRUD endpoints use.

Both cost `1x` base credits. Only the call-automation endpoint is **asynchronous** — it answers `202` with an empty
body and no run ID, so you poll the [Automation Run](/docs/api/resource/automation-run) API. The weblink-generate
endpoint is **synchronous**: it answers `201` with the minted weblink inline; only the eventual click-triggered run
is asynchronous.
:::

## Call an automation

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation/{automation_id}/trigger" />

Fires an automation on a record — the mechanism behind the **Call automation** actions. The target automation must
have an [`automation_called`](/docs/api/resource/automation/reference/triggers) trigger. Its trigger filter is applied
(a record that doesn't match produces no run).

**Body Parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `trigger_on_record_id` | `integer` | yes | The record to run the automation on. |
| `triggered_by_record_id` | `integer` | no | The record that initiated the call. |
| `triggered_by_workflow_def_id` | `integer` | no | The automation that initiated the call. |
| `trigger_with_arguments` | `object` | no | Values for the automation's custom input variables, keyed by **internal variable name** (see the note below). |
| `is_manual_run` | `boolean` | no | Defaults to `false`. |
| `is_simulation` | `boolean` | no | Defaults to `false`. |

:::caution `trigger_with_arguments` keys are the internal variable name, not the label
Each key is the automation's **internal variable name**, derived from the declared label: lower-case the label, replace
every character outside `0-9`, `a-z`, `A-Z`, `_` and `$` with an underscore, and prefix `var_`. The label is **not
trimmed**, so leading or trailing spaces become underscores; a **file**-typed variable appends `_<selected_property>`.

| Declared label | Argument key |
| --- | --- |
| `note` | `var_note` |
| `My Variable` | `var_my_variable` |
| `My-Variable-2` | `var_my_variable_2` |
| `My%Variable` | `var_my_variable` |
| `' My variable '` (leading/trailing spaces) | `var__my_variable_` |

A key that matches no declared variable is **accepted without an error** — the schema is open, so the variable simply
resolves to `null` and the run proceeds. If an argument appears to have no effect, check the key derivation first.
:::

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation/88/trigger \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{ "trigger_on_record_id": 5001 }'`}
</ContextCodeBlock>

Answers **`202`** with an empty body `{}` — like [manual-run](/docs/api/resource/automation/execution), it is
asynchronous and returns **no run ID**; poll the [Automation Run](/docs/api/resource/automation-run) API for the
result. A `400` is returned if the body is malformed, the automation or record does not exist or you can't access it,
or the record does not belong to the automation's app.

A `202` means the call was **accepted**, not that a run was created. The call still answers `202` while silently
producing **no run** when the target does not fire: its trigger is not `automation_called`, its trigger filter rejects
the record, or it is **paused or broken** (automations are created paused — [activate](/docs/api/resource/automation/manage)
the target first). Confirm the run through the [Automation Run](/docs/api/resource/automation-run) API.

:::info Deprecated alias
The legacy path `POST /v1/workflow/{automation_id}/trigger` is kept as a **deprecated** alias for older integrations.
Use `/v1/automation/…`.
:::

## Generate a weblink

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation/weblink/generate" />

Mints a public weblink that, when clicked, fires a [`weblink_clicked`](/docs/api/resource/automation/reference/triggers)
automation on a record — the mechanism behind the **Generate weblink** action. Requires that you can view the
referenced record.

**Body Parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `trigger_workflow_def_id` | `integer` | yes | The `weblink_clicked` automation the weblink fires. |
| `trigger_on_record_id` | `integer` | yes | The record the weblink is scoped to. |
| `triggered_by_record_id` | `integer` | no | The record that initiated generation. |
| `triggered_by_workflow_def_id` | `integer` | no | The automation that initiated generation. |
| `trigger_with_arguments` | `object` | no | Arguments carried by the weblink into the run — keyed by **internal variable name**, exactly as for [Call an automation](#call-an-automation) above. |
| `expiration_type` | `string` | no | One of `NEVER`, `ONE_DAY`, `ONE_WEEK`, `ONE_MONTH`, `ONE_YEAR`. |
| `expire_after_first_click` | `boolean` | no | Invalidate the weblink after its first click. |
| `is_manual_run` | `boolean` | no | Defaults to `false`. |
| `is_simulation` | `boolean` | no | Defaults to `false`. |

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/automation/weblink/generate \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "trigger_workflow_def_id": 91,
    "trigger_on_record_id": 5001,
    "expiration_type": "ONE_WEEK"
  }'`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "trigger_token": "3f2b1c94-7d6e-4a51-9b0f-2c8e5d41a7b3",
  "trigger_client_url": "https://weblink.tapeapp.com/trigger/3f2b1c94-7d6e-4a51-9b0f-2c8e5d41a7b3"
}`}
</ContextCodeBlock>

Answers **`201`**. A `400` is returned if the body is malformed or the target automation is not a `weblink_clicked`
automation. Always send `trigger_workflow_def_id` and `trigger_on_record_id` — the endpoint needs the automation to
fire and the record to scope to.

The `trigger_token` is a UUID and `trigger_client_url` is `<weblink-client-base>/trigger/<trigger_token>` — the host is
selected per runtime environment (on production, `https://weblink.tapeapp.com`). Treat the whole URL as **opaque**: hand
it out as-is, and do not construct or parse it yourself.

:::caution `expiration_type` here ≠ the action's config key
The `expiration_type` param above (UPPER-CASE `NEVER` / `ONE_DAY` / …) is the shape of **this endpoint's** body. When
you instead configure the backing `current_record_generate_automation_weblink` **action**, the config key is different
— `weblink_expiration` — and its tokens are **lower-case** (`never`, `one_day`, `one_week`, `one_month`, `one_year`;
the action also has `on_click`). Copying the endpoint's key/casing into an action config writes the wrong field.
:::

:::info Deprecated alias
The legacy path `POST /v1/workflow/weblink/generate` is kept as a **deprecated** alias. Use `/v1/automation/…`.
:::
