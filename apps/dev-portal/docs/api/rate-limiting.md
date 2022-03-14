---
id: rate-limiting
title: Rate Limiting
sidebar_label: Rate Limiting
---

# Rate Limiting

Currently a global rate limit of X is enforced for all personal API keys. Contact us if you require a different limit.

Should you hit the rate limits the API will begin to return `429` HTTP error codes.

## Tips for reducing API usage

- Avoid making API requests inside loops. Instead of loading individual objects inside a loop, load a collection of objects in one API operation.
- Use result caching where applicable.
- Do not poll for changed data. Use webhooks to react to changes instead.
- Use logging to see how many requests you're making
