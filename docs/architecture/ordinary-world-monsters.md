# Ordinary resident monster production

`world.use` supports the reference MONSTER item type 12 in addition to RESOURCE 11. Its configured target selection uses the owned stack's catalog weights. A
successful use consumes exactly that UUID, writes the map change and receipt,
and publishes the native `push.world.use` through the existing world interest
outbox. A foreign stack, occupied point, invalid configured target or claimed
range cannot consume the item. Receipt failure rolls back every effect.

The main field monster uses the configured ID, point type 9 or boss type 15,
zero stored `monsterCurrHP`, and the reference five-second backdated start.
Expiry is that start plus `monster_time.k1` seconds. A configured four-cell monster
uses the native lower-right footprint; the three prop ranges only change to type
17, preserving their existing metadata as the reference handler does. No battle
result, damage, reward or arbitrary hit points are created. Read-only monster
health can derive its maximum from the existing army or NPC catalog without
changing persisted HP.

`world.get.monster` is a real producer from `CreateTemporaryMonster`. It searches
SPACE terrain around the owned resident city using `world_barbarion.k5`, reuses
configured type 9 monsters only when their remaining lifetime exceeds k7 minutes
and their source-derived current HP is positive, or creates the configured k8
point with k9 minutes of lifetime. If no eligible point exists it returns native
`pointId=-1`. The source subsequently calls `flushSingleAreaMonster` with the
selected point's resource area and one configured monster, using its independent
24-hour lifetime. This refill can select the first point again or another free
point. The maintained implementation retains that side effect rather than
pretending this handler can only produce one point.

`get.act.boss.point` preserves the reference's read-only discovery: it returns the
nearest resident type 15 by squared coordinate distance, or `id=0`. It does not
require a battle result or fabricate campaign state. The source query does not
filter expiry, so this lookup preserves the saved map until authoritative expiry
processing changes it.

Candidate reads and actor writes share the existing world transaction lock.
Native prop and temporary-producer retries with `_cok_` receive the existing
connection-bound operation identity. Actor rows and the chosen owned item remain
authoritative; client counters and monster IDs cannot replace configured targets.
No public payment or combat producer is introduced. Natural periodic field,
exploration and barbarian replenishment has separate source scheduling and quotas.

Three rule cases passed with 13 assertions. Five PostgreSQL monster cases passed
alongside four existing resource-prop and expiry regressions, for nine cases and
86 assertions. They verify selected-stack conservation, native field types,
backdated lifetime, four-cell ranges, foreign and claimed targets, durable replay,
receipt rollback, temporary production and reuse, native negative discovery and
nearest boss discovery. Lint, formatting and server, service and repository type
checks passed. Read-only viewport projection composes the separately audited
monster projection; attack admission remains gated by the battle engine.

The resident recovery worker also runs the ordinary periodic producers. It loads
all declared `field_monster` refresh groups and uses the reference day windows,
last-window fallback, event-share division, rounded quotas and zero-count random
fallback. The original event algorithm includes the boss group in its denominator
and overwrites that output slot with the NPC group; the maintained calculation
retains that behavior. Normal candidates require SPACE 2, black-land candidates
require neutral terrain 0, and both reject overlays, ownership and active claims.
Black-land candidates also exclude the reference's inner throne rectangle.
The native remainder-area calculation is retained instead of replacing it with a
regular ceiling grid.

Each producer persists a versioned clock under
`trigger_var(-1,@world:0,opencok.world.monsters.<family>.v1)`. Its realm, map size,
owner epoch, area cursor, outstanding configured quotas and reserved candidate
IDs are validated before use. Each transaction fences the realm and takes the
shared resident-world lock before capturing time. Bounded pages commit actor
changes, delayed tickets, clock progress and the world-interest outbox together.
Concurrent owners, retries, restarts and failed publication persistence cannot
repeat a committed page. The separate expiry cursor advances past protected
actors and wraps across resident points, so a blocked page cannot starve later
expired cells. Occupied or claimed footprints remain authoritative;
barbarian expiry postpones the complete footprint by the reference hour instead
of deleting troops or combat state. Existing active boss records and orphaned
barbarian actor rows prevent candidate reuse.

The default reference schedules are 180 minutes for normal field monsters,
210 minutes for black-land field monsters, and 30 minutes for exploration and
barbarians. An existing realm without a maintained clock starts with the reference
150-minute field delay, one-minute black-land delay, and 20-minute barbarian
delay. The maintained realm hosts one zone, so it uses zone index zero for the
reference field-delay offset. Private deployment property overrides are not
inferred from catalogs. A completed fresh terrain manifest with no residents
permits initial production; a legacy world is not silently reseeded. The opening
clock and monster start marker are factual server rows. Missing or future opening
pauses generation while ordinary expiry continues.

Exploration supply creates real main type 6 and native range type 7 cells, with
configured area quota, terrain threshold and random lifetime hours. Fresh Source
initialization stores the duration rather than an absolute timestamp on its
ranges; this quirk is preserved. Ordinary expired mains are replaced within their
existing exploration area, then the expired main and ranges are cleared. There
is no fabricated exploration battle, victory or loot.

Barbarian supply follows `WorldFlushBarbarionTask` and
`AbstractWorldPeriodFlushTask`. The configured float ratio determines the area
quota, and black-land supply uses its separate minimum/maximum hysteresis.
`barbarion_switch` gates replenishment, including due tickets; expiry remains
active when the switch is closed. Candidate selection uses the configured
coordinate band and weighted barbarian catalog. A successful spawn creates main
44 and ranges 45, their configured lifetime and the factual `world_barbarion`
rows for all four points. Initial health comes from `para1`; army and award-army
maps use native Java object serialization from their configured catalogs.
Damage, kills, rewards and player counters are never synthesized.

Fresh `WorldCreatorV2.randomInit(List)` is empty in the original bytecode. Its
initial barbarian path emits four delayed tickets for each selected footprint
without creating an actor. The maintained seed cursor preserves those reservations
until the area is complete, including a transaction boundary in the middle of an
area. Runtime expiry emits delayed replacements, removes only the affected actor
rows, and never truncates imported combat state. A due ticket that cannot find a
complete free footprint is retained with a one-hour retry. Source black-land
expiry writes its delayed tickets to the normal ticket table; this provenance is
preserved. An existing black-land ticket is retried in its actual table, avoiding
the reference's failed-retry SQL that targets a different table and can lose the
ticket. There is no external actor or battle callback exposed to native clients.

Source evidence comes from `World.startFlushResourceTimer`,
`WorldCreatorV2.flushFieldMonster/getMonterIdMap/flushMonster/flushBarbarion`,
`WorldBlackLandFlushTask`, `WorldFlushMonsterTask`, `WorldFlushBarbarionTask`,
`WorldPoint.change2FieldMonster/changeRes2Space`, `WorldPointMapper`, and
`Barbarion.createBarbarion`. The authorized Java sources and original mapper and
bytecode remain private inputs. Synthetic fixtures cover the algorithms without
copying authoring data into the repository.

The periodic producer suite passed 12 PostgreSQL cases and three rule cases with
102 assertions. It covers bounded area progress, parallel retry and restart,
custom prop preservation, claimed range isolation, expiry without an opening
clock, exploration replacement, configured actor maps, delayed ticket retry,
fresh ticket reservations, black-land bosses, transaction rollback, ownership
fencing and post-lock time capture. Five existing resource producer cases, five
owned-monster cases, three monster rule cases and two Java map cases also passed.
