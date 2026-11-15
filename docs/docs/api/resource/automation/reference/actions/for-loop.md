# for_loop

> Config reference for the Tape automation for_loop action, with its config keys, defaults and an example.

Use this action to run a set of nested actions once for each item of a collection.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Loop actions** in the [Flow control](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#flow-control) family. Its `group` is `control_flow`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

An earlier `collect_app_records` action collected the open invoices of database app `12345`. The loop skips invoices with the category option **Paid** (`9001`) and emails a payment reminder for each other one:

```json
{
  "type": "for_loop",
  "config": {
    "iterable": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 12345 },
    "continue_condition": {
      "operator": "and",
      "rows": [
        {
          "subject": { "kind": "variable", "source": "field", "field_id": 512, "field_type": "single_category", "previous": false, "collection": true, "triggering": false },
          "operator": "is_any_of",
          "value": { "type": "ids", "ids": [9001] }
        }
      ]
    },
    "action_rows": [
      {
        "type": "send_email",
        "config": {
          "to_address": [
            { "kind": "variable", "source": "field", "field_id": 514, "field_type": "multi_email", "previous": false, "collection": true, "triggering": false }
          ],
          "subject": [
            "Payment reminder for invoice ",
            { "kind": "variable", "source": "meta", "meta_type": "app_record_id", "collection": true, "app_id": 12345 }
          ],
          "message_body": ["<p>This invoice is overdue.</p>"]
        }
      }
    ]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `iterable` | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | What the loop goes through: a `record_collection` from an earlier `collect_*` action, a multi-value field or a custom variable. | `{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 12345 }` |
| `action_rows` | array of nested [actions](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions) | The loop body. Tape runs it once per item. Empty when left out. | `[{ "type": "send_email", "config": { … } }]` |
| `break_condition` | [filter group](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) | `null` | Stops the loop when it matches. Off when left out. | `{ "operator": "and", "rows": [ … ] }` |
| `continue_condition` | [filter group](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) | `null` | Skips to the next item when it matches. Off when left out. | `{ "operator": "and", "rows": [ … ] }` |

To find the field IDs, see [App and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids). To find the option IDs for `ids`, see [Retrieve a single app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app). It returns them in `config.settings.options` of the field.

## What happens for each item

1.  Tape loads the item. Inside the loop, references with `collection: true` to fields and metadata of the collection's database app point to this item. For a custom variable, a `custom` reference to that variable points to this item. To read one property of it, use a code value such as `[<reference>, ".price"]`. This works in field assignments and template values. The `assignment_code` of a `custom_variable` inside the loop body doesn't see the item yet and reads `undefined`.
2.  Tape checks `continue_condition`. When it matches, Tape skips the body and moves to the next item.
3.  Tape runs the actions in `action_rows`.
4.  Tape checks `break_condition`. When it matches, the loop stops.

An item that matches `break_condition` still runs the body once. Then the loop stops.

## General behavior

-   No key is required. An empty `config` is valid, but the loop does nothing.
-   The whole loop lives in `config`, like every other action.
-   Send the collection as `iterable`. The internal name `iterable_variable_def` isn't part of the API.
-   Leave `break_condition` or `continue_condition` out to switch it off. There are no `*_enabled` flags. A condition sent as `null` or as an empty group has no effect and reads back as `null`.
-   Without `iterable`, Tape skips the loop when the automation runs.
-   [`validate`](https://developers.tapeapp.com/docs/api/resource/automation/execution) checks that `iterable` resolves. A reference with no matching earlier action, for example a `collect_*` action placed after the loop, reports `action_variable_missing`.
-   `validate` doesn't check that the value can be looped over. A single-value field, or an action output that isn't a `record_collection`, passes `validate` and fails when the automation runs. Use only a `record_collection`, a multi-value field or a custom variable.
-   An `iterable` that's empty or `null` when the automation runs gives zero iterations, without an error.
-   A custom variable that holds an array gives one iteration per entry. Any other value gives one iteration with the whole value.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   When `iterable` references a collection or custom variable, an earlier action must create it, for example `collect_app_records`, `custom_variable` or `http_call`.

## Next steps

[

collect\_app\_records

create the record collection to loop over.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-app-records)[

Dynamic values

references such as `iterable`.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Filters

the filter group used by `break_condition` and `continue_condition`.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters)[

Action examples

configs to copy for the common actions.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
