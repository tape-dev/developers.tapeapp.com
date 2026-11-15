---
id: introduction
title: Tape Developer API
sidebar_label: Introduction
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Admonition from '@theme/Admonition';

Use the Tape API to read and change records, apps and workspaces, and to connect other services to Tape.

:::info New to the Tape API?
Start with the [Quickstart](/docs/guide/api/getting-started). It takes you to your first request in two steps.
:::

## Conventions

Send every request to the base URL `https://api.tapeapp.com`. The API requires HTTPS.

The API follows RESTful conventions where possible. Most operations use `GET`, `POST`, `PUT` and `DELETE` requests. Request and response bodies are JSON.

### JSON conventions

- Property names use snake_case, not camelCase or kebab-case.
- Dates and datetimes are strings in an ISO 8601-like format. A datetime includes the time (`2020-08-12 02:12:33`), a date only the date (`2020-08-12`). See [Date & timezone](/docs/api/date-timezone).

## Code samples

Every endpoint shows a sample request and response. Requests use cURL.

The samples use a [personal access token](/docs/api/personal-access-tokens), the recommended credential. Send it as a bearer token in the `Authorization` header, or with the cURL option `-u` (`-u tape_pat_…:`). A user API key works the same way.

Most samples read the token from the environment variable `TAPE_TOKEN` and use example IDs such as `1`. Replace them with your own.

## Next steps

- [Quickstart](/docs/guide/api/getting-started): retrieve your first record.
- [Coming from the Podio API](/docs/guide/api/coming-from-podio): move an existing integration to Tape.
- [Tape API guide, first steps](https://community.tapeapp.com/t/tape-api-guide-first-steps/2522): try three requests in Postman, no code needed.
- [Authentication](/docs/api/authentication): choose between personal access tokens, user API keys and OAuth.
- [Capabilities](/docs/api/capabilities): what each endpoint requires.
- [Errors](/docs/api/errors): status codes and error codes.
- [Request limits](/docs/api/request-limits): stay within the request budget.
- [Pagination](/docs/api/pagination): page through long lists.
- In the Help Center: [Tape API](https://help.tapeapp.com/en/articles/18449283-tape-api)
- In the Help Center: [Intro to Tape for developers](https://help.tapeapp.com/en/articles/6448126-intro-to-tape-for-developers)
