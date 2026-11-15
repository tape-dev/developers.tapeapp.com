# Errors

> Use the HTTP status and the error_code of a response to find out why a request failed.

Use the HTTP status and the `error_code` of a response to find out why a request failed.

This is the response for a record that doesn't exist:

```json
{
  "status_code": 404,
  "endpoint": "/v1/record/123",
  "error_code": "record_not_exists",
  "error_message": "Record does not exist(123)!"
}
```

The HTTP status gives the class of the error. The response body adds detail in `error_code` and `error_message`.

## Error codes

| Status | error\_code | Description |
| --- | --- | --- |
| 400 | `validation` | The request is not valid: the body is not valid JSON, doesn't match the expected parameters, or the credential is invalid, malformed or can't be used for this endpoint. Check the `error_message` property for details. |
| 400 | `input_validation` | The body doesn't match the endpoint's schema. `error_message` starts with `Invalid input:` and names each property that fails, for example `data/name must NOT have fewer than 1 characters`. |
| 400 | `bad_request` | The request is malformed, for example an empty `records` array in a batch request. |
| 400 | `record_no_permission` / `app_no_permission` | The user has no permission for this record or app. |
| 400 | `record_deleted` | The record is in the trash. |
| 400 | `workspace_invalid_permission` | The user has no permission for this workspace, for example no **Admin** role in it. |
| 400 | `deletions_rejected` | The request was sent with `reject_deletions=true` and would delete a field or an option. Tape applies nothing from the request. See [Update an app](https://developers.tapeapp.com/docs/api/resource/app#update-an-app). |
| 401 | `dev_api_authentication` | The request carries no personal access token, OAuth access token or user API key. |
| 401 | `unauthorized` | The credential type isn't accepted for this endpoint (for example an automation API key on an endpoint that needs a credential acting for a user), or the user may not perform this operation. `error_message` says why. |
| 401 | `dev_api_invalid_access_token` | The OAuth access token is expired, revoked or otherwise no longer valid. Refresh it, or connect again. See [OAuth errors](https://developers.tapeapp.com/docs/api/oauth/authorization-flow#at-the-developer-api). |
| 403 | `forbidden` | The request is not allowed. If the response carries `WWW-Authenticate: Bearer error="insufficient_scope"`, the personal access token or OAuth access token lacks a [capability](https://developers.tapeapp.com/docs/api/capabilities) this endpoint requires. See [Insufficient capabilities](https://developers.tapeapp.com/docs/api/capabilities#insufficient-capabilities). Otherwise the operation was refused for another reason, such as the user's permissions; `error_message` says why. |
| 404 | `not_found` | The resource doesn't exist, isn't shared with the owner of the credential, or lies outside a personal access token's [content access](https://developers.tapeapp.com/docs/api/personal-access-tokens#content-selection). An unknown path, or a method a path doesn't support, also returns `not_found` (for example `Cannot GET /v1/recrods`). |
| 404 | `record_not_exists` | The requested record doesn't exist. |
| 404 | `app_not_exists` | The requested app doesn't exist. |
| 409 | `conflict` | The resource is in a state that doesn't allow this operation, for example activating or running a broken automation. |
| 429 | `user_too_many_requests` | This request exceeds the number of requests allowed. Wait the seconds in the `Retry-After` header, then retry. See [rate limits](https://developers.tapeapp.com/docs/api/request-limits#rate-limits). |
| 500 | `unknown` | An unexpected error occurred. Reach out to [Tape support](mailto:team@tapeapp.com). |

## General behavior

-   Endpoints can return other, more specific `error_code` values. Handle an unknown `error_code` by its HTTP status.
-   A missing permission on a record or app returns `400`, not `403`. Check `error_code` to tell it apart from other `400` errors.
-   A request body that isn't valid JSON returns `400` with `validation`. The message starts with "A valid JSON body is required for operation".

**Getting an error?**

**403 error**

Check the `WWW-Authenticate` header. With `insufficient_scope`, [fix the missing capability](https://developers.tapeapp.com/docs/api/capabilities#fix-a-missing-capability): create a new token, or ask the user of an OAuth app to approve it. Without that header, the user's own permissions in Tape refuse the request.

## Next steps

[

Capabilities

the capability each endpoint requires.

](https://developers.tapeapp.com/docs/api/capabilities)[

Authentication

send a valid credential.

](https://developers.tapeapp.com/docs/api/authentication)[

Request limits

avoid `429` responses.

](https://developers.tapeapp.com/docs/api/request-limits)[

Authorization flow

refresh an expired access token.

](https://developers.tapeapp.com/docs/api/oauth/authorization-flow)
