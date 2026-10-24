# Experimental realm server

This is the first migration slice of the working Bun `apps/new-server` proof of
concept. It preserves the mobile **12.06.0** SFS binary protocol and adapts its
login, city bootstrap and world reads to the existing PostgreSQL Drizzle models.
The runtime requires Bun 1.4.2 and the workspace layout.

Implemented commands: `cmd.finishinit`, `cmd.ping`, `login.dataconfig`,
`login.other`, `setting.xml`, `get.user.info.multi`, `get.user.info`, `get.power.info`, `mail.category.status`,
`mail.save`, `mail.cancel.save`, `mail.save.batch`, `chatMail.save`,
`mail.read.status`, `mail.read.status.betch`,
`mail.delete`, `mail.read`, `mread.batch.category`, `mread.batch`, `mread.chat` (message and group selectors),
`server.rank`, `kill.rank`, `level.rank`, `building.rank`, `silver.contribute.rank`, `expedition.rank`, `alliance.rank`, `kill.al.rank`, `build.info` and `world.get`. The SFS handshake, login rejection,
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
| `GAME_MAIL_TRANSLATION`          | Defaults to `true`; `false` suppresses category-chat translation IDs and stored-translation reads.                                   |
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

## Player ranking queries

`server.rank`, `kill.rank` and `level.rank` return `serverRanking` and the
authenticated player's `selfRanking` from the selected ordinary realm. The `ranking`
item's `k2` supplies the display limit, from 1 through 32,767; request pagination and
target UID parameters are ignored, matching these three legacy handlers. The optional
`servers_config.xml` record `power_limit` hides GMs from power candidates only when
`rankingHideGm` is exactly `1`. Scores remain owned by their gameplay writers.

The adapter reads the requester, candidates and fallback position in one read-only
repeatable-read transaction. Level candidates exclude cross-realm visitors and order
by level, experience and name, within a window of three times the display limit.
Power candidates exclude visitors, permanent bans and optionally GMs; kill candidates
retain visitors and orphan statistics. Both statistics windows are twice the display
limit. Future bans are removed after window selection. The self position uses the
whole filtered window, even beyond the displayed list. Outside that window, the
fallback is one plus the count of strictly greater primary scores across the original
table, without applying presentation exclusions or secondary tie criteria.

Missing profile/alliance presentation removes an entry after taking the display
window, without filling its slot or renumbering the self position. Public DTOs expose
only the corresponding score, identity, picture and alliance fields. Cached numeric
fields retain the legacy JSON decoding distinction between signed 32-bit integers and
64-bit longs; SQL null scores stay omitted. Correlation fields are echoed and these
queries produce no pushes or mutations.

