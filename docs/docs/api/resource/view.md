# View

> Use these endpoints to read, create, update, promote and delete the views of an app.

Use these endpoints to read, create, update, promote and delete the views of an app.

A *view* is a saved way of looking at the records of a database app. Every view belongs to exactly one app and stores:

-   a *layout* (`table`, `list` or `board`) and its layout-specific *display configuration*, such as table row height, board grouping and card preview;
-   an ordered list of *filters*: which records the view shows;
-   a *sort*: one field and a direction, or none, which means the manual record order of the app;
-   per-*field* display settings: which fields are visible and how wide the columns are;
-   an optional *split by*: the field the view groups its records into sections by;
-   how it renders *progress bars* (`show_progress`).

Every app has exactly one *default view*, the one users land on when they open the app. Views you create through this API are *public*: everyone who can see the app can see them.

A common use is to read a view in one app and recreate it in another, for example when you migrate a workspace between organizations. See [Copy a view to another app](#copy-a-view-to-another-app).

This resource returns no records and no computed data, such as sections, counts per section or column totals. To read the records of a view, use [`GET /v1/record/view/{view_id}`](https://developers.tapeapp.com/docs/api/resource/record#retrieve-records-for-a-view).

To find a view ID, see [Retrieve views for an app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-views-for-an-app), which lists the public views of an app. In Tape, open the view: its ID is the number after `/views/` in the address.

> Which capability do I need?
> 
> Reading a view needs `apps:read`. Creating, updating, promoting and deleting a view need `apps:edit`. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).

> Changing `filters` or `fields` with `PUT`?
> 
> An update *replaces* the `filters` array and the `fields` map and never merges them. A key you leave out keeps its stored value. Read [Update a view](#update-a-view) before you write.

## Authentication and permissions

The five `/v1/view/...` endpoints need a credential that acts on behalf of a user: a [user API key](https://developers.tapeapp.com/docs/api/authentication#user-api-key), a [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens) or an [OAuth access token](https://developers.tapeapp.com/docs/api/oauth/overview). Send it as a bearer token. Permissions depend on that user.

An automation API key returns `401` with the message `App views can only be accessed with a user API key.` The message names only the user API key, but a personal access token or an OAuth access token works too.

The list endpoint on the app resource is the one exception. It also accepts an automation API key, subject to view access.

Tape checks permissions in two layers against the app the view belongs to:

-   **Reading** a view needs *view access* to the app.
-   **Creating, updating, deleting or promoting** a view needs *share access* to the app (**Can share** or **Full access**), one level above edit access. Edit access to records is not enough to change how everyone in the app sees them.

### Rate limit credits

The [base request cost](https://developers.tapeapp.com/docs/api/request-limits) is 10 credits. This resource charges:

| Endpoint | Credits |
| --- | --- |
| `GET /v1/app/{app_id}/views` | 50 (5× base) |
| [`GET /v1/view/{view_id}`](#retrieve-a-single-view) | 20 (2× base) |
| [`POST /v1/view/app/{app_id}`](#create-a-view) | 50 (5× base) |
| [`PUT /v1/view/{view_id}`](#update-a-view) | 50 (5× base) |
| [`POST /v1/view/{view_id}/default`](#set-the-default-view) | 50 (5× base) |
| [`DELETE /v1/view/{view_id}`](#delete-a-view) | 50 (5× base) |

## The view object

The list endpoint returns a *preview* of each view. Every other endpoint returns the *detail* object, which adds the full definition, inside a `{ "view": … }` envelope.

### Preview

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `id` | number | The view ID. | `88123` |
| `view_id` | number | Same as `id`. Present for consistency with the rest of the API. | `88123` |
| `name` | string | null | Name of the view. `null` for a view that was never named. | `"Open tickets"` |
| `app_id` | number | The app the view belongs to. | `4711` |
| `is_default` | boolean | Exactly one view per app is `true`. | `false` |
| `layout` | `"table"` | `"list"` | `"board"` | Layout of the view. See [Field settings](#field-settings). | `"table"` |
| `private` | boolean | `false` for every view this API can create. See [Limitations](#known-limitations). | `false` |

### Detail

Everything in the preview, plus:

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `sort_by` | number | null | The `field_id` the view is sorted by. `null` means manual record order. | `55204` |
| `sort_desc` | boolean | `true` for descending. `false` when there is no sort. | `false` |
| `filters` | array | The filters of the view, flat and combined with AND. See [Filters](#filters). | `[{ "field_id": 55203, … }]` |
| `fields` | object | Display settings per field, keyed by `field_id`, for the current layout of the view. See [Field settings](#field-settings). | `{ "55207": { "hidden": true } }` |
| `split_by` | object | null | The split-by definition, or `null`. See [Split by](#split-by). | `null` |
| `show_progress` | `"none"` | `"view"` | `"split_by"` | `"all"` | How the view renders progress bars. See [Display configuration](#display-configuration). | `"none"` |
| `table` | object | null | Display settings of the table layout, or `null` unless `layout` is `table`. See [Display configuration](#display-configuration). | `{ "row_height": "medium", "wrap_cells": false }` |
| `board` | object | null | Board grouping, card preview and display settings, or `null` unless `layout` is `board`. See [Display configuration](#display-configuration). | `null` |

The `fields` object contains an entry for *every* field of the app. Fields without a stored setting appear with their effective default. This makes a `GET` → `PUT` round trip faithful: you can send a detail response back to [Update a view](#update-a-view) unchanged.

## Retrieve a single view

Use this endpoint to read a view with its full definition.

`GET https://api.tapeapp.com/v1/view/{view_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/view/88123 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
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
    "split_by": null,
    "show_progress": "none",
    "table": { "row_height": "medium", "wrap_cells": false },
    "board": null
  }
}
```

**General behavior**

-   `width` appears only for `table` views, and only for fields with a stored width.
-   `table` is present only for `table` views, and `board` only for `board` views. The other one is `null`.
-   Filter operands come back *normalized to IDs*. A status or category filter written with option names comes back as `{ "value": <option_id> }`. A relation filter comes back as `{ "value": <record_id> }`.

**Requirements:** `apps:read`, and view access to the app. Works with a personal access token, an OAuth access token or a user API key.

## Create a view

Use this endpoint to add a view to an app.

`POST https://api.tapeapp.com/v1/view/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/view/app/4711 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
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
  }'
```

**JSON**

*Request*

```json
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

Send `name` and `layout`. Everything else is optional. The new view is never the default view until you [promote it](#set-the-default-view).

The response is `201` with the `{ "view": … }` envelope and the full [detail object](#the-view-object).

**General behavior**

-   `null` is *not* accepted for any key on create. Only an update can clear a value, because on create there is nothing to clear.
-   An unknown or misspelled key returns `400`.

**Requirements:** `apps:edit`, and share access to the app. Works with a personal access token, an OAuth access token or a user API key.

**Body parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Max 200 characters; empty string allowed. |
| `layout` | `"table"` | `"list"` | `"board"` | Yes | No default, send one. |
| `filters` | array | No | Max 100 entries; see [Filters](#filters). |
| `sort_by` | number (`field_id`) | No | Must be a field of this app. |
| `sort_desc` | boolean | No | Defaults to `false`; ignored without `sort_by`. |
| `fields` | object keyed by `field_id` | No | `hidden` required per entry; see [Field settings](#field-settings). |
| `split_by` | object | No | See [Split by](#split-by). |
| `show_progress` | `"none"` | `"view"` | `"split_by"` | `"all"` | No | Defaults to `none`; see [Display configuration](#display-configuration). |
| `table` | object | No | `table` layout only; see [Display configuration](#display-configuration). |
| `board` | object | No | `board` layout only; see [Display configuration](#display-configuration). |

## Update a view

Use this endpoint to change a view.

`PUT https://api.tapeapp.com/v1/view/{view_id}`

*Request*

```json
{ "name": "Open tickets — EMEA" }
```

Every key is optional. Send only what you want to change.

**Rename only.** Everything else stays:

**Replace the filters and clear the sort:**

*Request*

```json
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

**Switch the layout and give the list layout its own field settings:**

*Request*

```json
{
  "layout": "list",
  "fields": {
    "55201": { "hidden": false },
    "55203": { "hidden": false },
    "55207": { "hidden": true }
  }
}
```

The response is `200` with the `{ "view": … }` envelope after the update.

**This is a partial update:**

| In the body | Effect |
| --- | --- |
| key *omitted* | the stored value is *preserved* |
| key present with a *value* | the stored value is *replaced* |
| key present with `null` | the stored value is *cleared* (two exceptions below) |

**Collections are replaced in full, never merged.**

-   `filters`: an array replaces the entire filter list. There is no "add one filter" operation. To add a filter, [retrieve the view](#retrieve-a-single-view), add it to the array you got back, and send the whole array with `PUT`. `null` clears all filters.
-   `fields`: the map replaces the display settings of the effective layout of the view in full. Fields you leave out lose their stored settings and fall back to the default visibility of the layout. `null` clears them all.

**Two exceptions to "`null` clears":**

1.  **`name: null` preserves the name.** An unnamed view reads as `name: null`, so the update accepts `null` to keep a read body `PUT`\-able. There is no way to remove a name: `null` and `""` both mean "leave it alone".
2.  **`width` is ignored on layouts other than `table`.** It is tolerated, not rejected. A client that reads a `table` view, switches `layout` to `"list"` and sends the body back doesn't need to strip `width` from every entry.

**Read-only keys are accepted and ignored.** So that you can send a detail response back as is, the update body also tolerates `id`, `view_id`, `app_id`, `is_default`, `private` and `sort_property`. None of them has any effect.

> Sending `is_default: true` in a `PUT` body?
> 
> Tape ignores `is_default` in an update body without an error. Promotion is a separate endpoint ([`POST /v1/view/{view_id}/default`](#set-the-default-view)).

**General behavior**

-   **The effective layout.** If you change `layout` and send `fields` in the same request, the map goes to the *new* layout. The other layouts keep their settings. See [Field settings](#field-settings).
-   **Display config.** You can replace `show_progress` but never clear it. `table` and `board` each replace their config in full when sent. Leaving them out, *or sending `null`*, keeps the stored config, so a detail `GET` with `table: null` or `board: null` round-trips unchanged. See [Display configuration](#display-configuration).
-   **Settings the API doesn't expose stay intact:** column footer statistics, the *lane customization* of a board, and the settings of the layouts the view is not in. The one exception is split-by drill-down filters (see [Limitations](#known-limitations)).
-   **Sort direction.** `sort_desc` on its own flips the direction of the existing sort and keeps the sort field. `sort_by` without `sort_desc` resets the direction to ascending, because `sort_by` replaces the whole sort.

**Requirements:** `apps:edit`, and share access to the app. Works with a personal access token, an OAuth access token or a user API key.

## Set the default view

Use this endpoint to make a view the default view of its app.

`POST https://api.tapeapp.com/v1/view/{view_id}/default`

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/view/88123/default \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

The request takes *no body*.

The response is `200` with the `{ "view": … }` envelope and `is_default: true`. The previous default view of the app loses its default flag in the same operation, so the app keeps exactly one default view.

**General behavior**

-   You can't remove the default flag from a view. You can only promote a different one.
-   Promoting a view that is already the default changes nothing and returns `200`.

**Requirements:** `apps:edit`, and share access to the app. Works with a personal access token, an OAuth access token or a user API key.

## Delete a view

Use this endpoint to delete a view.

`DELETE https://api.tapeapp.com/v1/view/{view_id}`

*Request*

```shell
curl -X DELETE https://api.tapeapp.com/v1/view/88123 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{ "view_id": 88123 }
```

The view is soft-deleted, and every endpoint returns `404` for it afterwards. Records are never affected.

**Requirements:** `apps:edit`, and share access to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

Deleting the current default view of an app returns `400` with the message `The default view of an app cannot be deleted. Set another view as the default first.` [Promote another view](#set-the-default-view) first, then delete it.

## Filters

The filters of a view are a *flat array*, combined with `AND`, with no `OR`, grouping or nesting. The array order is the filter order (there is no `position` key). A view holds *at most 100 filters*.

**A view filter is the same filter object as in `POST /v1/record/filter/app/{app_id}`**, with the same `match_type` values and operand keys. The [filter reference](https://developers.tapeapp.com/docs/api/resource/filter) lists every field type and its match types.

Every filter entry has at least a `field_id`, a `field_type`, a `type` discriminator and a `match_type`:

```json
{
  "field_id": 55201,
  "field_type": "single_text",
  "type": "text",
  "match_type": "contains",
  "values": [{ "value": "urgent" }]
}
```

-   `field_id`, `field_type` and `match_type` are *required*. `type` is required in practice: leaving it out returns `400`.
-   `values` is the operand list. Its shape depends on the field type. Leave it out for `empty` and `not_empty`.
-   Only *field filters* are accepted. The metadata filters of the record endpoint (`created_at`, `last_modified_at`, `app_record_id`) are not part of the stored filters of a view.

Three facts apply to views only:

-   **References must resolve.** Tape *stores* view filters, so an operand that names something invalid returns `400` instead of matching nothing. This applies to a `single_relation` or `multi_relation` filter that names a record that doesn't exist (`Record(s) with ID … referenced by filters do not exist.`), and to a user filter (`single_user`, `multi_user`, `created_by`, `last_modified_by`, checklist `assignee`) that names a user outside your organization. Deactivated organization members are still valid operands.
    
-   **`include_active_user` ("@me")** resolves to the owner of the credential you authenticate with. A view saved with it changes per viewer, as in the app:
    
    ```json
    {
      "field_id": 55208,
      "field_type": "single_user",
      "type": "contact",
      "match_type": "equal",
      "include_active_user": true
    }
    ```
    
-   A relative date filter or a checklist filter uses the same operand keys as in the record filter reference:
    
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

`fields` is a JSON object keyed by `field_id`. The key is a string, because JSON object keys are strings. Each value is `{ "hidden": boolean, "width"?: number }`.

**It applies to one layout at a time.** A view stores display settings separately for each layout. `fields` addresses the current layout, or the new one on a write that also changes `layout`. Switch from `table` to `list` and back, and the original column widths and visibility return.

**`hidden` is required on every entry you write**, though optional in the response. The default means *visible* on `table` and *hidden* on `list` and `board`, so an entry like `{ "55201": { "width": 200 } }` on a list view would silently hide that field. A `GET` → `PUT` round trip is safe, because the read returns `hidden` for every field.

**`width` matters only for `table`.** It is in pixels and must be between 100 and 1500. On `list` and `board`, it is never returned. On write, it is accepted and ignored there, not rejected.

Defaults for fields you don't configure, which is what a `GET` reports for them:

| Layout | A field with no stored setting is… |
| --- | --- |
| `table` | *visible* (`hidden: false`), every field |
| `list`, `board` | *visible* for the first field of the app (its title field), hidden for all others |

Every `field_id` you name must belong to the app of the view, otherwise the response is `400`. You can't set the field order: it follows the field order of the app.

## Split by

`split_by` defines how a view groups its records into sections. The API exposes only this definition, never the sections.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `field_id` | number | The field to split by. **Required.** Must belong to the app of the view. | `55203` |
| `period` | `day` | `weekday` | `week` | `month` | `year` | null | Bucket size. Only meaningful for date fields. | `"month"` |
| `sorting` | `label_asc` | `label_desc` | `value_asc` | `value_desc` | null | Section order. | `"label_asc"` |
| `limit` | number 1–100, or null | Maximum number of sections (capped at 100). | `25` |

You can split a view by a field of type `single_category`, `multi_category`, `status`, `single_user`, `multi_user`, `single_relation`, `multi_relation`, `single_date`, `range_date`, `created_on`, `last_modified_on` or `calculation`. Any other field type returns `400` (`Invalid split_by field: a field of type '…' cannot be split by`).

-   On update, `"split_by": null` *removes* the split-by. Leaving out the key preserves it.
-   Tape fills in `sorting` with `label_asc` for `single_category`, `multi_category` and `status` fields, so a `GET` can report a `sorting` you never sent.
-   A `GET` can also report a `period` you never sent, for example `month` for a split by a relation field.

## Display configuration

`show_progress` applies to every layout. `table` and `board` are layout-specific: a view in another layout reports them as `null`. Each config is *replaced in full* on write.

### `show_progress`

How the view renders progress bars:

| Value | Meaning |
| --- | --- |
| `none` | No progress bars (the default on create). |
| `view` | One progress bar for the whole view. |
| `split_by` | One progress bar per split-by section. |
| `all` | Both. |

### `table` (table views only)

Accepted on create and update *only* when the effective layout is `table`, otherwise the response is `400 'table' settings are only valid on a 'table' view.` When you send the object, both fields are required.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `row_height` | `"short"` | `"medium"` | `"tall"` | `"extra_tall"` | Row height. | `"medium"` |
| `wrap_cells` | boolean | Wrap cell content onto several lines instead of cutting it off. | `true` |

*table config*

```json
{ "row_height": "medium", "wrap_cells": true }
```

### `board` (board views only)

Accepted on create and update *only* when the effective layout is `board`, otherwise the response is `400 'board' settings are only valid on a 'board' view.` When you send the object, all seven fields are required.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `group_by_field_id` | number | null | The field the board groups into lanes by. Must be a `status` or `single_category` field of the app, or `null` for a board without groups. | `55203` |
| `card_preview_field_id` | number | null | The field shown as the preview image of each card. Must be a `single_attachment`, `multi_attachment` or `multi_image` field of the app, or `null` for no preview. | `55210` |
| `card_size` | `"small"` | `"medium"` | `"large"` | Card size. | `"medium"` |
| `large_text` | boolean | Show card text in the larger size. | `false` |
| `hide_empty_columns` | boolean | Hide lanes without records. | `true` |
| `color_columns` | boolean | Tint each lane with the color of its group-by option. | `true` |
| `fit_preview_image` | boolean | Scale the preview image to fill the card instead of fitting inside it. | `false` |

A `group_by_field_id` of the wrong type returns `400 Invalid board group_by field: a field of type '…' cannot group a board`. A `card_preview_field_id` of the wrong type returns `400 Invalid board card_preview field: a field of type '…' cannot be a card preview`.

*board config*

```json
{
  "group_by_field_id": 55203,
  "card_preview_field_id": 55210,
  "card_size": "medium",
  "large_text": false,
  "hide_empty_columns": true,
  "color_columns": true,
  "fit_preview_image": false
}
```

## Errors

All errors use the standard [error envelope](https://developers.tapeapp.com/docs/api/errors) of the API.

-   Anything you can't see returns `404`, with one message shape whatever the cause: the view ID doesn't exist, the view was deleted, the view is private to another user, you have no view access to the app, or (on create) the app ID doesn't exist or isn't visible to you. A `403` would confirm that an ID exists, so read `404` as "not found *or* not yours".
-   A write to a view or app you can see, but without *share access*, returns `403`.
-   A request without a credential, with an invalid one or with an automation API key returns `401`. See [Authentication and permissions](#authentication-and-permissions).
-   A used-up credit budget returns `429`. See [Rate limit credits](#rate-limit-credits).

A request body that isn't acceptable returns `400`. Common causes:

-   an unknown or misspelled key anywhere in the body (both request schemas are strict);
-   `name` longer than 200 characters, or (on create) a missing `name` or `layout`;
-   `layout` not one of `table`, `list` or `board`;
-   more than 100 `filters`, or a filter without `type` or with a `match_type` the field type doesn't support;
-   a `fields` key that is not a plain non-negative integer, a `fields` entry without `hidden`, or a `width` outside 100–1500;
-   `split_by` without `field_id`, a `limit` outside 1–100, or a split-by field whose type can't be split by;
-   an unknown `period`, `sorting`, `field_type`, `match_type`, `show_progress`, `row_height` or `card_size` value, or a `table` or `board` config without a required field;
-   a `field_id` (in `filters`, `sort_by`, `fields`, `split_by`, or a board `group_by_field_id` or `card_preview_field_id`) that belongs to a different app;
-   a `table` config on a view that is not a `table` view, or a `board` config on a view that is not a `board` view;
-   a board `group_by_field_id` that is not a `status` or `single_category` field, or a `card_preview_field_id` that is not a `single_attachment`, `multi_attachment` or `multi_image` field;
-   a relation filter that names a record that doesn't exist, or a user filter that names a user outside your organization;
-   `null` for any key on create;
-   the app already holds the maximum of 2000 views;
-   deleting the current *default* view of the app (`The default view of an app cannot be deleted.`).

## Known limitations

Each of these is a deliberate boundary of version 1:

1.  **The checklist sort mode is not exposed.** A view sorted by a checklist field also stores *which* part it sorts by (status, title, assignee or due date), and a `GET` → `PUT` resets that mode. The `sort_property` key is reserved for a future release and is accepted and ignored today. Don't round-trip views sorted by a checklist until it ships.
2.  **Public views only.** Every view this API creates is public. Your *own* private views are readable and writable by ID and report `"private": true`. Private views of other users return `404`, and no private view appears in the list endpoint.
3.  **No gallery layout.** `layout` is `table`, `list` or `board`. The legacy gallery layout has no public value, and you can't read a view that still uses it through this API.
4.  **Board lane customization and column statistics are preserved but not exposed.** Every update keeps the custom lane order of a board and the column footer statistics of a table, but you can't read or set them here. The other display options are in [Display configuration](#display-configuration).
5.  **Any update drops split-by drill-down filters.** When a user clicks into a section of a split view, the app writes temporary filters derived from the split-by. `GET` never reports them, and any `PUT` removes them. The app creates them again from the split-by, so nothing a user set up is lost.
6.  **No timestamps.** Views have no creation or modification metadata.
7.  **No order control.** The list endpoint returns views in no guaranteed order. No endpoint changes the order of the views of an app.

## Copy a view to another app

To recreate a view on another app, read it and then create it. Views reference apps, fields, options, users and records by ID. IDs don't carry over between organizations, so first map every source ID to its target ID.

1.  List the views of the source app: `GET /v1/app/{source_app_id}/views`.
2.  For each view, [retrieve the full definition](#retrieve-a-single-view): `GET /v1/view/{view_id}`.
3.  Rewrite the body for the target app:
    -   `sort_by` → the target field ID, or drop it;
    -   every `filters[].field_id` → the target field ID, *and every operand in `values`*: option IDs, user IDs and record IDs all need a new mapping;
    -   the keys of `fields` → target field IDs;
    -   `split_by.field_id` → the target field ID;
    -   `board.group_by_field_id` and `board.card_preview_field_id` → the target field IDs;
    -   drop `id`, `view_id`, `app_id`, `is_default` and `private`. A `PUT` tolerates them, but `POST` rejects them;
    -   drop every key whose value is `null`, for example `sort_by`, `split_by` or `board` of a table view. `POST` rejects `null` for any key;
    -   but if `name` is `null`, send a name or `""` instead, because `name` is required on create.
4.  [Create the view](#create-a-view) on the target app: `POST /v1/view/app/{target_app_id}` with `name`, `layout` and the rewritten fields, including `show_progress` and, for a `table` or `board` view, its `table` or `board` config.
5.  If the source view was the default view of its app (`is_default: true`), [promote the new view](#set-the-default-view). You can't set this in the create body.

You need *share access* to the target app, not only edit access. Each app allows at most 2000 views, which a repeated or retried bulk migration can reach.

These don't carry over. Set them up again by hand:

-   the default flag (use the promote endpoint);
-   private views (not visible in the source list);
-   the checklist sort mode;
-   column footer statistics and board lane customization;
-   views in the gallery layout (not readable);
-   the field *order* within a layout (taken from the field order of the target app).

## Next steps

[

Record

read the records a view shows.

](https://developers.tapeapp.com/docs/api/resource/record#retrieve-records-for-a-view)[

App

list the public views of an app.

](https://developers.tapeapp.com/docs/api/resource/app#retrieve-views-for-an-app)[

Filter

every filter type you can store in a view.

](https://developers.tapeapp.com/docs/api/resource/filter)[

Authentication

pick the right credential for these endpoints.

](https://developers.tapeapp.com/docs/api/authentication)[

Capabilities

what `apps:read` and `apps:edit` allow.

](https://developers.tapeapp.com/docs/api/capabilities)[

Request limits

how credits and rate limits work.

](https://developers.tapeapp.com/docs/api/request-limits)[

Errors

the error envelope and all error codes.

](https://developers.tapeapp.com/docs/api/errors)
