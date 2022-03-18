---
id: introduction
title: Tape Developer API
sidebar_label: Introduction
---

import { ActiveUserApiKey } from '@site/src/components/active-user/api-key.component';
import ApiKeyCodeblock from '@site/src/components/api-key-code-block/api-key-code-block.component';

The reference is your key to a comprehensive understanding of the Tape Developer API.

Developers use the API to access Tape's records, apps, fields and so on. Developers can connect services to Tape and build interactive experiences for users within Tape. Using the navigation on the left, you'll find details for each endpoint and type of resource used in the API.

:::info
If this is your first look at the Tape API, we recommend beginning with the [Getting started guide](/docs/guide/getting-started).
:::

## Conventions

The base URL to send all API requests is `https://api.tapeapp.com`. HTTPS is required for all API requests.

The Tape API follows RESTful conventions when possible, with most operations performed via `GET`, `POST`, `PUT`, and `DELETE` requests on all resources. Request and response bodies are encoded as JSON.

### JSON conventions

- Property names are in snake_case (not camelCase or kebab-case).
- Temporal values (dates and datetimes) are encoded in ISO 8601 strings. Datetimes will include the time value (2020-08-12 02:12:33.231) while dates will include only the date (2020-08-12). A detailed explanation can be found [here](date-timezone).

## Code samples

Samples requests and responses are shown for each endpoint. Requests are shown using cURL. To increase readability, we use the `-u` option of cURL to pass the user API key instead of specifiying the `Authorization` header. These samples make it easy to copy, paste, and modify as you build your integration.
