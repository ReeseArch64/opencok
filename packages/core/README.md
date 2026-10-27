# Shared Effect service runtime

`@opencok/core` implements the common process and resource conventions proposed in
[ADR-0012](../../docs/decisions/0012-adopt-effect-for-service-composition.md).
Both development services use Effect 4.0.6 from the workspace catalog.

`runtime` runs a fully provided application Effect through BunRuntime. SIGINT and
SIGTERM interrupt its main fiber and await scope finalizers. Failure exits nonzero
and emits the service name; raw Effect causes and defects are not logged.
`resource` bridges Promise acquisitions with sanitized ResourceError operations and
acquireRelease ownership. Acquisition is uninterruptible until ownership is
registered; adapters must bound their I/O and clean up resources when acquisition
itself fails. Finalizer failures propagate after remaining finalizers execute.

`http` adapts a Fetch handler to Effect's scoped Bun HTTP server, preserving the
64 KiB body limit and 20-second idle timeout. The listener closes before an outer
scope releases request dependencies. Promise handlers finish before their request
fibers can be interrupted, so shutdown cannot close dependencies underneath an
active adapter call. Adapters must retain bounded I/O timeouts. Platform imports stay here so the future
Node runtime transition has one application integration boundary. Existing Bun
Redis adapters and production artifacts still require ADR-0010 work.

Application services use Context and Layer; packages never import application
configuration. Tests can provide Layer.succeed values without loading private
configuration or opening real dependencies.

Run `bun run --cwd packages/core test` and
`bun run --cwd packages/core check-types` to verify the foundation. These tests
include actual HTTP sockets, scoped cleanup and signal-driven child processes.

## Operational logging

The operator selected [Evlog](https://www.evlog.dev/learn/overview) to make local
server testing observable. `logging` is the shared adapter around the pinned
`evlog@2.33.1` dependency. Composition roots call `initializeLogging(service)`;
packages use `logEvent` and `withLogContext`. The adapter uses Node-compatible
AsyncLocalStorage and keeps the logger dependency behind one package export.
This preserves the Bun development and Node production boundaries in
[ADR-0009](../../docs/decisions/0009-adopt-bun-for-development.md) and
[ADR-0010](../../docs/decisions/0010-adopt-nodejs-for-production.md).

Service entrypoints emit newline-delimited JSON with timestamp, service,
environment, event and level. `info` records normal activity, `warn` records
controlled rejections, and `error` records unexpected or dependency failures.
Successful operations carry `outcome: "success"`; success is an outcome rather
than a separate severity. `durationMs` measures the operation, independently of
Evlog's logger construction duration. Logging keeps all emitted events for local
testing. HTTP probes emit request events; periodic realm dependency checks emit
readiness transitions instead of repeated healthy dependency events.

HTTP requests get generated `requestId` values returned in `X-Request-ID`.
These opaque IDs use `req_` followed by UUID hex digits so automatic redaction
cannot mistake digit-heavy UUID segments for payment card numbers.
Nested API adapters reuse the request context and emit one HTTP completion event.
TCP sessions get generated `connectionId` values and a fresh `operationId` per
packet. Known command names come from `packages/constants/src/logged-commands.ts`; update this
controlled registry alongside new handlers. Command starts and completions are logged; unknown names use `unknown` and a bounded
SHA-256 fingerprint. Repeated command failures remain visible. Chat WebSocket
commands include connection/operation IDs, duration and outcome; existing Chat
failure callbacks use the same logger at the composition root.

Only controlled metadata belongs in these calls. Never pass exception objects,
exception messages/stacks, request bodies, arbitrary URLs, query strings,
headers, SQL, configuration objects, player IDs, device IDs, tokens or keys.
Route names use an allowlist or generic avatar operation labels. Evlog's built-in
redaction remains enabled as defense in depth. Dependency errors expose the
operation and a controlled reason such as `connection_refused`,
`dependency_timeout`, `address_in_use` or `database_authentication`; unrecognized
errors use `unexpected_failure`.

Server and API additionally initialize the scoped OpenTelemetry SDK before their
application resources, implementing [ADR-0013](../../docs/decisions/0013-adopt-maple-for-local-operational-observability.md).
Redacted events are exported as OTLP logs; explicit spans carry the same trace/span IDs.
Exception groups contain controlled reason/event metadata. Duration histograms, event
counters, active operations, CPU time, resident memory and uptime use bounded dimensions.
`OTEL_EXPORTER_OTLP_ENDPOINT` enables export; without it JSON output remains available.

Use `observeAdapter` for concrete services and adapter factories at composition roots,
`observeOperation` for explicit workflows, and `observeJob` for detached background runs.
These helpers preserve synchronous results and errors and never capture arguments or
return payloads. HTTP/TCP operations use server spans and outgoing HTTP uses client spans
with W3C trace propagation. Instrument new composed services through the same helpers.
This covers application boundaries and effects, not every numerical expression.

`observeTransaction` buffers effect metadata until its enclosing commit and discards it
on rollback; `afterCommit` registers an effect. PostgreSQL captures only allowlisted
statement/table/count metadata. Outbox rows persist `traceparent` for asynchronous
publication. Runtime rows/frames that were prepared or queued are distinguishable from
confirmed business transactions and acknowledged delivery.

Export runs asynchronously at a one-second default interval. Log/span queues hold at most
8192 records with 256-record batches and bounded export timeouts. Saturation, failed
exports and abrupt termination can lose telemetry. Delivery failures produce a controlled
local diagnostic, rate-limited to once per five seconds. Shutdown releases application
resources before flushing the telemetry providers. Credentials and raw SDK diagnostics
are never printed. Transactional audit remains independent of telemetry availability.

`OTEL_SLOW_OPERATION_MS` defaults to 1000 ms and emits `operation_slow` for unfinished async
work. Maple Local stores logs, traces, exceptions and metrics but provides no automatic
alert scheduler. Its UI runs at `http://127.0.0.1:4318` in Compose; see the
[runbook](../../infra/compose/README.md#observability) for credentials, queries and recovery.
Server/API/Maple container logs rotate at 20 MiB with five files.

Run `bun run --cwd packages/core test:maple` for an isolated real-container integration
check of both service names, all required signals, correlation, authentication and clean
restart persistence. It generates synthetic inputs and removes only its own containers,
network and volume. The full `bun run test:stack` suite verifies actual application export.
