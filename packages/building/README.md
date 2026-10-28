# Building definitions, progression and persistence

This workspace owns building definition contracts, the maintained typed catalog,
level/star evaluation and display/legacy-record mappings after #635. The realm's
central Rules consumer uses these modules. Typed persistence is owned after #647
and construction workflows after #649; City retains aggregate coordination. Existing authority, prices,
queues, receipts and stored building state are unchanged.

## Source ownership

| Responsibility                                | Owned path                          | Previous location                   |
| --------------------------------------------- | ----------------------------------- | ----------------------------------- |
| Definition/state contracts                    | `src/contracts/building.ts`         | `contracts/src/building.ts`         |
| Level/star evaluation                         | `src/rules/levels.ts`               | `rules/src/building.ts`             |
| Display and prerequisite projection           | `src/mappings/display.ts`           | `mappings/src/building.ts`          |
| Legacy record conversion                      | `src/mappings/legacy-definition.ts` | `resources/src/buildings/import.ts` |
| Catalog declarations, indexing and provenance | `src/resources/buildings`           | `resources/src/buildings`           |
| Existing catalog/isolation tests              | `tests/catalog.test.ts`             | `resources/tests/buildings.test.ts` |

All maintained callers use the owned paths; no compatibility facade remains.
Exports are selective source paths. Rules import contracts and shared errors and
constants; they load no catalog, ORM, transport or universal registry. The catalog
entrypoint is `@opencok/building/resources/buildings/index`.

## Authoring and compatibility

Edit `src/resources/buildings/<buildingId>.ts` for costs, prerequisites, durations,
capacities and star steps. The catalog retains 1,511 levels across 41 types and
uses exact bigint costs. `createBuildingCatalog` clones nested definitions for
realm isolation; `getBuildingDefinition` exposes the existing numeric identity,
maximum level and resource identity. Mappers retain native display order and
absent/zero distinctions. The legacy-record adapter accepts already parsed records;
it neither reads XML nor owns the parser.

The 41 numeric data modules account for almost all source lines. They remain grouped
under `resources/buildings` separately from the small contracts/rules/mappings.
This is an ownership migration of the existing typed model, not the semantic
archetype conversion required by [semantic definition policy](../../.github/ARCHITECTURE.md#client-backed-semantic-definitions).
Opaque identities are preserved without invented names. Shared cross-domain plans,
projection boundaries and semantic identities remain tracked under #558 W07/W14.

The authoring CLI remains in [catalog-tools](../catalog-tools/README.md#catalog-and-building-imports).
Its default destination is this catalog directory, and emitted modules import the
owned contract. Explicit isolated destinations remain supported. Importing may
overwrite authored changes; original authorized inputs stay read-only. The moved
provenance file retains its original source fingerprint and counts. Neither the
CLI nor private client inputs are runtime dependencies.

## Verification and rollout

Run `bun run --cwd packages/building test`, root package and architecture suites,
and the server's building-mechanics, settings, availability, power and reconnect
tests. Construction and timed-economy PostgreSQL scenarios exercise the actual
transactions and production boundary. Catalog-tools tests normalize only the
new contract import before comparing against the original generated-byte digest;
they separately assert that the new import is emitted.

The original 50 moved files, including all numeric declarations and provenance,
are byte-identical after import relocation normalization. Boundary tests cover
invalid identities/levels, star thresholds, maximum progression, bigint precision
and ordered requirements/display values. No data migration or operator configuration
is required. Deploy the rebuilt realm, or roll back to the prior artifact against
the same database. Native device and production-load validation remain separate.

## Typed persistence (#647)

`repositories/progression.ts` owns the city progression reads and writes for
`user_building` and `user_building_exp`. It receives the existing realm transaction
and owner from `apps/server/src/composition/city-persistence.ts`. Its two update
inputs are declaration-only DTOs in `dtos/update-building.dto.ts` and
`dtos/update-building-experience.dto.ts`; the owner is bound by the repository,
not supplied by the building update DTO.

The adapter preserves the ordered 257-row building snapshot, experience query,
foreign UUID rejection, guarded upsert, exact bigint timestamps/experience and
owner-scoped deletion. City invokes these methods in their original positions.
City retains aggregate validation, conversion of legacy rows to the typed DTO,
production settlement, receipts/outbox and the general-detachment update before
building deletion. No method opens another transaction or acquires a global client.

This boundary adds three source files, bringing the workspace to 51 source modules
and two owned test files. Construction commands still live in Services; their
remaining workflow, prerequisite and projection migration is W07 work. The typed
repository depends only on Drizzle and its own DTOs, avoiding a reverse dependency
on the shared city/Rules graph. Selective catalog imports still initialize no ORM.

`apps/server/integration/building-persistence.test.ts` exercises the actual injected
transaction shape with synthetic data: foreign-UUID rollback after earlier building
and experience writes, exact large values, successful commit, owner-scoped deletion
and ordered overflow detection. Existing construction/prayer/castle-event/general
scenarios exercise the composed owner and production boundary. Structural comparison
reconstructs both complete city read/write flows and checks every DTO field mapping.
Deploy or roll back the rebuilt realm against the same schema; no player-data
conversion, native patch or process-authority change is required.

## Construction workflows (#649)

`services/construction.ts` composes command preparation, activity application and
completion collaborators. `services/commands.ts` owns creation, upgrades, movement,
demolition, unlocks and castle rewards; `services/activity.ts` owns cancellation,
restore/reschedule and completion dispatch. `services/completion.ts` owns building
history, power/experience changes, domain queues and ordered completion hooks.
The 471-line command class remains one cohesive preparation responsibility; it has
no persistence or lifecycle ownership. Completion and timed application are separate.

`rules/construction.ts` owns ordered prerequisites and placement policies;
`rules/queues.ts` owns the native building-to-queue mapping, also consumed by Troops.
`enums/command.ts` names the nine unchanged command strings. The former construction
Service and migrated Rules exports are removed after all runtime callers migrate.

`contracts/construction.ts` bounds the state, catalog and pending-write capabilities
needed by these workflows. The legacy row-shaped records remain transitional;
the package does not import the broad Rules/Contracts/Services graph. Constructor
ports in `contracts/construction-runtime.ts` receive the existing numeric helpers,
record readers, building/reward serializers, prestige/unlock readers and prayer,
task, castle-event and expedition hooks. Their single implementations are bound in
`apps/server/src/composition/construction.ts`, used by realm and integration harness.
No cycle exception, copied algorithm, new process or authority handoff is introduced.

Base owns generic activity lifecycle declarations and Economy owns economic activity
payloads/reward previews. Their existing shared paths remain type-only compatibility
exports with callers and retirement work tracked in the migration register. Shared
numerical/native projection and cross-domain integrations are still #558 work.

Owned tests cover prerequisite rejection order and lazy prestige, placement membership
and first-match semantics, historical experience ceilings, completion callback order,
recovery task suppression, queue creation and detached command/activity callbacks.
PostgreSQL construction, persistence, prayer, castle-event and general scenarios
retain 16 tests/174 assertions; core and timed economy add two tests/349 assertions.
Structural comparison preserves all eight moved runtime bodies, both policies, queue
mapping and six type declarations after explicit dependency substitutions. No saved
state or schema changes: deploy the rebuilt realm or restore the prior artifact.
