# Vocabulary and Code Conventions

## Responsibilities

| Term                     | Meaning                                                                         |
| ------------------------ | ------------------------------------------------------------------------------- |
| Application              | Deployable composition root wiring configuration and collaborators.             |
| Package                  | Reusable code with a cohesive owner.                                            |
| Controller               | Transport operations delegated to injected Services.                            |
| Service                  | Use case coordinating rules/persistence through constructor-injected contracts. |
| Contract                 | Structural port/input/query/selection/response, without runtime validation.     |
| Port / Adapter           | Required capability / transport or infrastructure implementation.               |
| DTO / Response           | Plain create/update input class / output contract.                              |
| Mapper / Validation      | Wire serialization / runtime boundary checks, including Zod.                    |
| Rule / Enum              | Domain invariant or behavior / finite named alternatives.                       |
| Constant                 | Fixed value; tunable limits/durations are configuration.                        |
| Abstract class           | Shared workflow/lifecycle/invariants with concrete domain-specific steps.       |
| Wire contract            | Exchanged names/values, numeric widths, optionality and field order.            |
| Compatibility entrypoint | Existing import/call boundary delegating during migration.                      |

One responsibility and one behavioral class per implementation file. Create abstractions only for concrete shared behavior.

## Domain terms

- Realm is the authoritative gameplay scope. Kingdom is the existing gameplay/persistence term, including `kingdomId`; do not mechanically interchange them.
- Account/identity identifies access; character/player identifies gameplay progress. Preserve distinct identifiers.
- Command names an application/protocol operation; wire strings are independent of internal casing. Snapshot is point-in-time state, not an input DTO.

## Naming and contracts

- Classes/interfaces/type aliases/enums and enum members: `PascalCase`; functions/methods/parameters/locals/properties: `camelCase`. No mandatory `I` prefix or C#-style methods/properties.
- Fixed scalar constants: `UPPER_SNAKE_CASE`; collections/schemas: `camelCase`. `const` alone does not imply uppercase. Preserve serialized values, such as `ResourceType.Wood` → `"wood"`.
- Files: lowercase hyphenated domain names, preserving established role suffixes (`chat-config.mapper.ts`), `Dto`, `Id`, `Uuid`, public exports and protocol keys.
- Inputs: `Create<Resource>Dto` / `Update<Resource>Dto`; output interfaces: `<Resource>Response`; schemas: descriptive `camelCase` ending in `Schema`.
- DTO properties explicitly use `declare public readonly`; `?` only for optional fields. No decorators, constructors, inheritance, behavior, static schemas, definite-assignment/non-null assertions or weakened required inputs.
- Queries, deletion selections, responses and snapshots use contracts. Validate at application/mapping boundaries and preserve mobile names/types, signed widths, optionality and wire order.
- Use enums for finite alternatives, including commands/protocol groups. Definitions describe archetypes, not saved player instances.

## Presentation

C# inspires block presentation only in `.ts` files; naming and runtime semantics remain JavaScript/TypeScript conventions.

- dprint owns `.ts`: four spaces, LF, double quotes, semicolons, 100 columns and multiline-only trailing commas. Preserve property quoting and import/export order.
- In `.ts`, use Allman declaration/control braces; put `else`, `catch`, `finally` and `do`'s `while` on new lines. Every control body needs braces. Arrow callbacks stay inline; objects retain expression layout; empty blocks may be `{}` after a line break. Keep `return` with its expression and parenthesize arrow-object returns.
- Separate imports/declarations, top-level declarations, methods, control blocks, meaningful stages and final returns with one blank line; group related fields/locals. Avoid decorative spacing, minification and dense expressions hiding stages.
- Oxfmt owns `.tsx`, `.cjs`, `.mjs` and other supported formats: community conventions, two spaces and same-line braces. Preserve Markdown prose wrapping; import/export and package-key sorting stay disabled.
- Oxlint checks JS/TS correctness; mandatory `curly` applies only to `.ts`. EditorConfig uses four spaces for `.ts` and two elsewhere. Formatting controls wrapping; never manually align columns or incidentally sort names/keys.

No inline, block, documentation or suppression comments in tracked code, configuration, scripts, SQL, templates or embedded examples. Preserve interpreter directives; explain intent in prose and constraints through names/types.
