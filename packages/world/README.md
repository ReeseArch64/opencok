# World domain

[Issue #691](https://github.com/ReeseArch64/opencok/issues/691) establishes the
implemented World package for map browsing, search, favorites and spatial utilities
under [domain layout policy](../../.github/ARCHITECTURE.md#domain-package-migration-convention).
The realm server retains the database, authority token and command lifecycle.
Package ownership does not introduce a separate World process.

## Scope and responsibilities

| Flow                                                   | Owned behavior                                                                                                              |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Map/viewport                                           | Viewport selection, compact points, response sections, resident-world reads, subscription and march projection coordination |
| `world.search.user`                                    | Input/page selection, bounded local/remote search and native response                                                       |
| `world.favo.get`, `world.favo.add`, `world.favo.delme` | Favorite selection, replacement, deletion, metadata and native response                                                     |
| `point.nearest.find`                                   | Bounded spatial snapshot and nearest footprint                                                                              |
| `world.al.leader.pt`                                   | Alliance leader/territory spatial projection                                                                                |
| `world.leave`                                          | Resident-world validation and fenced subscription deletion                                                                  |

Contracts, query snapshots and native responses live in `src/contracts`; the
favorite create input lives in `src/dtos`. Pure selection belongs to `src/rules`,
wire projection to `src/mappings`, boundary schemas to `src/validations`, and
workflows to `src/services`. `src/controllers` delegates map requests to the owned
service. `src/repositories` owns the existing SQL implementations and readiness
queries. Selective source exports avoid a package barrel that loads all adapters.
This initial slice has 28 source modules (1,837 physical lines), three package test
files (90 lines), and a moved synthetic name fixture. There is no generated catalog
payload. Command/composition and PostgreSQL tests remain in Server.

Realm composition supplies profile checks, clocks, catalog-derived server metadata,
Java integer parsing, cosmetic/monster/march projection and transaction fencing.
Map reads no longer route through the broad GameStore/Database facade. The actual
application constructs the owned reader and service. Generic transport dispatch
and frame checks remain in GameService at their existing positions.

## Preserved protocol and persistence

Viewport geometry, insertion order, center inclusion and supported point types
retain their existing behavior. Point times still narrow signed seconds and retain
the Alliance Heart fields. Point and section byte limits, section grouping, field
order and SFS value types remain unchanged. The clock is read for each compacted
point; all points are projected before subscribing the observer, then march rows
are read. A failed subscription prevents the march read. Cosmetic, monster and
march calculations remain supplied by their owners.

Search preserves signed Java page arithmetic, SQL wildcard matching, ordering and
eight-row pages. The local profile is authorized within its current transaction
before the code accesses a requested remote realm. Remote reads retain their
separate snapshot and existing dependency-error behavior. This is not a new
cross-realm write protocol.

Favorites preserve their exact native names, signed integer fields, server-type
mapping and owner locks. Add uses the original mutation timestamp and a separate
response timestamp. Replacement retains its composite conflict key; deletion
retains pair selection, deduplication, batches of 500 and rollback/result behavior.
Listing keeps its original ordering and global server metadata lookup.

The application installs `fenceRealmDatabase` on the same realm database used by
favorite closures before admitting commands. The wrapper fences every transaction
that is not explicitly read-only; moving the favorite repository must preserve that
guarded database. `world.leave` additionally retains its existing explicit fence
inside its write transaction before reading residence and deleting `world_interest`.
Read-only utility snapshots retain repeatable-read isolation and bounds. These
flows include writes and must not be described as a read-only package.

## Migration register and remaining work

| Previous owner                                                                           | World destination                                                          |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Services `world.service` and Controllers `world.controller`                              | Map Service, rules, mappings, runtime contracts and Controller             |
| GameService `worldSearch` and `worldFavorites`                                           | Owned query Service                                                        |
| Database `getWorldByPointIds`                                                            | Owned map repository, composed directly in the application                 |
| World favorite contracts/response, create DTO, rules, mapping, validation and repository | Matching responsibility directories                                        |
| World search contracts/response, rules, mapping, validation and repository               | Matching responsibility directories                                        |
| World utility Service, contracts/response, rules, mapping and repository                 | Matching responsibility directories                                        |
| Pure viewport, section and footprint tests                                               | Owned package discovery; composition and PostgreSQL tests remain in Server |

Standalone horizontal implementations and zero-caller map/controller aliases are
removed. Shared player search and point-detail consumers explicitly import the
owned `worldSearchName`/`favoriteInteger` primitives; they do not retain duplicate
implementations. GameServices retains aggregate adapters until those callers are
composed directly under #558 W20.

Point-detail ownership is implemented in #693, with actual power/Hero, resource,
monster and territory projection collaborators. Population ownership follows in
#695 below. Resource queries, gathering/cargo, march lifecycle, scouting and
multi-aggregate spatial recovery remain later W10 work. Their current realm
transactions and authority are unchanged. This delivery does not complete
[realm authority design](../../.github/ARCHITECTURE.md#9-authoritative-server-zookeeper-and-scaling), W10,
W18 or the full [#558](https://github.com/ReeseArch64/opencok/issues/558) inventory.

## Validation and deployment

Run the World package tests, Server command tests and focused PostgreSQL suites for
favorites, utility, city cosmetics, Alliance Heart and point-detail regression,
alongside architecture checks, affected type checks, frozen installation, lint,
formatting and the Server build. Structural comparison checks original workflows,
SQL, schema and composition; runtime tests establish callback order and actual
guarded writes. Synthetic protocol coverage does not prove native-device rendering
or production performance.

Deploy or roll back the complete realm artifact with the matching workspace
lockfile. No schema, saved identifier, configuration value, client asset or
independent writer changes are required. Preserve existing favorites, residence,
subscriptions, authority epochs and march data; no reset or data conversion is
needed. Existing backup and recovery procedures remain applicable.

## Point details and specialized projections (#693)

World also owns the complete `world.get.detail` query: point selection, local and
remote authorization, spatial snapshots, owner/city visibility, specialized
territory/boss presentation and native response assembly. The former point-detail
Service, special-detail Service, two repositories, rules, Mapper, validation and
contracts move into their matching responsibility directories. Shared GameService
retains transport dispatch and its complete response/frame checks.

Resource/gathering calculations, monster health and exploration interpretation,
barbarian army/power calculation and player/Hero effects remain with their current
owners. The realm injects those actual collaborators. World coordinates their
results in the original order instead of importing horizontal packages or copying
the algorithms. Showing a territorial reward flag or boss rank is a projection;
it cannot grant benefits or settle an event.

World's snapshots are generic over city effects and resource-owner state. Their
constraints describe only fields inspected by spatial code; injected calculators
retain the concrete data they need. The existing `WorldResourceOwnerSnapshot`
aggregate now lives in `contracts/src/world-resource-owner.ts`, separately from
spatial query contracts. It still combines player effects, buildings and Hero world
state for City, Hero, Scout, march inspection and reconnect. That concrete aggregate
and its effect/resource implementation remain tracked W10/W20 migration work.
There is no reexport at the former `contracts/world-point-detail` path.

The former 823-line point repository is separated into the factory/readiness flow,
target selection, owner/city reads, march snapshots and shared value validation.
Their original transaction reader and call order remain intact. At #693, World contained
43 source modules (4,512 physical lines), four package test files (113 lines) and
no generated catalog payload. The 492-line specialized presentation Service was
reviewed as one bounded read workflow with territory/boss variants and explicit
external calculators; it owns no gameplay writes. Additional unrelated families
should receive their own responsibility modules rather than expanding that service.

Repository callbacks for city effects and resource-owner state receive the exact
current transactional reader. The queries retain `repeatable read`/`read only`,
existing limits and error translation. Remote requests authorize the local profile
and residence before opening the target realm's transaction. This remains two
ordered snapshots, not a distributed snapshot or new write authority. Read-only
transactions continue through the current database wrapper without a mutation
fence.

Projection preserves early returns, remote field omissions, signed quantities,
legacy JSON round trips, exploration's Java ordering, individual clock samples and
collection/byte bounds. Turret archive reads retain their position in the query.
Reading a point never repairs gathering pointers, starts exploration, moves troops
or liquidates rewards. Tests use actual owner collaborators and synthetic data;
the PostgreSQL point-detail suite verifies authorization and unchanged gameplay
state across local/remote resource, territory and boss reads.

Deployment and rollback use the complete realm artifact against the same schemas,
saved identifiers, exploration/march state, effects and reward ledgers. No client
asset, environment value or process topology conversion is introduced. Native
rendering, semantic definitions and full W10/W18 completion remain separate work.

## Population admission and recovery (#695)

[Issue #695](https://github.com/ReeseArch64/opencok/issues/695) moves all twelve
shared-resource, ordinary-resource and monster population modules from Contracts,
Rules, Services and Repositories into World. This includes settings and quotas,
expiry, occupied-cell handling, dead tickets, replenishment, durable clocks and
transactional persistence. All callers use the owned implementations; the old
horizontal paths have no compatibility aliases.

The three population Services receive bounded catalog and numeric collaborators.
Monster work is separated into expiry, field/black-land, exploration and barbarian
families, with a small shared state module. Catalog getters retain live access to
the existing records; NPC configuration, cell selection, feature gates and numeric
algorithms are real collaborators supplied by realm composition. World does not
acquire NPC semantic definitions, troop/economic behavior or gathering settlement.
The item-use consumer calls the same owned resource-duration and barbarian-actor
rules with narrow inputs; it does not copy their algorithms.

World now contains 64 source modules (7,935 physical lines), four package test files
(113 lines) and no generated catalog payload. This growth represents the existing
spatial population vertical, not a new workspace or a catch-all gameplay package.
The former 799-line monster Service is divided by its actual family workflows;
the three persistence modules retain their cohesive transaction, clock and outbox
boundaries. Broader march, scouting and gathering workflows remain separately
tracked rather than extending these modules.

The existing application `WorldPopulationJob` still runs shared resources, ordinary
resources and monsters sequentially, isolates each failure and loads world effects
inside the ordinary-resource transaction callback. The same realm writer and
recovery fiber own its lifecycle. Each executor preserves transaction fencing,
then advisory lock `(728214, 0)`, then timestamp capture, followed by the existing
work and outbox writes in that transaction. Readiness checks and dynamic authority
epochs retain their original positions. Ordinary-resource expiry throttling updates
its in-memory deadline only after a successful commit.

SQL ordering and row locks, page limits, RNG consumption, Java numeric behavior,
clock versions, retry deadlines, ticket identities, UUID generation and native
outbox payloads are unchanged. Family coordination retains expiry before opening
checks, then exploration and barbarians, followed by field and black-land monsters
when enabled. No new writer, scheduler, worker backend or cross-owner protocol is
introduced.

Existing Server fixtures exercise the real composed collaborators and disposable
PostgreSQL persistence, including clock-after-lock, restart, occupied cells,
rollback and stale authority. The maintained
[population benchmarks](../../apps/server/README.md#synthetic-world-population-performance-baseline)
measure bounded PostgreSQL workloads and a separate cell-selection calculation.
Their synthetic measurements do not establish production latency, native rendering
or a benefit from process isolation. W02, W10 and the broader #558 inventory remain
incomplete.

Deploy or roll back the complete realm artifact with its matching lockfile. Existing
population clocks, tickets, points, authority epochs and outbox records retain
their schema and saved identities. No reset, data conversion, configuration change
or client asset replacement is required.
