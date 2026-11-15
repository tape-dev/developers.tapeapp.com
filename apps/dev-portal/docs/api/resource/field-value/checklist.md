---
id: checklist
title: Checklist field value
sidebar_label: Checklist
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use a checklist field value to read and write the tasks of a record.

The value of a [checklist field](/docs/api/resource/field/checklist) is a list of tasks. Each element of `values` is one task with its title, description, due date, assignee, priority and completion state.

```json title="Checklist field value object"
{
  "field_id": 2,
  "external_id": "onboarding_tasks",
  "label": "Onboarding Tasks",
  "type": "checklist",
  "field_type": "checklist",
  "values": [
    {
      "id": 300,
      "title": "Order laptop",
      "description": "14-inch, with docking station.",
      "due_at": "2026-03-02 00:00:00",
      "due_at_date": "2026-03-02",
      "due_at_time": null,
      "due_at_utc": "2026-03-02 00:00:00",
      "due_at_date_utc": "2026-03-02",
      "due_at_time_utc": null,
      "assignee_user_id": 600,
      "assignee_user": {
        "user_id": 600,
        "type": "user",
        "name": "Will Dawson",
        "org_id": 1,
        "mail": ["will@acme.com"]
      },
      "priority": "high",
      "completed": false,
      "completed_at": null,
      "completed_at_utc": null
    }
  ]
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"checklist"`. | `"checklist"` |
| `field_type` | `string` | `"checklist"`. | `"checklist"` |
| `values[].id` | `number` | ID of the task. Send it with the title in an update to keep the task. | `300` |
| `values[].title` | `string` | Title of the task. | `"Order laptop"` |
| `values[].description` | `string` | Description of the task. | `"14-inch, with docking station."` |
| `values[].due_at` | `string` or `null` | Due date in your timezone, as `YYYY-MM-DD HH:mm:ss`. | `"2026-03-02 00:00:00"` |
| `values[].due_at_date` | `string` or `null` | Date part of `due_at`. | `"2026-03-02"` |
| `values[].due_at_time` | `string` or `null` | Time part of `due_at`. `null` for a whole calendar day. | `null` |
| `values[].due_at_utc`, `due_at_date_utc`, `due_at_time_utc` | `string` or `null` | The due date in UTC, in the same three parts. | `"2026-03-02 00:00:00"` |
| `values[].assignee_user_id` | `number` or `null` | User ID of the assignee. | `600` |
| `values[].assignee_user` | `object` or `null` | The assignee with `user_id`, `type`, `name`, `org_id` and `mail`. | |
| `values[].priority` | `string` or `null` | `"low"`, `"medium"`, `"high"` or `"urgent"`. | `"high"` |
| `values[].completed` | `boolean` | Whether the task is done. | `false` |
| `values[].completed_at` | `string` or `null` | When the task was completed, in your timezone. | `null` |
| `values[].completed_at_utc` | `string` or `null` | When the task was completed, in UTC. | `null` |

