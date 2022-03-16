---
id: link
title: Links
sidebar_label: Links
---

It is quite easy to generate a clickable link inside the calculation field:

```ts
// Reference the "Link" field of your app, which can contain multiple links
const links = @Link;

// Get the first link
const firstLinkUrl = links[0];

// Result is the URL of the first link
firstLinkUrl
```

Markdown will automatically make a link clickable if it has the correct URL format.

## Open a Link In a New Tab

A markdown link does not have the option to open the link in a new tab. We can use HTML for this:

```ts
// Reference the "Link" field of your app, which can contain multiple links
const links = @Link;

// Get the first link
const firstLinkUrl = links[0];

// Result is the URL of the first link, opens in new tab
`<a href="${firstLinkUrl}" target="_blank">Click!</a>`
```
