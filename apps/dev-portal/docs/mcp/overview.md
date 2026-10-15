---
id: overview
title: Tape MCP Server
sidebar_label: Overview
description: Connect an MCP client to Tape so an AI assistant can search, read and write your records, apps and views through the Tape API.
---

The **Model Context Protocol (MCP)** is an open standard that lets AI applications connect to external systems. The Tape MCP server is Tape's implementation of that standard: point an MCP client at it, sign in with your Tape account, and the assistant can work with your Tape data directly instead of you copying content back and forth.

| | |
| ------------------ | ---------------------------------------------------------------------- |
| **Endpoint**       | `https://mcp.tapeapp.com/mcp`                                          |
| **Transport**      | Streamable HTTP — JSON-RPC 2.0 over HTTP `POST`                        |
| **Authentication** | [Sign in with your Tape account](/docs/mcp/connect) (OAuth 2.1), or a [personal access token](/docs/mcp/connect-with-token) |
| **Tools**          | See [Supported tools](/docs/mcp/supported-tools)                                 |
| **Health check**   | `https://mcp.tapeapp.com/health`                                       |

## How it works

The MCP server is a thin adapter in front of the [developer API](/docs/api/introduction). It holds no data and never acts with a credential of its own — every call that reads or changes your data is made with **your** credential, the one your client received when you signed in or the token you configured, and reaches Tape through the same public API any integration would use.

```
MCP client  ──HTTPS──▶  mcp.tapeapp.com  ──▶  Tape Developer API  ──▶  Tape
(Claude Code,            (tool calls)          (api.tapeapp.com)
 Cursor, VS Code, …)
```

