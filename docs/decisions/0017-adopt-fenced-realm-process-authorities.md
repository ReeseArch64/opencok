---
status: accepted
date: 2026-10-27
decision-makers: ReeseArch64
---

# ADR-0017: Adopt fenced process authorities per realm

## Context and Problem Statement

Issue [#558](https://github.com/ReeseArch64/opencok/issues/558) requires separating
transport, player progression, spatial state, deadline discovery and background
work. Today `apps/server/src/realm-composition.ts` composes these responsibilities
under one realm writer. `packages/repositories/src/realm-authority.ts` acquires a
monotonic PostgreSQL epoch and fences transactions against the current instance.
That realm-wide token cannot be shared by independently authorized writers.

The maintainer confirmed an initial boundary per realm and authority kind,
rather than per character. Source extraction under ADR-0016 and the production
baseline in [#583](https://github.com/ReeseArch64/opencok/pull/583) do not prove a
safe distributed writer topology or a performance improvement. This decision
governs the target ownership model and the gates before enabling it; acceptance
does not claim implementation, permit production deployment or reset saved state.

## Decision

Start with one active owner for each `(realm, authority kind)`, with separate
player and world authority kinds. Do not introduce character partitions initially.
Each owner has a persisted monotonic epoch and instance identity. Validate the
matching owner, epoch and readiness within every authoritative write transaction,
including recovery and background paths. Replacement acquisition and old commits
must serialize so an obsolete writer cannot commit after replacement takes effect.
Do not treat a process flag, cache lock or transport lease as sufficient fencing.

Player authority owns character/city progression, balances, inventory, owned
troops, production and their economic participants. World authority owns spatial
occupancy, placement, populations and spatial march checkpoints. Maintain an
explicit table/aggregate/command ownership register; shared schema placement does
not imply shared write permission. Global account/provider identity remains
behind API boundaries, distinct from realm characters and connection sessions.

The existing server becomes the game gateway: authenticate, validate/adapt the
protocol, route commands, manage session backpressure and deliver committed
updates. Scheduler discovers persisted deadlines in bounded, fair batches and
dispatches versioned requests to the current owner. It never completes gameplay
itself. Workers write only specifically owned projections/integration state or
request an authoritative command. Computation/generation workers propose bounded
results for validation; they do not debit, grant or occupy world cells directly.

Preserve PostgreSQL global/per-realm databases and atomic domain state, command
receipt, ledger and outbox writes under ADR-0002. Different processes do not
require different physical databases. Use distinct least-privilege credentials
and database-enforced access boundaries before enabling split writers. A test
must demonstrate that each role cannot mutate another owner's state.

Player/world operations use durable reservations, idempotent acceptance/results
and reconciliation. A reservation identifies factual troops/resources/companions;
world records accepted movement and checkpoints; player applies owned release,
loss and reward results once. Carry realm, operation identity, participant,
contract version and expected state version; pin rule/RNG/reward results needed
for deterministic replay. Define ordering, failure states and permitted
compensation for each operation before extraction. Timeouts indicate uncertainty,
not permission to release possibly consumed troops or issue another reward.
Keep operations together until this protocol has equivalent verified behavior.

Deadlines remain durable PostgreSQL state. Starting, cancelling or accelerating
work changes its persisted version/deadline atomically with related effects.
Scheduler and reconnect use the same owner transition, checking actual due time,
expected version and stable operation key. Duplicate, stale or reordered delivery
must not complete early or duplicate effects. Recover discovery/dispatch after
crashes, cache loss or delivery failure; avoid per-player timers and full scans.

Do not claim exactly-once transport: consumers deduplicate and commit their owned
effects before acknowledging. Bound admission, queue depth, retries, fanout and
pool usage, and expose backlog age/deadline lateness separately from liveness.
No new broker, runtime, framework, database topology or standalone Combat app is
selected. RabbitMQ's documented target is not implementation evidence; any new
delivery technology or standalone Combat decision needs separate review.

## Consequences

- Per-kind epochs permit independent ownership replacement while retaining one understandable initial owner per realm; finer partitions require later evidence and review.
- Least-privilege access and durable protocols add schema, configuration and operational work; a package move alone cannot enable new writers.
- Reservations and uncertain outcomes require reconciliation, operator visibility and tested recovery. Retain the existing atomic path until those gates pass.
- Multiple processes add aggregate CPU/RSS, connection and queue costs on the shared host; compare measured workloads before making isolation/performance claims.
- Drain and rollback become state transitions. Once ownership or protocol state changes, reverting a container alone is not a safe rollback.

## Implementation Plan

- **Affected paths**: `apps/server/src/realm-composition.ts`, transport routing and readiness; future implemented `apps/player`, `apps/world`, `apps/scheduler`, `apps/workers`; `packages/repositories/src/realm-authority.ts`, `mutation.ts`, `timed-activity.ts` and world repositories; domain contracts; `packages/drizzle/src/schema` and additive migrations; `packages/env/src`; `infra/compose` and operational documentation; application/package integration tests and shared `tests/` scenarios.
- **Dependencies**: Reuse existing PostgreSQL/Drizzle, Bun development tooling and verified receipt/outbox foundations. This ADR adds no dependency or version change. Redis remains non-authoritative under ADR-0005; no broker/job library is adopted.
- **Configuration**: Retain current global/kingdom routing. Before activation, review explicit per-authority identities, credentials, routes, admission/drain readiness and resource budgets with their exact environment/schema/Compose patches. Do not copy administrative credentials into gateway/scheduler/workers. This record does not authorize protected configuration or schema writes.
- **Patterns to follow**: Transactional fencing in `realm-authority.ts`, receipts/ledger/outbox in `mutation.ts`, persisted activity versions, existing disposable PostgreSQL and killed-realm recovery tests. Preserve native IDs, SFS command names/types/order and persisted quantities.
- **Patterns to avoid**: Shared realm tokens across independent writers, unrestricted cross-owner SQL, independently implemented scheduler completion, automatic retry of uncertain economic grants, uncontrolled dual writes and empty app scaffolding.

1. Complete ownership/dependency registers and domain extraction before moving their writer. Link concrete slices to #558 W03/W15–W18/W21.
2. Extract projections/integration delivery and deadline discovery while the existing realm remains the sole gameplay writer. Generation/combat stay calculation-only where isolated.
3. Add owner-kind epochs, permissions, stable versioned command/result contracts and adversarial tests in separately reviewed expand/contract migrations. Prove database rejection of wrong-owner roles and stale epochs before routing production writes.
4. Implement and test each cross-owner reservation/result/reconciliation state machine before separating its participants. Extract marches/gathering after simpler spatial ownership.
5. Stop new admission to the old owner, drain or durably checkpoint admitted work, acquire/fence the replacement, verify readiness and switch routing for a controlled realm/work family. No competing old/new writers.
6. Define failure admission, recovery and rollback for each cutover. Reconcile in-flight operations before returning ownership; document when forward recovery is required. Rehearse restore with authoritative state and matching definition versions.
7. Compare identical synthetic workloads, including two realms, restarts and backlog recovery, against W02. Record aggregate pools, CPU/RSS, event-loop/command latency, deadline lateness and backlog budgets before deployment. Numeric operating budgets require measured host capacity; this ADR supplies no invented SLO.

### Verification

- [ ] Every authoritative table/aggregate/command has one registered owner; gateway, scheduler and projection roles are denied direct foreign-owner writes by PostgreSQL.
- [ ] Concurrent old/new owner tests prove no obsolete commit after replacement acquisition, including writes already in flight and recovery paths.
- [ ] Each economic operation commits state, receipt, ledger and outbox atomically; retries and lost acknowledgments produce one grant/reservation/application.
- [ ] Duplicate, reordered and obsolete deadlines, cancellation/speedup races, restart and reconnect preserve actual due time and exactly one domain transition.
- [ ] Cross-owner tests interrupt before/after every durable protocol step, delay acknowledgments and replace owners; reconciliation neither releases uncertain reservations nor rerolls/duplicates outcomes.
- [ ] Two synthetic realms remain isolated; drain, dependency outage, backlog recovery, access denial and restore/rollback tests use disposable resources.
- [ ] Actual gateway/player/world/scheduler/worker entrypoints obey their registered effects and have independent readiness and bounded admission/resources.
- [ ] Affected types, tests, builds, root lint/format and architecture guardrails pass; protocol/persistence fixtures preserve supported behavior.
- [ ] Identical-workload before/after measurements and host/pool budgets are recorded with limitations; no performance claim follows merely from adding processes.

## Alternatives Considered

- Retain one gameplay process permanently: simpler atomic transactions and operations, but preserves shared execution pressure and does not satisfy the requested workload isolation. Retain it during migration until replacement gates pass.
- Partition by character immediately: potentially greater parallelism, but introduces more routing, ownership movement and cross-participant coordination before representative capacity evidence exists. Revisit only if per-realm measurements justify that cost.
- Independent services sharing the existing realm token or unrestricted database role: little initial configuration work, but cannot establish exclusive write ownership or stop an obsolete participant safely; rejected.

## More Information

- Related decisions: [ADR-0002](0002-adopt-postgresql-for-authoritative-state.md), [ADR-0005](0005-adopt-redis-for-cache.md), [ADR-0016](0016-adopt-domain-owned-package-layout.md).
- Current implementation: realm-wide fencing and in-process jobs exist. Separate player/world authorities, restricted roles, scheduler/worker deployments and cross-owner migration are not established by this record.
- Revisit granularity when measured per-realm contention or capacity requires it; revisit protocols when a new cross-owner participant changes the transaction boundary. New technology or partitioning decisions require human review.
