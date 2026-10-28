---
status: accepted
date: 2026-10-28
decision-makers: ReeseArch64
---

# ADR-0007: Adopt ZooKeeper for realm coordination

## Context and Problem Statement

Realm startup needs exclusive registration and a live coordination signal.
`packages/storage/src/coordination.ts` already uses `node-zookeeper-client`
to create an ephemeral realm node. Local Compose runs a standalone ZooKeeper
instance with persistent data, transaction-log and log volumes.

Membership availability and durable write authority are different facts.
A connected session or successful registration cannot prevent a previously
running process from committing stale writes to PostgreSQL. The repository also
implements persisted PostgreSQL epochs and transactional fencing; both layers
must remain distinct when cataloging the coordination choice.

## Decision

Adopt **Apache ZooKeeper** for realm-scoped registration, membership and
coordination, retaining the existing bounded adapter and ephemeral-node pattern.
The current default namespace is `/opencok-experiment/COK<id>`; registration
conflict fails startup rather than creating a second owner at the same path.
This records existing registration, not proof of a general leader-election protocol.

Treat coordination readiness as an availability/admission condition, never as a
durable write token. Current readiness requires successful registration, a
synchronized connection and no expired/authentication-failed session. Loss of
coordination readiness stops affected mutations; reconnect alone cannot legitimize
a stale PostgreSQL epoch.

Preserve [architecture section 9](../../.github/ARCHITECTURE.md#9-authoritative-server-zookeeper-and-scaling):
registration precedes persisted PostgreSQL authority acquisition, and authoritative
transactions validate the persisted owner/epoch and readiness. ZooKeeper cannot
replace PostgreSQL fencing, atomic state/receipt/ledger/outbox writes or the
separately gated authority-split design. Do not share an existing realm token
among independently authorized writers.

Non-goals: selecting a new election algorithm, new partitions/process owners,
a broker, a scheduler, gameplay rules, production ensemble topology or runtime.
A standalone local healthcheck is not high availability, membership readiness or
proof that an authoritative write is permitted.

## Consequences

- Ephemeral registration prevents simultaneous use of the same live realm path; session loss must invalidate readiness rather than silently admit writes.
- ZooKeeper adds an operational/session dependency. Startup, disconnection and shutdown need bounded failure tests and resource cleanup.
- The existing `zookeeper:3.4.14` image is an implementation baseline, not an endorsement of production support/security. Upgrade and ensemble suitability remain separately reviewed work.
- Production coordination requires access controls, network isolation and recovery planning; local Compose volumes/health probes do not establish those properties.

## Implementation Plan

This catalog does not change coordination code, dependencies, images or data.
Future work must retain authority checks while separately reviewing operations.

- **Affected paths**: `packages/storage/src/coordination.ts`, `packages/storage/src/timeout.ts`, `packages/env/src/server.schema.ts`, `apps/server/src/config.ts`, `apps/server/src/realm-composition.ts`, `packages/repositories/src/realm-authority.ts`, `apps/server/test/realm-authority.test.ts`, `apps/server/integration/`, `docker-compose.yml`, `infra/README.md`, `tests/stack/compose.test.ts`.
- **Dependencies**: Record existing `node-zookeeper-client@1.1.3`, `@types/node-zookeeper-client@0.2.13` and `zookeeper:3.4.14`. No new dependency or version change; security/support and protocol/session compatibility must be reviewed before any upgrade or production use.
- **Configuration**: Preserve `GAME_ZOOKEEPER`, validated realm-specific paths and dependency timeouts. Retain private internal networking, named volumes, session timing and bounded client behavior; do not expose coordination endpoints through game ingress.
- **Patterns to follow**: `Coordination.start/ready/close`, zero adapter retries with bounded startup, `acquireResource` ownership in realm composition, then `acquireRealmAuthority` and `fenceRealmDatabase` in PostgreSQL.
- **Patterns to avoid**: Using `ruok`/`srvr`, TCP connectivity, an ephemeral node or a Redis lock as sole write authority; infinite reconnect work; unreviewed namespace changes or volume deletion to fix registration.

1. Extend adapter/lifecycle coverage for registration conflict, connect timeout, disconnect, session expiration, authentication failure and close during partial startup.
2. Exercise real PostgreSQL and ZooKeeper together in disposable resources: stop/replace the owner, delay old work and prove readiness loss plus persisted fencing prevent unauthorized commits.
3. Review pinned-image support, credentials/access controls, backups and restore before production coordination. Select any upgrade/ensemble topology with explicit failure/recovery evidence, not an inferred availability promise.
4. Keep namespace/ownership changes behind the authority migration gates in architecture section 9; this tool choice does not activate independent writers.

### Verification

Every item is an unchecked follow-up gate; no runtime results are claimed here.

- [ ] Two instances using one realm path cannot both register; distinct synthetic realms remain isolated.
- [ ] Startup timeout/conflict cleans up the client and fails with a sanitized error; closing/repeated disposal leaves no owned session resources.
- [ ] Disconnection, expiration and authentication failure invalidate readiness and stop affected mutations; reconnection does not bypass persisted epoch validation.
- [ ] Concurrent replacement/old-writer tests prove obsolete transactions cannot commit after replacement acquisition, including in-flight and recovery paths.
- [ ] A standalone health probe is reported separately from registration readiness and PostgreSQL authority; dependency outages do not fabricate success.
- [ ] Disposable restart/restore and private-network/access-control checks pass before deployment; existing volumes and player state are preserved.

## Alternatives Considered

- PostgreSQL-only coordination: reduces service count and already supplies fencing, but would replace the existing membership/session adapter and requires a separately designed registration/liveness protocol.
- Redis leases: fit the existing ephemeral store, but lease loss/expiry still does not fence database writes and would replace the current coordination pattern without compatibility evidence.
- etcd or a platform-native lease: provides other coordination interfaces, but introduces client/operational migration and platform coupling; no such replacement is selected by this catalog.

## More Information

Grounding: [current authority semantics](../../.github/ARCHITECTURE.md#9-authoritative-server-zookeeper-and-scaling)
and [local persistence/recovery](../../infra/README.md#persistence-and-recovery).
The architecture records the separately accepted authority target; this ADR adds
no new gameplay ownership design. Revisit on unsupported dependencies, session/fencing
failures or a reviewed change in deployment topology.
