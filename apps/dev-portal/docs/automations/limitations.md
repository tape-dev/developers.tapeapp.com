---
id: limitations
title: Limitations & Throttling
sidebar_label: Limitations & Throttling
---

Tape applies limits to all executed workflow automations regarding utilized computation power and time.

# Limitations for individual worflow automation runs

- The maximum time a flow can run is currently 3 minutes
- Maximum number of actions consumed for a single run: 1000 (One thousand)
- Memory & CPU limitations apply
- There is a limit for parallel async operations (avoid heavy parallel HTTP operations and perform them sequentally instead)

Flows that exceed any of the above limits fail with a proper error message. Split your work into multiple flows or avoid heavy computations, e.g. for large amounts of records.

# Throttling

Throttling per organization may be applied if an organization performs excessive action usage during a short period of time. The throttling will be lifted after 5 minutes and will be indicated by a yellow "THROTTLED" status for scheduled workflow automations in the runs overview and individual workflow runs sidebar.

Throttling affects the whole organization and will lead to temporary delays and scheduled flows.
