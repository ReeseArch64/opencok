# Formatting migration validation

The maintainer approved the pilot summary on 2026-10-27; ADR-0014 records the
accepted policy. The decision/pilot branch is followed by the rollout branch in
a `gh stack`. Tool integration, mandatory-brace insertion and formatter baseline
are separate commits. The branch contains no gameplay or protocol refactoring.

## Scope and review

- Mandatory braces were inserted in 1,134 source files, with normalized AST
  equivalence checked before formatting. Nested fixes required four Oxlint passes.
- The formatting baseline changes 4,143 maintained source files, including the
  authorable TypeScript resource catalogs and Drizzle schemas. GitHub may truncate
  this mechanical diff; use the AST check below to review the entire baseline.
- All 4,143 changed source ASTs match the original at `580ab975`. The comparator
  also rejects changes to const/let, unary operators, type-only imports, property
  order and ASI-sensitive returns. Source parsing uses the isolated TypeScript
  5.9.3 test dependency; workspace type checking retains TypeScript 7.0.2.
- Comparison ignores formatting-only parentheses, one-statement control-body
  wrappers, inert empty statements inside blocks and newline-only JSX whitespace.
  It preserves declaration flags, operators, type-only imports, literals, child
  order and other compared syntax. These are explicit bounded checks rather than
  a claim of general mathematical program equivalence.
- All current ignore patterns remain in both formatter owners. Oxfmt additionally
  excludes the JS/TS variants owned by dprint. No private input, generated bundle,
  migration, snapshot, fixture-data directory or original mobile artifact changed.

## Reproduce

```sh
bun install --frozen-lockfile --ignore-scripts
bun --no-env-file install --cwd .github/formatting-pilot --frozen-lockfile --ignore-scripts
bun run lint
bun run format:check
bun --no-env-file run .github/formatting-pilot/verify.ts
bun --no-env-file run .github/formatting-pilot/verify-migration.ts 580ab975
node .github/formatting-pilot/verify-editor.mjs
```

The immutable historical pilot commit must be available locally; CI fetches full
history. The pilot uses matched pre-migration inputs so its measurements remain
reproducible after adoption. CI installs both manifests frozen, uses the same
root commands, reruns synthetic regressions and compares LSP editor formatting
against the root CLI. The local npm Wasm plugin requires no format-time download.
A clean temporary frozen install with scripts disabled successfully ran dprint
0.64.3, matching the existing CI install policy.

## Results

- `bun run lint` and `bun run format:check`: pass with correctness checks and
  warnings-as-errors retained.
- Two root formatting runs: identical working-tree diff SHA-256; the second run
  formats no additional sources.
- Pilot: all three source comparisons, second-pass idempotence, six synthetic
  runtime/ASI fixtures, TSX/emitted-JavaScript ASTs, preserved padding and curly
  negative/positive fixtures pass.
- Editor: headless `initialize`, `didOpen` and `textDocument/formatting` requests
  to dprint LSP produce exactly the root CLI output for a synthetic TypeScript
  guard/object-return fixture. A graphical VS Code session was not exercised.
- All 27 implemented workspaces exposing `check-types`: pass. The other 40
  workspaces with that script are empty scaffolds and return preexisting TS18003
  (no inputs); they contain no migrated source. The pilot's three TypeScript
  files also pass the root compiler with explicit Bun types and bundler resolution.
- Expanded API/Chat/realm/web/core/env/resource/controller/mapping/rule/validation
  suite: 1,809 pass across 343 files, zero failures; 801,633 assertions and one snapshot.
- Required `bun run test:packages`: 82 pass, zero failures after migration.
- Drizzle unit and commit-message hook tests: 858 pass, zero failures.

## Follow-ups and recovery

[Avatar orchestration #552](https://github.com/ReeseArch64/opencok/issues/552) and
[postbox orchestration #553](https://github.com/ReeseArch64/opencok/issues/553) track
bounded service extractions separately, after prior discussion participation and
duplicate searches. Both carry milestone v1 and OpenCok project items.

Logical-stage padding remains a documented review responsibility, since neither
installed formatter/Oxlint supplies semantic-stage detection. Native client builds,
external database integration and a graphical editor session are not certified by
this source-style migration. No client patch, database migration, account rewrite,
service restart or deployment is required. Revert the formatting baseline and
brace insertion independently of functional work; reverting tooling also restores
the former root commands, editor defaults and dependencies. Coordinate active
branches around the mechanical baseline to resolve merge conflicts locally.
