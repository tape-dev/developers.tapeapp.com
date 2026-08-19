---
id: overview
title: Tape MCP Server
sidebar_label: Overview
description: Connect an MCP client to Tape so an AI assistant can search, read and write your records, apps and views through the Tape API.
---

The **Model Context Protocol (MCP)** is an open standard that lets AI applications connect to external systems. The Tape MCP server is Tape's implementation of that standard: point an MCP client at it, give it a credential, and the assistant can work with your Tape data directly instead of you copying content back and forth.

| | |
| ------------------ | ---------------------------------------------------------------------- |
| **Endpoint**       | `https://mcp.tapeapp.com/mcp`                                          |
| **Transport**      | Streamable HTTP — JSON-RPC 2.0 over HTTP `POST`                        |
| **Authentication** | A [personal access token](/docs/api/personal-access-tokens) sent as `Authorization: Bearer` |
| **Tools**          | See [Supported tools](supported-tools)                                 |
| **Health check**   | `https://mcp.tapeapp.com/health`                                       |

## How it works

The MCP server is a thin adapter in front of the [developer API](/docs/api/introduction). It holds no data and no credentials of its own — every call is made with the token **you** configured in your client, and reaches Tape through the same public API any integration would use.

```
MCP client  ──HTTPS──▶  mcp.tapeapp.com  ──▶  Tape Developer API  ──▶  Tape
(Claude Code,            (tool calls)          (api.tapeapp.com)
 Cursor, VS Code, …)
```

Because the token is yours, the assistant can only ever reach what you can reach — narrowed further by the capabilities and content selection you granted the token.

## What you can do

With the server connected, an assistant can:

- **Search** across your apps and records, and follow references between them.
- **Read** records, field values, apps, views, workspaces and users — including the exact field structure of an app.
- **Create and update** records, post comments, and mint file upload tickets.
- **Build structure** — create and update workspaces, apps, fields and views.

Two things are deliberately absent. **Nothing on this surface deletes** — there is no tool for removing a record, app or workspace. And **nothing grants people access**: an assistant cannot add or remove workspace members, or change who can see a record. Both are decisions the surface leaves to a human, and neither is planned.

Workspace reads are also **membership-scoped**: they answer the workspaces *you* belong to, not an inventory of your organization's.

Exactly which tools are available, and what each one requires, is listed by your MCP client on connection — see [Supported tools](supported-tools).

## Resources

Alongside tools, MCP defines **resources** — reference documents a client reads directly, instead of spending a tool call on them. Tape serves its **field value specification** this way: the description of how each [field type](/docs/api/resource/field-value/overview) expects a value to be shaped when written.

| Resource | URI |
| ------------------------ | ------------------------------------------- |
| The whole specification  | `tape://docs/field-value-spec`              |
| One field type           | `tape://docs/field-value-spec/{field_type}` |

Both are JSON, and **neither needs a credential** — they read no Tape data and answer identically for every caller. Every *tool*, by contrast, requires a token.

:::info Read the specification before writing field values
Tape writes a record as a map of field values, and the accepted shape of each value depends on that field's `field_type`. Several unrecognised shapes **clear the field silently** at `200` rather than failing — which is why this is worth reading before a write rather than diagnosing after one.

Two things it deliberately does not tell you. It describes field **types in general**: it reads no Tape data and knows nothing about any particular app, so for an app's own fields, their required flags and option lists, fetch the app itself. And `field_type` is not `type` — a status field reads back as `category`, attachment and image both read back as `file`, and the single- and multi-value variants of one type accept different shapes.
:::

**If your client cannot read resources**, the fetch tool serves the same document under `type: "field_value_spec"`. Support across MCP clients is uneven, and a resource a client never surfaces is a specification the model never reads. Note that this fallback path *does* require a token, unlike the resource itself.

Resource URIs are stable public API: clients bookmark them, and a person who attached one to a conversation keeps a reference to that exact string, so changing a URI is treated as breaking in the same way renaming a tool is.

:::note More reference material is headed the same way
A record filter syntax and the automation definition schema are both slated for resources rather than tool arguments. Either would otherwise cost thousands of tokens of JSON Schema resident in every client's context on every request, whether or not the model uses it.
:::

## Authentication

Authentication uses the same credentials as the rest of the Tape API. Read [Authentication](/docs/api/authentication) for the general model, then [Personal access tokens](/docs/api/personal-access-tokens) for how to create one.

**Today a personal access token is required.** That is deliberate rather than a limitation: a PAT is the credential that can be scoped, and the MCP server passes it straight through to the API, so all three of its restrictions apply to everything the assistant does.

| Scoping | What it limits |
| ------- | -------------- |
| [**Capabilities**](/docs/api/capabilities) | What the token may do — for example `records:read` without `records:edit`, giving the assistant a read-only connection |
| **Workspaces** | Which workspaces the token may reach, including their apps |
| **Apps** | Which individual apps the token may reach |

Grant the narrowest token that does the job, and mint a separate one per client rather than reusing a token you already use elsewhere — see [Keeping tokens safe](/docs/api/personal-access-tokens#keeping-tokens-safe).

:::info OAuth 2.1 is coming
Support for the MCP OAuth 2.1 authorization flow is planned. Once it lands, clients will be able to connect by signing in to Tape rather than by pasting a token, and the scopes granted will be the same [capabilities](/docs/api/capabilities) a personal access token uses today. Until then, configure a token.
:::

**Every tool requires a token.** The [field value specification resources](#resources) do not, because they carry no per-caller data — so an assistant can read those before a credential is configured, but it cannot reach any of your data without one.

## Which clients can connect

Any client that can call a remote MCP server over streamable HTTP **and set a request header** works today, because that header is how the token is supplied. That covers Claude Code, Cursor, VS Code, Windsurf, Codex, the MCP Inspector, the `mcp-remote` bridge, and the Claude API's MCP connector. [Connect to Tape MCP](connect) has a configuration for each.

Clients that onboard a remote server purely through an OAuth sign-in flow — including Claude Desktop connectors and ChatGPT connectors — cannot connect directly yet, because that flow is what OAuth 2.1 will add. For Claude Desktop, the `mcp-remote` bridge is the workaround, and it is documented on the connect page.

## Good to know

- **The endpoint answers `POST` only.** It is stateless, mints no session id, and answers `GET` and `DELETE` with `405`. Opening the URL in a browser is expected to fail — that is not a sign the server is down; use the health endpoint instead.
- **Request bodies are limited to 128 KB.** Larger payloads are rejected before a tool runs.
- **Rate limits are shared with the rest of your credentials.** MCP tool calls draw on the same per-user budget as your other API traffic; connecting a client does not buy extra throughput. See [Request limits](/docs/api/request-limits).
- **Bytes never travel through MCP.** The file upload tool mints an upload ticket; the bytes themselves go to the regular [file endpoint](/docs/api/resource/file).
- **A tool call that fails is reported to the model, not hidden.** Where the failure is a Tape API error — a missing capability, a record outside the token's selection — the API's own message is passed through so the assistant can explain or adapt.

## Next steps

- [Connect to Tape MCP](connect) — configuration for every supported client
- [Supported tools](supported-tools) — tool reference
- [Personal access tokens](/docs/api/personal-access-tokens) — creating and scoping a credential
