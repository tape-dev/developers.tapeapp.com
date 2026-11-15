# Record

> Use these endpoints to create, read, update, delete and restore the records of a database app.

Use these endpoints to create, read, update, delete and restore the records of a database app.

To find records by text across all apps, use the [Search resource](https://developers.tapeapp.com/docs/api/resource/search).

In the Podio API, a record is an item: `record_id` replaces `item_id`, and `app_record_id` replaces `app_item_id`.

> Which capability do I need?
> 
> Endpoints that read records need `records:read`. Endpoints that change records need `records:edit`. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).

## The record object

A record holds the field values of one entry in a database app. [Retrieve a record](#retrieve-a-record) returns the full object:

*Record*

```json
{
  "record_id": 1,
  "app_record_id": 1,
  "record_url": "https://tapeapp.com/acme/record/1",
  "app_id": 1,
  "app": {
    "app_id": 1,
    "name": "Contacts",
    "record_name": "Contact",
    "workspace_id": 1,
    "workspace": {
      "workspace_id": 1,
      "name": "CRM",
      "external_id": "crm",
      "org_id": 1
    },
    "icon": "event_available"
  },
  "title": "Clara Weber",
  "created_on": "2022-03-01 12:00:00",
  "created_on_utc": "2022-03-01 11:00:00",
  "last_modified_on": "2022-03-02 09:30:00",
  "last_modified_on_utc": "2022-03-02 08:30:00",
  "deleted_on": null,
  "deleted_on_utc": null,
  "created_by": {
    "type": "user",
    "id": 600,
    "user_id": 600,
    "org_id": 1,
    "mail": ["juliet@acme.com"],
    "email": "juliet@acme.com",
    "name": "Juliet Adams"
  },
  "last_modified_by": {
    "type": "user",
    "id": 600,
    "user_id": 600,
    "org_id": 1,
    "mail": ["juliet@acme.com"],
    "email": "juliet@acme.com",
    "name": "Juliet Adams"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "values": [
        {
          "value": "Clara Weber"
        }
      ]
    }
  ],
  "current_revision": {
    "type": "update",
    "revision": 1,
    "record_id": 1,
    "created_on": "2022-03-02 09:30:00",
    "created_on_utc": "2022-03-02 08:30:00",
    "created_by": {
      "type": "user",
      "id": 600,
      "user_id": 600,
      "org_id": 1,
      "mail": ["juliet@acme.com"],
      "name": "Juliet Adams"
    }
  },
  "initial_revision": {
    "type": "creation",
    "revision": 0,
    "record_id": 1,
    "created_on": "2022-03-01 12:00:00",
    "created_on_utc": "2022-03-01 11:00:00",
    "created_by": {
      "type": "user",
      "id": 600,
      "user_id": 600,
      "org_id": 1,
      "mail": ["juliet@acme.com"],
      "name": "Juliet Adams"
    }
  }
}
```

The example is shortened: it leaves out `app.config` and `revisions`. It comes from a user whose timezone is one hour ahead of UTC.

List endpoints, such as [Retrieve records for an app](#retrieve-records-for-an-app), return the same object without `revisions` and with `comment_count`.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `record_id` | number | The record ID. Unique across all apps. | `1` |
| `app_record_id` | number | The running number of the record in its database app. | `1` |
| `record_url` | string | Link to the record in Tape. | `"https://tapeapp.com/acme/record/1"` |
| `app_id` | number | The database app the record belongs to. | `1` |
| `app` | object | Preview of the database app: `app_id`, `name`, `record_name`, `workspace_id`, `workspace`, `icon`, plus a legacy `config` copy of all of them except `app_id`. | `{ "app_id": 1, "name": "Contacts", … }` |
| `title` | string | The computed title of the record. May be missing. | `"Clara Weber"` |
| `created_on` | string | null | When the record was created, as `YYYY-MM-DD HH:mm:ss` in your timezone. See [Date & timezone](https://developers.tapeapp.com/docs/api/date-timezone). | `"2022-03-01 12:00:00"` |
| `created_on_utc` | string | null | The same moment as `created_on`, in UTC. | `"2022-03-01 11:00:00"` |
| `last_modified_on` | string | null | When the record last changed, in your timezone. | `"2022-03-02 09:30:00"` |
| `last_modified_on_utc` | string | null | The same moment as `last_modified_on`, in UTC. | `"2022-03-02 08:30:00"` |
| `deleted_on` | string | null | When the record was deleted, in your timezone. `null` unless the record is in the trash. | `null` |
| `deleted_on_utc` | string | null | The same moment as `deleted_on`, in UTC. | `null` |
| `created_by` | object | null | The author who created the record. See [Authors](#authors). | `{ "type": "user", "id": 600, … }` |
| `last_modified_by` | object | null | The author who last changed the record. See [Authors](#authors). | `{ "type": "user", "id": 600, … }` |
| `fields` | array | The field values of the record. A field without a value isn't listed. See [Field values](https://developers.tapeapp.com/docs/api/resource/field-value/overview). | `[{ "field_id": 1, "values": [ … ] }]` |
| `current_revision` | object | null | The latest revision of the record. See [Record revision](https://developers.tapeapp.com/docs/api/resource/record-revision). | `{ "type": "update", "revision": 1, … }` |
| `initial_revision` | object | null | The first revision of the record. | `{ "type": "creation", "revision": 0, … }` |
| `revisions` | array | The latest revisions of the record. Only in responses about one record. To read all revisions, use [Record revision](https://developers.tapeapp.com/docs/api/resource/record-revision). | `[{ "type": "update", … }]` |
| `comment_count` | number | Number of comments on the record, without replies. Only in list responses. | `2` |

### Authors

`created_by` and `last_modified_by` hold one of three kinds of author. Check `type` to know which one you have.

| `type` | Properties | Description |
| --- | --- | --- |
| `"user"` | `id`, `user_id`, `org_id`, `mail`, `email`, `name`, and `phone` if set | A user. `user_id` is the same as `id`. |
| `"workflow"` | `id`, `automation_id`, `workflow_id`, `mail`, `name` | An automation. `automation_id` is the same as `id`. `workflow_id` is deprecated. |
| `"share_session"` | `share_session_id`, `mail`, `name` | A visitor who changed the record through a share link. Only in `last_modified_by`. `share_session_id` is a UUID string, `mail` is empty, and `name` is a generated label that isn't unique. |

## Create a record

Use this endpoint to create a record in a database app.

`POST https://api.tapeapp.com/v1/record/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "full_name": "Clara Weber"
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "full_name": "Clara Weber"
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "app_id": 1,
  "title": "Clara Weber",
  "created_on": "2022-03-01 12:00:00",
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "values": [
        {
          "value": "Clara Weber"
        }
      ]
    }
  ]
}
```

**Before you start**

1.  Open the database app in Tape, select **•••** (**Follow, export and more…**) at the top, then select **Developer**. The window shows the **App ID** and, for every field, its **Field ID** and **External ID** (the field's slug). See [Find the app ID and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).
2.  Use a token with the capabilities **Read records** and **Edit records** (`records:read`, `records:edit`). The token from the [Quickstart](https://developers.tapeapp.com/docs/guide/api/getting-started) only reads records. Capabilities can't be added to a token later, so [create a new token](https://developers.tapeapp.com/docs/api/personal-access-tokens#create-a-token) with every capability you need, for example **Edit comments** to comment on records.

Prefer the API? [Retrieve all available apps](https://developers.tapeapp.com/docs/api/resource/app#retrieve-all-available-apps) returns every `app_id`. [Retrieve a single app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app) returns every field with its `field_id` and `slug`. Both need `apps:read`.

> Don't see Developer?
> 
> You need **Full access** to the app.

Send the field values in the `fields` object, one key per field. Use the field ID or the field's slug (returned as `external_id` in records) as the key.

The response has status `201`. The example sets one `single_text` field. For every other field type, see [Field values](https://developers.tapeapp.com/docs/api/resource/field-value/overview#formats-by-field-type).

To set a text field, send a string. To set a category field, send the label or the ID of the option:

*Request*

```json
{
  "fields": {
    "full_name": "Clara Weber",
    "pipeline_stage": "Contacted"
  }
}
```

See [Text field value](https://developers.tapeapp.com/docs/api/resource/field-value/text) and [Category field value](https://developers.tapeapp.com/docs/api/resource/field-value/category) for every format.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Errors**

A request without a value for a required field returns `400` with `validation`, also for checklist, email, link and phone fields. An empty value, such as `[]` or `null`, counts as missing.

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `silent` | `boolean` | Don't send notifications for this change (default: `false`). |
| `hook` | `boolean` | Run webhooks for this change (default: `true`). |
| `workflow` | `boolean` | Trigger automations for this change (default: `true`). |
| `reject_unreferencable_relation_targets` | `boolean` | Reject the request with `400` if a relation value points to a record that can't be referenced. Otherwise, that reference is dropped (default: `false`). |
| `reject_unresolvable_option_values` | `boolean` | Reject the request with `400` if a category or status value matches no option. Otherwise, a category value is skipped. A status value without a match returns `400` in any case, because a status field can't be empty (default: `false`). |
| `apply_user_timezone_on_date_inputs` | `boolean` | Read date values without a UTC offset in your timezone instead of UTC (default: `false`). |

## Retrieve a record

Use this endpoint to read one record with all its field values.

`GET https://api.tapeapp.com/v1/record/{record_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "record_id": 1,
  "app_id": 1,
  "title": "Clara Weber",
  "created_on": "2022-03-01 12:00:00",
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "values": [
        {
          "value": "Clara Weber"
        }
      ]
    }
  ]
}
```

The response is shortened and shows one `single_text` field. A record also returns `app_record_id` (its number in the app), `record_url`, `created_by` and its revisions. See [The record object](#the-record-object).

A field without a value isn't in `fields`. A [calculation](https://developers.tapeapp.com/docs/api/resource/field-value/calculation) whose result became empty is the exception: it stays with an empty `values` array.

> Don't know a record ID?
> 
> Open the record in Tape, select **•••** (**Follow, export and more…**), then select **Developer**. The window shows the **Record ID**. Or list the records of a database app with [Retrieve records for an app](#retrieve-records-for-an-app).

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Errors**

A deleted record returns `400` with `record_deleted`:

```json
{
  "status_code": 400,
  "endpoint": "/v1/record/17",
  "error_code": "record_deleted",
  "error_message": "[RecordDeletedException] Record with ID 17 is deleted!"
}
```

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `include_deleted` | `boolean` | Include records that are deleted but still in a trash you can access (default: `false`). |

## Update a record

Use this endpoint to change the field values of a record.

`PUT https://api.tapeapp.com/v1/record/{record_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "full_name": "Andrea Lim"
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "full_name": "Andrea Lim"
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Andrea Lim",
  "created_on": "2022-03-01 12:00:00",
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "values": [
        {
          "value": "Andrea Lim"
        }
      ]
    }
  ]
}
```

Send only the fields you want to change in the `fields` object. The response contains the updated record.

The example changes one `single_text` field. For every other field type, see [Field values](https://developers.tapeapp.com/docs/api/resource/field-value/overview#formats-by-field-type).

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `silent` | `boolean` | Don't send notifications for this change (default: `false`). |
| `hook` | `boolean` | Run webhooks for this change (default: `true`). |
| `workflow` | `boolean` | Trigger automations for this change (default: `true`). |
| `reject_unreferencable_relation_targets` | `boolean` | Reject the request with `400` if a relation value points to a record that can't be referenced. Otherwise, that reference is dropped (default: `false`). |
| `reject_unresolvable_option_values` | `boolean` | Reject the request with `400` if a category or status value matches no option. Otherwise, a category field is cleared. A status value without a match returns `400` in any case, because a status field can't be empty (default: `false`). |
| `apply_user_timezone_on_date_inputs` | `boolean` | Read date values without a UTC offset in your timezone instead of UTC (default: `false`). |

## Delete a record

Use this endpoint to move a record to the trash.

`DELETE https://api.tapeapp.com/v1/record/{record_id}`

*Request*

```shell
curl -X DELETE https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "record_id": 1,
  "title": "Clara Weber",
  "created_on": "2022-03-01 12:00:00",
  "deleted_on": "2022-03-01 13:00:00",
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "values": [
        {
          "value": "Clara Weber"
        }
      ]
    }
  ]
}
```

To delete the record permanently, set `skip_trash` to `true`.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Errors**

A record that is already deleted returns `400` with `record_deleted`:

```json
{
  "status_code": 400,
  "endpoint": "/v1/record/1",
  "error_code": "record_deleted",
  "error_message": "[RecordDeletedException] Record with ID 1 is deleted!"
}
```

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `silent` | `boolean` | Don't send notifications for this change (default: `false`). |
| `hook` | `boolean` | Run webhooks for this change (default: `true`). |
| `workflow` | `boolean` | Trigger automations for this change (default: `true`). |
| `skip_trash` | `boolean` | Delete the record permanently instead of moving it to a trash (default: `false`). |

## Restore a record

Use this endpoint to bring a deleted record back from the trash.

`POST https://api.tapeapp.com/v1/record/{record_id}/restore`

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/1/restore \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "record_id": 1,
  "title": "Clara Weber",
  "created_on": "2022-03-01 12:00:00",
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "values": [
        {
          "value": "Clara Weber"
        }
      ]
    }
  ]
}
```

The record must be in a trash you can access.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `silent` | `boolean` | Don't send notifications for this change (default: `false`). |
| `hook` | `boolean` | Run webhooks for this change (default: `true`). |

## Retrieve records for an app

Use this endpoint to list the records of a database app, page by page.

`GET https://api.tapeapp.com/v1/record/app/{app_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/record/app/1?limit=2 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "total": 2,
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFiRGVmSWQiOjgsInZhbHVlcyI6WzE1OV0sImV4cCI6MTY1MDYxODc3OH0.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g",
  "records": [
    {
      "record_id": 2,
      "title": "Clara Weber",
      "created_on": "2022-03-23 08:48:42",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Clara Weber"
            }
          ]
        }
      ]
    },
    {
      "record_id": 1,
      "title": "Andrea Lim",
      "created_on": "2022-03-23 08:43:03",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Andrea Lim"
            }
          ]
        }
      ]
    }
  ]
}
```

To get the next page, send the returned `cursor` with your next request. See [Pagination](https://developers.tapeapp.com/docs/api/pagination).

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description | Min | Max |
| --- | --- | --- | --- | --- |
| `limit` | `integer` | Number of records to return (default: `50`). | 1 | 500 |
| `cursor` | `string` | Cursor of the next page. | \- | \- |
| `sort_by` | `string` | The field ID or the field's slug (returned as `external_id` in records) to sort by. | \- | \- |
| `sort_desc` | `boolean` | Sort in descending order (default: `false`). | \- | \- |

## Retrieve filtered records for an app

Use this endpoint to list only the records of a database app that match your filters.

`POST https://api.tapeapp.com/v1/record/filter/app/{app_id}`

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/filter/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "filters": [
      {
        "field_id": "1",
        "field_type": "single_text",
        "match_type": "contains",
        "values": [
          {
            "value": "John"
          }
        ],
        "type": "text"
      }
    ]
  }'
```

*Response*

```json
{
  "total": 3,
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFiRGVmSWQiOjgsInZhbHVlcyI6WzE1OV0sImV4cCI6MTY1MDYxODc3OH0.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g",
  "records": [
    {
      "record_id": 3,
      "title": "John Doe",
      "created_on": "2022-03-23 08:48:42",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "John Doe"
            }
          ]
        }
      ]
    },
    {
      "record_id": 2,
      "title": "Alison Johnsson",
      "created_on": "2022-03-23 08:43:03",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Alison Johnsson"
            }
          ]
        }
      ]
    },
    {
      "record_id": 1,
      "title": "Karl John III",
      "created_on": "2022-03-23 08:43:03",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Karl John III"
            }
          ]
        }
      ]
    }
  ]
}
```

All filters must match (`AND`). Put the field ID in `field_id`, because the slug doesn't work in filters. For every other field type, see [Filter](https://developers.tapeapp.com/docs/api/resource/filter).

To get the next page, send the returned `cursor` in the query string of your next request.

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description | Min | Max |
| --- | --- | --- | --- | --- |
| `limit` | `integer` | Number of records to return (default: `50`). | 1 | 500 |
| `cursor` | `string` | Cursor of the next page. | \- | \- |
| `sort_by` | `string` | The field ID or the field's slug (returned as `external_id` in records) to sort by. | \- | \- |
| `sort_desc` | `boolean` | Sort in descending order (default: `false`). | \- | \- |

**Body parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `filters` | `Array` | Filters to apply. A record is returned only if it matches all of them. |

## Retrieve records for a view

Use this endpoint to list the records of a view, page by page.

`GET https://api.tapeapp.com/v1/record/view/{view_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/record/view/1?limit=2 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "total": 2,
  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFiRGVmSWQiOjgsInZhbHVlcyI6WzE1OV0sImV4cCI6MTY1MDYxODc3OH0.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g",
  "records": [
    {
      "record_id": 2,
      "title": "Clara Weber",
      "created_on": "2022-03-23 08:48:42",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Clara Weber"
            }
          ]
        }
      ]
    },
    {
      "record_id": 1,
      "title": "Andrea Lim",
      "created_on": "2022-03-23 08:43:03",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Andrea Lim"
            }
          ]
        }
      ]
    }
  ]
}
```

To find a `view_id`, see [Retrieve views for an app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-views-for-an-app), which lists the public views of an app.

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description | Min | Max |
| --- | --- | --- | --- | --- |
| `limit` | `integer` | Number of records to return (default: `50`). | 1 | 500 |
| `cursor` | `string` | Cursor of the next page. | \- | \- |

## Retrieve shared records

Use this endpoint to list the records that were shared with you individually, newest first.

`GET https://api.tapeapp.com/v1/record/shared`

