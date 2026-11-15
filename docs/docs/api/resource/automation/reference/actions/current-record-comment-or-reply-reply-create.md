# current_record_comment_or_reply_reply_create

> Config reference for the Tape automation current_record_comment_or_reply_reply_create action, with its config keys, defaults and an example.

Use this action to reply to the comment or reply that started an automation.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Reply to the current comment** in the [Current record](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#current-record) family. Its `group` is `action`, and it needs the `record_comment_or_reply_created` trigger.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

When someone comments on a support task, this action confirms that the team logged the request:

```json
{
  "type": "current_record_comment_or_reply_reply_create",
  "config": {
    "reply_content": ["Thanks, we logged your request as task ", { "kind": "variable", "source": "meta", "meta_type": "app_record_id", "app_id": 87 }, "."],
    "silent": true
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `reply_content` | [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | **Required.** Text of the reply. A plain string works too. Tape turns it into an array. | `["Thanks, we're on it."]` |
| `author_id` | integer | [reference](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | User Tape attributes the reply to: a user ID, or a reference to the creator, the last modifier or a user field. Left out, the automation itself is the author. | `812` |
| `trigger_webhooks` | boolean | Whether the reply fires outbound webhooks. Default `false`. | `false` |
| `trigger_other_flows` | boolean | Whether the reply starts other automations. Default `false`. | `false` |
| `silent` | boolean | Whether Tape sends no notifications for the reply. Default `false`. | `true` |

`author_id`, `trigger_webhooks`, `trigger_other_flows` and `silent` are shared by every action that changes records. In the action menu of the automation editor, they are **Author**, **Trigger webhooks**, **Trigger automations** and **Silent**. To find a user ID for `author_id`, see [Retrieve organization users](https://developers.tapeapp.com/docs/api/resource/user#retrieve-organization-users).

## General behavior

-   `reply_content` is the only required key. It has no default.
-   With an empty `reply_content`, Tape skips the action when the automation runs.
-   The action replies to the comment or reply that started the run. Only the `record_comment_or_reply_created` trigger provides it.
-   With any other trigger, validation reports the [broken reason](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors#broken-reason-codes) `action_invalid`.
-   Mentions in `reply_content` can only point to members of the workspace that the trigger's database app belongs to.
-   Without `author_id`, the automation itself is the author. A user ID that Tape can't find gives the broken reason `action_user_missing`.
-   Tape returns `silent` on every read. It's `false` when you left it out.
-   Keep `trigger_other_flows` at `false` so the reply doesn't start this automation again.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.
-   The automation needs the `record_comment_or_reply_created` trigger.

## Next steps

[

current\_record\_comment\_or\_reply\_delete

delete the comment or reply that started the run.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-comment-or-reply-delete)[

current\_record\_comment\_create

add a new comment to the current record.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/current-record-comment-create)[

Dynamic values

build template values and references.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Triggers

the `record_comment_or_reply_created` trigger.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
