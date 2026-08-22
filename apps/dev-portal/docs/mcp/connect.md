---
id: connect
title: Connect to Tape MCP
sidebar_label: Connect to Tape MCP
description: Configure Claude Code, Cursor, VS Code, Windsurf, Codex, Claude Desktop or any other MCP client to reach the Tape MCP server.
---

Every client connects to the same endpoint and authenticates the same way:

```
https://mcp.tapeapp.com/mcp
```

```http
Authorization: Bearer tape_pat_0a1b2c3d...
```

What differs between clients is only where that URL and header are written down. Pick your client below.

## Before you start

Create a [personal access token](/docs/api/personal-access-tokens) for this client — the token **is** the connection's permission boundary, and it is required today (OAuth 2.1 is [planned](/docs/mcp/overview#authentication)).

1. Click the user avatar on the top right and open your user settings.
2. Go to the **Developer** section, and under **Personal access tokens (PATs)** click **New token**.
3. Choose which **workspaces and apps** the assistant may reach.
4. Choose its [**capabilities**](/docs/api/capabilities) — see the table below.
5. Copy the token. It is shown exactly once.

Grant only what the assistant actually needs:

| You want the assistant to…                       | Grant                                     |
| ------------------------------------------------ | ----------------------------------------- |
| List apps, read views, and search                | `apps:read`                               |
| Read records and their field values              | `records:read`                            |
| Create records                                   | `apps:read` + `records:edit`              |
| Update records                                   | `records:read` + `records:edit` + `apps:read` |
| Upload files                                     | `records:edit`                            |
| Post comments on records                         | `records.comments:edit`                   |
| Create apps, fields and views                    | `apps:edit`                               |
| Change existing apps and fields                  | `apps:read` + `apps:edit`                 |
| Look up other users in your organization         | `organization:read`                       |
| Read the workspaces you belong to                | `workspaces:read`                         |
| Create and rename workspaces                     | `workspaces:edit`                         |

