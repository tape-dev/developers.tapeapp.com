---
id: introduction
title: Automations
sidebar_label: Introduction
---

import MediaFrame from '@site/src/components/media-frame/media-frame.component';
import AutomationEditorPng from '@site/static/docs/automations/introduction/automation-editor.png';

Write your own JavaScript in automations to filter, calculate and call the Tape API or other services.

<MediaFrame><img src={AutomationEditorPng} alt="The automation editor with the trigger When a record is updated, a filter on the Automation field and the action Update the current record" /></MediaFrame>

An automation belongs to one app: it starts on a trigger, checks optional filters, and runs a list of actions. You build it in the automation editor in Tape. These pages cover the JavaScript you write inside it.

:::info Want to create or run automations from your own code?
Use the [Automation API](/docs/api/resource/automation/overview). It creates, changes and runs automations over HTTP. An AI assistant does the same through the [Tape MCP server](/docs/mcp/overview).
:::

:::info Coming from Podio?
Automations take the place of Podio flows and Globiflow. Rebuild each flow in the automation editor, or [move it with the Automation API](/docs/guide/api/coming-from-podio#move-your-flows).
:::

## Execution environment

All scripts in automations are JavaScript, as in the [calculation field](https://help.tapeapp.com/en/articles/18449157-calculation-syntax-examples). Where you write the script decides what it can do:

| Where | Code | Typical use |
| --- | --- | --- |
| Script filter | Synchronous only | Decide if the automation continues |
| **Perform a calculation** action | Synchronous only | Store a value in a variable |
| **Execute a script** action | Synchronous and asynchronous | Call the Tape API or other services |

<a id="synchronous-execution-environment"></a>

### Synchronous code

Use synchronous code in script filters and in the **Perform a calculation** action. The last expression is the result.

Each field of the record is a variable, named after the record name of the app, `field` and the field name, for example `task_field_amount`. In the examples, `some_number_field_value` stands for such a variable. The [code editor](https://help.tapeapp.com/en/articles/18448952-execute-script-action) lists the exact names.

In a script filter, the result must be `true` or `false`:

```js
some_number_field_value >= 1000
```

```js
(some_number_field_value % 2 === 0) && (some_number_field_value < 50)
```

In **Perform a calculation**, Tape stores the result in a variable:

```js
some_number_field_value * 1000
```

```js
some_number_field_value < 100 ? some_number_field_value : 100;
```

Promises and `async`/`await` don't work here. Need them? Use an **Execute a script** action instead.

:::info Need functions or more than one statement?
Wrap your code in an immediately invoked function expression (IIFE) and return the result.
:::

```js
(function yourFunctionName() {
  let variable1 = 1337;

  function yourSubFunctionName1() {
    return false;
  }

  function yourSubFunctionName2() {
    return true;
  }

  // ... more code

  return yourSubFunctionName1() || yourSubFunctionName2();
})();
```

<a id="asynchronous-execution-environment"></a>

### Asynchronous code

Use the **Execute a script** action to run asynchronous code. Add it in the automation editor with **Add action**. We recommend [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) over plain promises.

**Execute a script** gives you more APIs, modules and functions. The code editor shows autocompletion and types for all of them.

#### Tape API client

Use the `tape` client to call the [Tape API](/docs/api/introduction). It covers everything the action blocks don't, and gives you more control.

```js
const { data, headers } = await tape.Record.get(1234);

console.log({ record: data });
```

`data` is the record itself, with `record_id`, `title` and `fields`. You don't need to handle authentication. Each run gets its own token, valid for that run.

:::caution Setting your own key with `tape.setApiKey()`?
Your user API key or personal access token then applies to all following actions too, including action blocks, because they use the same client.
:::

#### HTTP client

Use the `http` client to call other services, like the **Send a HTTP request** action does.

```js
const { data, headers } = await http.get('https://jsonplaceholder.typicode.com/posts');

console.log({ data });
console.log({ headers });
```

`http` also has `post`, `put`, `patch` and `delete`. Pass request headers in the `headers` option and a body in `data`. A JSON response arrives parsed in `data`, any other response as text.

An error status doesn't make the call fail. Check `statusCode` and [throw an error](/docs/automations/troubleshooting/automations-troubleshooting-errors#throwing-custom-errors) to stop the run:

```js
const { data, statusCode } = await http.get('https://api.acme.com/v1/rates?base=EUR', {
  headers: { Authorization: 'Bearer YOUR_RATES_SERVICE_KEY' },
});

if (statusCode !== 200) {
  throw new Error(`Rate service returned ${statusCode}`);
}

var_usd_rate = data.rates.USD;
```

Does the other service only accept known IP addresses? Allow the [IP addresses of automations](https://help.tapeapp.com/en/articles/18448976-automation-ip-addresses) in its firewall.

### Custom variables

These actions create variables you can use in all following actions:

- **Perform a calculation**
- **Execute a script**
- **Send a HTTP request**

A variable exists only after the action that creates it. There is no block scope. A later action with the same variable name overwrites the value.

In **Execute a script**, assign the value to the variable of the action. Its name is `var_` plus its label in lower case, with other characters as `_`: the label `USD rate` becomes `var_usd_rate`. To save the value in a field, use the variable in a later **Update the current record** action.

## Silent actions

Turn on **Silent** for an action that changes data, and Tape sends no notifications for that change. Use it for large data migrations, so people's inboxes don't fill up.

<a id="triggering-other-flows--webhooks"></a>

## Triggering other automations and webhooks

Every action that changes data has two options:

- **Trigger automations**: the change can start other automations.
- **Trigger webhooks**: the change sends webhook events.

Set both for each action. Example: an action updates a record and **Trigger automations** is off. Automations with the trigger **Record updated** don't run for that change.

In **Execute a script**, the `tape` client has the same options. The code editor shows them in the types.

<a id="useful-execution-variables"></a>

## Execution variables

Tape sets these variables for every run:

| Variable | Description |
| --- | --- |
| `current_workflow_is_simulation` | `true` in a simulated run. Use it to skip changes to Tape or other systems. |
| `current_workflow_id` | ID of the automation. Send it to other systems for debugging. |
| `current_workflow_name` | Name of the automation. Send it to other systems for debugging. |
| `current_workflow_timezone` | Timezone of the automation. Set it in the automation editor. |
| `current_date_local`, `current_date_utc` | Date of the run, in the timezone of the automation or in UTC. `current_date_formatted` holds it as display text. |
| `current_datetime_local`, `current_datetime_utc` | Date and time of the run. `current_datetime_formatted` holds it as display text. |
| `current_time_local`, `current_time_utc` | Time of the run. `current_time_formatted` holds it as display text. |
| `webhook_payload_parsed`, `webhook_payload_raw` | With the trigger **Webhook received**: the request body as an object, or as raw text. |

There are more. Some depend on the [execution type](/docs/automations/execution-types) of the run.

<a id="logging--debugging"></a>

## Logging and debugging

Use `console.log` to log any variable. The output appears in the logs of the run, under **Runs** in the automation editor.

```js
console.log('initial field value was: ' + task_field_estimation_days_decimal_value)
console.log('result of calculation was: ' + var_calculation_result)
```

## Next steps

- [Code editor](https://help.tapeapp.com/en/articles/18448952-execute-script-action): autocompletion and types for your scripts.
- [Libraries](/docs/automations/libraries): date-fns, Lodash and more, ready to use in every script.
- [Date, time & timezones](/docs/automations/date-timezone): set dates in the right timezone.
- [Execution types](/docs/automations/execution-types): how runs start, including simulated runs.
- [Tape API](/docs/api/introduction): everything the `tape` client can do.
- [Automation API](/docs/api/resource/automation/overview): create, change and run automations with code.
- [Connect Google Forms to Tape](https://help.tapeapp.com/en/articles/18449044-save-form-responses-with-a-webhook): start an automation from a form webhook.
- [Convert a PDF file to text](/docs/guide/automations/convert-pdf-to-text): build a complete automation with a script.
