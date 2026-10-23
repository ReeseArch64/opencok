---
status: accepted
date: 2026-10-23
decision-makers: ReeseArch64
---

# ADR-0002: Adopt PostgreSQL for authoritative transactional state

## Context and Problem Statement

Player progress and economic operations require one transactional authority.
The repository already has maintained Drizzle models, migrations and tests for
772 tables. The local topology uses one global database and two kingdom databases;
the same kingdom schema serves both realms.

The maintainer confirmed this decision on 2026-10-23 to make the technology
boundaries explicit for subsequent implementation work. Acceptance records the
choice; it does not certify that the implementation tasks below are complete.

## Decision

Use PostgreSQL for accounts, progression, balances, inventory, troops, command
receipts, ledger and outbox state as those domains are implemented. Preserve
`opencok_global`, `opencok_kingdom_1` and `opencok_kingdom_2` as configurable defaults.
Use `packages/drizzle` for owned pools and role-specific schemas.

Retain the local PostgreSQL 17.11 image baseline. Production uses Neon write/read
computes on the same branch as defined in the architecture. Preconditions and
read-after-write queries use the write compute; only delay-tolerant projections
may use a replica. No cross-database atomicity is implied. This decision does not
implement missing mutations or permit resets of existing player data.

## Consequences

- Transactions can confirm state, receipts and outbox together; each domain must supply concurrency and idempotency tests.
- Per-realm databases provide routing boundaries, but cross-realm changes need an explicit recoverable protocol rather than an assumed shared transaction.

## Implementation Plan

- **Affected paths**: `packages/drizzle/src/`, `packages/drizzle/migrations/`, `packages/drizzle/tests/`, `packages/env/src/database.schema.ts`, `apps/server/src/persistence.ts`, `apps/api/src/storage.ts`, `docker-compose.yml`.
- **Dependencies**: Retain `pg@8.23.1`, `drizzle-orm@0.45.4`, `drizzle-kit@0.31.11` and `postgres:17.11-bookworm` as the recorded repository baseline, subject to reviewed security updates; no new library is required.
- **Patterns to follow and avoid**: Follow `createDatabases` and `databasePoolConfig` for ownership and validated routing. Keep bigint/numeric and UTF-8 bytea contracts. Avoid SQL edits that bypass domain authorization or reset data.
- **Configuration**: Use the existing validated database URL, admin URL and kingdom topology settings from `packages/env`; migrations remain separated by role. Managed secrets never enter the repository.

The following local TODOs track implementation until they are linked to GitHub
work through the [contribution process](../../.github/CONTRIBUTING.md). This
record does not authorize deployment or a database migration.

- [ ] TODO ADR-0002.1: Retain role-specific schema generation and advisory-locked migrations; add targeted migrations only when a domain changes.
- [ ] TODO ADR-0002.2: Add ledger/receipt/outbox transactions for each newly supported mutation and test rollback and duplicate commands.
- [ ] TODO ADR-0002.3: Validate Neon write/read routing, backup recovery and two-kingdom isolation before production admission.

### Verification

- [ ] `bun run --cwd packages/drizzle test` passes, including all 772 table snapshots.
- [ ] `bun run --cwd packages/drizzle test:e2e` passes against disposable PostgreSQL databases without changing local player databases.
- [ ] New economic mutation tests prove atomic rollback, one receipt per request and preserved isolation between the two kingdoms.

## Alternatives Considered

These are tradeoff comparisons for this record, not a claim that a benchmark
or a historical evaluation was performed.

- MongoDB supports document-oriented access but is reserved for the document boundary in ADR-0001; moving economic authority there would replace the existing relational model.
- MySQL/MariaDB would require another schema/driver migration and separate compatibility evidence; legacy use does not validate that migration.

## More Information

- **Implementation evidence at acceptance**: PostgreSQL schemas, migrations, local provisioning and read paths exist; complete gameplay mutation coverage and the managed production topology are not established.
- **Related decisions and architecture**: [ADR-0001](0001-adopt-mongodb-for-documents.md); [architecture sections 6 and 15.1](../../.github/ARCHITECTURE.md#6-postgresql-on-neon-writes-reads-and-authority).
- **Review again when**: the stated boundaries cannot be maintained, a required
  dependency becomes unsupported, or measured compatibility/operational results
  invalidate the choice. A replacement requires a linked superseding ADR.
