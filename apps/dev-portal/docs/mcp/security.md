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
- **Never commit a token**, and prefer the environment-variable or secret-prompt form for your client — see [Connect to Tape MCP](connect#before-you-start).
- **A token can never exceed you.** It is your own permissions, narrowed by its capabilities, narrowed again by its content selection. It cannot reach data you cannot reach.
- **Everything it does is attributed to you.** Records the assistant creates or changes show you as the author in the activity stream. If you want an assistant's activity to be distinguishable, mint its token from a dedicated user account.

## Guard against prompt injection

Tape records hold content other people wrote — field values, comments, file names, imported data. When an assistant reads that content, it enters the model's context, and text there can be crafted to read as instructions rather than data.

:::caution An injected instruction acts with your token
A successful injection does not need to break Tape's permissions to do damage — it acts entirely inside them. It could exfiltrate data the assistant can read by writing it somewhere the attacker can see, or change records the token is allowed to change.
:::

**Writes have reach beyond the record they touch.** By default a record or comment written through MCP behaves exactly like one written by hand: it notifies followers, fires webhooks, and triggers [automations](/docs/automations/introduction). An automation can send email and make outbound HTTP calls, so a single injected write can become egress out of Tape entirely. The write tools accept `silent`, `no_webhook` and `no_workflow` to suppress each of those, but all three default to `false` — the safe behaviour is opt-in, not the default.

What follows from that:

- **Treat tool results as untrusted input**, not as instructions — the same posture you would take toward any content from an external system.
- **Review write actions before approving them.** Clients that can gate destructive or write tools behind a confirmation are worth configuring that way; the server advertises which tools are read-only and which are destructive so a client can act on it.
- **Prefer a read-only token** for anything exploratory. Most of the value of an assistant on Tape is in reading and reasoning, and a token without write capabilities cannot be turned against your data no matter what it reads.
- **Be deliberate about which apps the assistant can see.** Content selection limits a credential rather than isolating data, so treat it as blast-radius reduction, not as a boundary around sensitive information — see [the caveat on content selection](/docs/api/personal-access-tokens#content-selection).

## What the surface cannot do

Some limits are structural rather than a matter of scoping, and hold whatever the token allows:

- **Nothing on this surface deletes.** There is no tool for deleting a record, comment, app or workspace.
- **Nothing grants people access.** An assistant cannot add or remove workspace members, or change who can see a record.
- **No arbitrary HTTP, and no file downloads.** There is no proxy tool an injected instruction could point at a URL of its choosing.

These are deliberate and are not planned to change. They bound the worst case, but note that a **capability** can still exceed them — `workspaces:edit`, for example, permits deleting a workspace through any *other* client or script that token is used from, even though no MCP tool does. Grant it accordingly.

## Revoke when in doubt

Revocation is the kill switch, and it is cheap:

- Revoke from the **Developer** section of your user settings. It takes effect on the **next request** — nothing is cached and nothing needs re-issuing.
- Revoking one token never affects your other tokens, your user API key, or your account.
- If a token may have leaked, revoke first and investigate afterwards. The `tape_pat_` prefix is designed to be recognisable by secret scanners, so a leaked token can be spotted automatically.
- Rotate the token when you stop using a client, rather than leaving a live credential in a config file you have forgotten about.
