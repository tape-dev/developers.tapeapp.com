---
id: icon
title: Icon
sidebar_label: Icon
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Icons are used to visually represent records, apps and workspaces in the Tape web and mobile applications.
Currently, Icons can be set on [App creation or update](/docs/api/resource/app#create-an-app) and [Workspace creation or update](/docs/api/resource/workspace#create-a-workspace).

There are 3 types of icons:

- graphic icons
- emoji icons
- custom icons

Currently, the API only supports graphic icons and emoji icons. Custom icons can only be set via the Tape web application.

## Graphic icons

Graphic icons are icons that are provided by Tape. They are identified by their `id` property.
Currently, most icons from [Google's Material Design Icon Library](https://fonts.google.com/icons) are supported.
In case you want to set an icon you found on the Material Design Icon Library, you can select the icon, clieck on "Android" and copy the icon id from the text field.

An example for a graphic icon id would be [hourglass_empty](https://fonts.google.com/icons?selected=Material+Symbols+Outlined:hourglass_empty:FILL@0;wght@400;GRAD@0;opsz@24&icon.platform=android) for the icon of an hourglass.

Some icons are blacklisted and cannot be used.

Following object shows an example of a graphic icon, that could be used as an input to set an icon on an app or workspace:

```
{
    "id": "hourglass_empty"
    "type": "graphic"
}
```

## Emoji icons

Emoji icons are icons that are provided by the Unicode Consortium. They are identified by their `emoji` property.
An example for an emoji icon would be 📞 for the icon of a phone.

Following object shows an example of an emoji icon, that could be used as an input to set an icon on an app or workspace:

```
{
    "unicode": "📞"
    "type": "emoji"
}
```
