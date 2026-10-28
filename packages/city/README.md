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
Services or Repositories. The existing database store is passed through composition
and commits inside the same mutation transaction.

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
all referenced mechanics to city. Broader city persistence/bootstrap ownership and
mechanic migrations remain incomplete; no package or process completion is inferred
from the existence of this coordinator.

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
