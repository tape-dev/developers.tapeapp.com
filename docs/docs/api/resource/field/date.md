# Date field

> Use a date field to store a date, a date with a time, or a date range in a record.

Use a date field to store a date, a date with a time, or a date range in a record.

Tape has two date field types. Both are the **Date** field in Tape:

-   `single_date` holds one date.
-   `range_date` holds a start date and an optional end date.

A date field has the [common field properties](https://developers.tapeapp.com/docs/api/resource/field/overview#common-properties) and `settings` that decide whether a value has a time, an end date and a place in the calendar. To read and write the dates of a record, see [Date field value](https://developers.tapeapp.com/docs/api/resource/field-value/date).

*Date field object*

```json
{
  "field_id": 2,
  "external_id": "installation_window",
  "slug": "installation_window",
  "label": "Installation Window",
  "type": "date",
  "field_type": "range_date",
  "config": {
    "label": "Installation Window",
    "slug": "installation_window",
    "external_id": "installation_window",
    "description": "The days the crew installs the panels.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
    "settings": {
      "calendar": true,
      "time": "disabled",
      "end": "required",
      "is_due_date_of_status_field": false
    }
  }
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"date"` for both date field types. | `"date"` |
| `field_type` | `string` | `"single_date"` or `"range_date"`. | `"range_date"` |
| `config.settings.calendar` | `boolean` | Shows the field in the Tape calendar and in iCal exports. Default: `false`. | `true` |
| `config.settings.time` | `string` | Whether a value has a time: `"disabled"`, `"enabled"` (default) or `"required"`. | `"disabled"` |
| `config.settings.end` | `string` | `range_date` only. Whether a value needs an end date: `"enabled"` (default) or `"required"`. | `"required"` |
| `config.settings.is_due_date_of_status_field` | `boolean` | Uses this field as the due date of the app's [status field](https://developers.tapeapp.com/docs/api/resource/field/status), for example in **Focus**. Default: `false`. | `false` |

In Tape, `time` is the **Time** setting of the field: `"disabled"` is **Hidden**, `"enabled"` is **Shown**, `"required"` is **Required**. `end` is the **End date** setting.

The API has no value to hide the end date. An end date hidden in Tape reads as `"enabled"`. For a date without an end, use a `single_date` field.

![Settings of a Date field with the Time options and the End date setting](https://developers.tapeapp.com/assets/images/date-field-settings-403970c8eb2c44e792972dd4f965720d.png)

## App creation

Use the [create app endpoint](https://developers.tapeapp.com/docs/api/resource/app#create-an-app) to create date fields together with a new app.

`POST https://api.tapeapp.com/v1/app`

**cURL**

*Request*

```shell

curl -X POST https://api.tapeapp.com/v1/app/ \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "workspace_id": 1,
    "name": "Installations",
    "item_name": "Installation",
    "fields": [
      {
        "field_type": "single_date",
        "config": {
          "label": "Site Visit",
          "description": "When the technician checks the roof.",
          "required": true,
          "settings": {
            "calendar": true,
            "time": "enabled"
          }
        }
      },
      {
        "field_type": "range_date",
        "config": {
          "label": "Installation Window",
          "description": "The days the crew installs the panels.",
          "settings": {
            "calendar": true,
            "time": "disabled",
            "end": "required"
          }
        }
      }
    ]
  }'
```

**JSON**

*Request*

```json
{
  "workspace_id": 1,
  "name": "Installations",
  "item_name": "Installation",
  "fields": [
    {
      "field_type": "single_date",
      "config": {
        "label": "Site Visit",
        "description": "When the technician checks the roof.",
        "required": true,
        "settings": {
          "calendar": true,
          "time": "enabled"
        }
      }
    },
    {
      "field_type": "range_date",
      "config": {
        "label": "Installation Window",
        "description": "The days the crew installs the panels.",
        "settings": {
          "calendar": true,
          "time": "disabled",
          "end": "required"
        }
      }
    }
  ]
}
```

*Response*

```json
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "installations",
  "external_id": "installations",
  "name": "Installations",
  "record_name": "Installation",
  "item_name": "Installation",
  "type": "database",
  "config": {
    "item_name": "Installation",
    "name": "Installations"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "site_visit",
      "slug": "site_visit",
      "label": "Site Visit",
      "type": "date",
      "field_type": "single_date",
      "config": {
        "label": "Site Visit",
        "slug": "site_visit",
        "external_id": "site_visit",
        "description": "When the technician checks the roof.",
        "show_description": false,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "calendar": true,
          "time": "enabled",
          "is_due_date_of_status_field": false
        }
      }
    },
    {
      "field_id": 2,
      "external_id": "installation_window",
      "slug": "installation_window",
      "label": "Installation Window",
      "type": "date",
      "field_type": "range_date",
      "config": {
        "label": "Installation Window",
        "slug": "installation_window",
        "external_id": "installation_window",
        "description": "The days the crew installs the panels.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "calendar": true,
          "time": "disabled",
          "end": "required",
          "is_due_date_of_status_field": false
        }
      }
    }
  ]
}
```

The example creates an installations app for a solar installer in the workspace with ID `1`. The app gets a `single_date` field "Site Visit" with an optional time and a `range_date` field "Installation Window" with whole days and a required end date. The example leaves out other fields of an installations app, like "Customer" or "Address".

Find the workspace ID with [Retrieve workspaces](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspaces).

**General behavior**

-   Without `time`, a new field uses `"enabled"`. Without `end`, a new `range_date` field uses `"enabled"`. Without `calendar`, it's `false`.
-   Only one date field of an app can be the due date of the status field. If you set `is_due_date_of_status_field` on a field, Tape removes it from the other date fields of the app.
-   Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Site Visit".
-   A new date field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   A `time` other than `"disabled"`, `"enabled"` or `"required"`, or an `end` other than `"enabled"` or `"required"`, returns `400`.

## App update

Use the [update app endpoint](https://developers.tapeapp.com/docs/api/resource/app#update-an-app) to create new date fields in an app or to change existing ones.

`PUT https://api.tapeapp.com/v1/app/{appId}`

**cURL**

*Request*

```shell

curl -X PUT https://api.tapeapp.com/v1/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": [
      {
        "field_id": 1,
        "config": {
          "label": "Site Visit",
          "description": "When the technician checks the roof.",
          "required": true,
          "settings": {
            "calendar": true,
            "time": "required",
            "is_due_date_of_status_field": false
          }
        }
      },
      {
        "field_id": 2,
        "config": {
          "label": "Installation Window",
          "description": "The days the crew installs the panels.",
          "required": false,
          "settings": {
            "calendar": true,
            "time": "disabled",
            "end": "enabled",
            "is_due_date_of_status_field": false
          }
        }
      }
    ]
  }'
```

**JSON**

*Request*

```json
{
  "fields": [
    {
      "field_id": 1,
      "config": {
        "label": "Site Visit",
        "description": "When the technician checks the roof.",
        "required": true,
        "settings": {
          "calendar": true,
          "time": "required",
          "is_due_date_of_status_field": false
        }
      }
    },
    {
      "field_id": 2,
      "config": {
        "label": "Installation Window",
        "description": "The days the crew installs the panels.",
        "required": false,
        "settings": {
          "calendar": true,
          "time": "disabled",
          "end": "enabled",
          "is_due_date_of_status_field": false
        }
      }
    }
  ]
}
```

*Response*

```json
{
  "app_id": 1,
  "workspace_id": 1,
  "slug": "installations",
  "external_id": "installations",
  "name": "Installations",
  "record_name": "Installation",
  "item_name": "Installation",
  "type": "database",
  "config": {
    "item_name": "Installation",
    "name": "Installations"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "site_visit",
      "slug": "site_visit",
      "label": "Site Visit",
      "type": "date",
      "field_type": "single_date",
      "config": {
        "label": "Site Visit",
        "slug": "site_visit",
        "external_id": "site_visit",
        "description": "When the technician checks the roof.",
        "show_description": true,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "calendar": true,
          "time": "required",
          "is_due_date_of_status_field": false
        }
      }
    },
    {
      "field_id": 2,
      "external_id": "installation_window",
      "slug": "installation_window",
      "label": "Installation Window",
      "type": "date",
      "field_type": "range_date",
      "config": {
        "label": "Installation Window",
        "slug": "installation_window",
        "external_id": "installation_window",
        "description": "The days the crew installs the panels.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "calendar": true,
          "time": "disabled",
          "end": "enabled",
          "is_due_date_of_status_field": false
        }
      }
    }
  ]
}
```

The example makes a time required for the "Site Visit" field (ID `1`) and makes the end date of the "Installation Window" field (ID `2`) optional. The request sends all settings of both fields.

Find the app ID and the field IDs in the [Developer view of the app](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

**General behavior**

-   A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
-   Send all `settings` of a date field when you update it. Tape sets a missing `time` or `end` to `"enabled"`, and a missing `calendar` of a `single_date` field to `false`.
-   Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](https://developers.tapeapp.com/docs/api/resource/field/overview#create-and-update-fields).
-   Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.
-   A `time` other than `"disabled"`, `"enabled"` or `"required"`, or an `end` other than `"enabled"` or `"required"`, returns `400`.

## Next steps

[

Date field value

read and write the dates of a record.

](https://developers.tapeapp.com/docs/api/resource/field-value/date)[

Date & timezone

date formats, calendar days and timezones in the API.

](https://developers.tapeapp.com/docs/api/date-timezone)[

Status field

the field a due date belongs to.

](https://developers.tapeapp.com/docs/api/resource/field/status)[

Field

the properties all field types share.

](https://developers.tapeapp.com/docs/api/resource/field/overview)[

App

create, update and delete apps with their fields.

](https://developers.tapeapp.com/docs/api/resource/app)[

Capabilities

what `apps:edit` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
