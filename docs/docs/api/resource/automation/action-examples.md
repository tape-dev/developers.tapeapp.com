# Action examples

> Copy-paste config for the most common Tape automation actions — records, email, HTTP, code, control flow, and collections.

Use these examples to copy a working `config` for the most common automation actions.

Each example is the *smallest `config`* that Tape saves, validates and runs for that [action type](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions). [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) returns the full `config_schema` of every action type. Build against it for the complete list of fields.

How to read the examples:

-   Put these objects into the `actions` array when you [create or update](https://developers.tapeapp.com/docs/api/resource/automation/manage) an automation.
-   Node `id`s are *left out*. Tape creates them. Stable `id`s appear only where an action nests other actions.
-   `group` *follows from `type`* and is optional on input. It's shown to make the examples clearer.
-   Values that pull in live record data are [dynamic values](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values), an *array* (template or code). Plain settings, such as an `app_id` or a boolean, are scalars. Each example says which is which.
-   All config enum values are *lower-case*, for example `http_call_type: "post"`, `weblink_expiration: "never"`, `exit_type: "success"`, and on `collect_referenced_records` both `ref_collection_defs[].direction` (`outgoing`, `incoming`, `both`) and `match_type` (`all`, `filtered`). Send them as the `config_schema` lists them.

## Create a record — `record_create`

Creates a record in a database app. Without `field_assignments`, it creates an *empty* record.

```json
{
  "type": "record_create",
  "group": "action",
  "config": {
    "app_id": 12345,
    "silent": false,
    "trigger_other_flows": false
  }
}
```

-   `app_id`: the target database app. Send it in every config. The schema doesn't mark it as required, and validation doesn't report it when it's missing. Without it, the action saves but Tape skips it when the automation runs.
-   `field_assignments`: `[]` is accepted in every case. A filled assignment has the same shape as in [Update the current record](#update-the-current-record--current_record_update) below.
-   `trigger_other_flows` is the option **Trigger automations** in the automation editor. `false` keeps the new record from starting other automations. Keep it at `false` to avoid a loop when this automation triggers on the same database app.
-   All three keys are plain scalars, with no dynamic-value arrays.

![Settings of the action that creates a record, with the options Silent, Trigger automations and Trigger webhooks](https://developers.tapeapp.com/assets/images/create-record-settings-342936401ceecf2b64510b5a4bcc10ee.png)

## Update the current record — `current_record_update`

Updates the record the run works on, with a list of `field_assignments`.

```json
{
  "type": "current_record_update",
  "group": "action",
  "config": {
    "field_assignments": [],
    "silent": false
  }
}
```

-   `field_assignments` (optional): left out or `[]` is a valid update that *changes no field value* and still logs success. The record's `last_modified_on` and `last_modified_by` still change.
-   A filled assignment is a *typed object per field type*, with lower-case `field_type` and `assignment_type` values (for example `single_text` and `set`) plus any nested match or search conditions in the public [filter tree](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters). `meta/action` describes the items only loosely. [`current_record_update`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-update) shows filled assignments to copy.
-   It targets the *current record*, with no `app_id` (that's `referenced_records_update`) and no `record_collection` (that's `collected_records_update`). It needs a trigger with a record, such as `record_created`. With no trigger, or with `periodic` or `webhook_received`, `validate` reports `action_invalid`. See [Trigger context](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#trigger-context).
-   `silent`, `trigger_webhooks`, `trigger_other_flows` and `author_id` are optional. `trigger_webhooks` and `trigger_other_flows` are the options **Trigger webhooks** and **Trigger automations** in the editor. Without `author_id`, the automation itself is the author.

## Run code — `custom_code`

Runs your own code in the automation sandbox. This is the most self-contained action: no referenced entities and no external service.

```json
{
  "type": "custom_code",
  "group": "action",
  "config": {
    "code": ["const sum = 1 + 1;"]
  }
}
```

-   `code` (*required*): a *code dynamic value*, an array of literal strings mixed with variable references that pull in record data. Value references aren't allowed here. See [Dynamic values](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values). Tape also accepts a plain string and turns it into an array.
-   `custom_variable_defs` left out means the script declares no variables for later actions.

## Declare a variable — `custom_variable`

Computes a value and stores it in a declared variable that later actions can reference.

```json
{
  "type": "custom_variable",
  "group": "action",
  "config": {
    "custom_variable_defs": [{ "custom_type": "any", "label": "Result" }],
    "assignment_code": ["1 + 1"]
  }
}
```

-   `custom_variable_defs`: the *declaration*. Each entry is `{ "custom_type", "label" }`. `custom_type` is one of `any`, `single_file`, `multi_file`, `single_link`, `html_table_rows`. Later actions reference the variable with `{ "kind": "variable", "source": "custom", "custom_type", "label" }`.
-   `assignment_code`: a *code dynamic value* (array) that computes the value. Tape evaluates it as one *expression*: write `1 + 1`, *not* `return 1 + 1;`. A top-level `return` fails when the automation runs. See [`custom_variable`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/custom-variable).
-   [`custom_code`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/custom-code) is different: its `code` is a block of statements. Don't use a top-level `return` there either. Tape runs the code of all actions as one script, so a `return` stops every later action.

> Why does my action save but do nothing?
> 
> With an empty or missing `custom_variable_defs`, this action still *validates and saves*. When the automation runs, Tape skips it without a per-action log. The same happens to a `for_loop` without `iterable` and to an `authenticated_http_call` without `authentication_provider_id`.

## Send an email — `send_email`

Sends one email from the automation.

```json
{
  "type": "send_email",
  "group": "action",
  "config": {
    "to_address": ["juliet@acme.com"],
    "subject": ["Email from the automation"],
    "message_body": ["<p>Sent by the send_email automation action.</p>"]
  }
}
```

-   `to_address` and `subject` are *required*. `message_body` is *optional*. Without it, Tape sends the email with an empty body.
-   All three are *template dynamic values* (arrays). The HTML body comes back unchanged.
-   Without `smtp_account_id`, Tape uses the organization's *default* SMTP account. Set an ID only if you need a specific account. [`send_email`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/send-email) shows where to find it.

## Make an HTTP request — `http_call`

Sends an HTTP request from the automation sandbox.

```json
{
  "type": "http_call",
  "group": "action",
  "config": {
    "http_call_type": "get",
    "http_call_url": ["https://tapeapp.com/"]
  }
}
```

-   `http_call_type` (*required*): a lower-case enum scalar, one of `get`, `post`, `put`, `patch`, `delete`.
-   `http_call_url` (*required*): a *template dynamic value* (array), so you can put record data into the URL.
-   Requests leave from Tape's worker IP addresses and are subject to network restrictions. See [Troubleshooting › IP addresses](https://help.tapeapp.com/en/articles/18448976-automation-ip-addresses). Tape refuses private and internal hosts.

## Branch on a condition — `conditional`

A control-flow action. It runs its nested `action_rows` (the then-branch) only when `condition` is true.

```json
{
  "type": "conditional",
  "group": "control_flow",
  "config": {
    "condition": {
      "operator": "and",
      "rows": [
        { "id": "cond-leaf", "code": ["true"] }
      ]
    },
    "action_rows": [
      {
        "id": "then-1",
        "type": "custom_code",
        "group": "action",
        "config": { "code": ["const a = 1;"] }
      }
    ]
  }
}
```

-   The branch structure lives *inside `config`*: `condition`, `action_rows` and the optional `else_action_rows`. Like every action, a `conditional` keeps its whole shape in `config`. See [`conditional`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/conditional).
-   `condition` is a filter group. The row above is a *script condition*, with `code` instead of `subject`, `operator` and `value`.
-   `action_rows` is the then-branch, with full nested action nodes. Add `else_action_rows` inside `config` for an else-branch. Leave it out to switch the else-branch off.

## Loop over items — `for_loop`

A control-flow action. It runs its nested `action_rows` (the loop body) once for each item of an iterable.

```json
{
  "type": "for_loop",
  "group": "control_flow",
  "config": {
    "iterable": {
      "kind": "variable",
      "source": "action",
      "action_type": "record_collection",
      "app_id": 12345
    },
    "action_rows": [
      {
        "id": "loop-body",
        "type": "custom_code",
        "group": "action",
        "config": { "code": ["const x = 1;"] }
      }
    ]
  }
}
```

-   The loop lives *inside `config`*: `iterable` (what to loop over), `action_rows` (the body), and the optional `break_condition` and `continue_condition`.
-   The [`iterable`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/for-loop) is a `record_collection` from an earlier `collect_*` action, a multi-value field or a custom variable. Without an iterable, the loop body doesn't run. [The collection pattern](#collect-and-update-a-collection--collect_app_records--collected_records_update) shows how to create and reference a collection. On its own, the example doesn't validate (`action_variable_missing`): put a `collect_app_records` action before it.

## Collect and update a collection — `collect_app_records` → `collected_records_update`

The collection pattern: a *collect* action earlier in the list creates a `record_collection`, and a later action references it. Order matters. The action that creates the collection comes first.

```json
{
  "actions": [
    {
      "id": "collect",
      "type": "collect_app_records",
      "group": "action",
      "config": { "app_id": 12345 }
    },
    {
      "type": "collected_records_update",
      "group": "action",
      "config": {
        "record_collection": {
          "kind": "variable",
          "source": "action",
          "action_type": "record_collection",
          "app_id": 12345
        },
        "field_assignments": [],
        "silent": false
      }
    }
  ]
}
```

-   `record_collection` is an *object reference*, never a string. Tape resolves it by `action_type` and `app_id` to the nearest earlier action that creates such a collection. It doesn't name the `id` of the collect action.
-   Every action that uses a collection takes the same reference shape: `filter_record_collection`, `sort_record_collection`, `collected_records_comment_create`, the `iterable` of a `for_loop`, and so on.

## Next steps

[

Actions

every action, with a page per type.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)[

Dynamic values

how references pull in record data.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Filters

conditions for `conditional` and collection actions.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters)[

Manage

add the actions to an automation.

](https://developers.tapeapp.com/docs/api/resource/automation/manage)[

Run & simulate

simulate the automation before it goes live.

](https://developers.tapeapp.com/docs/api/resource/automation/execution)
