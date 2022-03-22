---
id: general
title: Field Value
sidebar_label: General
---

A record object consist of its static properties like `id`, `title` or `created_on` and its field values. For each field of the record's app, the record can have a field value.
An example "Contacts" app could have the fields "First name" (text), "Last Name" (text) and "Phone number" (phone). Adding a record to this app includes specifying its field values for each of the fields "first Name", "Last Name" and "Phone number".

Each field value object can be uniquely identified via a given `record_id` and `field_id`. Field values can be returned as part of a record or as the result of a field value update endpoint.