*Request*

```shell
curl https://api.tapeapp.com/v1/record/shared?limit=20 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "records": [
    {
      "record_id": 170471696,
      "app_record_id": 42,
      "record_url": "https://tapeapp.com/acme/record/170471696",
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
        "icon": "event_available"
      },
      "title": "Acme Corp onboarding",
      "created_on": "2026-08-03 09:14:22",
      "created_on_utc": "2026-08-03 07:14:22",
      "created_by": {
        "type": "user",
        "id": 5501,
        "user_id": 5501,
        "org_id": 77,
        "mail": ["juliet@acme.com"],
        "email": "juliet@acme.com",
        "name": "Juliet Adams"
      },
      "current_revision": null,
      "initial_revision": null
    }
  ],
  "cursor": null
}
```

The response is shortened. `app` also holds a `config` copy of its properties, and `current_revision` and `initial_revision` hold the record's latest and first revision. Each record is a preview with the same properties as a [record result of the search](https://developers.tapeapp.com/docs/api/resource/search#record-results).

**General behavior**

-   The list holds records shared with you through the record itself, in database apps you can't open otherwise. A shared record in a database you can open isn't listed. Read it with [Retrieve records for an app](#retrieve-records-for-an-app).
-   Records come back as previews without field values. Read one in full with [Retrieve a record](#retrieve-a-record).
-   To get the next page, send the returned `cursor`. Repeat until `cursor` is `null`. A full page doesn't mean that more pages exist.
-   The response has no `total`.
-   A personal access token with limited content access returns only the records in the databases its content access includes.

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

An automation API key returns `400` with `validation`, because it acts for no user.

**Query parameters**

| Parameter | Type | Description | Min | Max |
| --- | --- | --- | --- | --- |
| `limit` | `integer` | Number of records to return (default: `50`). | 1 | 100 |
| `cursor` | `string` | Cursor of the next page. | \- | \- |

## Retrieve statistics of related records

Use this endpoint to count or sum up a field over all records related to one record.

`GET https://api.tapeapp.com/v1/record/{record_id}/reference/{field_id}/stats`

*Request*

```shell
curl "https://api.tapeapp.com/v1/record/1/reference/12/stats?aggregation_type=SUM" \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "result": 3,
  "source_record_id": 1,
  "target_field_id": 12
}
```

The example sums up the number field `12` over all records related to record `1`.

**General behavior**

-   The endpoint looks at every record of the field's app that is related to `record_id`, through incoming or outgoing relations.
-   It aggregates the field `field_id` over these records.

**Requirements:** `records:read`, and view access to the record and to the field's app. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `aggregation_type` | `string` | One of `COUNT` (default), `COUNT_NOT_EMPTY`, `COUNT_EMPTY`, `PERCENT_EMPTY`, `PERCENT_NOT_EMPTY`, `SUM`, `AVG`, `MEDIAN`, `MIN` or `MAX`. |

`SUM`, `AVG`, `MEDIAN`, `MIN` and `MAX` work only on number fields and on calculation fields that return a number.

## Retrieve related records for a set of records

Use this endpoint to get the records of another database app that are related to a set of records.

`POST https://api.tapeapp.com/v1/record/app/{app_id}/ref/{ref_app_id}`

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/app/1/ref/2?limit=10 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{ "recordIds": [100, 101], "direction": "forward" }'
```

*Response*

```json
{
  "total": 2,
  "records": [
    {
      "record_id": 2,
      "title": "Clara Weber",
      "created_on": "2022-03-23 08:48:42",
      "app": {
        "app_id": 2,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Clara Weber"
            }
          ]
        }
      ]
    },
    {
      "record_id": 1,
      "title": "Andrea Lim",
      "created_on": "2022-03-23 08:43:03",
      "app": {
        "app_id": 2,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      },
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Andrea Lim"
            }
          ]
        }
      ]
    }
  ]
}
```

The example returns the records of app `2` that are related to the records `100` and `101` of app `1`.

**General behavior**

-   The endpoint returns at most 1000 records. It has no pagination.
-   `total` is the number of records in this response, not the number of all related records.
-   An unknown `direction` returns no records instead of an error. Use `forward`, `reverse` or `both`.
-   `limit` applies before access checks. Records you can't view are removed afterwards, so `total` can be lower than `limit`.

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description | Min | Max |
| --- | --- | --- | --- | --- |
| `limit` | `integer` | Number of records to return (default: `1000`). | 1 | 1000 |

**Body parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `direction` | `string` | Direction of the relations. `forward`: relation fields of the source records point to the target records. `reverse`: relation fields of the target records point to the source records. `both`: either way. |
| `recordIds` | `integer[]` | IDs of the source records. All must belong to the app `app_id`. |
| `relationFieldIds` | `integer[]` | IDs of the relation fields to follow. Optional. |

## Find relatable records for a relation field

Use this endpoint to search for records you can add to a relation field.

`GET https://api.tapeapp.com/v1/record/field/{field_id}/find`

