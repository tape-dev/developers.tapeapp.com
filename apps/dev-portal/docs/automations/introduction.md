---
id: introduction
title: Workflow Automations
sidebar_label: Introduction
---

### Execution environment

All custom scripts inside Tape's workflow automations are written in JavaScript, consistent with the [calculation field](/docs/calculation/introduction). Within code filters and the "perform calculation" action, only syncronous JavaScript is valid, while the "execute script" action also allows asynchronous code.

## Synchronous execution environment

Insite filters and the "perform calculation" action, use synchronous code to perform your filter assertions or assign your variable.

Valid custom filter scripts could be (where the returning expression is being used to evaluate to true or false):

```
some_number_field_value >= 1000
```

```
(some_number_field_value % 2 === 0) && (some_number_field_value < 50)
```

Valid "perform calculation" action block scripts could look similar (where the returned expression is being stored in a custom variable for later use)

```
some_number_field_value * 1000
```

```
some_number_field_value < 100 ? some_number_field_value : 100;
```

It is not allowed to use Promises or async/await syntax in this context. When needed, perform your work inside an "execute script" action that uses the asynchronous execution environment.

Hint: If you need a more complex syntax or would like to declare functions that you invoke later, use an immediately invoked function expression (IIFE), as shown below (`yourFunctionName` could be any arbritrary function name of your choice):

```
(yourFunctionName(){
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

## Asynchronous execution environment

When using the "execute script" action block, developers are free to run their own asynchronous JavaScript code. While it is possible to use the classic Promise syntax, we recommend using [Async/Await](https://nodejs.dev/learn/modern-asynchronous-javascript-with-async-and-await).

Inside this context, more APIs, modules and functions are exposed. The [code editor](/docs/automations/code-editor) provides auto-completion and typing info to assist developers, some more details are described in the next sections.

### Tape API client

The editor exposes the client side Tape SDK that allows to consume the [developer API](/docs/api/introduction). Use it to perform operations that are not available (yet) as dedicated graphical action blocks, or if you need more control over the behavior.

```
const { data, headers } = await tape.Record.get(1234);

console.log({ record: data.record });
```

### HTTP client

Similar to the "HTTP call" action block, it is also possible to perform HTTP requests using the provided HTTP client inside the "execute script" action.
The following code sample could be used to extract the response body and header for a request to an external API, logging them to the console afterwards:

```
const { data, headers } = await http.get('https://jsonplaceholder.typicode.com/posts');

console.log({ data });
console.log({ headers });
```

## Custom Variables

You may introduce custom variables that can be used globally by using one of the following action blocks:

- perform calculation
- execute script
- HTTP request

Variables will become available inside the flow, but only after that action inside the execution order. No block scope applies, and variables will be reassigned and overwritten if you give them an equal name.

## Silent actions

Use the "silent" settings option for mutating action blocks to skip notifications for this change. This can be useful when migrating large data sets, where notifications would bloat the inbox of the involved users.

## Triggering other flows & webhooks

Every mutating action block provides options to specify whether this action will trigger other flows, and/or trigger webhooks in Tape. Both options can be checked individually and need to be set for each action explicitly.

If the option "Trigger other automations" is not set, a potential mutation performed inside this action will not yield another workflow run. Let's say the flow updates a record and the option is set to false, other flows with the "Record updated" trigger will not be run.

The Tape SDK also provides respective options when used directly inside an "execute script" action block, check the typing info inside the editor to configure your requests properly.

## Useful execution variables

Some variables are provided by the system when a worklow is executed. A list of some of them (but not limited to):

- `current_workflow_is_simulation`: useful to execute or skip certain logic when the current execution is a simulation (that should ideally not affect data inside Tape or external systems)
- `current_workflow_id`: the ID of the current workflow, may be included when hitting external systems for debugging purposes
- `current_workflow_name`: the name of the current workflow, may be included when hitting external systems for debugging purposes
- `current_workflow_timezone`: the timezone the current workflow is executed in. Can be configured in the workflow editor.
- `current_date`
- `current_datetime`
- `current_time`

Note that some variables depend on the [execution type](/docs/automations/execution-types) of the current workflow.

## Logging & Debugging

Use regular console log statements to log any variable during worklow execution. Your logs will show up inside the workflow run logs, enabling quick debugging and live feedback.

```
console.log('initial field value was: ' + task_field_estimation_days_value)
console.log('result of calculation was:' + var_calculation_result)
```

## Limitations

Tape applies limits to all executed workflows regarding utilized computation power and time.

- The maximum time a flow can run is 2 minutes
- Memory & CPU limitations apply
- There is a limit for parallel async operations

Flows that exceed any of the above limits fail with a proper error message. Split your work into multiple flows or avoid heavy computations, e.g. for large amounts of records.
