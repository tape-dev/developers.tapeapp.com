---
id: advanced
title: Advanced / sandbox
sidebar_label: Advanced / sandbox
description: The sandbox endpoints behind a Tape automation's call-automation and generate-weblink actions.
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use these endpoints to call an automation on a record or to create a weblink that runs an automation when someone selects it.

Both endpoints are the *engine behind specific automation actions*: an automation uses them during its run to call another automation or to hand out a weblink. To start an automation from your own code, use [manual-run](/docs/api/resource/automation/execution#run-an-automation) instead. It works with every trigger and on a paused automation.

| Endpoint                                                            | Action behind it                                                                              |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [`POST /v1/automation/{automation_id}/trigger`](#call-an-automation) | **Call automation**: `current_record_call_automation`, `collected_records_call_automation`    |
| [`POST /v1/automation/weblink/generate`](#generate-a-weblink)        | **Generate weblink**: `current_record_generate_automation_weblink`                            |

:::info Which capability do I need?
Both endpoints need **Run automations** (`automations:run`). They work with a [personal access token](/docs/api/personal-access-tokens), an [OAuth access token](/docs/api/oauth/overview), a [user API key](/docs/api/authentication#user-api-key) or an automation API key. See [Capabilities](/docs/api/capabilities).
:::

:::note How do these endpoints differ from the rest of the resource?
- They also accept an automation API key. Apart from [discovery](/docs/api/resource/automation/discovery), the rest of the resource doesn't.
- They report a missing or unavailable automation or record as `400` (validation error), *not* with the [`404` collapse](/docs/api/resource/automation/reference/errors#the-404-collapse) of the other endpoints. Only an automation outside a personal access token's content access returns `404`.
- Each request costs `1x` base credits.
- The legacy paths `POST /v1/workflow/{automation_id}/trigger` and `POST /v1/workflow/weblink/generate` stay as *deprecated* aliases for older integrations. Use `/v1/automation/…`.
:::

## Call an automation

Use this endpoint to run an automation on a record. The **Call automation** actions use it.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation/{automation_id}/trigger" />

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation/88/trigger \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{ "trigger_on_record_id": 5001 }'`}
</ContextCodeBlock>

The response is `202` with an empty body `{}`. Like [manual-run](/docs/api/resource/automation/execution), the call is asynchronous and returns *no run ID*. Poll [Automation run](/docs/api/resource/automation-run) for the result.

**General behavior**

- The target automation needs an [`automation_called`](/docs/api/resource/automation/reference/triggers) trigger.
- Tape applies the target's filter. A record that doesn't match creates no run.
- `202` means Tape *accepted* the call, not that it created a run. The call still answers `202` and creates *no run* when the target doesn't fire:
  - its trigger isn't `automation_called`,
  - its filter rejects the record, or
  - it's *paused or broken*. New automations start paused, so [activate](/docs/api/resource/automation/manage) the target first.

**Requirements:** `automations:run`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Errors**

- A malformed body, an automation or record that doesn't exist or that you can't access, or a record outside the automation's app returns `400`.
- A request without a credential returns `401`.
- A token without `automations:run` returns `403`.
- An automation outside your personal access token's content access returns `404`.

**Body parameters**

| Parameter                      | Type      | Required | Description                                                                                                   |
| ------------------------------ | --------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `trigger_on_record_id`         | `integer` | yes      | The record to run the automation on.                                                                          |
| `triggered_by_record_id`       | `integer` | no       | The record that started the call.                                                                             |
| `triggered_by_workflow_def_id` | `integer` | no       | The automation that started the call.                                                                         |
| `trigger_with_arguments`       | `object`  | no       | Values for the automation's custom input variables, keyed by *internal variable name*. See the note below.  |
| `is_manual_run`                | `boolean` | no       | Defaults to `false`.                                                                                          |
| `is_simulation`                | `boolean` | no       | Defaults to `false`.                                                                                          |

:::caution How do I build a `trigger_with_arguments` key?
Each key is the automation's *internal variable name*. Tape builds it from the label you declared:

1. Lower-case the label.
2. Replace every character outside `0-9`, `a-z`, `A-Z`, `_` and `$` with an underscore.
3. Put `var_` in front.

Tape doesn't trim the label, so spaces at the start or end become underscores. A variable of type *file* adds `_<selected_property>` at the end.

| Declared label                              | Argument key        |
| ------------------------------------------- | ------------------- |
| `note`                                      | `var_note`          |
| `My Variable`                               | `var_my_variable`   |
| `My-Variable-2`                             | `var_my_variable_2` |
| `My%Variable`                               | `var_my_variable`   |
| `' My variable '` (spaces at start and end) | `var__my_variable_` |

A key that matches no declared variable is *accepted without an error*: the schema is open, the variable resolves to `null` and the run goes on. If an argument seems to have no effect, check the key first.
:::

## Generate a weblink

Use this endpoint to create a public weblink that runs a `weblink_clicked` automation on a record when someone selects it. The **Generate weblink** action uses it.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/automation/weblink/generate" />

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation/weblink/generate \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "trigger_workflow_def_id": 91,
    "trigger_on_record_id": 5001,
    "expiration_type": "ONE_WEEK"
  }'`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='Response'>
{`{
  "trigger_token": "3f2b1c94-7d6e-4a51-9b0f-2c8e5d41a7b3",
  "trigger_client_url": "https://weblink.tapeapp.com/trigger/3f2b1c94-7d6e-4a51-9b0f-2c8e5d41a7b3"
}`}
</ContextCodeBlock>

**Key fields**

- `trigger_token`: a UUID.
- `trigger_client_url`: `<weblink-client-base>/trigger/<trigger_token>`. The host depends on the environment, in production `https://weblink.tapeapp.com`. Treat the whole URL as *opaque*: hand it out as is, and don't build or parse it yourself.

**General behavior**

- The response is `201`. The endpoint is *synchronous*. Only the run that a later click starts is asynchronous.
- Send `trigger_workflow_def_id` and `trigger_on_record_id` in every request. The endpoint needs the automation to fire and the record to scope the weblink to.
- You need view access to the record.

**Requirements:** `automations:run`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Errors**

- A malformed body, an automation or record that doesn't exist or that you can't access, or a target that isn't a `weblink_clicked` automation returns `400`.
- A request without a credential returns `401`.
- A token without `automations:run` returns `403`.
- An automation outside your personal access token's content access returns `404`.

**Body parameters**

| Parameter                      | Type      | Required | Description                                                                                                                       |
| ------------------------------ | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `trigger_workflow_def_id`      | `integer` | yes      | The `weblink_clicked` automation the weblink fires.                                                                               |
| `trigger_on_record_id`         | `integer` | yes      | The record the weblink belongs to.                                                                                                |
| `triggered_by_record_id`       | `integer` | no       | The record that started the generation.                                                                                           |
| `triggered_by_workflow_def_id` | `integer` | no       | The automation that started the generation.                                                                                       |
| `trigger_with_arguments`       | `object`  | no       | Arguments the weblink carries into the run, keyed by *internal variable name*, as for [Call an automation](#call-an-automation). |
| `expiration_type`              | `string`  | no       | One of `NEVER`, `ONE_DAY`, `ONE_WEEK`, `ONE_MONTH`, `ONE_YEAR`.                                                                   |
| `expire_after_first_click`     | `boolean` | no       | Make the weblink invalid after its first click.                                                                                   |
| `is_manual_run`                | `boolean` | no       | Defaults to `false`.                                                                                                              |
| `is_simulation`                | `boolean` | no       | Defaults to `false`.                                                                                                              |

:::caution Why does the action use a different expiration key?
`expiration_type` with upper-case values (`NEVER`, `ONE_DAY`, …) belongs to *this endpoint's* body. The `current_record_generate_automation_weblink` *action* uses `weblink_expiration` with *lower-case* values (`never`, `one_day`, `one_week`, `one_month`, `one_year`) and also has `on_click`. Don't copy the endpoint's key or casing into an action config.
:::

## Next steps

- [Run & simulate](/docs/api/resource/automation/execution): run or simulate an automation yourself.
- [Triggers](/docs/api/resource/automation/reference/triggers): `automation_called` and `weblink_clicked`.
- [Actions](/docs/api/resource/automation/reference/actions#automation-calls--weblinks): the actions behind these endpoints.
- [Automation run](/docs/api/resource/automation-run): find the run a call created.
