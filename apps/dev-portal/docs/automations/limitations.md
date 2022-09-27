---
id: limitations
title: Limitations
sidebar_label: Limitations
---

Tape applies limits to all executed workflow automations regarding utilized computation power and time.

- The maximum time a flow can run is currently 3 minutes
- Maximum number of actions consumed for a single run: 1000 (One thousand)
- Memory & CPU limitations apply
- There is a limit for parallel async operations (avoid heavy parallel HTTP operations and perform them sequentally instead)

Flows that exceed any of the above limits fail with a proper error message. Split your work into multiple flows or avoid heavy computations, e.g. for large amounts of records.
