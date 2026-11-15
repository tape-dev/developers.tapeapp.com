---
id: automations-troubleshooting-errors
title: Automation errors
sidebar_label: Errors
---

Find out why an automation run failed, and stop a run on purpose with your own error.

Tape lists every failed run under **Runs** in the automation editor, whatever its execution type. Open a run to see its logs, the action that failed and the error message. After the fix, start a [manual run](/docs/automations/execution-types#manual-run) to try again.

## Common API errors

Actions that call the Tape API can fail with these errors. The error message says what went wrong.

| HTTP status code | Code | Description | Example |
| :-- | :-- | :-- | :-- |
| 400 | `validation` or `input_validation` | Validation error. | A required value is missing, like a required field when a record is created or updated, or the text of a comment. |
| 400 | `record_no_permission` or `app_no_permission` | Permission error. | The automation has no permission for the step. Also happens when the **Author** of an action lacks the permission. |

The code is the `error_code` of the API response. See [Error codes](/docs/api/errors#error-codes) in the API reference for all codes.

Calls to other services with the `http` client don't fail on an error status. Check `statusCode` in your script, as the [HTTP client](/docs/automations/introduction#http-client) example shows.

## Throw a custom error {#throwing-custom-errors}

Throw an error in **Perform a calculation** or **Execute a script** to stop the run with a failed status. Tape logs your error message.

```js
if (some_condition) {
  throw new Error('Oops, some_condition was true');
}
```

The run stops at this point, and the remaining actions don't run. Use it when an important step fails and continuing makes no sense.

## Next steps

- [Filter values](/docs/automations/troubleshooting/filter-values): why a filter can match more records than you expect.
- [Limits and throttling](/docs/automations/limitations): limits that make a run fail.
- [Execution types](/docs/automations/execution-types): test with a simulation before a real run.
- [Automations](/docs/automations/introduction): the `tape` and `http` clients and logging.
- In the Help Center: [Common automation errors](https://help.tapeapp.com/en/articles/18448991-common-automation-errors)
- In the Help Center: [Handle errors in automations](https://help.tapeapp.com/en/articles/18449004-handle-errors-in-automations)
