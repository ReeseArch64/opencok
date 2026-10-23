---
status: accepted
date: 2026-10-23
decision-makers: ReeseArch64
---

# ADR-0007: Adopt Oxlint for JavaScript and TypeScript linting

## Context and Problem Statement

The monorepo needs one reproducible correctness check for JavaScript and
TypeScript. Commit `0523fe2` configured Oxlint through the existing Vite+ toolchain.
The maintainer explicitly requires its configuration in a dedicated file rather
than in `vite.config.ts`.

The maintainer confirmed this decision on 2026-10-23 to make the technology
boundaries explicit for subsequent implementation work. Acceptance records the
choice; it does not certify that the implementation tasks below are complete.

## Decision

Use Oxlint through the lockfile-resolved `vite-plus` dependency. Keep the
workspace policy in `.oxlintrc.json`; scripts pass `--config .oxlintrc.json`
explicitly. Enable correctness errors with the TypeScript, Unicorn and Oxc
plugins. `bun run lint` and `bun run lint:fix` deny warnings; fix mode uses only
the ordinary safe-fix flag.

Keep mobile/legacy inputs, local data, output, migrations, snapshots and database
fixtures excluded as specified in that file. Maintained TypeScript schemas stay
included. Lint is not a type checker or formatter. This ADR does not introduce
ESLint, duplicate plugin policies, type-aware rules or global tool requirements.

## Consequences

- A lockfile-resolved tool and explicit config make local and CI invocations reproducible; toolchain upgrades must revalidate rules and exclusions.
- Warnings block CI; rule exceptions need a narrow documented suppression instead of disabling a category across the repository.

## Implementation Plan

- **Affected paths**: `.oxlintrc.json`, `package.json`, `bun.lock`, `.github/workflows/code-quality.yml`, `.github/CONTRIBUTING.md`.
- **Dependencies**: Retain `vite-plus@^1.3.0` with its committed lockfile resolution (Vite+ 1.4.0 / Oxlint 1.89.0 at acceptance); no standalone/global Oxlint dependency is needed.
- **Patterns to follow and avoid**: Use existing root scripts and dedicated JSON configuration. Avoid moving policy into Vite config or introducing a second linter without a new decision.
- **Configuration**: Preserve explicit `--config`, `--deny-warnings`, correctness severity and the recorded ignore patterns.

The following local TODOs track implementation until they are linked to GitHub
work through the [contribution process](../../.github/CONTRIBUTING.md). This
record does not authorize deployment or a database migration.

- [ ] TODO ADR-0007.1: Retain standalone config and CI commands; review any changed rule before upgrading the lockfile.
- [ ] TODO ADR-0007.2: Require future contributed JavaScript/TypeScript tooling to pass the same lint command, with narrowly justified vendor exemptions when necessary.

### Verification

- [ ] `bun run lint` exits zero on maintained project code; an enabled correctness violation in a temporary included file causes nonzero exit.
- [ ] `bun run lint:fix` uses ordinary `--fix`, never `--fix-dangerously` or `--fix-suggestions`.
- [ ] Root scripts pass the dedicated config path and the code-quality workflow runs `bun run lint`.

## Alternatives Considered

These are tradeoff comparisons for this record, not a claim that a benchmark
or a historical evaluation was performed.

- ESLint supports a broad plugin ecosystem but would add a separate policy/runtime dependency without a current rule requirement.
- Biome combines checks and formatting but would replace the maintainer-selected Oxlint/Oxfmt pair and existing Vite+ integration.

## More Information

- **Implementation evidence at acceptance**: Standalone config, root scripts and CI workflow were introduced in commit `0523fe2`; later vendored skill files require their own baseline validation.
- **Related decisions and architecture**: [contribution rules](../../.github/CONTRIBUTING.md#code-quality); [Oxlint configuration](https://oxc.rs/docs/guide/usage/linter/config).
- **Review again when**: the stated boundaries cannot be maintained, a required
  dependency becomes unsupported, or measured compatibility/operational results
  invalidate the choice. A replacement requires a linked superseding ADR.
