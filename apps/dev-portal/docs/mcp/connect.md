---
id: connect
title: Connect to Tape MCP
sidebar_label: Connect to Tape MCP
description: Add Tape to Claude, Claude Code, ChatGPT, Cursor, VS Code, Codex, Gemini Enterprise or any other MCP client, and sign in with your Tape account.
---

Every client connects to the same endpoint:

```
https://mcp.tapeapp.com/mcp
```

Add that URL to your client as a remote MCP server, and sign in to Tape when the client asks. There is no token to create or paste: your client opens Tape in the browser, you approve the connection, and the client takes care of the rest.

Pick your client below. If you would rather give the client a [personal access token](/docs/mcp/connect-with-token) — for read-only access, for a server without a browser, or to limit it to some of your workspaces — that works too.

## How signing in works

1. **Your client contacts the Tape MCP server** and learns that it needs to sign in. It finds Tape's sign-in on its own — you only ever give it the URL above.
2. **Your browser opens Tape.** Sign in if you are not already, and choose the **organization** to connect if you belong to more than one. A connection reaches only the organization you choose; to use another one, connect again and choose it — in most clients that means adding Tape a second time under another name.
3. **Review the connection.** The screen reads **Connect with Tape MCP**. It notes that the client respects your Tape permissions and acts on your behalf, and that it will be able to:
   - View your organization and its members
   - Run your automations, which can send emails and call other services

   This short list stands for every capability the Tape MCP tools use (see below). A client that asks for a different set — such as a Gemini Enterprise connector set up with the read-only scopes — sees one line for each capability instead.

   A client Tape cannot tie to a website — typically one that registered itself and runs on your own computer — is marked **Unverified**. The screen does not show where your browser will return to, so only continue if you started the connection yourself from the client.
4. **Click Continue.** Your browser returns to the client, and the Tape tools are ready to use.

The connection acts **as you**: it can only ever reach what you can reach in Tape, and everything it changes shows you as the author. Clients ask for every capability the [Tape MCP tools](/docs/mcp/supported-tools) use, so one sign-in is enough for all of them. None of those capabilities manages members, shares records, manages webhooks or sends email. For a narrower connection, [use a token](/docs/mcp/connect-with-token).

**Who can connect.** Every member of a Tape organization can connect a client. Guests cannot. An organization's owners and admins can also [limit which clients members may connect](#for-organization-admins); if yours does, the sign-in screen tells you why it cannot continue.

