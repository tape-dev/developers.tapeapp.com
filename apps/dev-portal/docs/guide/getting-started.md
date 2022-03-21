---
id: getting-started
title: Getting Started
---

import UserLoginInfo from '@site/src/components/user-login/user-login.component';
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<UserLoginInfo></UserLoginInfo>

If you're new to the Tape API, you've come to the right place. In this guide you'll learn how to use the Tape API by interacting with a record.

## Authentication

The easiest way to authenticate with the Developer API is to use your personal user API key. User API keys have the prefix `user_key_`. If you are not already a Tape user, the first step is to sign up and create an account [here](https://tapeapp.com/signup).

> Note that your API key carries the same privileges as your user account, so be sure to keep it secret! However, if your API key gets leaked, you can always deactivate it and generate a new one inside your user settings.

## The Basics

The world runs on JSON over HTTP (or HTTPS hopefully). The Tape API is no exception, so if you know how to send and receive JSON data via HTTPS, you are all set.
The API is RESTful for the most part, meaning that you can use the HTTP verbs `GET`, `POST`, `PUT`, and `DELETE` to interact with resources like records, apps and workspaces.
The base URL to send all API requests is `https://api.tapeapp.com`.

## Retrieve your first Record

Records are the place where work gets done inside every Tape organization. The endpoint for retrieving a record is `/v1/records/{record_id}`. Let's go ahead and retrieve a record:

<Tabs>

<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Get your record "#RECORD_TITLE"'>
{`curl #BASE_URL/v1/record/#RECORD_ID  \\
  -u #USER_API_KEY:
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="js" label="Node.js">
<ContextCodeBlock language="javascript" title='Get your record "#RECORD_TITLE"'>
{`let req = https.get(
  "#BASE_URL/v1/record/#RECORD_ID",
  {
    method: "get",
    headers: {
      Authorization: "Bearer #USER_API_KEY",
    },
  },
  (res) => {
    res.on("data", (data) => {
      console.log(JSON.stringify(JSON.parse(data.toString()), null, 2));
    });
  }
);`}
</ContextCodeBlock>
</TabItem>

<TabItem value="php" label="PHP">
<ContextCodeBlock language="php" title='Get your record "#RECORD_TITLE"'>
{`<?php
$opts = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"Authorization: Bearer #USER_API_KEY"
  )
);
\n
$context = stream_context_create($opts);
$data = file_get_contents('#BASE_URL/v1/record/20', false, $context);
$responseContent = json_decode($data, true);
echo json_encode($responseContent, JSON_PRETTY_PRINT);
?>`}
</ContextCodeBlock>
</TabItem>

<TabItem value="python" label="Python">
<ContextCodeBlock language="python" title='Get your record "#RECORD_TITLE"'>
{`
import requests
import json
\n
req = requests.get('#BASE_URL/v1/record/#RECORD_ID', auth=('#USER_API_KEY', ''))
print(json.dumps(req.json(), indent=2))
`}
</ContextCodeBlock>
</TabItem>

</Tabs>

That's it, you just got your first response from the Tape API :tada: <br /> Explore all you can do with records [here](/docs/api/resource/record).
