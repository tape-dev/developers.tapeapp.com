---
id: introduction
title: Workflow Automations
sidebar_label: Introduction
---

Tape's workflow automations

### Execution environment

All custom scripts inside Tape's workflow automations are written in JavaScript, consistent with the [calculation field](/docs/calculation/introduction).

### Limitations

Tape applies limits to all executed workflows regarding utilized computation power and time.

- The maximum time a flow can run is 5 minutes
- Memory & CPU limitations apply

Flows that exceed any of the above limits fail with a proper error message. Split your work into multiple flow or avoid heavy computations large amounts of records.
