---
id: display-webpage
title: display_webpage
sidebar_label: display_webpage
description: Config reference for the Tape automation display_webpage action, with its config keys, defaults and an example.
---

Use this action to show a webpage to the person who opened a weblink.

:::tip
Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before you build on it.
:::

In the automation editor, this action is **Display a message on a web page** in the [Automation calls & weblinks](/docs/api/resource/automation/reference/actions#automation-calls--weblinks) family. Its `group` is `action`, and it needs the `weblink_clicked` trigger.

Send it in the `actions` array of [Create an automation](/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

A customer opens the weblink to confirm the installation date of their solar system. The page thanks them and shows the installation number:

```json
{
  "type": "display_webpage",
  "config": {
    "join_type": "replace_previous",
    "fullscreen": false,
    "remove_branding": true,
    "webpage_body": [
      "<h1>Thanks, your installation is confirmed</h1><p>Installation ",
      { "kind": "variable", "source": "meta", "meta_type": "app_record_id", "app_id": 87 },
      "</p>"
    ]
  }
}
```

## Config

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `join_type` | enum | How this page joins a page that an earlier action displayed. Default `add_below`. See [Join types](#join-types). | `"add_below"` |
| `fullscreen` | boolean | Shows the page in fullscreen. Kept only when you set it. | `false` |
| `remove_branding` | boolean | Removes the Tape branding from the page. Kept only when you set it. | `true` |
| `webpage_body` | [template value](/docs/api/resource/automation/dynamic-values) | HTML body of the page. Empty when left out. | `["<h1>Thanks</h1>"]` |

In the editor, `fullscreen` is **Fullscreen** and `remove_branding` is **Remove Tape info**.

### Join types

`join_type` takes one of these lower-case tokens. The editor name is in brackets.

- `add_below` (**Add below**): adds this page below the page shown before.
- `add_above` (**Add above**): adds this page above the page shown before.
- `replace_previous` (**New page**): replaces the page shown before.

Tape rejects any other value with `400`.

## General behavior {#validation--behavior}

- No key is required. Tape saves the action with an empty config.
- Without `join_type`, Tape uses `add_below`, the same value the editor sets.
- Without `webpage_body`, the page is empty.
- `fullscreen` and `remove_branding` come back on read only when you set them.
- Without the `weblink_clicked` trigger, validation reports the [broken reason](/docs/api/resource/automation/reference/errors#broken-reason-codes) `action_invalid`.
- References in `webpage_body` that don't resolve show up as broken reasons when you validate.

## Requirements

- To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](/docs/api/capabilities).
- You must administer the workspace that the automation's database app belongs to.
- The automation needs the `weblink_clicked` trigger.

<a id="see-also"></a>

## Next steps

- [current_record_generate_automation_weblink](/docs/api/resource/automation/reference/actions/current-record-generate-automation-weblink): create the weblink that starts this automation.
- [redirect_user](/docs/api/resource/automation/reference/actions/redirect-user): send the person to another URL instead.
- [Dynamic values](/docs/api/resource/automation/dynamic-values): put record data into `webpage_body`.
- [Triggers](/docs/api/resource/automation/reference/triggers): set up `weblink_clicked`.
- [Actions](/docs/api/resource/automation/reference/actions): all 35 action types.
