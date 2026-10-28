# World domain

[Issue #691](https://github.com/ReeseArch64/opencok/issues/691) establishes the
implemented World package for map browsing, search, favorites and spatial utilities
under [ADR-0016](../../docs/decisions/0016-adopt-domain-owned-package-layout.md).
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

Specialized point detail requires projections from power/Hero, territory and other
owners. Resource queries, gathering/cargo, populations, march lifecycle, scouting
and multi-aggregate spatial recovery remain later W10 work. Their current realm
transactions and authority are unchanged. This delivery does not complete
[ADR-0017](../../docs/decisions/0017-adopt-fenced-realm-process-authorities.md), W10,
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
