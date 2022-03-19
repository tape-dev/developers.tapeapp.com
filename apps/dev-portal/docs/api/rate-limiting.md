---
id: request-limits
title: Request Limits
sidebar_label: Request Limits
---

To ensure a consistent developer experience for all API users, the Tape API is rate limited and basic size limits apply to request parameters.

## Rate Limits

Rate-limited requests will return a `too_many_requests` error code (HTTP response status 429). **The base rate limit for incoming requests is an average of 3 requests per second**. Some bursts beyond the average rate are allowed.

Integrations should accommodate variable rate limits by handling HTTP 429 responses and backing off (or slowing down) the speed of future requests. A common way to implement this is using one or several queues for pending requests, which can be consumed by sending requests as long as Tape does not respond with an HTTP 429.

:::caution Rate limits may change
In the future, Tape plans to adjust rate limits to balance for demand and reliability. Tape may also introduce distinct rate limits for organizations in different pricing plans.
:::

### Rate Limit Credits

Tape uses a credit-based system to enforce rate limits.

### Rate Limit Headers

Rate limit headers are sent **with every response**. This allows the integration to prevent rate limiting errors and back off before the actual rate limit is hit.

| HTTP Header          | Description                                                                 | Example               |
| :------------------- | :-------------------------------------------------------------------------- | :-------------------- |
| `X-RateLimit-Limit ` | Total credits that can be used per time interval                            | `1000`                |
| `X-Retry-Remaining`  | Credits remaining for the application in this time interval                 | `400`                 |
| `X-Retry-Cost`       | The amount of credits consumed by the current request                       | `20`                  |
| `X-Retry-Reset`      | The date at which the credits will be reset                                 | `2022-03-01 12:00:00` |
| `Retry-After`        | The amount of seconds remaining in this interval until credits are resetted | `60`                  |

### Tips for reducing API usage

- Avoid making API requests inside loops. Instead of loading individual objects inside a loop, load a collection of objects in one API operation.
- Use result caching where applicable.
- Do not poll for changed data. Use webhooks to react to changes instead.
- Use logging to see how many requests you're making

## Size limits

Tape limits the size of certain parameters. A requests that exceeds any of these limits will return `validation_error` error code (HTTP response status 400) and contain more specific details in the `error_message` property.

Integrations should avoid sending requests beyond these limits proactively. It may be helpful to use test data in your own test suite which intentionally contains large parameters to verify that the errors are handled appropriately. For example, if the integration reads a URL from an external system to put into a Tape record, the integration should have a plan to deal with URLs that are beyond the length limit. The integration might choose to log the error, or send an alert to the user who set up the integration via an email, or some other action.
