# Record follow

> Use this endpoint to stop notifications about the records of a database app for everyone who follows them.

Use this endpoint to stop notifications about the records of a database app for everyone who follows them.

Users who follow a record get notified about its updates.

In the Podio API, a follow is a subscription.

## Unfollow all records in a database app

Use this endpoint to remove every follower from every record of a database app.

`PUT https://api.tapeapp.com/v1/record/app/unfollow-all/{app_id}`

**cURL**

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/record/app/unfollow-all/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{}'
```

**JSON**

*Request*

```json
{}
```

*Response*

```json
{
  "total_unfollowed_count": 6
}
```

The example unfollows all records of the database app with ID `1`. To find your app ID, see [Find the app ID and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

**General behavior**

-   The request unfollows all users of your organization, not only you.
-   The request blocks until Tape has removed all follows. On large databases, this takes a while.
-   If nobody follows a record of the database, `total_unfollowed_count` is `0`.

**Requirements:** `records:edit`, and **Full access** to the app. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

**Errors**

-   A request without **Full access** to the app returns `400` with `app_no_permission`.
-   A request without a credential returns `401`.
-   A token without `records:edit` returns `403`.
-   A token whose content access doesn't include the app returns `404`.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

**Response fields**

| Property | Type | Description |
| --- | --- | --- |
| `total_unfollowed_count` | `integer` | Number of follows that were removed. |

## Next steps

[

Record

create, update and delete records.

](https://developers.tapeapp.com/docs/api/resource/record)[

Record comment

read and post comments on a record.

](https://developers.tapeapp.com/docs/api/resource/record-comment)[

Webhook

get notified about record changes in your own backend instead.

](https://developers.tapeapp.com/docs/api/resource/webhook)[

Capabilities

what `records:edit` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