Each request uses a fresh snapshot instead of the Java refresh/cache lifecycle. UID
is the final deterministic tie breaker where the reference leaves ties unspecified;
names and UIDs use PostgreSQL `C` collation, which can differ from the legacy database
collation. Synthetic units verify query structure, mapping, selection, numeric types,
authentication and rollback. Real database execution, cache timing and native-client
rendering remain unverified. Event and cross-realm ranking families
are still unavailable; this player slice implements the three commands tracked in
[issue #59](https://github.com/ReeseArch64/opencok/issues/59).

`alliance.rank` and `kill.al.rank`, tracked in
[issue #60](https://github.com/ReeseArch64/opencok/issues/60), return `allianceRanking`
and the authenticated player's alliance position. Unaffiliated players receive no
`selfRanking`. The `ranking` item's `k1` controls their top-list size with the same
1–32,767 bounds. These commands also ignore client target and pagination selectors.

Both boards aggregate members with existing statistics, require a rank-five leader
profile, exclude cross-throne alliances and order by score descending, then current
member count ascending. They do not filter banned members or cross-realm visitors.
Power adds persisted alliance-science power to the member total and fetches `2*k1-1`
candidates. Kills fetches `2*k1` and deliberately drops the final candidate before
selection, preserving the reference loop even when only one alliance exists. Multiple
leader records retain duplicate alliance entries and the final ordinal supplies that
alliance's self position. Final alliance/leader UID ordering makes unspecified ties
deterministic. Outside the candidate window, both fallback positions count strictly
greater member-only aggregates, including alliances without leaders or with the
cross-throne flag; power fallback excludes science power.

Presentation uses current alliance labels/icon, member count, science-expanded maximum
membership and optional video metadata. Missing name/abbreviation drops the entry
without refilling its slot. Science expansion retains float accumulation, Java integer
conversion and wrapping. Aggregated scores pass through the legacy decimal-to-double
conversion: integral magnitudes below ten million decode from cached JSON as SFS ints,
while larger magnitudes use doubles and inherit their rounding. Counts retain the
separate cached integer/long behavior. SQL null scores and leader names are omitted.

The repository reads candidates, fallback and batched presentation inputs in one
read-only snapshot. Presentation science input is capped at 32,767 rows for the whole
displayed board, detected with a sentinel; oversized input rejects without truncation.
Malformed science/video inputs and dependency errors reject the response rather than
returning the legacy handler's partially enriched list. Freshness, collation and
verification limitations match the player boards. No alliance score, membership,
science, video, cost, reward or timer is modified by these queries.

`building.rank`, tracked in [issue #61](https://github.com/ReeseArch64/opencok/issues/61),
uses the player-board `k2` limit and returns castle rows with `selfRanking`. Its
two-times candidate window joins castles to statistics and profiles, excludes
cross-realm visitors, and orders by castle level, star, update time and building
power. Only permanent bans are removed after selection; temporary bans remain.
Multiple castles retain repeated player entries and the last ordinal supplies the
self position. Castle UUID is selected only for deterministic ties/validation and
never appears on the wire. Nullable joined alliance fields stay omitted without
discarding the player, and cached integer/long types are preserved for every numeric
column, including update time and building power.

Outside the candidate window, the fallback counts all higher-level castles and adds
the owner's offset among equal-level castles joined to statistics. That secondary
order uses update time and building power, deliberately ignoring stars, bans and
cross-realm presentation filters. A SQL window computes the offset without loading
the whole peer list. Missing castles return position one; missing statistics leave
the higher-level count unchanged. Multiple own castles requiring fallback reject
because the reference's in-memory castle choice has no stable persisted ordering.
Null ban timestamps reject instead of simulating an aborted legacy cache refresh.
An empty fresh board stays empty, rather than retaining old cached entries. No
construction settlement, score calculation or player-state write occurs.

`silver.contribute.rank`, tracked in [issue #62](https://github.com/ReeseArch64/opencok/issues/62),
reads positive persisted material-contribution totals using the `ranking` item's `k4`
limit. Its candidate window equals the display limit; future bans and missing
profile/alliance presentation are removed afterward without refilling slots. GMs and
cross-realm visitors remain eligible. The response uses `myRanking` instead of
`selfRanking`, returns -1 when no visible entries survive, and omits `picfraId`.
Otherwise the position comes from the filtered candidate ordinal or one plus the
count of strictly greater totals, without presentation exclusions. Missing own totals
produce fallback position one when the visible board is nonempty. The existing
`material_cost_ranking` table is checked at startup. This query uses the same fresh
read-only snapshot and deterministic tie policy as the other boards; it does not
accept donations, reset scores, grant rewards or advance activities.

`expedition.rank`, tracked in [issue #63](https://github.com/ReeseArch64/opencok/issues/63),
reads the current paired expedition through a narrow Redis service. The selected
realm's authenticated profile must exist and match the process realm. The command
uses `ranking.k2`, ignores client target/realm/score selectors and returns no pushes.
Absent pairing or an empty sorted set produces an empty query result. The shared
command boundary adds the legacy `success: true` acknowledgment and retains correlation.
A populated score list with no usable metadata returns an empty `serverRanking` and
`selfRanking=-1`. Missing metadata consumes a candidate slot; visible entries receive
contiguous ranks, and self position exists only when the requester appears among them.
Scores retain descending Redis order, including its reverse-lexicographic member
ordering for ties. Floor and Java signed-int saturation produce the displayed score.

The shared Redis instance uses these keys:

| Key                                                     | Type and content                                                                                                                                               |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `opencok:global:expedition-match:<realm>`               | String JSON with integer `serverId` matching the realm and integer `matchServerId`. A negative match ID means unmatched; zero and malformed identities reject. |
| `opencok:kingdom:<lower-realm>:expedition-ranking`      | Sorted set of player UID members and expedition scores. The lower realm is the minimum of the two paired IDs.                                                  |
| `opencok:kingdom:<lower-realm>:expedition-ranking-info` | Hash from player UID to JSON containing `name`, `pic`, `picVer`, `abbr`, `serverId` and signed-64-bit `power`.                                                 |

The metadata decoder preserves integer lexemes before converting to SFS values;
large power values never pass through JavaScript number rounding. Only the public
fields above reach the client; UID, rank and score come from the selected entry and
cannot be overridden by metadata. Each metadata value is limited to 65,535 bytes,
and the selected payload to 1 MiB. The adapter rechecks the pairing and reads scores
and metadata in one read-only Lua evaluation. A changed pairing retries once, then
rejects continued churn. This gives a coherent board instead of the legacy sequence
of separate reads. Dependency failures reject rather than masquerading as absent data.

Existing authoritative expedition state needs a controlled import into these keys;
the reader does not fall back to legacy keys, create matches, update scores, clear
old boards or settle events. Event writers/importers must keep pairing and board
contents consistent, including resetting data when the lower realm is reused for a
new match. Synthetic units inject Redis command results and inspect the script contract;
Lua execution against Redis, real service availability and client rendering remain
unverified in this phase.

## Mailbox category status

`mail.category.status`, tracked in [issue #64](https://github.com/ReeseArch64/opencok/issues/64),
returns total and unread counts for the authenticated recipient. Without `category`,
it returns eight numbered objects with SFS integer counters. With an integer category
from 1 through 8, it returns `total` and `unread` as SFS longs. Unknown integer categories
produce the shared success acknowledgment; malformed wire types reject. Correlation
fields are retained, and client UID/recipient parameters never select another mailbox.

The combined view assigns system, announcements, events, messages, alliance, battle,
moderation and bottle types to their legacy categories. Title `115429` overrides the
combined category to alliance, even for an otherwise unmapped type. Alliance-gift
messages appear under alliance in the combined view, while both system and alliance
single-category queries include that type. Single-category queries do not apply the
title override. Combined counts retain signed 32-bit wrapping; selected-category counts
retain signed 64-bit precision. Invalid stored statuses fail the combined view when
the message belongs to a category, but selected-category counts ignore statuses other
than unread/read, matching the reference's distinct paths.

The repository reads the requester and aggregates only that recipient's mail within
one read-only repeatable-read transaction. It selects type, normalized status, a
special-title flag and count; message contents, reward payloads and sender data are
not loaded. SQL null status follows the legacy model's unread default. More than
32,767 aggregate groups rejects with a sentinel instead of truncating. Missing/banned
owners and unknown categories skip the mail query. Dependency failures reject instead
of the reference's fallback to empty combined counters. The mail table is checked at
startup. This command does not mark, save, delete or redeem messages. Verification
uses synthetic unit fixtures only.

## Mailbox saving

`mail.save`, `mail.cancel.save` and `mail.save.batch`, tracked in
[issue #65](https://github.com/ReeseArch64/opencok/issues/65), persist saved flags in
the selected realm. Single commands require a string `uid` identifying the message
and an integer `type`; the latter is validated but does not select the message type.
Saving changes null, zero or negative flags to 1 and returns `save: "success"`.
Cancelling changes nonzero flags to 0 and returns `cancel: "success"`. Missing,
foreign and already-set messages return the shared `success: true` acknowledgment.
Neither command changes read status, message contents, attachments or balances.

Batch requests use comma-separated string `uids` and integer `flag`. Exactly 1 saves;
every other integer cancels. Empty segments are ignored, IDs are not trimmed, and
duplicates collapse after checking the maximum of 1,000 nonempty segments. Empty or
Java-whitespace-only input acknowledges without writes. Nonempty batches return
`save: "success"` even when no owned messages match. IDs are limited to 40 UTF-16 code
units and the input string to 65,535 UTF-8 bytes; NUL and invalid Unicode reject.
These explicit bounds replace unbounded legacy batches. Correlation fields are echoed.

The repository locks the authenticated owner profile in a read-write, read-committed
transaction and checks identity, realm and bans before updating mail. Every mutation
includes the recipient in its SQL predicate. Single writes apply their flag condition
atomically; batch writes include every matched owned row, even if its flag is unchanged.
Only returned message IDs receive update markers. This intentionally tightens the
reference's ID-only mutations and marker creation for arbitrary requested IDs.

The additive kingdom migration `0003_mail_update_markers.sql` creates `mail_update`,
keyed by recipient and message, with an owner/time index. Flags and markers commit
together; failure rolls back both. Marker upserts retain the greater timestamp when
requests arrive out of clock order. PostgreSQL supplies durable synchronization state
under ADR-0002/0005, replacing the legacy non-atomic Redis marker write. The marker
has no mail foreign key so future deletion synchronization can retain tombstones.
Synchronization consumers and cleanup are still pending; this slice does not emit
mail pushes or claim reconnect synchronization is complete.

Apply the additive migration to every kingdom before running this version; startup
checks the new table. Migration generation and schema snapshots were checked locally,
but no database migration or real PostgreSQL execution was performed. Existing mail
rows are retained. A binary rollback can leave the unused additive table in place;
do not discard markers needed for a later synchronization rollout. Repeated absolute
assignments are state-idempotent without intervening changes; `_cok_` is correlation,
not a durable receipt, so delayed retries after an opposite assignment follow arrival
order. No new library or external service is required.

Synthetic unit tests cover wire types, result strings, ownership predicates, profile
locks, flag conditions, repeat requests and rollback on update/marker/commit failure.
They do not prove PostgreSQL concurrency or native-client behavior. Remaining content
edge cases, category/conversation deletion, `chatMail.read` and synchronization
remain pending; reward redemption is outside this wave.

## Mailbox read status and gift opening

`mail.read.status` and the legacy-spelled `mail.read.status.betch`, tracked in
[issue #66](https://github.com/ReeseArch64/opencok/issues/66), mark owned messages as
read. The individual command requires string `uid` and integer `type`; the type value
does not filter mail. Only status 0 or SQL null transitions to 1. Batch requests use
comma-separated string `uids` and assign status 1 to every matched owned message,
including already-read or nonstandard statuses. They share the saving commands' ID
and input bounds. Empty batches, absent mail and unchanged individual requests return
the common `success: true` acknowledgment with correlation fields. Reading contents
is a separate command, and these mutations never change saved flags or redeem rewards.

Both commands lock and authorize the local owner profile, then commit recipient-scoped
status changes and durable `mail_update` markers together. Individual transitions of
gift type 28 also insert an immutable `mail_gift_opening` record, keyed by mail ID and
the original signed-64-bit creation time. The record contains only the recipient and
opening time. Repeated events cannot replace its original values. Batch marking never
produces gift-opening events, matching the reference; individually marking a gift
already read by a batch therefore does not create an event either.

The additive kingdom migration `0004_mail_gift_openings.sql` supplies this outbox and
its oldest-first index. Apply pending migrations to every kingdom before running this
version. Startup verifies the outbox and required global `mail_gift_log` columns.
The migration was generated and structurally checked without execution; all existing
table definitions and rows are preserved. No new dependency is required.

After database readiness, a scoped relay processes up to 100 pending records per pass,
using `FOR UPDATE SKIP LOCKED` in a realm transaction. A separate global transaction
sets `isOpened = 1` and `receiveTime` to the event's opening time, matching mail ID,
send time and recipient. It never inserts a missing global log or changes reward/thanks
flags. Missing or foreign logs are no-ops and their pending records are acknowledged,
matching the reference's missing-log behavior while tightening ownership checks.
Only after global commit does the relay remove the locked realm records. There is
no cross-database atomicity: failure or a crash before realm acknowledgment leaves
records available for replay, which writes the same values again.

Passes run immediately on startup and then five seconds after each completion or
failure. One process never overlaps passes; other processes skip locked records.
The existing database query timeouts bound individual operations. Failures emit only
the `mail_gift_relay_failed` event and kingdom number, retaining pending entries for
retry. Shutdown cancels the next timer and awaits the active pass before the database
is closed. Gift-log delivery is asynchronous and does not gate a mailbox acknowledgment;
this deliberately replaces the reference's synchronous best-effort update with durable
retry. Pending records survive mail deletion, which is why no mail foreign key is added.

Synthetic units cover individual/batch differences, gift/null/invalid statuses,
owner/realm checks, atomic rollback, full-width timestamps, global commit ambiguity,
acknowledgment failures, missing logs, repeat delivery, bounded scheduling and shutdown.
They use fake SQL clients and an injected scheduler, without sockets, real services,
applied migrations, integration/E2E or ADB. Real PostgreSQL lock/concurrency behavior
and client rendering remain unverified. Content/list reads, category/conversation deletion, chat-mail variants
and synchronization readers/marker cleanup still need migration.

## Ordinary mailbox deletion

`mail.delete`, tracked in [issue #67](https://github.com/ReeseArch64/opencok/issues/67),
accepts string `uids` containing comma-separated message IDs. Empty segments are
ignored and duplicate IDs collapse; whitespace inside an ID remains significant.
The input is limited to 65,535 UTF-8 bytes, 1,000 nonempty segments and 40 UTF-16 code
units per ID, with invalid Unicode and NUL rejected. Optional `num` must be an SFS
integer but has no effect, matching the reference's unused argument. `types` likewise
has no effect on this ordinary command. The response is `delete` as an SFS integer
containing the actual removed-row count, including zero, plus correlation fields.

A read-write transaction locks and authorizes the recipient profile before deleting
only owned messages whose persisted `saveFlag` is exactly 0 and `rewardStatus` is
nonzero. Null, positive and negative nonzero saved flags remain protected, as in the
reference SQL; no attachment redemption occurs. Missing or foreign IDs do not affect
the result. Related cleanup operates only on IDs returned by the deletion. Contents
with an explicit different recipient remain untouched; empty/null auxiliary owners
are accepted only for these already-authorized message IDs. Deleted IDs receive
durable `mail_update` tombstones with nondecreasing timestamps. Pending gift-opening
events remain available to the relay after their original mail is removed.

The cleanup policy preserves the reference's group families. Single-message groups
are removed by owner, type and message ID. Personal groups use types 20–22 from one
sender; moderation deletion accepts types 23, 24, 39 and 40, but its remaining-message
lookup uses only 23–24, matching the reference. Resource, trade and monster groups
use types 5, 10 and 18 respectively. Existing grouped timestamps update to the latest
remaining creation time, preserving bigint precision; exhausted groups are removed.
Missing groups are not created. Personal media/express types do not trigger group
cleanup in this command, following the concrete legacy comparator behavior.

Deleted move-invitation messages (type 26) can invalidate the matching inviter/recipient
pair. The controller decodes inline UTF-8 JSON or the case-insensitive `extra` sentinel
resolved through persisted `mail_contents`. Only string inviter IDs and an invitee
equal to the authenticated owner authorize this cleanup. Invalid/missing metadata is
ignored, following the reference's best-effort invitation handling. Each JSON payload
is bounded to 65,535 bytes; extra rows above this bound do not supply invitation data.
Aggregate loaded invitation metadata above 8 MiB rejects and rolls back the command.
Legacy Redis-only extra payloads must be imported into authoritative `mail_contents`
before cutover; this command does not contact the legacy cache.

Deletion, auxiliary cleanup, tombstones, group maintenance and valid invitation
invalidation commit or roll back together. This intentionally corrects the legacy
helper's removal of auxiliary contents and group state for messages retained by its
own deletion predicate. It also adds recipient checks and preserves explicitly foreign
auxiliary rows. The reference's result count and actual deletion protection are retained.
SQL failures reject the command instead of leaving partial cleanup. No schema or library
change is needed; startup checks the existing contents, group and invitation tables.

Synthetic units cover protected/null/nonstandard flags, duplicate and foreign IDs,
group/media distinctions, full-width timestamps, inline/extra invitations, request and
metadata bounds, and rollback at each cleanup stage. They do not exercise a real
database, concurrent writers, client or ADB. `mail.delete.batch`, category/label
deletion, chat-conversation deletion, content edge cases and synchronization readers
remain separate unfinished portions of topic 4.

## Conversation and type mailbox saving

`chatMail.save`, tracked in [issue #68](https://github.com/ReeseArch64/opencok/issues/68),
sets the saved flag for the authenticated recipient's conversation or exact message
type. A present string `fromUser` takes precedence over `type`; empty senders remain
valid selectors. With `mod` equal to 1, sender selection covers moderation types 23
and 24; every other integer selects personal text types 20, 21 and 22. Media and
drifting-bottle messages are excluded from sender selection. Without `fromUser`, an
integer `type` maps client values 0, 1, 4, 10, 14 and 21 to stored values 21, 22, 7,
14, 12 and 10 respectively; other values select their exact stored type.

The selected branch requires an integer `flag` and preserves its full signed 32-bit
value, including negative and nonbinary values. Without either selector, the command
acknowledges without writes and ignores `flag`. Optional `mod` defaults to 0 and is
always validated. Fields ignored by the selected branch do not affect the request.
Sender strings are bounded to 40 UTF-16 code units and reject NUL or invalid Unicode.
The shared empty-result response supplies `success: true` and correlation fields.

The repository locks and validates the owner profile, then updates all matched owned
rows with one statement in the same realm transaction. Conversation size is not
truncated, and message contents are never loaded. SQL failures roll back the operation.
Like the reference command, this path writes no synchronization markers and changes
no read state, rewards, groups or chat-service state. No schema, dependency or service
is added. Absolute flag assignments retain the existing arrival-order retry semantics.

Synthetic unit tests cover wire validation, selector precedence, all type mappings,
raw flag extremes, unauthorized profiles, recipient isolation, 1,500-message
conversations and transaction failures. Real PostgreSQL execution, concurrency and
native-client behavior remain unverified. `chatMail.read`, conversation deletion,
content edge cases and synchronization flows remain pending.

## Conversation read persistence

[Issue #73](https://github.com/ReeseArch64/opencok/issues/73) tracks `chatMail.read`.
Its complete wire parser and ordered effect planner now have synthetic unit coverage.
An independent repository adapter now persists owned mailbox assignments and chat
intents atomically. The command still returns unsupported: enabling it requires durable
chat intent delivery and a maintained private-conversation read-state consumer. The
current chat room history implementation does not supply that consumer. The parser and
planner remain pure; the adapter is not connected to command dispatch.

| Selection                                   | Mailbox assignment                                                   | Chat intent                                                              |
| ------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `fromUser`, `mod = 1`                       | Exact sender, types 23/24, status exactly 0 to 1                     | Same raw peer string, chat type `2`                                      |
| `fromUser`, other mod, `driftingBottle = 1` | Exact sender, types 43/44, all statuses to 1                         | Same raw peer string, chat type `3`                                      |
| `fromUser`, other modes                     | Exact sender, types 20/21/22, status exactly 0 to 1                  | Same raw peer string, chat types `1,20`                                  |
| No sender, `type`                           | Exact mapped type across senders, status exactly 0 to 1              | None                                                                     |
| Additional `types` list                     | One mapped-type assignment per nonempty token, status exactly 0 to 1 | Exact raw `0,1,20` additionally emits empty peers with chat types `1,20` |

Sender presence takes precedence over scalar type; moderator mode takes precedence over
the bottle flag. `mod` defaults to zero and is always validated. Scalar type is not
read when sender is present, and the bottle flag is not read without sender or in
moderator mode. The `types` string is independent and always consumed when present.
Duplicate list entries and effect order are retained, including targeted chat intent
before list assignments and the optional final all-peer intent. An empty request or
empty/comma-only type list has no effects.

The shared inverse type mapping is `0→21`, `1→22`, `4→7`, `10→14`, `14→12`, `21→10`;
other signed integers remain unchanged. List parsing follows Java 8 signed decimal
rules, including supported BMP digit families, leading zeros and ASCII signs. It does
not trim whitespace or interpret hexadecimal, octal or exponents. Empty comma tokens
are discarded. Equivalent numeric spellings, reordered entries or added commas do not
activate the exact raw-string chat trigger.

Empty, blank and comma-containing sender strings retain their bytes. A present null
sender remains null in the mailbox predicate, while the chat intent preserves the
source string-builder result `null`. The empty peer string used by an all-peer intent
is distinct from that literal. These raw intent values are retained for the future
consumer; this stage does not invent private-chat room IDs or silently drop events
when mailbox assignments match no rows.

Consumed sender strings are bounded to 40 UTF-16 units and reject NUL/invalid Unicode.
The raw type list is bounded to 65,535 UTF-8 bytes and 1,000 nonempty tokens; extra commas
do not count as operations. The whole request is validated before any plan returns,
preventing the reference's earlier partial writes before a malformed trailing token.
No mailbox synchronization marker, reward, saved flag, group or auxiliary cleanup
belongs to this plan.
The adapter retains SQL status-exactness: personal/moderator/type updates do not
reinterpret null status as zero, while bottle assignments include null status. A present
null sender uses SQL equality with null, matching no rows; its chat event still persists.

Persistence locks the owner profile in a kingdom-local read-committed transaction and
checks recipient, realm and ban state before writing. It copies and validates the plan
before asynchronous work. Mail assignments compile to a single owner-scoped union
update, with no body reads or truncation of affected messages. The same transaction
inserts immutable `mail_chat_read_intent` records even when no mail row changes. Each
invocation has a fresh UUID; original effect positions distinguish its chat events and
retain their order. These identities support future delivery retries, not deduplication
of separate command invocations. Repeating a request can enqueue another event.

Owner-serialized admission allows at most 1,000 pending chat intents per player; an
overflow rejects before mail updates. Type-only and empty plans need no backlog query.
Chat intent insertion failure rolls back mailbox changes. The additive kingdom migration
`0005_mail_chat_read_intents.sql` has been generated, not applied. Preserve pending rows
across application rollback. Future delivery must define peer interpretation, ordering,
idempotency and acknowledgment before enabling this command. Public chat history cannot
substitute for private conversation read state.

Tests cover precedence, ignored/invalid wire fields, null and empty sender behavior,
integer boundaries, raw-list triggers and limits. Frozen synthetic vectors generated
with an isolated Java 8 integer probe verify 410 parsing cases; maintained tests need
no Java runtime, private source or server process. SQL driver fakes verify exact
predicates, owner/realm isolation, large selections, bounded backlog, durable intent
identity, captured plans and rollback. These units do not prove real database concurrency
or resolve commit acknowledgment loss. Delivery, cross-database recovery and chat
read-state integration remain pending.

## Mailbox content reads

`mail.read`, tracked in [issue #69](https://github.com/ReeseArch64/opencok/issues/69),
reads pipe-separated string `uid` values and requires a string `type` field that is
otherwise ignored. Stored message types control decoding. Empty pipe segments are
ignored, IDs remain untrimmed and duplicates collapse. Requests require at least one
ID, at most 1,000 nonempty segments, 40 UTF-16 units per ID and 65,535 UTF-8 bytes in
the selector. NUL and invalid Unicode IDs reject. Missing and foreign IDs are omitted.
The response contains `result: Array` with correlation fields and does not mark mail
read, save it or grant attachments.

Plain message types retain text with literal backslash-n sequences converted to newlines.
Structured types use the independently authored permissive stored-JSON decoder: signed
32/64-bit integer widths, doubles, single quotes, unquoted keys, comments, alternate
separators, octal/hexadecimal integers and repeated-property accumulation are retained.
Numeric parsing follows Java 8 BMP digit classification, including Unicode decimal
digits after an ASCII numeric prefix and fullwidth hexadecimal digits. Hexadecimal
floating-point literals round to binary64 with ties to even, including subnormal
boundaries, overflow rejection and signed zero. Integer overflow falls through to the
legacy long/double/string alternatives rather than wrapping. Frozen synthetic oracle
vectors cover 459 numeric inputs without loading Java libraries during maintained tests.
The decoder also preserves default excluded properties and the legacy distinction
between immediately quoted JSON strings and strings following whitespace. JSON-looking
strings in arrays retain the reference's extra quote characters. Function-shaped values
are parsed as data and never executed. Retained function values and array holes cannot
be converted to SFS and make structured mail malformed; the same forms in discarded
properties do not invalidate the message. Function headers follow the reference's
special property-exclusion behavior. Escaped isolated UTF-16 surrogates use Java's UTF-8
replacement byte, while valid pairs and signed/Unicode hexadecimal escapes are retained.
An additional 144 frozen synthetic structural vectors exercise those distinctions. Combat
reports convert old helper maps to arrays and remove general skill/ability fields;
scout reports filter five obsolete ability IDs. Helper arrays follow the reference's
Java 8 ConcurrentHashMap traversal after request-local JSON decoding. Parsed insertion
history is retained even for numeric-looking keys; resize prefix reversal, collision
resizing, tree-bin head insertion and tree/list splits are modeled without introducing
concurrency. Frozen order fixtures and large-object digests cover this behavior through
the existing 32,767-key decoder limit. Old plain scout reports remain text.
Each result overrides `createTime` and `u` from storage, clears `contentStr` and carries
the original trimmed content in 5,000 UTF-16-unit `contentsArr` chunks. A surrogate pair
split across chunks uses the legacy UTF-8 replacement byte in each chunk.

The realm repository locks the authenticated owner and selected mail rows in a
read-write repeatable-read transaction. Recipient predicates protect every read and
removal, correcting the reference's ID-only lookup. A metadata-only query checks a
4 MiB aggregate inline-plus-extra budget before loading payloads. Results use ascending
UID with C collation; the reference query specifies no order. Extra SQL rows must
belong to the recipient or retain a historical empty/null owner. Missing or explicitly
foreign extra content rejects the request. Import legacy cache-only content into SQL
before cutover; an unavailable payload is not treated as corrupted mail.

Malformed structured content and invalid old helper-array shapes are omitted and the
corresponding owned mail rows are removed, including saved or reward-pending rows as
in the detail reader. This path deliberately does not run ordinary deletion policy:
auxiliary contents, group pointers, synchronization markers and reward state are not
changed. Projection and complete correlated SFS encoding run before any removal, so
storage, byte/depth/item limits or serialization failures roll back all changes.

Complex/numeric-double object keys remain unfinished and reject the whole request
without deleting mail. Keys that collide after UTF-8 surrogate replacement also reject
without removal, avoiding duplicate wire keys. The remaining key-format gap and
explicit rejection policies remain tracked under #69; this implementation is not proof
of complete content parity. No new schema, dependency, translation provider or external
service is introduced.

Synthetic units cover all 50 stored type ordinals, precise integer boundaries,
permissive decoding, report repairs, chunks, malformed-message removal, ownership,
extra-content rules, capacity and transaction failures. No real database, concurrent
writer, socket, native client or ADB was exercised. Group list queries are documented
below; `chatMail.read`, conversation deletion and synchronization consumers remain pending work.

## Category mailbox listing

`mread.batch.category`, tracked in [issue #70](https://github.com/ReeseArch64/opencok/issues/70),
accepts required integer `category`, `num` and `offset` fields. Optional `fromUser` must
be a string but does not filter results. The authenticated recipient and configured realm
control the query; request-supplied owner/realm fields grant no access.

Selection consumes a newest-first prefix of the owner's entire mailbox. The reference
breaks immediately for positive `num`; otherwise the prefix length is the positive
signed-32-bit result of `num + offset`. Filtering happens after this window, so skipped
categories still consume positions. Invalid categories acknowledge without a result
array; valid empty windows return an empty result array. Category 1 excludes title
`115429`, category 5 includes that title regardless of type, and type 34 belongs to both
categories for ordinary titles. Windows above 1,000 actual rows or 4 MiB of inline/extra
bodies plus reward descriptors reject instead of silently truncating. Metadata bounds
these values before bodies are loaded. Create-time descending order follows the reference;
ascending UID with C collation resolves unspecified timestamp ties deterministically.

Ordinary list entries contain the stored identity, client type mapping, reward descriptor,
status/save/item flags, reply bits and a nested decoded `detail`. Database-backed entries
use transient `mbLevel` zero. Upgrade notices preserve their version default. Combat
previews add attacker/defender or NPC presentation and win/loss/draw when their required
fields are valid; failure to build a preview does not invalidate otherwise valid detail.
Categories 4 and 7 use chat-shaped content with the recipient's update marker. Category 8
bottle messages retain the ordinary envelope. List detail does not acquire the content
reader's raw chunks or metadata overrides; existing stored fields remain intact.

Sender projection preserves current and historical names, string portrait versions and
optional alliance abbreviations. A supplied sender without a portrait rejects the result,
as the reference's string setter rejects null; it does not authorize malformed-mail
cleanup. The sender lookup allowlist is distinct from category membership. Public sender
metadata comes from the global account directory, with a local-realm fallback only for
missing routes. Only configured player realms are read. Unlike public numeric-player
queries, sender IDs retain moderator suffixes and other stored identifiers. Local profiles
and alliance abbreviations share the mailbox snapshot; remote public profiles use separate
read-only repeatable-read transactions. Missing profiles retain stored sender names;
unconfigured realms, failed lookups or mismatched identities reject the query. These
snapshots do not provide cross-database atomicity during account moves.

Optional translation presentation applies only to personal/moderator text types 22 and
24 when enabled and sender language is not null. Missing sender metadata uses the
reference's empty-language fallback. Language aliases, the allowlisted target language
and pipe-separated translation IDs follow the reference. Missing translations preserve
original text and any nonblank translation ID. The existing kingdom `translationv2` table
supplies only requested IDs and allowlisted target-language columns, deduplicated per
language. Stored translation whitespace is preserved. Metadata checks a separate 4 MiB
aggregate translation budget before body retrieval. Translation reads share the local
snapshot; capacity and storage errors reject rather than masquerade as absent records.
`GAME_MAIL_TRANSLATION=false` disables this presentation and these reads. Configuration
is read at startup, so changing the flag requires restart.

External machine translation is unavailable: a missing/blank/invalid-UTF-8 stored value
retains the original text. This is the explicit unavailable-provider fallback; the legacy
service could generate and cache a new translation for a blank existing cell. No publisher
credentials or external endpoint are reused. Import required translations before cutover
or implement a separately configured provider. The recipient's update marker comes from
the existing realm-scoped player-update service, with an empty string for no stored marker;
a service error rejects the response.

The content decoder is shared with `mail.read`. Malformed structured entries produce a
removal plan only after the entire correlated response encodes successfully. Unknown
stored types, missing extra bodies, unresolved decoder forms, capacity failures and
foreign/duplicate entries reject without returning a plan. The repository locks the owner
and selected rows in a read-write repeatable-read transaction. Only returned, owned primary
mail IDs can be removed; saved/reward-pending corrupt entries follow the same cleanup rule
as detail reads. Auxiliary bodies, groups, read/save/reward flags and synchronization
markers are unchanged. Missing or explicitly foreign extra bodies reject without removal.
The fully wrapped extension response, including correlation, is encoded before removal;
`mail.read` now checks this transport envelope too, preventing an additional-depth failure
after committing cleanup. Projection, sender, marker, translation, deletion and commit
failures roll back the transaction. Startup checks the existing translation table.

Synthetic unit fixtures cover category memberships, arithmetic boundaries, both envelopes,
names, routing, translations, ownership, preview outcomes, limits and rollback. An injected
SQL client exercises the command through the production repository without opening a
connection. No client, ADB, database, service or integration test was used. Conversation
operations, synchronization and the documented decoder cases remain pending; this
command does not complete topic 4.

## Paginated mailbox and conversation reads

`mread.batch` and `mread.chat`, tracked in
[issue #71](https://github.com/ReeseArch64/opencok/issues/71), share the selectors below.
Both require integer `num` (start) and `offset` (page size). `mread.batch` also requires
integer `type`; `mread.chat` defaults an absent `type` to selector `4` for personal
conversations. A present type must be an integer: null, strings and
other wire widths do not activate its default. Explicit types can select ordinary
messages, other conversations, either group family or the unknown-selector empty result.
`fromUser` may be absent/null for selectors that do not use it;
a supplied non-null value must be a string. Personal and moderator lists require a
nonblank sender, preserving the reference `E000000` invalid-operation response when
missing. Consumed sender IDs retain whitespace, must fit 40 UTF-16 units and reject NUL
or invalid Unicode. Unused sender strings do not constrain the query.

| Request type | Stored message types | Response shape                                                 | Sender filter                                          |
| ------------ | -------------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| 2            | 14, 15, 16           | Ordinary envelope with detail                                  | None; this is a notice family, not the saved flag      |
| 3            | 13                   | Ordinary envelope with detail                                  | None                                                   |
| 4            | 20, 21, 22           | Conversation                                                   | Required exact sender; media types excluded            |
| 5            | 5                    | Conversation with structured resource content                  | None                                                   |
| 6            | 6, 7, 8, 9           | Ordinary envelope with detail                                  | None; broader battle-category types are excluded       |
| 7            | 18                   | Conversation with structured monster content                   | None                                                   |
| 8            | 10                   | Conversation with structured trade content and portrait fields | None                                                   |
| 9            | 23, 24               | Conversation                                                   | Required exact sender; moderation media types excluded |
| 11           | 32                   | Ordinary envelope with detail                                  | None                                                   |

Filters precede pagination. Negative starts clamp to zero, zero-size pages are empty,
and negative sizes reject before storage. Unknown selectors return an empty `result`
array even if their unused page values are negative. Group selectors `10` and `1000`
use the separate group reader documented below, with nonnegative starts and whole-group
counts rather than message-page semantics.

Conversation projection overrides content identity/type/time and adds the recipient
update marker, but does not append the category reader's `fromUser`, `status` or name/
portrait fields. Fields already stored inside structured content remain present. Trade
messages add current/historical sender names, portrait version and optional alliance as
in the reference serializer. Personal/moderator text uses the shared persisted optional
translation path and its configuration; external machine translation remains unavailable.

Both listing commands share the owned repeatable-read transaction, row locks, bounded
metadata/body loading and response serializers. Actual selected pages above 1,000 rows
or 4 MiB of bodies/extra content/reward descriptors reject before body retrieval. Large
requested limits are not silently truncated. Ordering uses create time descending, then
UID/C for unspecified ties. Snapshot ownership, extra-body ownership, wrapped-response
encoding and validated removal IDs follow the category reader's boundaries.

Malformed structured content in ordinary envelopes is omitted and its primary mail row
can be removed after the complete response validates. Structured conversation content
(resource, monster and trade) instead rejects without removal: the reference chat helper
fails before reaching its caller's null-removal branch. The port preserves that outcome.
No read/save flags, rewards, auxiliary rows, group state or synchronization markers are
changed by the message-list path. Failures before commit roll back; a lost commit
acknowledgment can leave the valid primary-row cleanup committed, so correlation is not
a durable receipt. Repeating the read does not grant rewards or change read/saved flags.

Synthetic units exercise all selectors, paging, field differences, sender/translation
behavior, owned SQL predicates, capacity, invalid removal plans, commit failures and the
production command/repository path using an injected SQL client. Category-list regression
coverage remains in place after extracting the shared boundary. No ADB, native client,
real database/service/socket, integration/E2E or remote CI was run. The group-selector
coverage is documented below. Both command names reach the same owned storage paths;
the actual requested name is used for full response encoding before cleanup, including
transport-size boundaries and correlation fields. `mread.chat` fetches content without
marking conversations read. The separate `chatMail.read` status/chat-service operation
remains pending. Topic 4 remains incomplete.

## Group mailbox listing

`mread.batch` and explicit `mread.chat` types serve ordinary groups with selector `1000`
and moderator groups with selector `10`, tracked in [issue #72](https://github.com/ReeseArch64/opencok/issues/72).
The command, pure projection and repository transaction are connected and verified
with synthetic unit doubles. The authenticated recipient and configured realm select
the mailbox; request-supplied owner/realm fields grant no access. Optional `fromUser`
may be absent/null or a string and does not filter group queries.

The group query preserves nonnegative integer start/size values without the message
reader's negative-start clamp. Ordinary windows contain group types below 500;
moderator windows contain type 500 only. Storage orders by update time descending, then
group type and group index/C for unspecified ties, and applies start/size before
processing. The complete bounded window determines sender lookup IDs, while only the
first seven groups receive previews, output or cleanup.
Unknown/empty groups consume a slot; later groups do not refill those holes.

| Group type                                | Matching stored mail types                                | Response content | Preview ordering                     |
| ----------------------------------------- | --------------------------------------------------------- | ---------------- | ------------------------------------ |
| 100                                       | 20, 21, 22, with exact sender                             | `chats`          | Newest seven, displayed oldest first |
| 500                                       | 23, 24, with exact sender                                 | `chats`          | Newest seven, displayed oldest first |
| 200                                       | 5                                                         | `collect`        | Newest seven, newest first           |
| 300                                       | 18                                                        | `monster`        | Newest seven, newest first           |
| 400                                       | 10                                                        | `collect`        | Newest seven, newest first           |
| 2, 11, 12, 17, 25, 26, 27, 28, 29, 33, 34 | Any of these single-message types, with exact message UID | `detail`         | One message                          |

Single-message membership permits a different stored type from its group key if both
belong to that family. Type-group indexes do not filter messages. Moderator media types
39/40 remain excluded by the effective source query. All supplied messages must belong
to the authenticated owner, including single-message lookups. Sender resolution uses
group indexes, not the generic mail-list sender classifier, so a sender group beyond
the first seven can enrich an earlier trade or single-message root.

Each root uses the newest matching message's ordinary envelope, including its actual
create time rather than the group's update time. Conversation/type roots add integer
`totalNum` and `unread` counts for the whole group. The snapshot contract carries those
counts separately from the bounded newest-seven bodies. SQL aggregates the complete
matching set without loading historical bodies or joining auxiliary content. The
bounded preview is then read in descending create-time order, with UID/C ties. Preview messages reuse the existing
conversation serializer, update marker and persisted optional translation behavior.
Single-message roots always report both group counters as zero, even for unread mail.

Unknown or empty processed groups produce group-key removal plans. Invalid structured
single-message detail keeps its root envelope without `detail` and plans only primary
mail removal, even when saved or reward-pending; it does not remove that group in the
same response. Malformed structured conversation previews reject the request instead.
If no sender profiles resolve and a processed sender group exists, the projection
preserves the reference failure without returning cleanup. If another sender resolved,
a missing sender's empty group can be removed. Missing extra bodies and unrepresentable
content remain failures, not invalid-content cleanup.

Bounds are 1,000 actual groups in a requested window, seven processed groups, seven
preview messages per conversation/type group, and 4 MiB aggregate raw preview bodies,
extra content and reward descriptors. Counts must be nonnegative signed 32-bit values;
larger totals reject rather than emulate integer-overflow-dependent preview iteration.
The projection validates count/preview consistency, membership, ordering, ownership,
duplicate keys and the complete correlated extension packet before returning any plan.
The repository locks the owner profile and group window in a read-write repeatable-read
transaction. Domain rules request at most one preview for each processed group through
a scoped reader; metadata and a running byte budget bound each subsequent body read.
Only owned/blank/null auxiliary-owner records can supply extra content. Sender routing,
public profiles and persisted translations reuse the existing readers; the whole group
window's resolved sender map is reused for membership and presentation, without a second
generic sender lookup. External machine translation remains unavailable.

After complete response encoding, the repository independently checks unique cleanup
keys against the processed page and primary-removal IDs against owned single-message
previews. It deletes only those primary mail rows and group keys in the same transaction.
Saved/read flags, rewards, auxiliary content and synchronization markers are untouched.
Failures before commit roll back all cleanup, including earlier valid plans; this avoids
the reference's partial cleanup before later projection failures. A lost commit
acknowledgment can still leave cleanup committed: correlation is not a durable receipt.

Synthetic units exercise the production command/repository path with an injected SQL
client, without a database connection. Coverage includes complete counts, ordering,
window-wide sender resolution, moderation-media exclusion, translation gates, empty and
unknown groups, ownership, capacity, inconsistent snapshots, invalid plans and failure
rollback. These tests do not prove real concurrent database behavior or client rendering.
No ADB/native client, service/socket/database startup, integration/E2E, applied migration
or remote CI was run. Content edge cases, conversation/batch deletion and synchronization
still prevent declaring topic 4 complete.

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

Task reward descriptions have a pure rules implementation and typed SFS serializer.
It preserves resource ordering, weighted item draws, repeated-item aggregation and
display ordering, equipment classification, military feature gates and prestige values.
The random source is injected and validated; this path only constructs descriptions
and performs no grants. Reward resources retain the final definition of duplicate IDs,
matching the legacy cache. Quantity calculations preserve signed 32-bit wrapping and
the legacy float conversion in guaranteed groups. Grouped item and prestige ordering
uses the existing bounded Java hash traversal helper, with its documented exceptional
limits. Task visibility, discovery, completion writes and their pushes still need to
use these descriptions before the reconnect task component is complete.

| Topic                                     | Implemented evidence                                                                                                                                                                                                                                                                | Remaining work                                                                                                                                            |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Configuration and feature availability | Settings and data-config queries; deferred-login configuration; feature announcements and account-specific eligibility; grouped XML; timed star previews; synthetic unit and adapter tests                                                                                          | Native-client and real-service validation remain deferred. Services outside this wave (bosses, commerce and account switching) stay unavailable.          |
| 2. Player/progression queries             | Initial player DTO; public summary batches; full ordinary-realm public-profile read command; detailed-power command with modifier composition and unit tests                                                                                                                        | Full own/reconnect behavior; documented read-versus-write differences, exceptional-state limits and authoritative global-state import.                    |
| 3. Ranking queries                        | Ordinary-realm player power, kills, level, castles and contributions; alliance power/kills and paired expedition reads; self positions, capacity/video presentation and synthetic unit coverage                                                                                     | Event and cross-realm families; pagination where supported; documented cache, collation and exceptional-state differences.                                |
| 4. Basic mailbox                          | Category counts; saving/read marking; conversation/type saving; category/paginated message lists and bounded content reads; gift-opening retry; ordinary deletion with atomic related cleanup; group listing with bounded previews, full counts and atomic cleanup; synthetic units | Content edge cases, batch/category/conversation deletion, conversation read marking and synchronization readers/cleanup; redemption is outside this wave. |
| 5. Additional map queries                 | Base viewport                                                                                                                                                                                                                                                                       | Point details, player search and favorites, including authorization for writes.                                                                           |
| 6. Profile/preferences                    | Initial profile reads                                                                                                                                                                                                                                                               | Nicknames, validation, applicable costs, flags and persisted preferences.                                                                                 |
| 7. Avatar integration                     | Standalone files service                                                                                                                                                                                                                                                            | Realm grants, confirmation and profile updates.                                                                                                           |
| 8. Basic chat integration                 | Standalone chat service                                                                                                                                                                                                                                                             | Realm session issuance and game-facing configuration. Native-client validation remains deferred by request.                                               |

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
