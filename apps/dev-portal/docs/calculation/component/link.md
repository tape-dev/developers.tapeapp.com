---
id: link
title: Links
sidebar_label: Links
---

The Tape calculation field supports link output. A Link field in your app can contain multiple links. Use the index to access individual URLs.

## Basic link

Classic editor:

```ts
// Reference the "Link" field of your app, which can contain multiple links
const links = @Link;

// Get the first link
const firstLinkUrl = links[0];

// Result is the URL of the first link
firstLinkUrl
```

New editor:

```ts
// Reference the "Link" field of your app, which can contain multiple links
const links = Link;

// Get the first link
const firstLinkUrl = links[0];

// Result is the URL of the first link
firstLinkUrl
```

Markdown will automatically make a link clickable if it has the correct URL format.

## Open a link in a new tab

A markdown link does not have the option to open the link in a new tab. We can use HTML for this:

Classic editor:

```ts
// Reference the "Link" field of your app, which can contain multiple links
const links = @Link;

// Get the first link
const firstLinkUrl = links[0];

// Result is the URL of the first link, opens in new tab
`<a href="${firstLinkUrl}" target="_blank">Click!</a>`
```

New editor:

```ts
// Reference the "Link" field of your app, which can contain multiple links
const links = Link;

// Get the first link
const firstLinkUrl = links[0];

// Result is the URL of the first link, opens in new tab
`<a href="${firstLinkUrl}" target="_blank">Click!</a>`
```
