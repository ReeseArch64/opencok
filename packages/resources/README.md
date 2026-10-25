# Gameplay resources

Maintained gameplay data lives in this package. Building definitions use domain
models; the other 380 catalogs still use transitional XML-shaped TypeScript
objects. They are available without external XML, Base64 or Compose mounts, but
those remaining domains have not yet been rewritten as game mechanics.

## Building mechanics

Edit `src/buildings/<buildingId>.ts` directly. Each entry has numeric `id`,
`buildingId`, `level` and `starLevel`, bigint resource costs, construction duration,
prerequisites, named effects and typed star progression steps. For example,
production uses `effects.productionPerHour` and `effects.productionCapacity`;
food protection uses `effects.protectedFood`. Bigint literals preserve costs
beyond JavaScript's safe integer range.

`getBuildingDefinition(413000)` returns building metadata with `id: 413000`,
`levelMax: 30`, `resourceId: 0` and its levels. `createBuildingCatalog()` creates
an isolated map indexed by numeric level-definition ID for each realm.
`@opencok/rules/building` evaluates current and next levels without parsing XML
attributes or delimited strings. Edit costs and effects here to change the
mechanics consumed by the server.

`clientParameters` retains display values whose game meaning is not established.
Only mappings read these values to preserve mobile fields; server mechanics read
named effects. Do not implement new rules by parsing client parameters. Model the
meaning explicitly when migrating another mechanic. Feature availability and
maximum star levels still depend on the remaining transitional catalogs.

Validate edits with package tests, server tests, workspace type checks, lint and
formatting. Building edits do not require checksum updates. Rebuild and recreate
the server to deploy them; there is no administrative reload endpoint.

## Remaining transitional catalogs

Find a catalog in `src/catalogs.ts` and edit its module or `.partN.ts` files.
These documents retain original element names, string attributes in `":@"`,
duplicate records, declaration order and text. This representation is temporary;
it is not the target interface for game rules. Large maps use numeric tile arrays
and expansion helpers. Identical documents share modules; check
`src/catalogs/inventory.json` before editing an alias.

After an intentional transitional-catalog edit, update its integrity metadata:

```sh
bun run --cwd packages/resources update:catalogs building_star
bun run test:packages
bun run --cwd packages/resources check-types
bun run lint
bun run format:check
```

## Import boundaries and provenance

The maintainer authorized conversion of all reference XML catalogs on 2026-10-24.
The ignored originals remain read-only inputs. The building provenance file
records the source SHA-256 and the 1,511 imported levels across 41 building types.
The remaining inventory records source and document checksums for 380 identifiers
sharing 362 documents. All 381 source identifiers remain in `GameplayCatalog`.
No private executable code, keys or player records are included.

Migration tools can recreate data from an authorized source:

```sh
bun run --cwd packages/resources import:buildings /path/to/authorized/building.xml
bun run --cwd packages/resources import:catalogs /path/to/authorized/xml
```

The building importer converts XML attributes into domain models. The general
importer excludes building.xml so it cannot restore the removed representation.
Running either importer overwrites maintained edits for its domain; normal
editing uses TypeScript directly and needs neither importer nor original XML.
Format generated files before committing.

The explicit XML loader and `buildings/import` adapter serve migration checks and
synthetic fixtures. Production startup loads typed building definitions directly.
Integration tests inject synthetic Rules through `startServer(config, rules)`;
the isolated Compose test replaces both transitional catalogs and building levels
with test-only modules. No application environment variable selects XML loading.

This migration preserves mobile field types and order, costs and progression.
It introduces no database or saved-state migration. Roll back the application
artifact to restore prior behavior.
