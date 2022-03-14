---
id: errors
title: Errors
sidebar_label: Errors
---

# Errors

Tape applies conventional HTTP response codes to indicate the success or failure of an API request.

In general:

- Codes in the **2xx** range indicate success
- Codes in the **4xx** range indicate an error that failed given the information provided (e.g., a required parameter was omitted, invalid type for a field etc.)
- Codes in the **5xx** range indicate an error with Tape's servers
