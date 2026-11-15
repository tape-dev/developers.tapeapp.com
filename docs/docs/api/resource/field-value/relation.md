# Relation field value

> Use a relation field value to read and write the related records of a record.

Use a relation field value to read and write the related records of a record.

Each value of a [relation field](https://developers.tapeapp.com/docs/api/resource/field/relation) is a short preview of one related record. A `single_relation` field holds at most one record. A `multi_relation` field holds several records.

*Relation field value object*

```json
{
  "field_id": 1,
  "external_id": "belongs_to_epic",
  "label": "Belongs to Epic",
  "type": "app",
  "field_type": "single_relation",
  "values": [
    {
      "value": {
        "record_id": 100,
        "app_id": 2,
        "title": "Tenant portal relaunch",
        "created_on": "2026-03-02 09:15:00",
        "created_on_utc": "2026-03-02 08:15:00",
        "app": {
          "app_id": 2,
          "icon": "event_available",
          "name": "Epics",
          "slug": "epics",
          "external_id": "epics",
          "record_name": "Epic",
          "item_name": "Epic",
          "workspace_id": 1,
          "config": {
            "name": "Epics",
            "icon": "event_available",
            "record_name": "Epic",
            "workspace_id": 1
          }
        }
      }
    }
  ]
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"app"` for both relation field types. | `"app"` |
| `field_type` | `string` | `"single_relation"` or `"multi_relation"`. | `"single_relation"` |
| `values[].value.record_id` | `number` | ID of the related record. | `100` |
| `values[].value.app_id` | `number` | ID of the app of the related record. | `2` |
| `values[].value.title` | `string` | Title of the related record. | `"Tenant portal relaunch"` |
| `values[].value.created_on` | `string` | When the related record was created, in your timezone. | `"2026-03-02 09:15:00"` |
| `values[].value.created_on_utc` | `string` | When the related record was created, in UTC. | `"2026-03-02 08:15:00"` |
| `values[].value.app` | `object` | A short preview of the app of the related record, like in `referenced_apps` of the relation field. |  |

Each field in a record response also contains the field's `config`. The examples on this page leave it out. They also shorten each `app` preview to `app_id`, `name` and `record_name`.

## Record creation

Use the [create record endpoint](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) to set related records on a new record.

`POST https://api.tapeapp.com/v1/record/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "title": "Fix login timeout on the tenant portal",
      "belongs_to_epic": 100,
      "sprints": [110, 111]
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "title": "Fix login timeout on the tenant portal",
    "belongs_to_epic": 100,
    "sprints": [110, 111]
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Fix login timeout on the tenant portal",
  "fields": [
    {
      "field_id": 3,
      "external_id": "title",
      "label": "Title",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Fix login timeout on the tenant portal" }]
    },
    {
      "field_id": 1,
      "external_id": "belongs_to_epic",
      "label": "Belongs to Epic",
      "type": "app",
      "field_type": "single_relation",
      "values": [
        {
          "value": {
            "record_id": 100,
            "app_id": 2,
            "title": "Tenant portal relaunch",
            "created_on": "2026-03-02 09:15:00",
            "created_on_utc": "2026-03-02 08:15:00",
            "app": { "app_id": 2, "name": "Epics", "record_name": "Epic" }
          }
        }
      ]
    },
    {
      "field_id": 2,
      "external_id": "sprints",
      "label": "Sprints",
      "type": "app",
      "field_type": "multi_relation",
      "values": [
        {
          "value": {
            "record_id": 110,
            "app_id": 3,
            "title": "Sprint 14",
            "created_on": "2026-03-02 09:20:00",
            "created_on_utc": "2026-03-02 08:20:00",
            "app": { "app_id": 3, "name": "Sprints", "record_name": "Sprint" }
          }
        },
        {
          "value": {
            "record_id": 111,
            "app_id": 3,
            "title": "Sprint 15",
            "created_on": "2026-03-04 14:05:00",
            "created_on_utc": "2026-03-04 13:05:00",
            "app": { "app_id": 3, "name": "Sprints", "record_name": "Sprint" }
          }
        }
      ]
    }
  ]
}
```

The example creates the issue "Fix login timeout on the tenant portal" in the issues app from [Relation field](https://developers.tapeapp.com/docs/api/resource/field/relation). It sets the "Belongs to Epic" field (ID `1`, type `single_relation`, slug `belongs_to_epic`) and the "Sprints" field (ID `2`, type `multi_relation`, slug `sprints`). The "Sprints" field links to the "Sprints" app with ID `3`.

**General behavior**

-   Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
-   Send record IDs as numbers or numeric strings. Tape also accepts objects like `{ "record_id": 100 }` or `{ "value": 100 }`, and arrays of these.
-   Tape links a record only if it exists, isn't deleted, isn't a template or a draft, and belongs to an app that the field links to (`referenced_apps`).
-   Tape drops related records that don't meet these conditions and saves the rest.
-   Send one record ID to a `single_relation` field. If you send several, Tape keeps one record it can link and drops the others.
-   The filters of a `view_id` in the field settings limit the records you can select in Tape. The API doesn't apply them.
-   To search for records you can add to the field, use [Find relatable records](https://developers.tapeapp.com/docs/api/resource/record#find-relatable-records-for-a-relation-field).

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   A related record Tape can't link returns `400` if you add the query parameter `reject_unreferencable_relation_targets=true`. Tape then writes no values.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record) to read the related records of a record.

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
  "title": "Fix login timeout on the tenant portal",
  "fields": [
    {
      "field_id": 3,
      "external_id": "title",
      "label": "Title",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Fix login timeout on the tenant portal" }]
    },
    {
      "field_id": 1,
      "external_id": "belongs_to_epic",
      "label": "Belongs to Epic",
      "type": "app",
      "field_type": "single_relation",
      "values": [
        {
          "value": {
            "record_id": 100,
            "app_id": 2,
            "title": "Tenant portal relaunch",
            "created_on": "2026-03-02 09:15:00",
            "created_on_utc": "2026-03-02 08:15:00",
            "app": { "app_id": 2, "name": "Epics", "record_name": "Epic" }
          }
        }
      ]
    },
    {
      "field_id": 2,
      "external_id": "sprints",
      "label": "Sprints",
      "type": "app",
      "field_type": "multi_relation",
      "values": [
        {
          "value": {
            "record_id": 110,
            "app_id": 3,
            "title": "Sprint 14",
            "created_on": "2026-03-02 09:20:00",
            "created_on_utc": "2026-03-02 08:20:00",
            "app": { "app_id": 3, "name": "Sprints", "record_name": "Sprint" }
          }
        },
        {
          "value": {
            "record_id": 111,
            "app_id": 3,
            "title": "Sprint 15",
            "created_on": "2026-03-04 14:05:00",
            "created_on_utc": "2026-03-04 13:05:00",
            "app": { "app_id": 3, "name": "Sprints", "record_name": "Sprint" }
          }
        }
      ]
    }
  ]
}
```

To count or sum up a field over all related records, use [Retrieve statistics of related records](https://developers.tapeapp.com/docs/api/resource/record#retrieve-statistics-of-related-records).

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](https://developers.tapeapp.com/docs/api/resource/record#update-a-record) to change the related records of a record.

`PUT https://api.tapeapp.com/v1/record/{record_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "belongs_to_epic": 101,
      "sprints": [111]
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "belongs_to_epic": 101,
    "sprints": [111]
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Fix login timeout on the tenant portal",
  "fields": [
    {
      "field_id": 3,
      "external_id": "title",
      "label": "Title",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Fix login timeout on the tenant portal" }]
    },
    {
      "field_id": 1,
      "external_id": "belongs_to_epic",
      "label": "Belongs to Epic",
      "type": "app",
      "field_type": "single_relation",
      "values": [
        {
          "value": {
            "record_id": 101,
            "app_id": 2,
            "title": "Mobile check-in",
            "created_on": "2026-02-11 16:40:00",
            "created_on_utc": "2026-02-11 15:40:00",
            "app": { "app_id": 2, "name": "Epics", "record_name": "Epic" }
          }
        }
      ]
    },
    {
      "field_id": 2,
      "external_id": "sprints",
      "label": "Sprints",
      "type": "app",
      "field_type": "multi_relation",
      "values": [
        {
          "value": {
            "record_id": 111,
            "app_id": 3,
            "title": "Sprint 15",
            "created_on": "2026-03-04 14:05:00",
            "created_on_utc": "2026-03-04 13:05:00",
            "app": { "app_id": 3, "name": "Sprints", "record_name": "Sprint" }
          }
        }
      ]
    }
  ]
}
```

The example moves the issue with ID `1` to the epic with ID `101` and keeps only the sprint with ID `111`.

**General behavior**

-   The new records replace the old ones. To add a record to a `multi_relation` field, send the existing record IDs together with the new one.
-   To clear the field, send `null` or an empty array `[]`.
-   Tape doesn't stop you from clearing a required relation field through the API. Send a value instead.
-   Tape drops related records it can't link, like on record creation. See [Update a record](https://developers.tapeapp.com/docs/api/resource/record#update-a-record).
-   Fields that aren't in the request keep their values.

*Request: clear the field*

```json
{
  "fields": {
    "sprints": null
  }
}
```

A cleared field isn't in the `fields` of the response.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

Same errors as under [Record creation](#record-creation).

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Next steps

[

Relation field

create and change relation fields.

](https://developers.tapeapp.com/docs/api/resource/field/relation)[

Field value

how all field values work.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Record

create, read, update and delete records, with all query parameters.

](https://developers.tapeapp.com/docs/api/resource/record)[

Filter

find records by their related records.

](https://developers.tapeapp.com/docs/api/resource/filter)
