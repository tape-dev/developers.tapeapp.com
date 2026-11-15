# Attachment field value

> Use an attachment field value to read and write the files of a record.

Use an attachment field value to read and write the files of a record.

Each value of an [attachment field](https://developers.tapeapp.com/docs/api/resource/field/attachment) is one file. A `single_attachment` field holds at most one file. A `multi_attachment` field holds several files.

Attachment fields accept any file type. For a field that holds only images, see [Image field value](https://developers.tapeapp.com/docs/api/resource/field-value/image).

*Attachment field value object*

```json
{
  "field_id": 2,
  "external_id": "letter_of_recommendation",
  "label": "Letter of recommendation",
  "type": "file",
  "field_type": "single_attachment",
  "values": [
    {
      "value": {
        "file_id": 100,
        "name": "letter-of-recommendation.pdf",
        "size": 123000,
        "mimetype": "application/pdf",
        "download_url": "https://s3.eu-central-1.amazonaws.com/tape-attachments/9d43730ffad8d249e3ac313193cd83?Expires=1772442000&Signature=VzrbvlfI35hp4iU7jMa%2BK%2FnutPU%3D",
        "view_url": "https://s3.eu-central-1.amazonaws.com/tape-attachments/9d43730ffad8d249e3ac313193cd83?Expires=1772442000&Signature=Hk2c8vQx1pLm9sTnW4yR%2FaB7dEo%3D",
        "link": "https://s3.eu-central-1.amazonaws.com/tape-attachments/9d43730ffad8d249e3ac313193cd83?Expires=1772442000&Signature=VzrbvlfI35hp4iU7jMa%2BK%2FnutPU%3D",
        "created_by": null,
        "created_on": "2026-03-02 09:15:00",
        "created_on_utc": "2026-03-02 08:15:00",
        "last_modified_on": "2026-03-02 09:15:00",
        "last_modified_on_utc": "2026-03-02 08:15:00"
      }
    }
  ]
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"file"` for both attachment field types. | `"file"` |
| `field_type` | `string` | `"single_attachment"` or `"multi_attachment"`. | `"single_attachment"` |
| `values[].value.file_id` | `number` | ID of the file in this field. | `100` |
| `values[].value.name` | `string` | File name. | `"letter-of-recommendation.pdf"` |
| `values[].value.size` | `number` | File size in bytes. | `123000` |
| `values[].value.mimetype` | `string` | Media type of the file. | `"application/pdf"` |
| `values[].value.download_url` | `string` | Signed URL that downloads the file. |  |
| `values[].value.view_url` | `string` | Signed URL that opens the file in the browser. |  |
| `values[].value.link` | `string` | Same as `download_url`, for older integrations. Use `download_url` instead. |  |
| `values[].value.created_by` | `null` | Not filled. The value is `null`. | `null` |
| `values[].value.created_on` | `string` | When the file was added, in your timezone. | `"2026-03-02 09:15:00"` |
| `values[].value.created_on_utc` | `string` | When the file was added, in UTC. | `"2026-03-02 08:15:00"` |
| `values[].value.last_modified_on` | `string` | When the file last changed, in your timezone. | `"2026-03-02 09:15:00"` |
| `values[].value.last_modified_on_utc` | `string` | When the file last changed, in UTC. | `"2026-03-02 08:15:00"` |

The signed URLs expire after some hours. Retrieve the record again to get new ones.

Each field in a record response also contains the field's `config`. The examples on this page leave it out. They also shorten each file to `file_id`, `name`, `size` and `mimetype`.

## Record creation

Use the [create record endpoint](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) to attach files to a new record.

`POST https://api.tapeapp.com/v1/record/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "name": "Zoe Maxwell",
      "letter_of_recommendation": "temporary-file-1",
      "hr_documents": ["temporary-file-2", "temporary-file-3"]
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "name": "Zoe Maxwell",
    "letter_of_recommendation": "temporary-file-1",
    "hr_documents": ["temporary-file-2", "temporary-file-3"]
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Zoe Maxwell",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Zoe Maxwell" }]
    },
    {
      "field_id": 2,
      "external_id": "letter_of_recommendation",
      "label": "Letter of recommendation",
      "type": "file",
      "field_type": "single_attachment",
      "values": [
        {
          "value": {
            "file_id": 100,
            "name": "letter-of-recommendation.pdf",
            "size": 123000,
            "mimetype": "application/pdf"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "hr_documents",
      "label": "HR documents",
      "type": "file",
      "field_type": "multi_attachment",
      "values": [
        {
          "value": {
            "file_id": 101,
            "name": "employment-contract.pdf",
            "size": 150000,
            "mimetype": "application/pdf"
          }
        },
        {
          "value": {
            "file_id": 102,
            "name": "tax-form.pdf",
            "size": 160000,
            "mimetype": "application/pdf"
          }
        }
      ]
    }
  ]
}
```

First, [upload the files](https://developers.tapeapp.com/docs/api/resource/file#upload-a-file). Each upload returns a temporary file ID like `temporary-file-1`. Then send these IDs in the field values.

The example creates the applicant "Zoe Maxwell". It sets the "Letter of recommendation" field (ID `2`, type `single_attachment`, slug `letter_of_recommendation`) and the "HR documents" field (ID `3`, type `multi_attachment`, slug `hr_documents`).

**General behavior**

-   Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
-   A field value accepts these file IDs:
    -   Temporary file IDs from your own uploads, like `"temporary-file-1"`.
    -   File IDs of comment and reply attachments, like `"comment-file-12"` or `"reply-file-7"`. See [Record comment](https://developers.tapeapp.com/docs/api/resource/record-comment).
    -   The `file_id` of a file in another attachment or image field, as a number. Tape copies the file, and the copy gets a new `file_id`.
-   Tape also accepts objects like `{ "file_id": "temporary-file-1" }` or `{ "value": "temporary-file-1" }`, and arrays of these.
-   Send one file to a `single_attachment` field. If you send an array, Tape uses its first file.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   A temporary file ID that you didn't upload yourself returns `403`.
-   A string that isn't a valid file ID returns `400`.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record) to read the files of a record.

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
  "title": "Zoe Maxwell",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Zoe Maxwell" }]
    },
    {
      "field_id": 2,
      "external_id": "letter_of_recommendation",
      "label": "Letter of recommendation",
      "type": "file",
      "field_type": "single_attachment",
      "values": [
        {
          "value": {
            "file_id": 100,
            "name": "letter-of-recommendation.pdf",
            "size": 123000,
            "mimetype": "application/pdf"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "hr_documents",
      "label": "HR documents",
      "type": "file",
      "field_type": "multi_attachment",
      "values": [
        {
          "value": {
            "file_id": 101,
            "name": "employment-contract.pdf",
            "size": 150000,
            "mimetype": "application/pdf"
          }
        },
        {
          "value": {
            "file_id": 102,
            "name": "tax-form.pdf",
            "size": 160000,
            "mimetype": "application/pdf"
          }
        }
      ]
    }
  ]
}
```

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](https://developers.tapeapp.com/docs/api/resource/record#update-a-record) to change the files of a record.

`PUT https://api.tapeapp.com/v1/record/{record_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "letter_of_recommendation": "temporary-file-4",
      "hr_documents": ["temporary-file-5", 102]
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "letter_of_recommendation": "temporary-file-4",
    "hr_documents": ["temporary-file-5", 102]
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Zoe Maxwell",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Zoe Maxwell" }]
    },
    {
      "field_id": 2,
      "external_id": "letter_of_recommendation",
      "label": "Letter of recommendation",
      "type": "file",
      "field_type": "single_attachment",
      "values": [
        {
          "value": {
            "file_id": 103,
            "name": "letter-of-recommendation-signed.pdf",
            "size": 125000,
            "mimetype": "application/pdf"
          }
        }
      ]
    },
    {
      "field_id": 3,
      "external_id": "hr_documents",
      "label": "HR documents",
      "type": "file",
      "field_type": "multi_attachment",
      "values": [
        {
          "value": {
            "file_id": 102,
            "name": "tax-form.pdf",
            "size": 160000,
            "mimetype": "application/pdf"
          }
        },
        {
          "value": {
            "file_id": 104,
            "name": "employment-contract-signed.pdf",
            "size": 152000,
            "mimetype": "application/pdf"
          }
        }
      ]
    }
  ]
}
```

The example replaces the letter of recommendation of the applicant with ID `1` with a new upload. In "HR documents", it adds a new upload and keeps the file with ID `102`. The file with ID `101` isn't in the request, so Tape removes it from the field.

**General behavior**

-   The files in the request replace the old files. To keep a file, send its `file_id` again.
-   In a `multi_attachment` field, a file that's already in the field keeps its `file_id`.
-   Tape lists the files in the order they were added, not in the order of the request. A kept file comes before a new one.
-   To clear the field, send `null` or an empty array `[]`.
-   You can't clear a required field. The request returns `400`.
-   Fields that aren't in the request keep their values.

*Request: clear the field*

```json
{
  "fields": {
    "hr_documents": null
  }
}
```

A cleared field isn't in the `fields` of the response.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

Same errors as under [Record creation](#record-creation). An update also returns this error:

-   A numeric `file_id` that isn't a positive whole number, like `1.5`, returns `400` with `validation` and the message `… Expected a valid existing attachment ID …`. A number in a string, like `"100"`, returns the same error.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Next steps

[

Attachment field

create and change attachment fields.

](https://developers.tapeapp.com/docs/api/resource/field/attachment)[

File

upload files and get temporary file IDs.

](https://developers.tapeapp.com/docs/api/resource/file)[

Image field value

store images in a record.

](https://developers.tapeapp.com/docs/api/resource/field-value/image)[

Field value

how all field values work.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Record

create, read, update and delete records.

](https://developers.tapeapp.com/docs/api/resource/record)
