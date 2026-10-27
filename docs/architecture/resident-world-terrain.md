# Resident world terrain admission

Fresh resident terrain uses the authored normal-world layout consumed by
`WorldCreatorV2.parseMapProperty`, `parseMap2Property` and `loadGridData`. The parser
accepts an explicit external XML input and retains no authored content in the
repository. Tests use generated synthetic XML. The authorized local reference was
validated read-only as a 1201 by 1201 isometric map with two tile layers; no private
map or image asset is a shared project dependency.

The first tileset maps the first populated terrain component of each tile to
`NEUTRALLY=0`, `STOP=1` or `SPACE=2`. The normal world's second tileset starts at
99 and maps its authored lowercase `stop` property to overlay 1; absent overlay is 0. The two layer arrays preserve row order and the one-based point identity.
External tilesets, entities, declarations other than the XML declaration,
compressed or encoded layers, invalid UTF-8, unknown used tiles, inconsistent
counts and dimensions are rejected. XML size, depth, token size and dimensions
have explicit bounds. Arrays retain one byte per cell per layer.

Birth blocks use `worldmap_city.k1`. Resource and monster areas follow the
reference's floor-based area enumeration, with the final row and column sharing
the extra edge area in the native 1201 layout. They are not regular ceil blocks.
Terrain ordinals come from the authoring layers rather than a blanket free map.
Static reservations retain the throne's center and eight ranges, the four native
lower-right trebuchet footprints, and the victory tower's point type and level.
This creates no expedition period, boss actor, combat result, hit points or battle
reward. Unmigrated interaction engines remain unavailable for those reserved cells.

`importWorldTerrain` only appends an unoccupied new resident map. It refuses a
pre-existing unmarked world, players, marches, relevant world actors, foreign
realm authority and occupied or claimed terrain. Every page takes the realm epoch
fence, shared world placement lock and table locks, and commits inserted rows and
its progress together. A complete prefix is inspected when starting or resuming,
and again before publication. Intermediate pages verify the persisted cursor and
actor absence without rescanning the whole prefix. Insert conflicts cannot
replace existing cells. The final transaction validates map shape and invokes
`initializeWorldBirth` before publishing completion.

The private `trigger_var` identity `(-1, @world:0, opencok.world.terrain.v1)` stores
strict versioned metadata: realm, dimensions, catalog area widths, source format,
source fingerprint, derived layout fingerprint, owner epoch, progress and
completion. A new owner can resume only the same validated plan. Changing XML,
terrain bytes or layout settings cannot reuse a partial import. A completed
identical retry is read-only and preserves subsequently created cities. Malformed
metadata, missing cells or changed coordinates fail admission.

The operator command requires explicit process environment values for
`DATABASE_ROLE=kingdom`, `DATABASE_URL` and `GAME_ZOOKEEPER`, plus positional realm,
map size and authorized XML path:

```sh
bun run --cwd apps/server world:import 900501 1201 /authorized/world.xml
```

The optional `--catalogs /authorized/catalogs` selects an explicit external
catalog directory through the existing catalog loader. XML dimensions must still
match its `worldmap_city.k3`; the default remains the maintained catalogs.
`--page-size` bounds each transaction to 1 through 1000 cells, and `--pages` can
return durable partial progress for a later identical invocation. Unknown or
repeated options are rejected. Errors report only the failing stage.

The input is validated before database access. The command acquires the same
ZooKeeper ephemeral realm node as the live server and cannot take its ownership
while that server owns it. A read-only target check rejects an occupied legacy or
foreign database before acquiring a new database epoch. Database credentials and
input content are not printed. Interrupted imports resume by rerunning the same
command after the old owner has released its session.

The runtime must call `assertWorldTerrain(db, authority, config.mapSize)` after
fencing and before workers, traffic or character availability. A partial import,
foreign realm, shape mismatch or configured size mismatch prevents opening. An
absent manifest keeps existing legacy realms unchanged. Native fresh realms must
explicitly use `GAME_MAP_SIZE=1201`; the legacy default remains 1200. The import
size must also match the maintained `worldmap_city.k3` catalog value.

No migration, dependency, public command or automatic terrain rewrite is added.
This extends PostgreSQL authority under [ADR-0002](../decisions/0002-adopt-postgresql-for-authoritative-state.md)
and composes the [resident birth phase](resident-world-birth.md). Back up terrain,
its manifest, the birth phase, ownership and runtime epochs together. An old
binary without the dimension guard must not open a native 1201 realm using the
legacy 1200 default. Preserve an interrupted or inconsistent import for explicit
reconciliation; do not clear its manifest or fill an existing world implicitly.

Five terrain PostgreSQL cases passed with 45 assertions. Combined with the birth
initializer they passed six cases and 54 assertions. Parser and layout coverage
passed five cases with 60 assertions, including XML safety and native static
reservations; combined birth rules passed eight cases and 83 assertions. Required
lint, formatting, package boundaries and 25 workspace type checks passed. The CLI
rejected missing explicit operator configuration before accessing dependencies.
A real CLI subprocess test passed with 16 assertions against disposable PostgreSQL
and ZooKeeper: an active owner refused admission without changing its epoch,
bounded partial progress resumed to completion, process exit released ownership
and connections, a new owner admitted the completed map, and size mismatch
preserved all cells.
The authorized full XML was imported through the real CLI into disposable
PostgreSQL with a disposable ZooKeeper owner. It committed 1,442,401 cells in
1,443 pages of at most 1000 cells in 181.347 seconds. Sampled peak CLI RSS was
786,916 KiB; the disposable database occupied 412,407,475 bytes. The completed
1201 guard admitted the map and rejected 1200. IDs covered 1 through 1,442,401,
all birth areas were populated, the 26 static reservation cells remained present,
and exactly one birth phase existed. Source file size and modification time were
unchanged. Temporary databases, containers and synthetic fixtures were removed;
no authored content was exported or committed. These figures describe this local
validation run rather than a production throughput guarantee. Device execution
remains unverified.

Realm startup checks this manifest immediately after binding its PostgreSQL owner fence, before the opening clock, workers or player availability. A partial import, incompatible dimension or malformed manifest prevents startup. A realm without an import manifest keeps its existing maintained terrain behavior.