Due dates follow the rules of date field values: a whole calendar day has `due_at_time: null`. See [Date & timezone](/docs/api/date-timezone#calendar-days).

Each field in a record response also contains the field's `config`. The examples on this page leave it out.

## Record creation

Use the [create record endpoint](/docs/api/resource/record#create-a-record) to add tasks to a new record.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

The example creates the new hire "Ava Chen" with three tasks in the "Onboarding Tasks" field (ID `2`, type `checklist`, slug `onboarding_tasks`). The first task is due on a whole day, the second at 15:00 UTC, the third is a plain title. The responses on this page belong to a user in the `Europe/Berlin` timezone (UTC+1 in March).

The app also has a "Name" text field (ID `1`, slug `name`), which the [Checklist field](/docs/api/resource/field/checklist#app-creation) example leaves out. Use the field IDs and slugs of your app.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/record/app/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "name": "Ava Chen",
      "onboarding_tasks": [
        {
          "title": "Order laptop",
          "description": "14-inch, with docking station.",
          "due_at": "2026-03-02",
          "assignee_user_id": 600,
          "priority": "high"
        },
        {
          "title": "Set up email account",
          "due_at": "2026-03-02 15:00",
          "assignee_user_id": 601
        },
        "Book welcome lunch"
      ]
    }
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "fields": {
    "name": "Ava Chen",
    "onboarding_tasks": [
      {
        "title": "Order laptop",
        "description": "14-inch, with docking station.",
        "due_at": "2026-03-02",
        "assignee_user_id": 600,
        "priority": "high"
      },
      {
        "title": "Set up email account",
        "due_at": "2026-03-02 15:00",
        "assignee_user_id": 601
      },
      "Book welcome lunch"
    ]
  }
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "record_id": 1,
  "title": "Ava Chen",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Ava Chen" }]
    },
    {
      "field_id": 2,
      "external_id": "onboarding_tasks",
      "label": "Onboarding Tasks",
      "type": "checklist",
      "field_type": "checklist",
      "values": [
        {
          "id": 300,
          "title": "Order laptop",
          "description": "14-inch, with docking station.",
          "due_at": "2026-03-02 00:00:00",
          "due_at_date": "2026-03-02",
          "due_at_time": null,
          "due_at_utc": "2026-03-02 00:00:00",
          "due_at_date_utc": "2026-03-02",
          "due_at_time_utc": null,
          "assignee_user_id": 600,
          "assignee_user": {
            "user_id": 600,
            "type": "user",
            "name": "Will Dawson",
            "org_id": 1,
            "mail": ["will@acme.com"]
          },
          "priority": "high",
          "completed": false,
          "completed_at": null,
          "completed_at_utc": null
        },
        {
          "id": 301,
          "title": "Set up email account",
          "description": "",
          "due_at": "2026-03-02 16:00:00",
          "due_at_date": "2026-03-02",
          "due_at_time": "16:00:00",
          "due_at_utc": "2026-03-02 15:00:00",
          "due_at_date_utc": "2026-03-02",
          "due_at_time_utc": "15:00:00",
          "assignee_user_id": 601,
          "assignee_user": {
            "user_id": 601,
            "type": "user",
            "name": "Juliet Adams",
            "org_id": 1,
            "mail": ["juliet@acme.com"]
          },
          "priority": null,
          "completed": false,
          "completed_at": null,
          "completed_at_utc": null
        },
        {
          "id": 302,
          "title": "Book welcome lunch",
          "description": "",
          "due_at": null,
          "due_at_date": null,
          "due_at_time": null,
          "due_at_utc": null,
          "due_at_date_utc": null,
          "due_at_time_utc": null,
          "assignee_user_id": null,
          "assignee_user": null,
          "priority": null,
          "completed": false,
          "completed_at": null,
          "completed_at_utc": null
        }
      ]
    }
  ]
}
```

**General behavior**

- Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
- Send an array of tasks. A task is an object or a plain string, which becomes the title.
- Set the assignee with `assignee_user_id`, the user ID of a user of your organization. Tape also accepts `assignee`.
- Set `priority` to `"low"`, `"medium"`, `"high"` or `"urgent"`. Tape reads it case-insensitively.
- Send `due_at` as `YYYY-MM-DD` for a whole day or with a time for a point in time.
- Tape reads a time without an offset as UTC. To send your local time instead, add the query parameter `apply_user_timezone_on_date_inputs=true`. Tape never shifts `due_at_utc`.
- Send `"completed": true` to create a task that's done.
- Tape removes spaces at the start and the end of titles and descriptions.
- A required checklist field needs at least one task on a new record. An empty array `[]` counts as missing.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- A `priority` other than `"low"`, `"medium"`, `"high"` or `"urgent"` returns `400` with `validation`.
- A `due_at` that isn't a date or a date with a time returns `400` with `validation`.

See [Errors](/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](/docs/api/resource/record#retrieve-a-record) to read the tasks of a record.

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

The response holds the same tasks as the response under [Record creation](#record-creation).

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](/docs/api/resource/record#update-a-record) to change the tasks of a record.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

The example marks "Order laptop" (ID `300`) as done and gives "Set up email account" (ID `301`) to Will Dawson with urgent priority. It removes "Book welcome lunch" and adds a new task "Add to payroll".

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X PUT #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "onboarding_tasks": [
        {
          "id": 300,
          "title": "Order laptop",
          "description": "14-inch, with docking station.",
          "due_at": "2026-03-02",
          "assignee_user_id": 600,
          "priority": "high",
          "completed": true
        },
        {
          "id": 301,
          "title": "Set up email account",
          "due_at_utc": "2026-03-02 15:00:00",
          "assignee_user_id": 600,
          "priority": "urgent"
        },
        {
          "title": "Add to payroll",
          "assignee_user_id": 601
        }
      ]
    }
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "fields": {
    "onboarding_tasks": [
      {
        "id": 300,
        "title": "Order laptop",
        "description": "14-inch, with docking station.",
        "due_at": "2026-03-02",
        "assignee_user_id": 600,
        "priority": "high",
        "completed": true
      },
      {
        "id": 301,
        "title": "Set up email account",
        "due_at_utc": "2026-03-02 15:00:00",
        "assignee_user_id": 600,
        "priority": "urgent"
      },
      {
        "title": "Add to payroll",
        "assignee_user_id": 601
      }
    ]
  }
}
```

