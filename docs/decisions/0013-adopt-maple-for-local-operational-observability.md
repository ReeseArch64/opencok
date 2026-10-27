---
status: proposed
date: 2026-10-27
decision-makers: ReeseArch64
---

# ADR-0013: Adopt Maple for local operational observability

## Context and Problem Statement

The operator needs to follow successful operations, generated effects, failures and
processing delays in server and API from one local dashboard. Evlog already emits
filtered JSON, but console output alone does not provide indexed history, distributed
traces or latency metrics. Several background recovery loops previously suppressed
failures or emitted incomplete console records. A successful command also does not
prove that every deferred delivery completed.

The maintainer confirmed this implementation scope on 2026-10-27. Implementation is
authorized; formal acceptance of this completed record remains a maintainer action.
PostgreSQL remains authoritative under ADR-0002, Bun remains the development runtime
under ADR-0009, and shared runtime composition follows the proposed ADR-0012.

## Decision

Use the official `ghcr.io/mapletechlabs/maple:v0.3.0` container as the base for local server/API
operational logs, OpenTelemetry traces, exception groups, operation counters and
response/processing duration histograms. Retain `evlog@2.33.1` behind the shared
logging adapter. Send only redacted emitted events to the OpenTelemetry Protocol
(OTLP) HTTP exporters; use explicit instrumentation compatible with Bun.

Suspend adoption of Grafana, Loki, Prometheus, Axiom and Sentry for those signals
while the verification criteria below remain satisfied. These tools have no accepted
technology ADR being superseded and no deployed integration is removed. Replace the
previous Grafana/Loki/Prometheus target in maintained architecture documentation.
Revisit this suspension when Maple cannot satisfy a required signal or capacity.

Every instrumented operation emits a start and a terminal event, including success.
Record elapsed milliseconds, controlled operation/reason, result counts where known,
request/connection/job identifiers and active trace/span identifiers. Retain all
emitted events and sample all spans. Record CPU time, resident memory and uptime as
process metrics. Use bounded operation names and exclude identifiers from metric
labels. Long-running asynchronous operations emit `operation_slow` after 1000 ms by
default; active-operation counters make unfinished work visible.

Instrument the concrete services, domains, controllers and persistence/publication
adapters composed by server/API. Preserve synchronous return values, exceptions,
constructor injection and wire contracts. Observe PostgreSQL statements at the owned
client boundary without recording SQL or parameters. Expose only schema-allowlisted
table names, statement kinds and affected-row counts. Record worker runs and swallowed
background failures through the same logger. Record generated avatar bytes and frames
queued to TCP without exporting their contents. A queued frame is not a delivery ack.

Use transaction-local deferred events for confirmed effects. Publish their operational
records only after the enclosing transaction commits; discard them on rollback.
Existing receipts, economic postings and outbox remain the durable audit foundation.
Persist W3C trace context in a nullable `mutation_outbox.traceparent` column so relay
retries can continue the originating trace after process restart. Old rows remain
valid without a parent. An opaque mutation fingerprint connects related records
without exposing player or command-receipt identities.

### Scope and non-goals

This decision covers the maintained server/API composition and their shared adapters,
not every CPU instruction or pure numerical expression. New application boundaries
must use the shared observation helpers. Request/response bodies, credentials, player
identities, arbitrary URLs, SQL and raw exception messages/stacks stay excluded.
Maple groups controlled exception metadata; this does not authorize exporting raw
exception objects. Private mobile inputs are unaffected.

Maple Local has no native alert scheduler. This decision provides searchable recent
failures and slow-operation events, not push notifications or an incident-response
SLA. Host/container scraping, browser replay and Chat/bot telemetry export are separate
work. Production sizing and deployment remain unverified.

## Consequences

- One local dashboard can search logs and navigate to related spans, exception groups
  and duration metrics. Integration tests must keep proving every required signal.
- Full event/span retention increases CPU, network and disk use. Measure representative
  traffic before production admission; do not claim a performance budget without load
  evidence. Use 20 MiB container-log rotation with five files for server/API/Maple.
- Export asynchronously every 1000 ms by default with 8192-record bounded log/span
  queues, 256-record batches and bounded exporter timeouts. Export failure produces a
  controlled local diagnostic, rate-limited to once per five seconds. Application
  progress does not wait for Maple. Export failure, queue saturation or abrupt process
  death can lose operational telemetry; emitted records are not a durable-delivery
  guarantee. Transactional audit is independent.
- Maple keeps telemetry on the `maple-data` volume, serves the bundled offline UI and
  disables its own outbound telemetry/update checks. Bind its port to host loopback.
  Separate ingest/read credentials; documented development defaults must be replaced
  with independently generated values before sharing access.
- Maple uses FSL-1.1-ALv2, with each release converting to Apache-2.0 after two years.
  It is source-available with use restrictions, rather than unrestricted current
  Apache-licensed software. Hosting still consumes operator hardware and maintenance.
- A clean restart retains data. The upstream entrypoint restores checkpoints or starts
  fresh after an unclean stop; recent telemetry can be lost. Back up the volume and
  consult upstream recovery instructions before upgrades.

## Implementation Plan

- **Affected paths**: `packages/core/src/{logging,operation,telemetry,telemetry-scope,
  transaction,fetch,polling-worker,resource}.ts`, `packages/env/src/telemetry.ts`,
  `packages/drizzle/src/{client,observed-client}.ts`, the outbox schema and migration
  `0044_mutation_trace_context.sql`, `packages/repositories/src/mutation.ts` and direct
  outbox writers, `packages/api/src/files.ts`, `packages/connection/src/`,
  `apps/{api,server}/src/`, `packages/constants/src/logged-commands.ts`, `docker-compose.yml`, `.env.example`, package manifests,
  `bun.lock`, component guides and observability tests.
