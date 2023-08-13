---
id: introduction
title: Calculation Field
sidebar_label: Introduction
---

Calculated fields can be used to easily manipulate data added to an app. With this very powerful tool, you can not only do math on numbers in your app, but also concatenate values ​​in specific fields. Use variables to add values ​​to calculated fields. Use the "@" symbol to search for variables in your app. You can reference any field in your app, and any field in the referenced app.

### Execution environment

The script of a calculation field is written in JavaScript. In order to calculate the value of a record's calculation field, the Tape server gathers all the script's variables values from the database and executes the script on the server. The script is executed inside a Node.js version 18 environment, so you can use [ES6](https://www.javascripttutorial.net/es6/) (indeed up to ES2021) syntax with all its cool features :tada:

### Client-side JavaScript

Tape does not support the execution of user-provided JavaScript in the client applications due to security reasons. Your JavaScript is executed on the server in an isolated and secure environment, the client only renders the result of the calculation.

### Timeouts

Tape has to limit the time a calculation takes to execute so that the overall performance of the system can be guaranteed. Usually, your script should not take more than a couple of milliseconds to complete. Therefore, asynchronous JavaScript features like Promises, `setTimeout` or `setInterval` cannot be used inside a calculation. If a timeout occurrs, the field value that was being calculated is marked as `invalid`.

### Template literals

[Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) are an amazing feature of ES6. They are very useful for string interpolation (and multiline strings, since unescaped newlines are allowed). They allow you to easily include newlines and variables in the result of your calculation field. Here are some basic examples of the syntax:

```ts
// A normal string
`string text`;

// Multi-line string
`string text line 1
 string text line 2`;

// String with substitution
`string text ${expression} string text`;
```
