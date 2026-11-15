# Quickstart

> Retrieve a record from your Tape organization with a personal access token and a single API request.

Retrieve your first record with a personal access token and a single API request.

## Before you begin

You need a Tape account and one record you can view. No account yet? [Sign up for Tape](https://tapeapp.com/signup).

The API sends and receives JSON over HTTPS. Send every request to `https://api.tapeapp.com`.

Tape keeps data as *records* in *database apps*. Each record has *fields*, such as a name or a status. Apps live in *workspaces*, and workspaces in your *organization*.

> New to APIs?
> 
> Follow the [Tape API guide, first steps](https://community.tapeapp.com/t/tape-api-guide-first-steps/2522) in the Tape Community. It walks you through three requests in Postman, without writing code.

## Step 1: Create a personal access token

1.  Select your profile picture, then select **Preferences**.
2.  In the settings window, select **Developer** (under **Features**).
3.  Under **Personal access tokens (PATs)**, select **New token**.
4.  Name the token, for example "Quickstart".
5.  Under **Content access**, clear **All**, then select the workspace that holds your record.
6.  Under **Capabilities**, clear **All**, then select **Read records**. A capability is one thing the token may do.
7.  Select **Create token** and copy the token.

![New personal access token dialog named Quickstart with one workspace and the capability Read records](https://developers.tapeapp.com/assets/images/quickstart-token-4e0a5c336632297d7109d2f54b742360.png)

> Copy the token now
> 
> Tape shows the token only once. Store it like a password.

Save the token as an environment variable:

```shell
export TAPE_TOKEN="tape_pat_..."
```

> Lost your token?
> 
> Revoke it under **Developer** and create a new one.

## Step 2: Retrieve a record

Make a `GET` request to `/v1/record/{record_id}`. Send the token as a bearer token in the `Authorization` header.

Use the ID of a record you can view: open the record in Tape, select **•••**, then select **Developer** and copy the **Record ID**. In the examples, replace `123456` with your record ID.

**cURL**

*Retrieve a record*

```shell
curl https://api.tapeapp.com/v1/record/123456 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

**JavaScript**

*Retrieve a record*

```javascript
const response = await fetch("https://api.tapeapp.com/v1/record/123456", {
  headers: { Authorization: `Bearer ${process.env.TAPE_TOKEN}` },
});

console.log(JSON.stringify(await response.json(), null, 2));
```

**Python**

*Retrieve a record*

```python
import json
import os
import requests

response = requests.get(
    "https://api.tapeapp.com/v1/record/123456",
    headers={"Authorization": f"Bearer {os.environ['TAPE_TOKEN']}"},
)
print(json.dumps(response.json(), indent=2))
```

**PHP**

*Retrieve a record*

```php
<?php
$context = stream_context_create([
  'http' => [
    'method' => 'GET',
    'header' => 'Authorization: Bearer ' . getenv('TAPE_TOKEN'),
  ],
]);

$data = file_get_contents('https://api.tapeapp.com/v1/record/123456', false, $context);
echo json_encode(json_decode($data, true), JSON_PRETTY_PRINT);
```

The API returns the record as JSON. Your response has the ID, title and fields of your record. This example shows a contact record:

*Response*

```json
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

-   `record_id`: the ID of the record.
-   `app_id`: the ID of the record's database app. You need it to create records there.
-   `title`: the record title, as shown in Tape.
-   `fields`: the fields of the record, one entry per field.
-   `field_id` and `external_id`: the field's ID and its slug, a readable ID such as `full_name`. Use either to write values.
-   `values`: the field values. Their shape depends on the field type.

**Getting an error?**

**400 or 401 error**

Check that `TAPE_TOKEN` holds the whole token, prefix included. See [Authentication errors](https://developers.tapeapp.com/docs/api/authentication#authentication-errors).

**403 error**

Your token is missing the capability **Read records**. Create a new token that has it.

**404 error**

Check the record ID, then check that your token's content access includes the record's workspace.

## Build on your first request

Pick your next task. Each page has a complete request and response.

| Task | Page | Capabilities the token needs |
| --- | --- | --- |
| Create a record | [Create a record](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) | **Edit records**, plus **Read records** to read it back |
| Receive a webhook | [Working with webhooks](https://developers.tapeapp.com/docs/guide/api/working-with-webhooks) | **Manage webhooks** and **Read records** |
| Run an automation | [Run an automation](https://developers.tapeapp.com/docs/api/resource/automation/execution#run-an-automation) | **Run automations**, plus **Read automations** to find its ID |
| Connect an AI client | [Connect to Tape MCP](https://developers.tapeapp.com/docs/mcp/connect) | None. You sign in with your Tape account |

You can't add capabilities to an existing token. Create a new token for the task. Webhooks and automation runs also need the **Admin** role in the app's workspace.

## Next steps

[

Record

create, update, delete and filter records. Pagination pages through long lists.

](https://developers.tapeapp.com/docs/api/resource/record)[

Coming from the Podio API

map items, spaces and hooks to Tape.

](https://developers.tapeapp.com/docs/guide/api/coming-from-podio)[

Field value

the value format of every field type.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)[

Personal access tokens

limit a token to the apps it needs.

](https://developers.tapeapp.com/docs/api/personal-access-tokens)[

Capabilities

pick the capabilities for your integration.

](https://developers.tapeapp.com/docs/api/capabilities)[

Authentication

compare personal access tokens, user API keys and OAuth.

](https://developers.tapeapp.com/docs/api/authentication)[

Errors

handle `401`, `403` and `429` responses.

](https://developers.tapeapp.com/docs/api/errors)[

Automations

run your own JavaScript inside Tape.

](https://developers.tapeapp.com/docs/automations/introduction)