- **Dependencies**: pin `@opentelemetry/api@1.10.0`; context-async-hooks, core,
  resources, sdk-trace, sdk-metrics and sdk-logs at `3.0.0`; HTTP trace/log/metric
  exporters at `0.300.0`. Keep these mutually compatible. No Axiom/Sentry or
  Grafana/Loki/Prometheus exporter is introduced.
- **Patterns**: initialize telemetry before app resources in the existing Effect
  scope and flush it after listener/worker cleanup. Apply `observeAdapter` at
  composition boundaries, `observeOperation` to explicit workflows, `observeJob`
  to detached recovery ticks and `observedFetch` to outgoing HTTP. Use
  `observeTransaction` and `afterCommit` for effect records. Preserve injected HTTP
  adapters and typed synchronous methods. Add no source comments.
- **Configuration**: optional `OTEL_EXPORTER_OTLP_ENDPOINT`,
  `MAPLE_LOCAL_INGEST_KEY`, `OTEL_EXPORT_INTERVAL_MS` (1000–60000 ms),
  `OTEL_SLOW_OPERATION_MS` (100–60000 ms), `NODE_ENV` and Compose-only
  `MAPLE_LOCAL_ACCESS_TOKEN`/`MAPLE_PORT`. Without an endpoint, retain local JSON
  output. Compose points both apps to `http://maple:4318` and publishes the UI on
  `127.0.0.1:4318` by default. Maple is not a gameplay readiness dependency.
- **Migration**: apply the additive realm migration before running code that reads or
  writes the outbox context column. Rebuild server/API. Do not reset player data or
  repurpose outbox payloads for telemetry. No previous observability data is migrated.

### Verification

- [x] Core tests preserve synchronous methods/private fields and propagate thrown values.
- [x] Core tests isolate concurrent request/job contexts and discard rolled-back effects.
- [x] OTLP receiver tests assert redacted correlated logs, parented spans, exception
      events and duration metrics without identifier labels.
- [x] `bun run --cwd packages/core test:maple` proves both service names have stored
      logs, traces, error events and histograms, checks log/span correlation, rejects
      unauthenticated queries and verifies telemetry survives a clean container restart.
- [x] Full isolated Compose tests prove the actual API/server export into Maple.
- [x] API/server/core/env/drizzle/repositories/connection/storage and stack type checks pass.
- [x] Relevant unit/contract, schema snapshot and migration tests pass.
- [x] `bun run lint`, `bun run format:check` and frozen installation pass.

## Alternatives Considered

- Grafana/Loki/Tempo/Prometheus with Alloy offers separate specialized backends and
  broader infrastructure monitoring, but requires operating more components for the
  operator's immediate single-dashboard local investigation requirement.
- Axiom plus Sentry provides managed log search and error investigation, but introduces
  external data destinations, quotas and multiple systems. Keep both suspended while
  Maple passes the required local signal checks.
- Console-only Evlog is smaller and already present, but does not satisfy historical
  querying, trace navigation or metric exploration. Retain it as local output/fallback.

## More Information

Related: [ADR-0002](0002-adopt-postgresql-for-authoritative-state.md),
[ADR-0009](0009-adopt-bun-for-development.md),
[ADR-0012](0012-adopt-effect-for-service-composition.md),
[operational design](../architecture/operations.md#12-observability-evelog-and-search),
[Maple self-hosting](https://maple.dev/docs/self-hosting/),
[Maple source at v0.3.0](https://github.com/MapleTechLabs/maple/tree/v0.3.0),
[Maple license](https://github.com/MapleTechLabs/maple/blob/v0.3.0/LICENSE).

Revisit on missing required signals, sustained export loss, unacceptable ingestion
lag/overhead, production admission, multi-tenant/replica requirements or the need for
native automatic alerting. ADR acceptance and implementation evidence remain separate.

### Implementation evidence — 2026-10-27

The official image was resolved to multi-platform digest
`sha256:9204abf35cfb458851a609794329cf52ea5968b2e7d8e7903301c7d41b4e3df6`.
A disposable real container stored all four required signal categories for `server`
and `api`, joined their log/span identifiers and retained them across a clean restart.
Automated OTLP tests also verify exported redaction and bounded metric dimensions.
Representative production load and automatic alerting are not established by this
local validation.

Final validation passed: 1700 application/core/environment/boundary tests, 1700 schema
contract tests including 849 snapshots, 78 focused regression checks, the real Maple
integration, all 17 isolated Compose scenarios, affected workspace/stack type checks,
lint, formatting and frozen installation. The isolated stack now injects synthetic
catalogs before bundling; runtime source mounts cannot override the compiled server.
The scenario retains its original cache, rejection-code, balance and idempotency checks.

### Dashboard CSP compatibility workaround

The v0.3.0 dashboard requires WebAssembly but its `script-src 'self'` policy blocks
compilation. A version-specific derived image adds only `'wasm-unsafe-eval'` to that
directive. It retains all other policies, the official entrypoint and storage layout;
JavaScript string evaluation remains prohibited. An amd64 executable checksum guard,
exact policy matching and equal-length replacement prevent accidental
patching of a different binary. Unsupported architectures fail closed. This avoids a
new proxy service or exposing telemetry through the gameplay gateway.

The [workaround guide](../../infra/observability/maple/README.md) records validation,
activation and removal criteria. A disposable host process rendered the authenticated
dashboard in Chromium and allowed WebAssembly while still blocking JavaScript string
evaluation. Docker build/activation and the updated container integration remain
unverified; the earlier container evidence above does not validate this derived image.
