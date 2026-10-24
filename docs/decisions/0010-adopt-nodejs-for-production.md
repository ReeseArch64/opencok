---
status: deprecated
date: 2026-10-23
decision-makers: ReeseArch64
---

# ADR-0010: Adopt Node.js for production service execution

## Context and Problem Statement

The maintainer explicitly selected Node.js for production and Bun for
development. Earlier target architecture passages assume Bun in production.
Current API/server images execute Bun, HTTP handlers use `Bun.serve`, resource
loading uses `Bun.file` and Redis adapters import `RedisClient` from `bun`.
Changing the image alone cannot make these services run on Node.js.

The maintainer confirmed this decision on 2026-10-23 to make the technology
boundaries explicit for subsequent implementation work. Acceptance records the
choice; it does not certify that the implementation tasks below are complete.

## Decision

Run production JavaScript/TypeScript backend services on a supported Node.js
LTS release. Start the compatibility migration against the existing CI Node 22
major baseline; before deployment verify it is still supported, select/pin the
exact security patch and container digest, or move CI and production together to
a supported LTS major. The image/patch selection is a release prerequisite, not
an implicit floating production tag.

Build Node-compatible JavaScript artifacts and execute them with `node`; do not
rely on development Bun globals, TypeScript stripping or Bun's module resolver.
Keep Bun as the development package manager/test tool. Production deployments
must pass the same protocol, persistence, shutdown and numeric-equivalence checks
on Node before promotion. Python bots and provider-managed frontend runtimes are
outside this service-runtime decision.

This supersedes earlier Bun-production assumptions in the architecture, while
preserving historical Bun experiments and the current development stack. It does
not claim that Node production images or adapters already exist.

## Consequences

- A defined production runtime gives dependency and deployment work a common target; build artifacts and shared packages need explicit Node-resolvable exports.
- Adapters, runtime typing, tests and combat numeric validation must be migrated; production rollout is blocked until their verification passes rather than falling back silently to Bun.

## Implementation Plan

- **Affected paths**: `apps/api/src/{index,app,servers,storage}.ts`, `apps/server/src/{server,infra}.ts`, `apps/server/src/game/rules.ts`, application Dockerfiles/manifests, `packages/config/`, production-used package exports, `.github/workflows/`, `.github/ARCHITECTURE.md`.
- **Dependencies**: Use Node 22 as the existing CI compatibility baseline, with a supported exact production image/patch selected at release. Select/pin a Node-compatible Redis client before adapter work; retain `pg@8.23.1` and `drizzle-orm@0.45.4` initially. No new dependency is installed by this record.
- **Patterns to follow and avoid**: Preserve versioned SFS/HTTP contracts, bounded dependency operations, validated configuration and owned pool cleanup. Replace Bun APIs at composition boundaries; do not rewrite gameplay rules or broaden database privileges.
- **Configuration**: Add production build configs/scripts with Node-compatible module resolution and emitted `.js` imports/exports. Separate production Node typings from Bun development/test typings; keep the root `.env` convention and explicit environment injection.

The following local TODOs track implementation until they are linked to GitHub
work through the [contribution process](../../.github/CONTRIBUTING.md). This
record does not authorize deployment or a database migration.

- [ ] TODO ADR-0010.1: Select/pin the Node image and Redis client; define production build/exports for deployed workspaces, retaining a single Bun lockfile.
- [ ] TODO ADR-0010.2: Replace Bun HTTP/file/Redis dependencies with Node-compatible adapters, preserving readiness, timeouts, token-checked sessions and shutdown cleanup.
- [ ] TODO ADR-0010.3: Add separate Node production Docker targets and CI execution of built artifacts; keep the working Bun development images available.
- [ ] TODO ADR-0010.4: Run synthetic HTTP discovery, SFS login/city/map, PostgreSQL/Redis outage, restart and cross-kingdom checks under Node; verify relevant combat numeric vectors per runtime before rollout.
- [ ] TODO ADR-0010.5: Publish a reversible image rollout procedure with unchanged data contracts; retain the previous release for rollback without database resets.

### Verification

- [ ] Production images execute `node` on emitted JavaScript and start without a Bun executable or Bun globals.
- [ ] Build output contains Node-resolvable package/import paths and deployed entrypoints import no `bun` module.
- [ ] Synthetic HTTP/SFS contract suites and dependency/shutdown tests pass against the built Node services, not only Bun-run source tests.
- [ ] Both kingdoms preserve synthetic state across restart and rollback; numeric compatibility vectors pass on the pinned production runtime where combat is enabled.

## Alternatives Considered

These are tradeoff comparisons for this record, not a claim that a benchmark
or a historical evaluation was performed.

- Bun production would reuse current adapters but contradicts the selected production runtime and does not eliminate the need for release validation.
- Deno would require another runtime/adapter transition without satisfying the explicit Node.js deployment choice.

## More Information

- **Implementation evidence at acceptance**: Only a Node 22 tooling setup exists in CI; services and Dockerfiles still execute Bun. Node production migration remains pending.
- **Related decisions and architecture**: [ADR-0009](0009-adopt-bun-for-development.md); [architecture](../../.github/ARCHITECTURE.md); [Node.js production release policy](https://nodejs.org/en/about/previous-releases).
- **Review again when**: the stated boundaries cannot be maintained, a required
  dependency becomes unsupported, or measured compatibility/operational results
  invalidate the choice. A replacement requires a linked superseding ADR.

### 2026-10-24: Suspend the production Node.js mandate

The maintainer explicitly suspended this decision. Status is `deprecated`, the
existing lifecycle status for a decision that no longer governs new work. The
original decision and unchecked implementation plan above remain historical;
Node migration and rollout prerequisites are suspended, not completed.

No replacement production runtime is selected. Existing Bun development images
and tests remain valid development evidence only. Reinstating a production
runtime mandate requires a reviewed decision and deployment verification.
ADR-0009 and ADR-0011 references to this mandate must be read with this update;
their development-tooling and TypeScript constraints remain active.
