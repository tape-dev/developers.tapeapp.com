---
id: missing-types
title: Created and last edited fields
sidebar_label: Created and last edited fields
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

Use these field types to show when a record was created or last edited, and by whom.

:::info Looking for a Podio field type?
Tape has no `money`, `duration` or `progress` field type. Use a `number` field. See [Podio field types](/docs/api/resource/field/overview#podio-field-types).
:::

| `field_type` | Field in Tape | `type` | `settings` |
| :-- | :-- | :-- | :-- |
| `created_on` | **Created on** | `created_at` | `show_time` (`boolean`): whether Tape shows the time next to the date |
| `created_by` | **Created by** | `created_by` | none |
| `last_modified_on` | **Last edited on** | `last_modified_at` | `show_time` (`boolean`): whether Tape shows the time next to the date |
| `last_modified_by` | **Last edited by** | `last_modified_by` | none |

Create and update these fields with the [create app endpoint](/docs/api/resource/app#create-an-app) and the [update app endpoint](/docs/api/resource/app#update-an-app), like the other field types. They have the [common field properties](/docs/api/resource/field/overview#common-properties).

The example adds a "Created on" field that shows the time to an existing app. Find the app ID in the [Developer view of the app](/docs/api/resource/app#find-app-and-field-ids).

<EndpointBadge method="PUT" url="https://api.tapeapp.com/v1/app/{appId}" />

```json title="Request"
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

- Tape fills the values of these fields. You can't write them.
- Field updates follow the rules in [Create and update fields](/docs/api/resource/field/overview#create-and-update-fields).
- A record response doesn't list these values in `fields`. Read them from the record properties `created_on`, `created_by`, `last_modified_on` and `last_modified_by`.

**Requirements:** `apps:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token or a user API key.

## Next steps

- [Record](/docs/api/resource/record#retrieve-a-record): read when a record was created and last edited.
- [Field value](/docs/api/resource/field-value/overview#field-type): which field values Tape computes and you can't write.
- [Field](/docs/api/resource/field/overview): all field types and the properties they share.
- [App](/docs/api/resource/app): create, update and delete apps with their fields.
- [Capabilities](/docs/api/capabilities): what `apps:edit` allows.
