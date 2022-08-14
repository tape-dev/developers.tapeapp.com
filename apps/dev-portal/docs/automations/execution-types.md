---
id: execution-types
title: Workflow execution types
sidebar_label: Workflow execution types
---

When a worfklow is executed, there are different types of execution that may affect how the workflow behaves, if and how filters are evaluated and whether actual data mutations are being performed.

The following three run types exist:

- Regular / triggered
- Manual run
- Simulation

## Regular / triggered

The configured trigger started a workflow execution. This would be the case, if a workflow uses the "Record created" trigger and a record is created in Tape, either by a user or via the API. Filters are evaluated here, and runs will only appear in Tape if the record matched the configured filters of that workflow.

## Manual run

A user started a manual run for a workflow
