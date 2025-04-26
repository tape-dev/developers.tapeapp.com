---
id: custom-css
title: Forms
sidebar_label: Custom Styling
---

:::info
Forms are currently in beta - [register here.](https://get.tapeapp.com/forms12/)
:::

---

# Customize Your Form with CSS

Tape makes it easy to create beautiful forms without any coding. But if you want that extra layer of personalization, a small amount of custom code can truly elevate your form’s look and feel.

By adding your own CSS, you can apply styles and adjustments that go beyond the standard design options.

:::info
Adding custom CSS is available to users with a **paid Tape subscription**.
:::

---

## How to Inject Custom CSS

There are two ways you can customize your forms using custom CSS:

1. In the form builder, open the design settings and paste your custom CSS into the provided CSS field.
2. If your form is connected to a custom domain, you can insert custom CSS through the code injection settings at the form or domain level.

:::warning
Custom CSS is an advanced feature intended for users with coding experience.

Please note that we cannot provide assistance with writing, implementing, or troubleshooting custom CSS. Since custom code is user-managed, we also can't guarantee it will work flawlessly with Tape’s responsive design or future platform updates.
:::

---

## CSS Classes

These CSS classes can be overridden with custom CSS applied to your form app.

:::caution
Avoid using class names that are not listed below. Class names like `css-3e5684a` are automatically generated and subject to change. The Tape block UUID (shown below) is stable.
:::

| Description              | CSS Class                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------- |
| Form page                | `.tape-form-page`                                                                  |
| Field Label              | `.tape-field-block-label`                                                          |
| Field top description    | `.tape-field-block-top-description`                                                |
| Field bottom description | `.tape-field-block-bottom-description`                                             |
| Field error message      | `.tape-field-block-error-message`                                                  |
| Single line Text input   | `.tape-single-text-field-block-input`                                              |
| Multi line Text input    | `.tape-multi-text-field-block-input`                                               |
| Tape block by UUID       | `.tape-block-[UUID]` (example: `.tape-block-2e9cd30c-28e1-4c56-a1ef-d8e945ac103e`) |

---

## Code Snippets

### Layout & Colors

**Change label color**

```css
.tape-field-block-label {
  color: #e00;
}
```

**Use a custom font**

```css
@font-face {
  font-family: 'MY-FONT';
  src: url('https://..../fonts/....eot');
  src: url('https://..../fonts/....woff2');
  src: url('https://..../fonts/....woff');
  src: url('https://..../fonts/....ttf');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

* {
  font-family: 'MY-FONT' !important;
}
```
