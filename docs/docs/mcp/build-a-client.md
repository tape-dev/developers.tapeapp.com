# Build an MCP client for Tape

> What an MCP client needs to connect to Tape — Streamable HTTP and OAuth 2.1 with PKCE — with links to the details.

Use this page to build an MCP client that connects to Tape, or to add Tape support to an existing client.

Tape follows the [MCP authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization). A client that implements it connects without anything specific to Tape.

## Requirements at a glance

| Requirement | What Tape uses |
| --- | --- |
| Endpoint | `https://mcp.tapeapp.com/mcp` |
| Transport | Streamable HTTP: JSON-RPC 2.0 over `POST`. There is no SSE endpoint |
| Authorization | [OAuth 2.1](https://developers.tapeapp.com/docs/api/oauth/overview) authorization code flow with PKCE (`S256`), the only supported flow |
| Discovery | Protected resource metadata (RFC 9728), then authorization server metadata (RFC 8414) |
| Client registration | A [client ID metadata document](https://developers.tapeapp.com/docs/api/oauth/clients#client-id-metadata-document) or [dynamic client registration](https://developers.tapeapp.com/docs/api/oauth/clients#dynamic-client-registration) (RFC 7591) |
| Credential | A bearer access token on every request, renewed with a refresh token |

## How a client connects

1.  **Discover.** Without a token, Tape answers `initialize` and every tool call with `401` and points to its protected resource metadata. Only `tools/list`, `resources/*` and `ping` work without a token. The metadata names Tape's authorization server and the scopes the Tape MCP tools use.
2.  **Register** as a public client. See [Register a client yourself](https://developers.tapeapp.com/docs/api/oauth/clients#register-a-client-yourself).
3.  **Authorize** with PKCE and request the scopes from the protected resource metadata. The user signs in to Tape and approves. See [the authorization flow](https://developers.tapeapp.com/docs/api/oauth/authorization-flow).
4.  **Call tools** with the access token, and [refresh](https://developers.tapeapp.com/docs/api/oauth/authorization-flow#refreshing-an-access-token) it when it expires.
5.  **Step up** when a tool needs a scope the connection lacks. Tape answers `403` and names the scopes to request. See [Asking for more scopes](https://developers.tapeapp.com/docs/api/oauth/authorization-flow#asking-for-more-scopes).

[Capabilities](https://developers.tapeapp.com/docs/api/capabilities) describes each scope. The same access token also works at the [Developer API](https://developers.tapeapp.com/docs/api/introduction).

> Can't run OAuth in your client?
> 
> Send a [personal access token](https://developers.tapeapp.com/docs/mcp/connect-with-token) as the bearer token instead.

## Next steps

[

OAuth overview

the endpoints, supported flows and token formats.

](https://developers.tapeapp.com/docs/api/oauth/overview)[

Register a client

set up metadata documents, dynamic registration and redirect URIs.

](https://developers.tapeapp.com/docs/api/oauth/clients)[

Authorization flow

every request, refreshing, step-up and errors.

](https://developers.tapeapp.com/docs/api/oauth/authorization-flow)[

Connect to Tape MCP

what signing in looks like for a user, and how to troubleshoot it.

](https://developers.tapeapp.com/docs/mcp/connect)[

Supported tools

what each tool does and which capability it needs.

](https://developers.tapeapp.com/docs/mcp/supported-tools)
