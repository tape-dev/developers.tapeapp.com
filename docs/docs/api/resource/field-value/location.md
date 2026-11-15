# Location field value

> Use a location field value to read and write the address of a record.

Use a location field value to read and write the address of a record.

The value of a [location field](https://developers.tapeapp.com/docs/api/resource/field/location) is one address. `values` holds one object with the full address in `value`, its parts and its coordinates.

*Location field value object*

```json
{
  "field_id": 2,
  "external_id": "address",
  "label": "Address",
  "type": "location",
  "field_type": "single_location",
  "values": [
    {
      "city": "San Francisco",
      "country": "United States",
      "map_in_sync": false,
      "original_formatted_address": "221 Elm St, San Francisco, CA 94107, USA",
      "postal_code": "94107",
      "state": "California",
      "street_address": "221 Elm St",
      "name": "221 Elm St",
      "value": "221 Elm St, San Francisco, CA 94107, USA",
      "latitude": 37.7694,
      "longitude": -122.4012,
      "lat": 37.7694,
      "lng": -122.4012
    }
  ]
}
```

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `type` | `string` | `"location"` for a location field. | `"location"` |
| `field_type` | `string` | `"single_location"`. | `"single_location"` |
| `values[].value` | `string` | The full address. If a user picked the address in Tape, it's `original_formatted_address`. Otherwise Tape joins the street, the postal code and city, the state and the country with commas. | `"221 Elm St, San Francisco, CA 94107, USA"` |
| `values[].street_address` | `string` | Street and house number. | `"221 Elm St"` |
| `values[].postal_code` | `string` | Postal code. | `"94107"` |
| `values[].city` | `string` | City. | `"San Francisco"` |
| `values[].state` | `string` | State or region. | `"California"` |
| `values[].country` | `string` | Country. | `"United States"` |
| `values[].latitude`, `values[].longitude` | `number` | Coordinates of the address. | `37.7694` |
| `values[].lat`, `values[].lng` | `number` | The same coordinates under their older names. | `37.7694` |
| `values[].original_formatted_address` (read-only) | `string` | The address as Google Maps formatted it when a user picked it in Tape. | `"221 Elm St, San Francisco, CA 94107, USA"` |
| `values[].name` (read-only) | `string` | Name of the place, such as a business or a landmark, when a user picked it in Tape. | `"221 Elm St"` |
| `values[].map_in_sync` (read-only) | `boolean` | Despite its name, `true` means the address was typed or changed by hand and doesn't come from a place picked on the map. Through the API, the value doesn't tell you whether the map matches: a record created through the API gets `true`, an update through the API sets `false`. | `true` |

A part without a value isn't in the response.

Each field in a record response also contains the field's `config`. The examples on this page leave it out.

## Record creation

Use the [create record endpoint](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) to set the address of a new record.

`POST https://api.tapeapp.com/v1/record/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/record/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "name": "Elm Street Townhouse",
      "address": {
        "street_address": "221 Elm Street",
        "postal_code": "94107",
        "city": "San Francisco",
        "state": "California",
        "country": "United States",
        "latitude": 37.7694,
        "longitude": -122.4012
      }
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "name": "Elm Street Townhouse",
    "address": {
      "street_address": "221 Elm Street",
      "postal_code": "94107",
      "city": "San Francisco",
      "state": "California",
      "country": "United States",
      "latitude": 37.7694,
      "longitude": -122.4012
    }
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Elm Street Townhouse",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Elm Street Townhouse" }]
    },
    {
      "field_id": 2,
      "external_id": "address",
      "label": "Address",
      "type": "location",
      "field_type": "single_location",
      "values": [
        {
          "city": "San Francisco",
          "country": "United States",
          "map_in_sync": true,
          "postal_code": "94107",
          "state": "California",
          "street_address": "221 Elm Street",
          "value": "221 Elm Street, 94107 San Francisco, California, United States",
          "latitude": 37.7694,
          "longitude": -122.4012,
          "lat": 37.7694,
          "lng": -122.4012
        }
      ]
    }
  ]
}
```

The example sets the "Address" field (ID `2`, type `single_location`, slug `address`) of a new property, with coordinates for the map.

**General behavior**

-   Use the field ID or the field's slug (returned as `external_id` in records) as the key in `fields`.
-   Send the address as an object with `street_address`, `postal_code`, `city`, `state` and `country`. Each part is optional.
-   `value` is another name for `street_address`. Tape uses it only without `street_address`. A plain string also sets `street_address`, so send a full address as separate parts.
-   Tape doesn't look up coordinates for an address. Send `latitude` and `longitude` to place the address on the map. `lat` and `lng` work too.
-   An address with coordinates only is valid. Tape shows the coordinates as its `value`.

**Requirements:** `records:edit`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   An object with none of the properties `value`, `street_address`, `postal_code`, `city`, `state`, `country`, `latitude`, `longitude`, `lat` and `lng` returns `400`.
-   A part of the address that isn't a string returns `400`.
-   A `latitude` that isn't a number between -90 and 90, or a `longitude` that isn't a number between -180 and 180, returns `400`.
-   A part of the address that's too long returns `400`.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Record retrieval

Use the [retrieve record endpoint](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record) to read the address of a record.

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
  "title": "Elm Street Townhouse",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Elm Street Townhouse" }]
    },
    {
      "field_id": 2,
      "external_id": "address",
      "label": "Address",
      "type": "location",
      "field_type": "single_location",
      "values": [
        {
          "city": "San Francisco",
          "country": "United States",
          "map_in_sync": true,
          "postal_code": "94107",
          "state": "California",
          "street_address": "221 Elm Street",
          "value": "221 Elm Street, 94107 San Francisco, California, United States",
          "latitude": 37.7694,
          "longitude": -122.4012,
          "lat": 37.7694,
          "lng": -122.4012
        }
      ]
    }
  ]
}
```

**Requirements:** `records:read`. Works with a personal access token, an OAuth access token or a user API key.

## Record update

Use the [update record endpoint](https://developers.tapeapp.com/docs/api/resource/record#update-a-record) to change the address of a record.

`PUT https://api.tapeapp.com/v1/record/{record_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "address": {
        "street_address": "225 Elm Street",
        "postal_code": "94107",
        "city": "San Francisco",
        "state": "California",
        "country": "United States",
        "latitude": 37.7695,
        "longitude": -122.4010
      }
    }
  }'
