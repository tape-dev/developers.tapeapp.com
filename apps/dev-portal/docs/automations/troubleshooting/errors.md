---
id: automations-troubleshooting-errors
title: Errors
sidebar_label: Errors
---

If an automation fails, independent from its execution type, it will be logged as a failed run. The failed run will contain the individual logs also i.e. also the failed action including its error message.

## Common API errors

Some errors may occur when building workflow automations in Tape. The API will yield a proper error message.

The following API errors can be expected:

| HTTP Status Code | Description         | Examples                                                                                                                                                                                                   |
| :--------------- | :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400              | Validation error    | A required property was not provided, e.g. a required field in a record update / create operation, or the content of a comment.                                                                            |
| 403              | Authorization error | A flow attempted to perform an operation that it lacks sufficient permission for. This may also happen if a custom author is selected for individual actions and that author has insufficient permissions. |

More information on API errors can be found in the [API errors](/docs/api/errors) section.

## Throwing Custom Errors

In calculations and script executions, developers may throw a custom error that will also be properly logged and propagated via automation info webhooks.

Simply throw an error in your control flow, and the automation will fail with that error being logged:

```
if (some_condition) {
    throw new Error('Oops, some_condition was false')
}
```

Note that throwing an error is also one proper way of ending your automation with a failed state, as it will stop at that point and remaining actions will not be executed. This can be useful if a crucial step fails, and it does not make sense to continue the automation.
