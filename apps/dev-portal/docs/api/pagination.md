---
id: pagination
title: Pagination
sidebar_label: Pagination
---

# Pagination

Many Tape API resources have support for bulk fetches via "list" API methods. For instance, you can list **workspaces**, **apps**, and **records**. These list API methods share a common structure, requiring at least these three parameters: limit, `starting_after`, and `ending_before`.

The Tape API uses cursor-based pagination via the `starting_after` and `ending_before` parameters. Both parameters take an existing object ID value (see below) and return objects in reverse chronological order. The `ending_before` parameter returns objects listed before the named object. The `starting_after` parameter returns objects listed after the named object. These parameters are mutually exclusive -- only one of `starting_after` or `ending_before` may be used.

This method of cursor based pagination ensures long term, scalable and performant API consumer experience.
