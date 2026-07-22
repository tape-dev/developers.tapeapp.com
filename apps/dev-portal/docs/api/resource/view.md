---
id: view
title: View
sidebar_label: View
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

A **view** is a saved way of looking at an app's records. Every view belongs to exactly one app and stores:

- a **layout** — `table`, `list` or `board`;
- an ordered list of **filters** — which records the view shows;
- a **sort** — one field and a direction, or none (which means the app's manual record order);
- per-**field** display settings — which fields are visible, and how wide the columns are;
- an optional **split by** — the field the view groups its records into sections by.

Every app has exactly one **default view**, which is what a user lands on when they open the app. Views created and managed through this API are always **public** — shared with everyone who can see the app.

The view resource exists so that an integration can **read a view's definition from one app and recreate it on another** — for example when migrating a workspace between organizations. See [Copy a view to another app](#copy-a-view-to-another-app) for that walkthrough.

This resource never returns records. To read the records of a view, use [`GET /v1/record/view/{view_id}`](record#retrieve-records-for-a-view) on the record resource. It also never returns computed data — no section lists, no per-section counts, no column totals. Only the view's _definition_.

:::caution `PUT` replaces `filters` and `fields` wholesale
An update **replaces** the `filters` array and the `fields` map entirely — it never merges them. Omitting a key preserves it, but sending one overwrites what was stored. This is the most likely way to lose data with this resource. Read [Update a view](#update-a-view) before you write.
:::

## Authentication and permissions

All view endpoints require a **user API key**, sent as a bearer token. Automation ("workflow") API keys are rejected with `401` (`App views can only be accessed with a user API key.`) — the view permission model depends on user identity.

Permissions are checked in two layers against the app the view belongs to:

- **Reading** a view requires **view access** to the app.
- **Creating, updating, deleting or promoting** a view requires **share access** to the app — one level above edit access. Being able to edit records is deliberately not enough to reconfigure how everyone in the app sees them.

Views carry no `created_at` / `last_modified_at` timestamps.

### Rate limit credits

The [base request cost](/docs/api/request-limits) is 10 credits. This resource charges:

| Endpoint                                                              | Credits          |
| --------------------------------------------------------------------- | ---------------- |
| [`GET /v1/app/{app_id}/views`](app#retrieve-views-for-an-app)         | 50 (5× base)     |
| [`GET /v1/view/{view_id}`](#retrieve-a-single-view)                    | 20 (2× base)     |
| [`POST /v1/view/app/{app_id}`](#create-a-view)                        | 50 (5× base)     |
| [`PUT /v1/view/{view_id}`](#update-a-view)                            | 50 (5× base)     |
| [`POST /v1/view/{view_id}/default`](#set-the-default-view)            | 50 (5× base)     |
| [`DELETE /v1/view/{view_id}`](#delete-a-view)                         | 50 (5× base)     |

## The view object

Two shapes exist. The **preview** is what the [list endpoint](app#retrieve-views-for-an-app) returns; the **detail** object extends it with the full definition and is what every other endpoint returns, wrapped in a `{ "view": … }` envelope.

### Preview

| Field        | Type                               | Notes                                                                     |
| ------------ | ---------------------------------- | ------------------------------------------------------------------------- |
| `id`         | number                             | The view id.                                                              |
| `view_id`    | number                             | Identical to `id`; present for consistency with the rest of the API.      |
| `name`       | string \| null                     | `null` for a view that has never been named.                              |
| `app_id`     | number                             | The app the view belongs to.                                              |
| `is_default` | boolean                            | Exactly one view per app is `true`.                                       |
| `layout`     | `"table"` \| `"list"` \| `"board"` | See [Field settings](#field-settings).                                    |
| `private`    | boolean                            | `false` for every view this API can create. See [Limitations](#known-limitations). |

### Detail

Everything in the preview, plus:

| Field       | Type           | Notes                                                                                        |
| ----------- | -------------- | -------------------------------------------------------------------------------------------- |
| `sort_by`   | number \| null | The `field_id` the view is sorted by. `null` means manual record order.                      |
| `sort_desc` | boolean        | `true` for descending. `false` when there is no sort.                                        |
| `filters`   | array          | The view's filters, flat and implicitly ANDed. See [Filters](#filters).                      |
| `fields`    | object         | Per-field display settings, keyed by `field_id`, for the view's current layout. See [Field settings](#field-settings). |
| `split_by`  | object \| null | The split-by definition, or `null`. See [Split by](#split-by).                               |

The `fields` object always contains an entry for **every** field of the app — including fields the view has no stored setting for, which are reported with their effective default. That completeness is what makes a `GET` → `PUT` round-trip faithful: a detail response can be sent straight back to [Update a view](#update-a-view) unchanged.

## Retrieve a single view

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/view/{view_id}" />

Retrieve a view with its full definition. Requires view access to the app it belongs to.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/view/88123 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title="⬅️      Response"
{
  "view": {
    "id": 88123,
    "view_id": 88123,
    "name": "Open tickets",
    "app_id": 4711,
    "is_default": false,
    "layout": "table",
    "private": false,
    "sort_by": 55204,
    "sort_desc": false,
    "filters": [
      {
        "field_id": 55203,
        "field_type": "status",
        "type": "status",
        "match_type": "any",
        "values": [{ "value": 9001 }, { "value": 9002 }]
      },
      {
        "field_id": 55201,
        "field_type": "single_text",
        "type": "text",
        "match_type": "contains",
        "values": [{ "value": "urgent" }]
      }
    ],
    "fields": {
      "55201": { "hidden": false, "width": 320 },
      "55203": { "hidden": false, "width": 160 },
      "55204": { "hidden": false },
      "55207": { "hidden": true }
    },
    "split_by": null
  }
}
```

- `width` appears only for `table` views, and only for fields that carry a stored width.
- Filter operands come back **normalised to ids** — a status or category filter written with option names comes back as `{ "value": <option_id> }`, and a relation filter as `{ "value": <record_id> }`.
- The response body is directly re-`PUT`-able — see [Update a view](#update-a-view).

## Create a view

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/view/app/{app_id}" />

Create a view on the app with the specified `app_id`. Requires share access to the app.

`name` and `layout` are **required**; everything else is optional. The created view is always public and is never the default view — [promote it](#set-the-default-view) afterwards if you need it to be.

| Key         | Required | Type                               | Constraint                                             |
| ----------- | -------- | ---------------------------------- | ------------------------------------------------------ |
| `name`      | ✅       | string                             | max **200** characters; empty string allowed           |
| `layout`    | ✅       | `"table"` \| `"list"` \| `"board"` | no default — you must send one                         |
| `filters`   | –        | array                              | max **100** entries; see [Filters](#filters)           |
| `sort_by`   | –        | number (`field_id`)                | must be a field of this app                            |
| `sort_desc` | –        | boolean                            | defaults to `false`; ignored without `sort_by`         |
| `fields`    | –        | object keyed by `field_id`         | `hidden` required per entry; see [Field settings](#field-settings) |
| `split_by`  | –        | object                             | see [Split by](#split-by)                              |

`null` is **not** accepted for any key on create — nullability is an update-only affordance, because on create there is nothing to clear. Any unknown or misspelled key is rejected with a `400`.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/view/app/4711 \\
  -u #USER_API_KEY: \\
  -H "Content-Type: application/json" \\
  --data '{
    "name": "Open tickets",
    "layout": "table",
    "sort_by": 55204,
    "sort_desc": false,
    "filters": [
      {
        "field_id": 55203,
        "field_type": "status",
        "type": "status",
        "match_type": "any",
        "values": [{ "value": 9001 }, { "value": 9002 }]
      }
    ],
    "fields": {
      "55201": { "hidden": false, "width": 320 },
      "55203": { "hidden": false, "width": 160 },
      "55207": { "hidden": true }
    },
    "split_by": { "field_id": 55203, "sorting": "label_asc", "limit": 25 }
  }'`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="➡️      Request"
{
  "name": "Open tickets",
  "layout": "table",
  "sort_by": 55204,
  "sort_desc": false,
  "filters": [
    {
      "field_id": 55203,
      "field_type": "status",
      "type": "status",
      "match_type": "any",
      "values": [{ "value": 9001 }, { "value": 9002 }]
    }
  ],
  "fields": {
    "55201": { "hidden": false, "width": 320 },
    "55203": { "hidden": false, "width": 160 },
    "55207": { "hidden": true }
  },
  "split_by": { "field_id": 55203, "sorting": "label_asc", "limit": 25 }
}
```

</TabItem>
</Tabs>

Responds `201` with the `{ "view": … }` envelope containing the full [detail object](#the-view-object).

## Update a view

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/view/{view_id}" />

Update a view. Every key is optional. Requires share access to the app.

**This is a partial update:**

| In the body                  | Effect                                                 |
| ---------------------------- | ------------------------------------------------------ |
| key **omitted**              | the stored value is **preserved**                      |
| key present with a **value** | the stored value is **replaced**                       |
| key present with **`null`**  | the stored value is **cleared** (two exceptions below) |

**Collections are replaced wholesale — never merged.**

- `filters`: sending an array replaces the entire filter list. There is no "add one filter" operation — to append, [retrieve the view](#retrieve-a-single-view), append to the array you got back, and `PUT` the whole array. `null` clears all filters.
- `fields`: sending the map replaces the display settings of the view's effective layout in full. Fields you leave out lose their stored settings and fall back to the layout's default visibility. `null` clears them all.

**Two exceptions to "`null` clears":**

1. **`name: null` preserves — it does not clear.** An unnamed view reports `name: null` on read, so `null` must be accepted for a read body to be `PUT`-able verbatim; there is no "remove the name" operation, so `null` (and `""` on update) is treated as "leave it alone".
2. **`width` is ignored on non-`table` layouts** — tolerated rather than rejected, so a client that reads a `table` view, switches `layout` to `"list"` and puts the body back is not forced to strip `width` from every entry.

**Read-only keys are accepted and ignored.** So that a detail response can be `PUT` back verbatim, the update body also tolerates `id`, `view_id`, `app_id`, `is_default`, `private` and `sort_property`. None of them has any effect.

:::caution `is_default: true` in a `PUT` body does nothing
Promotion is a separate endpoint ([`POST /v1/view/{view_id}/default`](#set-the-default-view)). Setting `is_default` in an update body is silently ignored, not honoured.
:::

**The effective layout.** `fields` is interpreted against `layout ?? the view's current layout`. If you change `layout` and send `fields` in the same request, the map is written to the **new** layout's settings; the other two layouts' settings are preserved untouched. Switching a view's layout back and forth never destroys the settings of the layout you left.

Beyond the keys this API exposes, a `PUT` reads back and re-writes everything else a view stores — column footer statistics, board lanes and grouping, card-preview settings, and the settings of the layouts the view is not currently in — so an update that only renames a view leaves all of it intact. (The one exception is split-by drill-down filters; see [Limitations](#known-limitations).)

**Rename only** — everything else is preserved:

```json title="➡️      Request"
{ "name": "Open tickets — EMEA" }
```

**Replace the filters and clear the sort:**

```json title="➡️      Request"
{
  "filters": [
    {
      "field_id": 55201,
      "field_type": "single_text",
      "type": "text",
      "match_type": "starts_with",
      "values": [{ "value": "EMEA" }]
    }
  ],
  "sort_by": null
}
```

**Switch layout and give the list layout its own field settings:**

```json title="➡️      Request"
{
  "layout": "list",
  "fields": {
    "55201": { "hidden": false },
    "55203": { "hidden": false },
    "55207": { "hidden": true }
  }
}
```

Responds `200` with the `{ "view": … }` envelope, post-update, so a client can immediately re-`PUT` it.

`sort_desc` on its own flips the direction of the view's existing sort without changing the sort field. Sending `sort_by` without `sort_desc` resets the direction to ascending, because `sort_by` replaces the whole sort.

## Set the default view

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/view/{view_id}/default" />

Promote a view to be its app's default view. Takes **no request body**. Requires share access to the app.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X POST #BASE_URL/v1/view/88123/default \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

Responds `200` with the `{ "view": … }` envelope, with `is_default: true`. The app's previous default view is demoted in the same operation, so the app always has exactly one default view.

- There is no way to _un_-default a view; you can only promote a different one.
- Promoting a view that is already the default is a no-op and still returns `200`.

## Delete a view

<EndpointBadge method="DELETE" url="https://api.tapeapp.com/v1/view/{view_id}" />

Delete a view. Requires share access to the app.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl -X DELETE #BASE_URL/v1/view/88123 \\
  -u #USER_API_KEY:`}
</ContextCodeBlock>

```json title="⬅️      Response"
{ "view_id": 88123 }
```

The view is soft-deleted: afterwards every endpoint reports it as `404`. Records are never affected — deleting a view removes only the saved way of looking at them.

:::caution Do not delete an app's default view
Promote another view to default **first**, then delete. Deleting the view that is currently the default can leave the app with no default view, after which [promoting a view](#set-the-default-view) fails. Every app keeps exactly one default view; this endpoint does not enforce it for you.
:::

## Filters

A view's filters are a **flat array**, implicitly **ANDed**. There is no `OR`, and no grouping or nesting. If a record must match two conditions, put two entries in the array; a view cannot express "either of two".

Array order is the filter order; there is no `position` key on the wire. A view holds **at most 100 filters**.

**A view filter is exactly the filter object documented for [`POST /v1/record/filter/app/{app_id}`](filter)** — the same union, the same `match_type` vocabulary, the same operand keys. Anything you can write as a record filter you can write as a view filter, unchanged. See the [filter reference](filter) for every field type and its supported match types.

Every filter entry carries at least a `field_id`, a `field_type`, a `type` discriminator and a `match_type`:

```json
{
  "field_id": 55201,
  "field_type": "single_text",
  "type": "text",
  "match_type": "contains",
  "values": [{ "value": "urgent" }]
}
```

- `field_id`, `field_type` and `match_type` are **required**; `type` is required in practice (omitting it is a `400`).
- `values` is the operand list; its shape depends on the field type, and it is omitted for `empty` / `not_empty`.
- Only **field filters** are accepted. The record endpoint's metadata filters (`created_at` / `last_modified_at` / `app_record_id`) are not part of a view's stored filters.

Two view-specific facts:

- **`include_active_user` ("@me")** resolves to the owner of the API key you authenticate with, so a view saved with it is dynamic per viewer — exactly as in the app:

  ```json
  {
    "field_id": 55208,
    "field_type": "single_user",
    "type": "contact",
    "match_type": "equal",
    "include_active_user": true
  }
  ```

- A relative-date or checklist filter uses the same operand keys as the record filter reference:

  ```json
  {
    "field_id": 55204,
    "field_type": "single_date",
    "type": "date",
    "match_type": "within",
    "relative_date_range_type": "next_week"
  }
  ```

## Field settings

`fields` is a JSON object keyed by `field_id` (a string, because JSON object keys are strings) whose values are `{ "hidden": boolean, "width"?: number }`.

**It applies to one layout at a time.** A view stores display settings separately for each of its three layouts, and `fields` always addresses the view's current layout (or, on a write that also changes `layout`, the new one). The other two layouts' settings are preserved untouched — switching a view from `table` to `list` and back restores the original column widths and visibility.

**`hidden` is required on every entry you write.** Even though it is optional in the response shape, the request requires it. The underlying default means _visible_ on `table` and _hidden_ on `list` / `board`, so an entry like `{ "55201": { "width": 200 } }` on a list view would silently hide that field. Requiring `hidden` makes visibility always explicit. (A `GET` → `PUT` round-trip never trips this, because the read emits `hidden` for every field.)

**`width` is meaningful only for `table`.** It is in pixels and must be between **100** and **1500**. On `list` and `board` it is never returned, and on write it is accepted and ignored rather than rejected.

Defaults for fields you do not configure — which is what a `GET` reports for them:

| Layout          | A field with no stored setting is…                                             |
| --------------- | ------------------------------------------------------------------------------ |
| `table`         | **visible** (`hidden: false`) — every field                                    |
| `list`, `board` | **visible** for the app's first field (its title field), hidden for all others |

Every `field_id` you name must belong to the app the view is on; a foreign or unknown id is a `400`. Field order is not expressible through `fields` — the map is unordered, and stored ordering follows the app's own field order.

## Split by

`split_by` is how a view groups its records into sections. This API exposes the **definition only** — the sections themselves, their record counts and any per-section totals are never returned.

| Key        | Type                                                             | Notes                                                          |
| ---------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| `field_id` | number — **required**                                            | the field to split by; must belong to the view's app          |
| `period`   | `day` \| `weekday` \| `week` \| `month` \| `year` \| null        | bucket granularity; only meaningful for date-valued fields    |
| `sorting`  | `label_asc` \| `label_desc` \| `value_asc` \| `value_desc` \| null | section order                                                |
| `limit`    | number ≥ 1, or null                                              | maximum number of sections                                     |

A view can be split by a field of type `single_category`, `multi_category`, `status`, `single_user`, `multi_user`, `single_relation`, `multi_relation`, `single_date`, `range_date`, `created_on`, `last_modified_on` or `calculation`. Any other field type is a `400` (`Invalid split_by field: a field of type '…' cannot be split by`).

- On update, `"split_by": null` **removes** the split-by; omitting the key preserves it.
- `sorting` is auto-filled with `label_asc` for `single_category`, `multi_category` and `status` fields, so a `GET` can report a `sorting` you never sent.

## Errors

All errors use the API's standard [error envelope](/docs/api/errors).

**`404 Not Found`.** Anything the caller cannot see is reported as _not found_, with one message shape regardless of cause: the view id does not exist; the view was deleted; the view is private to another user; the caller has no view access to the app; or (on create) the app id does not exist or is not visible to the caller. This is deliberate — a `403` would confirm that an id exists, leaking the existence of other users' private views. Treat `404` as "not found _or_ not yours", not as "the id is wrong".

**`403 Forbidden`** means the caller **can** see the view (or the app) but lacks **share access** for the write they attempted — "you can see it, but you may not change it".

**`401 Unauthorized`** — no key, an invalid key, or an automation API key. Views require a user API key.

**`400 Bad Request`** — the request body is not acceptable. Common causes:

- an unknown or misspelled key anywhere in the body (both request schemas are strict);
- `name` longer than 200 characters, or (on create) a missing `name` or `layout`;
- `layout` not one of `table` / `list` / `board`;
- more than 100 `filters`, or a filter missing `type` or using a `match_type` the field type does not support;
- a `fields` key that is not a plain non-negative integer, a `fields` entry without `hidden`, or a `width` outside 100–1500;
- `split_by` without `field_id`, a `limit` below 1, or a split-by field whose type cannot be split by;
- an unknown `period`, `sorting`, `field_type` or `match_type`;
- a `field_id` (in `filters`, `sort_by`, `fields` or `split_by`) that belongs to a different app;
- `null` for any key on create;
- the app already holds the maximum of **2000** views.

**`429 Too Many Requests`** — the [credit budget](/docs/api/request-limits) is exhausted.

## Known limitations

Each of these is a deliberate v1 boundary:

1. **Checklist sort sub-mode is not exposed.** A view sorted by a checklist field also stores _which_ aspect of the checklist it sorts on (status, title, assignee or due date). This API neither reports nor accepts it, so a `GET` → `PUT` of a checklist-sorted view resets that sub-mode. The `sort_property` key is reserved for a future release and is accepted-and-ignored today. Avoid round-tripping checklist-sorted views until it ships.
2. **Public views only.** Every view this API creates is public. Your _own_ private views are readable and writable by id and report `"private": true`; other users' private views are `404`; private views never appear in the list endpoint.
3. **No gallery layout.** `layout` is `table`, `list` or `board`. The legacy gallery layout has no public value and a view still using it cannot be read through this API.
4. **Column statistics and board configuration are preserved but not editable.** Column footer statistics, board lanes, the board grouping field, the board card-preview field and the "show progress" setting all survive every update untouched, but there is no way to read or set them here.
5. **Split-by drill-down filters are dropped by any update.** When a user clicks into a section of a split view, the app writes temporary filters derived from the split-by. Those are never reported by `GET`, and any `PUT` removes them — the app regenerates them from the split-by, so nothing a user configured is lost.
6. **No timestamps.** Views have no creation or modification metadata.
7. **No ordering control.** The list endpoint returns views in no guaranteed order, and there is no endpoint to reorder an app's views.

## Copy a view to another app

Recreating a view on a different app — the core migration use case — is a read-then-create sequence. Views reference apps, fields, options, users and records by **id**, and ids are never portable across organizations, so you need a mapping from source ids to target ids for all of them first.

1. [List the source app's views](app#retrieve-views-for-an-app): `GET /v1/app/{source_app_id}/views`.
2. For each one, [retrieve the full definition](#retrieve-a-single-view): `GET /v1/view/{view_id}`.
3. Rewrite the body against the target app:
   - `sort_by` → the target field id (or drop it);
   - every `filters[].field_id` → the target field id, **and every operand in `values`** — option ids, user ids and record ids all need remapping;
   - the keys of `fields` → target field ids;
   - `split_by.field_id` → the target field id;
   - drop `id`, `view_id`, `app_id`, `is_default` and `private` (a `PUT` tolerates them, but `POST` rejects them).
4. [Create the view](#create-a-view) on the target app: `POST /v1/view/app/{target_app_id}` with `name`, `layout` and the rewritten fields.
5. If the source view was the app's default (`is_default: true`), [promote the new view](#set-the-default-view) — it cannot be set in the create body.

Two things to plan for: the target app must be one where you hold **share access**, not just edit access; and each app allows at most **2000** views, which a repeated or retried bulk migration can reach.

What does **not** carry over, and must be replayed by hand: the default-view flag (replay with the promote endpoint), private views (invisible in the source listing), the checklist sort sub-mode, column statistics and board configuration, gallery-layout views (not readable), and field _order_ within a layout (inherited from the target app's own field order).
