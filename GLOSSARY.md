# Vocabulary and Code Conventions

Use consistent domain vocabulary, ordinary TypeScript naming and readable layout. C# inspires block presentation only in TypeScript files, not other languages, naming or runtime semantics. This separates readability/formatting from structural refactoring; These conventions do not authorize new formatters, mass renaming, structural migration or unrelated rewrites. Existing public names and compatibility requirements take precedence.

## Implementation vocabulary

| Term                     | Responsibility                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| Application              | Deployable process/composition root in `apps/`; wires collaborators and runtime configuration.    |
| Package                  | Reusable code in `packages/`; never imports applications.                                         |
| Controller               | Transport-facing operations delegated to injected Services.                                       |
| Service                  | Use case coordinating rules/persistence through contracts and constructor-injected collaborators. |
| Contract                 | Structural port, operation input, query, selection or response; not runtime validation.           |
| Port                     | Required capability without coupling to an infrastructure implementation.                         |
| Adapter                  | Connects transport/infrastructure to a contract; I/O alone does not confer workflow ownership.    |
| DTO                      | Plain create/update input class, not every boundary object.                                       |
| Response                 | Output contract, including mobile responses; not a DTO.                                           |
| Mapper                   | Transport mapping/wire serialization, preserving required names, types and field order.           |
| Validation               | Runtime boundary checks, including Zod schemas; types/DTO declarations do not validate values.    |
| Rule                     | Domain behavior/invariant, not transport parsing or serialization.                                |
| Enum                     | Finite named alternatives, e.g. commands, protocol groups or resource types.                      |
| Constant                 | Fixed value; tunable limits/durations remain configuration.                                       |
| Abstract class           | Shared workflow, lifecycle or invariants with concrete domain-specific steps.                     |
| Composition              | Wiring collaborators in applications, not hidden construction inside domain code.                 |
| Wire contract            | Exchanged representation: names, values, numeric widths, optionality and serialization order.     |
| Compatibility entrypoint | Existing import/call boundary delegating while callers migrate.                                   |

Keep implementation files to one responsibility and one class with behavior. Do not create empty abstractions/layers to satisfy terminology; factories and compatibility entrypoints do not authorize unrelated rewrites.

## Domain vocabulary

- **Realm:** authoritative gameplay scope owned by a realm server, not permission for arbitrary frontends/workers to mutate state.
- **Kingdom:** existing gameplay/persistence term, including `kingdomId`; do not mechanically replace it with realm.
- **Account/identity:** authentication context, distinct from an individual gameplay **character/player**. Preserve domain-specific identifier meanings.
- **Command:** named application/protocol operation; preserve wire strings regardless of internal enum casing.
- **Snapshot:** point-in-time state contract, not a create/update DTO.

Prefer established domain terms; do not merge distinct identifiers or invent synonyms for cosmetic uniformity.

## Naming and boundaries

- Classes, interfaces, type aliases and enums: `PascalCase`; functions, methods, parameters, locals and properties: `camelCase`. No C#-style PascalCase methods/properties or mandatory `I` interface prefix.
- Enum members: `PascalCase`, preserving serialized values, e.g. `ResourceType.Wood` → `"wood"`. Fixed scalar constants follow `UPPER_SNAKE_CASE`; collections/schemas follow `camelCase`. `const` alone does not require uppercase.
- Source files: lowercase, hyphen-separated domain names, preserving established role suffixes, e.g. `chat-config.mapper.ts`; not every file needs one. Preserve `Dto`, `Id`, `Uuid`, protocol keys and public exports; no acronym-wide renaming.
- Create/update inputs: `Create<Resource>Dto` / `Update<Resource>Dto`, e.g. `CreateCharacterDto` in `create-character.dto.ts`. Response interfaces: `<Resource>Response`, e.g. `ChatConfigResponse` in `chat-config.response.ts`. Schemas: descriptive `camelCase` ending in `Schema`. Tests follow component conventions (`tests/`, `integration/`, `.test.ts`).
- DTOs declare explicit `declare public readonly` properties, with `?` only for genuinely optional fields. No decorators, constructors, inheritance, behavior, methods, static schemas, definite-assignment or non-null assertions. Never weaken required inputs for convenience.
- Queries, deletion selections, responses and protocol snapshots use contracts, not DTO classes. Centralized compatibility locations are `packages/contracts` (responses under `src/responses`), `packages/validations` and `packages/mappings`; domain-owned equivalents follow current contribution conventions.
- Validate at mapping/application boundaries; preserve mobile names, signed numeric widths, optionality and wire order.

## Presentation and enforcement

- Maintained TypeScript files (TS/TSX and c/m TypeScript module variants) belong exclusively to pinned dprint: four spaces, no hard tabs, LF, double quotes, semicolons, 100 columns and trailing commas only in multiline constructs. Preserve property quoting and import/export order.
- Oxfmt exclusively owns JavaScript/JSX and c/m JavaScript module variants plus other supported formats, including Markdown/embedded code, retaining the previous two-space, same-line-brace defaults. The C#-inspired TypeScript presentation does not apply to them. Do not manually align columns or incidentally sort imports, bindings, properties or package keys.
- In TypeScript, use Allman braces for declarations, functions, methods, accessors, constructors and control flow. Every applicable control body needs braces, including single guards and `do`; Oxlint `curly` covers gaps left by dprint. Start `else`, `catch`, `finally` and `do`'s `while` continuation on new lines.
- In TypeScript, arrow callback braces stay inline; objects retain expression layout. Empty blocks may remain `{}` on the next line. Let the formatter wrap conditions, arguments, generics and chains; no per-file wrapping rules. Keep `return` with its expression and parentheses around arrow-object returns.
- In TypeScript, separate imports/declarations, adjacent top-level declarations, methods, control blocks, meaningful stages and final returns with one blank line; keep related fields/locals together. No decorative blank lines, minified layout or dense ternaries/callbacks hiding stages. Focused-method extraction is a separately scoped, behavior-preserving refactor.
- No code, documentation or suppression comments in tracked files/embedded examples. Explain intent in prose, constraints through names/types/tests; preserve required interpreter directives.
- Lint enforces correctness with warnings as errors; semantic types require separate workspace checks. Logical-stage spacing, naming, responsibilities and compatibility require review plus relevant tests/type checks, not formatter success alone.

Run `bun run lint`, `bun run format:check`, relevant workspace type checks and affected tests. Limit automatic fixes to authorized paths, never repository-wide formatting for a scoped task. Formatting must preserve gameplay, protocols, persistence, costs, timers, property order and import side effects. Renaming/structural changes need their own scope and compatibility evidence; formatter success proves neither behavior preservation nor native-client compatibility.