*Request*

```shell
curl https://api.tapeapp.com/v1/record/field/1/find?text=adam \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "total": 1,
  "records": [
    {
      "record_id": 2,
      "title": "Clara Weber",
      "created_on": "2022-03-23 08:48:42",
      "app": {
        "app_id": 1,
        "icon": "event_available",
        "name": "Contacts",
        "record_name": "Contact",
        "workspace_id": 1
      }
    }
  ]
}
```

In the example, field `1` is a relation field to the app Contacts.

The endpoint returns at most 10 records. It has no pagination and accepts no `cursor` or `limit`.

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `text` | `string` | The text to search for. |

## Batch create multiple records

Use this endpoint to create up to 50 records in one request.

`POST https://api.tapeapp.com/v1/record/app/batch/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/app/batch/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "inputs": [
      {
        "fields": {
          "full_name": "Clara Weber"
        }
      },
      {
        "fields": {
          "full_name": "Pete Miller"
        }
      }
    ]
  }'
```

**JSON**

*Request*

```json
{
  "inputs": [
    {
      "fields": {
        "full_name": "Clara Weber"
      }
    },
    {
      "fields": {
        "full_name": "Pete Miller"
      }
    }
  ]
}
```

*Response*

```json
{
  "records": [
    {
      "record_id": 1,
      "title": "Clara Weber",
      "created_on": "2022-03-01 12:00:00",
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Clara Weber"
            }
          ]
        }
      ]
    },
    {
      "record_id": 2,
      "title": "Pete Miller",
      "created_on": "2022-03-01 12:00:00",
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Pete Miller"
            }
          ]
        }
      ]
    }
  ]
}
```

