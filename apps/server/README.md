# Experimental realm server

This is the first migration slice of the working Bun `apps/new-server` proof of
concept. It preserves the mobile **12.06.0** SFS binary protocol and adapts its
login, city bootstrap and world reads to the existing PostgreSQL Drizzle models.
The runtime requires Bun 1.4.2 and the workspace layout.

Implemented commands: `cmd.finishinit`, `cmd.ping`, `login.dataconfig`,
`login.other`, `setting.xml`, `get.user.info.multi`, `get.user.info`, `get.power.info`, `build.info` and `world.get`. The SFS handshake, login rejection,
session replacement, fragmentation, zlib input and signed 64-bit values are
preserved. Construction, queue completion, combat and other mutations return
`102192` (unsupported). Reading the city never settles queues or changes resources.

## Code organization

`src/index.ts` composes Effect Layers and runs the shared process runtime;
`src/config.ts` provides the RealmConfig service from the shared environment Layer. The composition root wires the shared packages described
in the [architecture package map](../../.github/ARCHITECTURE.md#implemented-api-and-realm-package-boundaries).
`src/server.ts` loads the rule catalog and connects `@opencok/connection/server`
to repositories, Redis/ZooKeeper adapters and command controllers. The dependency
Layer owns pools and coordination; the connection Layer owns TCP/health listeners
and a scoped readiness fiber. Shutdown waits for health checks, stops accepting
connections and drains session work before releasing dependencies. API and realm
share `@opencok/core/http` and `@opencok/core/runtime`.

`startServer(config)` remains a Promise boundary for embedded/integration callers,
backed by a ManagedRuntime whose `close()` disposes the service scopes. It cleans
up on failed startup and tolerates repeated close calls. TCP packet ordering,
backpressure, controllers and synchronous rules remain independent of Effect. See
[ADR-0012](../../docs/decisions/0012-adopt-effect-for-service-composition.md).

## Start locally

From the repository root:

```sh
docker compose --profile dev up --build -d --wait
```

The root `.env` contains `NODE_ENV`, `DATABASE_ROLE`, `DATABASE_URL` and the
private `GAME_LOGIN_SECRET` exception. Other development values are direct
Compose settings, still validated by the shared Zod schemas through `@opencok/env/effect`. Authorized XML comes from the complete local reference
copy at `data/reference/server/runtime/base/resource`; the runtime does not
reference another checkout. Direct Bun execution requires providing the remaining
service/resource settings through its process environment.

| Setting                          | Purpose/default                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`                   | Required PostgreSQL cluster URL; the adapter selects physical databases from the names below, retaining URL credentials/TLS options. |
| `KINGDOM_ID`                     | Realm ID, default `1`; selects SFS zone `COK1` or `COK2`.                                                                            |
| `KINGDOM_DATABASE_NAME`          | Defaults to `opencok_kingdom_<KINGDOM_ID>`.                                                                                          |
| `GLOBAL_DATABASE_NAME`           | Defaults to `opencok_global`.                                                                                                        |
| `GAME_LOGIN_SECRET`              | Required private secret matching the legacy mobile login issuer.                                                                     |
| `GAME_RESOURCES`                 | Required directory of authorized, extracted 12.06.0 XML rules.                                                                       |
| `GAME_REDIS_URL`                 | Defaults to `redis://127.0.0.1:6379/0`.                                                                                              |
| `GAME_ZOOKEEPER`                 | Defaults to `127.0.0.1:2181`.                                                                                                        |
| `GAME_HOST`                      | Bind address, default `127.0.0.1`.                                                                                                   |
| `GAME_PORT` / `GAME_HEALTH_PORT` | Defaults to `19933` / `18090`.                                                                                                       |
| `GAME_MAP_SIZE`                  | Defaults to `1200`.                                                                                                                  |
| `DEPENDENCY_TIMEOUT_MS`          | Defaults to `5000`.                                                                                                                  |

The root [Compose stack](../../infra/compose/README.md) starts this server, the
shared discovery API, gateway, PostgreSQL, Redis, ZooKeeper and MinIO CDN. It mounts the XML
directory read-only and uses a container-specific database URL. For direct Bun
execution, provide reachable PostgreSQL/Redis/ZooKeeper endpoints separately. Each running realm needs its own TCP/health ports and
`KINGDOM_ID`. The PostgreSQL topology setup initializes realms 1 and 2 with the
same schema. Advertise the corresponding `COK<id>` zone and TCP endpoint through
the existing discovery issuer; the shared API implements discovery; registration remains unavailable.

Relative XML paths are resolved from the workspace root, independently of the
command working directory. The XML loader requires `building.xml`, `role.xml` and `position.xml`.
`item.xml` supplies `login.dataconfig`; `arms.xml` and `goods.xml` are needed for
persisted troops/inventory. `function_star.xml` and `function_on.xml` describe
building star rules and optional features. Files remain local authorized inputs;
read-only mobile originals must be extracted in a separate working directory.

`setting.xml` is optional. Its command returns every configured setting with its ID
and values encoded as strings, or an empty array when the catalog is absent. XML
catalogs accept single records and multiple/nested groups. Duplicate IDs fail except
for goods, features, research, equipment, statuses and dragon skills, where the last record wins
as in the legacy cache. Values retain leading
zeroes and whitespace; malformed records and document type declarations fail loading.

Building star availability evaluates numeric client versions, realm selectors and
inclusive start/end boundaries at the command's injected time. Legacy dates use
`yyyy-MM-dd-HH-mm`, interpreted in UTC for this server, independently of the host
timezone. Invalid dates, versions and selectors fail closed instead of inheriting
the Java parser's lenient date rollover or invalid-date epoch fallback. Test-realm
selectors and explicit timezone offsets are supported by the pure availability
evaluator; the running realm uses the online selector and UTC. This changes only
availability/read previews; construction remains unsupported.

`login.dataconfig` projects the legacy game catalogs with explicit wire names and
types. XML values remain strings inside objects, while the documented integer and
long fields are checked before serialization. Long scores retain signed 64-bit
precision. Optional `general_sale.xml`, `pay_servercontrol.xml` and `kingdomskill.xml`
provide sale limits, the `69008` control record and ordered skill-tab metadata.
Unrelated item records are not exposed. Missing optional records remain omitted;
missing sale catalogs produce an empty `general_buy` object.

The command reads the authenticated realm profile to select the level-dependent
stamina cap when `stamina_limit` is available. Realm switches control quest metadata,
service terms and scout settings; the mission switch also checks version and time.
Avatar calendar dates are returned as UTC epoch-millisecond strings. Malformed
numeric fields, overflows and invalid dates produce the existing unsupported error
instead of an invalid SFS value. These metadata reads never settle production or
modify a player. Cross-realm gameplay remains disabled, and the running realm uses
the normal-world configuration with chat interval 1 and feed limit 3. Alternative
world-cup projections and explicit server values have unit coverage, but are not
enabled in the runtime composition.

`login.other` with `config` now returns `fbShare`, `pushSetting`, `switches`,
`isVerifyChangeAccount` and `funcOn`. Optional `fb_share.xml` records preserve all
string values and IDs. Profile, switches and saved notification preferences are
read in one repeatable-read PostgreSQL transaction. Missing notification settings
are synthesized using the legacy 20-type defaults, with world news off. Unlike
the Java read path, this query never inserts a preference row; explicit preference
updates belong to topic 6. Dependency failures reject the query instead of silently
returning a partial configuration.

Feature announcements retain the legacy distinction between the realm selector
(`onOff`) and the `version`/`pf` client metadata. The authoritative rule evaluator
separately checks version and start/end dates for stamina, star unlocks and
account-specific eligibility. Account binding and multiple-role flags also check
exact channel and player allowlists; subscriptions check their supported channels.
Boss, payment, subscription and multiple-role announcements additionally require
an available backend service. They remain closed in the current composition;
ordinary configured feature metadata is no longer forced off. This does not enable
unsupported gameplay commands or establish client rendering.

Account-change verification uses the configured version/realm threshold and the
global Redis key `opencok:global:device-account-change:<deviceId>`. Reads preserve
integer precision and reject malformed counters. No count is fetched when the
gate is closed or the profile has no device ID. This phase does not implement
account switching or import legacy Redis keys; a future switching writer must use
this namespace. The shared local Redis instance supplies the global counter across
the configured realms. Preference and counter adapters are unit-tested with fake
PostgreSQL/Redis clients; no database or network service is started by these tests.

`get.user.info.multi` returns public player summaries for up to 50 nonblank IDs.
Missing, empty and oversized batches return an empty `uids` array. Malformed wire
types and IDs longer than 255 characters are rejected. Ordinary duplicates retain
their request order; the built-in guide is appended once, including its distinct
legacy integer/long timestamp types. Unknown players are omitted. The observer
must still exist and must not be banned. Responses preserve request correlation.

Each realm snapshot reads only public profile, VIP, alliance membership/title,
banner and type-103 state columns. Queries never initialize missing rows, expire
states or mutate progress. Nullable related records produce the legacy empty/zero
defaults. Alliance membership and titles must match the profile's alliance. If
multiple titles, visual states or registrations exist, the first by title, state
ID or registration type is selected deterministically. Taiwan registration hides
the banner for both local and remote summaries; the Java remote SQL path omitted
that restriction. The DTO never serializes raw profile/account rows.

Presence of `allservers`, including `false`, enables lookup of missing numeric IDs
after stripping `@mod`. Global account records select their authoritative physical
realm database; unknown accounts are omitted. Configure additional readable realms
with `GAME_PLAYER_KINGDOMS=1:opencok_kingdom_1,2:opencok_kingdom_2`. Without this
setting only the selected realm is available. The list may include the selected
realm only with its existing database name; at most two total realms are allowed.
Missing configured routes, inconsistent remote ownership and database failures
reject the whole request. Local results precede remote results, as in the legacy.
Remote reads use separate read-only snapshots; this is not a transaction across
realms. The current realm's summary tables are checked at startup; remote database
availability is checked when requested and does not gate local login readiness.

Profile update markers are read in batches from
`opencok:kingdom:<id>:player-update:<uid>` in the shared Redis instance. Values remain
exact seconds strings; missing markers use the command clock in seconds. The guide
retains its fixed integer marker. Redis failures or malformed markers reject the
request. No legacy Redis key import or profile writer is introduced here; topic 6
must update this namespace after profile changes. No gameplay state is cached by
this query. Server-native behavior has unit coverage only; the client remains untested.

The full public profile foundation exposes `readPublicProfile` and the
`publicStatistics`, `publicMedal` and `publicEquipment` serializers. The adapter
selects public identity/progression, statistics, VIP, medal/privacy presentation,
military rank, office, tavern, general preview inputs, worn equipment and honors
in a single read-only repeatable-read transaction. Every dependent read binds the
target UID. Achievement completion is counted in SQL for completed/rewarded states;
balances, account/device fields and unrelated player settings are never selected.
Missing profiles skip auxiliary reads. Array reads detect the SFS collection limit
of 32,767 entries with an extra sentinel row and reject overflow without truncating
the response. Multiple taverns are rejected because the legacy first-row query has
no defined ordering. Failures roll back the whole snapshot.

Public statistics omit all battle fields when no statistics record exists and use
the persisted signed 64-bit total power when present. Equipment serialization
preserves nullable properties, locked-property flag selection, gated strengthening
presentation and exact case-sensitive aliases. Medal/equipment serializers select
only their documented wire fields. `publicProfileProgress` and `publicProfileBase`
now project identity, role experience, score-derived VIP, achievement ratio, military
level, tavern availability, realm name and privacy switches. Active VIP uses the last
qualifying record in the named VIP group, ignoring persisted level/SVIP, with a
strict expiry cutoff. VIP expiry seconds retain signed 32-bit narrowing. Achievement
counts use float rounding at division, allow ratios above one and default to one for
an empty catalog. The loader counts achievement records without deduplicating IDs;
military and realm names come from optional `wr_rank` and `servers` catalogs.
Equipment strengthening uses the server feature gate. Privacy switches remain
separate from the equipment/medal arrays, following the legacy public contract.
Missing required role/rank/active VIP data or lord state rejects the projection.

The profile snapshot also reads the target's `flower_ranking` counters. Public
flower score is signed 32-bit flower-minus-egg arithmetic, independent of the stored
score and visibility flag. An absent record projects zero, matching the legacy
default record's response, without inserting it. Existing null or malformed
counters reject the response. Office presentation follows the ordinary kingdom's
position enum, including canonical IDs, absent invalid ordinals and exclusion of
the local ready-king entry. It is independent of the office effect suppression
rules. These fields use the selected authoritative realm snapshot, including for
remote targets, instead of the legacy mixture of local and remote auxiliary reads.

`publicProfileGenerals` reconstructs the public general preview using the stored
ability JSON and owner-scoped `user_skill` rows from the same snapshot. General
attack/defence retain Java float operation order and signed-int saturation. The
preview omits selection metadata and talent `620700`, while injecting the two
special initiative skills only into the first raw tree. All initiative types
loaded by the legacy manager are supported; unknown skill types are omitted.
Known skills require their cooldown catalog entry. Each general receives the
player's skill collection, with exact long timestamps, the five-second expiry
cutoff, ready sentinels and disabled-to-active presentation normalization.
Duplicate skills select the last expiry-ordered record; UUID ordering resolves
ties that the legacy SQL left unspecified. Generals use UUID read order followed
by the shared Java hash traversal; the first entry supplies additional skill points.
The shared hash helper's 4,096-key and tree-bin restrictions still apply.

Invalid rescue prerequisites clear the projected ability trees according to the
legacy repair rule, including catalog/default maximum points. Cooldown, disabled
state and ability repair adjustments affect only this read projection. The legacy
database repairs and notification side effects remain pending compatibility work;
the query does not create skills, update stored talent trees or send mail. Missing
generals, required catalogs or malformed stored abilities reject the projection.

`publicProfileAlliance` preserves the nested public alliance envelope, explicit
alliance columns, legacy leader aliases, permission objects and video fields.
Membership, leader, aggregate power, research and video reads share the profile
transaction. The leader query detects absent or ambiguous leadership; the totals
count only members joined to existing statistics. Missing alliance records or
zero qualifying members reject instead of fabricating an aggregate-only response.
Research is skipped for observers in the same alliance. Other observers receive
the membership-capacity effect with float-to-int conversion and signed addition.
SQL decimal aggregates are doubles in local replies and narrowed signed longs in
remote replies, preserving the two legacy serialization paths. Base bigint fields
remain exact in both paths. Null database columns are omitted; malformed permission
JSON or video fields reject the result. No player/account data is exposed by the
alliance projection. No membership, permission, video or research mutation occurs.

`get.user.info` now composes these providers into the full ordinary-realm public
response. The command validates the authenticated observer, accepts one numeric UID
of at most 40 digits, captures one server timestamp and uses the observer's persisted
alliance for capacity visibility. Client realm, clock and alliance overrides have
no effect. The global account directory selects the target realm before its data is
read; an absent directory entry falls back to the local realm, as in the legacy
directory lookup. A configured but unavailable realm, malformed route, mismatched
profile realm or failed provider rejects the response without a local fallback or
partial result. The existing two-realm configuration also bounds these reads.

The response uses the target realm's name and update-marker namespace while server
feature gates use the requesting process's rule context, matching the legacy
projection. Missing update markers produce an empty string; dependency failures
propagate. Correlation fields are preserved and the query emits no pushes. Local
startup additionally checks the skill, honor, achievement, flower and alliance video
tables; remote dependencies are checked on use. These paths have synthetic unit
coverage only. Legacy repair/write differences, exceptional-state limits and special
battle-realm behavior remain unresolved; native-client and live-service validation
remain deferred. No schema migration or authoritative write is introduced here.

The detailed-power foundation now includes `readPowerState`,
`calculatePlayerPower` and the `powerInfo` DTO. The read adapter captures the
requested player's persisted components in one read-only repeatable-read
transaction. The calculator covers role, generals, completed troops/traps, building
star progress, ordinary/civilization/saga research, equipped items, eligible titles,
mature dragons and heroes. Training, construction and research deadlines never
complete during these reads. Active title contracts take priority until expiry;
ordinary titles require their available talismans. These checks do not consume
items or rewrite expired titles.

Power arithmetic preserves Java signed integer wrapping, double troop aggregation
before truncation, float dragon intermediates and long saturation/wrapping. Avatar
upload deadlines remain exact signed 64-bit values. The detailed wire DTO preserves
the legacy misspellings and intentionally omits the aggregate `power` field.
Missing records have nonpersistent zero defaults; missing catalogs for populated
domains and malformed numeric rules fail explicitly. Row ordering is deterministic
by persisted IDs, rather than depending on Java hash-map iteration. No foreign
research component is added to the total because the legacy total omits it.

Optional power catalogs are `general.xml`, `science.xml`, `scienceRace.xml`,
`saga_tower_science_up.xml`, `hero.xml`, `equipment.xml`, `dragon_words.xml`,
`dragon_base.xml`, `dragon_new.xml`, `status.xml`, `sk.xml`, `suit.xml`,
`vip.xml`, `svip.xml`, `alliancescience.xml`, `reputation_level.xml`,
`civilization_feature.xml`, `wr_skill.xml`, `miracle_buff.xml`,
`dragon_skill.xml`, `activity_event.xml`, `office.xml`, `life_treeS.xml`,
`saga_tower_science_base.xml`, `foreign_civilization_up.xml` and
`foreign_civilization_base.xml`, `activity_panel.xml`, `merge_activity.xml`
`lucky_effect.xml` and `monarch_title_lord.xml`.
They use the same validated XML loader.
Only an internal `rules` → `contracts` dependency is added; no external library
or schema migration is required. Synthetic unit tests cover calculations, wire
types, catalog loading, query ownership and rollback.

Stored title contracts now decode from bounded UTF-8 JSON, including trailing
padding used by the legacy encoder. Integer tokens retain exact precision through
JSON parsing. Invalid shapes, binary SFS input and out-of-range deadlines fail
explicitly. The read-adapter fixture uses the actual JSON storage format.

Power context evaluates base/level-up/science dragon gates by realm and inclusive
time boundaries. As with the legacy server calls that pass a null player version,
the version attribute must be nonblank but is not compared with the client version.
Malformed dates fail closed. The effect projection also reads persisted statuses
in the same snapshot and computes initial-item, completed-research and active-status
contributions, including random effects and the throne override. Float addition
order and signed status overflow are preserved. Statuses ending at the snapshot
time are excluded, matching reconstruction of the legacy active-state map.

Research bonuses include saga, foreign and civilization research after the initial
and ordinary-science contributions, retaining float rounding between every addition.
Saga/foreign entries use the persisted item/level plus the catalog offset, skip
hidden base entries and pair effect/value tokens only while both lists have values.
Stored level-zero entries can contribute. Civilization values divide the parsed
float by 100, keep the legacy missing-value default, and traverse last-per-base
records in Java hash order. This shares the bounded hash traversal used by tree
effects. No query finishes research, unlocks entries or spends points. The legacy
foreign-science table spelling is preserved in the repository; foreign modifiers
do not introduce an additional foreign-power field in the detailed wire response.

The same snapshot now retains general ability JSON, equipped extra attributes,
strength levels and selected decomposed-set slots. `generalSkillPoints` decodes
passive skill allocations without activating saved trees marked by `ids`.
`generalSkillEffects` applies the skill base/increment formula with signed point
arithmetic and float rounding. Repeated effect IDs inside one skill replace earlier
values; skills and generals then accumulate in deterministic order.

`equipmentEffects` projects worn-item attributes, paired dragon attributes and
persisted extras. Color and position modifiers must be resolved by its caller;
the callback receives effects from previously loaded items. Per-item aggregation
and the nonnegative clamp match the legacy equipment accumulator. Empty dragon
refinement that would require a random repair is rejected without changing data.
`equipmentSetEffects` adds worn-set thresholds, six-piece strengthening and the
three persisted decomposed-set slots. Worn sets honor client/realm/time gates;
strengthening uses the server gate without comparing client versions. Hero-only
set attributes are excluded and malformed strengthening tiers are skipped
individually, matching the legacy handling. These projections do not equip items,
consume materials or grant decomposed sets. The global equipment multiplier and
other gameplay bonus providers still belong to the pending effect composition.

VIP and alliance-science effect projections read the same transaction snapshot.
`vipEffects` selects the last qualifying score threshold in the named VIP XML
group, replaces repeated base effect IDs and adds super-VIP effects with float
rounding. Activation ends exactly at the persisted deadline; the display level
and visibility preference do not control effect availability. Missing VIP records
produce no effects. This read does not grant daily login points, recalculate stored
progression or send level-up rewards.

`allianceScienceEffects` follows the profile's persisted alliance ID and completed
research levels, including level zero. It retains signed rule-ID arithmetic and
semicolon-separated effect accumulation. An empty alliance skips the shared
research query. Reads neither settle research queues nor consume donations;
missing catalogs for active data fail explicitly. Unit tests cover exact VIP
deadlines, membership query ownership and rollback on late shared-state failures.

Prestige, military skills and miracle bonuses also have read-only effect
projections. Prestige uses the current civilization and exact signed-long point
ranges, taking the first matching level and feature row. Military skills select
the highest positive level in each group, deduplicate stored IDs and accumulate
status effects with signed integer wrapping. Equal-level ties follow persisted
skill order instead of Java hash-map order. Miracle bonuses select the last
catalog entry with the active `order`, independently of its item ID, and replace
duplicate effect definitions. Prestige/miracle gates include the client version;
military availability uses the server gate. These reads do not change civilization,
settle military seasons, grant rewards or create inactive miracle records.

Hero effects follow the activity-event date window with inclusive boundaries.
Contiguous parameter groups accumulate using float arithmetic. Heroes in the
same ID family are selected by level, then experience, retaining the last exact
tie in persisted order. Both effect projection and hero power use that selection
without deleting duplicate records, awarding new heroes or advancing levels.

Dragon skill projection reads each player's skill slots alongside dragon state.
Only mature dragons with the active flag contribute, under the base/level-up
server gates. Skills match the dragon's base owner ID; the last persisted entry
for a slot wins. Only unlocked passive skills apply. Base plus level increments
and reached strengthening thresholds retain double precision, with signed level
subtraction and per-dragon accumulation. Battle-only skills, inactive dragons and
other owners do not contribute. The calculator neither equips skills nor creates
missing defaults. Catalog duplicate replacement now includes dragon skills.

Office effects use the owner's persisted kingdom position and the `office` catalog,
including signed penalties and first-occurrence precedence for duplicate effects.
Position IDs normalize through the legacy ordinal; the local ready-king placeholder
is excluded. The world prohibition effect suppresses office bonuses when positive.
The `officials` server gate suspends them during an opened, started throne fight,
ending that suspension exactly five seconds before the persisted end time.

The power snapshot reads the office and its realm's fight schedule in the same
read-only transaction. A second matching schedule makes the input ambiguous and
is rejected when battle suppression must be resolved, rather than choosing Java's
unspecified map iteration order. Queries are bounded to two matching records and
skip schedules for players without an office. These projections do not appoint
officials, start battles, reschedule events or change persisted state. These effects
participate in the ordinary-realm power resolver.

Territory effects for power queries use the alliance's placed life tree, without a
map target. Only building/complete trees contribute. Default skins use the current
persisted stage's control record; custom skins supply status IDs through `life_treeS`.
Blank saved skins use the configured default in memory. Status IDs are deduplicated,
and each status contributes its first Java hash-map entry. Replacement order follows
Java 8 hash buckets, including ordinary collision chains and resizing, before double
values are floored and saturated to signed integers. Missing individual status IDs or
empty definitions are ignored as in the legacy lookup. Missing required catalogs and
malformed active values fail explicitly.

The realm snapshot selects at most two placed trees for the persisted alliance;
multiple trees are rejected as ambiguous rather than selecting an arbitrary one.
Pathological catalog collisions that would require Java tree-bin ordering are also
rejected, and each hash traversal is bounded to 4,096 unique keys. These reads do
not progress tree construction, change skins, settle vitality or apply map-target
turret/range effects. Those map-target effects do not participate in power queries.

Lucky Day effects reconstruct the saved active record using its exact deadline,
server feature, player version/platform and realm controls. Test realms require
both event test switches. Ordinary activity dates include both endpoints; merge
activity offsets are minutes relative to the realm's persisted merge timestamp,
with an exclusive end, and can open the event independently of the ordinary panel.
The snapshot reads only the local realm's `server` metadata row when a Lucky Day
record exists. Activity-panel duplicate IDs retain the last catalog record.

The projection returns the persisted Lucky Day effect, with last duplicate values
and integer validation. It does not recreate a missing record, randomly replace
an effect on a power read, write that replacement or push it to a player. This is
a deliberate snapshot-query difference from the legacy getter's reroll side effect;
Lucky Day activation and reroll commands remain outside this read-only slice.
Expiry follows login reconstruction, so a deadline equal to the captured instant
is inactive. Required metadata/catalog failures reject rather than fabricate a bonus.

World effects can be read with one `HGETALL` from
`opencok:kingdom:<kingdomId>:world-effects`. The hash retains numeric effect IDs
and JSON objects with a string `value` plus an optional signed-long `endTime`.
Importing legacy `world_effect<serverId>` data into that namespace is an explicit
operator migration; the adapter neither falls back to the legacy key nor writes
it. Missing hashes are empty, while malformed replies fail. The read limits are
4,096 fields, 65,535 bytes per JSON value and 1 MiB in total.

`decodeWorldPowerEffects` preserves integer-token precision and
`worldPowerEffects` reconstructs active float values at the supplied instant,
without inheriting the legacy cache's ten-minute refresh delay. Ordinary modifiers
are independent of the `server_buff` gate; the special event-effect family honors
that server gate, with the legacy cross-throne bypass represented explicitly.
Records without a value are ignored; malformed active values fail. The power command
uses this adapter when mature dragon power requires the effective attack modifier.
It is not a separate grant or activation command.

Personal throne rewards read only owner-targeted lord titles for throne type 2.
Their effects apply for the explicitly supplied emperor version, retaining paired
token handling and float accumulation. The reader bounds history to 4,097 records
so the resolver can reject inputs exceeding 4,096 without silently truncating them.
It does not infer the active version from the newest historical reward or king row.

`Cache.emperorVersion` reads `opencok:kingdom:<kingdomId>:emperor-version`.
A canonical signed-integer string identifies the version; `none` explicitly means
there is no emperor. An absent key means state has not been supplied, and cannot
resolve saved personal rewards. Realms without personal rewards do not need that
version for power. Importing this marker from authoritative global throne state
is an operator step until the global event feed is migrated. No reader writes the
marker or falls back to a legacy/global key.

`get.power.info` now dispatches to the selected realm's power snapshot, checks the
authenticated owner and ban status, calculates components and emits the detailed
wire DTO with correlation fields. It captures one server instant and ignores any
client-supplied player ID, timestamp or attack modifier. Startup checks all power
tables with zero-row queries. Tests exercise the command and repository using
synthetic state and fake database clients, without opening listeners.

Mature dragons with the dragon-science gate enabled now use the composed ordinary-
realm attack modifier. The resolver combines initial/research/title contributions,
VIP, statuses, general skills, alliance research, offices, equipment, territory,
world effects, heroes, Lucky Day, active dragon skills, military, prestige and
miracle effects. It retains the ordered float additions, the dragon double step,
the final base contribution and equipment's global percentage multiplier.

Equipment reconstruction follows login ordering: earlier equipped items can affect
later color/position multipliers, while saga/foreign/civilization research, military,
Lucky Day and personal throne rewards loaded later do not alter that initial item
projection. Set/decomposed-set effects apply afterward. Those later sources do enter
the final attack modifier and global equipment multiplier. The runtime fetches world
effects only when needed and the emperor version only when saved rewards exist.

Missing authoritative dependencies, malformed active catalogs, ambiguous stored
state and the documented hash-order limits still fail with `102192`; they are not
replaced with zero bonuses. Dedicated battle-realm providers and state-changing
gameplay remain outside this ordinary-realm snapshot query. Native-client and real-
service validation remain deferred.

Use runtime credentials with SELECT access to the required global/realm tables,
separate from the administrative setup account. Startup checks the required
projections and dependencies before opening listeners. `/healthz` and `/readyz`
return 200 when dependencies are available and 503 when unavailable; readiness
is refreshed every two seconds. SIGINT/SIGTERM drain pending commands, release
session leases and close pools. Logs omit account/device IDs, secrets and raw
query/driver errors.

## Compatibility and persistence boundaries

- Login requires existing `userprofile` and matching global `account_new` rows,
  device binding, supported mobile channel, valid signature and no active ban.
  Legacy `cmdBaseTime` is signed literally; the web timestamp window is not
  applied to this mobile path. Firebase auth/account provisioning remain future work.
- PostgreSQL data is read through `@opencok/drizzle` using typed table modules.
  Global accounts use their own physical database connection; game reads use the
  selected realm. City/map snapshots use read-only repeatable-read transactions
  and UTC. PostgreSQL bigint values remain exact until SFS serialization.
- Redis sessions and ZooKeeper registrations are scoped to the realm.
  ZooKeeper prevents simultaneous registration at `/opencok-experiment/COK<id>`;
  this is a read-only migration slice. Epoch fencing is still required before
  enabling authoritative mutations, as defined in the architecture.
- Map reads use PostgreSQL, avoiding the proof of concept's unscoped `world1`
  cache. Only base-world terrain, unallied cities and resources have migrated
  DTOs. Realms with active marches, specialized points or unsupported queue
  types fail explicitly rather than advertising incomplete simulation state.
- No schema or migration is added here. Existing PostgreSQL migrations remain
  unchanged. MySQL/MariaDB records are **not transferred** by this change;
  preparing existing accounts/cities requires a separate reviewed data migration.
  Empty databases do not automatically create or reset player state.
- Unimplemented gameplay commands and commerce remain unavailable. Configuration
  metadata does not enable their handlers; service-dependent `funcOn` announcements
  remain closed until their backends are provided.
  Other client versions, APK
  rendering and real-client discovery against this PostgreSQL server remain
  unvalidated. The source proof of concept's successful APK connection does not
  establish that validation for this port.

See [architecture](../../.github/ARCHITECTURE.md#153-first-postgresql-server-migration-slice)
for ownership and the next migration steps.

## Gameplay migration: topics 1–8

The [migration inventory](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19156446)
defines the full requested scope. Implementation and verification remain incremental;
the table records gaps rather than treating package scaffolding as completed behavior.
The current work is restricted to server implementation and unit tests. Do not run
ADB, native-client validation, integration or end-to-end tests for this phase.

The reconnect foundation tracked in [issue #58](https://github.com/ReeseArch64/opencok/issues/58)
reads an owner's balances, armies, generals and initiative skills in one read-only
repeatable-read transaction.
Its serializers preserve seven currency longs, signed 64-bit overflow in the combined
gold balance, and conditional training fields without loading static army catalogs.
Army rows have deterministic ID ordering and oversized collections reject instead of
truncating. Synthetic adapter tests use an in-memory SQL client; they do not connect
to PostgreSQL. Own-general serialization retains the saved ability-page index and
pending choice strings omitted by public previews, and omits the public skill-point
wrapper. It shares the existing attribute, cooldown and ability-repair projections
for the current v12.06.0 process; pre-2.0 version filters are outside that process's
supported configuration. Repairs remain projections without persistence or notification
side effects, and the shared hash traversal retains its documented exceptional-state
limits. The friendship-mine provider resolves the current global account binding,
returns an ephemeral level-one mine for unbound accounts, and reads or initializes
the bound owner's persisted mine. Initialization uses the existing composite key with
conflict handling and reads the winner after a competing insert, preserving progress
on retries. It makes no reward, cost, timer or helper changes. The `treasure` catalog
provides initial selection and level-dependent display values; binding and help history
are excluded from the wire response. Global binding lookup and realm persistence are
separate transactions, so each request uses the binding observed at its start; a later
rebind selects another composite key. The provider rejects realm mismatches and missing
local owners. Unit tests simulate conflicts and lost commit responses; real database
concurrency remains untested in this phase.

This foundation is not yet exposed as `user.lv`: actual marches, settled resources,
queues and task transitions still need implementation, and the available components
must be composed with required authoritative mutations before enabling the handler.

| Topic                                     | Implemented evidence                                                                                                                                                                       | Remaining work                                                                                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Configuration and feature availability | Settings and data-config queries; deferred-login configuration; feature announcements and account-specific eligibility; grouped XML; timed star previews; synthetic unit and adapter tests | Native-client and real-service validation remain deferred. Services outside this wave (bosses, commerce and account switching) stay unavailable. |
| 2. Player/progression queries             | Initial player DTO; public summary batches; full ordinary-realm public-profile read command; detailed-power command with modifier composition and unit tests                               | Full own/reconnect behavior; documented read-versus-write differences, exceptional-state limits and authoritative global-state import.           |
| 3. Ranking queries                        | Persistence schema                                                                                                                                                                         | Lists, player positions, pagination and tie-breaking.                                                                                            |
| 4. Basic mailbox                          | Persistence schema                                                                                                                                                                         | List, read, mark, save and delete, with ownership and atomic mutation rules; reward redemption is outside this wave.                             |
| 5. Additional map queries                 | Base viewport                                                                                                                                                                              | Point details, player search and favorites, including authorization for writes.                                                                  |
| 6. Profile/preferences                    | Initial profile reads                                                                                                                                                                      | Nicknames, validation, applicable costs, flags and persisted preferences.                                                                        |
| 7. Avatar integration                     | Standalone files service                                                                                                                                                                   | Realm grants, confirmation and profile updates.                                                                                                  |
| 8. Basic chat integration                 | Standalone chat service                                                                                                                                                                    | Realm session issuance and game-facing configuration. Native-client validation remains deferred by request.                                      |

Unit fixtures are synthetic and do not load ignored Java inputs or player databases.
The availability and settings tests cover protocol types, correlation, catalog
absence, grouped records, numeric versions, realm ranges, inclusive deadlines,
invalid calendar values and time-dependent building previews. The full wave is not
complete until all eight server-side behaviors have corresponding unit coverage.

## Verification

```sh
bun run --cwd apps/server check-types
bun run --cwd apps/server test
bun run --cwd packages/env test
bun run --cwd apps/server test:mutations
bun run --cwd apps/server test:integration
```

The integration suite owns disposable Docker instances of PostgreSQL
`17.11-bookworm`, Redis `6.2.24-bookworm` and ZooKeeper `3.4.14` (the source
experiment's Redis/ZooKeeper versions). It applies the real Drizzle migrations,
creates only synthetic XML/accounts and tests TCP login, rejection paths,
city/army/inventory/map reads, realm isolation, exact bigint transport,
unsupported mutations, process restart and Redis failure/recovery. Docker must
be running; missing dependencies fail the suite. It does not accept deployment
URLs or use private resources. A synthetic SFS client verifies wire responses;
APK/device validation and production dependency versions are separate gates.

A focused mutation check runs the login tests against seven disabled auth guards in
a temporary test bundle: signature, device binding, account activation, realm,
account device and both ban checks. Every mutant must fail its tests. This is a
bounded auth check, not the architecture's future repository-wide Stryker suite.
