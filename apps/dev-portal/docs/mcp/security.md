---
id: security
title: Security best practices
sidebar_label: Security best practices
description: How to connect an MCP client to Tape safely — choosing between signing in and a token, containing prompt injection, and disconnecting.
---

Use this page to connect an MCP client to Tape safely and to bound what an AI assistant can do as you.

## Connect only clients you trust

There is one official endpoint:

```
https://mcp.tapeapp.com/mcp
```

Anything else that claims to be Tape's MCP server is not. Connect only a client you trust with your data: it reaches everything its credential reaches. It may send what it reads to the model provider it runs on, or to other systems it's connected to.

When you sign in, the consent screen names the client that is asking. A client Tape hasn't verified is marked **Unverified**. Its name is self-asserted, so approve only a connection you started yourself.

Organization owners and admins can go further and allow **Approved MCP clients only**. See [For organization admins](/docs/mcp/connect#for-organization-admins).

The server itself holds *no credential that can read or change your data*. Every call that touches your data uses the credential your client sent, for that one request only: the access token from signing in, or a personal access token, never your browser session. The credential is the boundary, so choosing and scoping it is the main control you have.

## Choose how much the assistant can reach

**Signing in is broad by design.** A [signed-in connection](/docs/mcp/connect#how-signing-in-works) reaches every workspace and app you can reach. Clients ask for every capability the Tape MCP tools use, including editing apps and workspaces, and editing and running automations.

None of those capabilities manages organization or workspace members, shares records, manages webhooks, or sends email. Tape doesn't stop a client from asking for more, though. The consent screen lists what the client asked for, so read it before you approve.

The access token a client receives when you sign in also works at the Tape Developer API. The client, or the platform it runs on, can use every capability you approved directly, including the deletions the `:edit` capabilities allow. If you wouldn't trust a client with that, connect it with a narrower personal access token instead.

**A token can be narrower.** When the assistant should only read, or reach only some of your data, connect it with a [personal access token](/docs/mcp/connect-with-token). Both of a token's grants only subtract:

- **[Capabilities](/docs/api/capabilities):** a token with only `apps:read` and `records:read` gives you an assistant that answers questions and can't change anything. Start there, and add write capabilities only when you want the assistant to write.
- **Content access:** limit the token to the workspaces and apps the assistant needs, instead of all of them.

Beyond that:

- **Use one token per client.** You can't revoke a shared token without breaking something unrelated, and you can't tell which client did what.
- **Never commit a token.** Prefer the environment-variable or secret-prompt form for your client. See [Connect with a token](/docs/mcp/connect-with-token#before-you-start).

Whichever way you connect:

- **The assistant never exceeds your access, except through automations.** Its access is your own permissions, narrowed by its capabilities. The two automation write capabilities escape that, because an automation runs with its *owner's* rights: `automations:run` can start one that reaches apps outside a token's content access, and `automations:edit` can rewrite a live automation's actions and let its own trigger fire them. See the [`automations:run` callout](/docs/mcp/connect-with-token#automations-run-as-their-owner).
- **Tape attributes everything the assistant does to you.** Records the assistant creates or changes show you as the author in the activity stream. To tell an assistant's activity apart, connect it from a dedicated user account.

## Guard against prompt injection

Tape records hold content other people wrote: field values, comments, file names, imported data. When an assistant reads that content, it enters the model's context. Someone can craft text there to read as instructions instead of data.

:::caution An injected instruction acts with your credential
A successful injection doesn't need to break Tape's permissions to do damage. It acts entirely inside them. It could exfiltrate data the assistant can read by writing it somewhere the attacker can see, or change records the credential may change.
:::

To limit the damage:

- **Treat tool results as untrusted input**, not as instructions, the same way you treat any content from an external system.
- **Review write actions before you approve them.** If your client can gate write tools behind a confirmation, configure it that way. Every tool carries the standard MCP annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`), so a client can tell the ten read-only tools from the thirteen that write, and single out the six flagged destructive. `tape-run-automation` is one of those six, and the only tool flagged `openWorldHint` because its effects leave Tape: give it its own confirmation step.
- **Treat a file upload URL as a secret.** `tape-create-file-upload` returns an `upload_url` that needs no authentication and accepts one upload as you until it is used or expires. A client should not log it or write it into a record.
- **Prefer a read-only token** for anything exploratory. A token without write capabilities can't be turned against your data, whatever it reads. When you sign in, most clients ask for write capabilities too, and you can't narrow that when you approve; for read-only use, connect with a token, or in Gemini Enterprise enter the [read-only scopes](/docs/mcp/connect#gemini-enterprise).
- **Choose which apps the assistant can see.** Content access limits a credential; it doesn't isolate data. Treat it as a way to reduce the blast radius, not as a boundary around sensitive information. See [the caveat on content access](/docs/api/personal-access-tokens#content-selection).

**Writes reach beyond the record they touch.** By default, a record or comment written through MCP behaves like one written by hand: it notifies followers, fires webhooks, and triggers [automations](/docs/automations/introduction). An automation can send email and make outbound HTTP calls, so a single injected write can turn into egress out of Tape. `tape-create-records`, `tape-update-record` and `tape-create-comment` accept `silent`, `no_webhook` and `no_workflow` to suppress each of those; all three default to `false`, so the safe behavior is opt-in.

**The surface can also write automations.** Five dedicated tools list, create, change, and trigger them, and `tape-fetch` reads both a definition and a single run as a sixth way in. So an injected instruction doesn't have to hope a write fires a trigger: it can compose the trigger itself, or start an existing automation whose actions send email and call external systems.

Two properties bound this:

- A created automation starts *paused* and needs a deliberate second call to activate.
- Tape refuses to activate a broken definition.

Neither helps against an automation that is already live. Treat `automations:edit` and [`automations:run`](/docs/mcp/connect-with-token#automations-run-as-their-owner) as write capabilities of a heavier class than `records:edit`.

## What the surface cannot do

Some limits are structural. They hold whatever the credential allows:

- **Nothing on this surface deletes.** There is no tool to delete a record, comment, app, workspace, automation, field, or field option. Removing them is a human action in the Tape app. For fields, see [Change an app](/docs/mcp/supported-tools#change-an-app).
- **Nothing grants people access.** An assistant can't add or remove workspace members, or change who can see a record.
- **No arbitrary HTTP, and no file downloads.** There is no proxy tool an injected instruction could point at a URL of its choosing.

These limits are deliberate and aren't planned to change.

:::caution The limits bound the tools, not the credential
Most `:edit` capabilities go beyond these limits through any *other* client or script that uses the credential:

- `records:edit` permits deleting records.
- `apps:edit` permits deleting apps, fields, and views.
- `records.comments:edit` permits deleting your own comments.
- `automations:edit` permits deleting automations.
- `workspaces:edit` permits deleting a workspace and everything inside it.

So "the assistant can't delete anything" is true of the tool list and false of the credential. Grant accordingly.
:::

## Disconnect when in doubt

Disconnecting is the kill switch, and it's cheap. It takes effect on the *next request*. Nothing is cached, and nothing needs re-issuing.

- **A signed-in client:** disconnect it in Tape. See [Manage your connections](/docs/mcp/connect#manage-your-connections). Organization admins can disconnect a client for one member or for everyone.
- **A token:** select your profile picture, then select **Preferences** → **Developer**, and revoke the token there.
- Removing a client in Tape's settings ends every connection you have to that client. claude.ai, Claude Desktop, and Claude Code, for example, are all the one client **Claude**. Removing a client or revoking a token never affects your other clients, tokens or account.
- If a token may have leaked, revoke it first and investigate afterwards. Secret scanners recognize the `tape_pat_` prefix, so they can spot a leaked token automatically.
- Disconnect a client when you stop using it. Don't leave a live connection, or a token in a config file you've forgotten about.

## Next steps

- [Connect to Tape MCP](/docs/mcp/connect): sign in from your client and manage your connections.
- [Connect with a token](/docs/mcp/connect-with-token): set up a read-only or narrower connection.
- [Capabilities](/docs/api/capabilities): choose the fewest grants that work.
- [Personal access tokens](/docs/api/personal-access-tokens): how content access works.
- [Supported tools](/docs/mcp/supported-tools): check which tools write, and which are flagged destructive.
