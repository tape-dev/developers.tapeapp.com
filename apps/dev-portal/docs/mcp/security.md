---
id: security
title: Security best practices
sidebar_label: Security best practices
description: How to connect an MCP client to Tape safely — choosing between signing in and a token, containing prompt injection, and disconnecting.
---

Connecting an MCP client gives an AI assistant the ability to act in Tape **as you**. This page covers what that means and how to bound it.

## Connect only clients you trust

There is one official endpoint:

```
https://mcp.tapeapp.com/mcp
```

Anything else claiming to be Tape's MCP server is not. Before connecting a client, be satisfied that you trust it with your data — a connected client can reach everything its credential can reach, and may transmit what it reads to the model provider it runs on, or to other systems it is connected to.

When you sign in, the consent screen names the client that is asking. A client Tape has not verified is marked **Unverified**; its name is self-asserted, so make sure you started the connection yourself before you approve.

The server itself holds **no credential that can read or change your data**. Every call that touches your data uses the credential your client sent — the access token from signing in, or a personal access token — for the duration of that one request, and identity is never inferred from your browser session. So the boundary is the credential, which is why choosing and scoping it is the main control you have.

## Choose how much the assistant can reach

**Signing in is broad by design.** A [signed-in connection](/docs/mcp/connect#how-signing-in-works) reaches every workspace and app you can, and clients ask for every capability the Tape MCP tools use — including editing apps and workspaces, and editing and running automations. That is what makes one sign-in enough for every tool. None of those capabilities manages organization or workspace members, shares records, manages webhooks or sends email. Tape does not stop a client from asking for more, though: the consent screen lists what the client asked for, so read it before you approve.

The access token a client receives when you sign in is also valid at the Tape Developer API, so the client — or the platform it runs on — can use every capability you approved directly, including the deletions that the `:edit` capabilities allow. If you would not trust a client with that, connect it with a narrower personal access token instead.

**A token can be narrower.** When the assistant should only read, or only reach some of your data, connect it with a [personal access token](/docs/mcp/connect-with-token) instead. Both of a token's grants only ever subtract:

- **[Capabilities](/docs/api/capabilities)** — a token with only `apps:read` and `records:read` gives you an assistant that can answer questions and cannot change anything. That is the right default; add write capabilities only when you actually want the assistant writing.
- **Content selection** — restrict the token to the workspaces and apps the assistant needs, rather than defaulting to all of them.

Beyond that:

- **One token per client.** A shared token cannot be revoked without breaking something unrelated, and you lose the ability to tell which client did what.
- **Never commit a token**, and prefer the environment-variable or secret-prompt form for your client — see [Connect with a token](/docs/mcp/connect-with-token#before-you-start).

Whichever way you connect:

- **The assistant can never exceed you — except through automations.** Its access is your own permissions, narrowed by its capabilities. Both automation write capabilities escape that: an automation executes with its **owner's** rights rather than the credential's, so `automations:run` can start one that reaches apps a token never selected, and `automations:edit` can rewrite a live automation's actions and let its own trigger fire them. See the [`automations:run` callout](/docs/mcp/connect-with-token#automations-run-as-their-owner).
- **Everything it does is attributed to you.** Records the assistant creates or changes show you as the author in the activity stream. If you want an assistant's activity to be distinguishable, connect it from a dedicated user account.

## Guard against prompt injection

Tape records hold content other people wrote — field values, comments, file names, imported data. When an assistant reads that content, it enters the model's context, and text there can be crafted to read as instructions rather than data.

:::caution An injected instruction acts with your credential
A successful injection does not need to break Tape's permissions to do damage — it acts entirely inside them. It could exfiltrate data the assistant can read by writing it somewhere the attacker can see, or change records the credential is allowed to change.
:::

**Writes have reach beyond the record they touch.** By default a record or comment written through MCP behaves exactly like one written by hand: it notifies followers, fires webhooks, and triggers [automations](/docs/automations/introduction). An automation can send email and make outbound HTTP calls, so a single injected write can become egress out of Tape entirely. The write tools accept `silent`, `no_webhook` and `no_workflow` to suppress each of those, but all three default to `false` — the safe behaviour is opt-in, not the default.

**The surface can also write automations.** Five dedicated tools list, create, change and trigger them, and `tape-fetch` reads both a definition and a single run as a sixth way in. That widens what an injected instruction can reach for: instead of hoping a write happens to fire a trigger, it can compose the trigger itself, or start an existing automation whose actions send email and call external systems. Two properties bound this. A created automation is **always paused** and needs a deliberate second call to activate, and activation of a broken definition is refused. Neither helps against an automation that is already live, so treat `automations:edit` and [`automations:run`](/docs/mcp/connect-with-token#automations-run-as-their-owner) as write capabilities of a heavier class than `records:edit`.

What follows from that:

- **Treat tool results as untrusted input**, not as instructions — the same posture you would take toward any content from an external system.
- **Review write actions before approving them.** Clients that can gate write tools behind a confirmation are worth configuring that way. Every tool carries the standard MCP annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`), so a client can tell the ten read-only tools from the thirteen that write, and single out the six flagged destructive. `tape-run-automation` is one of those six and also the only tool flagged `openWorldHint` — the one whose effects leave Tape — so it is worth its own confirmation step rather than being grouped with the others.
- **Prefer a read-only token** for anything exploratory. Most of the value of an assistant on Tape is in reading and reasoning, and a token without write capabilities cannot be turned against your data no matter what it reads. Most clients ask for every capability the Tape MCP tools use, write capabilities included, and you cannot narrow that when you approve — so for read-only use, [connect with a token](/docs/mcp/connect-with-token), or in Gemini Enterprise enter the [read-only scopes](/docs/mcp/connect#gemini-enterprise).
- **Be deliberate about which apps the assistant can see.** Content selection limits a credential rather than isolating data, so treat it as blast-radius reduction, not as a boundary around sensitive information — see [the caveat on content selection](/docs/api/personal-access-tokens#content-selection).

## What the surface cannot do

Some limits are structural rather than a matter of scoping, and hold whatever the credential allows:

- **Nothing on this surface deletes.** There is no tool for deleting a record, comment, app, workspace or automation, and since 2026-08-23 none for deleting a field or a field option either — `tape-update-database` was the last exception, and both arguments that carried it are gone, refused at the API as well as in the tool. Removing a field or an option is a human action in the Tape app. This bounds the tools, not the credential: see the note on `:edit` capabilities in [the FAQ](/docs/mcp/connect#faq).
- **Nothing grants people access.** An assistant cannot add or remove workspace members, or change who can see a record.
- **No arbitrary HTTP, and no file downloads.** There is no proxy tool an injected instruction could point at a URL of its choosing.

These are deliberate and are not planned to change. They bound the **tools**, not the **credential**, and most `:edit` capabilities exceed them through any *other* client or script the credential is used from: `records:edit` permits deleting records, `apps:edit` permits deleting apps, fields and views, `records.comments:edit` permits deleting your own comments, `automations:edit` permits deleting automations, and `workspaces:edit` permits deleting a workspace and everything inside it. So "the assistant cannot delete anything" is true of the tool list and false of the credential. Grant accordingly.

## Disconnect when in doubt

Disconnecting is the kill switch, and it is cheap. It takes effect on the **next request** — nothing is cached and nothing needs re-issuing.

- **A signed-in client:** disconnect it in Tape — see [Manage your connections](/docs/mcp/connect#manage-your-connections). Organization admins can disconnect a client for one member or for everyone.
- **A token:** revoke it from the **Developer** section of your Preferences.
- Disconnecting an app in Tape's settings removes every connection you have to that app — claude.ai, Claude Desktop and Claude Code, for example, are all the one app **Claude**. It never affects your connections to other apps, your tokens, or your account. Revoking one token never affects your other tokens or your connections.
- If a token may have leaked, revoke first and investigate afterwards. The `tape_pat_` prefix is designed to be recognisable by secret scanners, so a leaked token can be spotted automatically.
- Disconnect a client when you stop using it, rather than leaving a live connection or a token in a config file you have forgotten about.
