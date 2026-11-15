# Request limits

> Handle rate limits and size limits so your integration keeps working under load.

Handle rate limits and size limits so your integration keeps working under load.

## Rate limits

A rate-limited request returns HTTP status `429` with the error code `user_too_many_requests`.

The base rate limit is an average of 3 requests per second. Short bursts above the average are allowed.

Handle `429` responses and slow down your following requests. After a `429`, wait the number of seconds in the `Retry-After` header before you retry.

A common pattern is one or more queues for pending requests. Keep sending from the queue as long as Tape doesn't respond with `429`.

> Rate limits may change
> 
> Tape plans to adjust rate limits to balance demand and reliability. Tape may also introduce distinct rate limits for organizations on different pricing plans.

### Rate limit credits

Tape enforces rate limits with credits:

-   Each user has 2,000 credits per minute. After the minute, the credits refill.
-   A request costs 10 credits by default. Expensive requests cost more, for example creating a record or creating, updating or deleting an app. Some endpoint pages list their cost. The `X-Retry-Cost` header shows the cost of every request.
-   All credentials of a user share the same budget: the user API key, every [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens) they own, and every app or MCP client they connected with [OAuth](https://developers.tapeapp.com/docs/api/oauth/overview). More tokens don't mean more throughput.
-   A request that authenticates but lacks a capability, or falls outside a token's content access, still costs credits. Tape checks both after rate limiting.

Coming from the [Podio API](https://developers.tapeapp.com/docs/guide/api/coming-from-podio)? Tape counts credits per minute, not calls per hour.

### Rate limit headers

Tape sends rate limit headers *with every response*. Use them to slow down before you hit the limit. These are the response headers of a valid request:

```http
HTTP/1.1 200 OK
Retry-After: 57
X-RateLimit-Limit: 2000
X-Retry-Remaining: 1990
X-Retry-Cost: 10
X-Retry-Reset: 2022-03-01 12:00:00
X-RateLimit-Scope: user
```

| HTTP header | Description | Example |
| --- | --- | --- |
| `X-RateLimit-Limit` | Total credits per time interval. | `2000` |
| `X-Retry-Remaining` | Credits left in this time interval. | `1980` |
| `X-Retry-Cost` | Credits the current request used. | `10` |
| `X-Retry-Reset` | Date and time at which the credits reset. | `2022-03-01 12:00:00` |
| `Retry-After` | Seconds left in this interval until the credits reset. | `60` |
| `X-RateLimit-Scope` | Which budget the request counts against: `user` for a user's credentials, `workflow` for an automation API key. | `user` |

> Which timezone does `X-Retry-Reset` use?
> 
> `X-Retry-Reset` uses the format `YYYY-MM-DD HH:mm:ss`, the same datetime format as the rest of the API, with no `Z` suffix and no numeric offset. Unlike the temporal properties in response bodies, it's a header and has no local counterpart: *it's in UTC*. See [Date & timezone](https://developers.tapeapp.com/docs/api/date-timezone).

When you exceed the rate limit, the error response body also contains all rate limit information:

```json
{
  "status_code": 429,
  "endpoint": "/v1/record/123",
  "error_code": "user_too_many_requests",
  "error_message": "Too many requests (0/2000 credits left) for user with ID 1, retry after 58 seconds (2022-03-01 12:00:00). Your current request costs 10 credits. Check https://developers.tapeapp.com/docs/api/request-limits for more info",
  "retry_after": 58,
  "rate_limit": 2000,
  "rate_limit_remaining": 0,
  "rate_limit_cost": 10,
  "rate_limit_reset": "2022-03-01 12:00:00"
}
```

### Tips for reducing API usage

-   Avoid API requests inside loops. Load a collection of objects in one request instead of one object per request.
-   Cache results where you can.
-   Don't poll for changed data. Use [webhooks](https://developers.tapeapp.com/docs/api/resource/webhook) to react to changes.
-   Log your requests to see how many you make.

### Getting more credits

Need more credits per time interval, for example for a large partner integration? Ask the [Tape team](mailto:team@tapeapp.com) to raise your limit.

## Size limits

Tape limits the size of some parameters. A request above a limit returns HTTP status `400` with the error code `validation`. The `error_message` property says which limit applies.

Stay below the size limits in your integration. Add test data with deliberately large parameters to your test suite to check that you handle the errors.

For example, if your integration copies a URL from another system into a Tape record, plan for URLs above the length limit. Log the error, alert the user who set up the integration, or take another action.

## Next steps

[

Errors

handle `429` and other error responses.

](https://developers.tapeapp.com/docs/api/errors)[

Pagination

load collections in fewer requests.

](https://developers.tapeapp.com/docs/api/pagination)[

Webhook

react to changes instead of polling.

](https://developers.tapeapp.com/docs/api/resource/webhook)[

Personal access tokens

create and limit a token.

](https://developers.tapeapp.com/docs/api/personal-access-tokens)
