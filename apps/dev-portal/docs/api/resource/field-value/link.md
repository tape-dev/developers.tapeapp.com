---
id: link
title: Link field value
sidebar_label: Link
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use a link field value to read and write the links of a record.

The value of a [link field](/docs/api/resource/field/link) is a list of links in `values`. Each link has an `embed_id`, the `url`, a preview with `title` and `description`, and a type label in `link_type`.

```json title="Link field value object"
{
  "field_id": 2,
  "external_id": "website",
  "label": "Website",
  "type": "embed",
  "field_type": "multi_link",
  "values": [
    {
      "embed_id": 100,
      "url": "https://acme.com",
      "original_url": "https://acme.com",
      "title": "Acme Inc.",
      "description": "Solar panels and storage for homes and businesses.",
      "type": "link",
      "link_type": "homepage",
      "created_at": "2026-11-11 10:15:00",
      "created_at_utc": "2026-11-11 09:15:00",
      "last_modified_at": "2026-11-11 10:15:00",
      "last_modified_at_utc": "2026-11-11 09:15:00",
      "created_by_user_id": 1,
      "created_by_workflow_def_id": null,
      "created_by_share_session_id": null,
      "last_modified_by_user_id": 1,
      "last_modified_by_workflow_def_id": null,
      "last_modified_by_share_session_id": null
    }
  ]
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"embed"` for a link field. | `"embed"` |
| `field_type` | `string` | `"multi_link"`. | `"multi_link"` |
| `values[].embed_id` | `number` | ID of the link. Send it in an update to keep the link. | `100` |
| `values[].url` | `string` | The web address. | `"https://acme.com"` |
| `values[].original_url` | `string` | The same web address as `url`. | `"https://acme.com"` |
| `values[].title` | `string` | Title of the web page. Empty until Tape has created the preview. | `"Acme Inc."` |
| `values[].description` | `string` | Description of the web page. Empty until Tape has created the preview. | `"Solar panels and storage for homes and businesses."` |
| `values[].type` | `string` | `"link"` for every link. | `"link"` |
| `values[].link_type` | `string` or `null` | Type label: `"homepage"`, `"work"`, `"home"`, `"linkedin"`, `"x"`, `"instagram"`, `"facebook"`, `"youtube"`, `"tiktok"`, `"threads"`, `"reddit"`, `"bluesky"`, `"other"` or the text of a custom label of the field. `null` for a link without a label. | `"homepage"` |
| `values[].created_at`, `values[].last_modified_at` | `string` | When the link was added and last changed, in your timezone. | `"2026-11-11 10:15:00"` |
| `values[].created_at_utc`, `values[].last_modified_at_utc` | `string` | The same times in UTC. | `"2026-11-11 09:15:00"` |
| `values[].created_by_user_id`, `values[].last_modified_by_user_id` | `number` or `null` | ID of the user who added or last changed the link. | `1` |
| `values[].created_by_workflow_def_id`, `values[].last_modified_by_workflow_def_id` | `number` or `null` | ID of the automation that added or last changed the link. | `null` |
| `values[].created_by_share_session_id`, `values[].last_modified_by_share_session_id` | `string` or `null` | Session ID (UUID) of an anonymous visitor who added or changed the link through a shared link. | `null` |

Each field in a record response also contains the field's `config`. The examples on this page leave it out. They also leave out the times and author IDs of each link.

## Record creation

