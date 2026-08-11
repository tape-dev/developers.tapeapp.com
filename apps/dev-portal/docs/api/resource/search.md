---
id: search
title: Search
sidebar_label: Search
description: Search across every app and record you have access to, with optional filtering, sorting and cursor-based pagination.
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

**Search** looks across your whole organization in one request. A single search spans every workspace and every app you have access to, and returns two kinds of result — **apps** and **records** — interleaved in one relevance-ranked list.

This is the resource to reach for when you know _what_ you are looking for but not _where_ it lives. When you already know the app, [`POST /v1/record/filter/app/{app_id}`](record#retrieve-filtered-records-for-an-app) is the better tool: it filters on specific fields, returns full field values and gives you a `total`.

There is one URL — `/v1/search` — and two ways to send a search to it. [`GET`](#search) takes the search as query parameters and is the one you want most of the time. [`POST`](#search-with-a-filter) takes the same search as a JSON body, which is what lets it carry a **filter** narrowing the search to particular workspaces, apps, authors or time windows. Whichever verb you start with, you [page through the results](#pagination) with a `GET`.

Results are **previews**. An app result carries no fields, and a record result carries no field values — just enough to identify the match and fetch it. Follow up with [`GET /v1/record/{record_id}`](record#retrieve-a-record) or [`GET /v1/app/{app_id}`](app#retrieve-a-single-app) for the full object.

:::caution Page with `GET /v1/search?cursor=…`, whichever verb you started with
The `cursor` a search returns encodes the text, filter, sorting **and** page size of the search that produced it, so continuing a search never needs anything but the cursor. `POST` accepts no `cursor` at all: to fetch page two of a filtered search, send its cursor to the `GET`, with no body and nothing else. Parameters sent alongside a cursor are ignored, not merged — a `sort_by` on page two will silently have no effect. See [Pagination](#pagination).
:::

## Authentication and permissions

Both verbs require a **user API key**. An automation API key is rejected with a `400`:

```json title="⬅️      Response"
{
  "status_code": 400,
  "endpoint": "/v1/search",
  "error_code": "validation",
  "error_message": "Invalid API key for accessing endpoint '/v1/search' (this endpoint can only be accessed with a user API key)"
}
```

This is a structural limit rather than a policy choice. Every search is scoped by the permissions of the user behind the key, and an automation key has no user to scope by. Organization guests are rejected with a `401`.

Results are permission-filtered on every request — records **and** apps. Two keys belonging to different users will legitimately return different results, and different numbers of results, for the same query. Nothing you cannot already open in Tape can surface through search.

### Rate limit credits

The [base request cost](/docs/api/request-limits) is 10 credits. A search charges **50 credits (5× base)** whichever verb you use, which works out to roughly 40 searches per minute on the standard budget of 2,000 credits per minute.

| Endpoint                                      | Credits      |
| --------------------------------------------- | ------------ |
| [`GET /v1/search`](#search)                    | 50 (5× base) |
| [`POST /v1/search`](#search-with-a-filter)    | 50 (5× base) |

Paging is not free: each page costs a further 50 credits, so prefer a large `limit` over many small pages.

## The search result object

Every response has the same two-key shape:

| Field     | Type                    | Description                                                                        |
| --------- | ----------------------- | ------------------------------------------------------------------------------------ |
| `results` | `array`                 | The matches, in the requested order. Empty when nothing matched.                   |
| `cursor`  | `string` \| `null`      | Pass back to fetch the next page. `null` means this was the last page.             |

There is deliberately **no `total`**. Counting matches would double the cost of every search, so the API does not do it — page until `cursor` comes back `null`.

Each entry in `results` is a tagged union with exactly two keys: `type`, and a payload named after it. Switch on `type` to narrow it.

| `type`     | Payload key | Payload                                                                   |
| ---------- | ----------- | --------------------------------------------------------------------------- |
| `"app"`    | `app`       | An app preview, including the name of the workspace it lives in.          |
| `"record"` | `record`    | A record preview, without its field values.                               |

Apps and records are **not** returned in separate lists — they are interleaved by relevance in a single `results` array.

### App results

The `app` payload is identical to an entry from [`GET /v1/app`](app#retrieve-all-available-apps), with `workspace_name` added.

| Field            | Type      | Description                                                                        |
| ---------------- | --------- | ------------------------------------------------------------------------------------ |
| `app_id`         | `integer` | The app id.                                                                        |
| `workspace_id`   | `integer` | The workspace the app lives in.                                                    |
| `workspace_name` | `string`  | The workspace's name. Empty string if the workspace is being deleted.              |
| `slug`           | `string`  | The app's URL slug.                                                                |
| `external_id`    | `string`  | _Deprecated._ Identical to `slug`.                                                 |
| `name`           | `string`  | The app's name.                                                                    |
| `record_name`    | `string`  | Singular noun for one of the app's records, e.g. `Project`.                        |
| `item_name`      | `string`  | _Deprecated._ Identical to `record_name`.                                          |
| `type`           | `string`  | One of `database`, `dashboard`, `form`. Legacy apps without a type report `database`. |
| `description`    | `string`  | Optional. Absent when the app has no description.                                  |
| `position`       | `integer` | The app's ordering position within its workspace.                                  |
| `config`         | `object`  | Legacy-compatible mirror of `name`, `record_name` and `description`.               |

### Record results

The `record` payload is identical to a record preview from [`GET /v1/record/field/{field_id}/find`](record#find-relatable-records-for-a-relation-field).

| Field              | Type               | Description                                                                        |
| ------------------ | ------------------ | ------------------------------------------------------------------------------------ |
| `record_id`        | `integer`          | The global record id — use this to fetch the record.                               |
| `app_record_id`    | `integer`          | The record's running number within its app.                                        |
| `app_id`           | `integer`          | The app the record belongs to.                                                     |
| `app`              | `object`           | Preview of the owning app, including its `workspace`.                              |
| `title`            | `string`           | The record's computed title. May be absent.                                        |
| `created_on`       | `string`           | UTC, `YYYY-MM-DD HH:mm:ss`. See [Date & Timezone](/docs/api/date-timezone).        |
| `deleted_on`       | `string`           | Present only for a soft-deleted record.                                            |
| `created_by`       | `object` \| `null` | The user or automation that created the record.                                    |
| `current_revision` | `object` \| `null` | The record's latest revision.                                                      |
| `initial_revision` | `object` \| `null` | The record's first revision.                                                       |

A record preview carries **no** `fields`, `record_url`, `last_modified_on`, `last_modified_by` or `comment_count`. Fetch the record itself if you need those.

## Search

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/search" isNew="true" />

Search across every app and record you can see. Supply `text` to start a search, or `cursor` to continue one — one of the two is required.

**Query Parameters**

| Parameter   | Type      | Required | Description                                                                                              |
| ----------- | --------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `text`      | `string`  | Yes\*    | The text to search for. At most 100 characters. An empty value is allowed and matches everything.        |
| `cursor`    | `string`  | Yes\*    | Cursor from a previous response, to fetch the next page. Send it on its own.                             |
| `limit`     | `integer` | No       | Results per page. Between `1` and `100`. Defaults to `50`.                                               |
| `sort_by`   | `string`  | No       | One of `ranking_score`, `created_on`, `last_modified_on`. Defaults to `ranking_score`.                   |
| `sort_desc` | `boolean` | No       | Order descending. Defaults to `true`. See [Sorting](#sorting).                                           |

\* Exactly one of `text` or `cursor` is required. Supplying neither is a `400`. Supplying both is accepted, but the cursor wins and `text` is ignored.

Remember to URL-encode `text` — an unencoded `&` or `=` will silently truncate your query.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -G #BASE_URL/v1/search \\
  -u #USER_API_KEY: \\
  --data-urlencode "text=onboarding" \\
  --data-urlencode "limit=20"`}
</ContextCodeBlock>

```json title="⬅️      Response"
{
  "results": [
    {
      "type": "app",
      "app": {
        "app_id": 4821,
        "workspace_id": 913,
        "workspace_name": "Sales",
        "slug": "customer-onboarding",
        "external_id": "customer-onboarding",
        "name": "Customer Onboarding",
        "record_name": "Onboarding",
        "item_name": "Onboarding",
        "type": "database",
        "description": "Every new customer, start to finish",
        "position": 3,
        "config": {
          "description": "Every new customer, start to finish",
          "item_name": "Onboarding",
          "name": "Customer Onboarding"
        }
      }
    },
    {
      "type": "record",
      "record": {
        "record_id": 170471696,
        "app_record_id": 42,
        "app_id": 4821,
        "app": {
          "app_id": 4821,
          "name": "Customer Onboarding",
          "record_name": "Onboarding",
          "workspace_id": 913,
          "workspace": {
            "workspace_id": 913,
            "name": "Sales",
            "external_id": "sales",
            "org_id": 77
          },
          "icon": "event_available",
          "config": {
            "name": "Customer Onboarding",
            "record_name": "Onboarding",
            "workspace_id": 913,
            "workspace": {
              "workspace_id": 913,
              "name": "Sales",
              "external_id": "sales",
              "org_id": 77
            },
            "icon": "event_available"
          }
        },
        "title": "Acme Corp onboarding",
        "created_on": "2026-08-03 09:14:22",
        "created_by": {
          "id": 5501,
          "user_id": 5501,
          "org_id": 77,
          "type": "user",
          "mail": ["jane@example.com"],
          "email": "jane@example.com",
          "name": "Jane Doe"
        },
        "current_revision": {
          "type": "update",
          "revision": 7,
          "record_id": 170471696,
          "created_on": "2026-08-10 16:02:11",
          "created_by": {
            "id": 5501,
            "user_id": 5501,
            "org_id": 77,
            "type": "user",
            "mail": ["jane@example.com"],
            "name": "Jane Doe"
          }
        },
        "initial_revision": {
          "type": "creation",
          "revision": 0,
          "record_id": 170471696,
          "created_on": "2026-08-03 09:14:22",
          "created_by": {
            "id": 5501,
            "user_id": 5501,
            "org_id": 77,
            "type": "user",
            "mail": ["jane@example.com"],
            "name": "Jane Doe"
          }
        }
      }
    }
  ],
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Search with a filter

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/search" isNew="true" />

The same URL as [`GET /v1/search`](#search), and the same search — sent as a JSON body rather than as query parameters, which is what lets it carry a filter. Nothing is created, so it returns `200`, not `201`.

Everything the filter offers is a restriction on _which_ apps and records are considered; none of it changes _how_ text matches. Filter members combine with AND, and each is optional — an omitted member means "no restriction".

**Body Parameters**

| Parameter   | Type      | Required | Description                                                                                              |
| ----------- | --------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `text`      | `string`  | Yes      | The text to search for. At most 100 characters. `""` matches everything, leaving the filter to decide.   |
| `filter`    | `object`  | No       | Restrictions on which apps and records are considered. See below.                                        |
| `sort_by`   | `string`  | No       | One of `ranking_score`, `created_on`, `last_modified_on`. Defaults to `ranking_score`.                   |
| `sort_desc` | `boolean` | No       | Order descending. Defaults to `true`. Must be a real JSON boolean, not a string.                         |

**`filter` object**

| Parameter              | Type        | Description                                                                              |
| ---------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `workspace_ids`        | `integer[]` | Only return results living in one of these workspaces. At most 100 ids.                  |
| `app_ids`              | `integer[]` | Only return records belonging to one of these apps, and only these apps themselves. At most 100 ids. |
| `created_by_user_ids`  | `integer[]` | Only return results created by one of these users. At most 100 ids.                      |
| `created_within`       | `string`    | One of `last_24_hours`, `last_7_days`, `last_30_days`.                                   |
| `last_modified_within` | `string`    | One of `last_24_hours`, `last_7_days`, `last_30_days`.                                   |

**Query Parameters**

| Parameter | Type      | Required | Description                                                            |
| --------- | --------- | -------- | -------------------------------------------------------------------------- |
| `limit`   | `integer` | No       | Results per page. Between `1` and `100`. Defaults to `50`.             |

`limit` is the only query parameter this verb takes. There is no `cursor` here — a filtered search is continued with [`GET /v1/search?cursor=…`](#pagination), because the cursor already carries the filter.

Unknown keys are rejected rather than ignored. Misspelling `workspace_ids` as `workspaceIds` returns a `400` — the API will never quietly accept a filter it is not applying.

The example below finds records and apps mentioning "onboarding", limited to two workspaces and to things changed in the last week.

<Tabs defaultValue="curl">
<TabItem value="curl" label="cURL">

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/search?limit=20 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "text": "onboarding",
    "filter": {
      "workspace_ids": [913, 914],
      "last_modified_within": "last_7_days"
    },
    "sort_by": "last_modified_on"
  }'`}
</ContextCodeBlock>

</TabItem>
<TabItem value="json" label="JSON">

```json title="➡️      Request"
{
  "text": "onboarding",
  "filter": {
    "workspace_ids": [913, 914],
    "last_modified_within": "last_7_days"
  },
  "sort_by": "last_modified_on"
}
```

</TabItem>
</Tabs>

The response shape is identical to [`GET /v1/search`](#search).

To browse rather than search — say, everything created in one app in the last 24 hours — send an empty `text` and let the filter do the work:

```json title="➡️      Request"
{
  "text": "",
  "filter": {
    "app_ids": [4821],
    "created_within": "last_24_hours"
  },
  "sort_by": "created_on"
}
```

:::note Only relative time windows are available
`created_within` and `last_modified_within` accept three fixed windows measured backwards from the moment the search runs. There is no absolute date range, and nothing older than 30 days can be windowed. For anything more precise, filter records by a date field with [`POST /v1/record/filter/app/{app_id}`](record#retrieve-filtered-records-for-an-app).
:::

## Pagination

Search uses **cursor pagination**, not `limit`/`offset`. To walk a result set:

1. Make a search, with either verb. Read `results`.
2. If `cursor` is `null`, you are done.
3. Otherwise call `GET /v1/search` with only that `cursor`, and read the next `results`.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -G #BASE_URL/v1/search \\
  -u #USER_API_KEY: \\
  --data-urlencode "cursor=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`}
</ContextCodeBlock>

A cursor is an opaque signed token that encodes the entire search — its text, its filter, its sorting and its page size. That has three consequences worth internalising:

- **Always continue with `GET`,** even for a search you started with `POST`. The `POST` verb takes no cursor, precisely because a cursor leaves nothing for a body to add.
- **Send the cursor alone.** Any `text`, `sort_by` or `sort_desc` sent with it is ignored. So is `limit`: a continued search keeps the page size of the search that created the cursor, so pages stay uniform.
- **Do not build, edit or store cursors.** They are signed and may expire. Treat them as single-use tokens handed straight back to the API.

A page can contain fewer entries than `limit` and still not be the last page — a record whose workspace is mid-deletion is dropped from the page rather than failing the whole request. Trust `cursor`, not the length of `results`.

:::caution An unsearchable query returns a single page
When `text` is empty, or reduces to nothing meaningful (only punctuation, or only stop words), the response always has `cursor: null` — even if more matches exist. Without a real text query every page would be identical to the first, so no cursor is issued rather than handing you an endless loop. If you need to page through a large filtered set, give it real search text.
:::

## Sorting

| `sort_by`          | Orders by                                       |
| ------------------ | ------------------------------------------------- |
| `ranking_score`    | Relevance — best match first. **The default.**  |
| `created_on`       | When the app or record was created.             |
| `last_modified_on` | When the app or record was last changed.        |

`sort_desc` defaults to `true`, which means best match first for `ranking_score` and newest first for the two timestamps. Pass `false` to reverse — with `ranking_score` that gives you the _worst_ matches first, which is rarely what you want.

Results with an equal sort value are always ordered by id **descending**, whatever `sort_desc` is set to. This tiebreak is what makes paging stable.

The ranking score itself is not exposed. Relevance is observable only as the order of the array.

## What matches

Search runs over a text index built per app and per record, not over raw field values, so a few behaviours differ from a `contains` filter.

**Terms match as prefixes, and all terms must match.** A query is split into words, and each word matches from the start of an indexed word. Searching `onboard` finds "onboarding"; searching `onboardings` does **not** find "onboarding". A multi-word query returns only results matching every word.

**Matching is case-insensitive** and aware of common stop words.

**More than titles is indexed.** For a record that includes text and multi-line text fields, calculations, email, phone, link, location, unique id, number, category, status, date and relation values — **and its comments**. So a record can match on a comment even though the result exposes no comment data. For an app it covers the app's name, description and blocks. Long values are truncated in the index at 2,000 characters per field.

**`text` is capped at 100 characters** on both verbs. Longer text is a `400`.

:::note Very short queries in large organizations
Most organizations can search for anything, including an empty string. In a small number of very large organizations, short queries are expensive enough to be disallowed: a query of fewer than four characters returns `{"results": [], "cursor": null}` with a `200`, not an error. If you get an unexpectedly empty result for a two- or three-letter query, try a longer one before assuming nothing matched.
:::

## Errors

**`400 Bad Request`** covers every input problem. The common causes:

- Neither `text` nor `cursor` on `GET /v1/search`.
- `text` longer than 100 characters.
- `limit` that is not an integer, is above `100`, or is below `1`.
- `sort_by` outside the three accepted values.
- `sort_desc` that is not boolean-like on `GET`, or not a real boolean on `POST`.
- A `POST` body that is missing `text`, is not valid JSON, contains an unknown key, has an id array longer than 100 entries, or uses a time window outside the three accepted values.
- Using an automation API key.

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "status_code": 400,
  "endpoint": "/v1/search",
  "error_code": "validation",
  "error_message": "A search must provide either the \\"text\\" or the \\"cursor\\" query parameter (none provided)"
}`}
</ContextCodeBlock>

Body-schema failures on `POST /v1/search` report `error_code` as `input_validation` and name the offending path in `error_message`.

**`401 Unauthorized`.** No API key, or an organization guest.

**`429 Too Many Requests`.** Each search costs 50 credits. See [Request limits](/docs/api/request-limits).

A search never returns `404`. Anything you cannot see is simply absent from `results`.

See [Errors](/docs/api/errors) for the full list of error codes.

## Known limitations

- **Apps and records only.** Workspaces, users, files, comments, tasks, views and automations are not returned as results, even though comment text does feed the record index.
- **No `total`.** Page until `cursor` is `null`.
- **No relevance score and no highlights.** You cannot tell _how_ well a result matched, or _where_ the match was.
- **No absolute date filtering.** Only the three relative windows.
- **No field-level search.** To match against a specific field, use [`POST /v1/record/filter/app/{app_id}`](record#retrieve-filtered-records-for-an-app).
- **Previews only.** No field values come back with a search result.
