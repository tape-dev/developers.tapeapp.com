# Workspace

> Use these endpoints to list, create, update and delete workspaces, and to manage their members.

Use these endpoints to list, create, update and delete workspaces, and to manage their members.

A *workspace* groups apps and their members within your organization. The Podio API calls it a space, and `workspace_id` replaces `space_id`.

To find a workspace ID, see [Retrieve workspaces](#retrieve-workspaces). The **Developer** info of any of its apps also shows it. See [Find the app ID and field IDs](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids).

> Which capability do I need?
> 
> Endpoints that read workspaces need `workspaces:read`. Creating, updating and deleting need `workspaces:edit`. Adding and removing members needs `workspaces.members:manage`. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).

## Retrieve workspaces

Use this endpoint to list all workspaces you can access in your organization.

`GET https://api.tapeapp.com/v1/workspace/org`

*Request*

```shell
curl https://api.tapeapp.com/v1/workspace/org \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "total": 2,
  "workspaces": [
    {
      "workspace_id": 1,
      "name": "Task management",
      "slug": "task-management",
      "type": "closed",
      "description": "Manage all tasks and projects inside this workspace.",
      "org_id": 1337
    },
    {
      "workspace_id": 2,
      "name": "Contact directory",
      "slug": "contact-directory",
      "type": "default",
      "description": "Keep track of our contacts here.",
      "org_id": 1337
    }
  ]
}
```

Tape takes the organization from your credential. The example lists the workspaces of the organization with ID `1337`.

**Requirements:** `workspaces:read`. Works with a personal access token, an OAuth access token or a user API key.

## Retrieve a workspace

Use this endpoint to read one workspace by its ID.

`GET https://api.tapeapp.com/v1/workspace/{workspace_id}`

*Request*

```shell
curl https://api.tapeapp.com/v1/workspace/1 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "workspace_id": 1,
  "name": "Task management",
  "slug": "task-management",
  "type": "closed",
  "description": "Manage all tasks and projects inside this workspace.",
  "org_id": 1337
}
```

**Requirements:** `workspaces:read`, and membership in the workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   A workspace you aren't a member of, for example one in another organization, returns `400` with `workspace_invalid_permission`.
-   A workspace ID that doesn't exist returns `404`.

## Create a workspace

Use this endpoint to create a new workspace.

`POST https://api.tapeapp.com/v1/workspace`

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/workspace \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "Task management",
    "type": "closed",
    "description": "Manage all tasks and projects inside this workspace."
  }'
```

*Response*

```json
{
  "workspace_id": 1,
  "name": "Task management",
  "slug": "task-management",
  "type": "closed",
  "description": "Manage all tasks and projects inside this workspace.",
  "org_id": 1337
}
```

The response contains the new workspace:

> Which workspace types are there?
> 
> Set `type` to `"closed"`, `"open"`, `"default"` or `"private"`. These are the workspace types [described in the Help Center](https://help.tapeapp.com/en/articles/8000930-intro-to-workspaces).

**General behavior**

-   An organization can hold at most 500 workspaces. When it reaches this limit, Tape rejects further create requests until you delete a workspace.
-   You can't change the type of a workspace later through the API. Choose the right `type` when you create it.
-   A personal access token with limited content access can't create workspaces. Use a token whose content access is **All**.

**Requirements:** `workspaces:edit`, and an organization role that may create workspaces. Works with a personal access token, an OAuth access token or a user API key.

**Body parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Required. Name of the workspace. |
| `type` | `string` | Required. One of `closed`, `open`, `default` or `private`. |
| `description` | `string` | Description of the workspace. Optional. |
| `slug` | `string` | Slug of the workspace. Optional. |
| `icon` | `object` | Icon of the workspace. Optional, see [Icon](https://developers.tapeapp.com/docs/api/resource/icon). |

## Update a workspace

Use this endpoint to change the name, description, slug or icon of a workspace.

`PUT https://api.tapeapp.com/v1/workspace/{workspace_id}`

*Request*

```shell
curl -X PUT https://api.tapeapp.com/v1/workspace/1 \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "Task management (NEW)",
    "description": "Manage all tasks and projects inside this NEW workspace."
  }'
```

*Response*

```json
{
  "workspace_id": 1,
  "name": "Task management (NEW)",
  "slug": "task-management",
  "type": "closed",
  "description": "Manage all tasks and projects inside this NEW workspace.",
  "org_id": 1337
}
```

