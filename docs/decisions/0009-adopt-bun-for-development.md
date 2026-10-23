---
status: accepted
date: 2026-10-23
decision-makers: ReeseArch64
---

# ADR-0009: Adopt Bun for development tooling and execution

## Context and Problem Statement

The workspace already uses Bun workspaces, `bun.lock`, `bun:test` and local
Bun service entrypoints. The maintainer separates the development runtime from
the production runtime so local convenience does not silently dictate deployment.

The maintainer confirmed this decision on 2026-10-23 to make the technology
boundaries explicit for subsequent implementation work. Acceptance records the
choice; it does not certify that the implementation tasks below are complete.

## Decision

Use Bun 1.4.2, as declared in root `packageManager`, for dependency installation,
local application execution, watch mode, the current test runner and Vite+
commands. Keep dependency resolution in `bun.lock` and use frozen installs in CI.
The existing Compose environment remains a development/laboratory stack.

Bun availability in development does not authorize importing Bun-only APIs into
new shared production paths. Use Node-compatible APIs or an isolated adapter;
existing Bun-specific services must follow the separately accepted Node production
migration. Preserve the single root `.env` loader and explicit environment
validation. This ADR does not require rewriting every Bun test or moving bots
from Python.

## Consequences

- Existing scripts and lockfile remain usable locally; one declared Bun version prevents per-developer resolver drift.
- Bun tests alone do not prove Node deployment compatibility; both runtimes need targeted execution evidence for shipped paths.

## Implementation Plan

- **Affected paths**: `package.json`, `bun.lock`, `bunfig.toml`, `.github/actions/setup/action.yml`, application manifests, local Dockerfiles and Compose guides.
- **Dependencies**: Retain `bun@1.4.2` and the installed workspace dependency graph; no alternative package manager or second lockfile is introduced.
- **Patterns to follow and avoid**: Follow root environment loading in `packages/env/src/load.ts` and explicit workspace scripts. Avoid ambient dotenv loads and new Bun-only production dependencies.
- **Configuration**: Keep `packageManager`, the CI Bun setup, development image tags and lockfile aligned when upgrading; preserve `env = false` in root `bunfig.toml`.

The following local TODOs track implementation until they are linked to GitHub
work through the [contribution process](../../.github/CONTRIBUTING.md). This
record does not authorize deployment or a database migration.

- [ ] TODO ADR-0009.1: Keep frozen installs and documented local commands working with the declared Bun version.
- [ ] TODO ADR-0009.2: Label existing Bun containers as development/laboratory images when adding separate Node production targets.
- [ ] TODO ADR-0009.3: Add Node execution checks for shared production code as the production adapter migration proceeds.

### Verification

- [ ] `bun --version` matches `packageManager` and `bun install --frozen-lockfile --ignore-scripts` leaves the lockfile unchanged.
- [ ] `bun run --cwd packages/env test`, `bun run --cwd apps/api test` and `bun run --cwd apps/server test` pass.
- [ ] The local Compose integration test passes with synthetic data; the Node production build is independently verified before release.

## Alternatives Considered

These are tradeoff comparisons for this record, not a claim that a benchmark
or a historical evaluation was performed.

- Node.js plus npm for all development work would reduce runtime differences but require replacing the established Bun workspace/test/install workflow.
- Bun in every environment would remove the split-runtime test cost, but contradicts the confirmed production Node.js boundary.

## More Information

- **Implementation evidence at acceptance**: Bun package manager, local service images, tests and scripts are implemented; that evidence applies to development execution.
- **Related decisions and architecture**: [architecture sections 15.2–15.4](../../.github/ARCHITECTURE.md#152-shared-server-environment); Node production will be recorded in its own ADR.
- **Review again when**: the stated boundaries cannot be maintained, a required
  dependency becomes unsupported, or measured compatibility/operational results
  invalidate the choice. A replacement requires a linked superseding ADR.
