---
id: collapsible
title: Collapsibles
sidebar_label: Collapsibles
---

The Tape calculation field supports native collapsible sections via the HTML `<details>` and `<summary>` tags. No JavaScript is needed. Both inline styles and `<style>` blocks with CSS selectors are supported. Tape applies its own default styling to `<summary>` elements, custom styles are applied on top.

## Basic collapsible

```html
<details>
  <summary>Show details</summary>
  <p>More information here.</p>
</details>
```

## With field references

Classic editor:

```ts
// Reference the "Title" field
const title = @Title;

// Reference the "Note" field
const note = @Note;

// Result is a collapsible section with field values
`<details>
  <summary>${title}</summary>
  <p>${note}</p>
</details>`
```

New editor:

```ts
// Result is a collapsible section with field values
`<details>
  <summary>${Title}</summary>
  <p>${Note}</p>
</details>`
```

## With styling

Classic editor:

```ts
// Reference the "Title" and "Note" fields
const title = @Title;
const note = @Note;

// Result is a collapsible section with styled heading and blue content
`<details>
  <summary style="font-weight: 600; font-size: 15px;">${title}</summary>
  <p style="color: var(--tape-color-primary);">${note}</p>
</details>`
```

New editor:

```ts
// Result is a collapsible section with styled heading and blue content
`<details>
  <summary style="font-weight: 600; font-size: 15px;">${Title}</summary>
  <p style="color: var(--tape-color-primary);">${Note}</p>
</details>`
```
