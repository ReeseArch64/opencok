# Source world handler coverage

This inventory enumerates the 50 retained public `REQUEST_ID` declarations under
`handlers/requesthandlers/World`, including its alliance, arena and kingdom
subdirectories. It records concrete maintained behavior rather than inferring
completion from a passing suite. Thirty-one entry points have ordinary native
backends or factual readers. Nineteen require the listed target or admission
engine. An implemented entry point does not imply every target type, foreign
realm or specialized actor variant is available. Historical feature switches and
periods remain intact; a closed catalogue is not a reason to omit its ordinary
backend.

The adjacent `SynchronizeCityResource` handler uses `common.res.syn` and is outside
this directory's 50-entry inventory. Its maintained ordinary/shared gathering
path reads owned march state through the fenced mutation boundary and returns
collection fields and current troop balances. Unsupported target variants remain
explicitly unavailable. The [Samsung record](../evidence/native-521/README.md)
distinguishes the observed native request from the corrected response's integration
coverage.

## Ordinary handlers and factual readers

| Source handler                  | Native command        | Maintained behavior                                                                                                |
| ------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `GetAllianceWorldFightBulletin` | `al.fight.bulletin`   | Current-alliance archive; actual realm-scoped Redis ranges and unchanged UTF records.                              |
| `BuyCityDef`                    | `buy.citydef`         | Owned extinguishing and city-defense purchase with actual fire/rates/costs.                                        |
| `UseWorldBoss`                  | `create.boss`         | DEFAULT ordinary item-funded field-monster placement; Defensor variant requires its own lifecycle.                 |
| `GetMonsterBossPoint`           | `get.act.boss.point`  | Nearest actual live ordinary monster-boss point; no fabricated target.                                             |
| `FindNearestFreePoint`          | `point.nearest.find`  | Native nearest free city footprint from actual terrain and occupied cells.                                         |
| `GetResourceNewDetail`          | `resource.new.detail` | Actual shared-resource occupants, native member fields and factual counter repair.                                 |
| `DestroyTreasureMap`            | `treasuremap.destroy` | Owned map destruction with actual troop/camp and treasure state.                                                   |
| `GetTreasureMap`                | `treasuremap.get`     | Owned generation/login state from actual map items and Source placement rules.                                     |
| `SpeedUpTreasureMap`            | `treasuremap.spd`     | Owned active excavation acceleration, actual cost and reward deadline.                                             |
| `GetAllianceLeaderWorldPoint`   | `world.al.leader.pt`  | Actual alliance leader/member locations and territory points.                                                      |
| `AddWorldFavorite`              | `world.favo.add`      | Owned native favorite insertion and limits.                                                                        |
| `DelMeWorldFavorite`            | `world.favo.delme`    | Owned native favorite deletion.                                                                                    |
| `GetWorldFavorites`             | `world.favo.get`      | Actual owned native favorite list.                                                                                 |
| `GetWorldInfo`                  | `world.get`           | Ordinary and producer-backed points, native fixed reservations, interest and owned march views.                    |
| `GetWorldBarbarionPoint`        | `world.get.barbarion` | Source-gated native barbarian creation/reuse with real actor, health and lifetime.                                 |
| `GetWorldPointDetail`           | `world.get.detail`    | Actual point/actor snapshots, resource and shared-resource details, owned exploration records.                     |
| `GetMarchRecord`                | `world.get.march`     | Read-only owned, same-alliance and persisted-observer projection of actual saved parties.                          |
| `CreateTemporaryMonster`        | `world.get.monster`   | Source temporary ordinary monster creation/reuse, with real terrain and expiry.                                    |
| `LeaveWorld`                    | `world.leave`         | Remove the caller viewport interest without changing its city or parties.                                          |
| `MarchWorldPoint`               | `world.march`         | Owned gathering, shared gathering, treasure, trouble and ordinary scouting; specialized targets need their actors. |
| `MarchWorldPointCheck`          | `world.march.check`   | Native shield/occupancy preflight; no reservation, cost or overdue settlement.                                     |
| `RetreatMarchArmy`              | `world.march.retreat` | Actual owned party recall, collection settlement, cargo and troop return.                                          |
| `SpeedUpMarch`                  | `world.march.spd`     | Owned outbound/return acceleration with actual item and deadline conservation.                                     |
| `MoveWorldPoint`                | `world.mv`            | Owned item-funded native relocation and Source birth-distributed random placement.                                 |
| `MoveWorldPointByGold`          | `world.mv.gold`       | Owned gold-funded native relocation with the same destination and party protection.                                |
| `GetScoutInfo`                  | `world.scout.detail`  | Read-only native quotation from actual city geometry, buildings, effects and live target state.                    |
| `SearchUserByName`              | `world.search.user`   | Resident user search through the maintained native query.                                                          |
| `UseWorldPoint`                 | `world.use`           | Actual resource placement type 11 and ordinary monster placement type 12.                                          |
| `GetUserAllMarchRecord`         | `world.user.march`    | Owned march/army list with actual due gathering and return recovery.                                               |
| `RecoverCityDef`                | `world.user.rcd`      | Owned natural city-defense recovery from actual wall, fire, shield and rate state.                                 |
| `RecreateWorld`                 | `world.user.rcr`      | Zero-point resident recreation through persistent Source birth priorities and actual free space.                   |

