# Execution types

> Run an automation through its trigger, by hand, or as a simulation that changes no data in Tape. The execution type of a run decides if filters apply and if changes are real.

Run an automation through its trigger, by hand, or as a simulation that changes no data in Tape. The execution type of a run decides if filters apply and if changes are real.

| Execution type | Started by | Filters | Changes data |
| --- | --- | --- | --- |
| Regular (triggered) | The trigger of the automation | Yes | Yes |
| Manual run | A person in the automation editor | Yes | Yes |
| Simulation | A person in the automation editor | No | No data in Tape, but requests to other services are real |

To start a manual run or a simulation from code, use [Run & simulate](https://developers.tapeapp.com/docs/api/resource/automation/execution) in the Automation API.

## Regular / triggered

The trigger of the automation starts the run. Example: an automation uses the trigger **Record created**. Someone creates a record in the web app, the mobile app or through the API, and the automation starts.

Tape checks the filters first. A run appears only if the record matches the filters of the automation.

## Manual run

Start a run yourself in the automation editor:

1.  Open the menu in the automation editor and select **Manual run**.
2.  Under **Run on**, choose the records: selected records, a view, a number of the most recent records, or all records of the database app. With the trigger **Webhook received**, choose **Last payload** or **Custom payload** instead.
3.  Select **Start run**.

![The automation editor with Manual run open and the Run on options for selected records, a view, a number of records or all records](https://developers.tapeapp.com/assets/images/manual-run-9a2296cbe0e5590d9062bbb745fa264a.png)

Filters apply. Only records that match the filters create a run.

## Simulation run

Use a simulation to test an automation without changing data:

1.  Open the menu in the automation editor and select **Simulated run**.
2.  Choose the records under **Simulate on**.
3.  Select **Start simulation**.

![The automation editor with the Simulate on options and the Start simulation button](https://developers.tapeapp.com/assets/images/simulated-run-ee4675560c20e2b01e08dfa8e65624fb.png)

Filters don't apply in a simulation. Actions that change data in Tape only pretend to run: record updates, record creation, comments and other changes return test data. Requests to other services run for real: **Send HTTP request**, **Send API request** and `http` calls in scripts.

Your scripts can check `current_workflow_is_simulation`. Use it to skip calls to other services, so a simulation can't change data outside Tape.

```js
if (!current_workflow_is_simulation) {
  await http.post('https://hooks.acme.com/deals', {
    data: { automation_id: current_workflow_id },
    headers: { 'Content-Type': 'application/json' },
  });
}
```

Tape sends `data` as JSON, but doesn't set the `Content-Type` header for you. Add it yourself when the receiving service expects `application/json`.

The `tape` client in **Execute a script** works the same way. In a simulation, calls that change data, like creating or updating a record, return test data.

## Next steps

-   [Automations](https://developers.tapeapp.com/docs/automations/introduction): execution variables and where scripts run.
-   [Filter values](https://developers.tapeapp.com/docs/automations/troubleshooting/filter-values): check that a filter matches only the records you expect.
-   [Errors](https://developers.tapeapp.com/docs/automations/troubleshooting/automations-troubleshooting-errors): read failed runs and throw your own errors.
-   [Limits and throttling](https://developers.tapeapp.com/docs/automations/limitations): limits for each run.
-   In the Help Center: [Test automations](https://help.tapeapp.com/en/articles/18449073-test-automations)
-   In the Help Center: [Run an automation on existing records](https://help.tapeapp.com/en/articles/18449055-run-an-automation-on-existing-records)