:::note Writing usually needs reading too
[Editing does not include reading](/docs/api/capabilities#four-rules-worth-knowing) — they are separate capabilities. Most write tools read before they write, so a token with only an `:edit` capability fails on calls that look like they should work. Pair them, as the table does.

One pairing is **conditional** and therefore the easiest to get wrong: updating a record reaches for the app's schema only when you set a field that currently has no value. A token without `apps:read` will update many records successfully and then fail on one, for no reason the caller can see.

Search is the mirror image. It runs with **either** `apps:read` or `records:read` and [narrows its results rather than refusing](/docs/api/capabilities#four-rules-worth-knowing), so a token holding only `apps:read` searches successfully and silently returns no records at all. Grant both if the assistant should search across everything.
:::

A **read-only assistant** — one that can answer questions but never change anything — is a token holding `apps:read` and `records:read` and nothing else. Capabilities are fixed at creation, so to change them, create a new token and revoke the old one.

:::caution `workspaces:edit` reaches further than the MCP tools do
The MCP server exposes no way to delete anything, but `workspaces:edit` is not a delete-free grant — it covers **deleting a workspace, and with it every app and record inside**. The token carries that reach into any other client or script it is used from, whatever the tool list allows. Grant it only for a token that genuinely needs to create or rename workspaces, and keep it off your everyday assistant token.

Note also that creating a workspace requires a token whose content selection is **All**, and an organization role permitting workspace creation. A token restricted to selected workspaces and apps is refused outright — see [Content selection](/docs/api/personal-access-tokens#content-selection).
:::

:::caution Treat the token like a password
It goes into a config file on your machine. Prefer the environment-variable or secret-prompt form shown for your client over pasting the literal token, never commit a config file containing one, and revoke the token if it may have leaked.
:::

## Claude Code

```shell
claude mcp add --transport http tape https://mcp.tapeapp.com/mcp \
  --header "Authorization: Bearer tape_pat_0a1b2c3d..."
```

Add `--scope user` to make the server available in every project, or `--scope project` to write it into the repository's `.mcp.json` — in which case use an environment variable rather than a literal token, since that file is shared.

## Cursor

Cursor Settings → **MCP** → **Add new global MCP server**, or create `.cursor/mcp.json` in the project. The global file is `~/.cursor/mcp.json`.

```json title=".cursor/mcp.json"
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

Set `TAPE_PAT` in your shell profile rather than inlining the token.

## VS Code (GitHub Copilot)

Create `.vscode/mcp.json` in the workspace. The `inputs` block makes VS Code prompt for the token once and store it securely, so no secret is written into the file.

```json title=".vscode/mcp.json"
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

## Windsurf

Settings → Cascade → **MCP servers** → **View raw config**, which opens `~/.codeium/windsurf/mcp_config.json`.

```json title="mcp_config.json"
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

The header name must be exactly `Authorization`, and the value must be `Bearer ` followed by the token, with the space.

## Codex

Add the server to `~/.codex/config.toml` (or `.codex/config.toml` for a single project). Codex reads the token from an environment variable at connect time and sends it as `Authorization: Bearer`.

```toml title="~/.codex/config.toml"
[mcp_servers.tape]
url = "https://mcp.tapeapp.com/mcp"
bearer_token_env_var = "TAPE_PAT"
```

Export `TAPE_PAT` before starting Codex — if the variable is unset or empty, the server fails to start. On older Codex versions that only pick up stdio servers, add `experimental_use_rmcp_client = true` under a `[features]` block above the server entry, or upgrade.

## Claude Desktop

Claude Desktop's **Connectors** onboard a remote server through an OAuth sign-in and cannot set a bearer token, so they cannot reach Tape until [OAuth 2.1](/docs/mcp/overview#authentication) ships. Until then, bridge to the endpoint with [`mcp-remote`](https://www.npmjs.com/package/mcp-remote), which runs locally over stdio and forwards to the HTTP endpoint with your header.

```json title="claude_desktop_config.json"
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

Two details in that snippet are deliberate:

- **`--transport http-only`.** Tape speaks streamable HTTP and has no SSE endpoint, so there is nothing for the default SSE fallback to find.
- **`Authorization:${TAPE_AUTH_HEADER}` with no space, and the `Bearer ` inside the variable.** Claude Desktop on Windows and Cursor mangle arguments containing spaces; keeping the space inside the environment variable avoids it. On macOS and Linux you may write `"Authorization: Bearer ${TAPE_PAT}"` directly.

The same configuration works in any other stdio-only client.

## Claude API

The Messages API can call the Tape MCP server directly through its MCP connector. Declare the server and reference it from a toolset:

```json
{
  "model": "claude-opus-5",
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

Send the beta header `anthropic-beta: mcp-client-2025-11-20`. Both halves are required — declaring `mcp_servers` without a matching `mcp_toolset` entry is rejected.

## Any other MCP client

Configure a **remote streamable-HTTP server** with one custom header. Most clients accept some variation of:

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

If the client only speaks stdio, use the `mcp-remote` bridge shown under [Claude Desktop](#claude-desktop). There is no SSE endpoint to fall back to — Tape answers `GET` with `405`.

To exercise the endpoint by hand, point the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) at `https://mcp.tapeapp.com/mcp` and add the `Authorization` header there.

## Verify the connection

**Ask the assistant which Tape tools it has.** The server advertises its whole tool list on connection, so a populated list proves the transport and the configuration are working before authentication is in the picture.

**Then ask it to look up your own Tape user.** That needs a token but no capability, so it isolates the credential: if the tool list appears and this fails, the problem is the token, not the connection.

From the shell, the health endpoint answers without any client at all:

```shell
curl https://mcp.tapeapp.com/health
```

```json title="⬅️      Response"
{ "status": "ok" }
```

## Troubleshooting

**The client shows the server as failed, or reports an HTML/`405` error.**
The URL is likely missing the `/mcp` path, or the client is configured for SSE. Tape serves JSON-RPC over `POST` at `https://mcp.tapeapp.com/mcp` and answers every other method with `405`. Opening that URL in a browser returns `405` by design.

**A tool fails saying it "requires a Tape personal access token, but the request carried none".**
The `Authorization` header is not reaching the server. Check that the header name is exactly `Authorization`, that the value starts with `Bearer ` including the space, and — if you used an environment variable — that it is actually set in the environment the client was launched from. GUI apps often do not inherit a shell profile.

**`no active user for the given API key`, or a signature error.**
The token is wrong, revoked, or was altered on the way. Send it **verbatim**, keeping the `tape_pat_` prefix — the prefix is part of the credential, and stripping or re-casing it breaks authentication.

**A tool returns `403` naming a missing scope.**
The token lacks a [capability](/docs/api/capabilities) that tool needs. Capabilities are fixed at creation: create a new token with the capability, switch the client over, and revoke the old one. See the table under [Before you start](#before-you-start).

**A tool returns `403` that names no capability.**
Then it is not a capability problem, and minting a broader token will not fix it. Three things sit outside capabilities: your own per-resource permissions (a capability never grants access you do not already have), a content-restricted token being **refused** rather than narrowed on some calls, and route-specific gates — creating a workspace also requires an organization role permitting it, and changing one requires workspace-admin rights. Read the message: **a `403` naming a capability is a scoping problem; a `403` that does not is one of these.**

**Reading a workspace returns no apps.**
Reading a workspace also returns the apps inside it, and those need `apps:read` on top of `workspaces:read`. Without it you get the workspace back with an empty app list and a reason, rather than an error — the one call on this surface that answers partially instead of failing.

**A tool returns `404` for a record or app you know exists.**
The resource is outside the token's workspace and app selection. A `404` here is deliberately indistinguishable from a resource that does not exist — check the selection before anything else.

**Requests start failing with `429`.**
All of your credentials share one per-user budget, so a busy assistant competes with your other integrations and your web session. See [Request limits](/docs/api/request-limits).

**Large tool arguments are rejected.**
Request bodies are capped at 128 KB. Split the work across several calls.
