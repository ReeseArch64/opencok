---
status: accepted
date: 2026-10-28
decision-makers: ReeseArch64
---

# ADR-0004: Adopt Maple

## Context

Operators need local indexed history, traces and metrics for operations, effects and
failures beyond console JSON. Provenance: former ADR-0013 and its dashboard workaround.
Current implementation: [Core](../../packages/core/README.md#operational-logging) and
[Maple guide](../../infra/observability/maple/README.md). Acceptance does not certify
this tree, image activation, production capacity or deployment.

## Decision

Adopt Maple Local for filtered logs, OpenTelemetry traces, controlled exception groups,
operation/duration/process metrics. Retain Evlog and explicit Bun-compatible adapters.
Suspend Grafana/Loki/Prometheus/Axiom/Sentry for these signals while requirements hold;
no deployed integration/data is removed. Preserve API/server instrumentation, local Chat
logging and filtered gateway OTLP logs/metrics; gateway tracing stays disabled.

Emit start/terminal events, elapsed time, bounded operation/reason names, counts and
opaque request/job/trace identifiers. Sample all spans and retain all emitted events subject
to export/storage bounds, not durable delivery. No identifier metric labels. Observe
boundaries, not every instruction. Exclude payloads, credentials, tokens, device/player
identities, arbitrary URLs, SQL/parameters and raw exception messages/stacks. Use
allowlisted statement/table/count metadata and controlled errors. Buffer confirmed effects
until commit, discard on rollback and continue nullable outbox `traceparent` across retries.
Prepared/queued is not committed/delivered. Receipts, economic postings and transactional
outbox remain authoritative audit, independent of telemetry.

Maple Local has no automatic alert scheduler.
**Non-goals:** automatic alerting/notifications, incident SLA, production rollout/sizing,
scraping, replay, blanket Chat/Bot export, dependencies, stack changes, migrations or transfers.

## Consequences

- Measure load before production. Export asynchronously every 1000 ms: 8192-record
  log/span queues, 256-record batches, bounded timeouts and diagnostics once per five
  seconds at most. Loss is possible; Maple must never gate gameplay readiness/progress.
- Preserve `maple-data`, 20 MiB/five-file log rotation and flush after app cleanup.
  Clean restart is not crash-loss immunity: back up/review recovery before upgrades;
  never reset player/telemetry volumes.
- Require loopback/private access, separate ingest/read secrets, independently generated
  credentials and disabled Maple telemetry/update checks. Current Compose publishes
  `4318:4318` without loopback binding; correction/enforcement needs separate scope.
- FSL-1.1-ALv2 converts each release to Apache-2.0 after two years: v0.3.0 is
  source-available with restrictions, not unrestricted Apache today; hosting has costs.

## Implementation Plan

- **Paths:** retain `packages/core/src/{logging,operation,telemetry,transaction}.ts`,
  `packages/env/src/telemetry.ts`, `packages/drizzle/src/observed-client.ts`,
  `packages/drizzle/src/schema/opencok_kingdom/mutation_outbox.ts`,
  `packages/repositories/src/mutation.ts`, app composition and `docker-compose.yml`.
  Schema rollout precedes code needing trace context; no migration/reset/replay here.
- **Dependencies:** retain `evlog@2.33.1`, `@opentelemetry/api@1.10.0`, SDK/core/
  context/resources at 3.0.0, HTTP exporters at 0.300.0 and `bun.lock`; retain derived
  `opencok-maple:v0.3.0-csp1` from official v0.3.0. Assess upgrades separately.
- **Patterns:** initialize SDK before resources; use `observeAdapter`, `observeOperation`,
  `observeJob`, `observedFetch`, `observeTransaction` and `afterCommit`, preserving
  synchronous behavior, injection, bounded I/O and wire contracts; no comments.
- **Configuration:** validate optional `OTEL_EXPORTER_OTLP_ENDPOINT`, ingest key,
  `OTEL_SLOW_OPERATION_MS` (100–60000; default 1000) and `NODE_ENV`; retain JSON without
  endpoint. Env schema fixes export interval at 1000 ms. Keep read credentials separate.
- **Follow-up:** preserve checksum/architecture/exact-match/size guards in
  `infra/observability/maple/{Dockerfile,patch-csp.ts}`: only `wasm-unsafe-eval`, not JS
  string evaluation; unsupported architectures fail closed. Verify image/dashboard before
  activation; remove patch only after equivalent upstream checks. Scope access fixes separately.

### Verification

- [ ] Core/OTLP tests preserve synchronous behavior, concurrent context isolation,
      redaction, bounded metric dimensions and rollback-discarded effects.
- [ ] `bun run --cwd packages/core test:maple` on disposable authorized Docker resources
      proves built-image CSP, authenticated signals/correlation and clean restart retention.
- [ ] Synthetic integration proves actual API/server export and outbox trace continuation;
      dependency/export failure never blocks essential gameplay.
- [ ] Inspect effective binding/authentication, disabled outbound telemetry, shutdown/log
      bounds and absence of protected fields. Test actual dashboard, not only login/CLI.
- [ ] Affected type/tests, lint and formatting pass; assess production load, crash recovery
      and alerting requirements separately before release.

## Alternatives

Tradeoffs, not claims of additional historical evaluations:

- Grafana/Loki/Tempo/Prometheus offers infrastructure coverage but requires more components.
- Axiom/Sentry offers managed search/errors but adds quotas and external destinations,
  requiring separate transfer authorization. Console-only Evlog is simpler but lacks indexed
  history/traces; retain it as fallback, not the sole investigation tool.

Revisit for missing signals, loss/lag, overhead, multi-replica needs, license changes,
production admission or required automatic alerting. Historical checks are not new proof.
