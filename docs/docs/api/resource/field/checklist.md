# Checklist field

> Use a checklist field to keep a list of tasks in a record, each with its own assignee, due date and priority.

Use a checklist field to keep a list of tasks in a record, each with its own assignee, due date and priority.

Tape has one checklist field type: `checklist` is the **Task list** field.

A checklist field has the [common field properties](https://developers.tapeapp.com/docs/api/resource/field/overview#common-properties) and one setting, `show_in_focus`. To read and write the tasks of a record, see [Checklist field value](https://developers.tapeapp.com/docs/api/resource/field-value/checklist).

*Checklist field object*

```json
{
  "field_id": 1,
  "external_id": "onboarding_tasks",
  "slug": "onboarding_tasks",
  "label": "Onboarding Tasks",
  "type": "checklist",
  "field_type": "checklist",
  "config": {
    "label": "Onboarding Tasks",
    "slug": "onboarding_tasks",
    "external_id": "onboarding_tasks",
    "description": "Everything to prepare before the first day.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": true,
    "settings": {
      "show_in_focus": true
    }
  }
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"checklist"`. | `"checklist"` |
| `field_type` | `string` | `"checklist"`. | `"checklist"` |
| `config.settings.show_in_focus` | `boolean` | Shows the tasks of this field in the **Focus** of their assignees. Default: `true`. | `true` |

## App creation

Use the [create app endpoint](https://developers.tapeapp.com/docs/api/resource/app#create-an-app) to create a checklist field together with a new app.

`POST https://api.tapeapp.com/v1/app`

**cURL**

*Request*

```shell

curl -X POST https://api.tapeapp.com/v1/app/ \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "workspace_id": 1,
    "name": "Onboarding",
    "item_name": "New Hire",
    "fields": [
      {
        "field_type": "checklist",
        "config": {
          "label": "Onboarding Tasks",
          "description": "Everything to prepare before the first day.",
          "required": false,
          "settings": {
            "show_in_focus": true
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
  "name": "Onboarding",
  "item_name": "New Hire",
  "fields": [
    {
      "field_type": "checklist",
      "config": {
        "label": "Onboarding Tasks",
        "description": "Everything to prepare before the first day.",
        "required": false,
        "settings": {
          "show_in_focus": true
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
  "slug": "onboarding",
  "external_id": "onboarding",
  "name": "Onboarding",
  "record_name": "New Hire",
  "item_name": "New Hire",
  "type": "database",
  "config": {
    "item_name": "New Hire",
    "name": "Onboarding"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "onboarding_tasks",
      "slug": "onboarding_tasks",
      "label": "Onboarding Tasks",
      "type": "checklist",
      "field_type": "checklist",
      "config": {
        "label": "Onboarding Tasks",
        "slug": "onboarding_tasks",
        "external_id": "onboarding_tasks",
        "description": "Everything to prepare before the first day.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "show_in_focus": true
        }
      }
    }
  ]
}
```

The example creates an onboarding app for new hires in the workspace with ID `1`. The app gets a `checklist` field "Onboarding Tasks". The example leaves out other fields of an onboarding app, like "Name" or "Start Date".

Find the workspace ID with [Retrieve workspaces](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspaces).

**General behavior**

-   Without `show_in_focus`, a new field shows its tasks in **Focus**.
-   Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Onboarding Tasks".
-   A new checklist field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

## App update

Use the [update app endpoint](https://developers.tapeapp.com/docs/api/resource/app#update-an-app) to create new checklist fields in an app or to change existing ones.

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
          "label": "Onboarding Tasks",
          "description": "Everything to prepare before the first day.",
          "required": false,
          "settings": {
            "show_in_focus": false
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
        "label": "Onboarding Tasks",
        "description": "Everything to prepare before the first day.",
        "required": false,
        "settings": {
          "show_in_focus": false
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
  "slug": "onboarding",
  "external_id": "onboarding",
  "name": "Onboarding",
  "record_name": "New Hire",
  "item_name": "New Hire",
  "type": "database",
  "config": {
    "item_name": "New Hire",
    "name": "Onboarding"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "onboarding_tasks",
      "slug": "onboarding_tasks",
      "label": "Onboarding Tasks",
      "type": "checklist",
      "field_type": "checklist",
      "config": {
        "label": "Onboarding Tasks",
        "slug": "onboarding_tasks",
        "external_id": "onboarding_tasks",
        "description": "Everything to prepare before the first day.",
        "show_description": true,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "show_in_focus": false
        }
      }
    }
  ]
}
```

The example sets `show_in_focus` of the "Onboarding Tasks" field (ID `1`) to `false`. The tasks of this field no longer appear in the **Focus** of their assignees.

Find the app ID and the field IDs in the [Developer view of the app](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

**General behavior**

-   A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
-   Without `show_in_focus`, the setting stays as it is.
-   Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](https://developers.tapeapp.com/docs/api/resource/field/overview#create-and-update-fields).
-   Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.

## Next steps

[

Checklist field value

read and write the tasks of a record.

](https://developers.tapeapp.com/docs/api/resource/field-value/checklist)[

Status field

track whether the whole record is done.

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
