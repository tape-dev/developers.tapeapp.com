---
id: getting-started
title: Quickstart
description: Retrieve a record from your Tape organization with a personal access token and a single API request.
---

import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QuickstartTokenPng from '@site/static/docs/guide/api/getting-started/quickstart-token.png';
import MediaFrame from '@site/src/components/media-frame/media-frame.component';

Retrieve your first record with a personal access token and a single API request.

<a id="the-basics"></a>

## Before you begin

You need a Tape account and one record you can view. No account yet? [Sign up for Tape](https://tapeapp.com/signup).

The API sends and receives JSON over HTTPS. Send every request to `https://api.tapeapp.com`.

Tape keeps data as *records* in *database apps*. Each record has *fields*, such as a name or a status. Apps live in *workspaces*, and workspaces in your *organization*.

:::tip New to APIs?
Follow the [Tape API guide, first steps](https://community.tapeapp.com/t/tape-api-guide-first-steps/2522) in the Tape Community. It walks you through three requests in Postman, without writing code.
:::

<a id="authentication"></a>

## Step 1: Create a personal access token

1. Select your profile picture, then select **Preferences**.
2. In the settings window, select **Developer** (under **Features**).
3. Under **Personal access tokens (PATs)**, select **New token**.
4. Name the token, for example "Quickstart".
5. Under **Content access**, clear **All**, then select the workspace that holds your record.
6. Under **Capabilities**, clear **All**, then select **Read records**. A capability is one thing the token may do.
7. Select **Create token** and copy the token.

<MediaFrame><img src={QuickstartTokenPng} alt="New personal access token dialog named Quickstart with one workspace and the capability Read records" /></MediaFrame>

:::caution Copy the token now
Tape shows the token only once. Store it like a password.
:::

Save the token as an environment variable:

```shell
export TAPE_TOKEN="tape_pat_..."
```

:::info Lost your token?
Revoke it under **Developer** and create a new one.
:::

<a id="retrieve-your-first-record"></a>

## Step 2: Retrieve a record

Make a `GET` request to `/v1/record/{record_id}`. Send the token as a bearer token in the `Authorization` header.

Use the ID of a record you can view: open the record in Tape, select **•••**, then select **Developer** and copy the **Record ID**. In the examples, replace `123456` with your record ID.

<Tabs>
<TabItem value="curl" label="cURL">
<ContextCodeBlock language="shell" title='Retrieve a record'>
{`curl #BASE_URL/v1/record/#RECORD_ID \\
  -H "Authorization: Bearer $TAPE_TOKEN"
`}
</ContextCodeBlock>
</TabItem>

<TabItem value="js" label="JavaScript">
<ContextCodeBlock language="javascript" title='Retrieve a record'>
{`const response = await fetch("#BASE_URL/v1/record/#RECORD_ID", {
  headers: { Authorization: \`Bearer \${process.env.TAPE_TOKEN}\` },
});
\n
console.log(JSON.stringify(await response.json(), null, 2));`}
</ContextCodeBlock>
</TabItem>

<TabItem value="python" label="Python">
<ContextCodeBlock language="python" title='Retrieve a record'>
{`import json
import os
import requests
\n
response = requests.get(
    "#BASE_URL/v1/record/#RECORD_ID",
    headers={"Authorization": f"Bearer {os.environ['TAPE_TOKEN']}"},
)
print(json.dumps(response.json(), indent=2))`}
</ContextCodeBlock>
</TabItem>

<TabItem value="php" label="PHP">
<ContextCodeBlock language="php" title='Retrieve a record'>
{`<?php
$context = stream_context_create([
  'http' => [
    'method' => 'GET',
    'header' => 'Authorization: Bearer ' . getenv('TAPE_TOKEN'),
  ],
]);
\n
$data = file_get_contents('#BASE_URL/v1/record/#RECORD_ID', false, $context);
echo json_encode(json_decode($data, true), JSON_PRETTY_PRINT);`}
</ContextCodeBlock>
</TabItem>
</Tabs>

The API returns the record as JSON. Your response has the ID, title and fields of your record. This example shows a contact record:

```json title="Response"
{
  "record_id": 1,
  "app_id": 1,
  "title": "Clara Weber",
  "created_on": "2022-03-01 12:00:00",
  "fields": [
    {
      "field_id": 1,
      "external_id": "full_name",
      "label": "Full Name",
      "type": "text",
      "field_type": "single_text",
      "values": [
        {
          "value": "Clara Weber"
        }
      ]
    }
  ]
}
```

**Key fields**

- `record_id`: the ID of the record.
- `app_id`: the ID of the record's database app. You need it to create records there.
- `title`: the record title, as shown in Tape.
- `fields`: the fields of the record, one entry per field.
- `field_id` and `external_id`: the field's ID and its slug, a readable ID such as `full_name`. Use either to write values.
- `values`: the field values. Their shape depends on the field type.

:::info Getting a 400 or 401 error?
Check that `TAPE_TOKEN` holds the whole token, prefix included. See [Authentication errors](/docs/api/authentication#authentication-errors).
:::

:::info Getting a 403 error?
Your token is missing the capability **Read records**. Create a new token that has it.
:::

:::info Getting a 404 error?
Check the record ID, then check that your token's content access includes the record's workspace.
:::

## Build on your first request

Pick your next task. Each page has a complete request and response.

| Task | Page | Capabilities the token needs |
| --- | --- | --- |
| Create a record | [Create a record](/docs/api/resource/record#create-a-record) | **Edit records**, plus **Read records** to read it back |
| Receive a webhook | [Working with webhooks](/docs/guide/api/working-with-webhooks) | **Manage webhooks** and **Read records** |
| Run an automation | [Run an automation](/docs/api/resource/automation/execution#run-an-automation) | **Run automations**, plus **Read automations** to find its ID |
| Connect an AI client | [Connect to Tape MCP](/docs/mcp/connect) | None. You sign in with your Tape account |

You can't add capabilities to an existing token. Create a new token for the task. Webhooks and automation runs also need the **Admin** role in the app's workspace.

## Next steps

- [Record](/docs/api/resource/record): create, update, delete and filter records. [Pagination](/docs/api/pagination) pages through long lists.
- [Coming from the Podio API](/docs/guide/api/coming-from-podio): map items, spaces and hooks to Tape.
- [Field value](/docs/api/resource/field-value/overview): the value format of every field type.
- [Personal access tokens](/docs/api/personal-access-tokens): limit a token to the apps it needs.
- [Capabilities](/docs/api/capabilities): pick the capabilities for your integration.
- [Authentication](/docs/api/authentication): compare personal access tokens, user API keys and OAuth.
- [Errors](/docs/api/errors): handle `401`, `403` and `429` responses.
- [Automations](/docs/automations/introduction): run your own JavaScript inside Tape.
