---
id: status
title: Status field value
sidebar_label: Status
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use a status field value to read and set the status of a record.

The value of a [status field](/docs/api/resource/field/status) is one option with its `id`, `text`, `color` and `means_completed`. `means_completed` tells you whether the record is done.

```json title="Status field value object"
{
  "field_id": 1,
  "external_id": "status",
  "label": "Status",
  "type": "category",
  "field_type": "status",
  "values": [
    {
      "value": {
        "id": 1,
        "text": "Open",
        "color": "0077DE",
        "means_completed": false
      }
    }
  ]
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"category"`. A status field value has the same `type` as a category field value. | `"category"` |
| `field_type` | `string` | `"status"`. | `"status"` |
| `values[].value.id` | `number` | ID of the selected option. | `1` |
| `values[].value.text` | `string` | Label of the selected option. | `"Open"` |
| `values[].value.color` | `string` | Color of the option as a hex value without `#`. | `"0077DE"` |
| `values[].value.means_completed` | `boolean` | Whether the option marks the record as done. | `false` |

Each field in a record response also contains the field's `config`. The examples on this page leave it out.

## Record creation

Use the [create record endpoint](/docs/api/resource/record#create-a-record) to set the status of a new record.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

The example creates the task "Send signed lease to the tenant" in the tasks app from [Status field](/docs/api/resource/field/status). It sets the "Status" field (ID `1`, type `status`, slug `status`) to the option with ID `1`, "Open".

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/record/app/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "title": "Send signed lease to the tenant",
      "status": 1
    }
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "fields": {
    "title": "Send signed lease to the tenant",
    "status": 1
  }
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "record_id": 1,
  "title": "Send signed lease to the tenant",
  "fields": [
    {
      "field_id": 2,
      "external_id": "title",
      "label": "Title",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Send signed lease to the tenant" }]
    },
    {
      "field_id": 1,
      "external_id": "status",
      "label": "Status",
      "type": "category",
      "field_type": "status",
      "values": [
        {
          "value": {
            "id": 1,
            "text": "Open",
            "color": "0077DE",
            "means_completed": false
          }
        }
      ]
    }
  ]
}
```

**General behavior**

- Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
- Select an option by its ID or by its label. Tape compares labels case-insensitively and ignores spaces at the start and the end.
- Find the option IDs in `config.settings.options` of the field, for example with [Retrieve a single app](/docs/api/resource/app#retrieve-a-single-app).
- Tape also accepts `{ "id": 1 }`, `{ "value": 1 }` and the option object of a record response.
- If you send several options, Tape keeps the first option that matches.
- If two options share a label, select the option by its ID.
- Every status field is required. Send a status value with every new record.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- A new record without a status value returns `400`.
- A value that matches no option returns `400`, with or without the query parameter `reject_unresolvable_option_values=true`.
- A label that two options share returns `400`.

See [Errors](/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](/docs/api/resource/record#retrieve-a-record) to read the status of a record.

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

```json title='Response'
{
  "record_id": 1,
  "title": "Send signed lease to the tenant",
  "fields": [
    {
      "field_id": 2,
      "external_id": "title",
      "label": "Title",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Send signed lease to the tenant" }]
    },
    {
      "field_id": 1,
      "external_id": "status",
      "label": "Status",
      "type": "category",
      "field_type": "status",
      "values": [
        {
          "value": {
            "id": 1,
            "text": "Open",
            "color": "0077DE",
            "means_completed": false
          }
        }
      ]
    }
  ]
}
```

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](/docs/api/resource/record#update-a-record) to change the status of a record.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

The example sets the "Status" field of the task with ID `1` to "Done". It selects the option by its label.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X PUT #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "status": "Done"
    }
  }'
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="json" label="JSON">

```json title="Request"
{
  "fields": {
    "status": "Done"
  }
}
```

</TabItem>
</Tabs>

```json title='Response'
{
  "record_id": 1,
  "title": "Send signed lease to the tenant",
  "fields": [
    {
      "field_id": 2,
      "external_id": "title",
      "label": "Title",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Send signed lease to the tenant" }]
    },
    {
      "field_id": 1,
      "external_id": "status",
      "label": "Status",
      "type": "category",
      "field_type": "status",
      "values": [
        {
          "value": {
            "id": 3,
            "text": "Done",
            "color": "00866A",
            "means_completed": true
          }
        }
      ]
    }
  ]
}
```

**General behavior**

- The option you send replaces the current status.
- You can't clear a status value.
- Fields that aren't in the request keep their values.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- `null`, an empty string `""` or an empty array `[]` returns `400` with a message that the status field can't be unset.
- A value that matches no option returns `400`.

See [Errors](/docs/api/errors) for all error codes.

## Next steps

- [Status field](/docs/api/resource/field/status): create status fields and change their options.
- [Category field value](/docs/api/resource/field-value/category): select options without a completed state.
- [Field value](/docs/api/resource/field-value/overview): how all field values work.
- [Record](/docs/api/resource/record): create, read, update and delete records, with all query parameters.
- [Filter](/docs/api/resource/filter#status): find open or completed records.
