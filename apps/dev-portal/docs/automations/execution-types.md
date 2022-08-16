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

The configured trigger started a workflow execution. This would be the case, if a workflow uses the "Record created" trigger and a record is created in Tape, either by a user inside the web or mobile app, or via the API. Filters are evaluated here, and runs will only appear in Tape if the record matched the configured filters of that workflow.

## Manual run

A user started a manual run for a workflow and either selected a dedicated set of records, provided a number of records to run on, or triggered the manual run on all records inside an app. Filters apply here, so only matching records will lead to runs showing up.

## Simulation run

Simulation runs are triggered inside the workflow center by a user, just like manual runs. Filters are skipped here, and all mutating action blocks provide a dummy behavior. This includes record updates, creations or comment creations but also more actions. There is a runtime variable available to check whether a run is a simulation, this way developers can also mock calls to external APIs to avoid any corrupt data during simulation runs and enable quick debugging.

The Tape client SDK also provides a dummy behavior in this scenario, so when using the Tape client inside an "execute script" action and a simulation run is performed, mock data will be returned for mutating API calls such as record update or create.
