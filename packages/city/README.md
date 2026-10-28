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
all referenced mechanics to city. The aggregate store is owned after #639 and bootstrap coordination after #641;
individual mechanic and reconnect-planner migrations remain incomplete. No process completion
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

## Bootstrap and initialization (#641)

City owns `CityBootstrapService` for state validation and serial initialization,
plus `CityBootstrapMapper` for queue variants, initial city/world fields and the
settled reconnect projection. The Service invokes existing mechanic callbacks in
the original order; their rule implementations and reconnect persistence remain
with their current owners. The Mapper preserves merge precedence, wire types,
long precision, queue sentinels and clock evaluation order.

`apps/server/src/composition/game.ts` composes the owned runtime, existing mapper
functions and reconnect planner. It supplies the original feature gate and null
CN1 environment to the planner. Power and feature projection hooks are bound by
GameService so the existing login behavior and instance configuration remain in
use. Constructing these objects performs no queries or clock reads.

The broad GameService retains only bootstrap delegation through the structural
`contracts/city-bootstrap.ts` port. Its optional constructor factory supports
isolated non-bootstrap command tests; callers that need `initial`, `initialize`,
`build.info` or city-backed `other.login` must use realm composition or inject a
bootstrap factory. The app and its tests use `createRealmGameService`. Player
package tests that exercise unrelated preference/description commands still
construct the generic Service directly. The remaining Controller/GameService
entrypoints are tracked by #558 W20; no duplicate bootstrap implementation remains.

The shared city-state port and domain serializers still under `mappings` are
transitional dependencies, not assignments of building, research, equipment or
player semantics to city. Their remaining vertical migrations belong to W06–W12.
The bootstrap Service and Mapper are each below 300 lines. City imports no
horizontal Services or Repositories and introduces no dependency cycle.

Owned tests cover recovery and notification order, response precedence, exact
civilization longs, cancellation, missing/banned state, queue variants and settled
reconnect identity/correlation. The prior missing-state Controller integration
moves to the app test suite alongside composition; the Controller unit test still
checks delegation. Structural comparisons cover the four unchanged state/projection methods, the
reconstructed complete initialize flow, the reconnect adapter and projection/hook
bindings, plus all 50 unchanged GameService methods after explicit delegate substitutions.

Deploy or roll back the realm artifact against the same schema. No migration,
new setting, authority change or native-client artifact is required. Native-device
acceptance and production-load measurement remain separate verification work.

After #643, realm composition also injects the owned research repository. Snapshot
reads, the production-boundary level query and ordinary/civilization upserts keep
their original positions; aggregate validation and the shared transaction remain
here. Bootstrap receives the research Mapper. Research's two workflows no longer
use the legacy city context/domain aliases, reducing their consumers to 56/66.

After #645, troop/hospital/wall reads and writes similarly delegate to the injected
TroopsRepository inside this transaction. City retains aggregate validation and
production settlement. Three more workflows stop using the legacy city aliases;
the context/domain consumer counts were 53/63 at #645.

After #647, BuildingRepository owns building/experience SQL and scoped deletion.
City converts legacy rows into the owned update DTOs after aggregate validation,
and preserves the general-detachment update before deletion. Realm composition
injects the same transaction and owner. After #649, Building also owns construction
workflows and receives the existing context through its bounded structural port.
At #649 legacy context/domain consumer counts were 53/61; the updated inventory
tracks their eventual retirement.

After #651, the injected EquipmentRepository owns the equipment snapshot and
suit/material/equipment writes at their existing transaction positions. Equipment
and Workshop use owned structural contexts rather than the legacy City aliases,
reducing current context/domain consumers to 51/59. City bootstrap still uses the
tracked equipment projection adapter until that boundary moves to constructor ports.

After #653, the injected Tasks repository owns task/quest snapshots and persistence.
City keeps their aggregate ordering and original before-state cloning. Ordinary
quest commands specialize Base directly; the legacy context/domain aliases now
have 51/58 consumers. Shared quest refresh callers still use the tracked adapter
in [Tasks](../tasks/README.md#compatibility-and-retirement).
