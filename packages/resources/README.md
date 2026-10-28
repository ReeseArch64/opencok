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

## Client binding discovery

[ADR-0018](../../docs/decisions/0018-adopt-client-backed-semantic-definitions.md)
governs named-definition migration and its evidence gates. The offline
[catalog-tools workspace](../catalog-tools/README.md) checks declared client links,
versioned fingerprints, identity coverage and unresolved entries. Its first
maintained manifest covers the existing Dragon roster; it does not migrate other
catalogs. Authoring importers also live in catalog-tools, as described below. Runtime imports remain independent
of the tool and private client files.

## Import and provenance

The maintainer authorized converting all reference XMLs on 2026-10-24. Ignored
originals remain unchanged. Catalog and building provenance files retain source
sizes/checksums and source declaration counts. No private executable code, keys,
player records or client binaries are included.

Migration tools can recreate maintained definitions from an authorized snapshot:

```sh
bun run --cwd packages/catalog-tools import:catalogs /path/to/authorized/xml
bun run --cwd packages/catalog-tools import:buildings /path/to/authorized/building.xml
```

Importing overwrites maintained edits. The general importer requires the complete
set of catalog identifiers, excludes building.xml and emits typed definitions;
it cannot restore XML-shaped source modules. Format generated files before
committing. Importers and original XMLs are not deployment requirements.

