# Vocabulary and Code Conventions

## Responsibilities

| Term                     | Meaning                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| Application / Package    | Deployable composition root / reusable code with a cohesive owner.                             |
| Controller / Service     | Transport delegation / use case coordinating rules and persistence through injected contracts. |
| Contract                 | Structural port, input, query, selection or response; no runtime validation.                   |
| Port / Adapter           | Required capability / infrastructure implementation.                                           |
| DTO / Response           | Plain create/update input class / output contract.                                             |
| Mapper / Validation      | Wire serialization / runtime boundary checks, including Zod.                                   |
| Rule / Enum              | Domain invariant or behavior / finite alternatives.                                            |
| Constant                 | Fixed value; tunable limits and durations are configuration.                                   |
| Abstract class           | Shared lifecycle/invariants with domain-specific steps.                                        |
| Wire contract            | Exchanged names, values, numeric widths, optionality and field order.                          |
| Compatibility entrypoint | Existing boundary delegating during migration.                                                 |

Use one responsibility and behavioral class per implementation file; abstract only concrete shared behavior.

Realm means gameplay authority; Kingdom is the existing gameplay/persistence term, including `kingdomId`. Do not mechanically interchange them. Account/identity concerns access; character/player concerns progress. Commands name operations independently of wire casing; snapshots describe state, not input.

## Naming and contracts

- Types and enum members: `PascalCase`; functions, methods, parameters, locals and properties: `camelCase`. No mandatory `I` prefix or C# method casing.
- Fixed scalar constants: `UPPER_SNAKE_CASE`; collections/schemas: `camelCase`. Preserve serialized values and public names.
- Files: lowercase hyphenated domain names with established role suffixes. Preserve `Dto`, `Id`, `Uuid`, exports and protocol keys.
- Inputs: `Create<Resource>Dto` / `Update<Resource>Dto`; outputs: `<Resource>Response`; schemas: descriptive `camelCase` ending in `Schema`.
- DTO fields use `declare public readonly`, with `?` only for optional inputs. No decorators, constructors, inheritance, behavior, static schemas, definite-assignment/non-null assertions or weakened required fields.
- Queries, deletions, responses and snapshots use contracts. Validate at application/mapping boundaries; preserve mobile names/types, signed widths, optionality and wire order.
- Use enums for finite alternatives, including commands/protocol groups. Definitions describe archetypes, not saved instances.

## Presentation

- dprint owns `.ts`: four spaces, LF, double quotes, semicolons, 100 columns, multiline-only trailing commas; preserve property quoting and import/export order.
- `.ts` uses Allman declaration/control braces and mandatory control bodies. Put `else`, `catch`, `finally` and do-while's `while` on new lines. Arrow callbacks stay inline; objects keep expression layout; empty blocks may be `{}` after a line break. Keep `return` with its expression; parenthesize arrow-object returns.
- Use one blank line between imports/declarations, top-level declarations, methods, control blocks and meaningful stages; group related fields/locals. No decorative alignment or incidental sorting.
- Oxfmt owns other supported formats, including `.tsx`, `.cjs` and `.mjs`: two spaces and same-line braces. Preserve Markdown wrapping; disable import/export and package-key sorting. Oxlint checks JS/TS correctness; mandatory `curly` applies only to `.ts`. EditorConfig follows the same indentation split.

No inline, block, documentation or suppression comments in tracked code, configuration, scripts, SQL, templates or embedded examples. Preserve interpreter directives; express intent in prose and constraints through names/types.
