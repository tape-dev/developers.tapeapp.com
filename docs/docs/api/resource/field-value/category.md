# Category field value

> Use a category field value to read and set the selected options of a record.

Use a category field value to read and set the selected options of a record.

The value of a [category field](https://developers.tapeapp.com/docs/api/resource/field/category) is a list of selected options. Each element of `values` holds one option with its `id`, `text` and `color`. A `single_category` field holds at most one option, a `multi_category` field any number.

*Category field value object*

```json
{
  "field_id": 2,
  "external_id": "products",
  "label": "Products",
  "type": "category",
  "field_type": "multi_category",
  "values": [
    { "value": { "id": 5, "text": "Solar panels", "color": "DEA700" } },
    { "value": { "id": 6, "text": "Battery storage", "color": "00866A" } }
  ]
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"category"` for both category field types. | `"category"` |
| `field_type` | `string` | `"single_category"` or `"multi_category"`. | `"multi_category"` |
| `values[].value.id` | `number` | ID of the selected option. | `5` |
| `values[].value.text` | `string` | Label of the selected option. | `"Solar panels"` |
| `values[].value.color` | `string` | Color of the option as a hex value without `#`. | `"DEA700"` |

Each field in a record response also contains the field's `config`. The examples on this page leave it out.

## Record creation

Use the [create record endpoint](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) to select options on a new record.

`POST https://api.tapeapp.com/v1/record/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "pipeline_stage": "Contacted",
      "products": [5, 6]
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "pipeline_stage": "Contacted",
    "products": [5, 6]
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Contacted",
  "fields": [
    {
      "field_id": 1,
      "external_id": "pipeline_stage",
      "label": "Pipeline Stage",
      "type": "category",
      "field_type": "single_category",
      "values": [
        { "value": { "id": 2, "text": "Contacted", "color": "0077DE" } }
      ]
    },
    {
      "field_id": 2,
      "external_id": "products",
      "label": "Products",
      "type": "category",
      "field_type": "multi_category",
      "values": [
        { "value": { "id": 5, "text": "Solar panels", "color": "DEA700" } },
        { "value": { "id": 6, "text": "Battery storage", "color": "00866A" } }
      ]
    }
  ]
}
```

The example creates a lead with the "Pipeline Stage" field (ID `1`, type `single_category`, slug `pipeline_stage`) and the "Products" field (ID `2`, type `multi_category`, slug `products`). It selects "Contacted" by its label and two products by their option IDs.

**General behavior**

-   Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
-   Select an option by its ID or by its label. Tape compares labels case-insensitively and ignores spaces at the start and the end.
-   Find the option IDs in `config.settings.options` of the field, for example with [Retrieve a single app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app).
-   Send one option or an array of options. Tape also accepts `{ "id": 5 }`, `{ "value": 5 }` and the option objects of a record response.
-   A number selects the option with that ID. If no option has that ID, Tape compares the number with the labels.
-   A `single_category` field keeps the first option that matches.
-   If two options share a label, select the option by its ID.
-   Tape skips a label that matches no option. To get a `400` instead, add the query parameter `reject_unresolvable_option_values=true`.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   A label that two options share returns `400`.
-   A number that matches neither an option ID nor a label of the field returns `400`.
-   A value that matches no option returns `400` if you add `reject_unresolvable_option_values=true`.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record) to read the selected options of a record.

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
  "title": "Contacted",
  "fields": [
    {
      "field_id": 1,
      "external_id": "pipeline_stage",
      "label": "Pipeline Stage",
      "type": "category",
      "field_type": "single_category",
      "values": [
        { "value": { "id": 2, "text": "Contacted", "color": "0077DE" } }
      ]
    },
    {
      "field_id": 2,
      "external_id": "products",
      "label": "Products",
      "type": "category",
      "field_type": "multi_category",
      "values": [
        { "value": { "id": 5, "text": "Solar panels", "color": "DEA700" } },
        { "value": { "id": 6, "text": "Battery storage", "color": "00866A" } }
      ]
    }
  ]
}
```

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](https://developers.tapeapp.com/docs/api/resource/record#update-a-record) to change the selected options of a record.

`PUT https://api.tapeapp.com/v1/record/{record_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "pipeline_stage": 3,
      "products": ["Battery storage"]
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "pipeline_stage": 3,
    "products": ["Battery storage"]
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Won",
  "fields": [
    {
      "field_id": 1,
      "external_id": "pipeline_stage",
      "label": "Pipeline Stage",
      "type": "category",
      "field_type": "single_category",
      "values": [
        { "value": { "id": 3, "text": "Won", "color": "00866A" } }
      ]
    },
    {
      "field_id": 2,
      "external_id": "products",
      "label": "Products",
      "type": "category",
      "field_type": "multi_category",
      "values": [
        { "value": { "id": 6, "text": "Battery storage", "color": "00866A" } }
      ]
    }
  ]
}
```

The example moves the lead with ID `1` to "Won" (option ID `3`) and keeps only "Battery storage" in the "Products" field.

**General behavior**

-   The options you send replace the selected options.
-   To clear the field, send `null`, an empty string `""` or an empty array `[]`.
-   You can't clear a required field. The request returns `400`.
-   A value in which no option matches clears the field. To get a `400` instead, add the query parameter `reject_unresolvable_option_values=true`.
-   Fields that aren't in the request keep their values.

*Request: clear the field*

```json
{
  "fields": {
    "products": null
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

Category field

create category fields and change their options.

](https://developers.tapeapp.com/docs/api/resource/field/category)[

Status field value

set the status of a record.

](https://developers.tapeapp.com/docs/api/resource/field-value/status)[

Field value

how all field values work.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Record

create, read, update and delete records, with all query parameters.

](https://developers.tapeapp.com/docs/api/resource/record)[

Filter

find records by their selected options.

](https://developers.tapeapp.com/docs/api/resource/filter#single-category)
