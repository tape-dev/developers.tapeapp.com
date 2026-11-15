# rollup_iterable_values

> Config reference for the Tape automation rollup_iterable_values action, with its config keys, defaults and an example.

Use this action to aggregate a field across collected records into one value, for example a sum, a count or an average.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Rollup collected values** in the [Record collections](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#record-collections) family. Its `group` is `action`, and it works with every trigger but needs an earlier action that creates the record collection.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action adds up the amounts of all collected open invoices:

```json
{
  "type": "rollup_iterable_values",
  "config": {
    "rollup_type": "sum",
    "rollup_variable_def": {
      "kind": "variable",
      "source": "field",
      "field_id": 123,
      "field_type": "number",
      "collection": true,
      "previous": false,
      "triggering": false
    },
    "custom_variable_def": { "custom_type": "any", "label": "Open invoice total" }
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `rollup_type` | enum | **Required.** The aggregation to run. See [Rollup types](#rollup-types). | `"sum"` |
| `rollup_variable_def` | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** The field whose values Tape aggregates, as a field reference with `collection: true`. An earlier collect action must put it in scope. The schema lets you save without it, but validation then reports `action_variable_missing`. | `{ "kind": "variable", "source": "field", "field_id": 123, "field_type": "number", "collection": true, "previous": false, "triggering": false }` |
| `custom_variable_def` | object | The output variable that holds the result. Default `{ "custom_type": "any", "label": "Rollup" }`. | `{ "custom_type": "any", "label": "Open invoice total" }` |

To find the field ID for `rollup_variable_def`, see [App and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

### Rollup types

`rollup_type` takes one of these lower-case tokens:

-   `count_all`: counts all values.
-   `count_empty`: counts the empty values.
-   `count_not_empty`: counts the values that aren't empty.
-   `percent_empty`: share of empty values, in percent.
-   `percent_not_empty`: share of values that aren't empty, in percent.
-   `sum`: adds up the values.
-   `average`: the mean of the values.
-   `median`: the median of the values.
-   `min`: the smallest value.
-   `max`: the largest value.

## Use the result in a later action

The action stores the result in the variable from `custom_variable_def`. A later action reads it with a `custom` reference that has the same `custom_type` and `label`:

```json
{ "kind": "variable", "source": "custom", "custom_type": "any", "label": "Open invoice total" }
```

## General behavior

-   `rollup_type` is the only key the schema requires. It has no default.
-   Validation also needs `rollup_variable_def`. Without it, validation reports `action_variable_missing`.
-   Leave `custom_variable_def` out to get the default label `Rollup`.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   An earlier action in the automation must collect the records whose field you roll up.

## Next steps

[

Dynamic values

build field references and use the output variable.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Errors & broken reasons

what `action_variable_missing` means.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors)[

Action examples

a full collect payload to start from.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
