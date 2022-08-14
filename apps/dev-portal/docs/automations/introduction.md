---
id: introduction
title: Workflow Automations
sidebar_label: Introduction
---

import CodeBlock from '@theme/CodeBlock';

Tape's workflow automations

### Execution environment

All custom scripts inside Tape's workflow automations are written in JavaScript, consistent with the [calculation field](/docs/calculation/introduction). Inside inside code filters and the "perform calculation" action, only syncronous JavaScript is valid, while the "execute script" action also allows asynchronous code.

## Synchronous execution environment

Insite filters and the "perform calculation" action, use synchronous code to perform your filter assertions or assign your variable.

Valid custom filter scripts could be:

```
some_number_field_value >= 1000
```

```
(some_number_field_value % 2 === 0) && (some_number_field_value < 50)
```

Valid "perform calculation" action block scripts could look similar:

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

### HTTP client

Similar to the "HTTP call" action block, it is also possible to make HTTP requests using the provided HTTP client inside the "execute script" action.
The following code sample could be used to extract the response body and header for a request, logging them to the console afterwards:

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

Variables will become available inside the flow, but only after that action inside the execution order. No block scope applies, and variables will be reassigned if you give them the same name.

## Useful execution variables

Some variables are provided by the system when a worklow is executed. A list of some of them (but not limited to):

- `current_workflow_is_simulation`: useful to execute or skip certain logic when the current execution is a simulation (that should ideally not affect data inside Tape or external systems)
- `current_workflow_id`: the ID of the current workflow, could be included when hitting external systems for debugging purposes

## Limitations

Tape applies limits to all executed workflows regarding utilized computation power and time.

- The maximum time a flow can run is 5 minutes
- Memory & CPU limitations apply

Flows that exceed any of the above limits fail with a proper error message. Split your work into multiple flow or avoid heavy computations large amounts of records.

## Special Variables
