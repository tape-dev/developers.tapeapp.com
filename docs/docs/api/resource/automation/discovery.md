# Discovery

> Discover the live Automation catalog — trigger types, action types, and filter operators, each with the config schema to build against.

Use these endpoints to read the live catalog of trigger types, action types and filter operators that automations are built from.

Each entry in the catalog comes with the `config` it accepts. Build against it instead of hard-coding the list: new types show up here without an API change.

**General behavior**

-   The catalog is the same for everyone. The endpoints have no workspace scope.
-   Each successful `200` response can be cached for an hour (`Cache-Control: public, max-age=3600`).
-   Each request costs `1x` base credits.

> Which capability do I need?
> 
> All three endpoints need **Read automations** (`automations:read`). They work with a [personal access token](https://developers.tapeapp.com/docs/api/personal-access-tokens), an [OAuth access token](https://developers.tapeapp.com/docs/api/oauth/overview), a [user API key](https://developers.tapeapp.com/docs/api/authentication#user-api-key) or an automation API key. See [Capabilities](https://developers.tapeapp.com/docs/api/capabilities).

## List trigger types

Use this endpoint to list every public trigger type with its config schema.

`GET https://api.tapeapp.com/v1/automation/meta/trigger`

*Request*

```shell
curl https://api.tapeapp.com/v1/automation/meta/trigger \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "triggers": [
    {
      "type": "record_created",
      "label": "Record created",
      "description": "Triggers when a record is created in the app.",
      "config_schema": {
        "type": "object",
        "properties": {},
        "additionalProperties": false
      }
    }
  ]
}
```

Each entry is `{ type, label, description?, config_schema }`. See the [trigger types](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers).

A `config_schema` property with `"readOnly": true` marks a field Tape sets itself, for example the `webhook_url` of a `webhook_received` trigger. Tape returns it when you read a config and rejects it on write, so remove it before you send one.

**Requirements:** `automations:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

## List action types

Use this endpoint to list every public action type with its group and config schema.

`GET https://api.tapeapp.com/v1/automation/meta/action`

*Request*

```shell
curl https://api.tapeapp.com/v1/automation/meta/action \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

The response is `200` with `{ "actions": [ … ] }`.

Each entry is `{ type, group, label, description?, config_schema }`. `group` is `action` or `control_flow`. See the [action types](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions).

**Requirements:** `automations:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

## List filter operators

Use this endpoint to list the filter operators for one *field type*. The operators differ per type.

`GET https://api.tapeapp.com/v1/automation/meta/filter?field_type={field_type}`

*Request*

```shell
curl "https://api.tapeapp.com/v1/automation/meta/filter?field_type=number" \
  -H "Authorization: Bearer $TAPE_TOKEN"
```

*Response*

```json
{
  "field_type": "number",
  "operators": [
    { "operator": "is", "label": "Is", "value_arity": "single" },
    { "operator": "greater_than", "label": "Greater than", "value_arity": "single" },
    { "operator": "is_empty", "label": "Is empty", "value_arity": "none" }
  ]
}
```

`field_type` is required, for example `single_text` or `number`. A missing or unknown value returns `400`. [Retrieve a single app](https://developers.tapeapp.com/docs/api/resource/app#retrieve-a-single-app) returns the `field_type` of each field.

Each entry is `{ operator, label, description?, value_arity }`. See [Filters](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters) for the full set of operators and the tagged value union.

**Requirements:** `automations:read`. Works with a personal access token, an OAuth access token, a user API key or an automation API key.

## Errors

-   [List filter operators](#list-filter-operators) without a `field_type`, or with an unknown one, returns `400`.
-   A request without a credential returns `401`.
-   A token without `automations:read` returns `403`.

See [Errors & broken reasons](https://developers.tapeapp.com/docs/api/resource/automation/reference/errors) for the Automation API and [Errors](https://developers.tapeapp.com/docs/api/errors) for all error codes.

## Next steps

[

Triggers

every trigger and what it hands to the run.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/triggers)[

Actions

every action, grouped by what it does.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/actions)[

Filters

the condition tree and all operators.

](https://developers.tapeapp.com/docs/api/resource/automation/reference/filters)[

Manage

create an automation from the catalog.

](https://developers.tapeapp.com/docs/api/resource/automation/manage)
