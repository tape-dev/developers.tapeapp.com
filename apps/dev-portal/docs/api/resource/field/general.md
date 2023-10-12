---
id: overview
title: Field
sidebar_label: Overview
---

An App consist of its static properties like `app_id`, `name` or `config` and its fields.
An example "Contacts" app could have the fields "First name" (text), "Last Name" (text) and "Phone number" (phone).

The fields of an App determine the structure of the records within the app. Adding a record to this app includes specifying its field values for each of the fields "First Name", "Last Name" and "Phone number".

Each field object can be uniquely identified via its `field_id`. Fields are returned as part of an app and can be created and updated via the App endpoint.
Fields can be created as part of the create App endpoint and created or updated via the update App endpoint.

## Common Properties

All fields share the following properties:

- `label`: The label (= name) of the field. This is the name of the field that is displayed to the user.
- `description`: The description of the field. This is the help text that is displayed to the user.
- `slug`: The slug of the field. This is the unique identifier of the field. The slug is used to identify the field in the record create and update endpoints of the API.
- `external_id`: equal to the property slug. The slug is used to identify the field in the record create and update endpoints of the API.
- `required`: Whether the field is required or not. If a field is required, it must have a value when creating or updating a record.
- `hidden_if_empty`: Whether the field is hidden if it has no value. If a field is hidden if empty, it is not displayed in the record if it has no value.
- `always_hidden`: Whether the field is always hidden. If a field is always hidden, it is not displayed in the record, even if it has a value.
- `field` type: See below.
- `settings`: The field-type specific settings of a field. The structure of this object depends on the field type.

## Field type

Each field has a `field_type` property. The `field_type` property specifies the type of the field like `single_text`, `multi_text`, `single_category` or `multi_phone`. Whenever there is an option to specify whether to allow one or more values per field, the `field_type` specifies this information in its prefix. Tape distinguishes between these field types down to the database level so that a field value for a field of type `single_category` can never have multiple category options selected. Therefore, switching from e.g., `single_category`to `multi_category` requires a field conversion where all field values are migrated.
