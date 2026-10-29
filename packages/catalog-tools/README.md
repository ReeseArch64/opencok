# Catalog tooling

Offline tooling for [semantic definition policy](../../.github/ARCHITECTURE.md#client-backed-semantic-definitions)
and [#598](https://github.com/ReeseArch64/opencok/issues/598) /
[#601](https://github.com/ReeseArch64/opencok/issues/601), under #558 W13.
The architecture suite rejects direct/transitive imports from application or domain
`src` into this workspace, including types. Offline scripts and tests may use it.
Its parser and other dependencies
are development dependencies using existing locked versions.

The discovery command reads an explicit manifest, server inventory, authorized
client database XML and localization file. It writes one JSON report to stdout;
it never writes inputs, generates classes, updates bindings or enables gameplay.
No private location is a default. Run from the repository root after a development
workspace install:

```sh
bun --no-env-file packages/catalog-tools/src/discover.ts v12.06.0 manifest.json server-inventory.json /authorized/database.local.xml /authorized/text_en.ini --check > report.json
```

Exit 0 means the report was produced; with `--check`, exit 1 means unresolved or
contradictory evidence. Exit 2 means invalid arguments, inaccessible/oversized inputs
or a parse/schema failure. Error text deliberately omits paths and raw input.
Use an isolated system temporary directory for intermediate inventories/reports.

## Inputs and scope

`DiscoveryManifest` describes each catalog's owner, client `Group`, final name
attribute, ordered reference links and reviewed bindings. A link follows an exact
attribute value to an `ItemSpec.id` in another group; it does not split opaque IDs
or guess a relationship. The manifest pins the release and SHA-256 fingerprints of
both original client files and safe relative references within the client resources.
Absolute paths, traversal segments and platform-specific paths are rejected. `ServerInventory` lists the release and ordered native
IDs for every catalog in the audit's declared scope. Validate unknown JSON through
`readManifest` / `readInventory` before using `ClientBindingDiscovery` directly.

Bindings keep native numeric and string IDs distinct, including leading zeros;
client record IDs and localization keys are exact strings. They record the stable
semantic identity, exact localization key, SHA-256 of its raw UTF-8 value, and
`server` or `client-only` availability. The raw value preserves literal escapes
and whitespace after `=`; this is linkage evidence, not a client rendering decoder.
IDs must be safe integers or bounded well-formed strings. Client keys/references
use bounded atomic ASCII tokens; unsupported reference shapes fail explicitly.

`aliasOf` names a typed native ID in the same catalog. It must point directly to a
unique canonical binding with the same semantic identity and availability. Alias
chains/cycles fail. Duplicate localized names across different identities require
explicit, distinct `variant` field/value evidence in the original client rows.
These declarations record reviewed meaning; the tool does not establish semantics
from display names or automatically approve an alias.

The XML adapter reads the maintained reference shape `database/Group/ItemSpec`,
preserving attribute strings. It rejects malformed XML, entity declarations,
duplicate selected groups, invalid identifiers and unsupported selected row shapes.
The localization adapter preserves duplicate keys as ambiguity. Non-assignment
lines are counted and mark the preceding entry ambiguous; it never guesses a
multiline value. Ambiguity in a required key blocks that binding. Unselected keys
and unparsed lines remain input metadata, not evidence about unrelated families.

Read limits are 16 MiB for manifests, 32 MiB for server inventories, 64 MiB for XML
and 16 MiB for localization. Reads use read-only, nonblocking handles, regular-file checks and
size/time checks for changes during reading. These limits bound inputs, not total
parser memory; the XML adapter currently materializes the complete parsed document.
One local v12.06.0 Dragon run over a 45,887,280-byte database and 5,066,543-byte
localization file took 4.525 seconds and peaked at 940,596 KiB RSS. This is a single
offline observation, not a runtime budget or performance guarantee. Five unparsed
localization lines were outside the required Dragon keys; all 14 bindings resolved.

## Reports and review

Reports preserve family/binding order and include original input fingerprints,
normalized manifest/inventory hashes, selected client paths, localization keys,
name hashes, declared aliases/variants and source coverage. They do not contain
localized display text, original XML, absolute/private file paths or private implementation code.
Unbound client records include linkage/hash evidence without assigning a semantic
identity. Missing catalogs/rows/links/localization, duplicate IDs or semantic names,
invalid aliases/variants, version/fingerprint mismatch and unexpected server
configuration for client-only entries prevent `ready` / check success.

Coverage is exhaustive only for the supplied server inventory and selected client
groups. An empty or partial input is not proof that every repository catalog is
assigned. The inventory schema requires at least one catalog and the manifest at
least one family. Full W01 inventory, additional family descriptors, existing
importer migration, all-family binding review and semantic consumer cutover remain
#558 work. A passing discovery report does not prove mechanics, availability of
unmodeled data, native APK compatibility or the full definition migration.

## Existing Dragon evidence

The maintained [Dragon manifest](../dragon/src/bindings/client-discovery.v12.06.0.json)
uses the already named roster and binding constants. It contains selected provenance
facts for all 14 archetypes: 13 configured server definitions and client-only
Vildrin. The `dragon:inventory` script emits IDs from the current semantic Mapper
output, so an unexpected server definition is detected rather than hidden by a
hard-coded inventory snapshot.

```sh
bun run --cwd packages/catalog-tools dragon:inventory > /task-temporary/dragon-inventory.json
bun --no-env-file packages/catalog-tools/src/discover.ts v12.06.0 packages/dragon/src/bindings/client-discovery.v12.06.0.json /task-temporary/dragon-inventory.json /authorized/database.local.xml /authorized/text_en.ini --check > /task-temporary/dragon-report.json
```

The manifest is not imported by gameplay. Updating a fingerprint or name hash
requires checking the actual client linkage and existing semantic meaning; do not
refresh it merely to silence a mismatch. Other client releases need their own
explicit inventory, reviewed manifest and inputs; changing a filename does not
establish compatibility. Cross-release semantic equivalence remains a reviewed
fact, not an inference from reused native IDs.

Run `bun run --cwd packages/catalog-tools test` and
`bun run --cwd packages/catalog-tools check-types`; root package tests include this
suite. Synthetic fixtures exercise CLI immutability, diagnostics, deterministic
reports, exact ID types/order, aliases, variants, broken/cyclic links, duplicates,
version/fingerprint mismatch and unavailable entries. The Dragon roster test uses
maintained public facts only, so CI requires no private files.

On POSIX, the FIFO regression test requires `mkfifo` and verifies rejection without
a writer. Windows skips that test because it does not expose POSIX named pipes.

## Catalog and building imports

The existing authoring tools moved from `resources/scripts` in #601. Conversion
and named-record adapters live in `src/mappings`, file generators in `src/generators`,
and CLI entrypoints in `scripts`. Imports preserve source declaration order, exact
values, provenance, shared-table output and existing Hero/Dragon named authorship.
No identities or missing server configurations are inferred by this relocation.

```sh
bun run --cwd packages/catalog-tools import:catalogs /authorized/xml
bun run --cwd packages/catalog-tools import:buildings /authorized/building.xml
```

These commands overwrite the existing maintained destinations: `resources/src`
(catalog data/types, registry, codecs and provenance), `hero/src/resources/catalogs/types`,
and `building/src/resources/buildings`. The general importer removes obsolete files in its
three generated catalog/type directories as before. Do not use those directories
for unrelated files. Originals are read-only; neither command rewrites input XML.
The general importer requires the complete catalog directory declared by
`GameplayCatalog`, excluding `building.xml`. These are authoring commands, distinct
from the read-only discovery/report command above.

For isolated output review, pass both resource and Hero type destinations to the
general importer, or one building destination to the building importer. Paths are
relative to the command's current working directory; defaults are resolved from
the tool location. Supplying only one general-import destination fails before
writing. Destinations must be separate from authorized inputs. Both CLIs reject overlapping
input/output paths, resolving existing symbolic links before any generation.

```sh
bun run --cwd packages/catalog-tools import:catalogs /authorized/xml /tmp/review/resources /tmp/review/hero-types
bun run --cwd packages/catalog-tools import:buildings /authorized/building.xml /tmp/review/buildings
```

Formatting and review remain required before publishing generated output. Existing
converter mechanics are preserved; this relocation does not make all catalogs
semantic authoring sources or provide atomic rollback of an interrupted import.
The fixture parser remains in resources; the building compatibility mapper belongs to building
for existing consumers; runtime code has no import back into catalog-tools.

Synthetic generation tests compare 22 files against SHA-256 baselines captured
from the pre-move implementation: tables, duplicate tables, named Hero/Dragon
projections, automation, variables, web routing, tile maps and buildings. They also
exercise isolated CLI output, incomplete-input rejection, stale-output cleanup and
source immutability. Runtime roster/parity checks remain with resources; only
import-specific assertions moved here. No test requires private reference files.

## Maintained source ownership inventory (#580)

Run the read-only inventory from the repository root:

```sh
bun --no-env-file packages/catalog-tools/scripts/source-ownership.ts > /tmp/opencok-580-inventory.json
```

Use a task-owned temporary destination for reports. The command reads maintained
Git-indexed and nonignored untracked files; deleted files, symlinks, `data/` and
all `.env*` paths are excluded. Only workspace manifests and JavaScript/TypeScript
source contents are opened. Other paths contribute metadata only. No private
client inputs, environment values, runtime services or database are required.

Every included path has a `currentOwner` (workspace directory or `repository`) and
one `role`. These are current structural ownership and path-based classifications,
not approved future domain assignments. `sourceLines` counts physical source lines.
`proposedOwner: null` and `migrationStatus: "unreviewed"` preserve that distinction.
The [64-package register](../MIGRATION.md#existing-package-disposition-review)
retains the original dispositions, retired names and store-to-shop history.

The schema-version-1 JSON includes revision, workspaces, files, module imports,
resolved dependency edges and unresolved imports. It represents working files at
the recorded revision, including uncommitted changes; it is not an immutable Git
snapshot. Root documentation and maintained tooling outside workspaces belong to
`repository`. Generated/ignored artifacts are outside the inventory.

AST evidence recognizes command-named arrays/sets/properties and assignments, command enums,
`command`/`cmd` switches and comparisons, literal membership checks and exact
`GameplayCatalog` enum membership. Literal spelling, case and leading zeros are
preserved. Aliases, spreads and computed expressions retain their references as unresolved evidence; standalone
strings do not prove a command exists. Evidence records declarations and dispatch
references, never handler implementation, runtime reachability or semantic identity.
The parser supports maintained TypeScript/JavaScript syntax and fails on malformed
source rather than silently dropping it.

Application consumers and verification candidates follow reverse dependency edges,
including re-exports, literal dynamic imports and type imports. Workspace export
patterns/conditions and relative source paths are resolved statically. Conditional
exports are conservative candidates; external packages, computed imports, custom
aliases and runtime registration are not followed. Unresolved references remain
visible. These relationships establish neither runtime composition nor test coverage.
No architecture-violation baseline or CI authority is reinstated by this tool.

Run `bun --no-env-file test packages/catalog-tools/tests` and
`bun run --cwd packages/catalog-tools check-types`. Unit fixtures cover evidence,
roles and cyclic graphs; disposable Git checkouts cover filesystem/import
integration; the real CLI covers maintained ownership and the 64-package register.
Exact synthetic JSON assertions provide deterministic contract/snapshot coverage.
Gameplay mutation, native-device and database checks do not apply to this offline
inventory; no economic, authorization or gameplay-state rule changes.
