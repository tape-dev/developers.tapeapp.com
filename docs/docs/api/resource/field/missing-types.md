# Created and last edited fields

> Use these field types to show when a record was created or last edited, and by whom.

Use these field types to show when a record was created or last edited, and by whom.

> Looking for a Podio field type?
> 
> Tape has no `money`, `duration` or `progress` field type. Use a `number` field. See [Podio field types](https://developers.tapeapp.com/docs/api/resource/field/overview#podio-field-types).

| `field_type` | Field in Tape | `type` | `settings` |
| --- | --- | --- | --- |
| `created_on` | **Created on** | `created_at` | `show_time` (`boolean`): whether Tape shows the time next to the date |
| `created_by` | **Created by** | `created_by` | none |
| `last_modified_on` | **Last edited on** | `last_modified_at` | `show_time` (`boolean`): whether Tape shows the time next to the date |
| `last_modified_by` | **Last edited by** | `last_modified_by` | none |

Create and update these fields with the [create app endpoint](https://developers.tapeapp.com/docs/api/resource/app#create-an-app) and the [update app endpoint](https://developers.tapeapp.com/docs/api/resource/app#update-an-app), like the other field types. They have the [common field properties](https://developers.tapeapp.com/docs/api/resource/field/overview#common-properties).

The example adds a "Created on" field that shows the time to an existing app. Find the app ID in the [Developer view of the app](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

`PUT https://api.tapeapp.com/v1/app/{appId}`

*Request*

```json
{
  "fields": [
    {
      "field_type": "created_on",
      "config": {
        "label": "Created on",
        "settings": { "show_time": true }
      }
    }
  ]
}
```

**General behavior**

-   Tape fills the values of these fields. You can't write them.
-   Field updates follow the rules in [Create and update fields](https://developers.tapeapp.com/docs/api/resource/field/overview#create-and-update-fields).
-   A record response doesn't list these values in `fields`. Read them from the record properties `created_on`, `created_by`, `last_modified_on` and `last_modified_by`.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

## Next steps

[

Record

read when a record was created and last edited.

](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record)[

Field value

which field values Tape computes and you can't write.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview#field-type)[

Field

all field types and the properties they share.

](https://developers.tapeapp.com/docs/api/resource/field/overview)[

App

create, update and delete apps with their fields.

](https://developers.tapeapp.com/docs/api/resource/app)[

Capabilities

what `apps:edit` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
