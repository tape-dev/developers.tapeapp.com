---
id: request-limits
title: Request Limits
sidebar_label: Request Limits
---

To ensure a consistent developer experience for all API users, the Tape API is rate limited and basic size limits apply to request parameters.

## Rate limits

Rate-limited requests will return a `too_many_requests` error code (HTTP response status 429). **The rate limit for incoming requests is an average of 3 requests per second**. Some bursts beyond the average rate are allowed.

Integrations should accommodate variable rate limits by handling HTTP 429 responses and backing off (or slowing down) the speed of future requests. A common way to implement this is using one or several queues for pending requests, which can be consumed by sending requests as long as Tape does not respond with an HTTP 429.

:::caution Rate limits may change
In the future, Tape plans to adjust rate limits to balance for demand and reliability. Tape may also introduce distinct rate limits for organizations in different pricing plans.
:::

## Tips for reducing API usage

- Avoid making API requests inside loops. Instead of loading individual objects inside a loop, load a collection of objects in one API operation.
- Use result caching where applicable.
- Do not poll for changed data. Use webhooks to react to changes instead.
- Use logging to see how many requests you're making
