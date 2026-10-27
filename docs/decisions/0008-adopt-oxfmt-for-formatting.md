---
status: superseded
date: 2026-10-23
decision-makers: ReeseArch64
---

# ADR-0008: Adopt Oxfmt for repository formatting

## Context and Problem Statement

Formatting must be deterministic without mixing lint and format policy. Commit
`0523fe2` introduced a repository baseline, and the maintainer requested that
formatter settings live outside Vite configuration.

The maintainer confirmed this decision on 2026-10-23 to make the technology
boundaries explicit for subsequent implementation work. Acceptance records the
choice; it does not certify that the implementation tasks below are complete.

## Decision

Use Oxfmt through the existing lockfile-resolved Vite+ installation with policy
in `.oxfmtrc.json`. Explicitly pass that file from `format` and `format:check`.
Use two spaces, LF, double quotes, semicolons, a 100-column print width, preserved
property quoting and prose wrapping, and trailing commas. Do not sort imports
or package keys.

Respect the dedicated config exclusions for private inputs, migrations, snapshots
and fixture data. Maintained schemas remain included. CI checks formatting;
`bun run format` writes it locally. This ADR chooses the formatter and policy
location; it does not approve semantic edits or require changes to read-only
mobile assets.

## Consequences

- A shared formatter reduces review noise after the baseline; new files and dependency upgrades must pass a formatting/idempotence check.
- Initial formatting can touch many maintained files; generated/private inputs need explicit exclusions and reviewers must separate formatting from behavior changes.

## Implementation Plan

- **Affected paths**: `.oxfmtrc.json`, `.editorconfig`, `package.json`, `bun.lock`, `.github/workflows/code-quality.yml`, `.github/CONTRIBUTING.md`.
- **Dependencies**: Retain the existing lockfile-resolved Vite+ installation (Oxfmt 0.74.0 at acceptance); no standalone formatter or Prettier dependency is needed.
- **Patterns to follow and avoid**: Use the explicit root config and existing scripts; preserve ignore boundaries. Do not move settings into Vite config or automatically reorder imports.
- **Configuration**: Retain all current `.oxfmtrc.json` options; the root `.editorconfig` continues to define basic editor defaults.

The following local TODOs track implementation until they are linked to GitHub
work through the [contribution process](../../.github/CONTRIBUTING.md). This
record does not authorize deployment or a database migration.

- [ ] TODO ADR-0008.1: Keep formatter config and editor defaults consistent; apply formatting only to writable maintained files.
- [ ] TODO ADR-0008.2: On upgrades, check two consecutive formatting runs on changed files and ensure no fixture/snapshot/migration changes are introduced unintentionally.

### Verification

- [ ] `bun run format:check` exits zero for the maintained baseline and fails for an intentionally unformatted temporary included file.
- [ ] A second formatting run on changed files produces no additional diff.
- [ ] Neither root format script uses `vite.config.ts` for formatter policy; CI invokes `bun run format:check`.

## Alternatives Considered

These are tradeoff comparisons for this record, not a claim that a benchmark
or a historical evaluation was performed.

- Prettier is an established alternative but would add a formatter outside the already selected Vite+ toolchain.
- Biome combines lint and formatting but would replace the selected separate Oxlint and Oxfmt policies.

## More Information

- **Implementation evidence at acceptance**: The formatter baseline and scripts exist in commit `0523fe2`; subsequent third-party skill files were staged separately and are not evidence of a passing new baseline.
- **Related decisions and architecture**: [ADR-0007](0007-adopt-oxlint-for-linting.md); [Oxfmt configuration](https://oxc.rs/docs/guide/usage/formatter/config).
- **Review again when**: the stated boundaries cannot be maintained, a required
  dependency becomes unsupported, or measured compatibility/operational results
  invalidate the choice. A replacement requires a linked superseding ADR.

- **2026-10-27**: Superseded by [ADR-0014](0014-adopt-dprint-for-typescript-formatting.md) after a measured pilot and maintainer confirmation. Oxfmt remains the formatter for formats outside JS/TS.
