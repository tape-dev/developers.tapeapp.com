# Filter values

> Keep filters from matching every record when their comparison value turns out empty.

Keep filters from matching every record when their comparison value turns out empty.

A filter, or a search condition inside an action, compares a field with a value. Tape builds that value when the automation runs, from fixed input and references: a field, a variable or the output of an earlier action. A filter that looks complete can still end up with an empty value for one record.

## An empty filter value matches every record

> Using a field, a variable or an earlier output as the value?
> 
> If it is empty for one record when the automation runs, the condition is `true` for every record. Under the default `and` group, the automation then runs its actions on every record in scope, without an error. Before a bulk action like "update all" or "delete all", this can change your whole dataset and use credits for every record.

> Getting `400` when you save a filter?
> 
> Create and update in the Automation API reject a comparison that is empty or of the wrong type, and name the condition:
> 
> -   a value whose `type` doesn't match the field, for example `text` on a number field
> -   an empty comparison value, for example `{ "type": "text", "text": [] }`
> -   the wrong number of values
> 
> The error explains the risk. To check for an empty field on purpose, use `is_empty` or `is_not_empty`.

### How a value ends up empty

-   **A referenced value is empty.** The field, variable or earlier output is empty for this record. It passes the save check, because the reference exists.
-   **The value channel doesn't match the field.** Tape catches this on save and returns `400`. Tape picks the channel from the field type: number and unique ID use `number`, date fields use `date`, category, status, relation and user use `ids`, text uses `text`. See [Match the value type to the field](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters#match-the-value-type-to-the-field) for the channel rules.
-   **The automation is older than the check.** Automations saved before this check, or in the automation editor, can hold an empty comparison. Create and update don't check existing automations again.

### How to avoid it

-   **Check the source first.** If the value comes from a reference that can be empty, put the filter or action inside a [`conditional`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/conditional) that checks the source, or set a fallback value.
-   **Simulate before you activate.** A [simulation](https://developers.tapeapp.com/docs/api/resource/automation/execution) runs the actions on real records without changing data in Tape, so a search condition inside an action that matches too much shows up early. Requests to other services still go out. A simulation skips the filter of the automation itself.
-   **To match every record on purpose, remove the condition**, or send `filter: null`. A filter without conditions runs for every record. An empty top-level group returns `400`.

## Why `validate` does not flag an empty value

`GET /v1/automation/{id}/validate` returns `valid: true` for a condition with an empty comparison value, because the definition is valid. `validate` checks meaning only: it doesn't run the save checks of create and update, and can't know that a reference becomes empty for some record.

`validate` catches missing references, which is a different problem:

-   `filter_variable_missing`: the subject of a condition points to a field that no longer exists.
-   `filter_value_variable_missing`: the value points to a deleted field or variable.

Neither code flags an empty comparison. The code `filter_value_missing` is reserved and no longer raised.

## Next steps

-   [Run & simulate](https://developers.tapeapp.com/docs/api/resource/automation/execution): test the actions of an automation without changing data in Tape.
-   [Filters](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters): conditions, operators and value channels.
-   [Execution types](https://developers.tapeapp.com/docs/automations/execution-types): how filters apply in each type of run.
-   [Errors](https://developers.tapeapp.com/docs/automations/troubleshooting/automations-troubleshooting-errors): read failed runs.
-   In the Help Center: [My filter doesn't match](https://help.tapeapp.com/en/articles/18449010-my-filter-doesn-t-match)
