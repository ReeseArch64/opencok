---
status: accepted
date: 2026-10-27
decision-makers: ReeseArch64
---

# ADR-0014: Adopt dprint for TypeScript formatting

## Context and Problem Statement

[Issue #550](https://github.com/ReeseArch64/opencok/issues/550) requests four-space,
explicit-brace, C#-inspired presentation while preserving TypeScript semantics.
ADR-0008 selected Oxfmt and two spaces. The installed Oxfmt 0.74.0 can change
indentation but exposes no Allman brace option. A measured three-file
[pilot](../../.github/formatting-pilot/README.md) compares actual output, tradeoffs,
idempotence, syntax trees and automatic semicolon insertion behavior.

ReeseArch64 explicitly approved the summarized dprint proposal and migration in
the implementation session on 2026-10-27, after reviewing the pilot findings.
This decision supersedes [ADR-0008](0008-adopt-oxfmt-for-formatting.md); it retains
Oxfmt for other formats and [ADR-0007](0007-adopt-oxlint-for-linting.md) for linting.

## Decision

Pin dprint 0.64.3 and @dprint/typescript 0.96.1 as root development dependencies.
Load the local npm-installed Wasm plugin from `dprint.json`; frozen Bun installs
must supply both CLI and plugin without fetching a remote plugin at format time.

Use dprint exclusively for maintained JS/JSX/TS/TSX and their c/m module variants.
Use Oxfmt exclusively for its other supported file types, including JSON, YAML,
Markdown, CSS and HTML. Markdown's embedded code is part of its Oxfmt ownership.
Root `format` and `format:check` invoke both non-overlapping owners; Vite+ remains
installed for Oxfmt and Oxlint. No second general-purpose linter is introduced.

Use four spaces, LF, double quotes, semicolons, 100 columns, preserved property
quotes and trailing commas only in multiline constructs. Preserve import/export
and named-binding order. Allman opening braces apply to declarations, functions,
methods, accessors, constructors and control flow. `else`, `catch`, `finally`
and do/while continuation start on a new line. Empty blocks can remain `{}` on
the new line. Arrow callback blocks keep same-line opening braces. Object
literals and expression callbacks retain TypeScript expression layout, including
parenthesized object returns. Conditions, chains, arguments and generic types
wrap according to the pinned plugin at 100 columns; do not manually align columns.

Retain the contribution guide's one-blank-line policy between meaningful stages,
methods, declarations and before final returns. Both candidates preserve existing
intentional separation. Missing semantic-stage separation remains a documented
review rule: the installed Oxlint lacks general padding enforcement. Do not claim
that the formatter invents logical stages or decomposes large classes.

Enable Oxlint `curly: ["error", "all"]` in addition to existing correctness checks
and warnings-as-errors. dprint's brace insertion alone misses unbraced do bodies;
use Oxlint fixes for that case and verify the corrected result. Formatting itself
must not silently run lint fixes. Preserve all current generated/private exclusions
in both owners, normal TypeScript names, public contracts and behavior.

## Consequences

- Allman layout makes block boundaries explicit but increases vertical space;
  the pilot gameplay service grows from 3,085 to 4,006 lines. Decomposition must
  be tracked separately with protocol regressions, not hidden in formatting.
- Two formatter owners require explicit non-overlapping globs and editor language
  overrides. Root commands and CI provide the authoritative shared check.
- The broad mechanical baseline creates merge conflict risk; keep it independently
  revertible and rebase active branches after integration.
- Isolated TypeScript 5.9.3 in the pilot supplies its familiar AST API; it does not
  replace the workspace TypeScript 7 compiler or become a production dependency.

## Implementation Plan

- **Affected paths**: `dprint.json`, `.oxfmtrc.json`, `.oxlintrc.json`,
  `.editorconfig`, `.vscode/settings.json`, `.vscode/extensions.json`, `package.json`,
  `bun.lock`, `.github/CONTRIBUTING.md`, `.github/workflows/code-quality.yml`,
  `.github/formatting-pilot/`, and writable maintained JS/TS source.
- **Dependencies**: pin dprint 0.64.3 and @dprint/typescript 0.96.1; retain Vite+,
  Oxlint and root TypeScript versions. Keep the pilot lockfile isolated.
- **Migration**: deliver pilot/decision first, then dependent tooling and baseline
  commits. Insert mandatory braces separately from the formatter rewrite. Compare
  every changed baseline source AST against its original; preserve import/property
  order and syntax-sensitive returns. Never force-add ignored files.
- **Editor/CI**: four-space JS/TS EditorConfig overrides; dprint language-specific
  VS Code formatter with Oxfmt for other languages. Frozen dependency installation,
  root lint/format checks and pilot regression checks in CI. Retain existing root
  command names and correctness policy.
- **Follow-ups**: separate scoped issues for avatar orchestration and postbox
  workflows in `packages/services/src/game.service.ts`; require constructor
  injection, current Controller/Service boundaries and protocol regressions.
- **Avoid**: gameplay changes, import sorting, renaming, arbitrary alignment,
  new padding linters, private-client changes, deployment or database migrations.

### Verification

- [x] Three-file pilot compares actual candidate output with four-space Oxfmt;
      both are idempotent and preserve the compared normalized ASTs.
- [x] Synthetic ASI, object returns, nested if/else, loops, callbacks, generics,
      templates and TSX fixtures pass; Oxlint curly rejects/fixes unbraced bodies.
- [ ] Root commands and CI use disjoint owners and frozen pinned dependencies.
- [ ] Full mechanical baseline passes normalized AST comparison, two formatting
      runs, lint, format checks, workspace type checks and affected tests.
- [ ] All prior ignore boundaries remain intact and private/generated inputs are untouched.
- [ ] Structural follow-up issues are linked separately.

## Alternatives Considered

- Oxfmt with four-space indentation and Oxlint curly retains one formatter and
  existing editor setup, but cannot emit the requested Allman declaration layout.
- Keep two-space Oxfmt and improve manual whitespace: smallest migration risk,
  but does not meet the confirmed indentation and brace-placement requirement.
- Prettier adds a dependency without demonstrating the requested brace placement;
  no reason emerged to prefer it over the measured dprint candidate.

## More Information

The pilot report records exact versions, output excerpts, reproduction commands,
AST normalization limits and rollout boundaries. Revisit if pinned releases stop
supporting maintained syntax or editor/CI ownership cannot remain deterministic.
