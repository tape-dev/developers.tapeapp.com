# Connect to Tape MCP

> Add Tape to Claude, Claude Code, ChatGPT, Cursor, VS Code, Codex, Gemini Enterprise or any other MCP client, and sign in with your Tape account.

Add Tape to your MCP client and sign in with your Tape account.

Every client connects to the same endpoint:

```text
https://mcp.tapeapp.com/mcp
```

Add this URL to your client as a remote MCP server. Sign in to Tape when the client asks. You don't create or paste a token: the client opens Tape in your browser, you [approve the connection](#how-signing-in-works), and the client does the rest.

Pick your client below, follow its steps, then [check the result](#verify-the-connection). Prefer to give the client a [personal access token](https://developers.tapeapp.com/docs/mcp/connect-with-token)? Use a token for read-only access, for a server without a browser, or to limit the client to some of your workspaces.

## Claude

Use this in claude.ai, Claude Desktop and the Claude mobile apps. They share your connectors. Client documentation: [Custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

1.  In Claude, open **Customize** → **Connectors**, select **\+ Add**, then **Add custom connector**.
2.  Name it `Tape` and enter `https://mcp.tapeapp.com/mcp` as the URL. If the dialog shows **Advanced settings**, leave them empty. If it asks you to review authentication settings instead, keep the recommended sign-in options and leave **Request headers** empty.
3.  Select **Add**, then **Connect**, and approve the connection in Tape.

On Claude's Team and Enterprise plans, members can't add a custom connector themselves. An owner adds Tape for the whole organization under **Organization settings** → **Connectors**, with the same name and URL. Members then select **Connect** under **Customize** → **Connectors** and sign in with their own Tape account.

To change a connector's settings later, remove it and add it again.

> Using Claude Desktop with a third-party model provider?
> 
> On these deployments, members can't add connectors themselves. The deployment's admin adds Tape as a managed MCP server with OAuth turned on ([extensions and MCP servers](https://claude.com/docs/third-party/claude-desktop/extensions)); each member then connects it and approves the connection in Tape. If Claude refuses the sign-in on the way back, the admin adds `tapeapp.com` to that server's `oauth.additionalRedirectReferrerHosts`.

## Claude Code

Client documentation: [Claude Code MCP](https://code.claude.com/docs/en/mcp).

1.  Add the server:
    
    ```shell
    claude mcp add --transport http tape https://mcp.tapeapp.com/mcp
    ```
    
2.  In Claude Code, run `/mcp`, select **tape** and choose **Authenticate**.
    
3.  Approve the connection in the browser window that opens.
    

Options for `claude mcp add`:

-   `--scope user` makes the server available in every project.
-   `--scope project` writes it into the repository's `.mcp.json` so your team shares it. Each teammate signs in with their own Tape account.
-   `--callback-port` is needed only if something on your machine requires a fixed port. Claude Code receives the sign-in on a random local port, and Tape accepts any port.

## ChatGPT

Client documentation: [Add a custom MCP server](https://developers.openai.com/api/docs/guides/custom-mcp-server).

1.  In ChatGPT on the web, go to **Plugins**, select the plus button, then **Add custom MCP server**.
2.  Name it `Tape`. Under **Connection**, enter `https://mcp.tapeapp.com/mcp` as the **Server URL** and choose **OAuth** authentication.
3.  Review the warning, select **I understand and want to continue**, then **Create as a plugin**.
4.  Install the plugin, then sign in and approve the connection in Tape.

Your ChatGPT workspace permissions and security settings decide whether you can add and use custom MCP servers.

## Cursor

Client documentation: [Cursor MCP](https://cursor.com/docs/mcp).

1.  Create `.cursor/mcp.json` in your project with the content below. To use Tape in every project, create `~/.cursor/mcp.json` instead.
    
    *.cursor/mcp.json*
    
    ```json
    {
      "mcpServers": {
        "tape": {
          "url": "https://mcp.tapeapp.com/mcp"
        }
      }
    }
    ```
    
2.  Save the file and restart Cursor.
    
3.  Open **Customize** in the sidebar → **MCPs**, find Tape, follow the sign-in prompt, and approve the connection in Tape.
    

## VS Code (GitHub Copilot)

Client documentation: [VS Code MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers).

1.  Create `.vscode/mcp.json` in your workspace with:
    
    *.vscode/mcp.json*
    
    ```json
    {
      "servers": {
        "tape": {
          "type": "http",
          "url": "https://mcp.tapeapp.com/mcp"
        }
      }
    }
    ```
    
    VS Code uses `servers` where most clients use `mcpServers`, and it needs `"type": "http"`.
    
2.  Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`), run **MCP: List Servers**, and start **tape**.
    
3.  Allow VS Code to sign in when it asks, and approve the connection in Tape.
    

To use Tape in every workspace, run **MCP: Open User Configuration** and add the same entry there.

## Codex

Client documentation: [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp).

1.  Add the server to `~/.codex/config.toml`, or to `.codex/config.toml` in a trusted project:
    
    *~/.codex/config.toml*
    
    ```toml
    [mcp_servers.tape]
    url = "https://mcp.tapeapp.com/mcp"
    ```
    
2.  Sign in:
    
    ```shell
    codex mcp login tape
    ```
    
3.  Approve the connection in the browser window that opens.
    

## Gemini Enterprise

Client documentation: [Set up a custom MCP server](https://docs.cloud.google.com/gemini/enterprise/docs/connectors/custom-mcp-server/set-up-custom-mcp-server).

Gemini Enterprise doesn't discover Tape's sign-in by itself. A Google admin sets up the connection once, with a client ID and secret that Tape issues for your organization.

1.  Email [team@tapeapp.com](mailto:team@tapeapp.com) to request a Gemini Enterprise client for your Tape organization. Say whether you use Gemini Enterprise in the Google Cloud console or Gemini Business.
    
2.  In Gemini Enterprise, add a *custom MCP server* with **OAuth 2.0** authentication:
    
    | Field | Value |
    | --- | --- |
    | MCP Server URL | `https://mcp.tapeapp.com/mcp` |
    | Authorization URL | `https://api.tapeapp.com/oauth/authorize` |
    | Token URL | `https://api.tapeapp.com/oauth/token` |
    | Client ID | The client ID Tape sent you |
    | Client Secret | The client secret Tape sent you |
    | Scopes | See below |
    
    In the Google Cloud console, also select **Enable PKCE Support**.
    
3.  In the Google Cloud console, wait until the data store is active. Then connect it to your Gemini Enterprise app.
    
4.  The admin, then each user, authorizes the connector once in the Gemini Enterprise web app and approves the connection in Tape.
    
5.  Only then, in the Google Cloud console, open the data store and select **Actions** → **Reload custom actions**. Select the Tape tools and select **Enable actions**. No action is enabled by default.
    

Gemini can't ask for more scopes later, so *the scopes you enter are all it ever gets*. Fill them in even where the form marks the field optional; left empty, the connector can only read apps and records. For the full set of Tape MCP tools, enter them on one line, separated by single spaces:

```text
organization:read workspaces:read workspaces:edit apps:read apps:edit records:read records:edit records.comments:read records.comments:edit automations:read automations:edit automations:run
```

Leave out `automations:run` if Gemini shouldn't start automations. It's the one capability whose effects can leave Tape. For a read-only connector:

```text
organization:read workspaces:read apps:read records:read records.comments:read automations:read
```

Keep these points in mind:

-   **Google Cloud console prerequisites.** The admin needs Google's Discovery Engine Editor role. The organization policy must allow custom MCP data stores, and the egress hosts `mcp.tapeapp.com` and `api.tapeapp.com` must be allowed. Users need Google Identity (Google Workspace or Cloud Identity) or workforce identity federation. See Google's guide.
-   **Gemini Business** can't edit a connector's OAuth settings afterwards. To change them, delete the connector and create it again.
-   **No yearly reconnect.** Connections through the client Tape issued last as long as Gemini uses them at least once every 90 days.

## Other MCP clients

Any client that supports *remote MCP servers with OAuth* can connect. Add a Streamable HTTP server with Tape's URL, and complete the sign-in when the client asks:

```json
{
  "mcpServers": {
    "tape": {
      "url": "https://mcp.tapeapp.com/mcp"
    }
  }
}
```

Tape has no SSE endpoint. Wherever a client offers a transport, choose Streamable HTTP or plain "HTTP".

In Tape, select your profile picture, then select **Preferences** → **Tape MCP**. Select **Add an MCP client** to see the URL there too.

![Tape MCP page in the settings window with the Add an MCP client button and the clients ChatGPT, Claude, Cursor, Gemini Enterprise and Visual Studio Code](https://developers.tapeapp.com/assets/images/tape-mcp-add-client-5555696c5f000af9d5e05f253419e568.png)

**Clients that only run local servers** reach Tape through the [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) bridge. This includes Claude Desktop's `claude_desktop_config.json`. The bridge runs on your computer, opens the sign-in in your browser, and needs Node.js.

```json
{
  "mcpServers": {
    "tape": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.tapeapp.com/mcp"]
    }
  }
}
```

If the client can't sign in to remote servers either way, connect it with a token.

To test the endpoint by hand, point the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) at `https://mcp.tapeapp.com/mcp` and use its OAuth flow.

Building your own client? See [Build an MCP client](https://developers.tapeapp.com/docs/mcp/build-a-client).

## Check the result

1.  **Ask the assistant which Tape tools it has.** A populated tool list shows that the client reaches the server.
2.  **Ask it which Tape account it's connected as**, for example "Which Tape user and organization are you connected as?" The answer names your user and your organization.

The second step uses `tape-fetch` with `type: "self"`, which needs no capability and also lists which tools the connection can use. If the tool list appears and this step fails, the problem is the sign-in, not the connection. `tape-get-users` is a different tool: it finds *other* people by name.

From the shell, the health endpoint answers without any client:

```shell
curl https://mcp.tapeapp.com/health
```

*Response*

```json
{ "status": "ok" }
```

## How signing in works

1.  **Your client contacts the Tape MCP server** and learns that it needs to sign in. It finds Tape's sign-in by itself. You only give it the server URL.
    
2.  **Your browser opens Tape.** Sign in if you aren't signed in yet. If you belong to more than one *organization*, choose the one to connect; the connection reaches only that one. For another organization, connect again, in most clients by adding Tape a second time under another name.
    
3.  **Review the connection.** The screen reads **Connect with Tape MCP**. It says that the client respects your Tape permissions, acts on your behalf, and can:
    
    -   View your organization and its members
    -   Run your automations, which can send emails and call other services
    
    This short list stands for every capability the Tape MCP tools use. A client that asks for a different set sees one line for each capability instead, for example a Gemini Enterprise connector set up with the read-only scopes.
    
    Tape marks a client **Unverified** when it can't tie the client to a website, typically a self-registered client on your own computer. The screen doesn't show where your browser returns to. Continue only if you started the connection yourself from the client.
    
4.  **Select Continue.** Your browser returns to the client, and the Tape tools are ready to use.
    

The connection acts *as you*: it reaches only what you can reach in Tape, and everything it changes shows you as the author. One sign-in covers every capability the [Tape MCP tools](https://developers.tapeapp.com/docs/mcp/supported-tools) use. None of them manages members, shares records, manages webhooks or sends email; for a narrower connection, use a token.

**Who can connect.** Every member of a Tape organization can connect a client. Guests can't. Owners and admins of an organization can also [limit which clients members may connect](#for-organization-admins). If your organization does, the sign-in screen tells you why it can't continue.

**How long it lasts.** Your client renews its access in the background. A connection ends after 90 days unused, and one year after you approved it; the client then asks you to sign in again. [Gemini Enterprise](#gemini-enterprise) connections have no one-year limit.

Each client and each device gets its own connection, so connecting a second laptop doesn't disconnect the first. You can hold up to 10 connections to the same client; an eleventh ends the oldest.

## Manage your connections

**In Tape**, select your profile picture, then select **Preferences** → **Tape MCP** → **Connected**. The list shows each MCP client you connected, when you first connected it, and when it was last used. Tape lists clients by app: **Claude** covers claude.ai, Claude Desktop and Claude Code.

To disconnect a client on every device, select it and select **Remove**. It stops working on its next request.

![Connected tab of the Tape MCP page with the details of Claude, the dates First connected and Last used, and the Remove button](https://developers.tapeapp.com/assets/images/connected-client-remove-838adb20cf7e1cad3f302a068270d291.png)

**In the client**, removing the server or connector deletes the client's copy of your sign-in. Most clients don't tell Tape, so the connection stays listed in Tape until it expires after 90 days unused. Remove it in Tape as well to end it right away.

### For organization admins

Owners and admins manage clients for the whole organization under **Tape MCP** → **Manage**. There you choose which clients members can connect. Select **All MCP clients** to see every client; the per-client controls are in the **⋯** menu of a client's row.

**Which clients members can connect:** **All MCP clients** or **Approved MCP clients only**.

![Manage tab of the Tape MCP page with the setting Which clients members can connect open, showing All MCP clients and Approved MCP clients only](https://developers.tapeapp.com/assets/images/manage-which-clients-af8b316feb458c75d26833f119ffd510.png)

-   Switching to **Approved MCP clients only** disconnects no one. Tape approves every MCP client that someone in your organization is connected to at that moment. Review the **Approved MCP clients** list afterwards, and remove or restrict what you don't want.
-   Removing a client from that list disconnects everyone from it.
-   From then on, members can connect approved clients only.
-   Owners and admins can connect any client. When only approved clients are allowed, connecting a client approves it for the organization.
-   Limiting clients requires the Premium or Enterprise plan.

**In the ⋯ menu of a client's row:**

-   **Access** → **Owners and admins**: take a client away from members. The table then shows it as **Restricted**. Members' connections to it end immediately, and setting **Access** back to **Everyone** doesn't restore them.
-   **View members**: see who connected a client, and disconnect one of them.
-   **Disconnect all members**: disconnect everyone from one client, owners and admins included.

To disconnect everyone from Tape MCP at once, select **Disconnect all users**.

These controls apply to signed-in clients. A member can still connect a client with a personal access token.

## Troubleshooting

**The browser says Tape doesn't know the client registration.** Tape removes a self-registered client if no one connects it within 25 hours. Remove Tape from the client and add it again.

-   For `mcp-remote`, also delete its stored registrations with `rm -rf ~/.mcp-auth`.
-   In VS Code, run **Authentication: Remove Dynamic Authentication Providers**, select Tape, and connect again.
-   For Gemini Enterprise, the message means the client ID is wrong or no longer valid. Check it, or ask Tape for a new client.

**The sign-in page says "This request has expired".** Complete a sign-in soon after you start it, in the browser where the sign-in page first opened. The page also shows this message when the request was already answered, for example after you went back in the browser, or when you opened its address in another browser. Start the connection again from your client and complete it in one browser.

**The sign-in page doesn't let you continue.** It names the reason: guests can't connect clients, your organization allows only approved clients, or it limits this client to owners and admins. Ask an owner or admin of your organization.

**The sign-in page says the connection couldn't be completed, with reason `AUTHORIZE_SCOPE_UNKNOWN`.** A scope is misspelled or contains an invisible character. This happens when you type scopes by hand, as in Gemini Enterprise. Recreate the connector with the one-line list under [Gemini Enterprise](#gemini-enterprise).

**The client keeps asking you to approve more access.** A connection with fewer scopes asks again the first time a tool needs one it lacks. Approve it, and the client continues with a new connection that includes it.

**It worked, and now Tape refuses every call with `401`.** The connection has ended: you or an admin removed it in Tape, it expired, or your role changed. Sign in again from the client.

**Calls fail with `503` and a `Retry-After` header.** Tape couldn't check the connection at that moment. Wait a few seconds and retry. Your connection is unaffected.

**The client shows the server as failed, or reports an HTML or `405` error.** The URL probably lacks the `/mcp` path, or the client is configured for SSE. Tape serves JSON-RPC over `POST` at `https://mcp.tapeapp.com/mcp` and answers every other method with `405`. Opening that URL in a browser returns `405` by design.

**A tool returns `403` that names no capability.** Then the connection's capabilities aren't the cause. Your own access applies, and a connection never grants access you don't have. Some actions require a role: creating a workspace requires an organization role that permits it, and changing a workspace requires the **Admin** role in the workspace.

**Reading a workspace returns no apps.** Reading a workspace also returns its apps, which need `apps:read` on top of `workspaces:read`. Without it, you get the workspace back with `apps: null` and a reason, not an error. That `null` means Tape *didn't read the apps at all*, unlike `[]` (none you can see), so never report such a workspace as empty.

**A tool returns `404` for a record, app or automation you know exists.** Tape answers `404` on purpose, the same as for a resource that doesn't exist. Check that your Tape user can see the resource; with a token, also check its [content access](https://developers.tapeapp.com/docs/mcp/connect-with-token#troubleshooting-a-token-connection). For an *automation*, every automation route also requires the **Admin** role in the app's workspace.

**Requests start failing with `429`.** All your connections and tokens share one per-user Developer API budget, so a busy assistant competes with your other integrations that use your tokens or user API key. Using Tape in the browser doesn't count against it. See [Request limits](https://developers.tapeapp.com/docs/api/request-limits).

**Tape rejects large tool arguments.** Request bodies are capped at 128 KB. Split the work across several calls.

## FAQ

**Can I connect without signing in through a browser?** Yes. Connect with a personal access token. A token is also the way to give an assistant read-only access, or access to only some of your workspaces and apps.

**Can the assistant delete anything?** No. No tool removes a record, comment, app, workspace, automation, field or field option, and none is planned; a person removes them in the Tape app. A write can still overwrite: `tape-update-database` replaces a field's configuration as a whole, so Tape flags it as destructive even though it deletes nothing.

This limit applies to the *tools*, not to the *credential*. Most `:edit` capabilities permit deletion through any *other* client or script that uses the credential:

-   `records:edit` covers deleting records.
-   `apps:edit` covers deleting apps, fields and views.
-   `records.comments:edit` covers deleting your own comments.
-   `automations:edit` covers deleting automations.
-   `workspaces:edit` covers deleting a workspace and everything inside it.

The access token a client receives when you sign in is also valid at the Tape Developer API.

**How do I attach a file?** In two steps: `tape-create-file-upload` creates a short-lived upload URL, then the client POSTs the file to it directly, so the bytes never travel through the MCP server. The handle you get back goes into an attachment or image field like any other value. A client that can't make HTTP requests of its own can't perform the second step; add the file in the Tape web interface instead.

**Do the assistant's writes trigger automations and webhooks?** Yes, by default. A record or comment written through MCP behaves like one written by hand: it notifies followers, fires webhooks, and triggers automations, which can send email and make outbound HTTP calls. `tape-create-records`, `tape-update-record` and `tape-create-comment` accept `silent`, `no_webhook` and `no_workflow` to suppress each of these; all three default to `false`. See [Security best practices](https://developers.tapeapp.com/docs/mcp/security).

## Next steps

-   [Connect with a token](https://developers.tapeapp.com/docs/mcp/connect-with-token): connect with narrower access through a personal access token.
-   [Supported tools](https://developers.tapeapp.com/docs/mcp/supported-tools): what each tool does and which capability it needs.
-   [Security best practices](https://developers.tapeapp.com/docs/mcp/security): what a connection can reach, and how to limit it.
-   [Capabilities](https://developers.tapeapp.com/docs/api/capabilities): how capabilities limit a connection.
-   [Request limits](https://developers.tapeapp.com/docs/api/request-limits): the shared per-user budget.
-   [Build an MCP client](https://developers.tapeapp.com/docs/mcp/build-a-client): build your own client.
-   In the Help Center: [Set up Tape MCP](https://help.tapeapp.com/en/articles/18449282-set-up-tape-mcp)
