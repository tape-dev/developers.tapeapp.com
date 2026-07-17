---
id: discovery
title: Discovery
sidebar_label: Discovery
---

import EndpointBadge from '@site/src/components/endpoint-badge/endpoint-badge.component'
import ContextCodeBlock from '@site/src/components/context-code-block/context-code-block.component';

:::caution Internal beta — not released yet
The **Automation** API is an internal beta and is **not released yet**. Its endpoints and payloads are not final and
may change or be withdrawn at any time without notice.
:::

The discovery endpoints publish the live catalog an automation is built from — the trigger types, action types and
filter operators, each with the `config` it accepts. **Build against these rather than hard-coding the vocabulary**:
new types appear here without a change to this API.

:::info No workspace scope
Unlike the rest of the resource, the discovery endpoints accept a valid API key of **either** kind (user or
automation) and carry no workspace scope — the catalog is the same for everyone. Trigger and action responses are
cacheable for an hour. Each costs `1x` base credits.
:::

## List trigger types

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation/meta/trigger" />

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/automation/meta/trigger -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "triggers": [
    {
      "type": "record_created",
      "label": "Record created",
      "description": "Runs when a record is created in the app.",
      "config_schema": {
        "type": "object",
        "properties": { "app_id": { "type": "integer" } },
        "required": ["app_id"],
        "additionalProperties": false
      }
    }
  ]
}`}
</ContextCodeBlock>

Each entry is `{ type, label, description?, config_schema }`. See the [trigger types](/docs/api/resource/automation/reference/triggers).

## List action types

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation/meta/action" />

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl #BASE_URL/v1/automation/meta/action -u #USER_API_KEY:`}
</ContextCodeBlock>

Each entry is `{ type, group, label, description?, config_schema }`, where `group` is `action` or `control_flow`. See
the [action types](/docs/api/resource/automation/reference/actions).

## List filter operators

<EndpointBadge method="GET" url="https://api.tapeapp.com/v1/automation/meta/filter?field_type={field_type}" />

Returns the operators available for one **field type** (they differ per type). `field_type` is required — an absent or
unknown value returns `400`.

<ContextCodeBlock language="shell" title='➡️      Request'>
{`curl "#BASE_URL/v1/automation/meta/filter?field_type=number" -u #USER_API_KEY:`}
</ContextCodeBlock>

<ContextCodeBlock language="json" title='⬅️      Response'>
{`{
  "field_type": "number",
  "operators": [
    { "operator": "is", "label": "Is", "value_arity": "single" },
    { "operator": "greater_than", "label": "Greater than", "value_arity": "single" },
    { "operator": "is_empty", "label": "Is empty", "value_arity": "none" }
  ]
}`}
</ContextCodeBlock>

Each entry is `{ operator, label, description?, value_arity }`. See [Filters](/docs/api/resource/automation/reference/filters)
for the full operator set and the tagged value union.
