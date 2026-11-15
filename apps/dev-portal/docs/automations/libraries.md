---
id: libraries
title: Available libraries (automations)
sidebar_label: Libraries
---

Use these Node.js libraries in the code of your automations without importing them.

They work in script filters, **Perform a calculation** and **Execute a script**. Call each library by its alias. Example: format a date with date-fns.

```js
date_fns.format(new Date(current_datetime_local), 'yyyy-MM-dd')
```

| Library | Aliases | Version | Description |
| :-- | :-- | :-- | :-- |
| [Lodash](https://lodash.com/) | `lodash`, `_` | 4.17.21 | Utility functions for arrays, objects and strings. |
| [Moment.js](https://momentjs.com/) | `moment` | 2.30.1 | Parse, validate, change and format dates and times. |
| [date-fns](https://date-fns.org/) | `date_fns` | 2.30.0 | Date utility functions. |
| [date-fns-tz](https://github.com/marnusw/date-fns-tz/tree/v2.0.1) | `date_fns_tz` | 2.0.1 | Timezone support for date-fns, based on the Intl API. |
| [uuid](https://github.com/uuidjs/uuid#readme) | `uuid` | 8.3.2 | Create RFC4122 UUIDs. |
| [cheerio](https://cheerio.js.org/) | `cheerio` | 1.0.0-rc.10 | Parse and read HTML on the server, with a jQuery-like API. |
| [striptags](https://github.com/ericnorris/striptags) | `striptags` | 3.2.0 | Remove HTML tags from a string, like PHP's strip_tags. |
| [minimatch](https://github.com/isaacs/minimatch) | `minimatch` | 9.0.5 | Match strings against glob patterns. |
| [jsonata](https://github.com/jsonata-js/jsonata) | `jsonata` | 1.8.6 | Query and transform JSON, see the [JSONata documentation](https://jsonata.org/). |

:::info Missing a library?
[Submit an issue](https://github.com/tape-dev/developers.tapeapp.com/issues/new?body=Hey%20Tape%20Team%2C%0A%0AI%20would%20like%20to%20propose%20the%20following%20Node.js%20library%20to%20be%20included%20in%20the%20automations%3A%0A%0AName%3A%0AVersion%3A%0ANPM%20Link%3A%0AWhy%20it%20would%20be%20useful%20to%20me%3A%0A%0AThanks%21) on GitHub, and the Tape team looks into it.
:::

<!--
Body of the GitHub new issue link:
Encode with: https://www.urlencoder.org/

Hey Tape Team,

I would like to propose the following Node.js library to be included in the automations:

Name:
Version:
NPM Link:
Why it would be useful to me:

Thanks!
-->

## Next steps

- [Date, time & timezones](/docs/automations/date-timezone): use date-fns and date-fns-tz with Tape dates.
- [Code editor](https://help.tapeapp.com/en/articles/18448952-execute-script-action): autocompletion and types for every library.
- [Automations](/docs/automations/introduction): where scripts run and what they can do.
- [Calculation field libraries](https://help.tapeapp.com/en/articles/18449157-calculation-syntax-examples): the same libraries in calculation fields.
