---
id: date-timezone
title: Date & Timezone
sidebar_label: Date & Timezone
---

# Date & Timezone

## Date Format

The Tape API returns all dates in a formatted string, similar to ISO 8601 and in UTC timezone.

```
2022-02-01 15:00
```

which would be equal to the following in standardized ISO 8601:

```
2022-02-01T15:00Z
```

## Calendar days

Calendar days are represented as follows:

```
TODO:
```

## Timezone support

Tape supports time zone settings for users, however the API only works with UTC format, both for response and request bodies. When using the Tape web and mobile clients, users will see their dates properly formatted in their timezone, which is handled by browsers / client devices.
