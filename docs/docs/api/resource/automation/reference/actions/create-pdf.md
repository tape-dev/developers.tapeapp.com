# create_pdf

> Config reference for the Tape automation create_pdf action, with its config keys, defaults and an example.

Use this action to render an HTML template to a PDF file that later actions can use.

> Tip
> 
> Read the live `config` shape of each action type from [`GET /v1/automation/meta/action`](https://developers.tapeapp.com/docs/api/resource/automation/discovery) before you build on it.

In the automation editor, this action is **Create a PDF** in the [Email & documents](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#email--documents) family. Its `group` is `action`, and it works with every trigger.

Send it in the `actions` array of [Create an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#create-an-automation) or [Update an automation](https://developers.tapeapp.com/docs/api/resource/automation/manage#update-an-automation). An update replaces the whole array, so include the other actions.

## Example

This action renders an invoice for the current record:

```json
{
  "type": "create_pdf",
  "config": {
    "filename": ["invoice-", { "kind": "variable", "source": "meta", "meta_type": "app_record_id", "app_id": 87 }, ".pdf"],
    "page_size": "a4",
    "page_orientation": "portrait",
    "page_margins": "normal",
    "pdf_body": ["<h1>Invoice</h1><p>Thank you for your order.</p>"],
    "custom_variable_def": { "custom_type": "single_file", "label": "Invoice PDF" }
  }
}
```

## Config

Every key is optional. Tape fills in the same defaults as the editor, so a short config still gives a complete action.

| Property | Type | Description | Example value |
| --- | --- | --- | --- |
| `filename` | [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Name of the generated file. Empty when left out. | `["invoice.pdf"]` |
| `custom_variable_def` | object | The output variable that holds the generated PDF file. Default `{ "custom_type": "single_file", "label": "PDF" }`. | `{ "custom_type": "single_file", "label": "Invoice PDF" }` |
| `pdf_body` | [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | HTML template for the PDF content. Empty when left out. | `["<h1>Invoice</h1>"]` |
| `page_size` | enum | Page size. Default `a4`. See [Page sizes](#page-sizes). | `"a4"` |
| `page_custom_width` | [code value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Custom page width. Used only when `page_size` is `custom_size`. Empty when left out. | `["210"]` |
| `page_custom_height` | [code value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Custom page height. Used only when `page_size` is `custom_size`. Empty when left out. | `["297"]` |
| `page_orientation` | enum | Page orientation: `portrait` or `landscape`. Default `portrait`. | `"portrait"` |
| `page_margins` | enum | Page margin preset. Default `normal`. See [Page margins](#page-margins). | `"normal"` |
| `page_custom_margin_top` | [code value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Custom top margin. Used only when `page_margins` is `custom_margins`. Empty when left out. | `["20"]` |
| `page_custom_margin_right` | [code value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Custom right margin. Used only when `page_margins` is `custom_margins`. Empty when left out. | `["15"]` |
| `page_custom_margin_bottom` | [code value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Custom bottom margin. Used only when `page_margins` is `custom_margins`. Empty when left out. | `["20"]` |
| `page_custom_margin_left` | [code value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Custom left margin. Used only when `page_margins` is `custom_margins`. Empty when left out. | `["15"]` |
| `pdf_header_custom_margin_top` | [code value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Custom top margin of the header. Used only when `page_margins` is `custom_margins`. Empty when left out. | `["10"]` |
| `pdf_footer_custom_margin_bottom` | [code value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | Custom bottom margin of the footer. Used only when `page_margins` is `custom_margins`. Empty when left out. | `["10"]` |
| `page_numbers_enabled` | boolean | Whether Tape adds page numbers. Default `false`. | `true` |
| `page_number_style` | enum | Numbering style of the page numbers. Default `decimal`. See [Page number styles](#page-number-styles). | `"decimal"` |
| `page_number_start` | [code value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | The number of the first page. Empty when left out. | `["1"]` |
| `header_and_footer_enabled` | boolean | Whether Tape adds the header and footer. Default `false`. | `true` |
| `pdf_header` | [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | HTML template for the header on the first page. Empty when left out. | `["<p>Acme Inc.</p>"]` |
| `pdf_header_following_pages_enabled` | boolean | Whether the following pages get their own header. Default `false`. | `false` |
| `pdf_header_following_pages` | [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | HTML template for the header on the following pages. Empty when left out. | `["<p>Invoice, continued</p>"]` |
| `pdf_footer` | [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | HTML template for the footer on the first page. Empty when left out. | `["<p>Thank you for your business.</p>"]` |
| `pdf_footer_following_pages_enabled` | boolean | Whether the following pages get their own footer. Default `false`. | `false` |
| `pdf_footer_following_pages` | [template value](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values) | HTML template for the footer on the following pages. Empty when left out. | `["<p>Acme Inc.</p>"]` |
| `options_expanded` | boolean | Editor only: whether the advanced options section shows expanded. Default `false`. | `false` |
| `pdf_header_expanded` | boolean | Editor only: whether the header section shows expanded. Default `true`. | `true` |
| `pdf_footer_expanded` | boolean | Editor only: whether the footer section shows expanded. Default `true`. | `true` |
| `pdf_body_expanded` | boolean | Editor only: whether the body section shows expanded. Default `true`. Stays `true` while `header_and_footer_enabled` is `false`. | `true` |

### Page sizes

`page_size` takes one of these lower-case tokens:

-   `letter`
-   `tabloid`
-   `legal`
-   `a3`
-   `a4`
-   `a5`
-   `envelope_10`
-   `custom_size`: uses `page_custom_width` and `page_custom_height`.

### Page margins

`page_margins` takes one of these lower-case tokens:

-   `normal`
-   `narrow`
-   `moderate`
-   `wide`
-   `custom_margins`: uses the four `page_custom_margin_*` values and the header and footer margins.

### Page number styles

`page_number_style` takes one of these lower-case tokens:

-   `decimal`: 1, 2, 3
-   `decimal_leading_zero`: 01, 02, 03
-   `lower_latin`: a, b, c
-   `upper_latin`: A, B, C
-   `lower_roman`: i, ii, iii
-   `upper_roman`: I, II, III

### Editor-only flags

The four `*_expanded` keys only control which sections the automation editor shows expanded. They don't change the PDF.

-   `meta/action` lists them in the `config_schema`.
-   Tape keeps them on read and write, so a read-modify-write preserves them.
-   While `header_and_footer_enabled` is `false`, Tape sets `pdf_body_expanded` to `true`. In that state the editor has no control to open a closed body section.

## Use the file in a later action

The action stores the file in the variable from `custom_variable_def`. A later action reads it with a `custom` reference that has the same `custom_type` and `label`. This `send_email` entry attaches the invoice:

```json
{
  "type": "send_email",
  "config": {
    "to_address": ["juliet@acme.com"],
    "subject": ["Your invoice"],
    "attach_files_variable_defs": [
      { "kind": "variable", "source": "custom", "custom_type": "single_file", "label": "Invoice PDF" }
    ]
  }
}
```

## General behavior

-   The defaults are the ones in the [Config](#config) table. Without `custom_variable_def`, the output variable has the label `PDF`.
-   Tape ignores the custom sizes and margins unless `page_size` is `custom_size` or `page_margins` is `custom_margins`.
-   Code values for sizes, margins and `page_number_start` must resolve to a number.
-   Tape reads custom sizes and margins in millimeters, so `["210"]` by `["297"]` is A4.
-   The action writes no reliable success entry to the run log. Don't use the log to confirm that the PDF was rendered.

## Requirements

-   To add or change this action through the API, your token needs the `automations:edit` capability. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   You must administer the workspace that the automation's database app belongs to.

## Next steps

[

send\_email

attach the generated PDF to an email.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions/send-email)[

Dynamic values

build template values and code values, and use the PDF output variable.

](https://developers.tapeapp.com/docs/api/resource/automation/dynamic-values)[

Action examples

configs to copy for the common actions.

](https://developers.tapeapp.com/docs/api/resource/automation/action-examples)[

Actions

all 35 action types.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)