The response contains the updated workspace:

**General behavior**

-   A new name doesn't change the slug. Send `slug` to change it.
-   Tape ignores `type` in an update. A workspace keeps the type it was created with.

**Requirements:** `workspaces:edit`, and the **Admin** role in the workspace. Works with a personal access token, an OAuth access token or a user API key.

**Body parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | New name of the workspace. Optional. |
| `description` | `string` | New description. Optional. |
| `slug` | `string` | New slug. Optional. |
| `icon` | `object` | New icon. Optional, see [Icon](https://developers.tapeapp.com/docs/api/resource/icon). |

## Delete a workspace

Use this endpoint to delete a workspace with all its apps and records.

`DELETE https://api.tapeapp.com/v1/workspace/{workspace_id}`

*Request*

```shell
curl -X DELETE https://api.tapeapp.com/v1/workspace/1 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "workspace_id": 1,
  "name": "Task management (NEW)",
  "slug": "task-management",
  "type": "closed",
  "description": "Manage all tasks and projects inside this NEW workspace.",
  "org_id": 1337
}
```

The response contains the deleted workspace:

**Requirements:** `workspaces:edit`, and the **Admin** role in the workspace. Works with a personal access token, an OAuth access token or a user API key.

## Retrieve workspace members

Use this endpoint to list the members of a workspace and their roles.

`GET https://api.tapeapp.com/v1/workspace/{workspace_id}/member`

*Request*

```shell
curl https://api.tapeapp.com/v1/workspace/1/member \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "workspace_members": [
    {
      "workspace_id": 1,
      "user_id": 10000,
      "role": "admin"
    },
    {
      "workspace_id": 1,
      "user_id": 10001,
      "role": "member"
    }
  ]
}
```

`role` is `admin` or `member`. Older memberships can also return `guest`.

**Requirements:** `workspaces:read`, and membership in the workspace. Works with a personal access token, an OAuth access token or a user API key.

## Add a workspace member

Use this endpoint to add a user of your organization to a workspace, or to change their role.

`POST https://api.tapeapp.com/v1/workspace/{workspace_id}/member`

*Request*

```shell
curl -X POST https://api.tapeapp.com/v1/workspace/1/member \
  -H "Authorization: Bearer $TAPE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "user_id": 10002,
    "role": "admin"
  }'
```

*Response*

```json
{
  "workspace_id": 1,
  "user_id": 10002,
  "role": "admin"
}
```

If the user is already a member, Tape updates their role. To find the `user_id`, see [Retrieve organization users](https://developers.tapeapp.com/docs/api/resource/user#retrieve-organization-users).

> Which workspace roles can I give?
> 
> Set `role` to `"admin"` or `"member"`. These are the workspace roles [described in the Help Center](https://help.tapeapp.com/en/articles/8000930-intro-to-workspaces). Tape no longer accepts `"guest"` here.

**Requirements:** `workspaces.members:manage`, and the **Admin** role in the workspace. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

A `user_id` outside your organization returns `404`.

**Body parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `user_id` | `integer` | Required. ID of the user to add. |
| `role` | `string` | Required. `admin` or `member`. |

## Remove a workspace member

Use this endpoint to remove a member from a workspace.

`DELETE https://api.tapeapp.com/v1/workspace/{workspace_id}/member/{user_id}`

*Request*

```shell
curl -X DELETE https://api.tapeapp.com/v1/workspace/1/member/10002 \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{}
```

**General behavior**

-   The user stays in your organization.
-   Removing a user who isn't a member returns `200` and changes nothing.

**Requirements:** `workspaces.members:manage`, and the **Admin** role in the workspace. Works with a personal access token, an OAuth access token or a user API key.

## Next steps

[

App

create and manage the apps inside a workspace.

](https://developers.tapeapp.com/docs/api/resource/app)[

User

find the `user_id` of an organization user.

](https://developers.tapeapp.com/docs/api/resource/user)[

Icon

the icon format for workspaces and apps.

](https://developers.tapeapp.com/docs/api/resource/icon)[

Personal access tokens

limit a token to selected workspaces.

](https://developers.tapeapp.com/docs/api/personal-access-tokens#content-selection)[

Capabilities

what `workspaces:read`, `workspaces:edit` and `workspaces.members:manage` allow.

](https://developers.tapeapp.com/docs/api/capabilities)
