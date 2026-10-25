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
packet. Known command names are logged; unknown names use `unknown` and a bounded
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

Events go to the process console, with warnings/errors on stderr. Container log
rotation and retention are operator responsibilities. This integration adds no
collector, remote backend, durable audit store or process-wide console interception.
The architecture's Evelog transaction audit remains separate. New command names
and HTTP endpoints must update the corresponding logging allowlists alongside
their handlers. Full-stack testing with authorized client inputs remains a
separate validation step.
