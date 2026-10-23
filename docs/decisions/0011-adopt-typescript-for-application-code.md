---
status: accepted
date: 2026-10-23
decision-makers: ReeseArch64
---

# ADR-0011: Adopt TypeScript for application and shared package code

## Context and Problem Statement

The monorepo already uses TypeScript application sources, shared workspace
packages, strict compiler settings and Zod configuration validation. A language
boundary is needed so future services share contracts without treating compile-time
types as validation of untrusted protocol or environment data.

The maintainer confirmed this decision on 2026-10-23 to make the technology
boundaries explicit for subsequent implementation work. Acceptance records the
choice; it does not certify that the implementation tasks below are complete.

## Decision

Use TypeScript for maintained JavaScript-targeted applications and shared
packages. Extend `packages/config/tsconfig.base.json` and preserve strictness,
checked indexed access, unused symbol checks and explicit contract boundaries.
Keep the catalog TypeScript baseline (`^7.0.2` with a committed lockfile) and use
Zod/runtime schemas where input crosses trust boundaries.

Development execution follows Bun; deployed backend execution follows Node.js.
TypeScript source acceptance does not prove a production artifact can resolve its
imports. Production build settings must implement the Node runtime decision.
Preserve Python bots, authorized legacy references and any separately approved
future Flutter/Rust/Go experiments; this is not a mandate to rewrite them.

## Consequences

- Shared compiler and contract conventions make cross-package changes checkable; runtime validators remain necessary for external inputs.
- A source-oriented monorepo still needs explicit production build/module boundaries and runtime-specific types; empty scaffold packages must not be mistaken for implemented services.

## Implementation Plan

- **Affected paths**: `packages/config/tsconfig.base.json`, root/workspace `tsconfig.json` and `package.json`, `apps/api/`, `apps/server/`, `packages/env/`, `packages/drizzle/`, future implemented TypeScript workspaces.
- **Dependencies**: Retain catalog `typescript@^7.0.2`, `zod@^4.6.7` and the lockfile; current development/test types use `@types/bun@^1.4.3`. Add matching Node types and build configs only as part of ADR-0010 implementation.
- **Patterns to follow and avoid**: Follow strict shared settings and validated `packages/env` schemas; keep domain/transport/persistence boundaries from the architecture. Avoid broad `any`, unvalidated JSON assertions and weakening strictness to pass a build.
- **Configuration**: Each implemented workspace declares a type-check command. Production configs must scope Node versus Bun typings and emit compatible imports without weakening source checking.

The following local TODOs track implementation until they are linked to GitHub
work through the [contribution process](../../.github/CONTRIBUTING.md). This
record does not authorize deployment or a database migration.

- [ ] TODO ADR-0011.1: Keep implemented workspace configurations extending the shared base and runtime schemas validating boundary data.
- [ ] TODO ADR-0011.2: Repair the existing root `check-types` script, which calls unavailable `vp check-types`, in a separate implementation change that checks implemented workspaces without failing on empty scaffolds.
- [ ] TODO ADR-0011.3: Add production emit configurations and Node type scopes through ADR-0010; enforce implemented-workspace type checks in CI.

### Verification

- [ ] `bunx --no-install tsc --noEmit -p tsconfig.json` and each implemented workspace type check pass: env, drizzle, API and server.
- [ ] Runtime boundary tests reject malformed configuration and protocol input even when payloads arrive as unchecked JSON.
- [ ] A repaired root type-check command rejects a deliberate type error in an implemented workspace while treating empty scaffolds explicitly.

## Alternatives Considered

These are tradeoff comparisons for this record, not a claim that a benchmark
or a historical evaluation was performed.

- Plain JavaScript removes a compiler step but would discard the existing shared type contracts and strict cross-package checks.
- Rewriting backend services in Go or Rust could suit a measured specialized workload, but would require new contracts/build tooling and is not the selected application language.

## More Information

- **Implementation evidence at acceptance**: TypeScript source, catalog, strict base configuration and workspace checks exist; the root aggregate script and production emit boundary require follow-up.
- **Related decisions and architecture**: [ADR-0009](0009-adopt-bun-for-development.md), [ADR-0010](0010-adopt-nodejs-for-production.md); [architecture sections 3–4](../../.github/ARCHITECTURE.md#3-applications-and-responsibility-boundaries).
- **Review again when**: the stated boundaries cannot be maintained, a required
  dependency becomes unsupported, or measured compatibility/operational results
  invalidate the choice. A replacement requires a linked superseding ADR.
