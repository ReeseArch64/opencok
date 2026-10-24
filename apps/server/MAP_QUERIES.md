# Additional map queries

Topic 5 completes the existing read surface for the ordinary kingdom server and
client 12.06.0. `world.get.detail` now composes occupied resources and specialized
territories alongside the existing city, exploration, monster, barbarian and neutral
resource branches. `world.get`, player search and owned favorites retain their
existing contracts. This supersedes the historical pending-command statements in
README's map foundation sections and issue #85.

## Command behavior

The authenticated observer selects the local current world or a configured remote
kingdom's world zero. Positive missing points fail; nonpositive points return the
existing empty reply. No request creates a march, starts combat, modifies troops,
claims rewards, repairs ownership or schedules collection.

| Points                      | Additional fields                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Occupied resource 3         | Saved owner march quantity, Float speed, Long start/end/change times and collected count, with current remaining quantity and resource weights |
| Occupied shared resource 37 | Restored owner capacity and duration; local aggregate Float speed, Int remaining quantity, Double sampling time and member count               |
| Territory 14/20/46/47       | Nested public territory and owner/team state, observer march, existing troop count and owner garrison capacity                                 |
| Territory resource 18       | Nested territory and source-compatible quantity fields; local positive territory effect when applicable                                        |
| Turret 21                   | Territory and existing defense counts; active turret casualty archive with public profile fields                                               |
| Warehouse 23                | Alliance resource deposits and public profiles; orphan profiles omitted and source-defined negative balances clamped                           |
| World boss 49/50            | Local active boss state and observer reward eligibility; no reward settlement                                                                  |

Local territory times remain signed Long values, including values above JavaScript's
safe integer range. Start, update and activation sentinel times map to zero. Remote
nested objects pass through legacy JSON numeric conversion: small integral values
can narrow to Int, scientific floating values remain Double, and large Long values
remain exact. Observer-specific march identifiers and local handler additions are
omitted remotely.

## Persisted-state restoration

Queries use repeatable-read, read-only PostgreSQL transactions. Remote authorization
commits locally before a separate destination snapshot. Cross-realm cache reads use
the destination kingdom. Database and cache failures remain visible rather than
being translated into successful empty responses. Missing optional territory/boss
objects retain the legacy omission behavior.

The new server does not reproduce the old process's object residency or scheduler.
Resource armies use the explicit nonresident restoration policy: positive persisted
army load wins; otherwise existing owner effects and saved troops reconstruct load.
Presence of an SQL owner row never implies a resident Java object. Shared-resource
maximum collection duration is reconstructed from the occupying destination group,
remaining resources, saved arrival time and owner capacity at query time. This
restores a fresh process deterministically without advancing or saving its scheduler.

Defense and collection groups use UUID order. Boss ranks use persisted ID order for
score ties, followed by the source's wrapped score comparison. Former identity-set
iteration and unsaved scheduling history cannot be recovered. Boss hurt defaults to
zero, as in a freshly restored legacy boss; that counter was not persisted. Missing
owner march pointers are left untouched. Special battle-server modes and their
server-specific bonuses are not introduced into the ordinary kingdom process.

Garrison capacity includes school and war-hall catalogs, persisted player/world
modifiers, assigned generals, civilization and applicable expedition effects. It
reads existing alliance or kingdom teams and occupying marches without assembling,
repairing or updating teams. Bounds reject more than 4,096 defense/collection marches,
1,000 warehouse/archive entries, 10,000 boss ranks or oversized binary/archive data.

## Runtime and deployment

No SQL migration or new dependency is required. Existing kingdom tables supply the
world, territory, team, march, warehouse and boss snapshots. Startup probes their
required columns. The resource loader additionally reads the ordered
`GameplayCatalog.AllianceBuilding` TypeScript catalog for territory state calculation.
It ships with the application; no XML directory or resource mount is required.

Active turret history is a Redis hash at
`opencok:kingdom:<kingdomId>:turret:<territoryUid>`. Fields are player UIDs and values
are the existing casualty JSON objects. A missing hash means no recorded casualties;
a wrong Redis type, malformed content or failed read fails the query. There is no
fallback to a legacy unscoped `turret_<uid>` key. Operators importing existing data
must copy the authorized archive into the appropriate kingdom namespace. These
queries never write the archive. SQL and Redis are separate snapshot boundaries.

Deployment only enables reads. Rollback consists of deploying the previous server;
there are no data transformations or irreversible effects. Preserve the archive and
existing state across rollback. No deployment or production-data access is part of
this change.

## Validation

Synthetic command tests retain authorization, routing, field widths and error checks.
New tests cover every specialized territory, actual-level state selection, warehouse
visibility, casualty filtering, boss reward bounds, remote nested JSON, occupied
resources, shared duration restoration and garrison capacity. Existing independent
Java arithmetic fixtures continue covering resource Float32 and signed overflow.

The disposable integration test migrates two PostgreSQL databases and starts Redis.
It checks local and remote territory queries, kingdom-scoped archives, exact Long
values, occupied ordinary/shared resources, service reconstruction, missing march
pointers, denied observers, unavailable routes and malformed cache dependencies.
It verifies unchanged territory state and unclaimed boss rewards. No mobile client
or production kingdom is used; client tracks other than 12.06.0 remain untested.
