# Equipment and workshop

This domain owns equipment and workshop workflows after #651 under #558 W08.
It preserves the existing city transaction, native fields, queues 11/12, random
call order, costs, pending writes, rewards and recovery behavior. It introduces
no new process authority, schema or gameplay catalog.

## Ownership and composition

| Responsibility                                      | Owned path                                                                         | Previous location                                                 |
| --------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Command/activity dispatch                           | `src/services/equipment.ts`, `commands.ts`, `activity.ts`                          | `services/src/equipment.ts`                                       |
| Forge planning and material conversion              | `src/services/forge.ts`, `materials.ts`                                            | `services/src/equipment.ts`                                       |
| Ownership/forge access and creation                 | `src/services/access.ts`, `factory.ts`                                             | `services/src/equipment.ts`                                       |
| Workshop prepare/apply/next/acceleration            | `src/services/workshop.ts`                                                         | `services/src/workshop.ts`                                        |
| Recipes, costs, quality, properties and dismantling | `src/rules/equipment.ts`                                                           | `rules/src/equipment.ts`                                          |
| Native and public projections                       | `src/mappings/equipment.ts`, `public-equipment.ts`                                 | `mappings/src/equipment.ts`, `equipment-preview.ts`               |
| Public response/schema                              | `src/contracts/responses/equipment-preview.ts`, `validations/equipment-preview.ts` | Shared Contracts/Validations                                      |
| Equipment/suit/material persistence                 | `src/repositories/progression.ts`                                                  | `repositories/src/equipment.ts` and City equipment snapshot query |

`contracts/equipment.ts` bounds the catalog, context, pending plan and creation
context. `contracts/runtime.ts` declares existing numeric/record readers, native
queue projection and quest-update collaborators. They are injected in
`apps/server/src/composition/equipment.ts`. Equipment and Workshop specialize the
Base activity lifecycle; their native commands live in separate enums. The realm
creates one pair of domains and keeps the previous observability adapter names.

The workspace has 19 source modules and one owned test file. The 512-line command
class retains dispatch order and the shared suit-selection state; the 231-line
forge planner owns the early-return activity preparation branch. Access, creation,
materials, completion and workshop lifecycle have separate classes. This follows
[ADR-0016](../../docs/decisions/0016-adopt-domain-owned-package-layout.md) without a
single oversized workflow module or a class per native command.

Equipment imports no horizontal Rules, Contracts, Mappings, Services or Repositories.
Numeric helpers and row readers remain single implementations behind the runtime
ports. Inventory projection comes from Economy. The shared weighted-choice algorithm
moves to `rules/src/weighted-choice.ts`, still consumed by World, Hero, Dragon and
events; Equipment receives it through its rule runtime. The native row-shaped plan
and record catalogs remain transitional #558 work. Semantic definitions under
ADR-0018 are not claimed complete.

`EquipmentRepository` receives the existing realm transaction, owner and row readers.
It owns the equipment snapshot, bounded suit snapshot, owner checks/upserts/deletions,
suit selection and material backup/acceleration/queue updates. City calls this adapter
at the previous read/write positions. No repository opens another transaction or
acquires a global client. Its bounded legacy plan retains exact normalization,
including empty locks becoming null, zero show-sign becoming one and bigint times.
Typed DTO conversion is still tracked with legacy row retirement under #558 W20.

## Compatibility adapters and retirement

Three existing entrypoints delegate to bound owned classes and retain no gameplay
implementation. Equipment owns them; #558 W20 tracks moving the listed consumers to
injected domain collaborators and deleting each adapter once its last import moves.

| Adapter                                           | Current consumers                                                                                                        | Removal condition                                                           |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `services/src/equipment.ts` (`newEquipment` only) | Services `hot-item`, `progression-rewards`, `quests`                                                                     | Move these creation integrations to injected EquipmentFactory collaborators |
| `mappings/src/equipment.ts`                       | City `mappings/bootstrap`; Services `activity-reward`, `dragon-tower`, `hot-item`, `progression-rewards`, `treasure-map` | Compose owned EquipmentMapper in these projection integrations              |
| `mappings/src/equipment-preview.ts`               | Player `mappings/public-profile`, `tests/public-profile-mappings.test`                                                   | Inject PublicEquipmentMapper and migrate its fixture                        |

The old workshop Service, equipment Rules/Repository and public response/schema
paths are removed; every maintained caller uses the replacement. Player and shared
activity reward contracts consume the owned public schema/response. Rules and
Services no longer form the former equipment/quest cycle; 11 obsolete cyclic-edge
entries are removed from the architecture baseline, reducing total violations from
90 to 79 without new exceptions.

## Verification and recovery

Run `bun run --cwd packages/equipment test`, root package and architecture suites,
and relevant workspace type checks. Owned tests cover recipe accumulation and material
families, property-library filtering, dismantling draw order, creation capacity and
native/public projection details. Shared weighted-choice tests cover scaling, boundary
selection, invalid random outputs and malformed weights. Existing app tests exercise
the real numeric/catalog collaborators and gameplay commands.

The original equipment/public-profile baseline retains 10 tests/67 assertions and
PostgreSQL equipment/workshop retains four tests/21 assertions. New persistence tests
verify foreign UUID/removal rollback, exact committed normalization, suit/material
rollback after missing queue updates and timestamps beyond Number precision. Core
SFS/timed economy, quests, general equipment, hot-item, Dragon Tower and Treasure Map
exercise shared consumers. Thirty-three structural comparisons preserve migrated
runtime bodies, projections, schema and complete reconstructed City read/write flows,
including the extracted forge branch and explicit collaborator substitutions.

Run frozen install, root lint/format and the realm build before delivery. This source
migration makes no performance or native-device compatibility claim. No deployment
configuration, resource replacement or saved-data conversion is required. Deploy the
rebuilt realm; rollback restores the previous artifact against the same equipment,
suit, mixed material, queue/activity, receipt and outbox records.
