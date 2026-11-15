# Attachment field

> Use an attachment field to store files like PDFs, spreadsheets or images in a record.

Use an attachment field to store files like PDFs, spreadsheets or images in a record.

Tape has two attachment field types. Both are the **Files** field in Tape:

-   `single_attachment` holds one file.
-   `multi_attachment` holds several files.

An attachment field has the [common field properties](https://developers.tapeapp.com/docs/api/resource/field/overview#common-properties) and read-only `settings`. To read and write the files of a record, see [Attachment field value](https://developers.tapeapp.com/docs/api/resource/field-value/attachment).

*Attachment field object*

```json
{
  "field_id": 2,
  "external_id": "receipts",
  "slug": "receipts",
  "label": "Receipts",
  "type": "file",
  "field_type": "multi_attachment",
  "config": {
    "label": "Receipts",
    "slug": "receipts",
    "external_id": "receipts",
    "description": "Receipts that belong to the invoice.",
    "show_description": true,
    "required": false,
    "always_hidden": false,
    "hidden_if_empty": false,
    "primary": false,
    "settings": {
      "multiple": true
    }
  }
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"file"` for both attachment field types. | `"file"` |
| `field_type` | `string` | `"single_attachment"` or `"multi_attachment"`. | `"multi_attachment"` |
| `config.settings.multiple` (read-only) | `boolean` | `false` for `single_attachment`, `true` for `multi_attachment`. | `true` |

You can't set `settings` through the API. The field type decides whether the field holds one or several files.

## App creation

Use the [create app endpoint](https://developers.tapeapp.com/docs/api/resource/app#create-an-app) to create attachment fields together with a new app.

`POST https://api.tapeapp.com/v1/app`

**cURL**

*Request*

```shell

curl -X POST https://api.tapeapp.com/v1/app/ \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "workspace_id": 1,
    "name": "Invoices",
    "item_name": "Invoice",
    "fields": [
      {
        "field_type": "single_attachment",
        "config": {
          "label": "Invoice PDF",
          "description": "The invoice as a PDF file.",
          "required": false
        }
      },
      {
        "field_type": "multi_attachment",
        "config": {
          "label": "Receipts",
          "description": "Receipts that belong to the invoice.",
          "required": false
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
  "name": "Invoices",
  "item_name": "Invoice",
  "fields": [
    {
      "field_type": "single_attachment",
      "config": {
        "label": "Invoice PDF",
        "description": "The invoice as a PDF file.",
        "required": false
      }
    },
    {
      "field_type": "multi_attachment",
      "config": {
        "label": "Receipts",
        "description": "Receipts that belong to the invoice.",
        "required": false
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
  "slug": "invoices",
  "external_id": "invoices",
  "name": "Invoices",
  "record_name": "Invoice",
  "item_name": "Invoice",
  "type": "database",
  "config": {
    "item_name": "Invoice",
    "name": "Invoices"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "invoice_pdf",
      "slug": "invoice_pdf",
      "label": "Invoice PDF",
      "type": "file",
      "field_type": "single_attachment",
      "config": {
        "label": "Invoice PDF",
        "slug": "invoice_pdf",
        "external_id": "invoice_pdf",
        "description": "The invoice as a PDF file.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "multiple": false
        }
      }
    },
    {
      "field_id": 2,
      "external_id": "receipts",
      "slug": "receipts",
      "label": "Receipts",
      "type": "file",
      "field_type": "multi_attachment",
      "config": {
        "label": "Receipts",
        "slug": "receipts",
        "external_id": "receipts",
        "description": "Receipts that belong to the invoice.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "multiple": true
        }
      }
    }
  ]
}
```

The example creates an invoices app in the workspace with ID `1`. The app gets a `single_attachment` field "Invoice PDF" and a `multi_attachment` field "Receipts". The example leaves out other fields of an invoices app, like "Amount" or "Due date".

Find the workspace ID with [Retrieve workspaces](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspaces).

**General behavior**

-   Without `primary`, Tape makes the first field of the request the primary field. Here, that's "Invoice PDF".
-   A new attachment field doesn't show its `description` as help text yet (`show_description` is `false`). To show it, send the `description` again in a field update.

**Requirements:** `apps:edit`, and a workspace role that may edit apps in the workspace. Works with a personal access token, an OAuth access token or a user API key.

## App update

Use the [update app endpoint](https://developers.tapeapp.com/docs/api/resource/app#update-an-app) to create new attachment fields in an app or to change existing ones.

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
          "label": "Invoice PDF",
          "description": "The invoice as a PDF file.",
          "required": true
        }
      },
      {
        "field_type": "multi_attachment",
        "config": {
          "label": "Other files",
          "description": "Contracts, delivery notes and other files.",
          "required": false
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
        "label": "Invoice PDF",
        "description": "The invoice as a PDF file.",
        "required": true
      }
    },
    {
      "field_type": "multi_attachment",
      "config": {
        "label": "Other files",
        "description": "Contracts, delivery notes and other files.",
        "required": false
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
  "slug": "invoices",
  "external_id": "invoices",
  "name": "Invoices",
  "record_name": "Invoice",
  "item_name": "Invoice",
  "type": "database",
  "config": {
    "item_name": "Invoice",
    "name": "Invoices"
  },
  "fields": [
    {
      "field_id": 1,
      "external_id": "invoice_pdf",
      "slug": "invoice_pdf",
      "label": "Invoice PDF",
      "type": "file",
      "field_type": "single_attachment",
      "config": {
        "label": "Invoice PDF",
        "slug": "invoice_pdf",
        "external_id": "invoice_pdf",
        "description": "The invoice as a PDF file.",
        "show_description": true,
        "required": true,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": true,
        "settings": {
          "multiple": false
        }
      }
    },
    {
      "field_id": 2,
      "external_id": "receipts",
      "slug": "receipts",
      "label": "Receipts",
      "type": "file",
      "field_type": "multi_attachment",
      "config": {
        "label": "Receipts",
        "slug": "receipts",
        "external_id": "receipts",
        "description": "Receipts that belong to the invoice.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "multiple": true
        }
      }
    },
    {
      "field_id": 3,
      "external_id": "other_files",
      "slug": "other_files",
      "label": "Other files",
      "type": "file",
      "field_type": "multi_attachment",
      "config": {
        "label": "Other files",
        "slug": "other_files",
        "external_id": "other_files",
        "description": "Contracts, delivery notes and other files.",
        "show_description": false,
        "required": false,
        "always_hidden": false,
        "hidden_if_empty": false,
        "primary": false,
        "settings": {
          "multiple": true
        }
      }
    }
  ]
}
```

The example makes the "Invoice PDF" field (ID `1`) of the invoices app required and creates a new `multi_attachment` field "Other files". The "Receipts" field isn't in the request, so it stays unchanged.

Find the app ID and the field IDs in the [Developer view of the app](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

**General behavior**

-   A field with `field_id` updates that field. A field without `field_id` creates a new field and needs a `field_type`.
-   Send `required`, `always_hidden`, `hidden_if_empty` and `description` with every field you update. Tape sets left-out switches to `false` and hides the help text without `description`. See [Create and update fields](https://developers.tapeapp.com/docs/api/resource/field/overview#create-and-update-fields).
-   Fields that aren't in the request stay unchanged.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   Every field you update needs `config.label`, even if the label stays the same. Without it, Tape rejects the request with `400` and `input_validation`. The message reads, for example, `Invalid input: data/fields/0/config must have required property 'label'`.

## Next steps

[

Attachment field value

read and write the files of a record.

](https://developers.tapeapp.com/docs/api/resource/field-value/attachment)[

File

upload files before you attach them to a record.

](https://developers.tapeapp.com/docs/api/resource/file)[

Image field

a field that holds only images.

](https://developers.tapeapp.com/docs/api/resource/field/image)[

Field

the properties all field types share.

](https://developers.tapeapp.com/docs/api/resource/field/overview)[

App

create, update and delete apps with their fields.

](https://developers.tapeapp.com/docs/api/resource/app)[

Capabilities

what `apps:edit` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
