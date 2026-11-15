# Webhook

> Use these endpoints to create, verify, list and delete webhooks for an app.

Use these endpoints to create, verify, list and delete webhooks for an app.

A webhook sends a POST request to your URL whenever something changes in a database app. The JSON payload carries IDs only, for example `record_id` and `revision_id`. Tape doesn't sign webhook requests, so read the record with your token to get its values.

Your URL must answer every request with a `2xx` status code within 5 seconds. See [Error handling](#error-handling).

> Which capability do I need?
> 
> All webhook endpoints need `webhooks:manage`. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).

> New to webhooks?
> 
> Follow [Working with webhooks](https://developers.tapeapp.com/docs/guide/api/working-with-webhooks) for a complete handler in Node.js.
> 
> Used webhooks with the Podio API? Verification works the same. Tape sends JSON instead of form parameters, and event types start with `record.` instead of `item.`. See [Coming from the Podio API](https://developers.tapeapp.com/docs/guide/api/coming-from-podio#move-your-webhooks).

## Create a webhook

Use this endpoint to register a URL that receives events of one type from an app.

`POST https://api.tapeapp.com/v1/hook/app/{app_id}`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/hook/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "record.create",
    "url": "https://webhook.example.org/example-webhook-endpoint"
  }'
```

**JSON**

*Request*

```json
{
  "type": "record.create",
  "url": "https://webhook.example.org/example-webhook-endpoint"
}
```

*Response*

```json
{
  "hook_id": 1,
  "app_id": 1,
  "status": "inactive",
  "num_failed_executions": 0,
  "type": "record.create",
  "url": "https://webhook.example.org/example-webhook-endpoint"
}
```

Send the URL and the event `type` you want to receive. To find the `app_id`, see [Find the app ID and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

**General behavior**

-   A new webhook starts with the status `inactive`.
-   Right after you create it, Tape sends the `hook.verify` request to your URL.
-   Tape sends `hook.verify` only to an `http` or `https` URL on port 80 or 443. Tape saves any other URL too, but the webhook stays `inactive`.
-   Send the code to [Validate hook verification](#validate-hook-verification), and the webhook becomes `active` and receives events.
-   Missed the code? [Request hook verification](#request-hook-verification) again.

**Requirements:** `webhooks:manage`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

A request without the **Admin** role in the app's workspace returns `400` with `workspace_invalid_permission`.

**Body parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `type` | `string` | Required. The event type, see [Webhook types](#webhook-types). |
| `url` | `string` | Required. The URL that receives the events. |

## Request hook verification

Use this endpoint to send a verification code to the URL of a webhook.

`POST https://api.tapeapp.com/v1/hook/{hook_id}/verify/request`

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/hook/1/verify/request \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "hook_id": 1,
  "status": "inactive",
  "num_failed_executions": 0,
  "type": "record.create",
  "url": "https://webhook.example.org/example-webhook-endpoint"
}
```

Tape then sends a POST request to the webhook URL with `type` set to `hook.verify` and the verification code in `code`:

*Incoming request*

```json
{
  "hook_id": 1,
  "type": "hook.verify",
  "code": "f43d05e6"
}
```

To complete the verification, send this code to [Validate hook verification](#validate-hook-verification).

**General behavior**

-   Tape sends events only to verified URLs. This keeps others from sending Tape traffic to a URL they don't control.
-   Your handler can send the code back itself, so verification needs no manual step. See [Working with webhooks](https://developers.tapeapp.com/docs/guide/api/working-with-webhooks#step-1-write-the-handler).
-   To reactivate an `inactive` webhook, request the verification again.
-   Tape sends the request in the background, so the response still shows `inactive`. An `active` webhook gets no new request.

**Requirements:** `webhooks:manage`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

## Validate hook verification

Use this endpoint to activate a webhook with the code it received.

`POST https://api.tapeapp.com/v1/hook/{hook_id}/verify/validate`

**cURL**

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/hook/1/verify/validate \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "code": "f43d05e6"
  }'
```

**JSON**

*Request*

```json
{
  "code": "f43d05e6"
}
```

*Response*

```json
{
  "hook_id": 1,
  "status": "active",
  "num_failed_executions": 0,
  "type": "record.create",
  "url": "https://webhook.example.org/example-webhook-endpoint"
}
```

With the right code, the webhook becomes `active` and its count of failed executions starts at `0` again.

**Requirements:** `webhooks:manage`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

A wrong code, or a webhook that is already active, returns `400` with `validation`.

## Retrieve app webhooks

Use this endpoint to list all webhooks of an app.

`GET https://api.tapeapp.com/v1/hook/app/{app_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/hook/app/1 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "webhooks": [
    {
      "hook_id": 1,
      "app_id": 1,
      "status": "active",
      "num_failed_executions": 0,
      "type": "record.create",
      "url": "https://webhook.example.org/example-webhook-endpoint"
    }
  ],
  "total": 1
}
```

**Requirements:** `webhooks:manage`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

A request without the **Admin** role in the app's workspace returns `400` with `workspace_invalid_permission`.

## Delete a webhook

Use this endpoint to delete a webhook by its ID.

`DELETE https://api.tapeapp.com/v1/hook/{hook_id}`

*Request*

```shell
curl -X DELETE https://api.tapeapp.com/v1/hook/1 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "hook_id": 1,
  "status": "inactive",
  "num_failed_executions": 0,
  "type": "record.create",
  "url": "https://webhook.example.org/example-webhook-endpoint"
}
```

**Requirements:** `webhooks:manage`, and the **Admin** role in the app's workspace. Works with a personal access token, an OAuth access token or a user API key.

## Webhook types

