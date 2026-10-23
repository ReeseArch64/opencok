# Shared Effect service runtime

`@opencok/core` implements the common process and resource conventions proposed in
[ADR-0012](../../docs/decisions/0012-adopt-effect-for-service-composition.md).
Both development services use Effect 4.0.6 from the workspace catalog.

`runtime` runs a fully provided application Effect through BunRuntime. SIGINT and
SIGTERM interrupt its main fiber and await scope finalizers. Failure exits nonzero
and emits only the service name; raw Effect causes and defects are not logged.
`resource` bridges Promise acquisitions with sanitized ResourceError operations and
acquireRelease ownership. Acquisition is uninterruptible until ownership is
registered; adapters must bound their I/O and clean up resources when acquisition
itself fails. Finalizer failures propagate after remaining finalizers execute.

`http` adapts a Fetch handler to Effect's scoped Bun HTTP server, preserving the
64 KiB body limit and 20-second idle timeout. The listener closes before an outer
scope releases request dependencies. Platform imports stay here so the future
Node runtime transition has one application integration boundary. Existing Bun
Redis and the realm transport health listener still require ADR-0010 work.

Application services use Context and Layer; packages never import application
configuration. Tests can provide Layer.succeed values without loading private
configuration or opening real dependencies.

Run `bun run --cwd packages/core test` and
`bun run --cwd packages/core check-types` to verify the foundation. These tests
include actual HTTP sockets, scoped cleanup and signal-driven child processes.
