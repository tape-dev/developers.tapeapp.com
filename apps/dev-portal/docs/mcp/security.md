---
id: security
title: Security best practices
sidebar_label: Security best practices
description: How to connect an MCP client to Tape safely — scoping the token, containing prompt injection, and revoking access.
---

Connecting an MCP client gives an AI assistant the ability to act in Tape **as you**. This page covers what that means and how to bound it.

## Connect only clients you trust

There is one official endpoint:

```
https://mcp.tapeapp.com/mcp
```

Anything else claiming to be Tape's MCP server is not. Before connecting a client, be satisfied that you trust it with your data — a connected client can reach everything the token you give it can reach, and may transmit what it reads to the model provider it runs on, or to other systems it is connected to.

The server itself holds **no credential of its own**. Every call it makes to Tape uses the token you configured, for the duration of that one request, and identity is never inferred from your browser session — only from the token. So the boundary is the token, which is why scoping it is the main control you have.

## Scope the token narrowly

A [personal access token](/docs/api/personal-access-tokens) is the security boundary, and both of its grants only ever subtract:

- **[Capabilities](/docs/api/capabilities)** — a token with only `apps:read` and `records:read` gives you an assistant that can answer questions and cannot change anything. That is the right default; add write capabilities only when you actually want the assistant writing.
- **Content selection** — restrict the token to the workspaces and apps the assistant needs, rather than defaulting to all of them.

Beyond that:

- **One token per client.** A shared token cannot be revoked without breaking something unrelated, and you lose the ability to tell which client did what.
- **Never commit a token**, and prefer the environment-variable or secret-prompt form for your client — see [Connect to Tape MCP](/docs/mcp/connect#before-you-start).
- **A token can never exceed you — except through automations.** It is your own permissions, narrowed by its capabilities, narrowed again by its content selection. Both automation write capabilities escape that: an automation executes with its **owner's** rights rather than the token's, so `automations:run` can start one that reaches apps the token never selected, and `automations:edit` can rewrite a live automation's actions and let its own trigger fire them. See the [`automations:run` callout](/docs/mcp/connect#before-you-start).
- **Everything it does is attributed to you.** Records the assistant creates or changes show you as the author in the activity stream. If you want an assistant's activity to be distinguishable, mint its token from a dedicated user account.

## Guard against prompt injection

Tape records hold content other people wrote — field values, comments, file names, imported data. When an assistant reads that content, it enters the model's context, and text there can be crafted to read as instructions rather than data.

:::caution An injected instruction acts with your token
A successful injection does not need to break Tape's permissions to do damage — it acts entirely inside them. It could exfiltrate data the assistant can read by writing it somewhere the attacker can see, or change records the token is allowed to change.
:::

**Writes have reach beyond the record they touch.** By default a record or comment written through MCP behaves exactly like one written by hand: it notifies followers, fires webhooks, and triggers [automations](/docs/automations/introduction). An automation can send email and make outbound HTTP calls, so a single injected write can become egress out of Tape entirely. The write tools accept `silent`, `no_webhook` and `no_workflow` to suppress each of those, but all three default to `false` — the safe behaviour is opt-in, not the default.

**The surface can also write automations.** Five dedicated tools list, create, change and trigger them, and `tape-fetch` reads both a definition and a single run as a sixth way in. That widens what an injected instruction can reach for: instead of hoping a write happens to fire a trigger, it can compose the trigger itself, or start an existing automation whose actions send email and call external systems. Two properties bound this. A created automation is **always paused** and needs a deliberate second call to activate, and activation of a broken definition is refused. Neither helps against an automation that is already live, so treat `automations:edit` and [`automations:run`](/docs/mcp/connect#before-you-start) as write capabilities of a heavier class than `records:edit`.

What follows from that:

- **Treat tool results as untrusted input**, not as instructions — the same posture you would take toward any content from an external system.
- **Review write actions before approving them.** Clients that can gate write tools behind a confirmation are worth configuring that way. Every tool carries the standard MCP annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`), so a client can tell the eleven read-only tools from the thirteen that write, and single out the six flagged destructive. `tape-run-automation` is one of those six and also the only tool flagged `openWorldHint` — the one whose effects leave Tape — so it is worth its own confirmation step rather than being grouped with the others.
- **Prefer a read-only token** for anything exploratory. Most of the value of an assistant on Tape is in reading and reasoning, and a token without write capabilities cannot be turned against your data no matter what it reads.
- **Be deliberate about which apps the assistant can see.** Content selection limits a credential rather than isolating data, so treat it as blast-radius reduction, not as a boundary around sensitive information — see [the caveat on content selection](/docs/api/personal-access-tokens#content-selection).

## What the surface cannot do

Some limits are structural rather than a matter of scoping, and hold whatever the token allows:

- **Nothing on this surface deletes.** There is no tool for deleting a record, comment, app, workspace or automation, and since 2026-08-23 none for deleting a field or a field option either — `tape-update-database` was the last exception, and both arguments that carried it are gone, refused at the API as well as in the tool. Removing a field or an option is a human action in the Tape app. This bounds the tools, not the token: see the note on `:edit` capabilities in [the FAQ](/docs/mcp/connect#faq).
- **Nothing grants people access.** An assistant cannot add or remove workspace members, or change who can see a record.
- **No arbitrary HTTP, and no file downloads.** There is no proxy tool an injected instruction could point at a URL of its choosing.

These are deliberate and are not planned to change. They bound the **tools**, not the **token**, and most `:edit` capabilities exceed them through any *other* client or script the token is used from: `records:edit` permits deleting records, `apps:edit` permits deleting apps, fields and views, `records.comments:edit` permits deleting your own comments, `automations:edit` permits deleting automations, and `workspaces:edit` permits deleting a workspace and everything inside it. So "the assistant cannot delete anything" is true of the tool list and false of the credential. Grant accordingly.

## Revoke when in doubt

Revocation is the kill switch, and it is cheap:

- Revoke from the **Developer** section of your Preferences. It takes effect on the **next request** — nothing is cached and nothing needs re-issuing.
- Revoking one token never affects your other tokens, your user API key, or your account.
- If a token may have leaked, revoke first and investigate afterwards. The `tape_pat_` prefix is designed to be recognisable by secret scanners, so a leaked token can be spotted automatically.
- Rotate the token when you stop using a client, rather than leaving a live credential in a config file you have forgotten about.
