---
id: date-timezone
title: Date & Timezone
sidebar_label: Date & Timezone
---

# Date & Timezone

## Datetime format

The Tape API returns all dates as a formatted string, similar to ISO 8601 and in UTC timezone.

```
2022-02-01 15:00
```

which would be equal to the following in standardized ISO 8601:

```
2022-02-01T15:00Z
```

The format chosen by Tape is optimized for readability. While not included in the official ISO 8601 standard, most programming languages & libraries support the chosen format.

## Date format

Dates are represented as follows:

```
2022-02-01
```

## Timezone support

Tape supports time zone settings for users, however the API only works with UTC format, both for response and request bodies. When using the Tape web and mobile clients, users will see their dates properly formatted in their timezone, which is handled by browsers / client devices.
