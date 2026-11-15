# Organization

> Use this endpoint to read the organization your credential belongs to.

Use this endpoint to read the organization your credential belongs to.

## Retrieve organization

Use this endpoint to get the name, plan and other details of your organization.

`GET https://api.tapeapp.com/v1/org`

*Request*

```shell
curl https://api.tapeapp.com/v1/org \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "org_id": 1337,
  "active_user_id": 2000,
  "name": "Acme Inc.",
  "slug": "acme",
  "url": "https://tapeapp.com/acme",
  "description": "Sales and customer success for the Acme product line",
  "website": "https://acme.com",
  "location": "Munich, Germany",
  "created_on": "2019-05-01 10:00:00",
  "created_on_utc": "2019-05-01 08:00:00",
  "plan": "premium",
  "activity_count": 345
}
```

The example reads the organization Acme Inc., which has the ID `1337`.

**Key fields**

-   `active_user_id`: the user your credential acts for.
-   `created_on`: when the organization was created, in your timezone. `created_on_utc` holds the same moment in UTC. See [Date & timezone](https://developers.tapeapp.com/docs/api/date-timezone).
-   `plan`: one of `free`, `basic`, `premium` or `enterprise`.

**General behavior**

-   Tape takes the organization from your credential. The endpoint has no path parameter.
-   Content access doesn't limit this endpoint. A token limited to one workspace still reads the organization of that workspace.

**Requirements:** `organization:read`. Works with a personal access token, an OAuth access token or a user API key.

**Errors**

-   An automation API key returns `400` with `validation`, because the endpoint needs a credential that belongs to a user.
-   A request without a credential returns `401`.
-   A token without `organization:read` returns `403`.

See [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

> Need to change or delete an organization?
> 
> The API has no endpoints to change or delete an organization. [Create a feature request in the Tape Community](https://community.tapeapp.com/c/requests/8).

## Next steps

[

User

list and search the users of your organization.

](https://developers.tapeapp.com/docs/api/resource/user)[

Workspace

list the workspaces of your organization.

](https://developers.tapeapp.com/docs/api/resource/workspace)[

Date & timezone

how Tape formats `created_on` and `created_on_utc`.

](https://developers.tapeapp.com/docs/api/date-timezone)[

Capabilities

what `organization:read` allows.

](https://developers.tapeapp.com/docs/api/capabilities)