Because the credential is yours, the assistant can only ever reach what you can reach — narrowed further by its capabilities and, for a token, its content selection. The **automation** capabilities are the exception: an automation executes with its owner's rights rather than your credential's, so [`automations:run`](/docs/mcp/connect-with-token#automations-run-as-their-owner) can start one that reaches further than the credential, and `automations:edit` can rewrite what a live automation does before its own trigger fires it.

## What you can do

With the server connected, an assistant can:

- **Search** across your apps and records, and follow references between them.
- **Take stock** of what reaches you outside the apps you can browse — the records shared with you individually, which no app-based listing returns.
- **Read** records, field values, apps, views, workspaces and users — including the exact field structure of an app.
- **Create and update** records, post comments, and mint file upload tickets.
- **Build structure** — create and update workspaces, apps, fields and views.
- **Work with automations** — read their definitions and run history, create and change them, and trigger one manually. Automations are the one part of this surface that reaches beyond the credential: an automation runs with the rights of the person who **owns** it, not with your credential's capabilities or a token's app selection, so triggering one can change data in apps a token never selected. See [`automations:run`](/docs/mcp/connect-with-token#automations-run-as-their-owner).

Two things are deliberately absent. **No tool deletes anything** — not a record, comment, app, workspace or automation, and since 2026-08-23 not a field or a field option either, which was the surface's last exception to the rule. And **nothing grants people access**: an assistant cannot add or remove workspace members, or change who can see a record. Both are decisions the surface leaves to a human, and neither is planned. Note that a write can still lose data without deleting: `tape-update-database` replaces a field's configuration wholesale, which is why it stays flagged destructive.

Workspace reads are also **membership-scoped**: they answer the workspaces *you* belong to, not an inventory of your organization's.

Exactly which tools are available, and what each one requires, is listed by your MCP client on connection — see [Supported tools](/docs/mcp/supported-tools).

## Resources

Alongside tools, MCP defines **resources** — reference documents a client reads directly, instead of spending a tool call on them. Tape serves its reference specifications this way: how each [field type](/docs/api/resource/field-value/overview) expects a value to be shaped when written, how to define a field, how to write a record filter, how a view is configured, and the grammar of an automation definition.

| Resource | URI |
| ---------------------------------------- | -------------------------------------------- |
| Field values, the whole specification    | `tape://docs/field-value-spec`                |
| Field values, one field type             | `tape://docs/field-value-spec/{field_type}`   |
| App fields, the whole specification      | `tape://docs/app-field-spec`                  |
| App fields, one field type               | `tape://docs/app-field-spec/{field_type}`     |
| Record filters, the whole specification  | `tape://docs/filter-spec`                     |
| Record filters, one field type           | `tape://docs/filter-spec/{field_type}`        |
| Views, the whole specification           | `tape://docs/view-spec`                       |
| Automations, the whole schema            | `tape://docs/automation-schema`               |
| Automations, one block type              | `tape://docs/automation-schema/{block_type}`  |

All of them are JSON, and **none needs a credential** — they read no Tape data and answer identically for every caller. Every *tool*, by contrast, requires a credential — a sign-in or a token.

:::info Read the specification before writing field values
Tape writes a record as a map of field values, and the accepted shape of each value depends on that field's `field_type`. Several unrecognised shapes **clear the field silently** at `200` rather than failing — which is why this is worth reading before a write rather than diagnosing after one.

Two things it deliberately does not tell you. It describes field **types in general**: it reads no Tape data and knows nothing about any particular app, so for an app's own fields, their required flags and option lists, fetch the app itself. And `field_type` is not `type` — a status field reads back as `category`, attachment and image both read back as `file`, and the single- and multi-value variants of one type accept different shapes.
:::

**If your client cannot read resources**, the fetch tool serves all five specifications, under `type: "field_value_spec"`, `"filter_spec"`, `"view_spec"`, `"app_field_spec"` and `"automation_schema"`. Support across MCP clients is uneven, and a resource a client never surfaces is a specification the model never reads. Note that this fallback path *does* require a credential, unlike the resources themselves, and that no arm takes a per-type narrowing — `"automation_schema"` therefore always serves the whole ~75 KB catalogue, where the resource can be narrowed to one block type.

Resource URIs are stable public API: clients bookmark them, and a person who attached one to a conversation keeps a reference to that exact string, so changing a URI is treated as breaking in the same way renaming a tool is.

## Authentication

There are two ways for a client to authenticate, and both act as you:

| | Sign in with Tape | Personal access token |
| --- | --- | --- |
| **Setup** | Add the URL to your client and approve the connection in your browser | Create a token in Tape and paste it into the client's configuration |
| **What it may do** | What your client asks for — usually every [capability](/docs/api/capabilities) the Tape MCP tools use | Only the capabilities you grant the token — read-only, for example |
| **What it may reach** | Every workspace and app you can reach | All, or only the workspaces and apps you select |
| **Works for** | Clients that support OAuth for remote MCP servers — Claude, Claude Code, ChatGPT, Cursor, VS Code, Codex, Gemini Enterprise and more | Any client that can send a header, and servers or scripts without a browser |
| **Who can use it** | Organization members, admins and owners — not guests. Your organization may limit which clients members can connect | Organization members, admins and owners — not guests |
| **Disconnect** | In Tape's settings, or by an organization admin | Revoke the token |

**Signing in is the default.** It needs no secret in a config file, and the connection renews itself in the background. Under the hood it is the [MCP authorization flow](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) — OAuth 2.1 with PKCE — so any client that implements it works; see [Build an MCP client](/docs/mcp/build-a-client).

**A token is the narrower choice.** Reach for one when the assistant should only read, should only reach some of your data, or runs where nobody can sign in. See [Connect with a token](/docs/mcp/connect-with-token).

**Every tool requires a credential.** The [specification resources](#resources) do not, because they carry no per-caller data — so an assistant can read those before it is connected, but it cannot reach any of your data without signing in or a token.

## Which clients can connect

Any client that can call a remote MCP server over Streamable HTTP works — signing in where the client supports OAuth, and with a token where it can set a request header. Clients that only run local servers connect through the `mcp-remote` bridge. [Connect to Tape MCP](/docs/mcp/connect) has the steps for each client.

## Good to know

- **The endpoint answers `POST` only.** It is stateless, mints no session id, and answers `GET` and `DELETE` with `405`. Opening the URL in a browser is expected to fail — that is not a sign the server is down; use the health endpoint instead.
- **Request bodies are limited to 128 KB.** Larger payloads are rejected before a tool runs.
- **Rate limits are shared with the rest of your credentials.** MCP tool calls draw on the same per-user budget as your other API traffic; connecting a client does not buy extra throughput. See [Request limits](/docs/api/request-limits).
- **Bytes never travel through MCP.** The file upload tool mints an upload ticket; the bytes themselves go to the regular [file endpoint](/docs/api/resource/file).
- **A tool call that fails is reported to the model, not hidden.** Where the failure is a Tape API error — a record outside a token's selection, or a capability a personal access token lacks — the API's own message is passed through so the assistant can explain or adapt. On a signed-in connection, a missing capability is not reported as an error: your client asks you to approve the extra access, then retries the call.

## Next steps

- [Connect to Tape MCP](/docs/mcp/connect) — sign in from Claude, Claude Code, ChatGPT, Cursor, VS Code and other clients
- [Connect with a token](/docs/mcp/connect-with-token) — for read-only or narrower access, and clients without a browser
- [Supported tools](/docs/mcp/supported-tools) — tool reference
- [Security best practices](/docs/mcp/security) — what a connection can reach, and how to bound it
- [Build an MCP client](/docs/mcp/build-a-client) — what a client needs to connect to Tape
