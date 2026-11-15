# Actions

> The 35 Tape automation action types, grouped by family, each with its label and where to read its config schema.

Use actions to define *what* an automation does.

An automation's actions are an ordered list of steps: leaf steps (`group: "action"`) and *control-flow* actions (`group: "control_flow"`) that nest more actions.

## The action object

| Property | Type | Description |
| --- | --- | --- |
| `id` | `string` | Opaque node ID. Optional on input, Tape creates one when you leave it out. Present on every read. |
| `type` | `string` | The action type. See [Action types](#action-types). |
| `group` | `string` | `action` or `control_flow`. Follows from `type` and is read-only. You can leave it out on input. |
| `custom_name` | `string` | Optional label. Absent when not set. |
| `deactivate` | `boolean` | Whether the step is skipped. Absent when not set. |
| `continue_on_error` | `boolean` | Whether the run goes on when this step fails. Absent when not set. |
| `config` | `object` | The step's settings, keyed as the action's `config_schema` describes. Required on every action you write through the API. An empty `{}` is valid for a step you haven't set up yet, unless the type's `config_schema` requires members, for example `code` for `custom_code` or `exit_type` for `exit`. Such a config and a missing `config` key return `400`. [Dynamic values](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) inside use the reference model. |
| *(control-flow `config`)* |  | For `conditional` and `for_loop`, `config` holds the branch and loop structure. See [Control-flow actions](#control-flow-actions). |

### Write and read a config

`config` keys come from the action's `config_schema` on [`meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery), but a written `config` doesn't read back byte for byte.

-   **Tape fills in defaults for missing members on read.** A missing `match_condition` or `attach_files_match_condition` reads back as an empty filter group or `null`, missing required arrays (`ref_collection_defs`, `field_assignments`, `call_arguments`, `http_call_headers`, `sorts`) as `[]`. The exception is `field_assignments` of `record_create`: left out, it stays out on read. An unchanged `GET` → `PUT` still works, but don't compare write and read.
-   **`field_assignments` is a typed union per field type.** It's the payload of every action that changes records (`record_create`, `current_record_update`, `referenced_records_update`, `collected_records_update`) and is told apart by `field_type`. The `meta/action` schema describes its array items only loosely, so copy the filled assignments from [`record_create`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/record-create) or [`current_record_update`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-update). An empty `[]` is accepted in every case and changes no field value.
-   **A paired `_enabled` flag controls `limit`.** In `collect_app_records` and `collect_app_view_records`, `limit` only takes effect when `limit_enabled` is `true`, so send both. Either way, a collect stops at the server maximum of 1000 records and cuts off the rest without an error when the automation runs. See [Limits and throttling](https://developers.tapeapp.com/docs/automations/limitations). The `_enabled` flags for `triggering_app_ids` and `custom_variable_defs` belong to the *trigger* config, not the action config.
-   **A condition inside `config`**, for example the `match_condition` of a collect or filter action, uses the *same public [filter tree](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters)* as the `condition` of a `conditional`: lower-case `operator: "and" | "or"` with `rows`.
-   **Passing `config_schema` checks only the structure.** A config that passes the schema is *saved*. Rules that depend on meaning show up later as [broken-reason codes](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors) when you [validate](https://developers.tapeapp.com/docs/api/resource/automation/execution) or activate. Examples: the `app_id` of `referenced_records_update` must be an app that the trigger app relates to, and a sort key must be scoped to the collection.
-   **All config enum values are lower-case.** Send them exactly as `meta/action` lists them, for example `http_call_type: "post"`, `exit_type: "success"`, `ref_collection_defs[].direction: "incoming"`, `match_type: "all"`.

Stricter config shapes per type may follow. Read the keys from `meta/action`, and don't hard-code internal encodings.

## Action types

There are 35 action types: 33 leaf actions (`group: "action"`) and 2 control-flow actions (`group: "control_flow"`).

-   Each type's `config` keys come from its `config_schema` on [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery).
-   The labels and descriptions below follow that endpoint. The automation editor can name an action differently. Each action page gives its editor name.
-   The families only help you read the list. An action's real grouping is its `group` field.

### Code & variables

| Action | What it does |
| --- | --- |
| [`custom_code`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/custom-code) | **Run code**: runs custom code in the automation sandbox. |
| [`custom_variable`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/custom-variable) | **Set variable**: computes and stores a custom variable for later actions. |

### Current record

| Action | What it does |
| --- | --- |
| [`record_create`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/record-create) | **Create record**: creates a record in a database app. |
| [`current_record_update`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-update) | **Update record**: updates the current record. |
| [`current_record_delete`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-delete) | **Delete record**: deletes the current record. |
| [`current_record_restore`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-restore) | **Restore record**: restores the current (soft-deleted) record. |
| [`current_record_get_previous_revision`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-get-previous-revision) | **Get previous revision**: loads the previous revision of the current record. |
| [`current_record_comment_create`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-comment-create) | **Add comment**: adds a comment to the current record. |
| [`current_record_comment_or_reply_reply_create`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-comment-or-reply-reply-create) | **Add reply**: adds a reply to the current comment or reply. |
| [`current_record_comment_or_reply_delete`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-comment-or-reply-delete) | **Delete comment or reply**: deletes the current comment or reply. |

### Record collections

| Action | What it does |
| --- | --- |
| [`collect_app_records`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-app-records) | **Collect app records**: collects records from a database app, optionally filtered. |
| [`collect_app_view_records`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-app-view-records) | **Collect app view records**: collects records from a view of a database app. |
| [`collect_referenced_records`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-referenced-records) | **Collect referenced records**: collects records referenced by the current record. |
| [`collected_records_collect_referenced_records`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collected-records-collect-referenced-records) | **Collect referenced records (from collection)**: collects records referenced by a starting record collection. |
| [`filter_record_collection`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/filter-record-collection) | **Filter collection**: filters a record collection. |
| [`sort_record_collection`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/sort-record-collection) | **Sort collection**: sorts a record collection. |
| [`clear_record_collection`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/clear-record-collection) | **Clear collection**: empties a record collection. |
| [`collected_records_update`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collected-records-update) | **Update collected records**: updates every record in a collection. |
| [`referenced_records_update`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/referenced-records-update) | **Update referenced records**: updates records referenced by the current record. |
| [`collected_records_comment_create`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collected-records-comment-create) | **Comment on collected records**: adds a comment to every record in a collection. |
| [`rollup_iterable_values`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/rollup-iterable-values) | **Roll up values**: aggregates the values of an iterable (count, sum, average, …). |

Most of these actions work in pairs: one creates a collection, a later one uses it.

-   A `collect_*` action creates a `record_collection`.
-   A later action uses it: `filter_record_collection`, `sort_record_collection`, `clear_record_collection`, the `collected_records_*` family, or the `iterable` of a `for_loop`.
-   The action that creates the collection must come *first* in the automation.
-   The later action references the collection with an object, `{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": … }`. Tape resolves it to the *nearest earlier action* that creates such a collection. It never names that action's `id`.
-   An action that uses a collection without a matching earlier action fails validation.

### Automation calls & weblinks

| Action | What it does |
| --- | --- |
| [`current_record_call_automation`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-call-automation) | **Call automation**: calls another automation with the current record. |
| [`collected_records_call_automation`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collected-records-call-automation) | **Call automation for collected records**: calls another automation for every record in a collection. |
| [`current_record_generate_automation_weblink`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-generate-automation-weblink) | **Generate weblink**: generates a weblink that calls an automation with the current record. |
| [`display_webpage`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/display-webpage) | **Display webpage**: displays a webpage in a weblink flow. |
| [`redirect_user`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/redirect-user) | **Redirect user**: redirects the user to a URL in a weblink flow. |

The call and weblink actions reference a target automation by ID. The target must *exist*, be in the *right database app* and have the matching trigger. Otherwise the definition fails validation.

-   `current_record_call_automation` needs a target with `automation_called` in the same database app as the trigger.
-   `collected_records_call_automation` needs a target with `automation_called` in the database app of its `record_collection`. Without `record_collection`, validation reports `action_invalid` and `action_automation_invalid`.
-   `current_record_generate_automation_weblink` needs a target with `weblink_clicked` in the same database app as the trigger. The action itself runs with any trigger that has a record. See [Trigger context](#trigger-context).

A *paused* target is a valid reference, but a call to it creates no run. See [Call an automation](https://developers.tapeapp.com/docs/api/resource/automation/advanced#call-an-automation).

### Email & documents

| Action | What it does |
| --- | --- |
| [`send_email`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/send-email) | **Send email**: sends an email. |
| [`collected_records_send_email`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collected-records-send-email) | **Send email for collected records**: sends an email for every record in a collection. |
| [`create_pdf`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/create-pdf) | **Create PDF**: renders an HTML template to a PDF file. |

### HTTP requests

| Action | What it does |
| --- | --- |
| [`http_call`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/http-call) | **HTTP request**: makes an outbound HTTP request. |
| [`authenticated_http_call`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/authenticated-http-call) | **Authenticated HTTP request**: makes an outbound HTTP request signed by an authentication provider. |

-   Outbound requests have [SSRF protection](https://help.tapeapp.com/en/articles/18448976-automation-ip-addresses). Tape refuses hosts that resolve to private or internal addresses.
-   `authenticated_http_call` also needs an `authentication_provider_id`. The public API has *no endpoint to create or list connections*. An organization admin sets them up in Tape. You can *define* the action through the API, but without a valid provider ID, Tape skips it when the automation runs.

### Flow control

| Action | What it does |
| --- | --- |
| [`delay`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/delay) | **Delay**: pauses the automation for a fixed duration. |
| [`exit`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/exit) | **Exit**: ends the automation run with success or failure. |
| [`for_loop`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/for-loop) | **For loop**: runs nested actions for each item of an iterable. `group: "control_flow"`. |
| [`conditional`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/conditional) | **Condition**: runs nested actions only when a condition holds. `group: "control_flow"`. |

### Trigger context

Some actions are only valid with a matching trigger. A wrong pairing fails validation with `action_invalid`, unless the row says otherwise.

| Action(s) | Requires trigger |
| --- | --- |
| `display_webpage` | `weblink_clicked` |
| `redirect_user` | `weblink_clicked`. Validation doesn't check this pairing. The editor offers the action only there. |
| `current_record_comment_or_reply_reply_create`, `current_record_comment_or_reply_delete` | `record_comment_or_reply_created` |
| `current_record_*` (update, delete, restore, get\_previous\_revision, comment\_create, call\_automation, generate\_automation\_weblink), `collect_referenced_records` | Any trigger *with a record* (not `periodic` or `webhook_received` without a record) |
| `referenced_records_update` | Any trigger *with a record*. Validation doesn't check the trigger, only `app_id`: without it `action_app_missing`, without a relation to the trigger's database app `action_app_invalid`. Without a current record, Tape skips the action when the automation runs. |

Triggers with a record are `record_created`, `record_updated`, `record_deleted`, `record_comment_or_reply_created`, `date_field_arrived`, `automation_called` and `weblink_clicked`.

## Control-flow actions

`conditional` and `for_loop` keep their whole structure *inside `config`*, like every other action. There are no top-level control-flow fields.

-   Each branch or condition is switched on by *presence*. A member you leave out is off.
-   A nested body is an array of actions in `action_rows`.

**`conditional`**: `config` keys

| Key | Type | Description |
| --- | --- | --- |
| `condition` | [filter group](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) | `null` | The branch condition. `null` or left out means true in every case. |
| `action_rows` | array of [actions](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions) | The if/then branch. |
| `else_action_rows` | array of [actions](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions) | The else branch. Leave it out to switch it off. |

**`for_loop`**: `config` keys

| Key | Type | Description |
| --- | --- | --- |
| `iterable` | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | The collection to loop over. The public name is `iterable`; the internal name is `iterable_variable_def`. |
| `action_rows` | array of [actions](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions) | The loop body. |
| `break_condition` | [filter group](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) | `null` | Stops the loop when it matches. Leave it out to switch it off. |
| `continue_condition` | [filter group](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) | `null` | Skips to the next item when it matches. Leave it out to switch it off. |

See [`conditional`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/conditional) and [`for_loop`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/for-loop) for full config examples.

## Coming from Podio

Find the Tape action for each step of a Podio flow or a Globiflow flow.

| Podio flow or Globiflow step | Tape action |
| --- | --- |
| Create item | [`record_create`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/record-create) |
| `item.update`, update item | [`current_record_update`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-update), [`referenced_records_update`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/referenced-records-update), [`collected_records_update`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collected-records-update) |
| `comment.create`, comment | [`current_record_comment_create`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-comment-create) |
| Send email | [`send_email`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/send-email) |
| Wait | [`delay`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/delay), 15, 30, 45 or 60 seconds |
| Call flow | [`current_record_call_automation`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-call-automation) |
| Webhook call, `octoblu.trigger` | [`http_call`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/http-call) |
| Generate PDF | [`create_pdf`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/create-pdf) |
| Search items, loop | [`collect_app_records`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-app-records), [`for_loop`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/for-loop) |
| `task.create`, `status.create` | No action. Use a checklist field instead of tasks. |

## Next steps

[

Action examples

configs to copy for the common actions.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Dynamic values

reference fields and outputs of earlier steps.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Filters

conditions for `conditional`, `for_loop` and collect actions.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters)[

Triggers

which trigger an action needs.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers)[

Errors & broken reasons

what validation reports.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors)
