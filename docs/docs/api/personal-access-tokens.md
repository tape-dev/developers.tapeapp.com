# Personal access tokens

> Named API credentials that you limit to specific capabilities, workspaces, and apps, and revoke one by one.

A personal access token (PAT) is a named credential for one integration that can only do what you allow it to.

Unlike the [user API key](https://developers.tapeapp.com/docs/api/authentication#user-api-key), which can do everything your account can do, a token carries two grants:

-   **Capabilities:** what the token may do, for example read records. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).
-   **Content access:** which workspaces and apps the token may reach.

Tokens start with the prefix `tape_pat_`.

Use a personal access token when you call the API directly, for yourself or to act in Tape on a user's behalf. [OAuth](https://developers.tapeapp.com/docs/api/oauth/overview) is mainly for MCP clients and for integrations registered by Tape. See [Which credential to use](https://developers.tapeapp.com/docs/api/authentication#which-credential-to-use).

> Can a token reach more than you can?
> 
> A token's access is your own permissions, narrowed by its capabilities and again by its content access. Granting a capability never reaches beyond what you can reach yourself. When you lose access to a workspace, every token you own loses it too.

## Create a token

1.  Select your profile picture, then select **Preferences**.
2.  In the settings window, select **Developer** (under **Features**).
3.  Under **Personal access tokens (PATs)**, select **New token**.

![Developer page in the settings window with the New token button](https://developers.tapeapp.com/assets/images/developer-new-token-988178e3a3fafc65b0b0cc06f1a768e8.png)

4.  Enter a **Token name**, for example "Monthly sales report".
5.  Under **Content access**, keep **All** or select only the workspaces and apps the integration needs.
6.  Under **Capabilities**, keep **All** or select only what the integration needs, for example **Read records**.
7.  Select **Create token** and copy the token.

![New personal access token dialog with one workspace and the capability Read records](https://developers.tapeapp.com/assets/images/new-token-dialog-ef7422cf400c95911d7ed57c025bdf45.png)

> Tape shows the token only once
> 
> Copy the token right away and store it in a safe place, such as your integration's secret store. Tape keeps only a hash, so it can't show the value again. If you lose it, revoke the token and create a new one.

The token list then shows only the first and last few characters of each token.

> Need different capabilities or content access?
> 
> You can rename a token later. To change its capabilities or content access, create a new token and revoke the old one.

## Use a token

Send the token as a bearer token, the same way as a user API key:

```shell
curl https://api.tapeapp.com/v1/record/1 \
  -H "Authorization: Bearer tape_pat_0a1b2c3d..."
```

A personal access token works for the Developer API (`/v1/*`) only. It can't create or manage personal access tokens; you do that in Tape while signed in.

## Content access

When you create a token, you choose its reach:

| Content access | What the token can reach |
| --- | --- |
| **All** | Every workspace and app you can reach, including ones created later. |
| **Only some** | Clear **All** and select the workspaces and apps the token may reach. |

A selected *workspace* includes every app in it, also apps added later. A selected app does *not* include its workspace. See [Limits](#limits) for how many you can select.

### General behavior

-   A request for a resource outside the token's content access returns `404`, as if the resource didn't exist.
-   List endpoints return `200` with fewer results. This applies to [`GET /v1/app`](https://developers.tapeapp.com/docs/api/resource/app), [`GET /v1/workspace/org`](https://developers.tapeapp.com/docs/api/resource/workspace), `GET /v1/automation/org`, the automation run history, and [search](https://developers.tapeapp.com/docs/api/resource/search).
-   Some endpoints name the resource in the request body: `workspace_id` when you create an app, `record_id`s when you batch-update record permissions, and `trigger_workflow_def_id` when you generate an automation weblink. Tape checks these against the token's content access too.
-   Creating a workspace requires a token with **All**. A new top-level workspace has no parent that content access could name.

> Content access limits a credential, not your data
> 
> Content access doesn't isolate data, hide data from you, or change anyone's permissions.
> 
> Related records of a record in a selected app come back as read-only previews (ID, title, creation date, app, and workspace), even from apps the token didn't select. The previews stay within your own permissions.

## Revoke a token

Revoke a token in the same **Developer** section. Revocation applies from the next request on.

Revoking one token doesn't affect your other tokens, your user API key, or your account. Revoked tokens stay in the list, so you keep a record of what existed.

> Webhooks outlive the token that created them
> 
> A webhook created through the API keeps delivering after you revoke the token that created it. Delete those webhooks separately.

## Limits

| Limit | Value |
| --- | --- |
| Active tokens per user | 20 |
| Selected workspaces per token | 50 |
| Selected apps per token | 50 |
| Token name length | 500 characters |

## Rate limits

A personal access token has no rate limit budget of its own. Your user API key, all your tokens and your [OAuth](https://developers.tapeapp.com/docs/api/oauth/overview) connections share one per-user budget, so more tokens don't mean more throughput. See [Request limits](https://developers.tapeapp.com/docs/api/request-limits).

## Attribution

A token acts as you. Records it creates or changes show you as the author, and it sends emails on your behalf. To show an integration under its own name, create a dedicated user for it and create the token from that account.

## Keep tokens safe

-   **Never commit a token** to source control or put it in a client-side app. A token in a browser bundle is public.
-   **Use one token per integration**, so you can revoke one without breaking another.
-   **Grant the fewest capabilities that work.** A reporting integration needs only read capabilities.
-   **Select only the workspaces and apps the integration needs.**
-   Secret-scanning tools recognize the `tape_pat_` prefix, so they can spot a leaked token.
-   If a token may have leaked, revoke it first and investigate afterwards.

## Next steps

-   [Quickstart](https://developers.tapeapp.com/docs/guide/api/getting-started): retrieve your first record with a token.
-   [Capabilities](https://developers.tapeapp.com/docs/api/capabilities): the capability each endpoint needs.
-   [Request limits](https://developers.tapeapp.com/docs/api/request-limits): the per-user budget all your tokens share.
-   [Authentication](https://developers.tapeapp.com/docs/api/authentication): compare tokens with OAuth and the user API key.
-   In the Help Center: [Personal access tokens](https://help.tapeapp.com/en/articles/18449281-personal-access-tokens)