```

**JSON**

*Request*

```json
{
  "fields": {
    "address": {
      "street_address": "225 Elm Street",
      "postal_code": "94107",
      "city": "San Francisco",
      "state": "California",
      "country": "United States",
      "latitude": 37.7695,
      "longitude": -122.4010
    }
  }
}
```

*Response*

```json
{
  "record_id": 1,
  "title": "Elm Street Townhouse",
  "fields": [
    {
      "field_id": 1,
      "external_id": "name",
      "label": "Name",
      "type": "text",
      "field_type": "single_text",
      "values": [{ "value": "Elm Street Townhouse" }]
    },
    {
      "field_id": 2,
      "external_id": "address",
      "label": "Address",
      "type": "location",
      "field_type": "single_location",
      "values": [
        {
          "city": "San Francisco",
          "country": "United States",
          "map_in_sync": false,
          "postal_code": "94107",
          "state": "California",
          "street_address": "225 Elm Street",
          "value": "225 Elm Street, 94107 San Francisco, California, United States",
          "latitude": 37.7695,
          "longitude": -122.401,
          "lat": 37.7695,
          "lng": -122.401
        }
      ]
    }
  ]
}
```

The example corrects the house number of the property with ID `1`. It sends the whole address again.

**General behavior**

-   The new address replaces the whole old address. Tape removes the parts you leave out, including the coordinates.
-   An update also removes `original_formatted_address` and `name`.
-   To clear the field, send `null`.
-   You can't clear a required field. The request returns `400`.
-   Fields that aren't in the request keep their values.

*Request: clear the field*

```json
{
  "fields": {
    "address": null
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

Location field

create and change location fields.

](https://developers.tapeapp.com/docs/api/resource/field/location)[

Field value

how all field values work.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Record

create, read, update and delete records.

](https://developers.tapeapp.com/docs/api/resource/record)[

Filter

find records by their address.

](https://developers.tapeapp.com/docs/api/resource/filter#single-location)
