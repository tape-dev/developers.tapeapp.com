---
id: supported-tools
title: Supported tools
sidebar_label: Supported tools
description: Reference for the tools the Tape MCP server exposes — coming soon.
---

:::note This page is coming
A reference for the tools the Tape MCP server exposes — what each one does, its arguments and results, and the [capability](/docs/api/capabilities) it requires — is being written and will land here.
:::

## Until then

Your MCP client already lists them. Every tool the server exposes is advertised on connection, together with a description written for the model, so the tool list in your client is authoritative and always current. Ask your assistant what Tape tools it has, or open the client's MCP panel.

Two properties hold for the whole surface today:

- **Argument and result keys are `snake_case`**, matching the [developer API](/docs/api/introduction).
- **Tools map onto API resources.** A tool does what the corresponding [API resource](/docs/api/introduction) does, under the same [capability](/docs/api/capabilities) and the same workspace and app selection — so the resource pages describe the behaviour behind each tool until this page exists.

Renaming or removing a tool would be a breaking change for every connected client, so the surface is a stable contract even while this reference is unwritten.

The list gets **shorter** as well as longer. Reference material that is the same for every caller moves out of it and behind an MCP [resource](overview#resources): the field value specification made that move, and a record filter syntax and the automation definition schema are expected to follow. Each stays reachable through the fetch tool for clients that cannot read resources, so this is a relocation rather than a removal of capability.
