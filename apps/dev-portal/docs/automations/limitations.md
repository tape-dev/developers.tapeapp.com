---
id: limitations
title: Limitations & Throttling
sidebar_label: Limitations & Throttling
---

Tape applies limits to all executed automations regarding utilized computation power and time.

# Limitations for individual worflow automation runs

- The maximum time a flow can run is currently 3 minutes
- Maximum number of actions consumed for a single run: 1000 (One thousand)
- Memory & CPU limitations apply
- There is a limit for parallel async operations (avoid heavy parallel HTTP operations and perform them sequentally instead)
- A single record-collection action (e.g. `collect_app_records` / `collect_app_view_records`) returns at most **1000 records**. A configured `limit` above 1000 — or with `limit_enabled: false`, or non-positive — is stored and read back **unchanged**; the cap is applied only when the run executes, where the collection is silently truncated to exactly 1000. The truncation is **not surfaced at write or validate time**. (This is separate from the per-run action cap above.)
- Automation email sends (`send_email` / `collected_records_send_email`) draw down your organization's shared **24-hour email send quota**; once it is exhausted, further sends are refused until the window rolls over.

Exceeding the time, action-count or memory/CPU limits fails the flow with a proper error message. Two of the limits above behave differently rather than failing the run: the record-collection cap truncates silently, and the email-send quota refuses further sends once exhausted. Split your work into multiple flows or avoid heavy computations, e.g. for large amounts of records.

# Throttling

Throttling per organization may be applied if an organization performs excessive action usage during a short period of time. The throttling will be lifted after 5 minutes and will be indicated by a yellow "THROTTLED" status for scheduled automations in the runs overview and individual runs sidebar.

Throttling affects the whole organization and will lead to temporary delays and scheduled flows.
