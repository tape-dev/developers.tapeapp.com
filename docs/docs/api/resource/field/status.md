# Status field

> Use a status field to track whether a record, like a task or a deal, is still open or done.

Use a status field to track whether a record, like a task or a deal, is still open or done.

Tape has one status field type: `status` is the **Status** field. It works like a `single_category` field with one difference: every option says whether it means completed. Set this with `means_completed`.

-   An option with `"means_completed": true` marks the record as done. Typical labels: "Done", "Discarded", "Duplicate".
-   An option with `"means_completed": false` marks the record as open. Typical labels: "Open", "In Progress", "Blocked".

A status value holds one option. An app has at most one status field, and every status field is required.

In Tape, the field settings show these options as **Completed** and **Incomplete**. Tape uses them for **Focus**: a record with an incomplete status can appear in the Focus of its users, a record with a completed status leaves it. Learn more about [Focus](https://help.tapeapp.com/en/articles/6394049-focus).

![Settings of a Status field with its options, some of them marked Completed](https://developers.tapeapp.com/assets/images/status-field-settings-e227f6a4209e98ed51f0df87cfcdddb1.png)

![Focus in Tape with an open record from a database app with a status field](https://developers.tapeapp.com/assets/images/focus-open-record-93b322a2de14433157490a8c631c225a.png)

A status field has the [common field properties](https://developers.tapeapp.com/docs/api/resource/field/overview#common-properties) and `settings` with its options and layout. To read and set the status of a record, see [Status field value](https://developers.tapeapp.com/docs/api/resource/field-value/status).

*Status field object*

```json
{
  "field_id": 1,
  "external_id": "status",
  "slug": "status",
  "label": "Status",
  "type": "category",
  "field_type": "status",
  "config": {
    "label": "Status",
    "slug": "status",
    "external_id": "status",
    "description": "The current status of the task.",
    "show_description": true,
    "required": true,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": true,
    "settings": {
      "multiple": false,
      "layout": "dropdown",
      "options": [
        { "id": 1, "text": "Open", "color": "0077DE", "means_completed": false },
        { "id": 2, "text": "In Progress", "color": "DEA700", "means_completed": false },
        { "id": 3, "text": "Done", "color": "00866A", "means_completed": true }
      ]
    }
  }
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"category"`. A status field has the same `type` as a category field. | `"category"` |
| `field_type` | `string` | `"status"`. | `"status"` |
| `config.required` | `boolean` | `true` for every status field. | `true` |
| `config.settings.multiple` (read-only) | `boolean` | `false` for every status field. | `false` |
| `config.settings.layout` | `string` | Older layout setting: `"dropdown"`, `"list"` or `"inline"` (default). Tape stores and returns the value, but it doesn't change how the options look. Set that in the record layout of the app. | `"dropdown"` |
| `config.settings.options` | `array` | The options of the field, in their order. |  |
| `config.settings.options[].id` | `number` | ID of the option. Use it to change the option or to select it in a record. | `2` |
| `config.settings.options[].text` | `string` | Label of the option. Required for every option you send. | `"In Progress"` |
| `config.settings.options[].means_completed` | `boolean` | Whether the option marks the record as done. Required for every option you send. | `false` |
| `config.settings.options[].color` | `string` | Color of the option. Send a name or a hex value, responses return a hex value without `#`. See [Option colors](https://developers.tapeapp.com/docs/api/resource/field/category#option-colors). | `"DEA700"` |
| `config.settings.options_to_delete` (write-only) | `array` | App update only. The IDs of the options to delete. | `[{ "id": 4 }]` |

## App creation

Use the [create app endpoint](https://developers.tapeapp.com/docs/api/resource/app#create-an-app) to create a status field together with a new app.

`POST https://api.tapeapp.com/v1/app`

**cURL**

*Request*

```shell

curl -X POST https://api.tapeapp.com/v1/app/ \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "workspace_id": 1,
    "name": "Tasks",
    "item_name": "Task",
    "fields": [
      {
        "field_type": "status",
        "config": {
          "label": "Status",
          "description": "The current status of the task.",
          "required": true,
          "settings": {
            "options": [
              { "text": "Open", "color": "blue", "means_completed": false },
              { "text": "In Progress", "color": "yellow", "means_completed": false },
              { "text": "Done", "color": "green", "means_completed": true }
            ]
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
  "name": "Tasks",
  "item_name": "Task",
  "fields": [
    {
      "field_type": "status",
      "config": {
        "label": "Status",
        "description": "The current status of the task.",
        "required": true,
        "settings": {
          "options": [
            { "text": "Open", "color": "blue", "means_completed": false },
            { "text": "In Progress", "color": "yellow", "means_completed": false },
            { "text": "Done", "color": "green", "means_completed": true }
          ]
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
  "slug": "tasks",
  "external_id": "tasks",
  "name": "Tasks",
  "record_name": "Task",
  "item_name": "Task",
  "type": "database",
  "config": {
    "item_name": "Task",
    "name": "Tasks"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "status",
      "slug": "status",
      "label": "Status",
      "type": "category",
      "field_type": "status",
      "config": {
        "label": "Status",
        "slug": "status",
        "external_id": "status",
        "description": "The current status of the task.",
        "show_description": false,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "multiple": false,
          "layout": "inline",
          "options": [
            { "id": 1, "text": "Open", "color": "0077DE", "means_completed": false },
            { "id": 2, "text": "In Progress", "color": "DEA700", "means_completed": false },
            { "id": 3, "text": "Done", "color": "00866A", "means_completed": true }
          ]
        }
      }
    }
  ]
}
```

The example creates a tasks app in the workspace with ID `1`. The app gets a `status` field "Status" with two open options and one completed option. The example leaves out other fields of a tasks app, like "Title" or "Due date".

Find the workspace ID with [Retrieve workspaces](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspaces).

**General behavior**

-   Tape keeps the order of `options` from the request.
-   Without `required`, Tape sets it to `true`.
-   Without `layout`, a new field uses `"inline"`.
-   Without `color`, a new option is gray (`6E7174`).
-   Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Status".
-   A new status field doesn't show its `description` as help text (`show_description` is `false`).

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   An option without `text` or `means_completed` returns `400`.
-   `"required": false` returns `400` with the message `Status fields must be required`.
-   A field without an option with `"means_completed": true` returns `400` with the message `At least one option must have means_completed = true`. Without an option with `"means_completed": false`, the message reads `At least one option must have means_completed = false`.
-   A second status field in the app returns `400` with the message `Only one status field is allowed per app`.

## App update

Use the [update app endpoint](https://developers.tapeapp.com/docs/api/resource/app#update-an-app) to create a status field in an app or to change the existing one.

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
          "label": "Status",
          "description": "The current status of the task.",
          "settings": {
            "options": [
              { "id": 1, "text": "Open", "color": "blue", "means_completed": false },
              { "id": 2, "text": "In Progress", "color": "yellow", "means_completed": false },
              { "id": 3, "text": "Done", "color": "green", "means_completed": true },
              { "text": "Discarded", "color": "red", "means_completed": true }
            ]
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
        "label": "Status",
        "description": "The current status of the task.",
        "settings": {
          "options": [
            { "id": 1, "text": "Open", "color": "blue", "means_completed": false },
            { "id": 2, "text": "In Progress", "color": "yellow", "means_completed": false },
            { "id": 3, "text": "Done", "color": "green", "means_completed": true },
            { "text": "Discarded", "color": "red", "means_completed": true }
          ]
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
  "slug": "tasks",
  "external_id": "tasks",
  "name": "Tasks",
  "record_name": "Task",
  "item_name": "Task",
  "type": "database",
  "config": {
    "item_name": "Task",
    "name": "Tasks"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "status",
      "slug": "status",
      "label": "Status",
      "type": "category",
      "field_type": "status",
      "config": {
        "label": "Status",
        "slug": "status",
        "external_id": "status",
        "description": "The current status of the task.",
        "show_description": false,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "multiple": false,
          "layout": "inline",
          "options": [
            { "id": 1, "text": "Open", "color": "0077DE", "means_completed": false },
            { "id": 2, "text": "In Progress", "color": "DEA700", "means_completed": false },
            { "id": 3, "text": "Done", "color": "00866A", "means_completed": true },
            { "id": 4, "text": "Discarded", "color": "FE001A", "means_completed": true }
          ]
        }
      }
    }
  ]
}
```

The example adds the completed option "Discarded" to the "Status" field (ID `1`) of the tasks app.

Find the app ID and the field IDs in the [Developer view of the app](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids). Find the option IDs in `config.settings.options` of the field, for example with [Retrieve a single app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app).

**General behavior**

-   An option with `id` changes that option. To rename it, send its `id` with the new `text` and its `means_completed`. An option without `id` creates a new option.
-   Options you leave out of `options` stay unchanged. To set a new order, send all existing options in that order.
-   An option you send without the other options moves to the end of the list, also when you only rename it. To keep the order, send all options in the order you want.
-   To delete options, list their IDs in `settings.options_to_delete`, for example `"options_to_delete": [{ "id": 4 }]`. Tape also accepts plain IDs: `[4]`. An option that is also in `options` stays.
-   When you delete an option, Tape moves its records to the first option with the same `means_completed` value. If you delete "Open" here, its records move to "In Progress".
-   Without `layout`, the field keeps its layout.
-   Send `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false`. `show_description` stays as it is. See [Create and update fields](https://developers.tapeapp.com/docs/api/resource/field/overview#create-and-update-fields).
-   Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.
-   `"required": false` returns `400` with the message `Status fields must be required`.
-   A change that leaves no option with `"means_completed": true` or none with `"means_completed": false` returns `400` with the message `At least one option must have means_completed = true` or `At least one option must have means_completed = false`.
-   A second status field in the app returns `400`.
-   An option ID in `options` or `options_to_delete` that doesn't belong to the field returns `400`.

## Next steps

[

Status field value

read and set the status of a record.

](https://developers.tapeapp.com/docs/api/resource/field-value/status)[

Category field

options without a completed state, and the color names.

](https://developers.tapeapp.com/docs/api/resource/field/category)[

Date field

use a date field as the due date of the status.

](https://developers.tapeapp.com/docs/api/resource/field/date)[

Field

the properties all field types share.

](https://developers.tapeapp.com/docs/api/resource/field/overview)[

App

create, update and delete apps with their fields.

](https://developers.tapeapp.com/docs/api/resource/app)[

Capabilities

what `apps:edit` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
