---
id: request-limits
title: Request Limits
sidebar_label: Request Limits
---

To ensure a consistent developer experience for all API users, the Tape API is rate limited and basic size limits apply to request parameters.

## Rate limits

Rate-limited requests will return a `too_many_requests` error code (HTTP response status 429). **The base rate limit for incoming requests is an average of 3 requests per second**. Some bursts beyond the average rate are allowed.

Integrations should accommodate variable rate limits by handling HTTP 429 responses and backing off (or slowing down) the speed of future requests. A common way to implement this is using one or several queues for pending requests, which can be consumed by sending requests as long as Tape does not respond with an HTTP 429.

:::caution Rate limits may change
In the future, Tape plans to adjust rate limits to balance for demand and reliability. Tape may also introduce distinct rate limits for organizations in different pricing plans.
:::

### Rate limit credits

Tape uses a credit-based system to enforce rate limits. Each user has a certain number of credits per time interval (currently 2,000 credits per minute). All of a user's credentials — their user API key and every [personal access token](personal-access-tokens) they own — draw from that same budget, so creating more tokens does not increase throughput. After the time interval, the credits are replenished. By default, each request costs 10 credits. Certain requests can cost more credits if they are expensive to execute. An example would be a request that fetches records with the maximum page size with all their fields or the deletion of a workspace. Each endpoint documentation includes the number of credits required for each request.

You can see how many credits you have left, when your credits will be replenished, and how many credits are required for a request via the rate limit headers.

### Rate limit headers

Rate limit headers are sent **with every response**. This allows the integration to prevent rate limiting errors and back off before the actual rate limit is hit.

| HTTP Header          | Description                                                                 | Example               |
| :------------------- | :-------------------------------------------------------------------------- | :-------------------- |
| `X-RateLimit-Limit`  | Total credits that can be used per time interval                            | `1000`                |
| `X-Retry-Remaining`  | Credits remaining for the application in this time interval                 | `400`                 |
| `X-Retry-Cost`       | The number of credits consumed by the current request                       | `20`                  |
| `X-Retry-Reset`      | The date and time at which the credits will be reset                        | `2022-03-01 12:00:00` |
| `Retry-After`        | The number of seconds remaining in this interval until credits are reset    | `60`                  |

:::info `X-Retry-Reset` is a UTC datetime
`X-Retry-Reset` is formatted `YYYY-MM-DD HH:mm:ss` — the same datetime format used throughout the API, with
no `Z` suffix and no numeric offset. Unlike the temporal properties in response bodies, it is a header and so
has no local counterpart: **it is always UTC**. See [Date & Timezone](/docs/api/date-timezone).
:::

Here is an example for the response headers of a valid request:

```http
HTTP/1.1 200 OK
Retry-After: 57
X-RateLimit-Limit: 50
X-Retry-Remaining: 46
X-Retry-Cost: 2
X-Retry-Reset: 2022-03-01 12:00:00
```

If the rate limit is exceeded, the error response body will also include all rate limit information:

```json
{
  "status_code": 429,
  "endpoint": "/v1/record/123",
  "error_code": "too_many_requests",
  "error_message": "Too many requests (0/50 points left), retry after 58 seconds (2022-03-01 12:00:00). Your current request costs 10 points. Check https://developers.tapeapp.com/ for more info",
  "retry_after": 58,
  "rate_limit": 50,
  "rate_limit_remaining": 0,
  "rate_limit_cost": 10,
  "rate_limit_reset": "2022-03-01 12:00:00"
}
```

### Tips for reducing API usage

- Avoid making API requests inside loops. Instead of loading individual objects inside a loop, load a collection of objects in one API operation.
- Use result caching where applicable.
- Do not poll for changed data. Use webhooks to react to changes instead.
- Use logging to see how many requests you're making.

### Getting more credits

If your integration needs more credits per time interval, you can always ask the Tape team to increase your rate limit credits. It is discouraged to do key rotations, or to create additional personal access tokens, to get around this problem — neither adds credits.

## Size limits

Tape limits the size of certain parameters. A request that exceeds any of these limits will return a `validation_error` error code (HTTP response status 400) and contain more specific details in the `error_message` property.

Integrations should avoid sending requests beyond these limits proactively. It may be helpful to use test data in your own test suite which intentionally contains large parameters to verify that the errors are handled appropriately. For example, if the integration reads a URL from an external system to put into a Tape record, the integration should have a plan to deal with URLs that are beyond the length limit. The integration might choose to log the error, or send an alert to the user who set up the integration via an email, or some other action.