The former `resources/scripts` entrypoints are retired in #601. The CLI and generators
now belong to [catalog-tools](../catalog-tools/README.md#catalog-and-building-imports),
with unchanged default resource/Hero destinations and explicit isolated-output options.
Runtime fixture loading and the building compatibility mapper remain in resources
because maintained runtime/test callers still use them.

No wire, database, account, inventory or queue migration is introduced. Roll back
the complete application artifact to restore prior behavior. Native mobile client
validation remains separate from server compatibility checks.

## Named hero definitions and migration proposal

All 109 Hero Palace definitions are authored as concrete `Hero` subclasses in
`packages/hero/src/domain`. `heroRoster` lists every archetype in the maintained
catalog order; `resources/src/heroes/roster.ts` projects that roster and exposes
`heroDefinitionByIdentity` for semantic lookup. The old numeric general-base
records array has been replaced by this projection. There is no fallback numeric
hero definition or second authoring source.

Each class owns recruitment, progression, star costs and skill references, talent
tree references, and refinement slot requirements. Domain modules contain named
properties, booleans, enums and item costs, without native resource IDs or
delimited strings. `Hero` supplies shared assignment permissions, free
breakthrough configuration and standard refinement prices, creating isolated
objects for each archetype. A concrete class can replace those policies.
`Hero` delegates shared configuration invariants to domain validation. An
archetype remains separate from a player's owned hero and persistent state.

`HeroDefinitionMapper` is shared projection code with constructor-injected
`HeroCatalogBindings`. It contains no hero-specific balance settings or numeric
resource identities. `constants/hero-catalog-bindings` owns hero, localization,
fragment-sale, item, skill and tree IDs and catalog representation metadata.
`enums/hero-*` provides the domain vocabulary. The Mulan compatibility entrypoint
uses the same roster as every other hero. No new dependency is needed for this
roster expansion.

The current catalog adapter still feeds existing string-consuming server rules.
It is not a network serializer, and a catalog field is not automatically a wire
requirement. Network Mappers and persistence adapters remain separate boundaries.
Skill effect formulas and individual talent nodes still live in their existing
catalogs; this migration covers every hero's base archetype and named references,
following the Mulan model, rather than redesigning those separate rule engines.

### Roster coverage

Read-only comparison of the native `general_base` groups found 109 entries in
Android 12.06.0, 10.02.0 and 9.27.0, all present in the maintained server roster.
Android 5.36.0 contains a 75-entry subset and no extra hero identities. This is
coverage of the Hero Palace catalog used by the hero UI; the separate legacy
`general` table is a different general system, not an additional Hero Palace
roster. Coverage does not establish native runtime acceptance for each release.

Names come from the English client localization and the maintained Mulan patch.
The two entries without resolvable hero names are `Unknown1` / `unknown-1` and
`Unknown2` / `unknown-2`, bound to 53572 and 53573. They retain their existing
configuration and availability. The five distinct native Nezha entries remain
`NezhaVariant1` through `NezhaVariant5`, with the shared display name “Nezha” and
separate references; the suffixes disambiguate identity without inventing lore.
Some placeholder skills and two trees also have no client-localized names.
Their semantic references identify the owning hero and skill/star/tree position
instead of guessing a title or using an opaque numeric code.

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
| `baseSkill`, `baseSkill2`–`baseSkill5` | Initial skills and skills associated with each subsequent star.                                                                                                    |
| `breachGoods`                          | Ordered breakthrough-stage item costs. These costs do not themselves enable a level gate.                                                                          |
| `starGoods`                            | Item costs for each star upgrade.                                                                                                                                  |
| `needPieces`, `piecesId`               | Recruitment item and quantity, and the independently configured refinement fragment identity.                                                                      |
| `levelMax`, `talentPointDivisor`       | Playable maximum level and divisor applied to the selected cumulative talent-point schedule.                                                                       |
| `talent`                               | Compatibility group linking talent nodes to this hero; 72 is a group identifier, not a talent budget.                                                              |
| `generalAb`                            | Ordered named talent tree references; Mulan uses Vanguard, Offensive and Spear.                                                                                    |
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

The tests compare every projected field of every hero against a frozen copy of
the 109 pre-migration server records. They verify names, identities, unique
concrete classes, roster order, all importer references, unknown entries and
Nezha variants. Mulan additionally retains its pre-refactor flat-record digest,
including field order. Tests change ordinary hero and Mulan mechanics and verify
that the projection changes, while invalid ordering is rejected. Existing server
progression and refinement tests remain the behavior checks. This is not
device/emulator acceptance.

The model preserves multiple initial skills, initial stars above one, dormant
star steps beyond the current maximum, empty talent lists, absent refinement
requirements and the distinction between absent, empty-text and zero catalog
fields. Only the binding layer knows those serialization conventions. Missing
requirements do not mean an automatic unlock. Unreachable six-star requirements
for two Nezha variants remain unreachable; validation permits such deliberate
thresholds instead of silently enabling those slots.

Iron-Blooded Guard and Expansion Master Gaudi retain their separate recruitment
fragments and the Saitō Kichyō fragment used by their existing value-refinement
configuration. Nezha Variant 4 retains the mixed fragment references in its free
breakthrough stages. These are existing inconsistencies, not balance corrections
or newly inferred mechanics. Their exact projections are regression-tested.

The import writer resolves every known general-base ID to its named definition,
emits semantic roster references and generates its model from those maintained
definitions. It retains the talent-point codec required by maintained changes.
An unmodeled incoming hero fails import explicitly instead of restoring an opaque
numeric row. Add its named definition and verified bindings before importing it.
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
3. Extend the existing semantic roster lookup to the input/persistence
   boundaries. Confirm resource bindings per client release instead of assuming
   shared IDs or deriving meaning from an ID's digits. Reject unknown bindings
   rather than choosing a similarly named hero or skill.
4. Apply the named-definition approach to items and units with evidence for
   each identity. Shared workflows belong in base classes and Services; concrete
   archetypes own configuration and specialized behavior. Level/event table rows
   can remain structured data rather than becoming empty subclasses.
5. Remove obsolete server representations once all consumers have migrated. Only
   verified client contracts and persistence compatibility constrain the final
   boundary; XML keys, import column names and Java storage conveniences do not
   define the future domain model.

This change has no database migration, balance adjustment or client artifact
change. Roll back the application commit as a unit. Later state migrations need
explicit deployment and recovery plans. The implemented roster covers all 109 hero base definitions; separate hero rule
consumers and individual skill/talent-node catalogs retain their existing implementations.

### Hero authoring index

| Identity                          | Client name                     | Definition                                                                            |
| --------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| `bernard`                         | Bernard                         | [Bernard](../hero/src/domain/bernard.ts)                                              |
| `jered`                           | Jered                           | [Jered](../hero/src/domain/jered.ts)                                                  |
| `thorn-flower`                    | Thorn Flower                    | [ThornFlower](../hero/src/domain/thorn-flower.ts)                                     |
| `rufus`                           | Rufus                           | [Rufus](../hero/src/domain/rufus.ts)                                                  |
| `joseph`                          | Joseph                          | [Joseph](../hero/src/domain/joseph.ts)                                                |
| `mo-ye`                           | Mo Ye                           | [MoYe](../hero/src/domain/mo-ye.ts)                                                   |
| `komatsuhime`                     | Komatsuhime                     | [Komatsuhime](../hero/src/domain/komatsuhime.ts)                                      |
| `valkyr`                          | Valkyr                          | [Valkyr](../hero/src/domain/valkyr.ts)                                                |
| `caroline`                        | Caroline                        | [Caroline](../hero/src/domain/caroline.ts)                                            |
| `sanada-yukimura`                 | Sanada Yukimura                 | [SanadaYukimura](../hero/src/domain/sanada-yukimura.ts)                               |
| `olaf`                            | Olaf                            | [Olaf](../hero/src/domain/olaf.ts)                                                    |
| `galenus`                         | Galenus                         | [Galenus](../hero/src/domain/galenus.ts)                                              |
| `the-queen-of-war`                | The Queen of War                | [TheQueenOfWar](../hero/src/domain/the-queen-of-war.ts)                               |
| `yulia`                           | Yulia                           | [Yulia](../hero/src/domain/yulia.ts)                                                  |
| `han-xin`                         | Han Xin                         | [HanXin](../hero/src/domain/han-xin.ts)                                               |
| `charlemagne`                     | Charlemagne                     | [Charlemagne](../hero/src/domain/charlemagne.ts)                                      |
| `beowulf`                         | Beowulf                         | [Beowulf](../hero/src/domain/beowulf.ts)                                              |
| `siegfried`                       | Siegfried                       | [Siegfried](../hero/src/domain/siegfried.ts)                                          |
| `prinz-eugen`                     | Prinz Eugen                     | [PrinzEugen](../hero/src/domain/prinz-eugen.ts)                                       |
| `harald`                          | Harald                          | [Harald](../hero/src/domain/harald.ts)                                                |
| `lancelot`                        | Lancelot                        | [Lancelot](../hero/src/domain/lancelot.ts)                                            |
| `joan-of-arc`                     | Joan of Arc                     | [JoanOfArc](../hero/src/domain/joan-of-arc.ts)                                        |
| `toyotomi-hideyoshi`              | Toyotomi Hideyoshi              | [ToyotomiHideyoshi](../hero/src/domain/toyotomi-hideyoshi.ts)                         |
| `date-masamune`                   | Date Masamune                   | [DateMasamune](../hero/src/domain/date-masamune.ts)                                   |
| `di-renjie`                       | Di Renjie                       | [DiRenjie](../hero/src/domain/di-renjie.ts)                                           |
| `xiao-qiao`                       | Xiao Qiao                       | [XiaoQiao](../hero/src/domain/xiao-qiao.ts)                                           |
| `takenaka-shigeharu`              | Takenaka Shigeharu              | [TakenakaShigeharu](../hero/src/domain/takenaka-shigeharu.ts)                         |
| `saito-kichyo`                    | Saitō Kichyō                    | [SaitoKichyo](../hero/src/domain/saito-kichyo.ts)                                     |
| `lin-xiangru`                     | Lin Xiangru                     | [LinXiangru](../hero/src/domain/lin-xiangru.ts)                                       |
| `oda-ichi`                        | Oda Ichi                        | [OdaIchi](../hero/src/domain/oda-ichi.ts)                                             |
| `bale`                            | Bale                            | [Bale](../hero/src/domain/bale.ts)                                                    |
| `zhuge-liang`                     | Zhuge Liang                     | [ZhugeLiang](../hero/src/domain/zhuge-liang.ts)                                       |
| `xun-yu`                          | Xun Yu                          | [XunYu](../hero/src/domain/xun-yu.ts)                                                 |
| `sun-wu`                          | Sun Wu                          | [SunWu](../hero/src/domain/sun-wu.ts)                                                 |
| `vitruvius`                       | Vitruvius                       | [Vitruvius](../hero/src/domain/vitruvius.ts)                                          |
| `hippocrates`                     | Hippocrates                     | [Hippocrates](../hero/src/domain/hippocrates.ts)                                      |
| `lu-su`                           | Lu Su                           | [LuSu](../hero/src/domain/lu-su.ts)                                                   |
| `saito-dosan`                     | Saitō Dōsan                     | [SaitoDosan](../hero/src/domain/saito-dosan.ts)                                       |
| `sen-no-rikyu`                    | Sen no Rikyū                    | [SenNoRikyu](../hero/src/domain/sen-no-rikyu.ts)                                      |
| `creator`                         | Creator                         | [Creator](../hero/src/domain/creator.ts)                                              |
| `sonya`                           | Sonya                           | [Sonya](../hero/src/domain/sonya.ts)                                                  |
| `goddess-of-harvest`              | Goddess of Harvest              | [GoddessOfHarvest](../hero/src/domain/goddess-of-harvest.ts)                          |
| `demogorgon`                      | Demogorgon                      | [Demogorgon](../hero/src/domain/demogorgon.ts)                                        |
| `priest`                          | Priest                          | [Priest](../hero/src/domain/priest.ts)                                                |
| `wasteland-warrior`               | Wasteland Warrior               | [WastelandWarrior](../hero/src/domain/wasteland-warrior.ts)                           |
| `death-knight`                    | Death Knight                    | [DeathKnight](../hero/src/domain/death-knight.ts)                                     |
| `wind-ranger`                     | Wind Ranger                     | [WindRanger](../hero/src/domain/wind-ranger.ts)                                       |
| `warsong-master`                  | Warsong Master                  | [WarsongMaster](../hero/src/domain/warsong-master.ts)                                 |
| `warhammer`                       | Warhammer                       | [Warhammer](../hero/src/domain/warhammer.ts)                                          |
| `phantom`                         | Phantom                         | [Phantom](../hero/src/domain/phantom.ts)                                              |
| `soul-eater`                      | Soul Eater                      | [SoulEater](../hero/src/domain/soul-eater.ts)                                         |
| `christmas-elf`                   | Christmas Elf                   | [ChristmasElf](../hero/src/domain/christmas-elf.ts)                                   |
| `arrow-of-god-of-love`            | Arrow of God of Love            | [ArrowOfGodOfLove](../hero/src/domain/arrow-of-god-of-love.ts)                        |
| `wild-swordsman`                  | Wild Swordsman                  | [WildSwordsman](../hero/src/domain/wild-swordsman.ts)                                 |
| `eagle-witch`                     | Eagle Witch                     | [EagleWitch](../hero/src/domain/eagle-witch.ts)                                       |
| `holy-shield`                     | Holy Shield                     | [HolyShield](../hero/src/domain/holy-shield.ts)                                       |
| `time-elder`                      | Time Elder                      | [TimeElder](../hero/src/domain/time-elder.ts)                                         |
| `zhao-yun`                        | Zhao Yun                        | [ZhaoYun](../hero/src/domain/zhao-yun.ts)                                             |
| `god-of-abundance`                | God of Abundance                | [GodOfAbundance](../hero/src/domain/god-of-abundance.ts)                              |
| `civilization-crystal-envoy-hill` | Civilization Crystal Envoy Hill | [CivilizationCrystalEnvoyHill](../hero/src/domain/civilization-crystal-envoy-hill.ts) |
| `mansur`                          | Mansur                          | [Mansur](../hero/src/domain/mansur.ts)                                                |
| `harvest-elf`                     | Harvest Elf                     | [HarvestElf](../hero/src/domain/harvest-elf.ts)                                       |
| `iron-mason`                      | Iron Mason                      | [IronMason](../hero/src/domain/iron-mason.ts)                                         |
| `yulin-iron-guard`                | Yulin Iron Guard                | [YulinIronGuard](../hero/src/domain/yulin-iron-guard.ts)                              |
| `guard-knight`                    | Guard Knight                    | [GuardKnight](../hero/src/domain/guard-knight.ts)                                     |
| `visionary-ranger`                | Visionary Ranger                | [VisionaryRanger](../hero/src/domain/visionary-ranger.ts)                             |
| `chariot-master`                  | Chariot Master                  | [ChariotMaster](../hero/src/domain/chariot-master.ts)                                 |
| `king-arthur`                     | King Arthur                     | [KingArthur](../hero/src/domain/king-arthur.ts)                                       |
| `hua-mulan`                       | Hua Mulan                       | [Mulan](../hero/src/domain/mulan.ts)                                                  |
| `unknown-1`                       | unknown-1                       | [Unknown1](../hero/src/domain/unknown-1.ts)                                           |
| `unknown-2`                       | unknown-2                       | [Unknown2](../hero/src/domain/unknown-2.ts)                                           |
| `luminous-shield`                 | Luminous Shield                 | [LuminousShield](../hero/src/domain/luminous-shield.ts)                               |
| `ambitious-cavalry`               | Ambitious Cavalry               | [AmbitiousCavalry](../hero/src/domain/ambitious-cavalry.ts)                           |
| `imperial-archer`                 | Imperial Archer                 | [ImperialArcher](../hero/src/domain/imperial-archer.ts)                               |
| `iron-hand`                       | Iron Hand                       | [IronHand](../hero/src/domain/iron-hand.ts)                                           |
| `shield-of-empire`                | Shield of Empire                | [ShieldOfEmpire](../hero/src/domain/shield-of-empire.ts)                              |
| `spear-of-empire`                 | Spear of Empire                 | [SpearOfEmpire](../hero/src/domain/spear-of-empire.ts)                                |
| `tiger-warrior`                   | Tiger Warrior                   | [TigerWarrior](../hero/src/domain/tiger-warrior.ts)                                   |
| `lion-heart-knight`               | Lion Heart Knight               | [LionHeartKnight](../hero/src/domain/lion-heart-knight.ts)                            |
| `pandarus`                        | Pandarus                        | [Pandarus](../hero/src/domain/pandarus.ts)                                            |
| `shadow-dancer`                   | Shadow Dancer                   | [ShadowDancer](../hero/src/domain/shadow-dancer.ts)                                   |
| `pyrus`                           | Pyrus                           | [Pyrus](../hero/src/domain/pyrus.ts)                                                  |
| `leonidas`                        | Leonidas                        | [Leonidas](../hero/src/domain/leonidas.ts)                                            |
| `iron-blooded-guard`              | Iron-Blooded Guard              | [IronBloodedGuard](../hero/src/domain/iron-blooded-guard.ts)                          |
| `expansion-master-gaudi`          | Expansion Master Gaudi          | [ExpansionMasterGaudi](../hero/src/domain/expansion-master-gaudi.ts)                  |
| `gem-witch`                       | Gem Witch                       | [GemWitch](../hero/src/domain/gem-witch.ts)                                           |
| `cleopatra`                       | Cleopatra                       | [Cleopatra](../hero/src/domain/cleopatra.ts)                                          |
| `judith`                          | Judith                          | [Judith](../hero/src/domain/judith.ts)                                                |
| `dio`                             | Dio                             | [Dio](../hero/src/domain/dio.ts)                                                      |
| `athena`                          | Athena                          | [Athena](../hero/src/domain/athena.ts)                                                |
| `black-star`                      | Black Star                      | [BlackStar](../hero/src/domain/black-star.ts)                                         |
| `saladin`                         | Saladin                         | [Saladin](../hero/src/domain/saladin.ts)                                              |
| `baldwin-the-fourth`              | Baldwin the Fourth              | [BaldwinTheFourth](../hero/src/domain/baldwin-the-fourth.ts)                          |
| `richard-i`                       | Richard I                       | [RichardI](../hero/src/domain/richard-i.ts)                                           |
| `frederick-the-first`             | Frederick the First             | [FrederickTheFirst](../hero/src/domain/frederick-the-first.ts)                        |
| `rogers`                          | Rogers                          | [Rogers](../hero/src/domain/rogers.ts)                                                |
| `ying-yaoguang`                   | Ying Yaoguang                   | [YingYaoguang](../hero/src/domain/ying-yaoguang.ts)                                   |
| `edgar`                           | Edgar                           | [Edgar](../hero/src/domain/edgar.ts)                                                  |
| `cassidier`                       | Cassidier                       | [Cassidier](../hero/src/domain/cassidier.ts)                                          |
| `mo-tianxuan`                     | Mo Tianxuan                     | [MoTianxuan](../hero/src/domain/mo-tianxuan.ts)                                       |
| `tivash`                          | Tivash                          | [Tivash](../hero/src/domain/tivash.ts)                                                |
| `douby`                           | Douby                           | [Douby](../hero/src/domain/douby.ts)                                                  |
| `shea`                            | Shea                            | [Shea](../hero/src/domain/shea.ts)                                                    |
| `mizar`                           | Mizar                           | [Mizar](../hero/src/domain/mizar.ts)                                                  |
| `nezha-variant-1`                 | Nezha                           | [NezhaVariant1](../hero/src/domain/nezha-variant-1.ts)                                |
| `nezha-variant-2`                 | Nezha                           | [NezhaVariant2](../hero/src/domain/nezha-variant-2.ts)                                |
| `nezha-variant-3`                 | Nezha                           | [NezhaVariant3](../hero/src/domain/nezha-variant-3.ts)                                |
| `nezha-variant-4`                 | Nezha                           | [NezhaVariant4](../hero/src/domain/nezha-variant-4.ts)                                |
| `nezha-variant-5`                 | Nezha                           | [NezhaVariant5](../hero/src/domain/nezha-variant-5.ts)                                |

## Named dragon definitions

`packages/dragon/src/domain` owns named dragon archetypes extending `Dragon`.
`dragonRoster` includes Black Dragon, Red Dragon, Blue Dragon, Scartha, Yukine,
Kraken, Kylin, Thunder Beast, Fire Eagle, Skeletal Frost Dragon, Hestal, Hexa,
Carres and Vildrin. The resource registry projects the 13 archetypes with existing
server configuration into `dragon_base`; it does not change their balance.
This package adds workspace dependencies only, with no external runtime library.

Names and references were verified against the read-only Android 12.06.0
`assets/local/database.local.xml` and `assets/local/text_en.ini`. The client has
14 entries while the maintained server base and level catalogs configure 13.
Vildrin, Sylvan Tutor is represented by a named class using available client
facts, but lacks server initial power, initial level, battle profile and level
progression. Its last client skill also lacks a corresponding quality entry.
These omissions remain explicit. Mapping or importing Vildrin into the playable
server catalog fails instead of inventing defaults or enabling incomplete gameplay.
Native device acceptance was not performed.

Each class owns hatching seconds, rename gold cost, ordered skill slots with unlock
levels and maximum quality ranks, interactions with cooldowns and minimum
friendship, sustained-feeding bonuses, gifts, initial talent and optional
civilization reputation requirements. `DragonDefinitionMapper` only projects those
values through injected `dragonCatalogBindings`. IDs live in `constants`; named
identities, skills, gifts, civilizations, interactions and battle profiles live in
`enums`. Domain definitions contain no native resource IDs or delimited strings.

| Catalog field                                | Authored meaning and evidence                                                                                                                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                                         | Named dragon identity translated to its native catalog ID.                                                                                                                                                                            |
| `initFight`, `initlevel`                     | Existing server starting power and level; verified against progression and power consumers.                                                                                                                                           |
| `skill`, `skillUnlockLv`, `skillSlotQuality` | Ordered skill slots, required dragon level and maximum accepted skill quality rank; replacement rules enforce the quality ceiling.                                                                                                    |
| `battleSkill`                                | Ordered native combat references selected by a named compatibility profile. The inspected client does not label these server references; profile names identify their dragon family or shared advanced binding, not invented effects. |
| `hatchTime`, `nicknameCost`                  | Hatching seconds and rename gold cost.                                                                                                                                                                                                |
| `communicateTime`, `communicateCond`         | Base interaction cooldowns and minimum friendship for Greet, Chat, Praise and Pet. Existing per-level cooldown rules remain authoritative.                                                                                            |
| `holdCrit`                                   | Bonus multiplier and interval in feeding actions for sustained feeding, not a random percentage.                                                                                                                                      |
| `gift`                                       | Named gift item references, including Stained Glass, Copper Necklace, Silver Ring, Golden Bracelet and the Silver item.                                                                                                               |
| `talentskillInit`                            | Initial talent skill reference.                                                                                                                                                                                                       |
| `reputationCondition`                        | Named civilization and required prestige level; native civilization codes are verified against the civilization catalog.                                                                                                              |

`dragon-roster.test.ts` compares every field and ordered sequence of all 13
server definitions against the pre-refactor fixture, checks domain edits and
rejects invalid configuration. Tests also verify that Vildrin stays visible in
the named roster but cannot enter the server catalog. The importer retains named
references and rejects unknown or client-only incoming dragon bases.

This change covers base archetypes at the same depth as the hero migration.
Level schedules in `dragon_new`, individual skill effects, talents, travel,
Dragon Tower, rankings and existing string-consuming Services/Rules are not
redesigned or moved by this change. They remain compatible consumers of the same
server data. There is no player-state migration or client repackaging; revert the
application change to roll back. Original client inputs are not runtime dependencies.