Every webhook has one `type`. It decides which events Tape sends to the webhook. To receive several types, create one webhook per type with the same URL.

### Record created

The `record.create` type notifies you when someone creates a record in the database app of the webhook. Example of an incoming POST request:

**JSON**

*Incoming request*

```json
{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 0,
  "type": "record.create"
}
```

**HTTP**

*Incoming request*

```http
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  68
Host            webhook.example.org
Connection      close

{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 0,
  "type": "record.create"
}
```

### Record updated

The `record.update` type notifies you when someone updates a record in the database app of the webhook. To see which values changed, send `revision_id` to [Retrieve revision delta](https://developers.tapeapp.com/docs/api/resource/record-revision#retrieve-revision-delta). Example of an incoming POST request:

**JSON**

*Incoming request*

```json
{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 1,
  "type": "record.update"
}
```

**HTTP**

*Incoming request*

```http
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  68
Host            webhook.example.org
Connection      close

{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 1,
  "type": "record.update"
}
```

### Record deleted

The `record.delete` type notifies you when someone deletes a record in the database app of the webhook. Example of an incoming POST request:

**JSON**

*Incoming request*

```json
{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 2,
  "type": "record.delete"
}
```

**HTTP**

*Incoming request*

```http
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  68
Host            webhook.example.org
Connection      close

{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 2,
  "type": "record.delete"
}
```

### Record restored

The `record.restore` type notifies you when someone restores a record in the database app of the webhook. Example of an incoming POST request:

**JSON**

*Incoming request*

```json
{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 3,
  "type": "record.restore"
}
```

**HTTP**

*Incoming request*

```http
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  69
Host            webhook.example.org
Connection      close

{
  "hook_id": 1,
  "record_id": 100,
  "revision_id": 3,
  "type": "record.restore"
}
```

### Comment added

The `comment.create` type notifies you when someone comments on a record in the database app of the webhook. Example of an incoming POST request:

**JSON**

*Incoming request*

```json
{
  "hook_id": 1,
  "record_id": 100,
  "comment_id": 500,
  "type": "comment.create"
}
```

**HTTP**

*Incoming request*

```http
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  70
Host            webhook.example.org
Connection      close

{
  "hook_id": 1,
  "record_id": 100,
  "comment_id": 500,
  "type": "comment.create"
}
```

### Comment deleted

The `comment.delete` type notifies you when someone deletes a comment on a record in the database app of the webhook. Example of an incoming POST request:

**JSON**

*Incoming request*

```json
{
  "hook_id": 1,
  "record_id": 100,
  "comment_id": 500,
  "type": "comment.delete"
}
```

**HTTP**

*Incoming request*

```http
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  70
Host            webhook.example.org
Connection      close

{
  "hook_id": 1,
  "record_id": 100,
  "comment_id": 500,
  "type": "comment.delete"
}
```

### App updated

The `app.update` type notifies you when someone updates the app of the webhook, for example its fields or settings. Example of an incoming POST request:

**JSON**

*Incoming request*

```json
{
  "hook_id": 1,
  "app_id": 1,
  "type": "app.update"
}
```

**HTTP**

*Incoming request*

```http
POST https://webhook.example.org/example-webhook-endpoint

Accept          application/json, text/plain, */*
Content-type    application/json;charset=utf-8
User-agent      Tape Webhook
Content-length  44
Host            webhook.example.org
Connection      close

{
  "hook_id": 1,
  "app_id": 1,
  "type": "app.update"
}
```

## Avoid endless loops

A handler that changes a record in the same app starts a new event, which calls the handler again. Add the query parameter `hook=false` to every request your handler sends to change records, for example `PUT /v1/record/{record_id}?hook=false`. It works on [create, update, delete, restore](https://developers.tapeapp.com/docs/api/resource/record) and the batch endpoints.

Add `silent=true` to skip notifications, and `workflow=false` to skip automations.

## Error handling

Respond to every webhook request with a `2xx` status code within 5 seconds. Handle heavy processing after you respond.

-   Send an empty body or a short one, such as `OK`. A long body, such as an HTML page, counts as a failed request.
-   After 100 failed requests in a row, the webhook becomes `inactive`. Request the verification again to activate it.
-   Tape retries a request briefly after a timeout, a network error, a `429` or a `5xx` response. Other status codes fail at once.
-   Tape doesn't follow redirects. Use the final URL, including `https`.
-   The same event can arrive more than once. Use `record_id` and `revision_id` to skip events you already handled.
-   Tape sends webhooks only to ports 80 and 443. `https://www.example.org:8080/webhook` doesn't work. Use `https://www.example.org/webhook`.

## Rate limits

Tape sends webhook requests at a limited rate. When many events happen at the same time, requests can arrive with a short delay.

> Can these limits change?
> 
> Yes. Tape can adjust rate limits to balance demand and reliability, also with different limits per pricing plan.

## Next steps

-   [Working with webhooks](https://developers.tapeapp.com/docs/guide/api/working-with-webhooks): build, verify and test a handler end to end.
-   [Record](https://developers.tapeapp.com/docs/api/resource/record): read the record that an event points to.
-   [Record comment](https://developers.tapeapp.com/docs/api/resource/record-comment): read the comment of a `comment.create` event.
-   [App](https://developers.tapeapp.com/docs/api/resource/app): read the app after an `app.update` event.
-   [Request limits](https://developers.tapeapp.com/docs/api/request-limits): the limits of the API itself.
-   [Capabilities](https://developers.tapeapp.com/docs/api/capabilities): what `webhooks:manage` allows.
-   In the Help Center: [App webhooks](https://help.tapeapp.com/en/articles/18449250-app-webhooks)
