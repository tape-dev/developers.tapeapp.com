---
id: limitations
title: Limits and throttling
sidebar_label: Limits and throttling
---

Keep each automation run within the limits for time, actions and computing power. Tape also throttles organizations with very heavy use.

## Limits for each run {#limitations-for-individual-workflow-automation-runs}

| Limit | Value | What happens |
| --- | --- | --- |
| Run time | 3 minutes | The run fails with an error message |
| Actions in one run | 1000 | The run fails with an error message |
| Memory and CPU | Limited | The run fails with an error message |
| Parallel async operations | Limited | Run HTTP calls one after another instead of in parallel |
| Records in one collection action | 1000 | The collection stops at 1000 records, without an error |
| Emails | Shared 24-hour quota of your organization | Further emails are refused until the quota renews |

### Record collections stop at 1000 records

Actions that collect records, like `collect_app_records` and `collect_app_view_records`, return at most 1000 records.

Tape saves a higher `limit`, `limit_enabled: false` or a value of 0 or below unchanged. The cap applies only when the run executes. Neither saving nor validating the automation warns you.

This cap is separate from the limit of 1000 actions per run.

### Emails use a shared quota

The actions `send_email` and `collected_records_send_email` use the 24-hour email quota of your organization. Once the quota is used up, Tape refuses further emails until the 24-hour window moves on.

### Stay within the limits

- Split large jobs into several automations.
- Avoid heavy computations, for example on large numbers of records.
- Run HTTP calls one after another.

## Throttling

Tape can throttle an organization that uses a very large number of actions in a short time. Throttling affects the whole organization and delays runs for a while.

Tape checks the load regularly and lifts throttling as soon as the load drops below the limit. Until then, waiting runs show the orange status **Throttled** under **Runs** in the automation editor and under **Automations** → **Runs**.

## Next steps

- [Execution types](/docs/automations/execution-types): simulate a run before it changes data.
- [Errors](/docs/automations/troubleshooting/automations-troubleshooting-errors): read failed runs and their error messages.
- [Request limits](/docs/api/request-limits): limits for the Tape API.
- [Automations](/docs/automations/introduction): where scripts run and what they can do.
- In the Help Center: [Automation limits and throttling](https://help.tapeapp.com/en/articles/18449020-automation-limits-and-throttling)
