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

## Named hero definitions and migration proposal

Mulan's base definition is authored in `packages/hero/src/domain/mulan.ts` as
`Mulan extends Hero`. Recruitment, progression, stars, assignments, talent tree
references and refinement use named properties, booleans, semantic enums and
item costs. This module contains no native resource IDs or delimited strings.
`Hero` delegates shared configuration invariants to the domain validation module.
An archetype is separate from a player's owned hero and its persistent state.

`HeroDefinitionMapper` is shared projection code, with constructor-injected
`HeroCatalogBindings`. It contains no Mulan configuration, hero IDs, item IDs,
skill IDs or translation IDs. The maintained catalog composes Mulan and the mapper
in `src/heroes/mulan.ts`. `constants/hero-catalog-bindings` owns the numeric
identities; `enums/hero-*` provides the vocabulary used by domain code. Only direct
workspace dependencies were added; no external library is required.

The current catalog adapter still feeds existing string-consuming server rules.
It is not a network serializer, and a catalog field is not automatically a wire
requirement. Network Mappers and persistence adapters remain separate boundaries.
This change preserves existing behavior while replacing the entire Mulan base
record's authoring model. Skill effect formulas and individual talent nodes still
live in their existing catalogs and have not yet been migrated to named objects.

### Field meanings and evidence

Read-only inspection used the extracted Android `v12.06.0` client's
`assets/local/database.local.xml`, `assets/local/text_en.ini`, and
`assets/lua_static/game/hero/NewUI_v2/HeroXLView.lua`, together with the maintained
Mulan patch `data/android/patches/033-hua-mulan/content.json` and its resource
builder. The stock extracted hero at this ID predates the Mulan replacement;
use the patch's identity and skill/tree names, not the stock appearance or level
limit. No client code or assets are copied into maintained source or required at
runtime.

The current server's general progression, talents, refinement and skill services
establish the meaning of server-only fields. Read-only legacy inspection of
`CsmodModule` establishes that `new_acc_max_lv` belongs to automated account hero
grants; `AbstractGetGeneral` establishes the initial quality assignment. This is
historical evidence, not authorization to restore automatic hero grants.

| Existing catalog field                 | Authored meaning                                                                                                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`, `name`                           | Hero identity and localized name binding: Hua Mulan → general 53571, text 169493.                                                                                  |
| `newAccMaxLv`                          | Historical automated-grant level limit, kept separate from playable maximum level. No maintained startup path consumes it to grant heroes.                         |
| `isUnlock`                             | Whether recruitment is available.                                                                                                                                  |
| `type`                                 | Server level-table column selector: 0 selects `exp1`/`point1`, 1 selects `exp`/`point`. It is **not** the client's visual hero category. Kept as binding metadata. |
| `gender`                               | Female, mapped to the native gender code.                                                                                                                          |
| `baseLevel`, `baseQuality`             | Initial level and initial quality rank. Quality rank is not the client's rarity ribbon.                                                                            |
| `baseStar`, `starMaxLevel`             | Initial and maximum star count.                                                                                                                                    |
| `baseSkill`, `baseSkill2`–`baseSkill5` | Initial skill and skills unlocked at each subsequent star.                                                                                                         |
| `breachGoods`                          | Ordered breakthrough-stage item costs. These costs do not themselves enable a level gate.                                                                          |
| `starGoods`                            | Item costs for each star upgrade.                                                                                                                                  |
| `needPieces`, `piecesId`               | Recruitment item and quantity, and the fragment identity reused by refinement.                                                                                     |
| `levelMax`, `talentPointDivisor`       | Playable maximum level and divisor applied to the selected cumulative talent-point schedule.                                                                       |
| `talent`                               | Compatibility group linking talent nodes to this hero; 72 is a group identifier, not a talent budget.                                                              |
| `generalAb`                            | Ordered references to Mulan's Vanguard, Offensive and Spear trees.                                                                                                 |
| `loot`, `lootLevel`                    | Loot participation and minimum hero level.                                                                                                                         |
| `garrison`, `battle`, `lordExp`        | Garrison, battle and use of lord-experience items are permitted.                                                                                                   |
| `refineCard`                           | Hero fragments charged per non-maximized attribute for a value roll, before free/batch adjustments.                                                                |
| `refineEffect`                         | Gold price for changing attribute types, indexed by the number of unlocked attributes being rerolled.                                                              |
| `refineEffectLock`                     | Additional gold price indexed by the number of locked attributes.                                                                                                  |
| `refineNum`                            | Per-slot refinement item quantity. Preserve zero as a quantity; existing activation also requires a positive entry.                                                |
| `unlockLevel`, `unlockStar`            | Hero level and star prerequisites for each refinement slot.                                                                                                        |
| `unlockGoodsNum`, `goodsId`            | Per-slot unlock item quantity and its item identity: Hero Badge.                                                                                                   |

The patched skills resolve to Mulan's Formation, Infantry Basic Attack, Damage
by Infantry, Striking Distance of Infantry, and Infantry Basic Puncture. Their
native identifiers are recorded once in the bindings. The fragment is Hua Mulan
Fragment (213293); the client item record maps Hero Badge (211453) to localized
text 169805. Domain code uses `HeroItem.MulanFragment` and `HeroItem.HeroBadge`.
Quantities such as 3000 fragments or level 99 remain numbers because they express
balance, not opaque identities.

### Compatibility and validation

The projection preserves Mulan's complete pre-refactor flat record and field
order, checked against its independently captured SHA-256 digest. Tests also
change domain costs, stars, trees, assignments and refinement and verify their
projection; they reject invalid ordering and item combinations that the old
catalog cannot represent. The entire 109-record general base catalog was compared
before and after the initial migration. Existing server progression and refinement
tests remain the behavior checks. This is not device/emulator acceptance.

The import writer recognizes Mulan's native base-record identity and emits a
reference to the maintained named definition, preserving its source order and
avoiding duplicate authoring. Other records retain the ordinary import path.
Reimporting still overwrites unmigrated skill and talent catalogs; do not use it
to discard maintained balance changes. Original inputs remain read-only.

### Remaining migration proposal

1. Model skill effects and individual talent nodes with named effects, requirements
   and progression, backed by the patched client resources and existing rule
   consumers. Keep one authoring source per mechanic. Test client references,
   node order, effect units, branching and point costs before replacing each
   numeric catalog definition.
2. Give Services and pure rules typed archetypes and typed level schedules through
   constructor injection. Migrate recruitment, leveling, stars and refinement in
   separate vertical changes. Replace string parsing in the consumer, then remove
   its compatibility projection. Preserve fragment charges, unlock checks,
   transactions, retries and owned hero state.
3. Add a semantic hero registry and native-ID lookup at the input/persistence
   boundaries. Confirm resource bindings per client release instead of assuming
   shared IDs or deriving meaning from an ID's digits. Reject unknown bindings
   rather than choosing a similarly named hero or skill.
4. Expand named definitions to other heroes, items and units with evidence for
   each identity. Shared workflows belong in base classes and Services; concrete
   archetypes own configuration and specialized behavior. Level/event table rows
   can remain structured data rather than becoming empty subclasses.
5. Remove obsolete server representations once all consumers have migrated. Only
   verified client contracts and persistence compatibility constrain the final
   boundary; XML keys, import column names and Java storage conveniences do not
   define the future domain model.

This change has no database migration, balance adjustment or client artifact
change. Roll back the application commit as a unit. Later state migrations need
explicit deployment and recovery plans. The implemented slice is the complete
Mulan base definition, not a completed redesign of all hero rule consumers.
