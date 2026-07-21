---
id: create-pdf
title: create_pdf
sidebar_label: create_pdf
description: Config reference for the Tape automation create_pdf action — its typed config keys, defaults, and an example.
---

:::caution Internal beta — config shape is being migrated
The **Automation** API is an internal beta and is **not released yet** — endpoints and payloads may change or be
withdrawn without notice. This action's `config` is being migrated to a **typed schema**; the fields below reflect that
in-progress shape. Always read the authoritative, live shape from
[`GET /v1/automation/meta/action`](/docs/api/resource/automation/discovery) before building against it.
:::

**Create PDF** — renders an HTML template to a PDF. `group: "action"`. No specific trigger context is required.

Part of the [Email & documents](/docs/api/resource/automation/reference/actions#email--documents) family. This page
documents the typed `config`; for how an action sits inside an automation definition, see
[Actions](/docs/api/resource/automation/reference/actions) and [Action examples](/docs/api/resource/automation/action-examples).

## Config

Every member is optional — each carries a canonical editor default, so an omitting caller still yields a complete
action.

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `options_expanded` | boolean | no | Editor-only UI flag: whether the advanced options section is expanded. Default `false`. |
| `filename` | [template value](/docs/api/resource/automation/dynamic-values) | no | The generated file's name. Empty when omitted. |
| `custom_variable_def` | object | no | The custom variable the action outputs (the generated PDF file). `{ single_file, PDF }` when omitted. |
| `page_numbers_enabled` | boolean | no | Whether page numbers are rendered. Default `false`. |
| `header_and_footer_enabled` | boolean | no | Whether the PDF header and footer are rendered. Default `false`. |
| `page_size` | enum | no | Page size. Default `a4`. |
| `page_custom_width` | [code value](/docs/api/resource/automation/dynamic-values) | no | Custom page width, used only when `page_size` is `custom_size`. Empty when omitted. |
| `page_custom_height` | [code value](/docs/api/resource/automation/dynamic-values) | no | Custom page height, used only when `page_size` is `custom_size`. Empty when omitted. |
| `page_orientation` | enum | no | Page orientation. Default `portrait`. |
| `page_margins` | enum | no | Page margins preset. Default `normal`. |
| `page_custom_margin_top` | [code value](/docs/api/resource/automation/dynamic-values) | no | Custom top margin, used only when `page_margins` is `custom_margins`. Empty when omitted. |
| `page_custom_margin_right` | [code value](/docs/api/resource/automation/dynamic-values) | no | Custom right margin, used only when `page_margins` is `custom_margins`. Empty when omitted. |
| `page_custom_margin_bottom` | [code value](/docs/api/resource/automation/dynamic-values) | no | Custom bottom margin, used only when `page_margins` is `custom_margins`. Empty when omitted. |
| `page_custom_margin_left` | [code value](/docs/api/resource/automation/dynamic-values) | no | Custom left margin, used only when `page_margins` is `custom_margins`. Empty when omitted. |
| `pdf_header_custom_margin_top` | [code value](/docs/api/resource/automation/dynamic-values) | no | Custom header top margin. Empty when omitted. |
| `pdf_footer_custom_margin_bottom` | [code value](/docs/api/resource/automation/dynamic-values) | no | Custom footer bottom margin. Empty when omitted. |
| `page_number_style` | enum | no | Page-number numbering style. Default `decimal`. |
| `page_number_start` | [code value](/docs/api/resource/automation/dynamic-values) | no | The number the first page's number starts at. Empty when omitted. |
| `pdf_header` | [template value](/docs/api/resource/automation/dynamic-values) | no | Header HTML template rendered on the first page. Empty when omitted. |
| `pdf_header_expanded` | boolean | no | Editor-only UI flag: whether the header section is expanded. Default `false`. |
| `pdf_header_following_pages` | [template value](/docs/api/resource/automation/dynamic-values) | no | Header HTML template rendered on following pages. Empty when omitted. |
| `pdf_header_following_pages_enabled` | boolean | no | Whether a distinct following-pages header is used. Default `false`. |
| `pdf_footer` | [template value](/docs/api/resource/automation/dynamic-values) | no | Footer HTML template rendered on the first page. Empty when omitted. |
| `pdf_footer_expanded` | boolean | no | Editor-only UI flag: whether the footer section is expanded. Default `false`. |
| `pdf_footer_following_pages` | [template value](/docs/api/resource/automation/dynamic-values) | no | Footer HTML template rendered on following pages. Empty when omitted. |
| `pdf_footer_following_pages_enabled` | boolean | no | Whether a distinct following-pages footer is used. Default `false`. |
| `pdf_body_expanded` | boolean | no | Editor-only UI flag: whether the body section is expanded. Default `false`. |
| `pdf_body` | [template value](/docs/api/resource/automation/dynamic-values) | no | Body HTML template rendered as the PDF content. Empty when omitted. |

**`page_size` tokens** (lower-case): `letter`, `tabloid`, `legal`, `a3`, `a4`, `a5`, `envelope_10`, `custom_size`.
Custom dimensions apply only under `custom_size`.

**`page_orientation` tokens** (lower-case): `portrait`, `landscape`.

**`page_margins` tokens** (lower-case): `normal`, `narrow`, `moderate`, `wide`, `custom_margins`. Custom margins apply
only under `custom_margins`.

**`page_number_style` tokens** (lower-case): `decimal`, `decimal_leading_zero`, `lower_latin`, `upper_latin`,
`lower_roman`, `upper_roman`.

The four `*_expanded` members are editor-only UI layout flags. They are **advertised in the live discovery
`config_schema`** and round-trip on both read and write, so a read-modify-write preserves them.

## Example

An action entry inside an automation definition's `actions[]`:

```json
{
  "type": "create_pdf",
  "config": {
    "filename": ["invoice-", { "kind": "variable", "source": "meta", "meta_type": "app_record_id" }, ".pdf"],
    "page_size": "a4",
    "page_orientation": "portrait",
    "page_margins": "normal",
    "pdf_body": ["<h1>Invoice</h1><p>Thank you for your order.</p>"]
  }
}
```

## Validation & behavior

- No member is required — each carries a canonical editor default. The four page enums default to `page_size` → `a4`,
  `page_orientation` → `portrait`, `page_margins` → `normal`, and `page_number_style` → `decimal`; every boolean
  defaults to `false`, and every template / code string defaults to the empty definition.
- `custom_variable_def` is the action's output (the generated PDF file); omitting it yields the canonical
  `{ single_file, PDF }` variable.
- Custom dimensions (`page_custom_*`) apply only under the matching `custom_size` / `custom_margins` presets and are
  ignored otherwise.
- The action renders an HTML template to a PDF and produces no reliable per-action success log — do not rely on a
  success log entry to confirm the render.

## See also

- [Dynamic values](/docs/api/resource/automation/dynamic-values) — template values and code values
- [Action examples](/docs/api/resource/automation/action-examples) · [Actions catalog](/docs/api/resource/automation/reference/actions)
