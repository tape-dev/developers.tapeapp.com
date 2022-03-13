---
id: button
title: Buttons
sidebar_label: Buttons
---

The calculation field has support for HTML buttons. The "type" attribute can be used to pick one of the available colors & styles:

```html
<style>
  button {
    margin: 4px 4px;
  }
</style>

<button>Default button</button>
<button type="danger">Danger button</button>
<button type="outline">Outline button</button>
<button type="outline-danger">Outline danger button</button>
```

Here's how the button types from above will be rendered:
<img width="300" src="/img/docs/calculation/calculation-buttons.png"></img>

<br />
<br />

Executing custom JavaScript code in the browser of the user is not permitted due to security reasons. So you cannot execute JavaScript in the `onclick` event handler of the button. However, wrapping the button in an anchor gives you a clickable button that opens the specified URL:

```html
<a target="_blank" href="https://get.tapeapp.com">
  <button>Open Tape</button>
</a>
```

The full calculation field script might look like this:

```ts
// Reference the "Link" field of your app, which can contain multiple links
const links = @Link;

// Get the first link
const firstLinkUrl = links[0];

// Result is the HTML button and anchor to open the link in a new tab
`
<a target="_blank" href="${firstLinkUrl}">
  <button>Open Link</button>
</a>
`
```
