---
id: icon
title: Icon
sidebar_label: Icon
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Use an icon object to set the icon of an app or a workspace.

Icons represent records, apps and workspaces in the Tape web and mobile apps. Set them when you [create or update an app](/docs/api/resource/app#create-an-app) or [create or update a workspace](/docs/api/resource/workspace#create-a-workspace).

Tape has three types of icons:

- graphic icons
- emoji icons
- custom icons

The API supports graphic icons and emoji icons. Set custom icons in the Tape web app. An app or workspace with a custom icon returns no `icon` in the API.

## Graphic icons

A graphic icon is an icon provided by Tape. Its `id` identifies it.

Tape supports most icons of [Google's Material Design icon library](https://fonts.google.com/icons). To find the ID of an icon there, select the icon, select **Android** and copy the ID from the text field.

For example, [hourglass_empty](https://fonts.google.com/icons?selected=Material+Symbols+Outlined:hourglass_empty:FILL@0;wght@400;GRAD@0;opsz@24&icon.platform=android) is the icon of an hourglass. An `id` Tape doesn't support returns `400` with `validation`.

Send this object to set a graphic icon:

```json title="Icon"
{
  "id": "hourglass_empty",
  "type": "graphic"
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"graphic"` for a graphic icon. | `"graphic"` |
| `id` | `string` | ID of the icon in the Material Design icon library. | `"hourglass_empty"` |

## Emoji icons

An emoji icon is a Unicode emoji. Its `emoji` property identifies it.

Send this object to set an emoji icon, here the telephone receiver emoji (U+1F4DE). The example writes it as a JSON escape. You can also send the emoji character itself.

```json title="Icon"
{
  "emoji": "\ud83d\udcde",
  "type": "emoji"
}
```

| Property | Type | Description | Example value |
| :-- | :-- | :-- | :-- |
| `type` | `string` | `"emoji"` for an emoji icon. | `"emoji"` |
| `emoji` | `string` | The emoji, as a JSON escape or as the character itself. | `"\ud83d\udcde"` |

:::info Can I send a string instead of an object?
Yes. Tape reads an emoji as an emoji icon and any other text as the `id` of a graphic icon.
:::

## Next steps

- [App](/docs/api/resource/app): set the icon when you create or update an app.
- [Workspace](/docs/api/resource/workspace): set the icon when you create or update a workspace.
- [Record](/docs/api/resource/record): read the icon of a record's app in `app.icon`, as a plain string instead of an icon object.