## Required target and admission engines

These entries must stay unavailable before their actual dependencies can perform
the operation. A missing adapter is not an empty team, invented troop list,
successful admission or free battle. Checks that consume a token in Source must
not charge it without their real admission consumer. Territory garrison and
ownership dependencies are identified separately from battle outcomes.

| Source handler                   | Native command                    | Required factual dependency                                                                           |
| -------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `CancelAllianceTeam`             | `alliance.team.cancel`            | AllianceTeamManager team identity, leader and pending-member lifecycle.                               |
| `GetAllianceBattleTeamInfo`      | `alliance.team.info`              | Actual alliance battle-team registry and member actors.                                               |
| `GetAllianceTeamList`            | `alliance.team.ls`                | Actual alliance battle-team registry and its current admission/visibility rules.                      |
| `ArenaReinforceReturn`           | `arena.member.return`             | Arena team/owner/member registry and its deployment/return lifecycle.                                 |
| `CancelArenaTeam`                | `arena.team.cancel`               | Arena team actor and authoritative member/leader state.                                               |
| `GetArenaTeamInfo`               | `arena.team.info`                 | Arena team actor and actual member state.                                                             |
| `GetArenaTeamList`               | `arena.team.ls`                   | Arena team registry and current mode visibility.                                                      |
| `KingdomMemberRetreatInBuilding` | `kingdom.member.retreat.building` | Kingdom building actor and its deployed member/garrison registry.                                     |
| `KingdomReinforceReturn`         | `kingdom.member.return`           | Kingdom team/garrison actor, ownership and actual return lifecycle.                                   |
| `CancelKingdomTeam`              | `kingdom.team.cancel`             | Kingdom team actor, leader permissions and members.                                                   |
| `GetKingdomTeamInfo`             | `kingdom.team.info`               | Kingdom team actor and actual deployed/arrived members.                                               |
| `GetKingdomTeamList`             | `kingdom.team.ls`                 | Kingdom team registry and current mode visibility.                                                    |
| `GetMiracleDetail`               | `miracle.detail`                  | The actual kingdom miracle actor and its realm/mode state.                                            |
| `KickOccupiedMarchBack`          | `occupied.march.kick`             | AbstractWorldOccupiedTarget owner/defense registry and leader permission; plain camps are ineligible. |
| `MarchChristmasCheck`            | `world.christmas.march.check`     | NPC-1 admission, ActivityMonsterKey once-only record, party count and actual item admission consumer. |
| `GetOccupiedTargetTroopsInfo`    | `world.get.occupied.troops`       | Territory/throne/trebuchet/dragon-building occupied-target actor and actual allied defense list.      |
| `RetreatMemberMarchArmy`         | `world.march.member.retreat`      | Rank-4 alliance permission and actual AbstractTerritoryBuilding deployment/retreat lifecycle.         |
| `NpcBossCheck`                   | `world.npcboss.march.check`       | Live WorldBossManager service subtype 4 and its item-funded NPC admission consumer.                   |
| `BuyWorldPVEAttCount`            | `world.pve.count.buy`             | Actual UserWorldPVE point admission/count lifecycle and its validated PVE consumer.                   |

