# Building definitions, progression and persistence

This workspace owns building definition contracts, the maintained typed catalog,
level/star evaluation and display/legacy-record mappings after #635. The realm's
central Rules consumer uses these modules; construction commands and transactional
city coordination remain tracked in W07 of #558. Typed persistence is owned after #647. Existing authority, prices,
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
archetype conversion required by [ADR-0018](../../docs/decisions/0018-adopt-client-backed-semantic-definitions.md).
Opaque identities are preserved without invented names. Construction Services,
cross-domain plans and semantic identities remain tracked under #558 W07/W14.

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