</TabItem>
</Tabs>

```json title='Response'
{
  "record_id": 1,
  "title": "Ava Chen",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Ava Chen" }]
    },
    {
      "field_id": 2,
      "external_id": "onboarding_tasks",
      "label": "Onboarding Tasks",
      "type": "checklist",
      "field_type": "checklist",
      "values": [
        {
          "id": 300,
          "title": "Order laptop",
          "description": "14-inch, with docking station.",
          "due_at": "2026-03-02 00:00:00",
          "due_at_date": "2026-03-02",
          "due_at_time": null,
          "due_at_utc": "2026-03-02 00:00:00",
          "due_at_date_utc": "2026-03-02",
          "due_at_time_utc": null,
          "assignee_user_id": 600,
          "assignee_user": {
            "user_id": 600,
            "type": "user",
            "name": "Will Dawson",
            "org_id": 1,
            "mail": ["will@acme.com"]
          },
          "priority": "high",
          "completed": true,
          "completed_at": "2026-02-27 10:15:00",
          "completed_at_utc": "2026-02-27 09:15:00"
        },
        {
          "id": 301,
          "title": "Set up email account",
          "description": "",
          "due_at": "2026-03-02 16:00:00",
          "due_at_date": "2026-03-02",
          "due_at_time": "16:00:00",
          "due_at_utc": "2026-03-02 15:00:00",
          "due_at_date_utc": "2026-03-02",
          "due_at_time_utc": "15:00:00",
          "assignee_user_id": 600,
          "assignee_user": {
            "user_id": 600,
            "type": "user",
            "name": "Will Dawson",
            "org_id": 1,
            "mail": ["will@acme.com"]
          },
          "priority": "urgent",
          "completed": false,
          "completed_at": null,
          "completed_at_utc": null
        },
        {
          "id": 303,
          "title": "Add to payroll",
          "description": "",
          "due_at": null,
          "due_at_date": null,
          "due_at_time": null,
          "due_at_utc": null,
          "due_at_date_utc": null,
          "due_at_time_utc": null,
          "assignee_user_id": 601,
          "assignee_user": {
            "user_id": 601,
            "type": "user",
            "name": "Juliet Adams",
            "org_id": 1,
            "mail": ["juliet@acme.com"]
          },
          "priority": null,
          "completed": false,
          "completed_at": null,
          "completed_at_utc": null
        }
      ]
    }
  ]
}
```

**General behavior**

- The tasks you send replace the whole list. Send every task you want to keep.
- A task with `id` updates that task. A task without `id` becomes a new task.
- Send the properties you want to keep for each task, like `due_at` or `assignee_user_id`.
- To write back a due date from a response, send `due_at_utc`. Tape reads it as UTC.
- To clear the field, send `null` or an empty array `[]`. This also works for a required checklist field.
- Fields that aren't in the request keep their values.

```json title="Request: clear the field"
{
  "fields": {
    "onboarding_tasks": null
  }
}
```

A cleared field isn't in the `fields` of the response.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- A task without a title returns `400`. Every task in an update needs a title, so a typo can't replace your list with empty tasks.

See [Errors](/docs/api/errors) for all error codes.

## Next steps

- [Checklist field](/docs/api/resource/field/checklist): create checklist fields and set `show_in_focus`.
- [Date & timezone](/docs/api/date-timezone): date formats and timezones of `due_at`.
- [User](/docs/api/resource/user): find the user IDs for `assignee_user_id`.
- [Field value](/docs/api/resource/field-value/overview): how all field values work.
- [Record](/docs/api/resource/record): create, read, update and delete records, with all query parameters.
- [Filter](/docs/api/resource/filter#checklist): find records by their tasks.
