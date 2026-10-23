---
status: proposed
date: 2026-10-23
decision-makers: ReeseArch64
---

# ADR-0012: Adopt Effect for API and realm service composition

## Context and Problem Statement

The maintainer requested migrating both API and game server to Effect with shared
configuration, contingent on suitability for the game server. Both applications
currently compose asynchronous adapters and duplicate signal/resource ownership.
The realm uses ordered TCP SmartFoxServer (SFS) sessions with backpressure, while
rules and codecs are synchronous domain packages. Those contracts must survive
this migration. This record documents the authorized implementation; its proposed
status leaves formal ADR acceptance to the maintainer.

## Decision

Use catalog-pinned `effect@4.0.6` for application services, dependency injection,
configuration loading and scoped resource ownership. Isolate the development
process runner and HTTP server in `packages/core`, using
`@effect/platform-bun@4.0.6`. Both applications consume that same foundation.
Keep Zod boundary validation under ADR-0011: `packages/env` supplies a lazy,
injectable environment snapshot and Effect-returning validation, preserving the
root `.env`, explicit process precedence, existing defaults and safe diagnostics.
Share schema primitives rather than maintain a second Effect Config schema.

API and realm composition use Context services and Layers. Register owned pools
before asynchronous startup checks; finalize listeners before their dependencies.
Wrap existing Promise adapters at composition boundaries with sanitized typed
failures. Acquisitions that cannot be cancelled must finish under acquireRelease
before interruption can release their resources.

The TCP session ordering, backpressure, persistence and rule engines retain their
current implementations. Effect manages the realm lifetime without introducing a
fiber per entity or numerical operation. This is a suitability boundary, not a
performance claim; representative load measurements remain necessary before
moving simulation hot paths into Effect.

## Consequences

- Shared loading and lifecycle code remove duplicated process hooks and make
  configuration and cleanup independently injectable in tests.
- Developers must understand scopes, interruption and Layer ownership. Regression
  tests cover acquisition failure, interruption, shutdown and HTTP compatibility.
- Effect HTTP/platform modules are unstable APIs even in this release. Pin both
  versions together and re-run compatibility suites when upgrading.
- Bun Redis and existing development images remain. Production Node artifacts,
  adapters and deployment verification still follow ADR-0010 as separate work.

## Implementation Plan

- **Affected paths**: `packages/env/src/{effect,service.schema}.ts`,
  `packages/core/src/`, `apps/api/src/`, `apps/server/src/`, root/workspace manifests,
  `bun.lock`, affected tests, CI workflows and component guides.
- **Dependencies**: catalog `effect@4.0.6`, `@effect/platform-bun@4.0.6`;
  retain existing Zod, database and TCP adapters.
- **Pattern**: one EnvironmentLive Layer per process; app-specific configuration
  services consume it; use scoped Layers for long-lived services and Effect at
  entrypoints. Promise compatibility entrypoints must dispose their ManagedRuntime
  on startup failure and expose an idempotent close on success.
- **Avoid**: ambient config imports in apps, duplicated process signal handlers,
  logging driver causes or configuration values, gameplay rewrites and retries of
  potentially stateful commands.
- **Configuration**: no new variables, port defaults, protocol fields or database
  migrations. Keep independent API and realm settings and shared realm identity.

### Verification

- [ ] Environment tests cover injection, shared realm defaults and redacted failures.
- [ ] Core tests cover reverse-order cleanup and interruption during acquisition.
- [ ] HTTP tests exercise real sockets, request bodies and listener release.
- [ ] API/server unit and synthetic integration suites preserve discovery and SFS contracts.
- [ ] Process tests verify SIGINT/SIGTERM cleanup and nonzero sanitized failures.
- [ ] Lint, format, package boundaries and affected workspace type checks pass.

## Alternatives Considered

- Retaining Promises with a shared config helper is smaller but leaves resource
  ownership and process lifecycle duplicated and does not meet the requested
  common Effect foundation.
- Rewriting all domain/transport/storage packages into Effect immediately would
  offer pervasive typed effects but greatly expands protocol and numerical risk.
  Restricting this migration to service composition provides the requested shared
  configuration without changing the simulation model.

## More Information

Related: [ADR-0009](0009-adopt-bun-for-development.md),
[ADR-0010](0010-adopt-nodejs-for-production.md),
[ADR-0011](0011-adopt-typescript-for-application-code.md).
The [Effect runtime documentation](https://effect.website/docs/v4/runtime) and
[platform overview](https://effect.website/docs/v4/platform/introduction) describe
these integration boundaries. Revisit when measured throughput/latency regresses,
when Node production adapters land, or when an Effect upgrade changes ownership.
