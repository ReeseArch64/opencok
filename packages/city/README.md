# City transaction coordination

City owns `CityProgressionContext`, `CityProgressionContextFactory` and
`CityProgressionService` after #637 under #558 W07. They coordinate a pending
aggregate write and economic plan, load the existing effect snapshot and route
commands or timed activity actions to injected mechanic implementations. The realm
remains the authoritative process; this extraction does not implement [realm authority design](../../.github/ARCHITECTURE.md#9-authoritative-server-zookeeper-and-scaling)'s
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

After #655, `TargetTaskRepository` owns target notes/task reads and writes. City
preserves their position in the aggregate transaction; the realm supplies the same
numeric adapters and owner. Legacy context/domain aliases now have 51/57 consumers;
the remaining target callback adapter is tracked in the Tasks retirement register.

After #657, the injected `RecallTaskRepository` owns recall notes/task persistence
and the conditional preferred registration-country read. City preserves its position
and command gate in the aggregate snapshot/writer. Current legacy context/domain
aliases have 51/56 consumers; Tasks tracks the remaining callback/type facades.

After #661, `CosmeticRepository` owns target/profile/world lookup, locked cosmetic
states/ownership and the existing target writes. The realm injects it into City;
the session forwards it to the same conditional snapshot and mechanic-writer
positions. Actor/target authority, transaction and other mechanics remain unchanged.
Avatar activation uses Skins' structural context and Base lifecycle, leaving 51/55
legacy City context/domain consumers. Shared cosmetic aggregate aliases are tracked
in [Skins](../skins/README.md#source-ownership-and-compatibility).

## Login query projections (#560)

`CityInitializationReader` hydrates the 21 commands enumerated in
`src/enums/initialization-command.ts`. Every projection includes the current
profile, resources, statistics, buildings, sciences, armies, equipment, tasks and
quests because the shared quest refresh consumes these inputs. Profile/resources
and optional statistics use one typed one-to-one join. Collections remain separate
and retain the existing readers, ownership predicates and bounds. Each command
adds its own mechanic state. VIP box, investment and effect initialization still
load the authoritative effect snapshot; other selected commands perform no effect
calculation and skip the external world/emperor reads.

The returned projection rejects access to an unloaded field. An unloaded collection
is never represented as an empty authoritative collection. Quest refresh explicitly
builds its contracted input instead of spreading unrelated city fields. Unknown
commands, ordinary mutations, timed transitions and the remaining initialization
commands use the original aggregate. The factory requests that complete aggregate
when the economy has pending item grants or cannot prove their absence, preserving
the campaign hooks after offline settlement. Inspecting pending grants does not
consume them or advance the ledger cursor.

There is no reuse across commits, owners, kingdoms or captured times. Bootstrap
mutation order, the previous-session drain, session token comparisons, receipts,
production boundaries and PostgreSQL fencing remain unchanged. Composition can
set `projectInitialization` to `false` to compare or roll back query selection
without changing data or schema. No dependency or environment variable was added.

No new L1/L2 cache ships here. The removed reads are authoritative progression,
quest, effect and eligibility inputs, so a cross-command cache would need freshness
and invalidation guarantees that a display cache cannot provide. Immutable rule
catalogs are already resident. Query savings below come from projection alone;
they are not evidence of a caching gain or completion of #562.

### Reproducible validation

Run from the repository root:

```sh
bun --no-env-file test packages/city/tests packages/tasks/tests packages/economy/tests
bun --no-env-file test apps/server/integration/login-projections.test.ts apps/server/integration/city-persistence.test.ts apps/server/integration/realm-lock-diagnostics.test.ts
bun --no-env-file test packages/drizzle/tests/observed-pool.unit.test.ts packages/drizzle/tests/query-failure.unit.test.ts
```

The projection comparison uses disposable PostgreSQL 17.11, Bun 1.4.2, maintained
catalogs and synthetic accounts. It compares each selected command against the
complete snapshot under the same captured time, rolls each comparison back, checks
identical response bytes and pending writes, and then checks a committed change is
visible to the next read. Quests and lottery are initialized before comparisons so
random daily selection and a newly generated lottery grid do not contaminate the
comparison. Kingdoms 1 and 2 are independent runs with identical synthetic fixtures.

Against baseline `9badbe05`, each kingdom reduced the selected 21 phases from
1,512 to 406 SELECTs (73.1%). In the recorded local run their summed phase wall
times were 1,525 to 719 ms for kingdom 1 and 1,457 to 760 ms for kingdom 2. These
are single local workload samples including rollback and logging, not full login
latency, provider RTT, concurrent-load percentiles or a native-device SLO result.
The test prints fresh query/time evidence on every run. The complete-snapshot
comparison remains available independently of these historical samples.

Unit coverage verifies omitted-field rejection, exact bigint preservation, missing
owners, aggregate bounds, absence of unnecessary effect loads and safe fallback for
pending/unknown item grants. The pending-grant fallback was manually mutated by
inverting its predicate; the focused tests rejected that mutation. Existing bootstrap
and TCP session suites cover native field/order compatibility, replacement,
cancellation and active-token preservation. Actual PostgreSQL rollback is exercised
by the persistence suite. There is no claim of a repository-wide mutation score.

### Operational attribution and remaining acceptance

PostgreSQL pool acquisition now emits `database_pool_acquired` separately from
statement execution, including wait duration and bounded pool counts. Database
failure events retain the existing reason and add `failureKind` to distinguish
server statement timeout, query cancellation, lock timeout and unavailable locks.
Only fixed classifications are emitted; SQL, parameters and raw errors are excluded.
Unknown/localized server messages retain the conservative cancellation/unavailable
classification. Application cancellation remains separate from PostgreSQL failures.

`readRealmLockDiagnostics` returns at most 64 lock records for current-database
`realm_authority` participants, including their waiting transaction locks, blocker
PIDs, modes and transaction/wait ages. It excludes query text, addresses, database
users and player fields. Its disposable concurrency test creates a real row-lock
wait and verifies the blocker relationship. PostgreSQL-specific diagnostic SQL is
retained because catalog inspection and `pg_blocking_pids` are PostgreSQL APIs.
No locking or admission policy changes are inferred from these diagnostics.

The existing telemetry context and disposable Maple integration suites verify
context isolation and exported signals. This does not establish completeness of the
operator's live Maple queries or identify the historical incident's lock owner.

Issue #560 remains open until the new server artifact is exercised with synthetic
fresh/existing native accounts and the full warm/cold, concurrent-login, recovery,
reconnect and restart workloads. Record client/artifact revisions and topology,
full login p50/p95/p99, pool and lock waits, and actual init delivery before the
approximately 30-second retry boundary. Evaluate the proposed warm p95 of 10 s
using that evidence. Local projection timings cannot establish those criteria.
