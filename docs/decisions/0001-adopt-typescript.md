---
status: accepted
date: 2026-10-28
decision-makers: ReeseArch64
---

# ADR-0001: Adopt TypeScript

## Context

OpenCoK already maintains JavaScript-targeted applications and shared packages in
TypeScript. Shared contracts need strict semantic checks, while environment,
protocol and persistence inputs still require runtime validation. The stack-only
catalog consolidates the language choice without selecting a deployment runtime.

Provenance: former ADR-0011 and its dated Bot/runtime corrections, plus former
ADR-0015's build discussion. The compiler evaluation infrastructure was removed;
its proposed selection policy and historical checks are not current CI coverage.
Current authority is visible in `packages/config/tsconfig.base.json`, workspace
manifests and the [environment package](../../packages/env/README.md).
Acceptance records the choice, not completed implementation or verification.

## Decision

Use TypeScript for maintained JavaScript-targeted applications and shared packages,
including the planned `apps/bot`. Extend the shared strict compiler base; retain
checked indexed access, unused-symbol checks and explicit package contracts.
Use runtime schemas, currently Zod, at trust boundaries. Static types, assertions
and successful transpilation do not validate untrusted data or authorization.

Keep semantic checking separate from application bundling. API, Chat, server and
Web retain their current Bun CLI builds and source-oriented workspace exports;
this does not mandate one future bundler for every application. Development uses
[Bun](0002-adopt-bun.md); the former Node production mandate is suspended and no
production runtime is selected.

**Non-goals:** no runtime migration, compiler pilot restoration, new dependencies,
legacy/client rewrite, application implementation or deployment. Bot language
selection does not create Bot: future commands must authenticate players, enforce
quotas and delegate through authorized services, with no direct database authority.
Internal non-player-character simulation remains realm-owned.

## Consequences

- Shared strict settings make cross-package contract errors detectable; keep runtime
  rejection tests alongside compile-time checks rather than replacing either.
- Source exports and Bun-run tests do not certify deployed module resolution;
  validate emitted artifacts and runtime-specific adapters before promotion.
- The root `check-types` script currently invokes `vp check-types`; do not assume
  it aggregates workspace checks. Repair separately, treating empty scaffolds explicitly.

## Implementation Plan

- **Paths:** retain `packages/config/tsconfig.base.json`, root/workspace
  `tsconfig.json` and manifests; apply the same base to future implemented workspaces.
  Boundary validation lives in `packages/env/` and domain `validations/`/`mappings/`.
- **Dependencies:** retain catalog `typescript@^7.0.2`, `zod@^4.6.7`,
  `@types/bun@^1.4.3` and `bun.lock`; add no compiler, validator or runtime typings here.
- **Patterns:** follow injectable configuration and schema-derived contracts in
  `packages/env/`. Keep packages independent of apps; preserve source exports,
  public aliases, native wire field types/order and persistence authority boundaries.
- **Avoid:** broad `any`, unchecked JSON assertions, weakened strictness, browser
  imports of server configuration, and assuming successful emit is a semantic check.
- **Follow-up:** separately scope root check aggregation and any artifact/runtime
  changes; retain current application build commands and synthetic contract fixtures.

### Verification

- [ ] `bunx --no-install tsc --noEmit -p tsconfig.json --incremental false` passes.
- [ ] Each implemented workspace passes its `check-types` command (Web: `check:types`);
      a deliberate type error in an isolated synthetic copy fails semantic checking.
- [ ] Environment/protocol tests reject malformed input and unauthorized operations
      without leaking values; package contracts preserve wire names, types and order.
- [ ] Moved synthetic bundles resolve only the deployed environment, include required
      assets and pass affected workflow tests independently of source execution.

## Alternatives

These are tradeoff comparisons, not claims of historical trials or measurements.

- Plain JavaScript avoids compiler configuration but loses the existing strict
  cross-workspace contract checks; retain TypeScript for maintained application code.
- Go or Rust can suit specialized measured workloads, but a general rewrite adds
  build and contract boundaries without satisfying the current shared-language goal.

Revisit for unsupported syntax/tooling or a separately approved workload/runtime change.
