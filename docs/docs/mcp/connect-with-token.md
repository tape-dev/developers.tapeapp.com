# Connect with a personal access token

> Connect an MCP client to Tape with a personal access token instead of signing in — for headless use, narrower access, or clients without OAuth support.

Connect an MCP client to Tape with a personal access token instead of [signing in](https://developers.tapeapp.com/docs/mcp/connect).

Point the client at the endpoint, and have it send the [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens) as a header on every request:

```text
https://mcp.tapeapp.com/mcp
```

```http
Authorization: Bearer tape_pat_0a1b2c3d...
```

## When to use a token

| Situation | Why a token |
| --- | --- |
| The assistant should reach only *some workspaces or apps* | You can limit a token to selected workspaces and apps. A sign-in reaches everything you can |
| The assistant should be *read-only*, or hold fewer capabilities | You pick a token's capabilities one by one. A sign-in grants every capability the Tape MCP tools use |
| It runs *without a browser*, for example on a server, in a CI job, or through the Claude API | Signing in needs a person at a browser. You configure a token once |
| The client can't sign in to remote MCP servers | A token only needs the client to send a header, or the [`mcp-remote`](#claude-desktop) bridge |

Guests can't connect an MCP client either way. They can't sign in from a client, and they can't create a personal access token. A token created before someone became a guest stops working until they're a member again.

A token connection and a signed-in connection see the same tools. A token limits them to the capabilities and content access you chose. When a capability is missing, a tool on a token fails and you create a new token; on a sign-in, your client asks you to approve more access.

## Step 1: Create a token

Create a token for this client as described in [Create a token](https://developers.tapeapp.com/docs/api/personal-access-tokens#create-a-token): select your profile picture, then select **Preferences** → **Developer** → **New token**. The token sets what the connection may do and reach.

-   **Token name:** for example "Read-only assistant".
-   **Content access:** keep **All** or select only the workspaces and apps the assistant may reach.
-   **Capabilities:** clear **All**, then select only what the assistant needs. For a read-only assistant, that's **Read apps** and **Read records** (`apps:read`, `records:read`). For more, see [Choose capabilities](#choose-capabilities).

Select **Create token** and copy the token. Tape shows it only once.

![New personal access token dialog named Read-only assistant with access to all content and 2 capabilities: one under Apps and Read records under Records](https://developers.tapeapp.com/assets/images/read-only-token-94c0245459305a969a7a4251a437e34d.png)

> Treat the token like a password
> 
> Keep the token out of the config file: use the environment variable or secret prompt shown for your client. Never commit a config file that contains a token, and revoke the token if it may have leaked.

## Step 2: Add Tape to your client

Pick your client below. Each one sends the token in the `Authorization` header.

### Claude Code

Client documentation: [Claude Code MCP](https://code.claude.com/docs/en/mcp).

```shell
claude mcp add --transport http tape https://mcp.tapeapp.com/mcp \
  --header "Authorization: Bearer tape_pat_0a1b2c3d..."
```

Add `--scope user` to make the server available in every project. Add `--scope project` to write it into the repository's `.mcp.json`. Since your team shares that file, use an environment variable there instead of the token itself.

### Cursor

Client documentation: [Cursor MCP](https://cursor.com/docs/mcp).

1.  Create `.cursor/mcp.json` in your project, or `~/.cursor/mcp.json` to use Tape in every project.
2.  Paste the configuration below.
3.  Set `TAPE_PAT` in your shell profile instead of writing the token into the file.
4.  Save and *restart Cursor*. Tape then appears under **Customize** → **MCPs**.

*.cursor/mcp.json*

```json
{
  "mcpServers": {
    "tape": {
      "url": "https://mcp.tapeapp.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:TAPE_PAT}"
      }
    }
  }
}
```

### VS Code (GitHub Copilot)

Client documentation: [VS Code MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers).

1.  Create `.vscode/mcp.json` in the workspace and paste the configuration below. The `inputs` block makes VS Code prompt for the token once and store it securely, so no secret goes into the file.
2.  Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run **MCP: List Servers**.
3.  Start the Tape server. VS Code prompts for the token on first use.

*.vscode/mcp.json*

```json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "tape-pat",
      "description": "Tape personal access token",
      "password": true
    }
  ],
  "servers": {
    "tape": {
      "type": "http",
      "url": "https://mcp.tapeapp.com/mcp",
      "headers": {
        "Authorization": "Bearer ${input:tape-pat}"
      }
    }
  }
}
```

### Claude Desktop

Custom connectors in Claude Desktop and on claude.ai normally connect by signing in. To use a token instead and keep it on your own machine, bridge to the endpoint with [`mcp-remote`](https://www.npmjs.com/package/mcp-remote). It runs locally over stdio and forwards to the HTTP endpoint with your header.

1.  Add the configuration below to your `claude_desktop_config.json`.
2.  Restart Claude Desktop.

*claude_desktop_config.json*

```json
{
  "mcpServers": {
    "tape": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.tapeapp.com/mcp",
        "--transport",
        "http-only",
        "--header",
        "Authorization:${TAPE_AUTH_HEADER}"
      ],
      "env": {
        "TAPE_AUTH_HEADER": "Bearer tape_pat_0a1b2c3d..."
      }
    }
  }
}
```

Two details in this snippet are deliberate:

-   **`--transport http-only`.** Tape speaks Streamable HTTP and has no SSE endpoint, so the default SSE fallback finds nothing.
-   **`Authorization:${TAPE_AUTH_HEADER}` with no space, and `Bearer` inside the variable.** Claude Desktop on Windows and Cursor break arguments that contain spaces. Keeping the space inside the environment variable avoids this. On macOS and Linux, you can write `"Authorization: Bearer ${TAPE_PAT}"` directly.

The same configuration works in any other stdio-only client.

### Windsurf

Client documentation: [Windsurf MCP](https://docs.windsurf.com/windsurf/cascade/mcp).

1.  Open **Settings** → **Cascade** → **MCP servers** → **View raw config**. This opens `~/.codeium/windsurf/mcp_config.json`.
2.  Add the configuration below.
3.  Set `TAPE_PAT` in your shell profile.
4.  Save and *restart Windsurf*.

*mcp_config.json*

```json
{
  "mcpServers": {
    "tape": {
      "serverUrl": "https://mcp.tapeapp.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:TAPE_PAT}"
      }
    }
  }
}
```

The header name must be exactly `Authorization`. The value must be `Bearer` followed by the token, with the space.

### Codex

Client documentation: [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp).

Add the server to `~/.codex/config.toml`, or to `.codex/config.toml` for a single project. Codex reads the token from an environment variable when it connects and sends it as `Authorization: Bearer`.

*~/.codex/config.toml*

```toml
[mcp_servers.tape]
url = "https://mcp.tapeapp.com/mcp"
bearer_token_env_var = "TAPE_PAT"
```

Export `TAPE_PAT` before you start Codex; if the variable is unset or empty, the server fails to start. Older Codex versions pick up stdio servers only: add `experimental_use_rmcp_client = true` under a `[features]` block above the server entry, or upgrade.

### Claude API

Client documentation: [MCP connector](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector).

The Messages API calls the Tape MCP server directly through its MCP connector. Declare the server and reference it from a toolset:

```json
{
  "model": "claude-opus-5-5",
  "max_tokens": 4096,
  "mcp_servers": [
    {
      "type": "url",
      "name": "tape",
      "url": "https://mcp.tapeapp.com/mcp",
      "authorization_token": "tape_pat_0a1b2c3d..."
    }
  ],
  "tools": [{ "type": "mcp_toolset", "mcp_server_name": "tape" }],
  "messages": [{ "role": "user", "content": "Which of my apps have records created this week?" }]
}
```

Send the beta header `anthropic-beta: mcp-client-2025-11-20`. Both halves are required: the API rejects `mcp_servers` without a matching `mcp_toolset` entry.

### Any other MCP client

Configure a *remote Streamable HTTP server* with one custom header. Most clients accept a variation of:

```json
{
  "mcpServers": {
    "tape": {
      "url": "https://mcp.tapeapp.com/mcp",
      "headers": {
        "Authorization": "Bearer tape_pat_0a1b2c3d..."
      }
    }
  }
}
```

If the client speaks stdio only, use the `mcp-remote` bridge shown under [Claude Desktop](#claude-desktop). There's no SSE endpoint to fall back to: Tape answers `GET` with `405`.

To test the endpoint by hand, point the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) at `https://mcp.tapeapp.com/mcp` and add the `Authorization` header there.

## Step 3: Check the result

1.  **Ask the assistant which Tape tools it has.** A populated tool list shows that the client reaches the server.
2.  **Ask it which Tape account it's connected as**, for example "Which Tape user and organization are you connected as?" The assistant calls `tape-fetch` with `type: "self"`, which needs no capability. The answer names your user and organization.
3.  **Ask it which tools the token can use.** The tool list from step 1 shows every tool, whatever the token's capabilities. The `self` answer's `current_tool_access` marks each tool `available`, `partial` or `unavailable`, with the `missing_scopes` to add. `available` means the capabilities don't block the tool; content access and roles still apply.

Getting `401`, or does the client ask you to sign in? See [Troubleshooting a token connection](#troubleshooting-a-token-connection).

## Choose capabilities

Grant only what the assistant needs:

| You want the assistant to… | Grant |
| --- | --- |
| List apps, read views, and search | `apps:read` |
| Read records and their field values | `records:read` |
| List records shared with you | `records:read` |
| Create records | `apps:read` + `records:edit` |
| Update records | `records:read` + `records:edit` (+ `apps:read`) |
| Upload files | `records:edit` |
| Read comments and replies on records | `records.comments:read` |
| Post comments on records | `records.comments:edit` |
| Create apps (with their fields) and views | `apps:edit` |
| Change existing apps, or add fields to them | `apps:read` + `apps:edit` |
| Change an existing view | `apps:edit` |
| Look up other users in your organization | `organization:read` |
| Read the workspaces you belong to | `workspaces:read` |
| Create and rename workspaces | `workspaces:edit` |
| See automations, their setup and their run history, including credentials for connected systems | `automations:read` |
| Create, change, activate or pause automations | `automations:edit` |
| Trigger an automation manually | `automations:run` |

> Why does a write fail with only an edit capability?
> 
> [Editing doesn't include reading](https://developers.tapeapp.com/docs/api/capabilities#four-rules-worth-knowing), and most write tools read before they write. Pair them, as the table does.
> 
> Updating a record reads the app's schema only when you set a field that has no value yet. Without `apps:read`, a token updates many records and then fails on one.
> 
> Search [narrows its results instead of refusing](https://developers.tapeapp.com/docs/api/capabilities#four-rules-worth-knowing): with only `apps:read`, it returns no records and no error. Grant both if the assistant should search across everything.

> Why do automations still fail with the right capability?
> 
> `tape-run-automation` checks only `automations:run`. But automation IDs come only from `tape-get-automations`, and reading one uses `tape-fetch`. Both need `automations:read`, so pair them.
> 
> *Every* automation route also requires the **Admin** role in the app's workspace, which no capability replaces. Without it, `tape-get-automations` and `tape-get-runs` return an *empty page and no error* ("none you administrate", not "none exist"). Everything else, including `tape-fetch` with `type: "automation"` or `type: "automation_run"`, answers `404`.

A *read-only assistant* (`apps:read` and `records:read` only) can't read comments, see automations, list workspaces or look up colleagues: Tape *refuses these calls instead of answering partially*. Add `records.comments:read`, `automations:read`, `workspaces:read` and `organization:read` for whichever of these the assistant should reach.

> `workspaces:edit` reaches further than the MCP tools do
> 
> No MCP tool deletes, but `workspaces:edit` covers *deleting a workspace, and with it every app and record inside*, in any other client or script that uses the token. Grant it only to a token that needs to create or rename workspaces.
> 
> Creating a workspace also requires a token whose [content access](https://developers.tapeapp.com/docs/api/personal-access-tokens#content-selection) is **All**, and an organization role that permits creating workspaces.

### Automations run as their owner

> `automations:run` reaches beyond the token
> 
> An automation runs with the rights of the person who owns it. Triggering one can change *and delete* data in apps outside your token's content access, send email in someone else's name, call external systems, and run custom code. The tool's arguments don't show what the automation does.
> 
> Grant it only when the assistant needs to trigger automations, and read the automation before you run it. A *paused automation can still run this way*: pausing stops only its trigger.
> 
> `automations:run` neither implies nor requires `automations:read` or `automations:edit`.

## Troubleshooting a token connection

**The client can't connect, reports `401`, or asks you to sign in to Tape even though you configured a token.** The `Authorization` header doesn't reach the server, so Tape answers `401` and invites the client to sign in. Don't complete that sign-in if you meant to use a token: it connects without the token's limits. Check these points:

-   The header name is exactly `Authorization`.
-   The value starts with `Bearer` , including the space.
-   If you used an environment variable, it's set in the environment the client was launched from. An unset variable leaves an empty `Bearer` value, which counts as no token. GUI apps often don't inherit a shell profile.

**`no active user for the given API key`, or a signature error.** The token is wrong, revoked, or was altered on the way. Send it *verbatim*, with the `tape_pat_` prefix in lower case.

**A tool returns `403` naming a missing capability.** The token lacks a [capability](https://developers.tapeapp.com/docs/api/capabilities) the tool needs, and capabilities are fixed at creation. Create a new token with the capability, switch the client over, and revoke the old one. See [Choose capabilities](#choose-capabilities).

**A tool returns `404` for a record, app or automation you know exists.** Check the token's [content access](https://developers.tapeapp.com/docs/api/personal-access-tokens#content-selection) first: a resource outside it returns the same `404` as one that doesn't exist. For other causes, see [Troubleshooting](https://developers.tapeapp.com/docs/mcp/connect#troubleshooting).

## Revoking a token

Select your profile picture, then select **Preferences** → **Developer**, and revoke the token there; see [Revoke a token](https://developers.tapeapp.com/docs/api/personal-access-tokens#revoke-a-token). Revoking takes effect on the next request and never affects your other tokens or your signed-in connections.

## Next steps

[

Personal access tokens

how tokens work and how to limit them.

](https://developers.tapeapp.com/docs/api/personal-access-tokens)[

Capabilities

choose the right grants.

](https://developers.tapeapp.com/docs/api/capabilities)[

Supported tools

the capability each tool needs.

](https://developers.tapeapp.com/docs/mcp/supported-tools)[

Connect to Tape MCP

connect by signing in instead.

](https://developers.tapeapp.com/docs/mcp/connect)[

Security best practices

what a token can reach, and how to bound it.

](https://developers.tapeapp.com/docs/mcp/security)[

Request limits

the shared per-user budget.

](https://developers.tapeapp.com/docs/api/request-limits)
