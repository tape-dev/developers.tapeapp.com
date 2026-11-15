---
id: quickstart
title: Automation API quickstart
sidebar_label: Quickstart
description: Build a Tape automation end to end with copy-paste API calls — discover, create, configure, validate, activate, run, and observe.
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use this quickstart to build your first automation through the API, from the catalog to a finished run.

You go through the full lifecycle: *discover → create → configure → validate → activate → run → observe*. The example builds an automation that sends an email when a new high-priority lead comes in.

Only want to start an automation that already exists? Skip this guide and see [Run an existing automation](/docs/api/resource/automation/overview#run-an-existing-automation).

**Requirements**

- A [personal access token](/docs/api/personal-access-tokens) with the capabilities **Read automations**, **Edit automations** and **Run automations** (`automations:read`, `automations:edit` and `automations:run`). Store it in the variable `TAPE_TOKEN`. A [user API key](/docs/api/authentication#user-api-key) or an [OAuth access token](/docs/api/oauth/overview) works too.
- The **Admin** role in the app's workspace. The token's [content access](/docs/api/personal-access-tokens#content-selection) must include the app.

## Step 1: Discover the vocabulary {#1-discover-the-vocabulary}

Read which triggers, actions and filter operators exist. Don't hard-code them.

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/automation/meta/trigger \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

Do the same for [`/meta/action` and `/meta/filter?field_type=number`](/docs/api/resource/automation/discovery). Trigger and action entries have a `config_schema` to build against. A `/meta/filter` entry is an operator, `{ operator, label, description?, value_arity }`, without one.

## Step 2: Create the automation {#2-create-the-automation}

Create the automation in an app. A new automation starts *paused* and not broken: a draft that you finish and then activate.

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation/app/87 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "name": "Email the owner on a new high-priority lead",
    "trigger": { "type": "record_created", "config": {} }
  }'`}
</ContextCodeBlock>

Replace `87` with the ID of your app. [Retrieve all available apps](/docs/api/resource/app#retrieve-all-available-apps) lists the app IDs.

The response is the [automation object](/docs/api/resource/automation/reference/object), wrapped as `{ "automation": … }`. Keep its `id` for the next steps.

## Step 3: Configure the filter and actions {#3-configure-the-filter-and-actions}

Add a [filter](/docs/api/resource/automation/reference/filters) and [actions](/docs/api/resource/automation/reference/actions) with a partial [update](/docs/api/resource/automation/manage). Fields you leave out stay unchanged.

<ContextCodeBlock language="shell" title='Request'>
{`curl -X PUT #BASE_URL/v1/automation/4021 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
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
      { "type": "send_email", "config": { "to_address": ["juliet@acme.com"], "subject": ["A new high-priority lead was created"] } }
    ]
  }'`}
</ContextCodeBlock>

Replace `4021` with the `id` from step 2, `512` with a [category field](/docs/api/resource/field/category) of your app and `9001` with the ID of one of its options. [Retrieve a single app](/docs/api/resource/app#retrieve-a-single-app) returns the `field_id` and, in `config.settings.options`, the option IDs. To send the email for every new record, leave out `filter`.

Node IDs are optional: Tape creates them when you leave them out. The field reference in `subject` is a [dynamic value](/docs/api/resource/automation/dynamic-values) that pulls in live record data.

## Step 4: Validate {#4-validate}

Check the definition before it goes live. Create and update don't store a new verdict, so `broken` can lag behind your edit.

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/automation/4021/validate \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

`{ "valid": true, "errors": [] }` means it's ready. Otherwise each entry names the fault. See [Errors & broken reasons](/docs/api/resource/automation/reference/errors).

## Step 5: Activate {#5-activate}

Set the automation live. Tape checks the definition again and refuses a broken one with `409`.

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation/4021/activate \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

From now on, every new record that matches the filter fires the automation. [Pause](/docs/api/resource/automation/manage#pause-an-automation) it when you finish testing.

## Step 6: Run and observe {#6-run-and-observe}

Run the automation manually on a record, then poll for the result. A manual run has real side effects. It runs *asynchronously*: the response is `202` with a message and *no run ID*.

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation/4021/manual-run \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{ "record_id": 5001 }'`}
</ContextCodeBlock>

Replace `5001` with the ID of a record in the automation's app that matches the filter. A record that doesn't match creates no run. [Retrieve records for an app](/docs/api/resource/record#retrieve-records-for-an-app) lists the record IDs. Then list the automation's runs and find the one with your `triggered_on_record_id`:

<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/automation-run/automation/4021 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{ "limit": 5 }'`}
</ContextCodeBlock>

Its `status` ends as `completed`, `failed` or `cancelled`. See [List runs for an automation](/docs/api/resource/automation-run#list-runs-for-an-automation) for the response, and [Run & simulate](/docs/api/resource/automation/execution) for the run body per trigger and the polling model.

A `failed` run names the cause in `failure_reason` and `error_message`. [Retrieve the run](/docs/api/resource/automation-run#retrieve-an-automation-run) by its `id` to read the step logs.

:::tip Want to test without sending the email?
Send the same request to `/v1/automation/4021/simulate` instead of `/manual-run`. Tape creates a run with `type: "simulation"` and no side effects. Its filter step reads `skipped`. The email step reads `success`, and its log message says that Tape skipped the email because of the simulation. See [Simulate an automation](/docs/api/resource/automation/execution#simulate-an-automation).
:::

## Next steps

- [Automation API](/docs/api/resource/automation/overview): the concepts, capabilities and the automation object.
- [Discovery](/docs/api/resource/automation/discovery): the full catalog with config schemas.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): reference fields and outputs of earlier steps.
- [Action examples](/docs/api/resource/automation/action-examples): ready-made action configs to copy.
- [Run & simulate](/docs/api/resource/automation/execution): simulate before you run for real.
- [Revisions](/docs/api/resource/automation/revisions): roll the automation back to an earlier version.
