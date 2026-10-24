# Gameplay catalogs

All 381 authorized reference XML catalogs are included as readable TypeScript
under `src/catalogs/`, including catalogs not yet consumed by the realm.
`GameplayCatalog` in `@opencok/enums/gameplay-catalog` identifies every catalog.
`gameplayCatalogs` loads them on demand; startup loads the catalogs used by Rules.
The server needs no external XML directory, GAME_RESOURCES or Compose volume.

## Editing data

Find the catalog in `src/catalogs.ts`, then open its referenced module. Edit the
object fields in `createCatalog()`. Records keep their original element names;
`":@"` contains attributes such as `id`, costs, levels and feature values. Large
catalogs import readable `.partN.ts` files; edit the matching record there.
Keep string values as strings, including numeric text, leading zeros, separators,
case and spaces. Keep duplicate records and declaration order unless changing
their gameplay behavior is intentional.

Large tiled maps use numeric arrays in `.tilesN.ts` files. `catalogTiles` expands
each numeric tile ID with its original separator. Repeated identical sequences
use `repeatCatalogElements`; edit the sequence or repetition count directly.
These are ordinary typed values and functions, with no encoded or compressed data.

Identical catalog documents share a module. Check `src/catalogs/inventory.json`
before editing a shared module: the edit affects every identifier referencing it.
To customize one alias independently, give it its own module and registry entry.

After an intentional edit, update the affected catalog checksum with:

```sh
bun run --cwd packages/resources update:catalogs building
bun run test:packages
bun run --cwd packages/resources check-types
bun run lint
bun run format:check
```

The checksum command also updates aliases sharing that module. Review the data
change alongside its inventory update. Rebuild and recreate the server to deploy
catalog edits. No file watcher or administrative reload endpoint is introduced.

## Conversion and compatibility

The maintainer authorized converting every XML in
`data/reference/server/runtime/base/resource` on 2026-10-24. The originals remain
unchanged and ignored. `src/catalogs/inventory.json` records every source name,
byte count and SHA-256, plus the current parsed-document checksum and shared module.
All 381 identifiers remain available, with 363 distinct parsed documents.
Only data is included; no private executable code, keys or player records are copied.

The importer verifies both ordered declarations and grouped parser projections
against the existing XML parser. The TypeScript builder preserves those projections,
including grouping, duplicate definitions, text, field order and exact string values.
The maintainer approved retaining records without IDs in the complete document
while excluding them from ordinary ID indexes. Empty required indexes and forbidden
duplicate IDs still fail; declared singleton/null-key policies remain unchanged.

The importer is a migration tool, not a runtime requirement:

```sh
bun run --cwd packages/resources import:catalogs /path/to/authorized/xml
```

Running it replaces maintained catalog edits with that source snapshot. Normal
editing and deployment use the maintained TypeScript directly. The explicit XML
loader remains available for isolated synthetic fixtures and compatibility checks;
the application environment no longer selects it.

No wire, database or account-state migration is introduced. Roll back the complete
application artifact; revisions before this migration also require restoring the
previous XML mount and GAME_RESOURCES setting.
