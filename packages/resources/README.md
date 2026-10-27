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

## Named hero migration proposal

Status: initial Mulan authoring slice implemented; broader domain migration proposed.
No new dependency or technology decision is required.

The XML-to-TypeScript conversion removed a runtime input format, but did not finish
redesigning the domain. `GeneralBaseDefinition` still carries source-shaped fields,
`catalog-compatibility.ts` converts typed values back to string records, and
`hero/rules/general-progression.ts` parses those records. A developer should be
able to locate Hua Mulan by name and edit her progression without knowing that
her native general ID is 53571. Numeric IDs remain necessary for saved ownership,
client assets and protocol references; they should identify boundary bindings,
not provide the vocabulary for authoring mechanics.

### Implemented first slice

`packages/hero/src/domain/mulan.ts` now defines `Mulan extends Hero`. It owns the
readable name, recruitment fragment quantity, initial level, maximum level and
talent point divisor. `Hero` validates these shared configuration invariants.
The real `general_base` catalog instantiates this definition through
`MulanDefinitionMapper`, which preserves the existing native IDs, field order,
related catalog references and remaining configuration. It does not create a
second Mulan entry or change player state. Edit these migrated properties in
`Mulan`, rather than the numeric records array.

The mapper is a transitional binding, not the final domain model: star costs,
refinement settings, talent tree identifiers and other fields still use the
existing catalog representation there. The named definition represents a hero
archetype; it does not represent an individual player's owned hero. Existing
services still own recruitment transactions and other use cases.

The compatibility regression uses a digest captured from Mulan's complete
pre-refactor flat record, including field order. Intentional balance changes
require reviewing that contract and updating its expected digest. The migration
also compared all 109 `general_base` records against the preceding catalog.
This is server-side evidence, not native client acceptance.

### Proposed next slices and acceptance

1. Complete Mulan's domain configuration: named talent trees, skill definitions,
   fragment references, star progression and refinement policies. Confirm names
   and meanings from authorized resource/localization evidence before assigning
   them. Keep unresolved codes explicitly in compatibility bindings. Accept when
   each migrated field has one authoring source and its old projection is proven
   equivalent, including declaration order and duplicate handling.
2. Introduce a hero registry with semantic keys and explicit native-ID lookup at
   boundaries. Version the bindings by actual resource provenance rather than
   assuming every client release shares IDs. Accept when Mulan can be resolved
   by name in domain code, unknown IDs are rejected explicitly, and each migrated
   binding resolves unambiguously without altering legacy entries.
3. Migrate one vertical use case at a time, starting with recruitment and level
   progression. Inject typed definitions into Services and pure domain rules;
   preserve database contracts and wire Mappers. Remove the corresponding
   `String(id)`, `split`, and numeric parsing only after both paths agree. Accept
   when fragment charges, unlock checks, talent points, level gates and retry
   behavior match existing tests and persisted ownership is preserved.
4. Expand hero coverage through small dependent changes. Use concrete subclasses
   for named authored archetypes and specialized behavior; keep shared lifecycle
   and invariants in `Hero`, and balance tables as typed data. Do not duplicate
   recruitment, combat or persistence workflows in every subclass. Accept when
   each migrated hero has an identifiable authoring module and verified binding.
5. Apply the same separation to items, units, buildings and other catalogs based
   on actual use cases. A row in an event or level table does not automatically
   need a class. Accept each slice with typed consumers, readable identities and
   compatibility coverage rather than merely renamed source fields.
6. Retire compatibility projections per migrated consumer. Remove a legacy
   catalog path only when references and compatibility tests establish that it
   has no remaining consumers. Native release acceptance remains separate.

Imports are recovery tools, not the authoring source of named definitions. The
current general importer still overwrites `general_base.records0.ts`, including
its Mulan integration. Before reimporting, preserve and reapply the named entry;
its regression test must pass afterward. A later importer change should generate
only explicitly unmigrated entries and preserve named registrations. Do not add
ignored Java/XML originals as runtime dependencies or regenerate away maintained
mechanics.

Roll back this first slice by reverting its application code together. It has no
database migration, balance adjustment or client artifact change. Later slices
must retain this property or document their own state migration and recovery.
