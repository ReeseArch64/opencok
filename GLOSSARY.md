# Vocabulary and Code Conventions

Use established domain vocabulary, ordinary TypeScript names and readable layout. C# inspires block presentation only in files ending in `.ts`; naming and runtime semantics follow JavaScript/TypeScript conventions. Other JavaScript/TypeScript extensions follow community conventions. Public names/compatibility take precedence. These conventions authorize neither new formatters, mass renaming, structural migration nor unrelated rewrites; operational limits are in [rules](.agents/RULES.md).

## Implementation vocabulary

| Term                     | Responsibility                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------- |
| Application              | Deployable `apps/` composition root; wires collaborators/configuration.                 |
| Package                  | Reusable `packages/` code; never imports applications.                                  |
| Controller               | Transport operations delegated to injected Services.                                    |
| Service                  | Use case coordinating rules/persistence through contracts and constructor injection.    |
| Contract                 | Structural port/input/query/selection/response, without runtime validation.             |
| Port                     | Required capability independent of infrastructure implementation.                       |
| Adapter                  | Connects transport/infrastructure to contracts; I/O does not confer workflow ownership. |
| DTO                      | Plain create/update input class.                                                        |
| Response                 | Output contract, including mobile; not a DTO.                                           |
| Mapper                   | Transport mapping/wire serialization.                                                   |
| Validation               | Runtime boundary checks, including Zod; declarations alone do not validate.             |
| Rule                     | Domain behavior/invariant, separate from parsing/serialization.                         |
| Enum                     | Finite named alternatives.                                                              |
| Constant                 | Fixed value; tunable limits/durations are configuration.                                |
| Abstract class           | Shared workflow/lifecycle/invariants with domain-specific steps.                        |
| Composition              | Application wiring, without hidden domain construction.                                 |
| Wire contract            | Exchanged names/values, numeric widths, optionality and serialization order.            |
| Compatibility entrypoint | Existing import/call boundary delegating during migration.                              |

One responsibility and one behavioral class per implementation file; no empty abstractions/layers to satisfy terminology.

## Domain vocabulary

- **Realm:** authoritative gameplay scope owned by a realm server, without arbitrary frontend/worker writes.
- **Kingdom:** existing gameplay/persistence term (`kingdomId`), not mechanically interchangeable with realm.
- **Account/identity:** authentication context, distinct from gameplay **character/player**; preserve identifier meanings.
- **Command:** named application/protocol operation; wire strings remain independent of enum casing.
- **Snapshot:** point-in-time state contract, not a create/update DTO.

Do not merge identifiers or invent cosmetic synonyms.

## Naming and contracts

- Classes/interfaces/type aliases/enums and enum members: `PascalCase`; functions/methods/parameters/locals/properties: `camelCase`. No mandatory `I` interface prefix or C#-style methods/properties.
- Fixed scalar constants: `UPPER_SNAKE_CASE`; collections/schemas: `camelCase`. `const` alone does not imply uppercase. Preserve serialized enum values (`ResourceType.Wood` → `"wood"`).
- Files: lowercase hyphen-separated domain names; preserve established role suffixes (`chat-config.mapper.ts`) without requiring one everywhere. Preserve `Dto`, `Id`, `Uuid`, protocol keys and public exports; no acronym-wide renaming.
- Inputs: `Create<Resource>Dto` / `Update<Resource>Dto` (`create-character.dto.ts`); response interfaces: `<Resource>Response` (`chat-config.response.ts`); schemas: descriptive `camelCase` ending in `Schema`. Tests follow component conventions (`tests/`, `integration/`, `.test.ts`).
- DTO properties: explicit `declare public readonly`; `?` only for optional fields. No decorators, constructors, inheritance, behavior/methods, static schemas, definite-assignment/non-null assertions or weakened required inputs.
- Queries, deletion selections, responses and snapshots use contracts. Compatibility locations: `packages/contracts` (responses in `src/responses`), `packages/validations`, `packages/mappings`; domain equivalents follow contribution conventions.
- Validate at mapping/application boundaries; preserve mobile names/types, signed numeric widths, optionality and wire field order.

## Presentation and checks

- Pinned dprint exclusively formats maintained `.ts` files: four spaces, no tabs, LF, double quotes, semicolons, 100 columns, multiline-only trailing commas; preserve property quoting and import/export order.
- Oxfmt exclusively formats all other supported JavaScript/TypeScript extensions, including `.tsx`, `.mts`, `.cts`, `.js`, `.jsx`, `.mjs` and `.cjs`, plus other supported formats, including Markdown/embedded code. Follow community conventions with two-space indentation and same-line braces. Never manually align columns or incidentally sort imports/bindings/properties/package keys.
- Oxlint checks all maintained JavaScript/TypeScript extensions, including `.ts`, independently of formatter ownership.

C#-inspired layout applies only to `.ts` files:

- Allman braces for declarations/functions/methods/accessors/constructors/control flow; brace every control body, including guards and `do` (Oxlint `curly` covers formatter gaps). Put `else`, `catch`, `finally` and `do`'s `while` on new lines.
- Arrow callback braces stay inline; objects retain expression layout. Empty blocks may be `{}` on the next line. Formatter owns wrapping; no per-file rules. Keep `return` with its expression and parenthesize arrow-object returns.
- One blank line between imports/declarations, top-level declarations, methods, control blocks, meaningful stages and final returns; group related fields/locals. No decorative spacing, minification or dense ternaries/callbacks hiding stages. Method extraction requires separately scoped behavior-preserving refactoring.

No code/documentation/suppression comments in tracked files or embedded examples; preserve required interpreter directives. Explain intent in prose and constraints through names/types/tests.

Run affected tests. Warnings are errors; lint does not replace semantic type checks. Review spacing/naming/responsibilities/compatibility separately. Formatting preserves gameplay, protocols, persistence, costs, timers, property order and import side effects; success proves neither behavior preservation nor native-client compatibility. Renaming/structural changes require their own scope and compatibility evidence.
