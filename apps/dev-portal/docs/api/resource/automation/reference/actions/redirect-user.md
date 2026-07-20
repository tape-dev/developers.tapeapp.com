---
id: redirect-user
title: redirect_user
sidebar_label: redirect_user
description: Config reference for the Tape automation redirect_user action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Redirect user** — redirects the user to a target URL. `group: "action"`. Requires the `weblink_clicked` trigger context.

Part of the [Automation calls & weblinks](/docs/api/resource/automation/reference/actions#automation-calls--weblinks) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `redirect_url` | [template value](/docs/api/resource/automation/dynamic-values) | **yes** | Target URL to redirect the user to. |

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "redirect_user",
  "config": {
    "redirect_url": ["https://example.com/records/", { "kind": "variable", "source": "meta", "meta_type": "app_record_id" }]
  }
}
```

## Validation & behavior

- `redirect_url` is the only member and is **required** — it has no canonical default, so it must always be supplied.
- The action runs in the `weblink_clicked` trigger context; the redirect happens when the user clicks the weblink.
- `redirect_url` is a template value, so it can interpolate variables and references resolved at run time.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and references
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
