# Working with webhooks

> Receive record changes from Tape in your own backend. Build a webhook handler in Node.js, verify it, avoid endless loops, and test it locally.

Build a webhook handler that receives record changes from Tape, verify it, and test it on your own machine.

A webhook sends a POST request to your URL whenever something changes in a database app. The [Webhook](https://developers.tapeapp.com/docs/api/resource/webhook) reference lists every endpoint and event type.

## Before you begin

You need:

-   A [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens) with the capabilities **Manage webhooks** (`webhooks:manage`) and **Read records** (`records:read`). Add **Edit records** (`records:edit`) if your handler changes records.
-   The ID of the app you want to watch. Open one of its records in Tape, select **•••**, then select **Developer**, and copy the **App ID**. A record you read with the API also returns it as `app_id`.
-   The **Admin** role in the app's workspace.
-   Node.js 18 or later, and the Express package (`npm install express`).

Store the token in an environment variable:

```shell
export TAPE_TOKEN=tape_pat_0a1b2c3d...
```

## How a webhook becomes active

1.  You create a webhook with a URL and an event `type`. It starts as `inactive`.
2.  Tape sends `hook.verify` with a `code` to your URL right away.
3.  Your handler sends the code back to Tape. The webhook becomes `active`.
4.  From then on, Tape sends one POST request per event to your URL.

Every event carries IDs only, for example `record_id` and `revision_id`. Read the record with your token to get its values.

## Step 1: Write the handler

Create `server.js`:

*server.js*

```javascript
const express = require('express');

const TAPE_API = 'https://api.tapeapp.com';
const headers = {
  Authorization: `Bearer ${process.env.TAPE_TOKEN}`,
  'Content-Type': 'application/json',
};

const app = express();
app.use(express.json());

app.post('/tape-webhook', async (req, res) => {
  // Answer first. Tape waits 5 seconds at most.
  res.sendStatus(200);

  const { type, hook_id, code, record_id } = req.body;

  if (type === 'hook.verify') {
    await fetch(`${TAPE_API}/v1/hook/${hook_id}/verify/validate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ code }),
    });
    console.log(`Webhook ${hook_id} verified`);
    return;
  }

  if (type === 'record.update') {
    const record = await fetch(`${TAPE_API}/v1/record/${record_id}`, { headers }).then((r) => r.json());
    console.log(`Record ${record_id} updated: ${record.title}`);
  }
});

app.listen(3000, () => console.log('Listening on port 3000'));
```

Start it:

```shell
node server.js
```

**Key points**

-   `res.sendStatus(200)` comes first. Slow work after the response doesn't count against the time limit.
-   The handler validates the code itself, so verification needs no manual step.
-   Tape doesn't sign webhook requests, so the handler reads the record with your token. Don't trust the payload for anything but IDs.

## Step 2: Make the handler reachable

Tape sends webhooks only to ports 80 and 443. A server on `localhost:3000` isn't reachable from the internet.

To test on your machine, start a tunnel such as ngrok or Cloudflare Tunnel. It forwards a public HTTPS URL on port 443 to your local port:

```shell
ngrok http 3000
```

Copy the HTTPS URL it prints, for example `https://acme-test.ngrok.app`. Your webhook URL is that address plus `/tape-webhook`.

In production, run the handler behind HTTPS on port 443. Tape sends the same payload over HTTP, but HTTPS keeps it private.

## Step 3: Create the webhook

Keep the handler and the tunnel running. Make a POST request with the URL and the event type. Replace `1` in the path with your app ID:

```shell
curl -X POST https://api.tapeapp.com/v1/hook/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "record.update",
    "url": "https://acme-test.ngrok.app/tape-webhook"
  }'
```

*Response*

```json
{
  "hook_id": 7,
  "app_id": 1,
  "status": "inactive",
  "num_failed_executions": 0,
  "type": "record.update",
  "url": "https://acme-test.ngrok.app/tape-webhook"
}
```

One webhook receives one event type. To receive created and updated records, create two webhooks with the same URL.

## Step 4: Verify the webhook

Your handler received `hook.verify` right after Step 3 and logs `Webhook 7 verified`. Check the status, again with your app ID in place of `1`:

```shell
curl https://api.tapeapp.com/v1/hook/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

The webhook now shows `"status": "active"`.

> Still inactive?
> 
> Check that the tunnel runs, that the URL ends with `/tape-webhook`, and that your handler answers within 5 seconds. Then request the verification again with the `hook_id` from the response:
> 
> ```shell
> curl -X POST https://api.tapeapp.com/v1/hook/7/verify/request \
>   -H "Authorization: Bearer $TAPE_TOKEN"
> ```

## Step 5: Send a test event

Change any field of a record in that database app, in Tape or with [Update a record](https://developers.tapeapp.com/docs/api/resource/record#update-a-record). Tape sends this body to your handler:

*Incoming request*

```json
{
  "hook_id": 7,
  "record_id": 100,
  "revision_id": 1,
  "type": "record.update"
}
```

Your handler logs the update:

```text
Record 100 updated: Andrea Lim
```

## Avoid endless loops

A handler that updates a record in the same app starts a new `record.update` event. That event calls the handler again, and the loop never ends.

Add `hook=false` to every request your handler sends to change records. In this example, `status` is the slug of a field in the app:

```javascript
await fetch(`${TAPE_API}/v1/record/${record_id}?hook=false&silent=true`, {
  method: 'PUT',
  headers,
  body: JSON.stringify({ fields: { status: 'Reviewed' } }),
});
```

-   `hook=false` runs no webhooks for this change. It works on create, update, delete, restore and the batch endpoints.
-   `silent=true` sends no notifications for this change.
-   `workflow=false` also skips automations, if one of them reacts to the same field.

## Handle failures

Respond to every webhook request with a `2xx` status code within 5 seconds:

-   After more than 50 failed requests in a row, the webhook becomes inactive. Request the verification again to activate it.
-   Tape retries a request briefly after a timeout, a network error, a `429` or a `5xx` response. Other status codes fail at once.
-   Tape doesn't follow redirects. Use the final URL, including `https`.
-   Send an empty body or a short one, such as `OK`. A long body, such as an HTML page, counts as a failed request.
-   The same event can arrive more than once. Use `record_id` and `revision_id` to skip events you already handled.

Tape sends at most 100 webhook requests per minute per app.

## Next steps

[

Webhook

every endpoint and event type.

](https://developers.tapeapp.com/docs/api/resource/webhook)[

Record

read and update the record of an event.

](https://developers.tapeapp.com/docs/api/resource/record)[

Coming from the Podio API

move existing Podio hooks to Tape.

](https://developers.tapeapp.com/docs/guide/api/coming-from-podio)[

Request limits

plan the requests your handler sends.

](https://developers.tapeapp.com/docs/api/request-limits)[

Automations

react to changes inside Tape without your own server.

](https://developers.tapeapp.com/docs/automations/introduction)
