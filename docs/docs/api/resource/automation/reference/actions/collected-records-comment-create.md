# collected_records_comment_create

> Config reference for the Tape automation collected_records_comment_create action, with its config keys, defaults and an example.

Use this action to add a comment to every record in a collection that an earlier action built.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Add a comment to all collected records** in the [Record collections](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#record-collections) family. Its `group` is `action`, and it works with every trigger but needs an earlier action that creates the record collection.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action asks every collected applicant to pick an interview slot:

```json
{
  "type": "collected_records_comment_create",
  "config": {
    "record_collection": { "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 123 },
    "comment_content": ["Interview slots for next week are open. Pick one by Friday."],
    "silent": true
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `comment_content` | [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** The comment text. | `["Contract signed."]` |
| `record_collection` | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** The collection to comment on, created by an earlier action. The schema lets you save without it, but validation then reports `action_invalid`. | `{ "kind": "variable", "source": "action", "action_type": "record_collection", "app_id": 123 }` |
| `author_id` | integer | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | User Tape attributes the comment to: a user ID, or a reference to the creator, the last modifier or a user field. Left out, the automation itself is the author. | `812` |
| `trigger_webhooks` | boolean | Whether the comment fires outbound webhooks. Default `false`. | `false` |
| `trigger_other_flows` | boolean | Whether the comment starts other automations. Default `false`. | `false` |
| `silent` | boolean | Whether Tape sends no notifications for the comment. Default `false`. | `true` |

`author_id`, `trigger_webhooks`, `trigger_other_flows` and `silent` are shared by every action that changes records. In the action menu of the automation editor, they are **Author**, **Trigger webhooks**, **Trigger automations** and **Silent**. To find a user ID for `author_id`, see [Retrieve organization users](https://developers.tapeapp.com/docs/api/resource/user#retrieve-organization-users).

## General behavior

-   `comment_content` is the only key the schema requires. Without `record_collection`, Tape saves the action, and validation reports `action_invalid`.
-   A `record_collection` without a matching earlier action fails validation with `action_variable_missing`. Tape resolves the reference to the nearest earlier action that creates a collection for the same `app_id`.
-   Tape adds the comment to each record in the collection. A field or meta reference with `collection: true` in `comment_content` reads that record's value.
-   With an empty `comment_content`, Tape skips the action when the automation runs.
-   If the references in `comment_content` resolve to empty text when the automation runs, the action fails, and so does the run.
-   Mentions in `comment_content` can only point to members of the workspace that the collection's database app belongs to.
-   Without `author_id`, the automation itself is the author. A user ID that Tape can't find gives the broken reason `action_user_missing`.
-   Tape returns `silent` on every read. It's `false` when you left it out.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   An earlier action in the automation must create the collection in `record_collection`, for example [`collect_app_records`](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/collect-app-records).

## Next steps

[

current\_record\_comment\_create

comment on the current record only.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-comment-create)[

Dynamic values

build template values and references.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Action examples

configs to copy for the common actions.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
