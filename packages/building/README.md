# Building definitions and progression

This workspace owns building definition contracts, the maintained typed catalog,
level/star evaluation and display/legacy-record mappings after #635. The realm's
central Rules consumer uses these modules; construction commands and transactional
city coordination remain the next W07 slices of #558. Existing authority, prices,
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
DTOs, repositories and city transaction plans remain tracked under #558 W07.

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
