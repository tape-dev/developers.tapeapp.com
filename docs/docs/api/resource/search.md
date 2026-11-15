# Search

> Search across every app and record you have access to, with optional filtering, sorting and cursor-based pagination.

Use these endpoints to find apps and records by text across your whole organization.

One search covers every workspace and every app you have access to. It returns two kinds of result, *apps* and *records*, mixed in one list and ranked by relevance.

Use search when you know *what* you're looking for but not *where* it is. Already know the database app? [`POST /v1/record/filter/app/{app_id}`](https://developers.tapeapp.com/docs/api/resource/record#retrieve-filtered-records-for-an-app) filters on specific fields, returns full field values and gives you a `total`.

Both endpoints share one URL, `/v1/search`:

-   [`GET`](#search) takes the search as query parameters. Use it in most cases.
-   [`POST`](#search-with-a-filter) takes the same search as a JSON body. Only the body can carry a *filter* that narrows the search to workspaces, apps, authors or time windows.

Whichever you start with, [page through the results](#pagination) with `GET`.

Results are *previews*. An app result has no fields, and a record result has no field values. For the full object, use [`GET /v1/record/{record_id}`](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record) or [`GET /v1/app/{app_id}`](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app).

## Authentication and permissions

Both endpoints need a credential that belongs to a user: a [user API key](https://developers.tapeapp.com/docs/api/authentication#user-api-key), a [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens) or an [OAuth access token](https://developers.tapeapp.com/docs/api/authentication#oauth-access-token). An automation API key returns a `400`:

*Response*

```json
{
  "status_code": 400,
  "endpoint": "/v1/search",
  "error_code": "validation",
  "error_message": "Invalid API key for accessing endpoint '/v1/search' (this endpoint can only be accessed with a user API key)"
}
```

Every search uses the permissions of the user behind the credential, and an automation API key has no user. Organization guests get a `401`.

Tape filters results by permission on every request, for records *and* apps. Two credentials of two users can return different results, and a different number of results, for the same query. Search never shows anything you can't open in Tape.

> Missing app or record results?
> 
> A [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens) or an OAuth access token can search with *either* the `apps:read` or the `records:read` [capability](https://developers.tapeapp.com/docs/api/capabilities). You don't need both.
> 
> -   A token with only one of them gets a `200` with only the result type it may see. With `records:read` alone, you get record results and no app results, even if `types` asks for both.
> -   A token with neither gets a `403`.
> -   A personal access token restricted to selected workspaces and apps gets a `200` with only the results inside its [content access](https://developers.tapeapp.com/docs/api/personal-access-tokens#content-selection).
> 
> A user API key has neither restriction. It gets both result types across everything its owner can see.

### Rate limit credits

The [base request cost](https://developers.tapeapp.com/docs/api/request-limits) is 10 credits. A search costs 50 credits (5× base) with either endpoint. On the standard budget of 2,000 credits per minute, that's about 40 searches per minute.

| Endpoint | Credits |
| --- | --- |
| [`GET /v1/search`](#search) | 50 (5× base) |
| [`POST /v1/search`](#search-with-a-filter) | 50 (5× base) |

Every page costs another 50 credits. Prefer a large `limit` over many small pages.

## The search result object

Every response has the same two keys:

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `results` | `array` | The matches, in the requested order. Empty when nothing matched. | `[{ "type": "app", "app": { … } }]` |
| `cursor` | `string` | `null` | Send it back to get the next page. `null` means this was the last page. | `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."` |

There is *no `total`*, because counting matches would double the cost of every search. Page until `cursor` is `null`.

Each entry in `results` has exactly two keys: `type`, and a payload named after it. Check `type` to know which payload you have.

| `type` | Payload key | Payload |
| --- | --- | --- |
| `"app"` | `app` | An app preview, including the name of the workspace it lives in. |
| `"record"` | `record` | A record preview, without its field values. |

Apps and records come in *one* `results` array, mixed by relevance, not in separate lists. To get only one kind, narrow the search with `types`: [`?types=record`](#search) on `GET`, or [`filter.types`](#search-with-a-filter) on `POST`.

### App results

The `app` payload is the same as an entry from [`GET /v1/app`](https://developers.tapeapp.com/docs/api/resource/app#retrieve-all-available-apps), including `workspace_name`.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `app_id` | `integer` | The app ID. | `4821` |
| `workspace_id` | `integer` | The workspace the app lives in. | `913` |
| `workspace_name` | `string` | The workspace's name. Empty string if the workspace is being deleted. | `"Sales"` |
| `slug` | `string` | The app's URL slug. | `"customer-onboarding"` |
| `external_id` | `string` | *Deprecated.* Identical to `slug`. | `"customer-onboarding"` |
| `name` | `string` | The app's name. | `"Customer Onboarding"` |
| `record_name` | `string` | Singular noun for one of the app's records, for example `Project`. | `"Onboarding"` |
| `item_name` | `string` | *Deprecated.* Identical to `record_name`. | `"Onboarding"` |
| `type` | `string` | One of `database`, `dashboard`, `form`. Legacy apps without a type report `database`. | `"database"` |
| `description` | `string` | Optional. Missing when the app has no description. | `"Every new customer, start to finish"` |
| `position` | `number` | The app's position within its workspace. Fractional: Tape reorders apps by inserting between neighbors, so expect values like `107.125125118059`. | `3` |
| `config` | `object` | Legacy-compatible copy of `name`, `item_name` and `description`. | `{ "name": "Customer Onboarding", … }` |

### Record results

The `record` payload is the same as a record preview from [`GET /v1/record/field/{field_id}/find`](https://developers.tapeapp.com/docs/api/resource/record#find-relatable-records-for-a-relation-field).

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `record_id` | `integer` | The global record ID. Use it to fetch the record. | `170471696` |
| `app_record_id` | `integer` | The record's running number within its database app. | `42` |
| `record_url` | `string` | Link to the record in Tape. | `"https://tapeapp.com/acme/record/170471696"` |
| `app_id` | `integer` | The database app the record belongs to. | `4821` |
| `app` | `object` | Preview of the database app, including its `workspace`. | `{ "app_id": 4821, "name": "Customer Onboarding", … }` |
| `title` | `string` | The record's computed title. May be missing. | `"Acme Corp onboarding"` |
| `created_on` | `string` | `YYYY-MM-DD HH:mm:ss`, in your timezone. | `"2026-08-03 09:14:22"` |
| `created_on_utc` | `string` | The same moment as `created_on`, in UTC. | `"2026-08-03 07:14:22"` |
| `deleted_on` | `string` | Only for a record in the trash. In your timezone. | `"2026-08-12 10:00:00"` |
| `deleted_on_utc` | `string` | The same moment as `deleted_on`, in UTC. | `"2026-08-12 08:00:00"` |
| `created_by` | `object` | `null` | The user or automation that created the record. | `{ "type": "user", "user_id": 5501, … }` |
| `current_revision` | `object` | `null` | The record's latest revision. | `{ "type": "update", "revision": 7, … }` |
| `initial_revision` | `object` | `null` | The record's first revision. | `{ "type": "creation", "revision": 0, … }` |

A record preview has no `fields`, `last_modified_on`, `last_modified_by` or `comment_count`. Fetch the record itself if you need them.

## Search

Use this endpoint to search all apps and records you can see.

`GET https://api.tapeapp.com/v1/search`

*Request*

```shell
curl -G https://api.tapeapp.com/v1/search \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  --data-urlencode "text=onboarding" \
  --data-urlencode "limit=20"
```

*Response*

```json
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
        "created_on_utc": "2026-08-03 07:14:22",
        "created_by": {
          "id": 5501,
          "user_id": 5501,
          "org_id": 77,
          "type": "user",
          "mail": ["juliet@acme.com"],
          "email": "juliet@acme.com",
          "name": "Juliet Adams"
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
            "mail": ["juliet@acme.com"],
            "name": "Juliet Adams"
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
            "mail": ["juliet@acme.com"],
            "name": "Juliet Adams"
          }
        }
      }
    }
  ],
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Send `text` to start a search, or `cursor` to continue one.

The example returns one app and one record that match "onboarding". To get the next page, send the `cursor` back ([Pagination](#pagination)).

**General behavior**

-   Send exactly one of `text` or `cursor`. Neither returns a `400`. Both is accepted, but the cursor wins and Tape ignores `text`.
-   `types` is comma-separated (`?types=app,record`). The repeated form `?types=app&types=record` doesn't work. An unknown member returns a `400`; Tape doesn't drop it.
-   Narrowing `types` to one kind doesn't enlarge the page. A page still holds at most `limit` results, but the other kind no longer takes slots in it.
-   URL-encode `text`. An unencoded `&` or `=` cuts your query short without an error.
-   Records shared with you individually, in apps you can't open, match only if you set `search_shared_content` to `true`.

**Requirements:** `apps:read` or `records:read`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

See [Errors](#errors).

**Query parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | `string` | Yes\* | The text to search for. Between 1 and 100 characters, and must contain a searchable term. |
| `cursor` | `string` | Yes\* | Cursor from a previous response, to get the next page. Send it on its own. |
| `limit` | `integer` | No | Results per page. Between `1` and `100`. Defaults to `50`. |
| `types` | `string` | No | Comma-separated kinds to return: `app`, `record`, or `app,record`. Leave it out to get both. |
| `sort_by` | `string` | No | One of `ranking_score`, `created_on`, `last_modified_on`. Defaults to `ranking_score`. |
| `sort_desc` | `boolean` | No | Order descending. Defaults to `true`. See [Sorting](#sorting). |
| `search_shared_content` | `boolean` | No | Also search records shared with you individually (through a grant on the record or a permission rule that matches you) in apps you can't open. Defaults to `false`. Records you can already reach through an app come back once. |

\* Exactly one of `text` or `cursor` is required.

## Search with a filter

Use this endpoint to search with a filter for workspaces, apps, authors or time windows.

`POST https://api.tapeapp.com/v1/search`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/search?limit=20 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "text": "onboarding",
    "filter": {
      "types": ["record"],
      "workspace_ids": [913, 914],
      "last_modified_at_from": "2026-08-01 00:00:00"
    },
    "sort_by": "last_modified_on"
  }'
```

**JSON**

*Request*

```json
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

This is the same URL and the same search as [`GET /v1/search`](#search), sent as a JSON body. The request creates nothing, so it returns `200`, not `201`.

The example finds records that mention "onboarding" in two workspaces and changed after a fixed moment.

The response has the same shape as for [`GET /v1/search`](#search).

**General behavior**

-   The filter only restricts *which* apps and records count. It doesn't change *how* text matches.
-   Filter members combine with `AND`. Each member is optional. A member you leave out means no restriction.
-   The four date bounds are *absolute and independent*. Send only a `_from` for "since", only a `_to` for "until", or both for a closed window.
-   A `_from` later than its `_to` returns a `400`, not an empty result. So does a date that doesn't exist, such as `2026-02-30`.
-   Tape rejects unknown keys. `workspaceIds` instead of `workspace_ids` returns a `400`, so the API never accepts a filter it doesn't apply.
-   `limit` is the only query parameter. There is no `cursor` here. Continue a filtered search with [`GET /v1/search?cursor=…`](#pagination), because the cursor carries the filter.
-   Set `search_shared_content` to `true` to also find records shared with you individually.

**Requirements:** `apps:read` or `records:read`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

See [Errors](#errors).

**Body parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | `string` | Yes | The text to search for. Between 1 and 100 characters, and must contain a searchable term. |
| `filter` | `object` | No | Restrictions on which apps and records count. See below. |
| `sort_by` | `string` | No | One of `ranking_score`, `created_on`, `last_modified_on`. Defaults to `ranking_score`. |
| `sort_desc` | `boolean` | No | Order descending. Defaults to `true`. Must be a real JSON boolean, not a string. |
| `search_shared_content` | `boolean` | No | Also search records shared with you individually (through a grant on the record or a permission rule that matches you) in apps you can't open. Defaults to `false`. Records you can already reach through an app come back once. |

**`filter` object**

| Parameter | Type | Description |
| --- | --- | --- |
| `types` | `string[]` | Kinds to return: `["app"]`, `["record"]` or both. Must not be empty or contain duplicates. Leave it out to get both. |
| `workspace_ids` | `integer[]` | Only results in one of these workspaces. At most 100 IDs. |
| `app_ids` | `integer[]` | Only records of one of these apps, and only these apps themselves. At most 100 IDs. |
| `created_by_user_ids` | `integer[]` | Only results created by one of these users. At most 100 IDs. |
| `created_at_from` | `string` | Only results created at or after this moment. `YYYY-MM-DD HH:mm:ss`, in your timezone. |
| `created_at_to` | `string` | Only results created at or before this moment. `YYYY-MM-DD HH:mm:ss`, in your timezone. |
| `last_modified_at_from` | `string` | Only results last changed at or after this moment. `YYYY-MM-DD HH:mm:ss`, in your timezone. |
| `last_modified_at_to` | `string` | Only results last changed at or before this moment. `YYYY-MM-DD HH:mm:ss`, in your timezone. |
| `created_at_from_utc` | `string` | Same as `created_at_from`, read as UTC. Wins if you send both. |
| `created_at_to_utc` | `string` | Same as `created_at_to`, read as UTC. Wins if you send both. |
| `last_modified_at_from_utc` | `string` | Same as `last_modified_at_from`, read as UTC. Wins if you send both. |
| `last_modified_at_to_utc` | `string` | Same as `last_modified_at_to`, read as UTC. Wins if you send both. |

To find these IDs, see [Retrieve workspaces](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspaces), [Retrieve all available apps](https://developers.tapeapp.com/docs/api/resource/app#retrieve-all-available-apps) and [Retrieve organization users](https://developers.tapeapp.com/docs/api/resource/user#retrieve-organization-users).

The unsuffixed bounds use the timezone `created_on` is returned in, so you can send a value from a result straight back. See [Date & timezone](https://developers.tapeapp.com/docs/api/date-timezone).

**Query parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | `integer` | No | Results per page. Between `1` and `100`. Defaults to `50`. |

### Polling for changes

Use `last_modified_at_from` for an incremental sync. Send the time of your last successful poll to get only what changed since then.

*Request*

```json
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

> Which bound should a sync loop send?
> 
> Send `last_modified_at_from_utc`. A local time has no offset, so it's ambiguous when daylight saving time ends.

> Why do unchanged apps and records drop out?
> 
> An app or record nobody changed after creating it has no last-modified timestamp, so it drops out as soon as you set either bound. A sync built only on `last_modified_at_from` never sees new records nobody touched yet. Add a search with `created_at_from` over the same window, or start with a search without a filter.

## Pagination

Search uses *cursor pagination*, not `limit` and `offset`. To go through all results:

1.  Search with either endpoint. Read `results`.
2.  If `cursor` is `null`, you're done.
3.  Otherwise, call `GET /v1/search` with only that `cursor`, and read the next `results`.

*Request*

```shell
curl -G https://api.tapeapp.com/v1/search \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  --data-urlencode "cursor=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

A cursor is an opaque, signed token. It holds the whole search: text, filter, `search_shared_content`, sorting and page size. That means:

-   **Continue with `GET`,** also for a search you started with `POST`. `POST` takes no cursor, because a cursor leaves nothing for a body to add.
-   **Send the cursor alone.** Tape ignores `text`, `sort_by` or `sort_desc` sent with it. It also ignores `limit`: a continued search keeps the page size of the search that created the cursor, so all pages have the same size.
-   **Don't build, edit or store cursors.** They're signed and can expire. Hand them straight back to the API.

A page can have fewer entries than `limit` and still not be the last page. For example, Tape drops a record whose workspace is being deleted instead of failing the request. Trust `cursor`, not the length of `results`.

> Can a search stop before the last page?
> 
> No, there is no partial mode. Tape rejects a search it can't page with a `400` instead of returning a cut-off first page, so a page with `cursor: null` means you've seen everything. [What matches](#what-matches) lists the queries Tape rejects.

## Sorting

| `sort_by` | Orders by |
| --- | --- |
| `ranking_score` | Relevance, best match first. The default. |
| `created_on` | When the app or record was created. |
| `last_modified_on` | When the app or record was last changed. |

`sort_desc` defaults to `true`: best match first for `ranking_score`, newest first for the two timestamps. Send `false` to reverse the order. With `ranking_score`, that puts the *worst* matches first, which you rarely want.

Results with the same sort value are ordered by ID *descending*, whatever `sort_desc` says. This keeps paging stable.

The API doesn't return the ranking score. You see relevance only in the order of the array.

## What matches

Search runs over a text index for each app and each record, not over raw field values. So some behavior differs from a `contains` filter.

**Terms match as prefixes, and all terms must match.** Each word of the query matches from the start of an indexed word: `onboard` finds "onboarding", but `onboardings` doesn't. With several words, a result must match every word.

**Matching ignores case** and knows common stop words.

**More than titles is indexed.** For a record, the index covers text and multi-line text fields, calculations, email, phone, link, location, unique ID, number, category, status, date and relation values, *and its comments*. A record can match on a comment, even though the result shows no comment data. For an app, the index covers its name, description and blocks. The index cuts long values at 2,000 characters per field.

**`text` is required and must contain a searchable term**, with 1 to 100 characters. Text made only of punctuation or symbols, such as `"..."` or `"!!!"`, returns a `400`, not an empty result. To narrow by filter alone, search for a term you expect and add the filter.

> Does a short query return `400`?
> 
> Most organizations can search for any term of one character or more. In a few very large organizations, a query with fewer than four characters returns a `400` that names the minimum. It's an error, not an empty `200`, so you can tell "query too short" apart from "nothing matched".

Tape checks both rules only when a search *starts*. Continuing with a cursor doesn't check them again.

## Errors

Every input problem returns `400`. Common causes:

-   Neither `text` nor `cursor` on `GET /v1/search`.
-   `text` that is empty, longer than 100 characters, or has no searchable term.
-   `text` shorter than the minimum your organization enforces.
-   `limit` that isn't an integer, is above `100`, or is below `1`.
-   `sort_by` outside the three accepted values.
-   `sort_desc` that isn't boolean-like on `GET`, or not a real boolean on `POST`.
-   `types` with anything other than `app` or `record`, or an empty `types` list.
-   A date bound that is malformed, doesn't exist (`2026-02-30`), or a `_from` later than its `_to`.
-   A `POST` body that is missing `text`, isn't valid JSON, has an unknown key, or has an ID array with more than 100 entries.
-   An automation API key.

*Response*

```json
{
  "status_code": 400,
  "endpoint": "/v1/search",
  "error_code": "validation",
  "error_message": "A search must provide either the \"text\" or the \"cursor\" query parameter (none provided)"
}
```

For body schema errors on `POST /v1/search`, `error_code` is `input_validation`, and `error_message` names the path that failed.

Other errors:

-   A request without a credential, or from an organization guest, returns `401`.
-   A personal access token or OAuth access token with neither `apps:read` nor `records:read` returns `403`.
-   Too many searches return `429`. See [Rate limit credits](#rate-limit-credits).
-   A search never returns `404`. Anything you can't see is missing from `results`.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Known limitations

-   **Apps and records only.** Search doesn't return workspaces, users, files, comments, tasks, views or automations, even though comment text feeds the record index.
-   **No `total`.** Page until `cursor` is `null`.
-   **No relevance score and no highlights.** You can't tell *how* well a result matched, or *where*.
-   **No browsing without a search term.** Every request needs real text. A filter alone can't produce results.
-   **No relative date windows.** Date bounds are absolute timestamps you compute yourself.
-   **No search in a single field.** To match a specific field, use [`POST /v1/record/filter/app/{app_id}`](https://developers.tapeapp.com/docs/api/resource/record#retrieve-filtered-records-for-an-app).
-   **Previews only.** Search results have no field values.

## Next steps

[

Record

fetch the full record of a search result.

](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record)[

App

fetch the full app of a search result.

](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app)[

Filter

filter the records of one database app by field.

](https://developers.tapeapp.com/docs/api/resource/filter)[

Date & timezone

how the API reads date bounds and returns timestamps.

](https://developers.tapeapp.com/docs/api/date-timezone)[

Capabilities

what `apps:read` and `records:read` allow.

](https://developers.tapeapp.com/docs/api/capabilities)[

Request limits

how credits and rate limits work.

](https://developers.tapeapp.com/docs/api/request-limits)
