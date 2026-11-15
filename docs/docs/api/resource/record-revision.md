# Record revision

> Use these endpoints to see what changed in a record, who changed it and when.

Use these endpoints to see what changed in a record, who changed it and when.

> Which capability do I need?
> 
> All revision endpoints need `records:read`. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).

## Revisions concept

Every record has a revision number, `current_revision.revision` in the record. It starts at `0` when the record is created and goes up by one with each change. Use this number as `revision_id` in the endpoints below.

A revision contains its author as `created_by`, its date and time as `created_on` and its revision number.

## Retrieve revisions for a record

Use this endpoint to list all revisions of a record.

`GET https://api.tapeapp.com/v1/record/{record_id}/revision`

*Request*

```shell
curl https://api.tapeapp.com/v1/record/1/revision \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "total": 2,
  "revisions": [
    {
      "created_by": {
        "user_id": 600,
        "name": "Dan Jacob",
        "type": "user"
      },
      "created_on": "2022-03-16 14:25:00",
      "type": "creation",
      "revision": 0
    },
    {
      "created_by": {
        "user_id": 600,
        "name": "Dan Jacob",
        "type": "user"
      },
      "created_on": "2022-03-16 14:30:00",
      "type": "update",
      "revision": 1
    }
  ]
}
```

The example reads the revisions of record `1`. User `Dan Jacob` (ID `600`) created the record and updated it once.

The response has no pagination and no `cursor`.

> Looking for the changed values?
> 
> A revision holds only metadata, not the changed values. To see the changes, use [Retrieve revision delta](#retrieve-revision-delta).

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `include_deleted` | `boolean` | Also return the revisions of a deleted record that is still in a trash you can access (default: `false`). |

## Retrieve revision delta

Use this endpoint to see which field values changed in one revision.

`GET https://api.tapeapp.com/v1/record/{record_id}/revision/previous/{revision_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/record/1/revision/previous/1 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "record_id": 1,
  "from_revision_id": 0,
  "to_revision_id": 1,
  "revision_deltas": [
    {
      "from": [],
      "external_id": "notes",
      "field_id": 2000,
      "label": "Notes",
      "to": [
        {
          "value": "Some important notes"
        }
      ],
      "type": "text",
      "field_type": "single_text",
      "config": {
        "description": null,
        "required": false,
        "label": "Notes"
      }
    }
  ]
}
```

The example compares revision `1` of record `1` with the revision before it, revision `0`.

In the example, the single text field `notes` changed from no value to `Some important notes`.

**Key fields**

-   `revision_deltas`: one entry per changed field. One revision can change several fields when the same author changed them at the same time.
-   `from` and `to`: the values before and after the change. They have the same format as the `values` of a record field. See [Field values](https://developers.tapeapp.com/docs/api/resource/field-value/overview).

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

### Revision lookback limit

You can read deltas only for the *last 50 revisions* of a record. An older revision returns a `400` error (see [Errors](https://developers.tapeapp.com/docs/api/errors)):

*Response*

```json
{
  "status_code": 400,
  "endpoint": "/v1/record/1/revision/previous/123",
  "error_code": "validation",
  "error_message": "Revision ID 123 is too old. You can maximally go back 50 revisions"
}
```

## Retrieve the last revision

Use this endpoint to read a record as it was before its most recent change.

`GET https://api.tapeapp.com/v1/record/{record_id}/revision/last`

*Request*

```shell
curl https://api.tapeapp.com/v1/record/1/revision/last \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "record_id": 1,
  "app_record_id": 1,
  "app_id": 1,
  "created_on": "2022-03-16 14:25:00",
  "created_on_utc": "2022-03-16 13:25:00",
  "last_modified_on": "2022-03-16 14:25:00",
  "last_modified_on_utc": "2022-03-16 13:25:00",
  "created_by": {
    "user_id": 600,
    "name": "Dan Jacob",
    "type": "user"
  },
  "last_modified_by": {
    "user_id": 600,
    "name": "Dan Jacob",
    "type": "user"
  },
  "fields": [
    {
      "field_id": 2000,
      "external_id": "notes",
      "label": "Notes",
      "type": "text",
      "field_type": "single_text",
      "values": []
    }
  ]
}
```

The response has the same `fields` format as a record.

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

## Retrieve a record at a revision

Use this endpoint to read a record as it was at a given revision.

`GET https://api.tapeapp.com/v1/record/{record_id}/revision/at/{revision_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/record/1/revision/at/0 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

The response has the same format as [Retrieve the last revision](#retrieve-the-last-revision).

**General behavior**

-   `revision_id` `0` returns the record as it was created.
-   The [revision lookback limit](#revision-lookback-limit) applies here too.

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Errors**

A `revision_id` higher than the latest revision of the record returns `400`.

## Next steps

[

Record

read and change the current state of a record.

](https://developers.tapeapp.com/docs/api/resource/record)[

Field value

the value format in `from`, `to` and `fields`.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Webhook

receive the `revision_id` of every record change.

](https://developers.tapeapp.com/docs/api/resource/webhook)[

Errors

all error codes of the API.

](https://developers.tapeapp.com/docs/api/errors)[

Capabilities

what `records:read` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
