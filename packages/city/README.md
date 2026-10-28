# City transaction coordination

City owns `CityProgressionContext`, `CityProgressionContextFactory` and
`CityProgressionService` after #637 under #558 W07. They coordinate a pending
aggregate write and economic plan, load the existing effect snapshot and route
commands or timed activity actions to injected mechanic implementations. The realm
remains the authoritative process; this extraction does not implement ADR-0017's
process topology.

## Boundaries

| Implementation                                         | Owned path                        | Previous location                                          |
| ------------------------------------------------------ | --------------------------------- | ---------------------------------------------------------- |
| Pending plan, costs, power and experience coordination | `src/services/context.ts`         | `services/src/city-progression-context.ts`                 |
| Transactional snapshot/effect factory                  | `src/services/context-factory.ts` | `services/src/city-progression-context-factory.ts`         |
| Command and timed-activity dispatch                    | `src/services/progression.ts`     | `services/src/city-progression.service.ts`                 |
| Mechanic specialization                                | `src/contracts/domain.ts`         | Existing structural `CityDomain` contract                  |
| Effect/context providers and coordinated hooks         | `src/contracts/runtime.ts`        | Dependencies formerly constructed/imported inside Services |

`apps/server/src/composition/city.ts` builds the coordinator and injects the
foreign-owner rule context and campaign, quest, Hero and expedition callbacks.
The coordinator preserves their original ordering before the repository update.
Buildings, research, troops, equipment and events retain their own implementations;
their remaining domain extractions are tracked by #558. City imports no horizontal
Services or Repositories. After #639, its owned database adapter receives mechanic
persistence collaborators from realm composition and commits inside the same mutation transaction.

The context keeps bound-resource consumption, optional gold purchases, cancellation
refunds, outstanding power reservations, score timestamps and linked level/power
changes together because they operate on one pending plan. This existing class is
roughly 450 lines, reviewed as one transaction-plan responsibility. Its extraction
adds no gameplay branches. Mechanic-specific commands do not move into this class.

## Structural migration contracts

`contracts/src/city-progression-plan.ts` defines `CityProgressionPlan<TRules>`;
`contracts/src/city-domain.ts` defines the generic mechanic contract. Generic rule
parameters avoid a reverse shared-contract dependency on the central Rules class.
The owned runtime implements the structural plan.

Two type-only aliases remain in Services for existing mechanic signatures:
`city-progression-context.ts` specializes the shared plan to Rules, and
`city-domain.ts` specializes the generic mechanic contract to that plan. They export
no runtime implementation, factory or constructor. The old progression factory,
Service and context-factory entrypoints are removed after migrating application
callers. The aliases are owned by this migration and their retirement is tracked by
#558 W07/W20 as the remaining mechanics move and their ports narrow. The exact
remaining source consumers are listed in the migration register.

This shared state/plan contract is transitional infrastructure. It does not assign
all referenced mechanics to city. The aggregate store is owned after #639; bootstrap
projection and individual mechanic migrations remain incomplete. No process completion
is inferred from the existence of this coordinator.

## Compatibility, tests and rollout

Command matching, task-reward refresh exclusion, activity type ownership,
completion deadlines, army/fort/healing deltas, next/acceleration behavior and
callback failure propagation remain unchanged. Query order, mutation authority,
receipts, outbox, stored activity data and production boundaries remain intact.

Run `bun run --cwd packages/city test`, root package/architecture tests and the
realm's unit and relevant PostgreSQL suites. Owned tests verify dispatch, native
payload decoding, callback/persistence order, actual completion deltas and rejection
before a successful response on failure. They supplement actual database tests;
in-memory callback checks alone do not establish transaction rollback.

Deploy the rebuilt realm artifact. There is no schema conversion, new environment
variable, worker, scheduler or client repackaging. Rollback deploys the previous
artifact against the same data. Native device acceptance and production-load
measurements remain separate from these compatibility checks.

## Aggregate persistence (#639)

The former `repositories/src/city-progression.ts` is retired. The realm factory in
`apps/server/src/composition/city-persistence.ts` composes `CityProgressionRepository`
with 54 reader functions, 51 writer functions and the existing world-birth allocator.
Those mechanic implementations stay with their current owners. Static adapter objects
contain functions only; mutable alliance, pre-write quest and cosmetic-target state
belongs to each store session, scoped to the original transaction.

| Responsibility                                                | Owned module                       |
| ------------------------------------------------------------- | ---------------------------------- |
| Store/session composition                                     | `repositories/progression.ts`      |
| Bounded aggregate and command-specific snapshots              | `repositories/snapshot.ts`         |
| Validation, effect-change detection and production boundary   | `repositories/plan-writer.ts`      |
| Ordered mechanic callbacks and branch-city row                | `repositories/mechanic-writer.ts`  |
| Pending aggregate rows, ownership checks, queues and deletion | `repositories/aggregate-writer.ts` |
| Resident-city check and bounded, ordered world locks          | `repositories/world-targets.ts`    |
| Row identity, signed quantity/deadline and batch bounds       | `validations/write.ts`             |

Readers/writers are typed from existing state/write contracts and use the actual
PostgreSQL transaction type. Their broad set reflects the current aggregate's
cross-mechanic coupling; it is not a universal registry or a new mechanic home.
Narrow these ports as domain-specific persistence moves under #558 W07–W12/W20.
The 1,153-line original is split into focused adapters, each below 350 lines; the
complete write sequence remains serial. Constructors bind callbacks without running
queries or mutating state.

Shared `contracts/progression-boundary.ts` is transaction-generic. Alliance and
totem retain their existing caller types through this port; they do not import city.
This removes the previous city/totem module cycle. No compatibility store facade
remains and no architecture exception is introduced.

Seven structural comparisons cover the snapshot, mechanic writes, aggregate writes,
reconstructed full update, world birth, treasure locks and validation. Adapter import
and binding checks cover all 106 original collaborators. Dedicated PostgreSQL coverage
verifies that a branch-city write has occurred before a foreign aggregate rejection,
then observes rollback outside the transaction. Existing mechanics, recovery and SFS
suites verify broader consumers. The production boundary still wraps effect changes;
production-account deletion still follows building deletion in the same transaction.
