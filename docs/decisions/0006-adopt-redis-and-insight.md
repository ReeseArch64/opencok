---
status: accepted
date: 2026-10-28
decision-makers: ReeseArch64
---

# ADR-0006: Adopt Redis and Redis Insight

## Context and Problem Statement

API and realm services already use Redis for bounded readiness checks, scoped
sessions and short-lived authorization. Shared ephemeral state needs a named
store and inspection tool without turning cache persistence into durable progress.
Local Compose provisions Redis and Redis Insight; their existence does not
establish production compatibility or secure UI access.

The current Redis baseline is `redis:6.2.24-bookworm`, with RDB/AOF persistence,
`noeviction` and a named volume. Redis Insight currently uses a floating `latest`
image. Image pinning and UI authentication remain open implementation gates.

## Decision

Adopt **Redis** for query caches, scoped sessions, presence, traffic limits and
ephemeral fan-out. Adopt **Redis Insight** as a local/private development
visualizer for Redis keys, TTLs and instance identity.

Keep authoritative progress, economic state, durable deadlines, receipts, ledger
and outbox in PostgreSQL. Redis loss must not erase those records. Preserve the
write-authority semantics in [architecture section 9](../../.github/ARCHITECTURE.md#9-authoritative-server-zookeeper-and-scaling);
a Redis session/lock never replaces persisted fencing.

Each key category must define its owner, namespace, TTL or explicit lifetime,
invalidation and outage behavior. Realm keys include kingdom identity; global
keys require explicit global ownership. Preserve token-checked session
renewal/release so an obsolete session cannot remove a replacement.

Redis Insight must use authenticated local/private access and scoped development
credentials, with no public game route. If the selected release lacks adequate
UI authentication, provide a private authenticated access layer before enabling
it. Never connect production Redis to the development visualizer or export
session values/player identities into screenshots, fixtures or logs.

Non-goals: durable queue adoption, BullMQ, new event paths, exactly-once transport,
Redis upgrades, production provider selection, runtime selection or gameplay changes.
Redis persistence and `noeviction` do not make ephemeral state a progress ledger.
A future durable queue requires separate adoption, a separate persistent instance
and explicit retention/recovery policy.

## Consequences

- Shared ephemeral state supports multiple processes, but loss/restart requires defined rebuilding or reauthentication rather than invented progress.
- Redis is currently a runtime readiness dependency for its consumers; removing Compose startup ordering alone does not make it optional. Bound failures and fail closed where identity/quotas have no safe fallback.
- The UI can mutate application state and has version/authentication debt. Pinning, scoped access and private binding verification precede claims of a hardened setup.
- Persistence upgrades require backups and disposable compatibility tests; changing an image tag back is not a safe data-format rollback.

## Implementation Plan

Follow-up changes require separate implementation authorization; this ADR
performs no install, cache flush, migration or configuration change.

- **Affected paths**: `packages/storage/src/session.ts`, `packages/storage/src/timeout.ts`, `packages/storage/src/discovery-redis.ts`, `apps/server/src/realm-composition.ts`, `packages/env/src/server.schema.ts`, `packages/env/src/api.schema.ts`, `docker-compose.yml`, `docker-compose.dev.yml`, `infra/compose/README.md`, `tests/stack/compose.test.ts`.
- **Dependencies**: Retain the recorded Redis 6.2.24 image baseline and existing Bun `RedisClient` adapters. Review/pin a Redis Insight image compatible with that baseline before closing the tooling gate; do not invent a pin for current `latest`. Any client/provider/runtime transition or Redis upgrade needs separate compatibility review.
- **Configuration**: Keep shared server-only `REDIS_URL`, bounded dependency timeouts and internal local Redis networking without a host port. The development override supplies local Redis ordering; external URLs do not authorize development tools to access production.
- **Patterns to follow**: `Cache` realm/owner-epoch key scoping, token checks and bounded commands in `session.ts`; sanitized `DependencyError` failures and explicit required-versus-optional behavior.
- **Patterns to avoid**: Unbounded reconnect buffers, cache eviction as queue retention, broad flushes, logging keys/values with private identities, public UI exposure and application dependencies on Redis Insight.

1. Inventory each maintained key category and add synthetic tests for TTL/lifetime, invalidation, realm isolation and required-versus-optional outage behavior.
2. Pin/test the UI image, authentication/access layer and local/private bindings. Label connections by role; current Redis Insight is in `all`, `devops` and `redis`, not required by API/server startup.
3. Before any Redis upgrade, back up the existing volume, test clients/commands/scripts and persistence on a disposable copy, and document compatible restore/rollback.
4. Validate external-service TLS, authentication, quotas, session/media semantics and bounded recovery separately before any production admission.

### Verification

These unchecked gates are not a claim that the current stack passes them.

- [ ] Synthetic session tests cover claim conflicts, TTL, token-mismatched renewal/release and realm/owner-epoch isolation.
- [ ] Dependency loss produces bounded readiness/authentication failures without unbounded queues or leaked connection settings; unsafe identity/limit fallbacks are rejected.
- [ ] Discarding an isolated cache preserves PostgreSQL progress/receipts and rebuilds only permitted derived state.
- [ ] The pinned Insight release can inspect a synthetic key's TTL and labeled instance; unauthenticated clients are denied and no public route/binding exposes the UI.
- [ ] API/realm startup and core tests succeed without Redis Insight; Redis remains required where configured readiness/authentication depends on it.
- [ ] A disposable backup/restore exercise validates persistence compatibility before an upgrade; production credentials never enter local tool configuration.

## Alternatives Considered

- Per-process maps: remove an external dependency, but do not share sessions, quotas or presence across processes and lose all state at restart.
- PostgreSQL for every ephemeral update: offers durability and fewer stores, but mixes high-churn cache/presence traffic with the selected transactional workload.
- `redis-cli` without Insight: scriptable and avoids a hosted UI, but lacks the chosen graphical TTL/key inspection; retain it for repeatable diagnostics.

## More Information

Provenance: Redis/tool choices previously recorded as ADR-0005 and ADR-0006.
See [architecture section 7](../../.github/ARCHITECTURE.md#7-mongodb-redis-and-file-storage)
and [external Redis operation](../../infra/compose/README.md#external-redis-and-deployment-separation).
Revisit on unsupported releases, failed compatibility/security gates or evidence
that the ephemeral/durable boundary cannot be maintained. No throughput or
managed-service verification is asserted.
