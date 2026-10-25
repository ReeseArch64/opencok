# Gameplay resources

All 381 authorized catalogs are maintained as typed TypeScript data. Buildings
live in `src/buildings`; the other 380 identifiers load 362 distinct definitions
from `src/catalogs/data`, including catalogs not yet used by the server. There are
no XML-shaped catalog documents, encoded payloads or external resource mounts.

## Editing mechanics

Open the catalog's module under `src/catalogs/data`. Tables import ordinary
`.recordsN.ts` arrays. Edit their numeric IDs, levels, quantities, prices and
sequences directly. For example, role definitions expose `playerExperience`,
`levelRewardId`, `stamina` and numeric reward lists; goods expose bigint `price`,
`priceAll` and `priceHot`. Currency literals use `n` to preserve exact integers.

Each table has an explicit interface under `src/catalogs/types`. Fields use
camel case and known names such as `levelMax` and `resourceId`. Canonical numbers
are numbers or bigints; numeric delimited sequences become arrays or matrices.
Special textual identifiers, leading zeros, versions, dates and noncanonical
values retain their strings. Codes such as `k1`, `para1` and unimplemented event
parameters remain explicit where their business meaning is not established;
do not invent interpretations or enable new actions based on their names.

Use the typed registry and functions directly when implementing new mechanics:

```ts
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import { loadCatalog, definitionIndex, roleLevelRewards } from "@opencok/resources/catalogs";

const roles = await loadCatalog(GameplayCatalog.Role);
const role = definitionIndex(roles).get("100101");
const rewards = role ? roleLevelRewards(role) : [];
```

`loadCatalog` infers the definition type from the enum. Definitions are readonly;
clone before making realm-specific changes. `definitionIndex` preserves the last
duplicate ID and excludes blank IDs while the original declarations remain in
`records`. `sections` describes configuration groups by record ranges and parent
indexes. The server keeps each catalog's existing duplicate/index policy.

Maps expose dimensions, tilesets, terrains and numeric tile layers. Edit
`.layerN.tilesN.ts` arrays, inspect coordinates with `mapTile`, or produce an
isolated edit with `withMapTile`. Arrays are split into chunks for editing; no
XML tiles or whitespace are generated. Automation catalogs expose event,
condition and action codes, parameter text, conditional branches and scoped
variable defaults. `rulesForEvent` selects declarations and `initialVariables`
returns defaults. These functions do not execute unimplemented legacy actions.
Variables and web routing have their own models.

Check `src/catalogs/provenance.json` before editing an alias: identifiers sharing
a module share its maintained data. No checksum refresh is required for ordinary
edits. Run the package/server tests, affected type checks, lint and formatting;
then rebuild and recreate the server. There is no administrative reload endpoint.

## Building mechanics

Edit `src/buildings/<buildingId>.ts`. All 1,511 levels across 41 types use numeric
identities, bigint costs, prerequisites, durations, named effects and typed star
steps. `getBuildingDefinition` exposes `id`, `levelMax`, `resourceId` and levels.
`createBuildingCatalog` creates isolated realm maps. `rules/building` evaluates
progression and mappings alone translate client display parameters.

## Compatibility boundaries

Normal startup loads definitions directly. `catalog-compatibility.ts` projects
fields into flat string records for existing Rules consumers, preserving their
current numeric parsing, wire values and ordering. This adapter constructs
neither XML nor parser documents. `catalog-codecs.ts` contains field/sequence
mapping metadata for this boundary. Existing string-consuming rule functions
have not all been redesigned; new mechanics should consume typed definitions.

The full migration verifies 380 compiled models and 166,526 table declarations,
including all values and declaration order. Complete Rules projections for both
realms match the former loader. Definitions without usable IDs remain in the
full tables and are omitted from ordinary indexes. Dedicated maps preserve tile
coordinates and automation models retain their declarations and parameter text.

The XML parser is a developer dependency. `xml-fixtures.ts` is loaded only when
an explicit synthetic XML directory is passed to `loadRules`, and its parser
helpers are available through `@opencok/resources/fixtures`. Integration tests
inject synthetic Rules with `startServer(config, rules)`. The isolated Compose
test injects typed table/building modules. No environment variable selects XML.

## Import and provenance

The maintainer authorized converting all reference XMLs on 2026-10-24. Ignored
originals remain unchanged. Catalog and building provenance files retain source
sizes/checksums and source declaration counts. No private executable code, keys,
player records or client binaries are included.

Migration tools can recreate maintained definitions from an authorized snapshot:

```sh
bun run --cwd packages/resources import:catalogs /path/to/authorized/xml
bun run --cwd packages/resources import:buildings /path/to/authorized/building.xml
```

Importing overwrites maintained edits. The general importer requires the complete
set of catalog identifiers, excludes building.xml and emits typed definitions;
it cannot restore XML-shaped source modules. Format generated files before
committing. Importers and original XMLs are not deployment requirements.

No wire, database, account, inventory or queue migration is introduced. Roll back
the complete application artifact to restore prior behavior. Native mobile client
validation remains separate from server compatibility checks.
