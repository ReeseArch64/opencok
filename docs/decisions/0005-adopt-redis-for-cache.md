---
status: accepted
date: 2026-10-23
decision-makers: ReeseArch64
---

# ADR-0005: Adopt Redis for cache and ephemeral coordination

## Context and Problem Statement

API and realm services already use Redis for bounded readiness checks and
realm-scoped sessions. The architecture also assigns caching, presence and
traffic limits to Redis. These uses must not make a disposable cache the only
record of player progress.

The maintainer confirmed this decision on 2026-10-23 to make the technology
boundaries explicit for subsequent implementation work. Acceptance records the
choice; it does not certify that the implementation tasks below are complete.

## Decision

Use Redis for query caches, scoped sessions, presence, traffic limits and
ephemeral fan-out. Keep authoritative progress, economic state and operation
deadlines in PostgreSQL. Every cached category must define keys, ownership, TTL,
invalidation and outage behavior. Scope realm state by kingdom ID.

Retain the existing local `redis:6.2.24-bookworm` baseline until a separately
validated update. Production targets managed Redis as described in the
architecture; neither the local tag nor URL validation proves managed-service or
production compatibility.
If BullMQ is later adopted, use a separate durable queue instance and explicit
policy. This ADR does not adopt BullMQ or replace durable event recovery.

## Consequences

- Shared ephemeral state supports multiple service processes; TTL and compare-token renewal prevent abandoned sessions from living forever.
- Cache loss and Redis outages need tested behavior; fail closed for identity/quotas when no safe fallback exists and avoid unbounded reconnection queues.

## Implementation Plan

- **Affected paths**: `docker-compose.yml`, `docker-compose.dev.yml`, `apps/server/src/infra.ts`, `apps/api/src/storage.ts`, `packages/env/src/server.schema.ts`, `packages/env/src/api.schema.ts`.
- **Dependencies**: Pin the development Redis image and validate upgrades separately. Current adapters use Bun RedisClient; the Node-compatible client and its exact release must be selected and pinned in the ADR-0010 migration implementation before production.
- **Patterns to follow and avoid**: Preserve `bounded`, `DependencyError`, token-checked session release and realm-scoped keys in `apps/server/src/infra.ts`. Do not treat cache persistence as the ledger or use cache eviction policy for durable queues.
- **Configuration**: Use shared `REDIS_URL` for API and realm and bounded dependency timeout settings; keep managed URLs server-only and separate future queue/cache instances.

The following local TODOs track implementation until they are linked to GitHub
work through the [contribution process](../../.github/CONTRIBUTING.md). This
record does not authorize deployment or a database migration.

- [ ] TODO ADR-0005.1: Document/test cache TTL, invalidation and required-versus-optional failure behavior for each new key category.
- [ ] TODO ADR-0005.2: Validate the local image and managed-service compatibility with the selected Node client before production; preserve current Redis command semantics.
- [ ] TODO ADR-0005.3: Keep any future queue deployment separate from cache and require explicit retention/recovery tests.

### Verification

- [ ] Session tests cover claim, expiration, token-mismatched release and isolation across kingdom IDs.
- [ ] Stopping Redis causes bounded readiness/authentication behavior without unbounded buffers or disclosure of connection credentials.
- [ ] Discarding a synthetic cache does not remove PostgreSQL player state; reconnecting rebuilds only permitted derived state.

## Alternatives Considered

These are tradeoff comparisons for this record, not a claim that a benchmark
or a historical evaluation was performed.

- Per-process maps remove a service dependency but do not share session/limit state across processes and are lost at restart.
- PostgreSQL can store session state durably, but placing every ephemeral cache/presence update there conflicts with the selected workload separation.

## More Information

### Existing image baseline and external configuration

The unvalidated Redis image update was reverted at the maintainer's request.
Compose and integration fixtures retain `redis:6.2.24-bookworm`. A future upgrade
must validate the actual clients, commands, scripts, persistence formats and
outage/recovery behavior before changing the baseline. No image was pulled and
no Compose/container runtime checks were performed.

API/server use shared `REDIS_URL`. Base Compose does not depend on local Redis;
the explicit development override restores healthy-Redis ordering. Only Redis
joins the `redis` profile. Production supplies an external URL without the dev
override and still requires bounded readiness, TLS/client/provider compatibility,
session/media semantics and persistence/outage validation. Back up Redis data
before upgrading and test on a disposable copy; downgrading the image alone is
not a safe persistence rollback. ADR-0005.2 and all runtime verification criteria
remain open.

- **Implementation evidence at acceptance**: Local Redis and Bun adapters exist. Durable queue infrastructure and the managed production deployment are not established.
- **Related decisions and architecture**: [ADR-0002](0002-adopt-postgresql-for-authoritative-state.md); [architecture section 7](../../.github/ARCHITECTURE.md#7-mongodb-redis-and-file-storage).
- **Review again when**: the stated boundaries cannot be maintained, a required
  dependency becomes unsupported, or measured compatibility/operational results
  invalidate the choice. A replacement requires a linked superseding ADR.