## Target variants and world producers

Ordinary resources use the actual realm opening, maintained weighted groups,
normal and black-land quotas, replacement tickets, Source resource-area borders,
merge spawn modifiers and bounded persistent recovery. Resource props remain
separate from natural quotas. Shared resources 37/38 have their own producer,
expiry and multi-party settlement; the shipped `on_event2` period/quota remains
closed without substituting a current date. Temporary and ordinary monsters,
barbarians and DEFAULT `create.boss` are actual noncombat creation recipes. Their
availability must not be classified as requiring a simulated victory. Attacks,
casualties and loot still require their validated outcome engine.

Type 60 neutral resources require the Source emperor realm and neutral load/
collection module. Type 63 is the `INewResourceBattle` lifecycle: its own point
producer, configuration, timed occupation, resource/reward recipe and protection
transition. An unoccupied target can skip combat in Source, but that does not
make it an ordinary type-3 resource or supply its missing mode state. Its empty
capture must not bypass the corresponding validated target engine. Defensor
`create.boss` variants likewise require their actual actor, extra costs and
ownership state; they are not equivalent to DEFAULT field-monster props.

`world.scout.detail` is an ordinary quotation, not a stored report reader. Its
backend is independent of report creation. Actual scout execution uses the
separate Source scout admission and `WorldScoutHandler` cost, travel, shield,
visibility, intel-mail and return path. Its ordinary targets are resident cities,
occupied resources, occupied camps and actual barbarians; special territory and
team targets require their authoritative mode actors. It must not be described as an army battle solely
because the Source handler inherits a fight base class. Its supported ordinary
and specialized targets are documented with the execution implementation.

The viewport supports maintained ordinary producer points and native fixed
reservations. Imported specialized territory/campaign overlays still require
their actual actor fields; a bare point type or owner flag cannot invent that
state. Existing point-detail readers expose their actual saved snapshots where
supported. Team/garrison list and permission checks need their target registries,
not inferred members from unrelated ordinary parties.

Fresh terrain uses an explicit operator import of the authored layout, native
reservations and matching dimensions/hash. The application does not depend on an
ignored private file. Initial birth, recreation and random relocation share the
persistent Source priority allocator. Unknown historical birth phase requires
explicit versioned adoption from factual occupancy; it is not replaced with an
assumed fresh counter or all-map phase.

## Maintained evidence

The implemented economics, source geometry, real actors, native field types,
owned/foreign permissions, resource conservation, deadline recovery, forced
rollback and fresh-pool/process behavior are covered by the focused PostgreSQL,
Redis, native serialization and process suites described in:

- [Advanced progression and world runtime](advanced-progression-events-world.md)
- [Ordinary world resources](ordinary-world-resources.md)
- [Resident birth and adoption](resident-world-birth.md)
- [Shared world gathering](shared-world-gathering.md)
- [Native march inspection](world-march-inspection.md)
- [Scout quotation](world-scout-quotation.md)
- [Alliance battle archives](world-battle-bulletins.md)

Those checks establish the specified behavior and invariants. They do not
validate missing target engines, real-device execution or every imported actor
variant. No raw private Source, authored terrain, player data or credentials are
part of this inventory.
