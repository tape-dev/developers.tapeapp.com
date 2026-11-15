# User

> Use these endpoints to read the current user, list and search the users of your organization, and invite new users.

Use these endpoints to read the current user, list and search the users of your organization, and invite new users.

Use a `user_id` to set a [user field](https://developers.tapeapp.com/docs/api/resource/field-value/user) or to [add a workspace member](https://developers.tapeapp.com/docs/api/resource/workspace#add-a-workspace-member).

> Which capability do I need?
> 
> Retrieving the current user needs no capability. Listing and searching organization users needs `organization:read`. Adding users and resending invitations needs `organization.members:manage`. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).

> Coming from the Podio API?
> 
> The Tape API has no contacts endpoints, because a user is a person in your organization. Keep external contacts as records in a database app.

## Retrieve the current user

Use this endpoint to check which user a credential belongs to and what it may do.

`GET https://api.tapeapp.com/v1/user`

*Request*

```shell
curl https://api.tapeapp.com/v1/user \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "user_id": 10000,
  "org_id": 1337,
  "org_name": "Acme Inc.",
  "name": "Juliet Adams",
  "status": "active",
  "role": "owner",
  "email": "juliet@acme.com",
  "phone": "555 123 456",
  "job_description": "Founder & CEO",
  "authentication": {
    "method": "personal_access_token",
    "scopes": ["apps:read", "records:read"],
    "content_access": {
      "scope": "selected",
      "workspace_ids": [42],
      "app_ids": []
    }
  }
}
```

The response contains the user, the name of their organization and the `authentication` block of the credential. The endpoint returns only the credential's own user. Use it to find your own `user_id`.

`phone` and `job_description` appear only when the user has set them.

The `authentication` block describes the credential of the request:

| `method` | `scopes` | `content_access` |
| --- | --- | --- |
| `personal_access_token` | The token's capabilities | `scope` is `all`, or `selected` with the selected `workspace_ids` and `app_ids` |
| `oauth_access_token` | The scopes of the access token | `{"scope": "all", "workspace_ids": [], "app_ids": []}` |
| `user_key` | `null`. A user API key has no restrictions | `null` |

**Requirements:** none. Works with a personal access token, an OAuth access token or a user API key.

## Retrieve organization users

Use this endpoint to list all users of your organization.

`GET https://api.tapeapp.com/v1/org/user`

*Request*

```shell
curl https://api.tapeapp.com/v1/org/user \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "users": [
    {
      "user_id": 10000,
      "name": "Juliet Adams",
      "org_id": 1337,
      "status": "active",
      "email": "juliet@acme.com",
      "phone": "555 123 456",
      "role": "owner",
      "job_description": "Founder & CEO"
    },
    {
      "user_id": 10001,
      "name": "Zoe Maxwell",
      "org_id": 1337,
      "status": "active",
      "email": "zoe@acme.com",
      "phone": "555 123 457",
      "role": "member",
      "job_description": "Executive"
    }
  ],
  "total": 2
}
```

Tape takes the organization from your credential. The example lists the users of the organization with ID `1337`.

**General behavior**

-   The list includes deactivated users. Their `status` is `deactivated`.
-   `phone` and `job_description` appear only when the user has set them.

**Requirements:** `organization:read`. Works with a personal access token, an OAuth access token or a user API key. Guests of the organization can't list its users.

## Search organization users

Use this endpoint to find users of your organization by name.

`GET https://api.tapeapp.com/v1/org/user/search?query={query}`

*Request*

```shell
curl "https://api.tapeapp.com/v1/org/user/search?query=zoe" \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "users": [
    {
      "user_id": 10001,
      "name": "Zoe Maxwell",
      "org_id": 1337,
      "status": "active",
      "email": "zoe@acme.com",
      "phone": "555 123 457",
      "role": "member",
      "job_description": "Executive"
    }
  ],
  "total": 1
}
```

**General behavior**

-   Tape returns every user whose name or short name contains `query`. Upper and lower case don't matter.
-   Deactivated users aren't returned.
-   `total` is the number of users in this response, not the number of all matches.

**Requirements:** `organization:read`. Works with a personal access token, an OAuth access token or a user API key. Guests of the organization can't search its users.

**Errors**

A missing or empty `query`, or a `limit` out of range, returns `400`.

**Query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `query` | `string` | Text to search for in names and short names. |
| `limit` | `integer` | Number of users to return. Optional. |

## Add user to organization

Use this endpoint to add a new user to your organization.

`POST https://api.tapeapp.com/v1/org/user`

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/org/user \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "Roger Klein",
    "email": "roger@acme.com",
    "role": "admin",
    "skip_invitation": true
  }'
```

*Response*

```json
{
  "user_id": 10002,
  "name": "Roger Klein",
  "org_id": 1337,
  "status": "active",
  "email": "roger@acme.com",
  "role": "admin"
}
```

Tape sends the new user an invitation email. To skip it, set `skip_invitation` to `true` and send the invitation later with [Resend user invitation email](#resend-user-invitation-email).

> Which organization roles can I give?
> 
> Set `role` to `"owner"`, `"admin"`, `"member"` or `"guest"`. These are the organization roles [described in the Help Center](https://help.tapeapp.com/en/articles/6453902-manage-members-admins-guests-groups). You can't give a role higher than your own, and adding admins and members is billable.

**Requirements:** `organization.members:manage`, and the **Owner** or **Admin** role in the organization. Works with a personal access token, an OAuth access token or a user API key.

**Body parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Required. Name of the user. |
| `email` | `string` | Required. Email address of the user. |
| `role` | `string` | Required. One of `owner`, `admin`, `member` or `guest`. |
| `skip_invitation` | `boolean` | Don't send the invitation email (default: `false`). |

## Resend user invitation email

Use this endpoint to send the invitation email to an organization user again.

`POST https://api.tapeapp.com/v1/org/user/{user_id}/resend-invitation`

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/org/user/10002/resend-invitation \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{}
```

Use it to invite a user you created with `skip_invitation`. You can send it more than once.

**Requirements:** `organization.members:manage`, and the **Owner** or **Admin** role in the organization. Works with a personal access token, an OAuth access token or a user API key.

## Resend pending invitations

Use this endpoint to send all pending invitation emails of your organization again.

`POST https://api.tapeapp.com/v1/org/invitation/resend-pending`

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/org/invitation/resend-pending \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{}
```

**Requirements:** `organization.members:manage`, and the **Owner** or **Admin** role in the organization. Works with a personal access token, an OAuth access token or a user API key.

> Need to change or delete users?
> 
> The API has no endpoints to change or delete existing users. [Create a feature request in the Tape Community](https://community.tapeapp.com/c/requests/8).

## Next steps

[

Organization

read the details of your organization.

](https://developers.tapeapp.com/docs/api/resource/organization)[

Workspace

add users to workspaces.

](https://developers.tapeapp.com/docs/api/resource/workspace)[

Capabilities

what `organization:read` and `organization.members:manage` allow.

](https://developers.tapeapp.com/docs/api/capabilities)[

Personal access tokens

create a credential with only the capabilities you need.

](https://developers.tapeapp.com/docs/api/personal-access-tokens)
