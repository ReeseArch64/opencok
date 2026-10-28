---
status: accepted
date: 2026-10-28
decision-makers: ReeseArch64
---

# ADR-0008: Adopt Effect for application composition and lifecycle

## Context and Problem Statement

API and realm applications coordinate configuration, listeners, database pools,
Redis and ZooKeeper. Partial startup, interruption and shutdown require explicit
resource ownership so listeners do not outlive their dependencies or leak them.

Effect is already implemented at these composition boundaries. The workspace
catalog pins `effect@4.0.6` and `@effect/platform-bun@4.0.6`;
`packages/core` owns runtime/resource/HTTP integration and `packages/env` owns
injectable configuration. This accepted catalog record names the technology and
its limits, not a new migration or fresh validation of historical test results.

## Decision

Adopt **Effect** for application composition, dependency injection, typed
boundary failures and scoped lifecycle. Use Context services and Layers for
application wiring, retaining constructor-injected Services and existing
Promise adapters behind their contracts.

Use one `EnvironmentLive` Layer per process, backed by the existing root `.env`
and explicit process-environment precedence. Zod remains the single boundary
validation definition; do not duplicate it with a parallel Effect Config schema.
Configuration failures expose invalid/missing key names, never their values.

Keep platform-specific runtime/HTTP integration in `packages/core`. Register
owned resources before asynchronous startup checks and release listeners before
dependencies. Promise compatibility entrypoints must dispose ManagedRuntime on
startup failure and offer idempotent close after success. Non-cancellable
acquisitions must finish under scoped ownership before interruption can release
them; adapters still require bounded I/O and cleanup on acquisition failure.

Preserve TCP ordering/backpressure, synchronous rules/codecs, persistence and
[architecture section 9 authority semantics](../../.github/ARCHITECTURE.md#9-authoritative-server-zookeeper-and-scaling).
Effect scope ownership does not grant database write ownership or make retries
of economic commands safe.

Non-goals: a gameplay rule framework rewrite, fibers per entity/numerical
operation, new command semantics, automatic retries of uncertain mutations,
new services or a production runtime mandate. Current Bun platform integration
is implementation evidence only; production runtime/provider selection remains
separate. No throughput, latency or production-suitability claim follows from adoption.

## Consequences

- Shared injectable configuration and scoped lifetimes make partial startup/shutdown testable without opening real dependencies; new composition must use the shared ownership helpers.
- Developers must understand scopes, interruption and Layer ownership. Resource ordering and repeated-disposal regressions require focused tests, not just type checks.
- Effect/platform integration upgrades can change lifecycle behavior; keep the selected versions aligned and review compatibility before updates.
- Pure rules and transport contracts stay reusable; wrapping a hot path in Effect requires separate suitability measurements rather than architectural preference.

## Implementation Plan

This record changes no source, configuration, dependency or environment variable.
The following plan governs separately authorized maintenance of existing usage.

- **Affected paths**: `packages/core/src/runtime.ts`, `resource.ts` and `http.ts`, `packages/core/tests/`, `packages/env/src/effect.ts`, `packages/env/tests/`, `apps/api/src/`, `apps/api/tests/effect.test.ts`, `apps/server/src/index.ts`, `apps/server/src/realm-composition.ts`, `apps/server/test/effect.test.ts`, application integration suites and component READMEs.
- **Dependencies**: Retain catalog-pinned `effect@4.0.6` and `@effect/platform-bun@4.0.6` with workspace `catalog:` references. Keep Zod, PostgreSQL, Redis and coordination adapters; no install, version update or lockfile change is authorized here.
- **Configuration**: Preserve existing per-application schemas/defaults, realm identity and server-only secrets. Keep one root environment snapshot per process and sanitized errors; no new environment settings or migrations.
- **Patterns to follow**: `EnvironmentLive`/`readEnvironment`, `acquireResource`/`fromPromise`, shared `runService`, app Context/Layer composition and existing ManagedRuntime compatibility boundaries. Keep packages independent of application imports.
- **Patterns to avoid**: Duplicate signal handlers, ambient configuration reads in application modules, raw driver causes/configuration values in logs, unconditional retries and infrastructure imports through pure rule entrypoints.

1. Maintain composition at existing entrypoints; inject synthetic Layers in tests rather than importing private environment or opening unrelated services.
2. Test every new resource acquisition for partial failure, interruption and cleanup ordering. Keep Promise I/O bounded; cancellation of a wrapper does not cancel arbitrary adapter work.
3. Preserve request/listener lifetime and protocol compatibility when changing HTTP/TCP integration; shutdown must not release dependencies under active bounded handlers.
4. For version/platform changes, review shared Core/Env and both applications together; separately evaluate runtime artifacts and representative load before any production or hot-path claim.

### Verification

These gates remain unchecked here; prior evidence is not a new test execution.

- [ ] Environment tests prove injection, process precedence, shared realm defaults and redacted validation failures without real secrets.
- [ ] Core tests prove reverse-order cleanup, partial acquisition failure, interruption and repeated disposal without leaked listeners/pools/clients.
- [ ] HTTP/socket tests preserve request bodies, existing limits and listener release; bounded in-flight handlers finish before dependency finalization.
- [ ] API/server synthetic suites preserve discovery, SFS field types/order and session backpressure; persistence/fencing remains unchanged.
- [ ] Real child-process tests cover SIGINT/SIGTERM cleanup and sanitized nonzero startup failures.
- [ ] `bun run --cwd packages/core test` and affected Env/API/server suites/types pass with root lint/format checks; no production runtime or performance claim is inferred.

## Alternatives Considered

- Promises plus shared configuration/lifecycle helpers: smaller conceptual surface and preserves adapters, but would replace the established shared Effect composition and require rebuilding scoped interruption/cleanup conventions.
- Pervasive Effect in rules, transport and persistence: offers uniform typed effects, but expands protocol/numerical risk and hot-path overhead without measurements; composition boundaries deliver the selected lifecycle benefits without that rewrite.
- NestJS as the composition runtime: familiar Controller/Service conventions, but adopting its container/framework would add a separate migration and dependency model; existing constructor injection does not require that runtime.

## More Information

Provenance: composition work previously recorded as ADR-0012. See
[shared lifecycle guidance](../../packages/core/README.md),
[environment injection](../../packages/env/README.md#effect-application-configuration)
and [current runtime status](../../.github/ARCHITECTURE.md#154-local-typescript-stack).
Revisit if upgrades change ownership/interruption guarantees or measured workloads
justify a different boundary; adopting Effect does not reopen gameplay design.