Send one object per record in the `inputs` array. Each object has a `fields` object, as in [Create a record](#create-a-record).

**General behavior**

-   One request creates at most 50 records. A longer `inputs` array returns an error.
-   If one input fails, no record is created.
-   The response has status `201`.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `silent` | `boolean` | Don't send notifications for this change (default: `false`). |
| `hook` | `boolean` | Run webhooks for this change (default: `true`). |
| `workflow` | `boolean` | Trigger automations for this change (default: `true`). |
| `reject_unreferencable_relation_targets` | `boolean` | Reject the request with `400` if a relation value points to a record that can't be referenced. Otherwise, that reference is dropped (default: `false`). |
| `reject_unresolvable_option_values` | `boolean` | Reject the request with `400` if a category or status value matches no option. Otherwise, a category value is skipped. A status value without a match returns `400` in any case, because a status field can't be empty (default: `false`). |
| `apply_user_timezone_on_date_inputs` | `boolean` | Read date values without a UTC offset in your timezone instead of UTC (default: `false`). |

## Batch update multiple records

Use this endpoint to update up to 50 records of a database app in one request.

`PUT https://api.tapeapp.com/v1/record/app/batch/{app_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/record/app/batch/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "inputs": [
      {
        "record_id": 1,
        "fields": {
          "full_name": "Clara Weber"
        }
      },
      {
        "record_id": 2,
        "fields": {
          "full_name": "Pete Miller"
        }
      }
    ]
  }'
```

**JSON**

*Request*

```json
{
  "inputs": [
    {
      "record_id": 1,
      "fields": {
        "full_name": "Clara Weber"
      }
    },
    {
      "record_id": 2,
      "fields": {
        "full_name": "Pete Miller"
      }
    }
  ]
}
```

*Response*

```json
{
  "records": [
    {
      "record_id": 1,
      "title": "Clara Weber",
      "created_on": "2022-03-01 12:00:00",
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Clara Weber"
            }
          ]
        }
      ]
    },
    {
      "record_id": 2,
      "title": "Pete Miller",
      "created_on": "2022-03-01 12:00:00",
      "fields": [
        {
          "field_id": 1,
          "external_id": "full_name",
          "label": "Full Name",
          "type": "text",
          "field_type": "single_text",
          "values": [
            {
              "value": "Pete Miller"
            }
          ]
        }
      ]
    }
  ]
}
```

Send one object per record in the `inputs` array. Each object has a `record_id` and a `fields` object, as in [Update a record](#update-a-record).

**General behavior**

-   One request updates at most 50 records. A longer `inputs` array returns an error.
-   If one input fails, no record is updated.
-   Don't need the updated records? Set `empty_response` to `true` for a faster response.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `silent` | `boolean` | Don't send notifications for this change (default: `false`). |
| `hook` | `boolean` | Run webhooks for this change (default: `true`). |
| `workflow` | `boolean` | Trigger automations for this change (default: `true`). |
| `empty_response` | `boolean` | Don't return the updated records (default: `false`). |
| `reject_unreferencable_relation_targets` | `boolean` | Reject the request with `400` if a relation value points to a record that can't be referenced. Otherwise, that reference is dropped (default: `false`). |
| `reject_unresolvable_option_values` | `boolean` | Reject the request with `400` if a category or status value matches no option. Otherwise, a category field is cleared. A status value without a match returns `400` in any case, because a status field can't be empty (default: `false`). |
| `apply_user_timezone_on_date_inputs` | `boolean` | Read date values without a UTC offset in your timezone instead of UTC (default: `false`). |

## Next steps

[

Field value

the value format of every field type.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

App

read the field IDs and slugs of an app.

](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app)[

Filter

all filters for filtered records.

](https://developers.tapeapp.com/docs/api/resource/filter)[

Pagination

read long lists page by page.

](https://developers.tapeapp.com/docs/api/pagination)[

File

upload a file to attach it to a record.

](https://developers.tapeapp.com/docs/api/resource/file)[

Webhook

get notified when records change.

](https://developers.tapeapp.com/docs/api/resource/webhook)[

Record comment

comment on a record.

](https://developers.tapeapp.com/docs/api/resource/record-comment)[

Capabilities

what `records:read` and `records:edit` allow.

](https://developers.tapeapp.com/docs/api/capabilities)