Use the [create record endpoint](/docs/api/resource/record#create-a-record) to set links on a new record.

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/record/app/{app_id}" />

The example sets the homepage and the LinkedIn profile in the "Website" field (ID `2`, type `multi_link`, slug `website`) of a new company.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X POST #BASE_URL/v1/record/app/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "name": "Acme Inc.",
      "website": [
        { "url": "https://acme.com", "type": "homepage" },
        { "url": "https://www.linkedin.com/company/acme", "type": "linkedin" }
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
    "name": "Acme Inc.",
    "website": [
      { "url": "https://acme.com", "type": "homepage" },
      { "url": "https://www.linkedin.com/company/acme", "type": "linkedin" }
    ]
  }
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "record_id": 1,
  "title": "Acme Inc.",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Acme Inc." }]
    },
    {
      "field_id": 2,
      "external_id": "website",
      "label": "Website",
      "type": "embed",
      "field_type": "multi_link",
      "values": [
        {
          "embed_id": 100,
          "url": "https://acme.com",
          "original_url": "https://acme.com",
          "title": "",
          "description": "",
          "type": "link",
          "link_type": "homepage"
        },
        {
          "embed_id": 101,
          "url": "https://www.linkedin.com/company/acme",
          "original_url": "https://www.linkedin.com/company/acme",
          "title": "",
          "description": "",
          "type": "link",
          "link_type": "linkedin"
        }
      ]
    }
  ]
}
```

**General behavior**

- Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
- Send an array of links. Each one is an object `{ "url": "...", "type": "..." }` or a URL string.
- `type` is optional. Without it, or with a `type` Tape doesn't know, the link has no label (`"link_type": null`).
- A `type` that matches the text of a custom label of the field (not case-sensitive) gets that label.
- If the field's `label_setting` is `"none"`, Tape ignores `type`.
- A URL without a scheme gets `https://`, for example `acme.com` becomes `https://acme.com`.
- Tape creates the link previews in the background. Right after the request, `title` and `description` are empty. [Retrieve the record](#record-retrieval) later to read them.
- A required link field needs at least one link on a new record. An empty array `[]` counts as missing.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

- A link that isn't a valid URL returns `400`. This includes a URL made of digits only, such as `"1"`.
- A `type` that matches more than one custom label of the field returns `400`. Use a unique label.

See [Errors](/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](/docs/api/resource/record#retrieve-a-record) to read the links of a record.

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/record/{record_id}" />

<ContextCodeBlock language="shell" title='Request'>
{`curl #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN"`}
</ContextCodeBlock>

The example shows the record after Tape has created the link previews.

```json title="Response"
{
  "record_id": 1,
  "title": "Acme Inc.",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Acme Inc." }]
    },
    {
      "field_id": 2,
      "external_id": "website",
      "label": "Website",
      "type": "embed",
      "field_type": "multi_link",
      "values": [
        {
          "embed_id": 100,
          "url": "https://acme.com",
          "original_url": "https://acme.com",
          "title": "Acme Inc.",
          "description": "Solar panels and storage for homes and businesses.",
          "type": "link",
          "link_type": "homepage"
        },
        {
          "embed_id": 101,
          "url": "https://www.linkedin.com/company/acme",
          "original_url": "https://www.linkedin.com/company/acme",
          "title": "Acme Inc. | LinkedIn",
          "description": "Acme Inc. builds solar panels and storage for homes and businesses.",
          "type": "link",
          "link_type": "linkedin"
        }
      ]
    }
  ]
}
```

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](/docs/api/resource/record#update-a-record) to change the links of a record.

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/record/{record_id}" />

The example keeps the homepage with `embed_id` `100`, removes the LinkedIn profile and adds a profile on X.

<Tabs defaultValue="curl">

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Request'>
{`curl -X PUT #BASE_URL/v1/record/1 \\
  -H "Authorization: Bearer $TAPE_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{
    "fields": {
      "website": [
        { "embed_id": 100, "type": "homepage" },
        { "url": "https://x.com/acme", "type": "x" }
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
    "website": [
      { "embed_id": 100, "type": "homepage" },
      { "url": "https://x.com/acme", "type": "x" }
    ]
  }
}
```

</TabItem>
</Tabs>

```json title="Response"
{
  "record_id": 1,
  "title": "Acme Inc.",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Acme Inc." }]
    },
    {
      "field_id": 2,
      "external_id": "website",
      "label": "Website",
      "type": "embed",
      "field_type": "multi_link",
      "values": [
        {
          "embed_id": 100,
          "url": "https://acme.com",
          "original_url": "https://acme.com",
          "title": "Acme Inc.",
          "description": "Solar panels and storage for homes and businesses.",
          "type": "link",
          "link_type": "homepage"
        },
        {
          "embed_id": 102,
          "url": "https://x.com/acme",
          "original_url": "https://x.com/acme",
          "title": "",
          "description": "",
          "type": "link",
          "link_type": "x"
        }
      ]
    }
  ]
}
```

**General behavior**

- The new list replaces the old list. Tape removes links that aren't in the request.
- To keep a link with its preview, send its `embed_id`. Tape ignores `url`, `title` and `description` next to an `embed_id` the field holds.
- An `embed_id` the field doesn't hold returns `400`. If you send a `url` next to it, Tape adds a new link from that `url` instead.
- Send the `type` of a kept link again. A link you send without `type` loses its label.
- Each URL adds a new link with a new `embed_id`, even if the record already has the same URL. Tape creates its preview in the background.
- You can't change the URL of a link. Remove the link and add a new one.
- To clear the field, send `null` or an empty array `[]`. This also works for a required link field.
- Fields that aren't in the request keep their values.

```json title="Request: clear the field"
{
  "fields": {
    "website": null
  }
}
```

A cleared field isn't in the `fields` of the response.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

Same errors as under [Record creation](#record-creation). An update also returns this error:

- More links than Tape allows in one link field return `400` with `validation` and the message `Maximal number of link entries is …`.

See [Errors](/docs/api/errors) for all error codes.

## Next steps

- [Link field](/docs/api/resource/field/link): create and change link fields.
- [Field value](/docs/api/resource/field-value/overview): how all field values work.
- [Record](/docs/api/resource/record): create, read, update and delete records.
- [Filter](/docs/api/resource/filter#multi-link): find records by their links.
