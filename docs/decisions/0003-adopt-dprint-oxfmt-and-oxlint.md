---
status: accepted
date: 2026-10-28
decision-makers: ReeseArch64
---

# ADR-0003: Adopt dprint, Oxfmt and Oxlint

**Current scope:** the dated TypeScript-only clarification below supersedes the
original decision's JavaScript ownership and presentation wording. Original prose
is retained as history, not the current JavaScript formatting requirement.

## Context

OpenCoK needs deterministic formatting/correctness checks and four-space, explicit-brace
TypeScript presentation. Formatters must not undo each other's output. Provenance: former
ADR-0007, ADR-0008 and ADR-0014, including pilot removal. Historical evidence is not
recurring CI coverage; no new measurements or restored infrastructure are claimed.
Current policy lives in `dprint.json`, `.oxfmtrc.json`, `.oxlintrc.json` and the
[contribution guide](../../.github/CONTRIBUTING.md#code-quality).
Acceptance records complementary tool choices, not completed verification.

## Decision

Use dprint exclusively for maintained JS/JSX/TS/TSX and c/m module variants.
Use Oxfmt exclusively for its other supported formats, including JSON, YAML,
Markdown, CSS and HTML; Markdown embedded code belongs to Oxfmt. Keep their globs
non-overlapping. Oxlint owns linting, not formatting or semantic type checking.
Root `format`/`format:check` invoke both owners with explicit configs;
`lint`/`lint:fix` use `.oxlintrc.json` and deny warnings.

JS/TS uses four spaces, LF, double quotes, semicolons, 100 columns, preserved
property quoting and multiline-only trailing commas. Preserve import/export and
named-binding order. Allman opening braces apply to declarations, methods,
functions and control flow; `else`, `catch`, `finally` and do/while continuations
start on a new line. Arrow callback braces remain inline, empty blocks may be `{}`
on a new line, and object literals/parenthesized object returns retain expression
layout. Let the pinned plugin wrap conditions, chains, generics and arguments.
Oxfmt uses two spaces and preserves prose wrapping; package-key sorting stays off.

Require Oxlint `curly: ["error", "all"]` alongside correctness errors and the
TypeScript, Unicorn and Oxc plugins. dprint alone misses unbraced do bodies;
ordinary lint fixes must supply those braces. Formatting must never run lint fixes
implicitly. Never use dangerous/suggestion fix flags to make the baseline pass.

Separate imports/declarations, top-level declarations, methods, control-flow blocks
and final returns with a blank line; group related fields/locals and meaningful
stages. Preserve intentional spacing, not decorative repetition. Logical-stage
padding remains a review safeguard, not a claimed general Oxlint capability.
Comments and inline suppressions remain prohibited; explain rationale in prose.

**Non-goals:** tool replacement, new linter, semantic edits, class decomposition,
renaming, import sorting, deployment or pilot restoration.

## Consequences

- Two owners require matching editor overrides/disjoint file lists; root checks are authoritative.
- Allman increases vertical space; track decomposition separately with protocol regressions.
- Rewrites risk syntax-sensitive returns and merge conflicts: separate brace insertion,
  formatting and behavior; review every authorized diff.

## Implementation Plan

- **Paths:** retain the three configs, `package.json`, `bun.lock`, `.editorconfig`,
  `.vscode/{settings,extensions}.json` and `.github/workflows/code-quality.yml`.
- **Dependencies:** pin `dprint@0.64.3` and `@dprint/typescript@0.96.1`; load the
  installed local Wasm plugin, not a remote download. Retain `vite-plus@^1.3.0`
  locked at 1.4.0 with Oxfmt 0.74.0/Oxlint 1.89.0; add no dependencies here.
- **Exclusions:** preserve `data/`, dependency/output/coverage directories, build
  metadata, `.husky/_/`, Drizzle migrations, snapshots and database fixtures in all
  tools. Maintained Drizzle TypeScript schemas and source remain included.
- **Patterns:** keep four-space source editor overrides and two-space defaults.
  For separately authorized rewrites, run ordinary lint fixes before formatting,
  lint again, compare normalized syntax trees and inspect syntax-sensitive returns.
  Never force-add ignored inputs or broaden a formatting write beyond its scope.

### Verification

- [ ] `bun run lint` and `bun run format:check` pass with frozen local dependencies;
      CI invokes both commands and their dedicated configs.
- [ ] Included JS/TS paths belong only to dprint and other supported formats only to
      Oxfmt; two formatting runs on an authorized synthetic copy produce no new diff.
- [ ] Isolated unbraced if/loop/do fixtures fail Oxlint; ordinary fixes plus formatting
      preserve behavior, including automatic semicolon insertion and object returns.
- [ ] Editor settings match owner/indentation rules; review confirms meaningful blank
      lines and exclusions without claiming automatic semantic-stage padding.
- [ ] Any mechanical source rewrite preserves normalized syntax, import/property
      order, affected type checks and protocol tests independently of formatting success.

## Alternatives

Tradeoff comparisons, not claims of additional historical trials:

- Four-space Oxfmt plus Oxlint keeps one formatter, but pinned Oxfmt lacks Allman;
  retain Oxfmt for non-JS/TS instead of replacing dprint.
- Prettier or Biome can centralize formatting, but require replacing established
  policies without establishing the required brace layout and disjoint-owner benefits.

Revisit when pinned tools cannot support maintained syntax or deterministic ownership.

## More Information

### 2026-10-28 — TypeScript-only presentation clarification

The maintainer clarified that C#-inspired presentation applies only to TypeScript
files: TS/TSX and c/m TypeScript module variants. The earlier JS/TS ownership,
four-space source, Allman and logical-stage presentation wording must be read with
this narrower scope. JavaScript/JSX and c/m JavaScript module variants retain the
previous Oxfmt presentation: two spaces and same-line braces. Other formats retain
their existing Oxfmt settings; Markdown embedded code remains Oxfmt-owned.

- **Implementation:** restrict `dprint.json` includes and `.oxfmtrc.json` exclusions
  to `**/*.{ts,tsx,mts,cts,mtsx,ctsx}`. Restrict `.editorconfig` four-space overrides
  and VS Code dprint ownership to TypeScript; restore JavaScript to Oxfmt. Update
  the contribution guide and glossary. Reformat only affected JavaScript files.
- **Unchanged:** pinned dependencies, independent correctness lint, type checking,
  import/property order, private/generated exclusions and all other format settings.
  No application logic or TypeScript source rewrite is authorized by this correction.
- **Alternatives:** extending the C#-inspired style to JavaScript contradicts the
  clarified requirement; replacing either formatter is unnecessary.

#### Clarification verification

- [ ] Included TypeScript paths belong only to dprint; JavaScript and other supported
      formats belong only to Oxfmt, including editor and indentation configuration.
- [ ] Synthetic TypeScript and JavaScript fixtures demonstrate distinct brace and
      indentation styles; repeated formatting is idempotent and preserves syntax trees.
- [ ] `bun run lint` and `bun run format:check` pass; no unrelated source is rewritten.
