---
status: accepted
date: 2026-10-28
decision-makers: ReeseArch64
---

# ADR-0005: Adopt the database stack and inspection tools

## Context and Problem Statement

OpenCoK needs explicit choices for transactional persistence, document storage
and private database inspection without creating competing sources of progress.
PostgreSQL schemas, migrations and clients exist in `packages/drizzle`;
MongoDB and both inspection tools are provisioned in local Compose.

The package name `@opencok/mongoose` does not describe its current implementation:
`packages/mongoose/src/chat-archive.ts` uses `MongoClient` from `mongodb@6.21.0`,
and its manifest has no `mongoose` dependency. Mongoose is an approved target
object-document mapper (ODM), not an implemented adapter or completed migration.
Acceptance catalogs the stack; it does not certify runtime verification.

## Decision

Adopt this bounded database group:

- **PostgreSQL + Drizzle** for authoritative transactional persistence, maintained SQL schemas, typed queries and versioned migrations.
- **MongoDB + Mongoose** for documents and reconstructible projections, with Mongoose adoption pending separate implementation and review.
- **Mongo Express** for local/private MongoDB inspection and **pgAdmin 4** for local/private PostgreSQL inspection.

Preserve one global database and physical per-realm databases, with configurable
`opencok_global`, `opencok_kingdom_1` and `opencok_kingdom_2` defaults. Transactions
are local to one physical database; no cross-database atomicity is implied.
PostgreSQL remains the authority for economic state, durable progress and
operation deadlines. Preserve persisted fencing and atomic state, command receipt,
ledger and outbox commits under [architecture section 9](../../.github/ARCHITECTURE.md#9-authoritative-server-zookeeper-and-scaling).

Publish derived MongoDB documents idempotently after the authoritative commit,
not through synchronous dual writes. Preserve existing document versions,
identities, expiration and deletion contracts; TTL cleanup does not replace
application expiration checks. Back up unique documents; store large binary
payloads through object storage references rather than database administration UIs.

Keep both UIs authenticated and local/private, outside public game ingress and
application startup dependencies. UI edits do not replace versioned migrations
or reproducible repair procedures. No gameplay rule, authority split, provider
change, production runtime, deployment, install or data migration is selected here.

## Consequences

- Separate document workloads avoid making MongoDB availability part of an authoritative transaction; projection consumers need duplicate/outage recovery tests.
- Two persistent stores require distinct access, backup and retention procedures; replicas and reconstructible projections are not backups of unique data.
- Mongoose migration must preserve current archive behavior and bounded connection ownership; its package name alone cannot close that work.
- Administration UIs add privileged attack surfaces. Current published ports do not prove private access; exposure and credential hardening remain follow-up work.

## Implementation Plan

This plan describes separately authorized follow-up work, not changes performed
by accepting this catalog record.

- **Affected paths**: `packages/drizzle/src/`, `packages/drizzle/migrations/`, `packages/drizzle/tests/`, `packages/mongoose/package.json`, `packages/mongoose/src/chat-archive.ts`, `apps/chat/`, `packages/env/src/database.schema.ts`, `docker-compose.yml`, `infra/README.md`, `tests/stack/compose.test.ts`.
- **Dependencies**: Record existing `pg@8.23.1`, `drizzle-orm@0.45.4`, `drizzle-kit@0.31.11`, `postgres:17.11-bookworm`, `mongo:8.0.34`, `mongo-express:1.0.2` and `dpage/pgadmin4:9.18`. No dependency changes now. Select and pin a compatible Mongoose release in the separately reviewed migration; do not infer a version from the workspace name or remove the existing driver prematurely.
- **Configuration**: Preserve validated global/kingdom routing, server-only credentials and bounded pools. Retain `MONGO_URI` for the current Compose inspection connection and `PGADMIN_DEFAULT_EMAIL`/`PGADMIN_DEFAULT_PASSWORD`; do not introduce parallel environment files or commit values.
- **Patterns to follow**: `packages/drizzle/src/client.ts` ownership and role-specific migrations; `packages/repositories/src/realm-authority.ts` and `mutation.ts` fencing/transactions; the existing `ChatArchiveStore` contract and versioned archive upserts.
- **Patterns to avoid**: Direct domain dependencies on UI/ODM internals, packages importing applications, public administration routes, production data in fixtures, destructive reseeding and assumed multi-database transactions.

1. Review a Mongoose migration slice with schema/index mapping, connection lifecycle, compatibility tests and rollback preserving stored documents before changing the adapter, manifest or lockfile.
2. Keep PostgreSQL changes additive and role-scoped; run migrations through operator/setup workflows, never automatic runtime schema repair. Preserve writer routing for preconditions and immediate reads; replica reads remain delay-tolerant only.
3. Audit UI bindings/authentication and scoped credentials; retain password-free generated pgAdmin registrations in `packages/drizzle/scripts/setup-compose.ts`. Keep inspection optional for applications and document synthetic-only workflows.
4. Validate document retention, outage recovery and backup/restore in disposable resources before rollout. Follow existing Chat retention in architecture section 20; this catalog does not redefine it.

### Verification

All criteria below are follow-up gates, not evidence of execution in this record.

- [ ] A reviewed Mongoose version is pinned and the adapter passes existing `ChatArchiveStore` contracts without changing IDs, versions, tombstones or original expiration.
- [ ] Duplicate/delayed projection delivery and MongoDB outages do not duplicate documents, resurrect deleted/expired bodies or roll back a committed PostgreSQL command.
- [ ] Disposable PostgreSQL tests prove stale-writer rejection, state/receipt/ledger/outbox rollback and duplicate-command idempotency, with global/two-realm routing preserved.
- [ ] `bun run --cwd packages/drizzle test` and `test:e2e` pass against isolated resources; affected workspace types pass without schema resets.
- [ ] Unauthenticated UI requests fail, published bindings are local/private, no public game route reaches either UI, and applications start without the UIs.
- [ ] Generated pgAdmin registrations contain no database password; synthetic document/database restore tests preserve required data and retention.

## Alternatives Considered

- PostgreSQL alone, including JSONB: fewer services and one backup model, but concentrates document workloads in the transactional store rather than preserving the selected separation.
- MongoDB's native driver without Mongoose: matches current code and avoids an ODM migration, but does not provide the approved schema/model abstraction; retain it until migration review and compatibility gates pass.
- Desktop/CLI tools only: Compass, DBeaver, `mongosh` and `psql` avoid hosted UI exposure, but do not provide the selected repeatable browser inspection workflow; CLI tools remain useful for reproducible scripts.

## More Information

Provenance: database/tool choices previously recorded as ADR-0001 through
ADR-0004. See [database ownership](../../packages/drizzle/README.md),
[local operation](../../infra/README.md) and architecture sections 6, 7,
9 and 23. Revisit unsupported dependencies, failed compatibility gates or an
inability to preserve the authority/document boundary; no performance claim is made.