**How long it lasts.** Your client renews its access in the background. A connection ends if the client goes **90 days** without using it, and **one year** after you approved it however often it is used — the client then asks you to sign in again. [Gemini Enterprise](#gemini-enterprise) is the exception: its connections have no one-year limit. Each client and each device gets its own connection, so connecting a second laptop does not disconnect the first — up to 10 connections per client, where an eleventh ends the oldest.

## Claude

Works in claude.ai, Claude Desktop and the Claude mobile apps, which share your connectors. Client documentation: [Custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

1. In Claude, open **Customize** → **Connectors**, click **+ Add**, then **Add custom connector**.
2. Name it `Tape` and enter `https://mcp.tapeapp.com/mcp` as the URL. If the dialog shows **Advanced settings**, leave them empty. If it asks you to review authentication settings instead, keep the recommended sign-in options and leave **Request headers** empty.
3. Click **Add**, then **Connect**, and approve the connection in Tape.

On Claude's Team and Enterprise plans, members cannot add a custom connector themselves. An owner adds Tape for the whole organization under **Organization settings** → **Connectors**, with the same name and URL. Members then find Tape under **Customize** → **Connectors** and click **Connect** — each member signs in with their own Tape account.

To change a connector's settings later, remove it and add it again.

:::note Claude Desktop with a third-party model provider
On deployments that use a third-party model provider, members cannot add connectors themselves: the deployment's admin adds Tape as a managed MCP server with OAuth turned on, and each member then connects it and approves the connection in Tape. See Claude's documentation for [extensions and MCP servers](https://claude.com/docs/third-party/claude-desktop/extensions). If the sign-in is refused on the way back to Claude, the admin adds `tapeapp.com` to that server's `oauth.additionalRedirectReferrerHosts`.
:::

## Claude Code

Client documentation: [Claude Code MCP](https://code.claude.com/docs/en/mcp).

1. Add the server:

   ```shell
   claude mcp add --transport http tape https://mcp.tapeapp.com/mcp
   ```

2. In Claude Code, run `/mcp`, select **tape** and choose **Authenticate**.
3. Approve the connection in the browser window that opens.

Add `--scope user` to make the server available in every project, or `--scope project` to write it into the repository's `.mcp.json` so your team shares it — each teammate then signs in with their own Tape account. Claude Code receives the sign-in on a random local port, and Tape accepts any port, so `--callback-port` is only needed if something on your machine requires a fixed one.

## ChatGPT

Client documentation: [Add a custom MCP server](https://developers.openai.com/api/docs/guides/custom-mcp-server).

1. In ChatGPT on the web, go to **Plugins**, select the plus button, then **Add custom MCP server**.
2. Name it `Tape`. Under **Connection**, enter `https://mcp.tapeapp.com/mcp` as the **Server URL** and choose **OAuth** authentication.
3. Review the warning, select **I understand and want to continue**, then **Create as a plugin**.
4. Install the plugin, then sign in and approve the connection in Tape.

Your ChatGPT workspace permissions and security settings decide whether you can add and use custom MCP servers.

## Cursor

Client documentation: [Cursor MCP](https://cursor.com/docs/mcp).

1. Create `.cursor/mcp.json` in your project — or `~/.cursor/mcp.json` to use Tape in every project — with:

   ```json title=".cursor/mcp.json"
   {
     "mcpServers": {
       "tape": {
         "url": "https://mcp.tapeapp.com/mcp"
       }
     }
   }
   ```

2. Save the file and restart Cursor. Open **Customize** in the sidebar → **MCPs**, find Tape, follow the sign-in prompt, and approve the connection in Tape.

## VS Code (GitHub Copilot)

Client documentation: [VS Code MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers).

1. Create `.vscode/mcp.json` in your workspace with:

   ```json title=".vscode/mcp.json"
   {
     "servers": {
       "tape": {
         "type": "http",
         "url": "https://mcp.tapeapp.com/mcp"
       }
     }
   }
   ```

   VS Code uses `servers` where most clients use `mcpServers`, and needs `"type": "http"`.

2. Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`), run **MCP: List Servers**, and start **tape**.
3. Allow VS Code to sign in when it asks, and approve the connection in Tape.

To use Tape in every workspace, run **MCP: Open User Configuration** and add the same entry there.

## Codex

Client documentation: [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp).

1. Add the server to `~/.codex/config.toml` — or `.codex/config.toml` in a trusted project:

   ```toml title="~/.codex/config.toml"
   [mcp_servers.tape]
   url = "https://mcp.tapeapp.com/mcp"
   ```

2. Sign in:

   ```shell
   codex mcp login tape
   ```

3. Approve the connection in the browser window that opens.

## Gemini Enterprise

Client documentation: [Set up a custom MCP server](https://docs.cloud.google.com/gemini/enterprise/docs/connectors/custom-mcp-server/set-up-custom-mcp-server).

Gemini Enterprise does not discover Tape's sign-in on its own, so a Google admin sets the connection up once, with a client ID and secret that Tape issues for your organization.

1. Email [team@tapeapp.com](mailto:team@tapeapp.com) to request a Gemini Enterprise client for your Tape organization. Say whether you use Gemini Enterprise in the Google Cloud console or Gemini Business.
2. In Gemini Enterprise, add a **custom MCP server** with **OAuth 2.0** authentication:

   | Field             | Value                                       |
   | ----------------- | ------------------------------------------- |
   | MCP Server URL    | `https://mcp.tapeapp.com/mcp`               |
   | Authorization URL | `https://api.tapeapp.com/oauth/authorize`   |
   | Token URL         | `https://api.tapeapp.com/oauth/token`       |
   | Client ID         | The client ID Tape sent you                 |
   | Client Secret     | The client secret Tape sent you             |
   | Scopes            | See below                                   |

   In the Google Cloud console, also select **Enable PKCE Support**.

3. In the Google Cloud console, wait until the data store is active and connect it to your Gemini Enterprise app.
4. The admin, then each user, authorizes the connector once in the Gemini Enterprise web app and approves the connection in Tape.
5. Only then, in the Google Cloud console, open the data store, click **Actions** → **Reload custom actions**, select the Tape tools and click **Enable actions**. No action is enabled by default.

Gemini cannot ask for more permissions later, so **the scopes you enter are all it will ever have** — fill them in even where the form marks the field optional; left empty, the connector can only read apps and records. Enter them on one line, separated by single spaces. For the full set of Tape MCP tools:

```text
organization:read workspaces:read workspaces:edit apps:read apps:edit records:read records:edit records.comments:read records.comments:edit automations:read automations:edit automations:run
```

Leave out `automations:run` if Gemini should not start automations — it is the one capability whose effects can leave Tape. For a read-only connector:

```text
organization:read workspaces:read apps:read records:read records.comments:read automations:read
```

A few things to know:

- **Google Cloud console prerequisites.** The admin needs Google's Discovery Engine Editor role, the organization policy must allow custom MCP data stores, and the egress hosts `mcp.tapeapp.com` and `api.tapeapp.com` must be allowed. Users need Google Identity (Google Workspace or Cloud Identity) or workforce identity federation. See Google's guide.
- **Gemini Business** cannot edit a connector's OAuth settings afterwards — to change them, delete the connector and create it again.
- **No yearly reconnect.** Connections through the client Tape issued last as long as Gemini uses them at least once every 90 days.

## Other MCP clients

Any client that supports **remote MCP servers with OAuth** can connect. Add a Streamable HTTP server with Tape's URL, and complete the sign-in when the client asks:

```json
{
  "mcpServers": {
    "tape": {
      "url": "https://mcp.tapeapp.com/mcp"
    }
  }
}
```

Tape has no SSE endpoint, so choose Streamable HTTP — or plain "HTTP" — wherever a client offers a transport.

**Clients that only run local servers** — including Claude Desktop's `claude_desktop_config.json` — can reach Tape through the [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) bridge, which runs on your computer and opens the sign-in in your browser. It needs Node.js.

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

If the client signs in to remote servers neither way, [connect it with a token](/docs/mcp/connect-with-token).

To exercise the endpoint by hand, point the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) at `https://mcp.tapeapp.com/mcp` and use its OAuth flow.

Building your own client? See [Build an MCP client](/docs/mcp/build-a-client).

## Verify the connection

**Ask the assistant which Tape tools it has.** A populated tool list proves the client reaches the server.

**Then ask it which Tape account it is connected as.** That uses `tape-fetch` with `type: "self"`, which works with any connection and needs no permission. Its answer also lists which tools the connection can use — so if the tool list appears and this fails, the problem is the sign-in, not the connection. Note that `tape-get-users` is a different tool, for finding *other* people by name.

From the shell, the health endpoint answers without any client at all:

```shell
curl https://mcp.tapeapp.com/health
```

```json title="⬅️      Response"
{ "status": "ok" }
```

## Manage your connections

**In Tape**, open **Settings** → **Tape MCP** → **Connected** to see the MCP clients you have connected, when you first connected each one and when it was last used. Tape lists clients by app — **Claude**, for example, covers claude.ai, Claude Desktop and Claude Code. Select one and click **Remove** to disconnect it on every device; it stops working on its next request.

**In the client**, removing the server or connector deletes the client's copy of your sign-in. Most clients do not tell Tape, so the connection stays listed in Tape until it expires after 90 days unused. Remove it in Tape as well to end it right away.

### For organization admins

Owners and admins manage clients for the whole organization in **Settings** → **Tape MCP** → **Manage**. The per-client controls are in the **⋯** menu of a client's row:

- **Which clients members can connect** — every MCP client, or **approved MCP clients only**. Switching to approved clients only disconnects no one: every MCP client someone in your organization is connected to at that moment is approved automatically, so review the **Approved MCP clients** list afterwards and remove or restrict what you don't want. Removing a client from that list disconnects everyone from it. From then on, members can only connect approved clients. Owners and admins can always connect a client, and connecting one while only approved clients are allowed approves it for the organization. Limiting clients requires the Premium or Enterprise plan.
- **Access** → **Admins & owners** — take a client away from members; the table then shows it as **Restricted**. Members' connections to it end immediately, and setting **Access** back to **Everyone** does not restore them.
- **View members** — see who has connected a client.
- **Disconnect all members** — everyone, owners and admins included — from one client, or **Disconnect all users** from Tape MCP at once.

These controls apply to signed-in clients. A member can still connect a client with a [personal access token](/docs/mcp/connect-with-token).

## Troubleshooting

**The browser says Tape does not know the client registration.**
A client that registers itself is removed from Tape if no one connects it within 25 hours of registering, and the client has to register again. Remove Tape from the client and add it again. For `mcp-remote`, delete its stored registrations with `rm -rf ~/.mcp-auth`; in VS Code, run **Authentication: Remove Dynamic Authentication Providers**, select Tape, and connect again. For Gemini Enterprise, this means the client ID is wrong or no longer valid: check it, or ask Tape for a new client.

**The sign-in page says "This request has expired".**
A sign-in has to be completed within 10 minutes, in the browser where the sign-in page first opened. The page also shows this message when the request was already answered — after going back in the browser, for example — or when its address was opened in another browser. Start the connection again from your client and complete it in one browser.

**The sign-in page will not let you continue.**
It names the reason: guests cannot connect clients, or your organization allows only approved clients, or limits this one to admins and owners. Ask an owner or admin of your organization.

**The sign-in page says the connection could not be completed, with reason `AUTHORIZE_SCOPE_UNKNOWN`.**
A scope is misspelled or contains an invisible character. This happens when scopes are typed by hand, as in Gemini Enterprise: recreate the connector with the plain one-line list above.

**The client keeps asking you to approve more access.**
A connection made with fewer permissions asks again the first time a tool needs one it lacks. Approve it, and the client continues with a new connection that includes it.

**It worked, and now every call is refused with `401`.**
The connection has ended — removed in Tape or by an admin, expired, or your role changed. Sign in again from the client.

**Calls fail with `503` and a `Retry-After` header.**
Tape could not check the connection at that moment. Wait a few seconds and retry; your connection is unaffected.

**The client shows the server as failed, or reports an HTML or `405` error.**
The URL is likely missing the `/mcp` path, or the client is configured for SSE. Tape serves JSON-RPC over `POST` at `https://mcp.tapeapp.com/mcp` and answers every other method with `405`. Opening that URL in a browser returns `405` by design.

**A tool returns `403` that names no capability.**
Then it is not about the connection's permissions. Your own access applies — a connection never grants access you do not already have — and some actions require a role: creating a workspace requires an organization role permitting it, and changing one requires workspace-admin rights.

**Reading a workspace returns no apps.**
Reading a workspace also returns the apps inside it, and those need `apps:read` on top of `workspaces:read`. Without it you get the workspace back with `apps: null` and a reason, rather than an error. Read that `null` carefully: it means the apps were **not read at all**, which is not the same as `[]`, meaning there are none you can see. Never report such a workspace as empty.

**A tool returns `404` for a record, app or automation you know exists.**
A `404` is deliberately indistinguishable from a resource that does not exist. Check that your Tape user can see it. For an **automation** there is a second cause with the same `404`: every automation route also requires admin rights on the workspace the app is in. With a token, also check its [workspace and app selection](/docs/mcp/connect-with-token#troubleshooting-a-token-connection).

**Requests start failing with `429`.**
All of your connections and tokens share one per-user Developer API budget, so a busy assistant competes with your other integrations that use your tokens or API key. Using Tape in the browser does not count against it. See [Request limits](/docs/api/request-limits).

**Large tool arguments are rejected.**
Request bodies are capped at 128 KB. Split the work across several calls.

## FAQ

**Can I connect without signing in through a browser?**
Yes — [connect with a personal access token](/docs/mcp/connect-with-token). That is also the way to give an assistant read-only access, or access to only some of your workspaces and apps.

**Can the assistant delete anything?**
No. No tool removes a record, comment, app, workspace or automation, and none is planned. Fields and field options were the last exception and stopped being one on 2026-08-23 — a person removes those in the Tape app now. A write can still overwrite: `tape-update-database` replaces a field's configuration wholesale, so it is flagged destructive even though it deletes nothing.

Note that this bounds the **tools**, not the **credential**. Most `:edit` capabilities permit deletion through any *other* client or script the credential is used from: `records:edit` covers deleting records, `apps:edit` covers deleting apps, fields and views, `records.comments:edit` covers deleting your own comments, `automations:edit` covers deleting automations, and `workspaces:edit` covers deleting a workspace and everything inside it. The access token a client receives when you sign in is also valid at the Tape Developer API.

**How do I attach a file?**
In two steps. `tape-create-file-upload` mints a short-lived upload URL, and the client then POSTs the file to it directly. The bytes never travel through the MCP server. The handle you get back goes into an attachment or image field like any other value. A client that cannot make HTTP requests of its own cannot perform the second step, so in that case the file has to go into Tape through the web interface.

**Will the assistant's writes trigger automations and webhooks?**
Yes, by default. A record or comment written through MCP behaves exactly like one written by hand: it notifies followers, fires webhooks, and triggers automations, which can send email and make outbound HTTP calls. The write tools accept `silent`, `no_webhook` and `no_workflow` to suppress each of those, and all three default to `false`. See [Security best practices](/docs/mcp/security).
