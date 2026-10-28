# Vocabulary and Code Conventions

Use consistent vocabulary, ordinary TypeScript names and explicit, readable code layout. C# inspires block presentation, not the language's naming conventions or runtime model.

[Issue #550](https://github.com/ReeseArch64/opencok/issues/550) establishes the readability goals and separates formatting from structural refactoring. [ADR-0014](docs/decisions/0014-adopt-dprint-for-typescript-formatting.md) records the accepted formatting decision. This glossary summarizes that decision and the current contribution conventions; it does not authorize a new formatter, repository-wide renaming or structural migration.

## Implementation vocabulary

| Term                     | Meaning and responsibility                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Application              | A deployable process and composition root in `apps/`. Wires concrete collaborators and runtime configuration.                                    |
| Package                  | Reusable code in `packages/`. Must not import applications.                                                                                      |
| Controller               | Handles transport-facing operations and delegates application work to injected Services.                                                         |
| Service                  | Owns a use case and coordinates domain rules and persistence through contracts. Receives collaborators through constructor injection.            |
| Contract                 | A structural boundary: a port, operation input, query, selection or response shape. Does not imply runtime validation.                           |
| Port                     | A contract describing a capability required by application code without coupling it to a particular infrastructure implementation.               |
| Adapter                  | Connects a transport or infrastructure implementation to a boundary contract. Does not own application workflows merely because it performs I/O. |
| DTO                      | A plain class describing a create or update input. Not a general name for every object crossing a boundary.                                      |
| Response                 | An output contract, including a mobile protocol response. Not a DTO.                                                                             |
| Mapper                   | Owns transport mapping and wire serialization. Preserves externally required names, types and field order.                                       |
| Validation               | Runtime boundary checks, including Zod schemas in `packages/validations`. Type annotations and DTO declarations do not validate values.          |
| Rule                     | Domain behavior or an invariant used by application workflows. Not transport parsing or serialization.                                           |
| Enum                     | A finite set of named alternatives, such as command names, protocol groups or resource types.                                                    |
| Constant                 | A named fixed value. Tunable limits and durations remain configuration values rather than enum alternatives.                                     |
| Abstract class           | Shared workflow, lifecycle ownership or invariants with domain-specific steps supplied by concrete classes.                                      |
| Composition              | Construction and wiring of collaborators in an application, rather than hidden dependency creation inside domain code.                           |
| Wire contract            | The representation exchanged with a client or service, including names, values, numeric widths, optionality and serialization order.             |
| Compatibility entrypoint | An existing import or call boundary that may delegate to a concrete implementation while callers migrate.                                        |

Keep implementation files focused on one responsibility and one class with behavior. Do not introduce empty abstractions or new layers solely to match a glossary term. Existing factory and compatibility entrypoints are not permission for unrelated rewrites.

## Domain vocabulary

| Term                | Usage                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Realm               | An authoritative gameplay scope owned by a realm server. Do not use the term to imply that any frontend or worker can mutate its state.           |
| Kingdom             | An existing gameplay and persistence term, including fields such as `kingdomId`. Do not mechanically replace it with `realm` in contracts.        |
| Account or identity | Authentication and identity context. Do not assume it is interchangeable with an individual gameplay character.                                   |
| Character or player | A gameplay entity or participant in its existing domain context. Preserve the distinction from account identity and existing identifier meanings. |
| Command             | A named application or protocol operation. Preserve existing command strings even when internal enum members use different casing.                |
| Snapshot            | A representation of state at a point in time, not a general create/update input. Use the appropriate contract rather than naming it a DTO.        |

Prefer the vocabulary already used by the affected domain. Do not collapse distinct identifiers or invent synonyms simply to make names look uniform.

## Naming

These conventions guide new and intentionally changed code. They do not authorize mass renaming, and existing public names and local compatibility requirements take precedence.

| Element                                                        | Convention                                                                   | Example                                                              |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Classes, interfaces, type aliases and enums                    | `PascalCase`                                                                 | `CharacterProvisioningService`, `ChatConfigResponse`, `ResourceType` |
| Functions, methods, parameters, local variables and properties | `camelCase`                                                                  | `create`, `websocketUrl`, `kingdomId`                                |
| Enum members                                                   | `PascalCase`; serialized values retain the required contract                 | `ResourceType.Wood` with value `"wood"`                              |
| Fixed scalar constants                                         | Existing `UPPER_SNAKE_CASE` convention                                       | `MAX_CONNECTIONS`, `SOCKET_TIMEOUT_MS`                               |
| Named collections and schemas                                  | Existing `camelCase` convention; `const` alone does not require uppercase    | `loggedGameCommands`, `createCharacterSchema`                        |
| TypeScript source files                                        | Lowercase, hyphen-separated domain names; preserve established role suffixes | `character-provisioning.service.ts`, `chat-config.mapper.ts`         |
| Create input DTO                                               | `Create<Resource>Dto`                                                        | `CreateCharacterDto` in `create-character.dto.ts`                    |
| Update input DTO                                               | `Update<Resource>Dto`                                                        | `UpdatePushPreferenceDto` in `update-push-preference.dto.ts`         |
| Response interface                                             | `<Resource>Response` in `packages/contracts/src/responses`                   | `ChatConfigResponse` in `chat-config.response.ts`                    |
| Runtime validation schema                                      | Descriptive `camelCase` name ending in `Schema`                              | `createCharacterSchema`                                              |
| Tests                                                          | Follow the component's existing structure and filename convention            | `tests/`, `integration/`, `.test.ts`                                 |

Use meaningful domain names rather than vague labels for unrelated responsibilities. Preserve established abbreviations such as `Dto`, `Id` and `Uuid`; do not mass-convert them to all-capital acronyms. Examples describe existing patterns, not permission to rename protocol keys or public exports.

Do not adopt C#-style PascalCase for TypeScript methods or properties. Do not infer that every constant must be uppercase, every contract must have an `I` prefix, or every source file must have a class-role suffix.

## DTOs, contracts and boundaries

- Reserve DTO classes for implemented create and update inputs. Declare explicit `declare public readonly` data properties.
- DTOs have no decorators, constructors, inheritance, behavior, methods or static validation schemas. Do not use definite-assignment or non-null assertions to simulate initialization.
- Use `?` only when an input field may actually be omitted. Do not weaken required fields for convenience.
- Read queries, deletion selections, response payloads and protocol snapshots use contracts rather than DTO classes.
- Keep runtime schemas in `packages/validations`, structural contracts in `packages/contracts` and wire mapping in `packages/mappings`.
- Validate at mapping or application boundaries. Preserve mobile field names, signed numeric widths, optionality and wire order.

## Code presentation

### Indentation and punctuation

- Maintained JS/TS source uses four spaces, no hard tabs, LF, double quotes, semicolons and a 100-column formatting width.
- Use trailing commas only in multiline JS/TS constructs, as emitted by the pinned formatter. Preserve property quoting and import/export order.
- Other supported formats use the existing Oxfmt policy, including two-space indentation. The four-space source rule is not a repository-wide indentation rewrite.
- Do not manually align columns or sort imports, named bindings, properties or package keys as an incidental formatting change.

### Braces and expressions

- Use Allman opening braces on the next line for declarations, functions, methods, accessors, constructors and control flow.
- Require braces around every applicable control-flow body, including single-statement guards and `do` bodies.
- Put `else`, `catch`, `finally` and the `while` continuation of `do` on a new line.
- Arrow callback block braces stay on the same line. Object literals keep TypeScript expression layout; do not apply declaration-brace rules blindly to objects.
- Empty blocks may remain `{}` on the next line.
- Let the pinned formatter wrap multiline conditions, argument lists, generics and chains at the configured width. Do not invent per-file wrapping rules.
- Preserve syntax-sensitive expressions: never separate `return` from its returned expression, and preserve parentheses around arrow-function object returns.

### Logical separation

- Use one blank line between imports and declarations, adjacent top-level declarations and class methods.
- Separate control-flow blocks, meaningful logical stages and final returns from preceding statements. Keep related field and local variable declarations together.
- Do not add multiple decorative blank lines, compress source to resemble a minified build, or hide workflow stages inside dense nested ternaries and callbacks.
- Keep methods focused. Extracting responsibilities is a separately scoped, behavior-preserving refactor, not a formatting operation.
- Do not add code, documentation or suppression comments to tracked project files or embedded examples. Explain intent in prose documentation and express constraints through names, types and tests. Preserve interpreter directives required to execute scripts.

## Enforcement and review

| Concern                                                           | Enforcement or review responsibility                                                                            |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Maintained JS/JSX/TS/TSX and c/m module variants                  | Pinned dprint TypeScript formatter.                                                                             |
| Other supported formats, including Markdown and its embedded code | Oxfmt; no competing formatter ownership for the same file.                                                      |
| Mandatory control-flow braces                                     | Oxlint `curly`, including cases not covered by formatter brace insertion.                                       |
| Correctness and warnings                                          | Existing Oxlint rules with warnings treated as errors.                                                          |
| Semantic type correctness                                         | Relevant workspace type checks, separate from formatting and lint.                                              |
| Missing logical-stage blank lines                                 | Review responsibility; the installed tools do not infer semantic stages or provide general padding enforcement. |
| Naming, responsibilities and compatibility                        | Review plus relevant tests and type checks; not guaranteed by passing formatting checks.                        |

Run `bun run lint` and `bun run format:check`, plus relevant workspace type checks and affected tests. Automatic fixes must remain within authorized paths; do not perform a repository-wide formatting pass for a scoped change.

Formatting must not change gameplay, protocol behavior, persistence, resource costs, timers, property order or import side effects. A rename or structural change requires its own scope and compatibility evidence. Passing a formatter does not prove behavior preservation or native-client compatibility.
