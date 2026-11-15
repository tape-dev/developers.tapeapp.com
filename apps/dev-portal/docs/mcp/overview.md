---
id: overview
title: Tape MCP server
sidebar_label: Overview
description: Connect an MCP client to Tape so an AI assistant can search, read and write your records, apps and views through the Tape API.
---

Use the Tape MCP server to let an AI assistant search, read, and change your Tape data.

The **Model Context Protocol (MCP)** is an open standard that connects AI applications to external systems. Point an MCP client at the Tape MCP server and sign in with your Tape account. The assistant then works with your Tape data directly, and you stop copying content back and forth.

| | |
| ------------------ | ---------------------------------------------------------------------- |
| **Endpoint**       | `https://mcp.tapeapp.com/mcp`                                          |
| **Transport**      | Streamable HTTP, JSON-RPC 2.0 over HTTP `POST`                         |
| **Authentication** | Sign in with your Tape account (OAuth 2.1), or a personal access token |
| **Tools**          | See [Supported tools](/docs/mcp/supported-tools)                                 |
| **Health check**   | `https://mcp.tapeapp.com/health`                                       |

:::tip Which way should I connect?
Using Claude, Claude Code, ChatGPT, Cursor, VS Code or another client that can sign in? [Sign in with your Tape account](/docs/mcp/connect), no token needed. Want read-only access, only some workspaces, or a client without a browser? [Connect with a personal access token](/docs/mcp/connect-with-token). [Authentication](#authentication) compares both.
:::

## What you can do

With the server connected, an assistant can:

- **Search** across your apps and records, and follow references between them.
- **Take stock** of what reaches you outside the apps you can browse: the records shared with you individually, which no app-based listing returns.
- **Read** records, field values, apps, views, workspaces, and users, including the exact field structure of an app.
- **Create and update** records, post comments, and mint file upload tickets.
- **Build structure:** create and update workspaces, apps, fields, and views.
- **Work with automations:** read their definitions and run history, create and change them, and trigger one manually, which runs it with its owner's rights.

Two things are absent by design, and neither is planned to change:

- **No tool deletes anything.** Not a record, comment, app, workspace, automation, field, or field option.
- **Nothing grants people access.** An assistant can't add or remove workspace members, or change who can see a record.

:::caution A write can still lose data
`tape-update-database` replaces a field's configuration as a whole. That's why it stays flagged destructive, even though it deletes nothing.
:::

Workspace reads are *membership-scoped*. They return the workspaces *you* belong to, not an inventory of your organization's workspaces.

Your MCP client lists every tool, and what each one requires, when it connects. To see which ones your credential can use, [check the connection](/docs/mcp/connect-with-token#check-the-result).

## How it works

The MCP server is a thin adapter in front of the public [developer API](/docs/api/introduction). It holds no data and has no credential of its own. Every call that reads or changes your data uses *your* credential: the one your client received when you signed in, or the token you configured.

```
MCP client  ──HTTPS──▶  mcp.tapeapp.com  ──▶  Tape Developer API  ──▶  Tape
(Claude Code,            (tool calls)          (api.tapeapp.com)
 Cursor, VS Code, …)
```

The credential is yours, so the assistant reaches only what you can reach. Its capabilities narrow that further, and for a token, so does its content access.

The *automation* capabilities are the exception. An automation runs with its owner's rights, not with your credential's. So [`automations:run`](/docs/mcp/connect-with-token#automations-run-as-their-owner) can start one that reaches further than the credential, and `automations:edit` can rewrite what a live automation does before its own trigger fires it.

## Resources

Besides tools, MCP defines *resources*: reference documents a client reads directly, without spending a tool call on them. Tape serves its reference specifications this way:

- how each [field type](/docs/api/resource/field-value/overview) expects a value to be shaped when you write it
- how to define a field
- how to write a record filter
- how a view is configured
- the grammar of an automation definition

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

All resources are JSON, and *none needs a credential*. They read no Tape data and return the same answer to every caller, so an assistant can read them before it connects. Every *tool*, by contrast, needs a credential: a sign-in or a token.

:::info Writing field values?
The accepted shape of each value depends on the field's `field_type`, and several unrecognized shapes *clear the field silently* at `200`. Read the specification before a write.

- The specification describes field *types in general*. For an app's own fields, their required flags and option lists, fetch the app itself.
- `field_type` is not `type`. A status field reads back as `category`, attachment and image both read back as `file`, and the single- and multi-value variants of one type accept different shapes.
:::

:::note Your client can't read resources?
Use `tape-fetch`. It serves all five specifications under `type: "field_value_spec"`, `"filter_spec"`, `"view_spec"`, `"app_field_spec"` and `"automation_schema"`.

Unlike the resources, it needs a credential and takes no per-type narrowing, so `"automation_schema"` serves the whole ~75 KB catalog.
:::

Resource URIs are stable public API. Clients bookmark them, and a person who attached one to a conversation keeps a reference to that exact string. Tape treats a changed URI as a breaking change, the same as a renamed tool.

## Authentication

A client authenticates in one of two ways, and both act as you:

| | Sign in with Tape | Personal access token |
| --- | --- | --- |
| **Setup** | Add the URL to your client and approve the connection in your browser | Create a token in Tape and paste it into the client's configuration |
| **What it may do** | What your client asks for, usually every [capability](/docs/api/capabilities) the Tape MCP tools use | Only the capabilities you grant the token, for example read-only |
| **What it may reach** | Every workspace and app you can reach | All, or only the workspaces and apps you select |
| **Works for** | Clients that support OAuth for remote MCP servers: Claude, Claude Code, ChatGPT, Cursor, VS Code, Codex, Gemini Enterprise and more | Any client that can send a header, and servers or scripts without a browser |
| **Who can use it** | Organization members, admins and owners, not guests. Your organization may limit which clients members can connect | Organization members, admins and owners, not guests |
| **Disconnect** | In Tape's settings, or by an organization admin | Revoke the token |

**Signing in is the default.** It needs no secret in a config file, and the connection renews itself in the background. Under the hood it's the [MCP authorization flow](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization), OAuth 2.1 with PKCE, so any client that implements it works. See [Build an MCP client](/docs/mcp/build-a-client).

**A token is the narrower choice.** Use one when the assistant should only read, should reach only some of your data, or runs where nobody can sign in.

## Which clients can connect

Any client that can call a remote MCP server over Streamable HTTP works: it signs in where it supports OAuth, or uses a token where it can set a request header. Clients that only run local servers connect through the [`mcp-remote`](/docs/mcp/connect#other-mcp-clients) bridge.

## Good to know

- **The endpoint answers `POST` only.** It's stateless, mints no session ID, and answers `GET` and `DELETE` with `405`. So opening the URL in a browser fails by design; to check the server, use the health endpoint.
- **Request bodies are limited to 128 KB.** The server rejects larger payloads before a tool runs.
- **Rate limits are shared with the rest of your credentials.** MCP tool calls draw on the same per-user budget as your other API traffic. Connecting a client doesn't buy extra throughput. See [Request limits](/docs/api/request-limits).
- **Bytes never travel through MCP.** `tape-create-file-upload` mints an upload ticket. The bytes go to the regular [file endpoint](/docs/api/resource/file).
- **A failed tool call reaches the model.** For a Tape API error, such as a record outside a token's content access or a capability a personal access token lacks, the server passes the API's own message through. The assistant can then explain or adapt. On a signed-in connection, a missing capability is not an error: your client asks you to approve the extra access, then retries the call.

## Next steps

- [Connect to Tape MCP](/docs/mcp/connect): sign in from Claude, Claude Code, ChatGPT, Cursor, VS Code and other clients.
- [Connect with a token](/docs/mcp/connect-with-token): get read-only or narrower access, also for clients without a browser.
- [Supported tools](/docs/mcp/supported-tools): look up what each tool does and which capability it needs.
- [Security best practices](/docs/mcp/security): what a connection can reach, and how to bound it.
- [Build an MCP client](/docs/mcp/build-a-client): what a client needs to connect to Tape.
- In the Help Center: [Tape MCP](https://help.tapeapp.com/en/articles/18449284-tape-mcp)
