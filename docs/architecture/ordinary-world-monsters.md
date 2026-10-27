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
