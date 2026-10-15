---
id: build-a-client
title: Build an MCP Client for Tape
sidebar_label: Build an MCP Client
description: What an MCP client needs to connect to Tape — Streamable HTTP and OAuth 2.1 with PKCE — with links to the details.
---

This page is for developers building an MCP client, or adding Tape support to one. Tape follows the [MCP authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization), so a client that implements it connects without anything Tape-specific.

## Requirements at a glance

| Requirement          | What Tape uses                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Endpoint             | `https://mcp.tapeapp.com/mcp`                                                                                                                                             |
| Transport            | Streamable HTTP — JSON-RPC 2.0 over `POST`. There is no SSE endpoint                                                                                                      |
| Authorization        | [OAuth 2.1](/docs/api/oauth/overview) authorization code flow with **PKCE** (`S256`) — the only supported flow                                                            |
| Discovery            | Protected resource metadata (RFC 9728), then authorization server metadata (RFC 8414)                                                                                    |
| Client registration  | A [client ID metadata document](/docs/api/oauth/clients#client-id-metadata-document) or [dynamic client registration](/docs/api/oauth/clients#dynamic-client-registration) (RFC 7591) |
| Credential           | A bearer access token on every request, renewed with a refresh token                                                                                                      |

## How a client connects

1. **Discover.** Without a token, Tape answers `401` and points to its protected resource metadata, which names Tape's authorization server and the scopes the Tape MCP tools use.
2. **Register** as a public client — see [Register a client yourself](/docs/api/oauth/clients#register-a-client-yourself).
3. **Authorize** with PKCE, requesting the scopes from the protected resource metadata. The user signs in to Tape and approves — see [the authorization flow](/docs/api/oauth/authorization-flow).
4. **Call tools** with the access token, and [refresh](/docs/api/oauth/authorization-flow#refreshing-an-access-token) it when it expires.
5. **Step up** when a tool needs a scope the connection lacks: Tape answers `403` naming the scopes to request — see [Asking for more scopes](/docs/api/oauth/authorization-flow#asking-for-more-scopes).

The scopes are described in [Capabilities and Scopes](/docs/api/capabilities). The same access token also works at the [Developer API](/docs/api/introduction). Clients that cannot run OAuth can send a [personal access token](/docs/mcp/connect-with-token) as the bearer token instead.

## Related

- [OAuth overview](/docs/api/oauth/overview) — endpoints, supported flows and token formats
- [Register a client](/docs/api/oauth/clients) — metadata documents, dynamic registration and redirect URIs
- [The authorization flow](/docs/api/oauth/authorization-flow) — every request, refreshing, step-up and errors
- [Connect to Tape MCP](/docs/mcp/connect) — what signing in looks like for a user, and troubleshooting
- [Supported tools](/docs/mcp/supported-tools) — what each tool does and which scope it needs
