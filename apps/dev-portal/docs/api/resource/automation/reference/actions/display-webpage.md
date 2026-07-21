---
id: display-webpage
title: display_webpage
sidebar_label: display_webpage
description: Config reference for the Tape automation display_webpage action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Display webpage** — renders an HTML webpage to the user. `group: "action"`. Requires the `weblink_clicked` trigger context.

Part of the [Automation calls & weblinks](/docs/api/resource/automation/reference/actions#automation-calls--weblinks) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `join_type` | enum | no | How the webpage joins any previously displayed webpage. Default `add_below`. |
| `fullscreen` | boolean | no | Whether the webpage is displayed fullscreen. Carried through only when set. |
| `remove_branding` | boolean | no | Whether Tape branding is removed. Carried through only when set. |
| `webpage_body` | [template value](/docs/api/resource/automation/dynamic-values) | no | HTML template string rendered as the webpage body. Empty when omitted. |

**`join_type` tokens** (lower-case): `add_below`, `add_above`, `replace_previous`. Omitted → the editor seeds and the
mapper fills `add_below`. Any other value is rejected with a `400` (config enum tokens are now strictly validated).

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "display_webpage",
  "config": {
    "join_type": "add_below",
    "fullscreen": true,
    "remove_branding": false,
    "webpage_body": ["<h1>Hello ", { "kind": "variable", "source": "meta", "meta_type": "app_record_id" }, "</h1>"]
  }
}
```

## Validation & behavior

- No member is required — an omitting caller still yields a complete internal action.
- `join_type` has no public default, but the editor seeds `add_below` and the mapper fills it, so an omitted `join_type` behaves as `add_below`.
- `webpage_body` defaults to empty when omitted; `fullscreen` and `remove_branding` are carried through only when the caller supplies them.
- This action needs the `weblink_clicked` trigger context to run.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
