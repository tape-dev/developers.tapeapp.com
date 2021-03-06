---
id: overview
title: Field Value
sidebar_label: Overview
---

A record object consist of its static properties like `id`, `title` or `created_on` and its field values. For each field of the record's app, the record can have a field value.
An example "Contacts" app could have the fields "First name" (text), "Last Name" (text) and "Phone number" (phone). Adding a record to this app includes specifying its field values for each of the fields "First Name", "Last Name" and "Phone number".

Each field value object can be uniquely identified via its `record_id` and `field_id`. Field values can be returned as part of a record or as the result of a field value update endpoint.

## Field type

The API returns the `type` property as well as the `field_type` property for a field value. The `type` property refers to the the kind of data return like `text`, `category` or `phone`. The `field_type` property specifies the type of the field like `single_text`, `multi_text`, `single_category` or `MULTI_PHONE`. The `field_type` always specifies the information whether only one value is allowed or multiple values are allowed. Tape distinguishes between these field types down to the database level so that a field value for a field of type `single_category` can never have multiple category options selected. Therefore, switching from e.g., `single_category`to `multi_category` requires a field conversion where all field values are migrated.
