---
status: accepted
date: 2026-10-28
decision-makers: ReeseArch64
---

# ADR-0002: Adopt Bun

## Context

Bun workspaces, `bun.lock`, `bun:test` and application CLI builds already exist.
Reproducible development must not silently select production execution or bypass validation.

Provenance: former ADR-0009, former ADR-0010's dated suspension, former ADR-0011's
runtime correction and former ADR-0015's build discussion. The latter remained a
proposal and its evaluation infrastructure was removed. Root `package.json`,
`bunfig.toml`, application manifests and Dockerfiles govern current execution.
Acceptance records the tool choice, not deployment readiness or completed checks.

## Decision

Use Bun 1.4.2 from root `packageManager` for dependency installation, workspace
scripts, local execution/watch mode, current tests and application CLI builds.
Keep one committed `bun.lock`; CI installs frozen dependencies without lifecycle
scripts through `.github/actions/setup/action.yml`. Retain the maintained API,
Chat, server and Web build commands, including their ESM/runtime assets.

Bun remains the current development toolchain. The former Node.js production
mandate is suspended, not completed, and no replacement production runtime is
selected. Existing Bun containers are development/laboratory evidence only,
regardless of profile names. CI Node 22 supports tooling, not production selection.
Keep platform-specific APIs behind adapters rather than spreading Bun assumptions
through shared domain rules; existing Bun adapters need no migration under this ADR.

Preserve explicit configuration loading: root `bunfig.toml` disables automatic
dotenv loading; commands launched elsewhere use `--no-env-file`. The shared loader
resolves the workspace root from the executing module URL, with process variables
overriding the single root file, including blank values. Missing files are allowed;
selected domain schemas still validate settings and report names, never secret values.

**Non-goals:** production selection/migration, second lockfile/package manager, restored
evaluation harnesses, new dependencies, private input processing, migration or deployment.

## Consequences

- One declared toolchain and frozen lockfile constrain resolver drift; upgrades must
  align CI, development image tags and tests rather than changing one in isolation.
- Bun tests do not certify another runtime or production capacity. Preserve
  independent emitted-artifact, shutdown, protocol and dependency-failure validation.
- Environment isolation needs regression tests for relocated bundles; source tests
  alone cannot establish that deployment avoids the build workspace's private file.

## Implementation Plan

- **Paths:** retain `package.json`, `bun.lock`, `bunfig.toml`, workspace scripts,
  `.github/actions/setup/action.yml`, application Dockerfiles and Compose guides.
  Preserve `packages/env/src/load.ts` and `packages/env/tests/load.test.ts`.
- **Dependencies:** retain `bun@1.4.2` as declared tooling and the existing locked
  workspace graph. No new package manager, bundler or runtime client is installed.
- **Patterns:** use root scripts and explicit workspace commands; preserve injected
  adapters, bounded dependency operations, validated environment and owned cleanup.
  Follow the [environment guide](../../packages/env/README.md) for root discovery.
- **Avoid:** app-local dotenv files, ambient loads, bundled source `__dirname`,
  configuration logging and treating successful source execution as release evidence.
- **Follow-up:** assess future runtime/build replacements separately against semantic
  checks, contracts, assets and environment isolation; do not restore removed harnesses.

### Verification

- [ ] `bun --version` matches `packageManager`; a disposable frozen install with
      `--ignore-scripts` leaves `bun.lock` unchanged.
- [ ] `bun run --cwd packages/env test` passes process precedence, missing-file,
      validation, redaction and relocated-bundle checks using synthetic inputs.
- [ ] Current API/Chat/server/Web builds and affected workspace tests pass; outputs
      retain required assets without importing private configuration or client inputs.
- [ ] Isolated local integration checks preserve protocol/state, dependency timeouts
      and shutdown cleanup; their results are labelled development evidence only.

## Alternatives

These are tradeoff comparisons, not claims of historical trials or measurements.

- Node.js with npm offers a single alternative install/runtime ecosystem, but would
  replace the existing workspace/test workflow; no such migration is selected.
- Bun in all environments reduces adapter differences but would prematurely choose
  production execution without release/runtime/capacity validation.

Revisit on unsupported dependencies, reproducible compatibility failures or an
explicit production-runtime decision; keep tooling and deployment acceptance separate.
