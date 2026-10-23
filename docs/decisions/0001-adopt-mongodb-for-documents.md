---
status: accepted
date: 2026-10-23
decision-makers: ReeseArch64
---

# ADR-0001: Adopt MongoDB for document storage

## Context and Problem Statement

The architecture assigns document workloads to MongoDB while PostgreSQL owns
transactional player state. Detailed reports, simulation documents and temporary
chat archives need an explicit boundary so future services do not create two
authoritative copies of an economic operation. `packages/mongoose` currently
contains only a workspace manifest and TypeScript configuration; the root Compose
stack has no MongoDB service.

The maintainer confirmed this decision on 2026-10-23 to make the technology
boundaries explicit for subsequent implementation work. Acceptance records the
choice; it does not certify that the implementation tasks below are complete.

## Decision

Use MongoDB for versioned reports, simulation documents, reconstructible
projections and the temporary global/alliance chat archive. Keep economic state,
identity mappings and durable command receipts in PostgreSQL. Publish derived
documents after the authoritative commit through an idempotent outbox consumer.

For global/alliance chat, archive after 24 elapsed hours and deny reads after 168
hours from the original confirmed send time. Use the original `expiresAt`, not
the archive time. A TTL index supplements application expiration filters; it does
not guarantee deletion at the deadline. Unique documents need backups; large
binary payloads use object storage references. Adopting MongoDB does not select a
managed provider, require immediate data transfer, or make it a login dependency.

## Consequences

- Document queries can evolve without widening the authoritative transaction; workers must handle duplicate and delayed projection events.
- Operating a second persistent store adds backup, access and retention work; MongoDB failure must not invalidate a committed economic command.

## Implementation Plan

- **Affected paths**: `packages/mongoose/`, `packages/env/`, planned `apps/workers/` and `apps/chat/`, `docker-compose.yml`, `infra/compose/README.md`.
- **Dependencies**: No dependency is added by this ADR. Before the first adapter commit, select and pin a MongoDB server image and Node-compatible driver/ODM release; provider and exact releases remain explicit provisioning tasks.
- **Patterns to follow and avoid**: Follow PostgreSQL ownership in `packages/drizzle/src/client.ts`; version document IDs/schemas and make archive upserts idempotent. Avoid synchronous dual writes and production player data in fixtures.
- **Configuration**: Add a validated `MONGODB_URI` through `packages/env`; keep it server-only and redact connection strings. Define a local named volume and authenticated internal service.

The following local TODOs track implementation until they are linked to GitHub
work through the [contribution process](../../.github/CONTRIBUTING.md). This
record does not authorize deployment or a database migration.

- [ ] TODO ADR-0001.1: Pin a compatible server/driver pair and implement a bounded document adapter with lifecycle cleanup.
- [ ] TODO ADR-0001.2: Add local MongoDB provisioning, indexes and documented backup/restore; register the selected managed provider before production.
- [ ] TODO ADR-0001.3: Implement archive/projection consumers with deduplication, original expiration and recovery from outages.

### Verification

- [ ] Synthetic integration tests prove repeated event delivery creates one document and a MongoDB outage leaves PostgreSQL commits intact.
- [ ] Controlled-clock tests cover 24h/168h boundaries, delayed archive, expiration filtering and restoration without replaying expired bodies.
- [ ] A restore drill recovers a unique synthetic document; no MongoDB credential appears in frontend bundles or logs.

## Alternatives Considered

These are tradeoff comparisons for this record, not a claim that a benchmark
or a historical evaluation was performed.

- PostgreSQL JSONB would reduce the number of stores, but would put these separately budgeted document workloads in the transactional database.
- Object storage alone suits large immutable bytes, but does not supply the document query/index interface required here.

## More Information

- **Implementation evidence at acceptance**: Architecture describes the target; no operational MongoDB adapter is implemented. [MongoDB TTL documentation](https://www.mongodb.com/docs/manual/core/index-ttl/) explains asynchronous expiration cleanup.
- **Related decisions and architecture**: [architecture sections 7 and 20](../../.github/ARCHITECTURE.md#7-mongodb-redis-and-file-storage); PostgreSQL will be recorded separately.
- **Review again when**: the stated boundaries cannot be maintained, a required
  dependency becomes unsupported, or measured compatibility/operational results
  invalidate the choice. A replacement requires a linked superseding ADR.
