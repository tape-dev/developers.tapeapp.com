---
id: link-preview
title: Link Preview
sidebar_label: Link Preview
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Tape generates link previews for URLs inside link fields or that are shared via comments, replies and chat messages. A link preview always has the `id` and `url` properties, all other properties (`title`, `description`, `previewImage`) are optional, depending on whether Tape was able to access the provided URL.

:::info
There are many reasons why generating a link preview can take a long time or fail (website not reachable, website takes a long time to respond, ...). To prevent critical operations like creating a record to fail due to an unsuccessful link preview generation, Tape accepts only the URL as an input and will generate the full link preview after the operation was successful. Therefore, generating a link preview via the dedicated endpoint is optional and only needed if you want full control over the process.

:::

## Create a link preview

<EndpointBadge method="POST" url="https://api.tapeapp.com/v1/link-preview" />

Create a link preview by providing the `url` property in the request body:

```json title="➡️      Request"
{
  "url": "https://tapeapp.com" // The absolute url of the link to generate the preview for
}
```

The response will be a link preview object containing the information Tape could generate for the provided URL:

```json title="⬅️      Response"
{
  "id": 1, // The unique ID of the link preview object
  "url": "https://tapeapp.com", // The absolute url of the link
  "title": "Tape - Build your own powerful business platform", // The title of the link's website
  "description": "Fully customizable. No-code. Low-code.", // The description of the link's website
  "previewImage": {
    // A representative thumbnail image for the link's website (e.g., the favicon)
    "small": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/def09e9319ca30e9ab2bc13e061982",
    "medium": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/82f3c2669deca95c16d1ad955734e0",
    "large": "https://s3.eu-central-1.amazonaws.com/tape-thumbnails/f8f105f4daaced0f3f714b5ebb76ae"
  }
}
```

The `previewImage` property is a thumbnail object. Read more about thumbnails [here](file#thumbnails).
