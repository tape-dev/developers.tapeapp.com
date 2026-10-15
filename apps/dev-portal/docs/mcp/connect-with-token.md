---
id: connect-with-token
title: Connect with a Personal Access Token
sidebar_label: Connect with a Token
description: Connect an MCP client to Tape with a personal access token instead of signing in — for headless use, narrower access, or clients without OAuth support.
---

Most clients [connect by signing in to Tape](/docs/mcp/connect). Instead of signing in, you can give the client a [personal access token](/docs/api/personal-access-tokens), sent as a header on every request:

```
https://mcp.tapeapp.com/mcp
```

```http
Authorization: Bearer tape_pat_0a1b2c3d...
```

## When to use a token

| Situation                                                                 | Why a token                                                                                                     |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| The assistant should reach only **some workspaces or apps**               | A token can be limited to selected workspaces and apps. A sign-in always reaches everything you can            |
| The assistant should be **read-only**, or hold fewer capabilities         | You pick a token's capabilities one by one. A sign-in grants every capability the Tape MCP tools use            |
| It runs **without a browser** — a server, a CI job, the Claude API        | Signing in needs a person at a browser. A token is configured once                                              |
| The client cannot sign in to remote MCP servers                           | A token only needs the client to send a header, or the [`mcp-remote`](#claude-desktop) bridge                   |

Guests cannot connect an MCP client either way: they cannot sign in from a client, and they cannot create a personal access token. A token created before someone became a guest stops working until they are a member again.

A token connection and a signed-in connection see the same tools. What differs is how much of them the connection may use: a token is limited to the capabilities, workspaces and apps you chose. They also differ when a tool needs a capability the connection lacks — with a token, the tool fails and you create a new token; with a sign-in, your client asks you to approve more access.

## Before you start

Create a [personal access token](/docs/api/personal-access-tokens) for this client — the token **is** the connection's permission boundary.

1. Click the user avatar in the top-right corner and open **Preferences**.
2. Go to the **Developer** section.
3. Under **Personal access tokens (PATs)**, click **New token**.
4. Choose which **workspaces and apps** the assistant may reach.
5. Choose its [**capabilities**](/docs/api/capabilities) — see the table below.
6. Copy the token. It is shown exactly once.

Grant only what the assistant actually needs:

| You want the assistant to…                       | Grant                                     |
| ------------------------------------------------ | ----------------------------------------- |
| List apps, read views, and search                | `apps:read`                               |
| Read records and their field values              | `records:read`                            |
| Take stock of records shared with them           | `records:read`                            |
| Create records                                   | `apps:read` + `records:edit`              |
| Update records                                   | `records:read` + `records:edit` (+ `apps:read`) |
| Upload files                                     | `records:edit`                            |
| Read comments and replies on records             | `records.comments:read`                   |
| Post comments on records                         | `records.comments:edit`                   |
| Create apps (with their fields) and views        | `apps:edit`                               |
| Change existing apps, or add fields to them      | `apps:read` + `apps:edit`                 |
| Change an existing view                          | `apps:edit`                               |
| Look up other users in your organization         | `organization:read`                       |
| Read the workspaces you belong to                | `workspaces:read`                         |
| Create and rename workspaces                     | `workspaces:edit`                         |
| See automations, their setup and their run history, including credentials for connected systems | `automations:read` |
| Create, change, activate or pause automations    | `automations:edit`                        |
| Trigger an automation manually                   | `automations:run`                         |

:::note Writing usually needs reading too
[Editing does not include reading](/docs/api/capabilities#four-rules-worth-knowing) — they are separate capabilities. Most write tools read before they write, so a token with only an `:edit` capability fails on calls that look like they should work. Pair them, as the table does.

One pairing is **conditional** and therefore the easiest to get wrong: updating a record reaches for the app's schema only when you set a field that currently has no value. A token without `apps:read` will update many records successfully and then fail on one, for no reason the caller can see.

Search is the mirror image. It runs with **either** `apps:read` or `records:read` and [narrows its results rather than refusing](/docs/api/capabilities#four-rules-worth-knowing), so a token holding only `apps:read` searches successfully and silently returns no records at all. Grant both if the assistant should search across everything.
:::

:::note Automations need two more things the table cannot show
**Capabilities are not the whole gate.** `automations:run` really is the only capability `tape-run-automation` checks, but it is not enough to *use*: automation ids come only from `tape-get-automations`, and reading an automation before running it is `tape-fetch` — both need `automations:read`. Pair them.

On top of the capability, **every** automation route requires **admin rights on the workspace** the app is in. That is a role, so no combination of capabilities substitutes for it — and it never announces itself as a capability problem. `tape-get-automations` and `tape-get-runs` return an **empty page and no error**, so an empty list means "none you administrate", not "none exist". Everything else — including `tape-fetch` with `type: "automation"` or `type: "automation_run"` — answers **`404`**, indistinguishable from an automation that does not exist.
:::

A **read-only assistant** — one that can answer questions but never change anything — is a token holding `apps:read` and `records:read` and nothing else. Note that reading is not a single capability: that token cannot read comments, see automations, list workspaces or look up colleagues, and it will be **refused rather than answering partially**. Add `records.comments:read`, `automations:read`, `workspaces:read` and `organization:read` for whichever of those the assistant should reach. Capabilities are fixed at creation, so to change them, create a new token and revoke the old one.

:::caution `workspaces:edit` reaches further than the MCP tools do
The MCP server exposes no way to delete anything, and `workspaces:edit` is still not a delete-free grant — it covers **deleting a workspace, and with it every app and record inside**. The token carries that reach into any other client or script it is used from, whatever the tool list allows. Grant it only for a token that genuinely needs to create or rename workspaces, and keep it off your everyday assistant token.

Note also that creating a workspace requires a token whose content selection is **All**, and an organization role permitting workspace creation. A token restricted to selected workspaces and apps is refused outright — see [Content selection](/docs/api/personal-access-tokens#content-selection).
:::

### Automations run as their owner

:::caution `automations:run` steps outside the token's own reach
Every other capability narrows what the assistant can do to a subset of what **you** can do. This one does not. An automation runs with the rights of the person who owns it, so triggering one can change **and delete** data in apps your token never selected, send email in someone else's name, call external systems, and run custom code. Its actions are not visible from the tool's arguments — the automation decides.

Grant it only when the assistant genuinely needs to trigger automations, and read the automation before running it. Note that a **paused automation can still be run this way**: pausing stops its trigger from firing, it does not disable manual runs.

`automations:run` is also a capability in its own right: it neither implies nor requires `automations:read` or `automations:edit`, so a token can hold one and not the others.
:::

:::caution Treat the token like a password
It goes into a config file on your machine. Prefer the environment-variable or secret-prompt form shown for your client over pasting the literal token, never commit a config file containing one, and revoke the token if it may have leaked.
:::

## Claude Code

Client documentation: [Claude Code MCP](https://docs.anthropic.com/en/docs/claude-code/mcp).

```shell
claude mcp add --transport http tape https://mcp.tapeapp.com/mcp \
  --header "Authorization: Bearer tape_pat_0a1b2c3d..."
```

Add `--scope user` to make the server available in every project, or `--scope project` to write it into the repository's `.mcp.json` — in which case use an environment variable rather than a literal token, since that file is shared.

## Cursor

Client documentation: [Cursor MCP](https://cursor.com/docs/mcp).

1. Create `.cursor/mcp.json` in your project, or `~/.cursor/mcp.json` to use Tape in every project.
2. Paste the configuration below.
3. Set `TAPE_PAT` in your shell profile rather than inlining the token.
4. Save and **restart Cursor**. Tape then appears under **Customize** → **MCPs**.

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

## VS Code (GitHub Copilot)

Client documentation: [VS Code MCP servers](https://code.visualstudio.com/docs/copilot/customization/mcp-servers).

1. Create `.vscode/mcp.json` in the workspace and paste the configuration below. The `inputs` block makes VS Code prompt for the token once and store it securely, so no secret is written into the file.
2. Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run **MCP: List Servers**.
3. Start the Tape server. VS Code prompts for the token on first use.

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

## Claude Desktop

Custom connectors in Claude Desktop and on claude.ai normally connect by [signing in](/docs/mcp/connect). To use a token instead and keep it on your own machine, bridge to the endpoint with [`mcp-remote`](https://www.npmjs.com/package/mcp-remote), which runs locally over stdio and forwards to the HTTP endpoint with your header.

1. Add the configuration below to your `claude_desktop_config.json`.
2. **Restart Claude Desktop.**

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

## Windsurf

Client documentation: [Windsurf MCP](https://docs.windsurf.com/windsurf/cascade/mcp).

1. Open **Settings** → **Cascade** → **MCP servers** → **View raw config**, which opens `~/.codeium/windsurf/mcp_config.json`.
2. Add the configuration below.
3. Set `TAPE_PAT` in your shell profile.
4. Save and **restart Windsurf**.

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

Client documentation: [Codex MCP](https://developers.openai.com/codex/mcp).

Add the server to `~/.codex/config.toml` (or `.codex/config.toml` for a single project). Codex reads the token from an environment variable at connect time and sends it as `Authorization: Bearer`.

```toml title="~/.codex/config.toml"
[mcp_servers.tape]
url = "https://mcp.tapeapp.com/mcp"
bearer_token_env_var = "TAPE_PAT"
```

Export `TAPE_PAT` before starting Codex — if the variable is unset or empty, the server fails to start. On older Codex versions that only pick up stdio servers, add `experimental_use_rmcp_client = true` under a `[features]` block above the server entry, or upgrade.

## Claude API

Client documentation: [MCP connector](https://docs.claude.com/en/docs/agents-and-tools/mcp-connector).

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

## Troubleshooting a token connection

**The client cannot connect, reports `401`, or asks you to sign in to Tape even though you configured a token.**
The `Authorization` header is not reaching the server. Without it, Tape answers with `401` and invites the client to sign in. Do not complete that sign-in if you meant to use a token: it would connect without the token's limits. Check that the header name is exactly `Authorization`, that the value starts with `Bearer ` including the space, and — if you used an environment variable — that it is actually set in the environment the client was launched from. An unset variable leaves an empty `Bearer ` value, which counts as no token. GUI apps often do not inherit a shell profile.

**`no active user for the given API key`, or a signature error.**
The token is wrong, revoked, or was altered on the way. Send it **verbatim**, keeping the `tape_pat_` prefix — the prefix is part of the credential, and stripping or re-casing it breaks authentication.

**A tool returns `403` naming a missing scope.**
The token lacks a [capability](/docs/api/capabilities) that tool needs. Capabilities are fixed at creation: create a new token with the capability, switch the client over, and revoke the old one. See the table under [Before you start](#before-you-start).

**A tool returns `404` for a record, app or automation you know exists.**
The resource may be outside the token's workspace and app selection. A `404` here is deliberately indistinguishable from a resource that does not exist — check the selection before anything else. For other causes, see [Troubleshooting](/docs/mcp/connect#troubleshooting).

## Revoking a token

Revoke the token from the **Developer** section of your Preferences. It takes effect on the next request. Revoking one token never affects your other tokens or your signed-in connections.
