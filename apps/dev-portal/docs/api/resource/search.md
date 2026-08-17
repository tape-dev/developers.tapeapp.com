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

Both verbs require a credential that belongs to a user — either a [user API key](/docs/api/authentication#user-api-key) or a [personal access token](/docs/api/personal-access-tokens). An automation API key is rejected with a `400`:

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

:::info Personal access tokens see a narrowed result set
Search is allowed for a [personal access token](/docs/api/personal-access-tokens) holding **either** the `apps:read` or the `records:read` [capability](/docs/api/capabilities) — you do not need both. A token holding only one of them still gets a `200`, but the response contains only the result type it is allowed to see: a token with just `records:read` receives record results and no app results, even if `types` asked for both. A token holding neither is rejected with a `403`.

A token restricted to selected workspaces and apps is narrowed a second time: search succeeds with a `200` and returns only hits from within its [content selection](/docs/api/personal-access-tokens#content-selection).

A user API key is subject to neither narrowing and always receives both result types across everything its owner can see.
:::

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

Apps and records are **not** returned in separate lists — they are interleaved by relevance in a single `results` array. To receive only one kind, narrow the search with `types` (as [`?types=record`](#search) on the `GET`, or [`filter.types`](#search-with-a-filter) on the `POST`).

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
| `position`       | `number`  | The app's ordering position within its workspace. Fractional — apps are reordered by inserting between neighbors, so expect values like `107.125125118059`. |
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
| `text`      | `string`  | Yes\*    | The text to search for. Between 1 and 100 characters, and must contain a searchable term.                |
| `cursor`    | `string`  | Yes\*    | Cursor from a previous response, to fetch the next page. Send it on its own.                             |
| `limit`     | `integer` | No       | Results per page. Between `1` and `100`. Defaults to `50`.                                               |
| `types`     | `string`  | No       | Comma-separated kinds to return — `app`, `record`, or `app,record`. Omit to receive both.                |
| `sort_by`   | `string`  | No       | One of `ranking_score`, `created_on`, `last_modified_on`. Defaults to `ranking_score`.                   |
| `sort_desc` | `boolean` | No       | Order descending. Defaults to `true`. See [Sorting](#sorting).                                           |

\* Exactly one of `text` or `cursor` is required. Supplying neither is a `400`. Supplying both is accepted, but the cursor wins and `text` is ignored.

`types` is comma-separated here rather than repeated (`?types=app&types=record` is **not** the accepted form). An unrecognized member is a `400`, not a silently dropped filter. Narrowing to one kind does not enlarge the page — a page still holds at most `limit` results — but it stops the other kind consuming slots in it.

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
| `text`      | `string`  | Yes      | The text to search for. Between 1 and 100 characters, and must contain a searchable term.                |
| `filter`    | `object`  | No       | Restrictions on which apps and records are considered. See below.                                        |
| `sort_by`   | `string`  | No       | One of `ranking_score`, `created_on`, `last_modified_on`. Defaults to `ranking_score`.                   |
| `sort_desc` | `boolean` | No       | Order descending. Defaults to `true`. Must be a real JSON boolean, not a string.                         |

**`filter` object**

| Parameter                | Type        | Description                                                                              |
| ------------------------ | ----------- | ------------------------------------------------------------------------------------------ |
| `types`                  | `string[]`  | Kinds to return — `["app"]`, `["record"]` or both. Must be non-empty and free of duplicates. Omit to receive both. |
| `workspace_ids`          | `integer[]` | Only return results living in one of these workspaces. At most 100 ids.                  |
| `app_ids`                | `integer[]` | Only return records belonging to one of these apps, and only these apps themselves. At most 100 ids. |
| `created_by_user_ids`    | `integer[]` | Only return results created by one of these users. At most 100 ids.                      |
| `created_at_from`        | `string`    | Only results created at or after this moment. `YYYY-MM-DD HH:mm:ss`, UTC.                |
| `created_at_to`          | `string`    | Only results created at or before this moment. `YYYY-MM-DD HH:mm:ss`, UTC.               |
| `last_modified_at_from`  | `string`    | Only results last changed at or after this moment. `YYYY-MM-DD HH:mm:ss`, UTC.           |
| `last_modified_at_to`    | `string`    | Only results last changed at or before this moment. `YYYY-MM-DD HH:mm:ss`, UTC.          |

The four date bounds are **absolute and independent**. Send only a `_from` for "since", only a `_to` for "until", or both for a closed window. A `_from` later than its matching `_to` is a `400` rather than an empty result set, as is a calendar-impossible date such as `2026-02-30`. Timestamps use the same format as everywhere else in the API — see [Date & Timezone](/docs/api/date-timezone).

**Query Parameters**

| Parameter | Type      | Required | Description                                                            |
| --------- | --------- | -------- | -------------------------------------------------------------------------- |
| `limit`   | `integer` | No       | Results per page. Between `1` and `100`. Defaults to `50`.             |

`limit` is the only query parameter this verb takes. There is no `cursor` here — a filtered search is continued with [`GET /v1/search?cursor=…`](#pagination), because the cursor already carries the filter.

Unknown keys are rejected rather than ignored. Misspelling `workspace_ids` as `workspaceIds` returns a `400` — the API will never quietly accept a filter it is not applying.

The example below finds records mentioning "onboarding" in either of two workspaces, changed since a fixed moment.

<Tabs defaultValue="curl">
<TabItem value="curl" label="cURL">

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/search?limit=20 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "text": "onboarding",
    "filter": {
      "types": ["record"],
      "workspace_ids": [913, 914],
      "last_modified_at_from": "2026-08-01 00:00:00"
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
    "types": ["record"],
    "workspace_ids": [913, 914],
    "last_modified_at_from": "2026-08-01 00:00:00"
  },
  "sort_by": "last_modified_on"
}
```

</TabItem>
</Tabs>

The response shape is identical to [`GET /v1/search`](#search).

### Polling for changes

`last_modified_at_from` is the filter an incremental sync runs on: pass the timestamp of your last successful poll to receive only what has changed since.

```json title="➡️      Request"
{
  "text": "invoice",
  "filter": {
    "types": ["record"],
    "app_ids": [4821],
    "last_modified_at_from": "2026-08-11 14:30:00"
  },
  "sort_by": "last_modified_on",
  "sort_desc": false
}
```

:::caution Never-modified results are excluded by a `last_modified_at` bound
A record or app that has not been changed since it was created has no last-modified timestamp at all, so it satisfies neither bound and drops out of the result set as soon as you set either one. A sync built only on `last_modified_at_from` will therefore never see brand-new, untouched records — pair it with `created_at_from` over the same window, or seed from an unfiltered search first.
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

:::note Every accepted search pages to completion
There is no partial mode. A search that cannot be paginated is rejected at the door with a `400` rather than being served as a truncated first page — so a `limit`-sized page with `cursor: null` genuinely means you have seen everything. See [What matches](#what-matches) for which queries get rejected.
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

Search runs over a text index built per app and per record, not over raw field values, so a few behaviors differ from a `contains` filter.

**Terms match as prefixes, and all terms must match.** A query is split into words, and each word matches from the start of an indexed word. Searching `onboard` finds "onboarding"; searching `onboardings` does **not** find "onboarding". A multi-word query returns only results matching every word.

**Matching is case-insensitive** and aware of common stop words.

**More than titles is indexed.** For a record it covers text and multi-line text fields, calculations, email, phone, link, location, unique id, number, category, status, date and relation values — **and its comments**. So a record can match on a comment even though the result exposes no comment data. For an app it covers the app's name, description and blocks. Long values are truncated in the index at 2,000 characters per field.

**`text` is required, and must carry a searchable term.** It is between 1 and 100 characters, and text made only of punctuation or symbols — `"..."`, `"!!!"` — is a `400`, not an empty result set. A search always searches for something: there is no "match everything and let the filter decide" mode. To narrow by filter alone, search for a term you expect and add the filter to it.

:::note Very short queries in large organizations
Most organizations can search for any term of one character or more. In a small number of very large organizations, short queries are expensive enough to be disallowed: a query of fewer than four characters is rejected with a `400` naming the minimum. It is an error rather than an empty `200`, so you can tell "your query was too short" apart from "nothing matched".
:::

Both of these are checked only when a search **starts**. Continuing one with a cursor never re-runs them.

## Errors

**`400 Bad Request`** covers every input problem. The common causes:

- Neither `text` nor `cursor` on `GET /v1/search`.
- `text` that is empty, longer than 100 characters, or carries no searchable term.
- `text` shorter than the minimum your organization enforces.
- `limit` that is not an integer, is above `100`, or is below `1`.
- `sort_by` outside the three accepted values.
- `sort_desc` that is not boolean-like on `GET`, or not a real boolean on `POST`.
- `types` naming anything other than `app` or `record`, or an empty `types` list.
- A date bound that is malformed, calendar-impossible (`2026-02-30`), or a `_from` later than its `_to`.
- A `POST` body that is missing `text`, is not valid JSON, contains an unknown key, or has an id array longer than 100 entries.
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

**`403 Forbidden`.** A personal access token holding neither `apps:read` nor `records:read`. See [Capabilities](/docs/api/capabilities).

**`429 Too Many Requests`.** Each search costs 50 credits. See [Request limits](/docs/api/request-limits).

A search never returns `404`. Anything you cannot see is simply absent from `results`.

See [Errors](/docs/api/errors) for the full list of error codes.

## Known limitations

- **Apps and records only.** Workspaces, users, files, comments, tasks, views and automations are not returned as results, even though comment text does feed the record index.
- **No `total`.** Page until `cursor` is `null`.
- **No relevance score and no highlights.** You cannot tell _how_ well a result matched, or _where_ the match was.
- **No browsing without a search term.** Every request must carry real text; a filter alone cannot drive a result set.
- **No relative date windows.** Date bounds are absolute timestamps you compute yourself.
- **No field-level search.** To match against a specific field, use [`POST /v1/record/filter/app/{app_id}`](record#retrieve-filtered-records-for-an-app).
- **Previews only.** No field values come back with a search result.
