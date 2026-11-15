# Coming from the Podio API

> Move your Podio API integration to Tape. Map items, spaces, and hooks to records, workspaces, and webhooks, and switch authentication.

Move an integration from the Podio API to the Tape API with the same concepts and familiar endpoints.

Tape and Podio share their building blocks: organizations, workspaces, apps, fields, views, and webhooks. Most scripts need new names, a new base URL, and a new token.

## Before you begin

You need a Tape organization with your apps in it. Moving a whole Podio organization? Use the free Zooli Migration Tool first, as described in [Migrate to Tape](https://help.tapeapp.com/en/articles/16738165-migrate-to-tape-podio-asana-hubspot-salesforce-and-other-import-options), then point your code at Tape.

The migration gives your apps, fields, and records new IDs. Replace the old IDs and `external_id` values in your scripts. The [Developer view of each app](https://developers.tapeapp.com/docs/api/resource/app#find-app-and-field-ids) lists the new IDs and slugs.

Tape builds each field slug from the field name, with underscores instead of hyphens. A Podio `external_id` like `due-date` usually becomes `due_date`.

Send every request to `https://api.tapeapp.com`. The API sends and receives JSON.

## Map the concepts

| Podio API | Tape API | Note |
| --- | --- | --- |
| item | record |  |
| `item_id` | `record_id` |  |
| `app_item_id` | `app_record_id` | Find a record by it with a [metadata filter](https://developers.tapeapp.com/docs/api/resource/filter#app-record-id-metadata). |
| `external_id` on an item | – | Records have no `external_id`. Store it in a text field and filter by it. |
| `external_id` on a field | `slug` on a field | Records still return it as `external_id`. See [Podio field types](https://developers.tapeapp.com/docs/api/resource/field/overview#podio-field-types). |
| item `fields` | record `fields` | Write values as an object keyed by field ID or slug. The value format depends on the field type. See [Field values](https://developers.tapeapp.com/docs/api/resource/field-value/overview#formats-by-field-type). |
| space, `space_id` | workspace, `workspace_id` | See [Workspace](https://developers.tapeapp.com/docs/api/resource/workspace). |
| organization | organization | A token works in one organization. See [Organization](https://developers.tapeapp.com/docs/api/resource/organization). |
| contact | – | No Tape endpoint. Use [users](https://developers.tapeapp.com/docs/api/resource/user) for people in your organization and records for external contacts. |
| app, app field | app, field | Change fields with [Update an app](https://developers.tapeapp.com/docs/api/resource/app#update-an-app). |
| calculation field | calculation field | JavaScript with plain field names, like `First_name` instead of `@First name`. See the [syntax table](https://help.tapeapp.com/en/articles/18449157-calculation-syntax-examples). |
| view | view | See [View](https://developers.tapeapp.com/docs/api/resource/view). |
| filter | filter | Send `filters` as an array of filter objects, each with a field ID (not a slug) and a `match_type`. Send `sort_by`, `sort_desc`, `limit` and `cursor` in the query string, not in the body. Date ranges and categories: see [Filter](https://developers.tapeapp.com/docs/api/resource/filter). |
| hook | webhook | Same verification flow. See [Move your webhooks](#move-your-webhooks). |
| flow, Podio Workflow Automation (Globiflow) | automation | Build them in the [automation editor](https://developers.tapeapp.com/docs/automations/introduction) or with the [Automation API](https://developers.tapeapp.com/docs/api/resource/automation/overview). See [Move your flows](#move-your-flows). |
| app authentication, OAuth | personal access token, OAuth | See [Switch authentication](#switch-authentication). |
| comment | record comment | See [Record comment](https://developers.tapeapp.com/docs/api/resource/record-comment). |
| file | file | Upload first, then attach the file ID to a record or comment. See [File](https://developers.tapeapp.com/docs/api/resource/file). |
| revision | record revision | See [Record revision](https://developers.tapeapp.com/docs/api/resource/record-revision). |
| grant | record permissions | See [Record permissions](https://developers.tapeapp.com/docs/api/resource/record-permissions). |
| subscription | follow | See [Unfollow all records in a database app](https://developers.tapeapp.com/docs/api/resource/record-follow#unfollow-all-records-in-an-app). |
| task | – | No Tape endpoint. See [Good to know](#good-to-know). |
| rate limit | request limits | Credits per minute. See [Plan for request limits](#plan-for-request-limits). |
| `offset` | `cursor` | No `offset`. Pass the `cursor` of the previous page to get the next one. See [Pagination](https://developers.tapeapp.com/docs/api/pagination). |

## Find the matching endpoint

| Task | Podio API | Tape API |
| --- | --- | --- |
| Create a record | `POST /item/app/{app_id}/` | [`POST /v1/record/app/{app_id}`](https://developers.tapeapp.com/docs/api/resource/record#create-a-record) |
| Retrieve a record | `GET /item/{item_id}` | [`GET /v1/record/{record_id}`](https://developers.tapeapp.com/docs/api/resource/record#retrieve-a-record) |
| Update a record | `PUT /item/{item_id}` | [`PUT /v1/record/{record_id}`](https://developers.tapeapp.com/docs/api/resource/record#update-a-record) |
| Delete a record | `DELETE /item/{item_id}` | [`DELETE /v1/record/{record_id}`](https://developers.tapeapp.com/docs/api/resource/record#delete-a-record) |
| Records of a database app | `GET /item/app/{app_id}/` | [`GET /v1/record/app/{app_id}`](https://developers.tapeapp.com/docs/api/resource/record#retrieve-records-for-an-app) |
| Filter records | `POST /item/app/{app_id}/filter/` | [`POST /v1/record/filter/app/{app_id}`](https://developers.tapeapp.com/docs/api/resource/record#retrieve-filtered-records-for-an-app) |
| Records of a view | `POST /item/app/{app_id}/filter/{view_id}/` | [`GET /v1/record/view/{view_id}`](https://developers.tapeapp.com/docs/api/resource/record#retrieve-records-for-a-view) |
| Create many records | – | [`POST /v1/record/app/batch/{app_id}`](https://developers.tapeapp.com/docs/api/resource/record#batch-create-multiple-records) |
| Related records | `GET /item/{item_id}/reference/` | [`POST /v1/record/app/{app_id}/ref/{ref_app_id}`](https://developers.tapeapp.com/docs/api/resource/record#retrieve-related-records-for-a-set-of-records) |
| Record revisions | `GET /item/{item_id}/revision/` | [`GET /v1/record/{record_id}/revision`](https://developers.tapeapp.com/docs/api/resource/record-revision#retrieve-revisions-for-a-record) |
| Add a comment | `POST /comment/item/{item_id}/` | [`POST /v1/comment/record/{record_id}`](https://developers.tapeapp.com/docs/api/resource/record-comment#create-a-record-comment) |
| Upload a file | `POST /file/` | [`POST /v1/file/upload`](https://developers.tapeapp.com/docs/api/resource/file#upload-a-file) |
| Attach a file | `POST /file/{file_id}/attach` | Send the file ID in an [attachment field value](https://developers.tapeapp.com/docs/api/resource/field-value/attachment#record-creation) |
| Retrieve an app | `GET /app/{app_id}` | [`GET /v1/app/{app_id}`](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app) |
| Apps of a workspace | `GET /app/space/{space_id}/` | [`GET /v1/app/workspace/{workspace_id}`](https://developers.tapeapp.com/docs/api/resource/app#retrieve-apps-for-a-workspace) |
| Create a view | `POST /view/app/{app_id}/` | [`POST /v1/view/app/{app_id}`](https://developers.tapeapp.com/docs/api/resource/view#create-a-view) |
| Create a workspace | `POST /space/` | [`POST /v1/workspace`](https://developers.tapeapp.com/docs/api/resource/workspace#create-a-workspace) |
| Workspace members | `GET /space/{space_id}/member/` | [`GET /v1/workspace/{workspace_id}/member`](https://developers.tapeapp.com/docs/api/resource/workspace#retrieve-workspace-members) |
| Search | `POST /search/` | [`GET /v1/search`](https://developers.tapeapp.com/docs/api/resource/search#search) |
| Create a webhook | `POST /hook/{ref_type}/{ref_id}/` | [`POST /v1/hook/app/{app_id}`](https://developers.tapeapp.com/docs/api/resource/webhook#create-a-webhook) |
| Current user | `GET /user` | [`GET /v1/user`](https://developers.tapeapp.com/docs/api/resource/user#retrieve-the-current-user) |

## Switch authentication

Replace the Podio header `Authorization: OAuth2 <token>` with a bearer token:

```shell
curl https://api.tapeapp.com/v1/user \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

Choose the credential that matches your Podio flow:

| Podio flow | Use in Tape |
| --- | --- |
| Server-side flow, for your own scripts | [Personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens). It can also act on a user's behalf when that user creates it |
| Server-side flow, for a product other Tape users connect | [OAuth](https://developers.tapeapp.com/docs/api/oauth/authorization-flow) with PKCE and a [client registered by Tape](https://developers.tapeapp.com/docs/api/oauth/clients#a-client-registered-by-tape) |
| Client-side flow | [OAuth](https://developers.tapeapp.com/docs/api/oauth/authorization-flow) with PKCE and a public client registered by Tape, no client secret needed |
| Username and password flow | [Personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens) |
| App authentication | [Personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens) with its [content access](https://developers.tapeapp.com/docs/api/personal-access-tokens#content-selection) limited to that app and only the [capabilities](https://developers.tapeapp.com/docs/api/capabilities) your script needs. Tape has no token per app. Records, comments and revisions show the token's user as the author, so create the token from a dedicated user for the integration. See [Attribution](https://developers.tapeapp.com/docs/api/personal-access-tokens#attribution) |

## Move your webhooks

Webhooks verify the same way. Tape sends `type` `hook.verify` with a `code`, and your endpoint calls [Validate hook verification](https://developers.tapeapp.com/docs/api/resource/webhook#validate-hook-verification).

What changes:

-   Tape sends `hook.verify` right after you create a webhook. Call [Request hook verification](https://developers.tapeapp.com/docs/api/resource/webhook#request-hook-verification) only if your endpoint missed it.
-   Tape sends a JSON body, not form parameters.
-   Events start with `record.` instead of `item.`, for example `record.create`. Tape adds `record.restore`.
-   The payload carries `record_id` and `revision_id` instead of `item_id` and `item_revision_id`.
-   Webhooks apply to a whole app. To react to one field, use an automation with a filter.

A minimal handler in Node.js:

```javascript
app.post('/tape-webhook', async (req, res) => {
  const { type, hook_id, code, record_id } = req.body;
  res.sendStatus(200);
  if (type === 'hook.verify') {
    await fetch(`https://api.tapeapp.com/v1/hook/${hook_id}/verify/validate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.TAPE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
  }
  if (type === 'record.create') {
    // For example, create a follow-up task for a new lead.
  }
});
```

> How do you avoid endless loops?
> 
> Update a record from a webhook with `hook=false`, as in the Podio API, plus `workflow=false`, because `hook=false` doesn't stop automations. Add `silent=true` to skip notifications. See [Avoid endless loops](https://developers.tapeapp.com/docs/api/resource/webhook#avoid-endless-loops).

## Move your flows

A Podio flow or a Globiflow flow becomes an automation in one app. Field references use the `field_id`, not the `external_id`. Find the action for each flow step in [Coming from Podio](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions#coming-from-podio).

| In Podio, the flow starts when … | Tape [trigger](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers) |
| --- | --- |
| An item is created, updated or deleted | `record_created`, `record_updated`, `record_deleted` |
| A comment is added | `record_comment_or_reply_created` |
| A date in a field arrives | `date_field_arrived` |
| A schedule is due | `periodic` |
| A hook or webhook comes in | `webhook_received` |
| Another flow calls it | `automation_called` |
| Someone starts it by hand or with a button | Any trigger with [manual-run](https://developers.tapeapp.com/docs/api/resource/automation/overview#run-an-existing-automation), or a weblink with `weblink_clicked` |

## Plan for request limits

Tape counts credits per minute instead of calls per hour. All credentials of a user share one budget, so more tokens don't add throughput.

Each response carries rate limit headers. After a `429`, wait the seconds in `Retry-After` before you retry. See [Request limits](https://developers.tapeapp.com/docs/api/request-limits).

## Good to know

-   Tape has no client libraries for PHP or Ruby. Call the API over HTTPS from any language.
-   Tasks, status updates, and the activity stream have no Tape endpoints. Use a checklist field and record revisions instead.
-   Tape adds endpoints the Podio API doesn't have: [batch create and update](https://developers.tapeapp.com/docs/api/resource/record#batch-create-multiple-records), [restore a record](https://developers.tapeapp.com/docs/api/resource/record#restore-a-record), the [Automation API](https://developers.tapeapp.com/docs/api/resource/automation/overview), and the [Tape MCP server](https://developers.tapeapp.com/docs/mcp/overview).

## Next steps

[

Quickstart

retrieve your first record.

](https://developers.tapeapp.com/docs/guide/api/getting-started)[

Authentication

pick the right credential.

](https://developers.tapeapp.com/docs/api/authentication)[

Record

every record endpoint.

](https://developers.tapeapp.com/docs/api/resource/record)[

Webhook

events and payloads.

](https://developers.tapeapp.com/docs/api/resource/webhook)[

Working with webhooks

build and test a handler end to end.

](https://developers.tapeapp.com/docs/guide/api/working-with-webhooks)[

Automations

rebuild your flows in Tape.

](https://developers.tapeapp.com/docs/automations/introduction)[

Automation API

manage automations by API.

](https://developers.tapeapp.com/docs/api/resource/automation/overview)
- [Migrate to Tape](https://developers.tapeapp.comhttps://help.tapeapp.com/en/articles/16738165-migrate-to-tape-podio-asana-hubspot-salesforce-and-other-import-options): move your data first.
