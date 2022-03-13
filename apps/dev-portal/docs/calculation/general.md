---
id: intro
title: Calculation Field
sidebar_label: General
---

Calculation fields can be used to easily manipulate the data added to your apps. This very powerful tool not only allows you to perform mathematical calculations on the numbers in your app, but also lets you concatenate the values in certain fields together.

Values are added to a calculation field using variables. Use the "@" symbol to search for variables in your app. You can reference any fields within your app, as well as any fields within referenced apps.

- Executed on the server
  - ES6 Syntax
  - Timeout MS
  - eval, async, setTimeout, ...
  - We do not support client-side js script tag due to security reasons -> do this inside an IFRAME bois

## Template Strings

Template strings are an amazing feature of ES6. They are strings delimited with backticks (`), allowing embedded expressions called substitutions.
Untagged template strings result in strings, which makes them useful for string interpolation (and multiline strings, since unescaped newlines are allowed).

**Syntax**

```
`string text`

`string text line 1
 string text line 2`

`string text ${expression} string text`
```
