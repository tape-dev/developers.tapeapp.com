---
id: editors
title: Editors
sidebar_label: Editors
---

Tape has two calculation editors. Both use the same data model. Switching changes how you edit, not what gets stored.

- **Classic record**: every calculation field uses the classic editor.
- **New Record Experience**: new calculation fields use the new editor by default. Existing ones keep the classic editor, with a switcher in the top right.

Migration is always your choice. No field switches on its own.

For more details on what changed and how to migrate, see: [Community: New Calculation Editor — Announcement](https://community.tapeapp.com/t/calculation-field-now-in-the-new-record-experience-and-forms/2429)

### Classic vs. New Editor: Syntax at a glance

The new editor changes how you write field references and aggregations. The data model is the same, but the syntax differs. Use this as a translation table when you migrate scripts or read the examples below.

| What you write | Classic editor | New editor |
|---|---|---|
| Reference a field | `@First name` | `First_name` |
| Reference a field with a multi-word name | `@Hourly Rate` | `Hourly_Rate` |
| Trigger autocomplete | `@` | type the field name (or `@` to search) |
| Aggregate a related field | `@Sum of Amount` | `Invoices.Amount.sum` |
| All values across related records | `@All of Title` | `Tasks.Title.all` |
| Same, with empty positions | `@All of Title with nulls` | `Tasks.Title.allWithNull` |
| Average / min / max | `@Average of Amount` etc. | `Invoices.Amount.avg` / `.min` / `.max` |
| End of a Date Range field | not accessible | `Sprint.end` |
| Start of a Date Range field | `@Sprint` (start only) | `Sprint.start` |
| Tape built-ins | n/a | `Record_ID` (more coming) |

## New Editor

The new editor lives in the New Record Experience. It is more powerful than the classic editor: live preview, fullscreen mode, Find & Replace, multi-cursor editing, live field rename tracking, and direct JavaScript variable syntax. New features for calculation fields will be built here.

Once a field is on the new editor, use "Remove classic editor" to drop the switcher permanently.

Two key rules:

1. **No `@` in saved code.** `@` is just a search trigger; the saved field reference is the bare name.
2. **Spaces become underscores.** `First name` is written as `First_name`. Case is preserved 1:1.

The classic syntax (`@Sum of ...`, `@All of ...`, `@Field name`) does not exist in the new editor.

For more information and recipes, see:

→ [Cheat Sheet Part 1: Syntax & Field References](https://community.tapeapp.com/t/new-calculation-field-cheat-sheet-part-1-syntax-field-references/2430)

→ [Cheat Sheet Part 2: Functions & HTML Output](https://community.tapeapp.com/t/new-calculation-field-cheat-sheet-part-2-functions-html-output/2431/5)

→ [Cheat Sheet Part 3: Dates, Markdown & Recipes](https://community.tapeapp.com/t/new-calculation-field-cheat-sheet-part-3-dates-markdown-recipes/2432)

## Classic Editor

The classic editor runs in the classic record. It uses `@` as a prefix for all field references and aggregation keywords. A switcher in the top right of every classic editor field lets you migrate to the new editor at any time.

→ [Calculation Field Cheat Sheet](https://community.tapeapp.com/t/tape-calculation-field-cheat-sheet/670)
