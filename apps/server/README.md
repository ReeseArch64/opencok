# Experimental realm server

This is the first migration slice of the working Bun `apps/new-server` proof of
concept. It preserves the mobile **12.06.0** SFS binary protocol and adapts its
login, city bootstrap and world reads to the existing PostgreSQL Drizzle models.
The runtime requires Bun 1.4.2 and the workspace layout.

Implemented commands: `cmd.finishinit`, `cmd.ping`, `chat.session.create` (when configured), `login.dataconfig`,
`login.other`, `setting.xml`, `get.user.info.multi`, `get.user.info`, `get.power.info`, `mail.category.status`,
`mail.save`, `mail.cancel.save`, `mail.save.batch`, `chatMail.save`,
`mail.read.status`, `mail.read.status.betch`,
`mail.delete`, `mail.read`, `mread.batch.category`, `mread.batch`, `mread.chat` (message and group selectors),
`server.rank`, `kill.rank`, `level.rank`, `building.rank`, `silver.contribute.rank`, `expedition.rank`, `alliance.rank`, `kill.al.rank`, `world.favo.get`, `world.favo.add`, `world.favo.delme`, `world.search.user`, `search.player`, local `world.get.detail` branches, `build.info` and `world.get`. The SFS handshake, login rejection,
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
private `GAME_LOGIN_SECRET` exception. Optional chat and avatar integration settings also come
from the environment. Other development values are direct
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
| `GAME_CHAT_SESSION_URL`          | Optional internal HTTP(S) endpoint ending in `/external/session`; unset disables chat session issuance.                              |
| `CHAT_SIGNING_SECRET`            | Required when the session URL is configured; must match the maintained chat service.                                                 |
| `GAME_FILES_URL`                 | Optional internal files-service HTTP(S) origin; unset disables avatar grants.                                                        |
| `FILES_SIGNING_KEY_FILE`         | Required explicit key-file path when the files origin is configured; same protected key as the files service.                        |
| `GAME_LOGIN_SECRET`              | Required private secret matching the legacy mobile login issuer.                                                                     |
| `GAME_RESOURCES`                 | Required directory of authorized, extracted 12.06.0 XML rules.                                                                       |
| `GAME_REDIS_URL`                 | Defaults to `redis://127.0.0.1:6379/0`.                                                                                              |
| `GAME_ZOOKEEPER`                 | Defaults to `127.0.0.1:2181`.                                                                                                        |
| `GAME_HOST`                      | Bind address, default `127.0.0.1`.                                                                                                   |
| `GAME_PORT` / `GAME_HEALTH_PORT` | Defaults to `19933` / `18090`.                                                                                                       |
| `GAME_MAP_SIZE`                  | Defaults to `1200`.                                                                                                                  |
| `GAME_CROSS_SEARCH`              | Defaults to `true`; `false` restricts general player search to the local realm without global search reads.                          |
| `GAME_PLAYER_KINGDOMS`           | Optional public-read routes, such as `1:opencok_kingdom_1,2:opencok_kingdom_2`; at most two realms.                                  |
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
for goods, features, research, equipment, statuses, dragon skills, activity panels,
rewards, mail, field monsters, army formations, neutral resources, barbarians,
new-general bases/skills/offices/refinements, prestige levels and kingdom skills,
where the indexed last record wins as in the legacy cache. Ordered projections
retain declarations separately from that index. Values retain leading zeroes and
whitespace; malformed XML, nonstring values and document type declarations fail loading.

Building star availability evaluates numeric client versions, realm selectors and
inclusive start/end boundaries at the command's injected time. Legacy dates use
`yyyy-MM-dd-HH-mm`, interpreted in UTC for this server, independently of the host
timezone. Dates and default version checks still reject unsupported formats; Java's
lenient date rollover and invalid-date epoch fallback remain pending. Function-on
realm selectors now retain ordered Java parsing and propagate reached parse failures.
Test-realm selectors and explicit timezone offsets are supported by the pure availability
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

Function-on availability, server-side effect gates and ordinary feature announcements
use `featureRealmEnabled`. It recognizes exact `all`/`close`, skips empty semicolon
segments, accepts Java signed Integer members and returns immediately on the first
match. Ranges require the reference ASCII-digit pattern; Unicode digits remain valid
for individual Integer members. The upper range bound is parsed only when the lower
comparison succeeds. Consequently `2;bad` enables realm 2, while `bad;2` throws;
`3-2147483648` returns false for realm 2 without parsing the oversized upper bound.
Trailing line terminators do not turn malformed tokens into valid ranges.

Required version and realm metadata use Java blank semantics before selection.
Server-only gates require version metadata without comparing a client version.
Availability still applies its selected version policy before realm parsing. Invalid
selectors propagate to their existing caller boundary: the expedition contribution
falls back to zero, while an ordinary required effect/configuration read may fail.
The primitive accepts signed Int realm values, while command/runtime validation
continues to restrict physical realm IDs. Inputs are bounded to 65,535 characters
and 4,096 nonempty segments. Six added units include 1,020 independent Java 8
Integer/regexp query fixtures and resource-owner fallback composition. Tests require
no Java installation, ignored reference inputs or external services.

The former generic realm helper has been replaced by separate reference-specific
selectors. All retain the same input bounds and first-match behavior.

| Consumer                                                                       | Selector                    | Distinct behavior                                                                                                                                                                            |
| ------------------------------------------------------------------------------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Quest, scout, terms, trumpet, graveyard and account-verification item controls | `switchRealmEnabled`        | Function-on integer/range parsing with exact literal `0` closed; `+0`, `00` and `0;2` remain ordinary numeric selectors.                                                                     |
| Lucky-day ordinary event controls                                              | `eventRealmEnabled`         | Split nonempty hyphen parts; exactly two parts form a range, including Unicode digits and repeated hyphens. Otherwise parse the original member as an Integer. Upper bounds remain deferred. |
| `wa_switch`                                                                    | `worldActivityRealmEnabled` | Exact `all`/`0`; always parse the first nonempty hyphen part, eagerly parse the second only for exactly two parts, and otherwise use the first as both bounds. `close` is not a keyword.     |
| Kingdom skill availability                                                     | `featureRealmEnabled`       | Uses function-on selection; an absent selected test/online string means unavailable.                                                                                                         |

For example, `-2` selects realm -2 for item/event controls but realm 2 for
`wa_switch`; `2-bad-third` selects realm 2 only for `wa_switch`. Its eager upper
bound also makes `3-2147483648` fail even when the current realm is below 3.
Account-verification metadata is checked for Java-blank values before its version
and realm gates; rejected selectors never reach the counter read.

Eight additional unit tests include 3,690 independent Java 8 query outcomes and
typed configuration, account-counter and lucky-day composition. Original catalog
records remain unchanged. The existing optional-catalog projection remains: absent
item records can stay omitted/closed, while a reached required selector in a present
record rejects when missing. Optional quest tab/push fields and absent `wa_switch.k1`
remain optional. These projections do not claim legacy missing-catalog failures.
Kingdom-skill tab restoration, sorting and separators are described below. Lenient
dates, default version policies and other exceptional catalog projections remain
separate compatibility work.

Kingdom-skill configuration retains every declaration in source order alongside its
final-definition index, including duplicate, absent and blank IDs. Missing IDs share
the index key `null` with a literal `null` ID, matching reference cache-key construction,
but remain distinct entries in the ordered projection. Missing or empty skill catalogs
produce no restored skills. The loader does not validate constructor fields or discard
malformed skill rows before the restoration layer consumes them.

`rules/kingdom-skills` restores each record independently. All constructor Integer
fields, the category ordinal, cost lists and success Float must parse before the row
is included; any malformed record is skipped as a whole. Unused string fields remain
unparsed. Cost-list splitting drops trailing empty parts while retaining internal empty
parts; Float parsing accepts the reference's nonfinite and hexadecimal forms. Missing
IDs render as `null`, and original catalog records remain unchanged.

Tabs use fresh Integer HashMap traversal and a bounded Java 8 list-sort implementation.
The skill comparator treats equal IDs as equal and otherwise subtracts tab indices
with signed Int wrapping. The sort preserves run discovery, stable insertion, merge
and galloping order, including the reference comparator-contract failures. A failure
rejects the response instead of silently selecting a different order. Hidden index -1
entries skip availability checks; visible entries append a separator according to
their position in the full sorted list, preserving a trailing separator before hidden
entries. Entirely hidden tabs overwrite their base value with an empty string.

Eight additional unit tests cover restoration, ordered catalog loading, tab response
encoding and 360 independent Java 8 sort cases, including 36 comparator failures.
Frozen fixtures retain output indices, comparison counts and comparison-trace digests.
The pure sort is limited to 4,096 entries and does not mutate its input, including on
failure. Normal tests execute no Java or private game code. This implements configuration
presentation only; skill execution, material costs, timers and rewards remain separate.

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

The pairing record may also contain `status` for resource-load phase reads. Its
canonical values, in ordinal order 0–8, are `WAITING_STATE`, `MATCHING_STATE`,
`PREPARING_STATE`, `COLLECT_STATE`, `KILL_MONSTER_STATE`, `BUILDING_STATE`,
`SCIENCE_STATE`, `TRAIN_ARMY_STATE` and `FIGHTING_STATE`. Ranking does not consume
this field. A missing record or field leaves the phase unavailable; malformed
phase data rejects at the cache boundary. Phase reads validate the realm identity
and 65,535-byte record bound without requiring ranking fields. They never infer a
phase from match IDs or timestamps and never initialize a missing event.

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

## World favorites

[Issue #82](https://github.com/ReeseArch64/opencok/issues/82) connects all three owned
favorites commands through `GameServices.worldFavorites`, backed by the existing kingdom
`world_favorite` table and read-only global `server_info` metadata. Startup checks both
tables; no schema, migration, new package or environment setting is added. The realm
identity needs SELECT on global server metadata and ordinary favorite-table read/write
permissions. These commands manage bookmarks and do not load or modify map points.

| Command            | Inputs                                                                        | Response                                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `world.favo.get`   | Authenticated owner                                                           | `favo`: SFS array of objects with stored non-null `point`, `type`, `name`, `server`, `createTime`, `cityType`, `resType`, plus normalized `serverType` |
| `world.favo.add`   | Int `point`/`type`, String `name`; optional Int `server`/`cityType`/`resType` | Int `state: 1`, Int `point`, Long `createTime` sampled after persistence                                                                               |
| `world.favo.delme` | Equal-length SFS arrays `point` and `server`, each containing Int elements    | Int `state`, plus `pointArray`/`serverArray` echoing order and duplicates                                                                              |

Every operation validates the authenticated local profile and ban state. An owner lock
serializes mutations; list uses a repeatable-read snapshot and shared profile lock. A
favorite is identified by owner, point and server. Add replaces all mutable fields and
persisted creation time through one atomic upsert, improving the legacy separate
DELETE/INSERT failure boundary. Repeating an add refreshes that favorite's timestamp;
it is not a request receipt. Supplied owner fields never override session identity.
The persisted timestamp is captured at command start; the add response samples time
again after the write, preserving the reference's separate clock reads.

Names retain their original whitespace. Empty names are accepted; JSON-special characters,
BMP emoji ranges, supplementary characters and unbalanced braces reject as in the
reference. A frozen synthetic Java 8 primitive oracle covers every BMP character and
49 additional boundary strings. PostgreSQL-incompatible NUL/unpaired surrogates and
names longer than 255 UTF-16 units reject explicitly, including overlong whitespace that
the legacy blank-length helper allowed to reach its database. These are documented
storage boundaries, not silent normalization. Existing readable names are projected as
stored; listing does not reapply add-time name validation.

Omitted server uses the local realm, independently of the catalog. An explicit server
must not exceed the largest ID in authorized `servers.xml` whose `test` value is not
exactly `true`; IDs use the existing Java decimal parser. Empty catalogs retain the
reference minimum-integer maximum, and malformed non-test IDs fail. Point, type and
server fields remain signed 32-bit integers; no new coordinate or lower-bound rule is
invented. The referenced realm need not have a configured game database because this
operation stores bookmark metadata only.

Listing orders by server ascending and creation time descending with nulls last, matching
legacy null placement. Equal timestamps have a deterministic point tie-breaker where the
legacy query specified no order. Nullable fields are omitted and stored longs remain
exact. Global types normalize special/test families with the reference's server-ID cutoff;
missing rows and unrecognized types become ordinary type zero. Fresh bounded global reads
replace the legacy process-local type cache. A failed global query rejects the list rather
than fabricating metadata. The kingdom and global snapshots are independent.

Deletion matches complete point/server pairs under the session owner, never the Cartesian
product of both arrays. Duplicate pairs are deduplicated only for SQL; echoed arrays keep
them. Up to 500 unique pairs are deleted per statement within one transaction. Empty,
missing and repeated selections succeed. A database failure after authorization rolls
back and returns `state: 0`; a lost commit acknowledgment can return zero after deletion,
and repeating it is safe. Failures before owner validation remain command errors. No
push or mailbox synchronization side effect is introduced.

No gameplay favorite quota is added. Reads bound allocations to the SFS array limit plus
one sentinel row, and the complete correlated response must fit the maintained transport
frame limit. Oversized output fails without returning a partial list or deleting rows.
Unit tests compose actual commands, rules, DTOs and Drizzle adapters with synthetic
clients and wire round trips, including rollback, lost replies, owner isolation, server
metadata, pair deletion and limits. No socket, listener, live database, ADB or client was
used; PostgreSQL concurrency, collation and live client rendering remain unvalidated.

## Map player search

`world.search.user` searches public player identities in the local realm or a realm
already configured through `GAME_PLAYER_KINGDOMS`. The runtime supplies
`GameServices.worldSearch` and checks the existing local `userprofile`, `playerinfo`
and `alliance` columns. Remote availability does not gate local startup. No schema,
configuration variable, external package, global account query or game-state write
is added.

| Parameter  | Type and default                  | Behavior                                                                      |
| ---------- | --------------------------------- | ----------------------------------------------------------------------------- |
| `name`     | Optional String, default empty    | Substring pattern; whitespace is retained. Empty searches all eligible names. |
| `page`     | Optional Int, default 1           | Values at or below zero use page 1. Eight results per page.                   |
| `serverId` | Optional Int, default local realm | Must identify a positive, explicitly configured public-read realm.            |

The response contains only `list`, an SFS array, plus the ordinary request correlation
fields. Each entry contains String `uid`/`name`/`abbr` and Int `pointId: 1203`.
Non-null `pic` is a String, `picVer` is an Int and `power` is an exact signed Long;
null optional values are omitted. Missing alliance abbreviations become the empty
string. The fixed point identifier preserves the reference query and does not disclose
or calculate the current castle location. No server ID, private profile columns,
page/total envelope or push is added.

The local observer must still belong to the authenticated realm and pass ban checks.
Local searches share that read-only repeatable-read transaction. A remote search
starts its own read-only snapshot after local observer validation; this is not an
atomic cross-database snapshot. The selected database defines the target population,
including any visiting profiles present there, as in the reference query. It does
not route individual matches through the global account directory.

Target `banTime` equal to either 9223372036854775807 or 9223372036854775806 is excluded.
SQL null ban times are also excluded by the original inequality semantics. Temporary
ban times and target ban flags do not add a filter. Player statistics and alliance
membership use left joins, so a missing statistics row does not hide the player.
This command does not apply the castle-level filter used by `search.player`.

The bound PostgreSQL `ILIKE` pattern retains `%` and `_` wildcards and backslash pattern
escapes. Apostrophes remain data. It does not run the legacy interpolated string
through MySQL SQL-literal unescaping; combinations such as backslash plus `n` or
repeated backslashes can therefore differ. Names are not trimmed or normalized.
NUL and malformed Unicode reject because they cannot be stored or transmitted as
valid PostgreSQL text; the search string must fit the existing 32,767-byte SFS limit.
PostgreSQL case and accent matching follows the database collation. Synthetic tests
prove ASCII case and wildcard query composition, not parity with a live MySQL
collation; Unicode/accent parity remains unverified.

The legacy query specifies no order. This adapter orders by UID ascending to make
page boundaries deterministic within a snapshot; separate page requests can still
observe intervening changes. Offset arithmetic preserves Java signed 32-bit wrapping
for nonnegative results, including wrapped page-one offsets. Negative wrapped offsets
reject before querying instead of triggering a database error or the local Java
helper's empty-result fallback. Unknown realms, unavailable databases and invalid
results also fail explicitly, without substituting local or empty success. Duplicate
or excess rows reject, and the complete correlated extension must fit the frame limit.

`test/world-search.test.ts` composes the actual command, rules, DTO and Drizzle adapters
with synthetic database clients. It covers defaults, pages, routing, observer checks,
ban sentinels, null joins, exact longs, bound patterns, failures and transport limits.
No listeners, databases or client sessions are used. Live collation, query plans,
concurrent snapshots and native rendering remain unvalidated. The separate general
`search.player` command is documented below; implemented local point-detail branches and remaining topic-5 gaps are documented below.

## General player search policy

`search.player` is connected through `GameServices.playerSearch`, using the existing
profile, building, statistics, alliance and global-directory tables. It requires
String `key` and Int `page`; neither parameter has a default. The runtime passes
`GAME_CROSS_SEARCH`, which defaults to true as in the reference. Explicit false uses
only local search. Remote reads are restricted to `GAME_PLAYER_KINGDOMS`; unknown
routes fail visibly rather than returning a fabricated local or empty result.
Both settings are forwarded by Compose. [Issue #84](https://github.com/ReeseArch64/opencok/issues/84)
tracks local delivery and review. No schema migration or new dependency is required.

The query uses Java-compatible signed decimal parsing for `lookfor.k1` (minimum
castle level) and `lookfor.k2` (advertised maximum), including BMP decimal digits.
It retains the supplied prefix key and page without trimming or clamping. The local
candidate limit is maximum plus one. Catalog maximum must be between zero and
32,766, so candidates fit the existing collection bound; malformed or larger catalogs
reject explicitly. The adapter validates the authenticated local observer's identity,
realm and bans before querying candidates. The local query uses a bound prefix ILIKE
pattern, a left alliance join and inner main-building/statistics joins; the selector
additionally checks UID and level. Raw castle level is used without star levels.
Target ban flags/times do not add a filter for this general command.

The compatibility pipeline is intentionally asymmetric:

| Mode        | Selection                                                                                                                                                                                         | Response metadata                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Local       | Slice the bounded local candidate list using the requested page.                                                                                                                                  | Int page is always 1; Long total counts all local candidates, including the sentinel.                        |
| Cross-realm | Slice local candidates to page 1, calculate directory budget as twice the candidate limit minus that seed, append eligible remote records, then slice the combined list using the requested page. | Int page echoes the request; Long total counts the seed plus eligible remote records before the final slice. |

Both responses contain Long max and the original String key. Pages contain ten
entries. Arrays with ten entries or fewer bypass slicing entirely, even for a
nonpositive or out-of-range page. Longer arrays use maximum divided by ten as the
page cap. The pure slicer preserves signed 32-bit start/end wrapping; negative
indices that would throw in Java reject, while wrapped empty ranges remain empty.
A null within a sliced window ends that window. SQL fetches the bounded candidate
window before the compatibility selector applies these page rules.

Directory filtering uses minimum castle level minus two with signed wrapping. The
remote candidate budget must fit 32,767 entries. Remote inputs model insertion order
into the legacy shared-info map, including missing/default records; duplicate map
keys replace values without moving the original insertion position. The existing
bounded Java hash traversal determines remote order, supporting at most 4,096 keys
and rejecting tree-bin collision cases instead of inventing their order. A missing UID
is skipped; a mismatched UID/key or malformed present level rejects. Only positive
main-building levels at or above the configured threshold enter the combined list.
Unlike the legacy per-entry catch-and-skip behavior, malformed present identities and
castle levels fail explicitly. The adapter retains missing-profile placeholders after
found profiles, preserving their participation in hash traversal before result filtering.
Directory mapping rows are limited before account eligibility is checked. That window
is not refilled after missing, local-realm or low-level accounts are excluded.

Local projection emits the selected nullable identity, language, picture, power,
alliance name/abbreviation and castle level fields, omitting null values. Zero and
negative local power remain exact Long values. Remote projection follows the
shared-public-profile shape: mainBuildingLevel is duplicated into level when positive;
power, VIP expiry and offline time appear only when positive; picture/frame, GM,
cross-fight origin, VIP/SVIP and membership-rank integers retain their defaults.
Remote alliance ID is optional and alliance name is not added. Each entry carries
its selected serverId. Only public fields are serialized; no private profile data or
unsolicited push is introduced. The connected command retains ordinary correlation and
checks the complete extension against MAX_FRAME, rejecting oversized output without
truncating it.

`test/fixtures/player-search.json` freezes 4,065 cases from an independently authored
Java 8 primitive list/arithmetic/HashMap probe: 1,680 slicing cases and 2,385 search
cases. Inputs use synthetic identifiers and no private game class was executed.
Ordinary unit tests require no Java runtime. Additional tests exercise catalog syntax,
remote budgets, sparse/default fields, long boundaries and malformed inputs, with SFS
round trips. `test/player-search-command.test.ts` additionally composes the actual
command/rules/DTOs/Drizzle adapters with synthetic clients, covering authentication,
SQL predicates, routing, two-stage directory selection, sparse profiles, VIP, failures,
batch snapshots and exact frame boundaries. All verification remains unit-only; no
listener, database service or client was used.

Local observer and candidate reads share one read-only repeatable-read snapshot.
Cross mode then reads global `usermapping` rows of mappingType name with a bound
prefix pattern, followed by eligible `account_new` rows in the same global snapshot.
The second query selects only gameUid/server, excludes the local server and uses the
wrapped minimum-level-minus-two threshold. Mapping/account active flags do not add a
filter. Only canonical positive decimal server strings are accepted; malformed aliases,
unknown routes and directory/profile realm mismatches fail. No account repair occurs.

Each selected remote realm uses one read-only repeatable-read snapshot and batches at
most 500 player IDs per query. Only public profile metadata and the required statistics,
raw castle level, VIP score/expiry/SVIP level and membership rank are selected. Missing
statistics, castle or VIP rows yield their documented empty/default presentation without
creating rows. Ambiguous duplicate castles/profiles reject rather than choose one.
The membership rank is looked up by UID and used only for a nonblank alliance ID,
matching the reference accessor. Blank alliance abbreviations use an empty string.
VIP is zero at or after expiry; while active, the last qualifying entry in catalog
order determines level from score. Stored VIP level is not substituted for this rule.

This path reads current authoritative remote metadata instead of consuming the legacy
shared-profile Redis cache. It can therefore show a changed name, picture, VIP expiry
or missing profile sooner than that cache, and it needs the configured remote database
available at query time. No cache repair, cache import or derived profile write is
performed. Restoring or depending on the legacy cache's stale/TTL behavior is not claimed.
Local, global and remote snapshots are separate, with no cross-database atomicity claim.

Local rows use UID/building-UUID order and directory rows use UID order where the
reference SQL left order unspecified. Prefix patterns retain wildcards and backslash
pattern escapes; PostgreSQL case/accent matching follows database collation. Unicode
collation parity, live concurrency and query plans remain unverified. Query failures
and malformed dependencies reject explicitly rather than emulate the local Java
helper's empty-result fallback or drop malformed remote entries. Startup checks local
search tables and, only when cross search is enabled, global directory columns;
remote realm availability does not gate startup. Disabling GAME_CROSS_SEARCH removes
this command's global/remote search reads and global search readiness probes.

## Local world point detail command

`world.get.detail` is connected to `GameServices.worldPointDetail` for the local
branches listed below. It requires Int `point`, accepts optional Int `serverId`
with omitted/`-1` meaning the local realm, and retains normal correlation fields.
Authenticated nonpositive points return an empty object without an added success
flag. Missing positive points return `E100169`. Supported remote queries are described
below. Unfinished specialized branches return `102192`; they are still required work in
[issue #85](https://github.com/ReeseArch64/opencok/issues/85), not removed scope.

| Local point branch                                            | Current command behavior                                                                                                                                                          |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unoccupied resources 3/37                                     | Int point and wrapped remaining quantity; type 37 also includes current member count. Returns before territory-effect additions.                                                  |
| Ordinary resources 3 without a nonblank owner's march pointer | Public owner fields and, when applicable, the positive territory-effect flag. A nonblank owner/march pointer requires the pending occupied-resource resolver and rejects.         |
| Monster 6                                                     | Owner UID plus the selected existing exploration report/start/end fields, if its first destination match is occupying.                                                            |
| Monster boss 15                                               | Current and catalog-derived maximum HP, then point ID; no owner identity fields.                                                                                                  |
| Cities 1/2                                                    | Public base owner fields. City 1 with exact `lost_battle.k3 = "1"` and an existing target profile adds Bool `slowDown`/`targetTooStrong` and Long `targetPower`/`lastBeDuelTime`. |
| Unoccupied world bosses 49/50                                 | Pending service/reward state; rejects. Occupied instances use the reference base owner fields.                                                                                    |
| Territories 14/18/20/21/23/46/47, occupied new resources 37   | Pending specialized state; rejects.                                                                                                                                               |
| Barbarian 44                                                  | Public owner fields plus Long `barbarionPower`, derived from existing saved troop counts, regeneration time and catalogs. A missing barbarian record returns zero.                |
| Neutral resource 60                                           | Base owner fields; with a nonblank item and an occupying destination march, adds Long `occupybegintime` from the stored end time and catalog gathering duration.                  |
| Other known types 0–69                                        | Public base owner fields and point ID, as in the reference handler. Unknown types reject.                                                                                         |

Every local query validates observer identity, realm and ban state before point
access. Full response bounds include correlation fields and the SFS extension
envelope. The command emits no pushes and performs no game-state writes. Existing
bootstrap/reconnect restrictions on march state remain part of the unfinished
topic-2 work; this query does not establish complete gameplay or client compatibility.

Twenty-seven command/adapter unit tests cover these branches, error behavior, owner
isolation, bounded report selection, transaction failures and response limits.
Fresh-map selection also reuses frozen Java 8 collision-order fixtures. Validation
uses synthetic Drizzle clients; no live database, listener, service or client is run.

## Remote world point details

Positive `world.get.detail` requests for a configured remote realm authorize the
observer locally, commit that read-only snapshot, then read the destination point
at world zero in a separate snapshot. Missing routes fail without local fallback.
The ordinary-realm remote service returns these branches before the local handler's
exploration, health, city effects, barbarian power, neutral timing, territory-effect
and world-boss reward additions. No global cache or emperor service is consulted.

| Remote branch                                                                  | Response before correlation                                                                                      |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Unoccupied ordinary resource 3                                                 | Point and wrapped remaining quantity only.                                                                       |
| Ordinary resource 3 or new resource 37 with a nonblank owner and march pointer | Pending occupied-resource restoration; rejects.                                                                  |
| New resource 37 without that pointer                                           | Base owner fields and point; no remaining quantity or member count.                                              |
| Territories 14/18/20/21/23/46/47                                               | Pending specialized state; rejects.                                                                              |
| Other known types 0–69                                                         | Base owner fields and point, including remote monster, city, barbarian, neutral-resource and world-boss queries. |

The remote Java service serializes its SFS object to JSON and the caller parses it
again. `messages/legacy-json` now reproduces this conversion for the String, Int
and Long fields emitted by the supported branches. Long values inside signed Int
range become Int; larger signed Long values retain all bits without passing through
a JavaScript Number. Correlation fields are appended afterward and keep their
original types. JSON-looking strings, numeric strings and the literal string
`null` remain strings. Default excluded properties are omitted. Function-shaped
strings follow Java's full-string regular expression matching and reject as
unrepresentable values without execution; trailing line breaks remain significant.
The shared stored-mail matcher also uses these Java line-terminator semantics.

Conversion is bounded to 32,767 properties and 4 MiB of JSON, followed by the normal
complete SFS response limit. Other scalar/container types reject explicitly; their
conversion must be implemented with the pending specialized branches. This is not
a general replacement for the entire legacy serializer or a claim of cache parity.

Eight added command/adapter units cover routing order, world zero, omitted local
reads, integer widths, missing state, authorization, rollback and response bounds.
Four converter units use 616 signed-decimal cases and 48 function-pattern cases
from independently authored Java 8 primitive/regular-expression probes. Existing
mail structure fixtures protect the shared decoder. Tests use synthetic clients
and frozen public-value fixtures; they require no Java runtime, private classes,
real database, service, listener or client.

## Local barbarian point details

For local type 44, `world.get.detail` reads `world_barbarion` by point ID in the same
read-only snapshot as the point and public owner fields. It reads only the stored
config ID, last attack time and remaining-army byte array. It does not read reward
counts or HP, start combat, advance marches, regenerate saved troops or write state.
The projection uses the barbarian record's config ID, independently of point item.
A missing record returns Long `barbarionPower: 0`, matching an absent manager entry.
Current persisted records replace the legacy manager's process-local cache; historical
unpersisted changes and stale cache contents are not reproduced.

`barbarion.xml` loads optionally into `Rules.world.barbarians`, with final duplicate
IDs retained. Its `army` selects the existing formation catalog; each troop's power
comes from `arms`. Formation parsing preserves the reference whole-separator
behavior, including duplicate replacement and terminal empty tokens. No catalog
lookup is needed when the barbarian record is absent. Empty formations return zero
without decoding the unused army blob.

`messages/java-int-map` reads the Java serialization format produced for the
reference's `HashMap<String, Integer>` storage. It accepts only the standard HashMap,
Integer and Number descriptors, strings, nulls and their references; it never loads
or executes serialized classes. Modified UTF-8, shared value/descriptor references
and exact signed Int values are preserved. Streams are bounded to 65,535 bytes and
4,096 entries; truncation, foreign classes, bad handles, wrong value types and
trailing bytes reject. Nonempty formations require a valid non-null saved map;
missing keys and null values contribute zero remaining troops.

The server samples time again for the power projection, after the database read.
Recovery uses wrapped Long elapsed time, Double division, the reference upper rate
cap, floor-to-Int saturation, signed Int addition and the configured troop ceiling.
There is no added lower clamp for future attacks or negative values. A fresh Java 8
HashMap traversal is reconstructed for both the configuration map and the recovered
map, including collision trees and resizing, before ordered Double power summation.
The final floor-to-Long conversion preserves Java saturation and NaN-to-zero behavior.
Double catalog parsing supports Java whitespace, suffixes, hexadecimal floats,
NaN and infinities; malformed required rules fail visibly.

Seven codec/rule unit tests include three independently serialized Java 8 map fixtures,
60 two-stage HashMap traversal vectors and 1,800 primitive arithmetic vectors. Four
command/adapter tests cover the real composition with synthetic database reads,
clock sampling, correlation, missing state and failures; a loader test covers the
optional catalog and duplicate definitions. No private game class is executed.
Remote conversion, occupied resources, territories and world-boss state remain
pending parts of the command.

## Local city detail extras

For local player-city type 1, the exact item flag `lost_battle.k3 = "1"` enables
`slowDown`, `targetTooStrong`, `targetPower` and `lastBeDuelTime` when the owner
profile exists. City type 2, absent target profiles and other flag strings omit
these additions without reading their dependencies. Client-supplied fields cannot
override the projection.

The point transaction reads the observer's persisted `playerinfo.power`, the target's
existing statistics and `user_mixed_info.lastBeDuelTime`, plus the target's effect
inputs. It does not recalculate power, load troop quantities or read inventory,
construction, title or avatar-upload state. Missing statistics/duel records and
foreign identities reject. Nullable stored primitive longs use zero.

`repositories/power.readPlayerEffects` shares the existing effect queries with
`get.power.info`; the point path keeps them inside its read-only repeatable-read
snapshot. Collections are capped at 4,096 records, with a 4,097th sentinel row causing
failure instead of truncated effects. Existing unique territory/activity checks
remain separate. Standard power readiness already probes those tables; point
readiness additionally checks the duel timestamp and required profile columns.

`rules/power-resolver.playerGameEffect` composes effect 37 through the same ordinary
realm sources and ordered float arithmetic as the existing dragon modifier 487:
initial and research effects, VIP/status/general/alliance/office/equipment,
territory/world/hero/lucky-day/dragon/military/prestige/miracle contributions and
personal throne rewards. Equipment reconstruction and its effect-218 multiplier
retain their existing order. This is persisted-state restoration: status rows ending
at or before the captured request time are excluded, as in the reference status
loader. It does not reproduce an already-resident profile's cache history or invoke
status cleanup, lucky-day mutation, special-battle managers or player loading.

Existing world-effect cache reads supply global contributions; emperor state is
required only when saved personal throne rewards exist. Those reads occur after
the database snapshot and are not atomic with it. Missing or malformed required
cache/catalog state fails visibly. The target effect is compared strictly with zero
for `slowDown`. `targetTooStrong` compares the target's exact persisted Long power
against the observer's Long power multiplied by Java Long-parsed `lost_battle.k4`,
with signed 64-bit overflow before comparison. No floating-point conversion occurs.

Five command/adapter tests cover composition, gating, expiry, cache dependencies,
identity and bounded failure paths. Three pure projection tests include 1,331 frozen
synthetic Java 8 long-arithmetic oracle vectors and binary wire round trips; the
shared resolver also checks all effect sources for both 37 and 487. These tests run
without a client, live service or database. Remaining point-detail branches and the
overall topics 1–8 migration are still incomplete.

## World resource detail foundation

The pure resource calculations and SFS projections for
[issue #85](https://github.com/ReeseArch64/opencok/issues/85) are available in
`rules/world-resource-detail` and `dtos/world-resource-detail`. `world.get.detail`
now uses remaining-quantity arithmetic for implemented local resource reads. Occupied-resource
collection/load composition is still pending; the pure helpers do not read or change game state.

| Calculation        | Preserved behavior                                                                                                                                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Remaining quantity | Signed 32-bit subtraction of initial and consumed quantity.                                                                                                                                                                                                                |
| Army capacity      | Supplied raw load divided by resource weights for numeric items 0–5, using Java integer division; a single plunder value is subtracted except for point types 18/19.                                                                                                       |
| Collected quantity | Wrapped signed-long elapsed time, direct float32 conversion, float32 seconds/rate multiplication and Java float-to-int saturation. Ordinary resources retain quantity/load caps and the one-unit remainder rule; territory type 18 uses the load cap; type 37 is uncapped. |
| Owner projection   | Int `q`, `tq`, `collected`; Float `spd`; Long `sdt`, `changeCollectSpdTime`, `occupyEndTime`. Type 37 computes `q` from maximum collection time, truncating to whole seconds before float multiplication.                                                                  |
| Occupying group    | Float32 speed accumulation and wrapped signed collection totals, with one clock sample per march. A separate final sample becomes Double `sdt`; `spd` and `tq` override owner fields without removing other metadata. An empty group adds no fields and samples no clock.  |

Inputs require signed integer ranges, finite representable float speeds and bounded
collections. Finite speeds can overflow the aggregate to infinity, as in Java, and
that output retains its Float wire type. The resource item identifier must fit its
255-character storage field and valid PostgreSQL text; missing or invalid required
weights reject explicitly. These exceptional-input checks are not claims of matching
every legacy failure path.

`test/fixtures/world-resource-detail.json` contains 4,450 independently generated
Java 8 primitive arithmetic cases: 1,809 direct long-to-float conversions, 81 quantity
subtractions, 2,048 elapsed collection calculations, 384 owner quantities and 128
group aggregates. Eight unit tests compare those results and cover weight/plunder
rules, malformed inputs, clock sampling, immutable inputs and SFS encode/decode.
The fixtures include cases where converting a long through a JavaScript double
before float rounding would produce the wrong result. Normal tests require no Java
runtime, ignored source inputs, database, listener or client.

`resourceRawArmyLoad` now supplies the pure troop-load calculation that precedes
resource-weight division and plunder subtraction. Its explicit snapshot distinguishes
an owner already resident in the legacy process from one loaded on demand: a positive
cached load is used only when the owner is not resident. Otherwise, each troop entry
uses signed Int total-minus-dead and catalog-load multiplication before Float
modifiers and saturating Float-to-Int conversion; the final sum wraps as Int. Duplicate
entries and negative remaining counts are retained, not merged or clamped away.

The modifier inputs are ordinary load (78), added load (2196), general effect 133,
the stronghold general's load effect and conditional expedition load (895), in that
order, followed by the troop's saved load modifier. Each Float operation rounds
separately. The percentage has a lower bound of 20, including for negative infinity;
NaN and positive infinity preserve Java cast behavior. Single-player siege load is
not included because the resource query requests the ordinary calculation.

`rules/world-resource-effects` now resolves ordinary load effects 78 and 2196
through the shared player-effect composition and obtains effect 133 only from the
restored general skills. Global, equipment, status or base effects with ID 133 are
not substituted for that general-only contribution. The existing equipment-load
ordering, modifier 218, per-general Float accumulation and ordinary-realm source
boundaries also apply to these load effects. The shared resolver additionally
supports effect 895 for the conditional expedition branch.

The expedition rule uses server-side `tech_newEffect` and `17_wk` feature gates,
rejects merged realms and the replacement `wk_switch_new` feature, requires
collection stage 3 and checks the player's effective home realm against the current
realm. These feature checks do not compare the client's version. Only an eligible
request resolves effect 895. Context/effect exceptions return zero, preserving this
specific reference boundary; ordinary load-effect failures still propagate. Inputs
are an explicit merge/stage/home-realm snapshot callback and an effect callback.
The effective home realm must follow the reference's cross-fight-origin rule, and
stage must represent the applicable runtime or request-override stage. Those data
providers are not yet wired to this point query; no stage or home realm is invented
from the observer or destination point.

Ten added units extend the complete ordinary-source matrix to 78, 895 and 2196,
verify general-only 133 and Float ordering, compose the result with troop load and
cover conditional feature/time/realm/stage gates, skipped effect reads and failure
fallback. New-general stronghold/official contributions remain a separate required
resolver; this step does not replace them with zero.

`rules/new-general-skills` restores the passive base-skill and talent components
separately from ordinary general effect 133. Optional `general_base.xml` and
`general_skill.xml` catalogs retain exact strings and final duplicate definitions;
they do not replace `sk.xml`. Saved `baseSkill` and `talent` strings retain final
duplicate integer levels, Java integer digits and whole-separator parsing behavior.
Their storage bounds are 256 and 5,000 UTF-16 units; lists/maps are bounded to 4,096
entries. Missing required skill definitions and malformed consumed numbers reject.

Base skills start at level one when no saved level exists. Star-specific skill
lists append in numeric star order, preserve duplicates, and cannot populate an
empty initial list. Only passive type zero contributes. Nonblank `condition_type`
excludes a base skill from this calculation but does not exclude a talent. Short
base/add arrays supply zero; extra malformed numeric values still reject. Level
minus one wraps as Int before conversion to Float, and multiplication, addition
and per-effect accumulation each round as Float. Talents traverse a fresh Java 8
Integer HashMap reconstructed from the saved text; historical cache mutation order
is not claimed. Returned effect maps also preserve fresh HashMap traversal.

Direct decimal/hexadecimal Float parsing retains signed zero, subnormals, infinities
and NaN, including decimal halfway cases that differ from double-then-float parsing.
Independent synthetic Java 8 JDK probes supply 1,529 parsing cases, 80 integer-map
orders and 400 arithmetic cases. Ten unit tests compare these fixtures and cover
skill selection, restoration, limits and immutable inputs; an additional resource
unit checks the catalog boundary. No private classes execute and normal tests do
not require Java or local legacy inputs. Star lookup visits only present canonical
catalog keys, avoiding a linear scan across missing stars and the legacy loop's
Int overflow at maximum star. This is an explicit bounded-read difference.

`rules/new-general-building` now supplies building/official eligibility. Direct
assignment requires state two, a matching building UUID and an existing building;
it bypasses official feature gates. Official state six additionally requires the
owner-version/realm/time feature, main-building level including stars, a nonempty
office with nonzero position/start time, office/position unlocks and the first
matching effect's headcount requirement. Future nonzero start times are accepted,
as in the reference. Headcounts include all restored rows for the same office,
without validating their positions or start times, and office IDs keep their first
duplicate row. Unknown unlock types pass. Position multipliers preserve Float
parsing, including zero and nonfinite values, and resolve after the component sum.
Missing offices remain absent; this read does not create default office rows or
repair general state.

`rules/new-general-status` restores final duplicate statuses and traverses their
fresh Integer HashMap order. Signed Long start/end comparisons are inclusive and
nullable primitive timestamps become zero. Inactive statuses skip effect parsing;
missing status definitions contribute zero. Active malformed effects propagate to
the outer failure boundary. Refinement uses the owner-version feature gate,
final duplicate slots, the reference's mixed separator rules and effect-set
membership without duplicate contributions. A refinement exception discards its
whole subtotal while retaining the other general components. Its saved text is
bounded to the 300-unit storage field. Optional `general_official` and
`general_random_effect` catalogs retain final duplicate definitions.

`rules/new-general-effects` now composes status, passive skills, talents, an explicit
equipment result and refinement before applying the official rate and accumulating
generals as Float. Fresh saved talent, operation-time and base-skill maps restore
before filtering eligibility; malformed operation times retain the module failure
behavior even though the load calculation does not consume their values. Operation
time text is bounded to 200 UTF-16 units and signed Long values. Any snapshot,
restoration, eligibility, status, skill, equipment or rate exception returns zero
for the entire general contribution. The separate refinement fallback remains local.
Status time samples once per eligible general; feature gates use the supplied rule
context. Neither clock nor equipment is read for an ineligible general.

The composition requires a snapshot callback containing authoritative general
traversal, buildings, level/prestige and office state, plus an equipment callback.
It does not infer ConcurrentHashMap iteration or historical cache state from SQL
order. The concrete `equippedGeneralBuildingEffect` adapter now supplies the general's
equipment calculation from explicit ordered equipment bindings and current owner
modifiers. Owner relocation/loading policy, authoritative traversal and those readers
remain pending. No current endpoint substitutes an empty provider to enable this path.

Twenty-four added units cover these rules and their catalog loading, reusing the
earlier parsing/map oracles and adding 600 independent synthetic Java 8 component-sum
and official-rate vectors. They cover skipped reads, clock order, restoration before
filtering, failure boundaries, signed/nonfinite arithmetic and immutable snapshots.
They use no live database, service or client. The occupied-resource command remains
gated until all required runtime dependencies are supplied.

`rules/new-general-equipment` calculates each bound item's base and extra effects,
rereading the owner's color/site modifiers for the extra stage as in the reference.
Color effects 214–217 and site effects 207–213 combine before division by 100;
modifier 218 applies separately to each item-effect entry. Every operation rounds
as Float. Negative values remain negative, and nonfinite values retain Float
arithmetic. An already bound general item does not require the player's worn `on`
flag. The input is the selected equipment map's traversal, not an unfiltered SQL
inventory. Duplicate site selection and cache history remain reader responsibilities.

Ordinary equipment parameters stop at the first blank group or after group 99.
Only canonical site string `6` selects parallel dragon values. Extra properties
preserve the distinct pipe, comma and at-sign split rules, duplicate sums
and ignored trailing comma fields. Saved extras are bounded to 255 UTF-16 units;
piece/effect collections are bounded to 4,096 entries. Missing consumed definitions,
invalid enums, malformed values and unavailable modifiers propagate to the enclosing
general module failure boundary. A missing item definition behaves as an empty map
inside this already-bound calculation, including any saved extras; initial binding
validation belongs to the separate restoration controller described below.

Suit counts retain present empty suit IDs and traverse a fresh String HashMap. The
two/four/six-piece thresholds each honor exact comma-separated general exclusivity.
Suit values use strict Float parsing and whole-separator effect lists, including
duplicate effects. Suit bonuses apply after item effects without modifier 218,
the ordinary player's suit feature gate, strengthening or decomposition selections.
This is why the ordinary player's equipment accumulator is not reused here.

The shared player-effect resolver now exposes 207–218, preserving the special case
that modifier 218 does not multiply itself. Twenty-two additional units include
1,000 independent Java 8 equipment arithmetic vectors, the complete ordinary-source
matrix for all twelve modifiers, concrete building-composition wiring and a bridge
from current owner modifiers through general equipment to raw troop load. The
existing 600 building-composition vectors also remain passing. Resource-owner reads
and ordered general bindings are described below; complete owner context and
occupied-resource endpoint integration are still pending.

The internal `WorldPointDetailQuery.resourceEffects` flag now requests a resource-owner
snapshot for types 3/37 with a present saved march. The wire command does not enable
this flag yet. `repositories/world-resource-owner` reads the owner by UID in the
point's existing read-only repeatable-read transaction, then reuses bounded ordinary
effect reads and selects the additional general/building inputs. Remote queries use
only the destination realm after local observer authorization. Missing marches and
missing owner profiles skip these inputs; no fallback owner or effects are invented.

| Input             | Selected scope                                                                                                                                                | Stable SQL ordering                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Owner profile     | Level, realm/cross-fight origin, ban time, app version, alliance/platform, civilization and suit selection; no credentials or account identifiers beyond UID. | Unique UID, duplicate detection.   |
| Ordinary effects  | Existing bounded player-effect projection for the owner.                                                                                                      | Existing source-specific ordering. |
| Buildings         | Owner UID, UUID, item ID, level and star.                                                                                                                     | UUID.                              |
| New generals      | Owner UID, ID, state, building UUID, star, saved skill/talent/operation-time/refinement text.                                                                 | Numeric ID.                        |
| General statuses  | Owner/general/status IDs and exact nullable start/end Longs.                                                                                                  | General ID, status ID.             |
| General equipment | Owner UID, UUID, positive general ID, item ID and saved extras; no worn-flag filter.                                                                          | UUID.                              |
| Offices           | Owner UID, general ID, office ID, nullable position and start Long.                                                                                           | Numeric general ID.                |

Collections read at most 4,097 records and reject above 4,096. Duplicate identities,
foreign owner rows, invalid integer/Long widths, oversized text, NULs and unpaired
surrogates reject. Nullable values remain nullable for subsequent primitive restoration.
Orphan status/equipment associations and malformed numeric content inside bounded
saved strings remain present for the restoration rules; this reader neither repairs
ownership nor parses catalogs. The reference transferred-owner marker is exactly
`banTime = Long.MAX_VALUE`: general statuses and equipment skip loading in that case,
while ordinary worn equipment, general rows and office rows remain separate inputs.
An ordinary temporary ban does not become a relocation flag. Owner home realm and
cross-fight origin are retained even when they differ from the destination database.

Eight additional driver-fake unit tests cover local/remote snapshot boundaries,
owner predicates and bounded projections, opt-in/skipped reads, moved-owner behavior,
ordinary-source limits, nullable/orphan records, invalid data, rollback and readiness.
Readiness now probes sixteen point-detail table projections, including six owner
projections, without reading data. No database, listener, client or migration is run.
SQL failures and invalid requested snapshot rows become the existing dependency
failure; these tests do not establish real database isolation or the legacy lazy
cache's availability behavior. Owner building/context restoration is described below;
residency and final endpoint composition still remain pending.

`controllers/world-resource-generals` now converts the general portion of this raw
snapshot into ordered general/equipment state. Saved talent, operation-time and base
skill maps are validated before assignment filtering, including overwritten general
rows. Nullable primitive state/star fields default to zero. State is a Java byte in
the reference: values outside -128 through 127 reject rather than wrap, following
the bundled JDBC driver's default read-truncation checks. Nondefault driver settings
are not claimed equivalent. Bound strings retain their existing storage limits;
general, status and equipment input collections are capped at 4,096 rows each.

Status associations retain exact nullable Long timestamps. Orphan statuses and
equipment are ignored without ownership repair. Transferred owners skip status and
equipment restoration entirely. A present general's equipment catalog is looked up
before its state is examined: a missing item definition fails restoration even for
state 4. That state skips binding; other states require a nonnull slot, preserve its
exact text (including empty strings), and keep the last loaded piece for that slot.
The ordinary player's worn flag is not used for general equipment. No rows are mutated.

General IDs and equipment slots traverse fresh Java 8 ConcurrentHashMaps through the
shared messages order model. Updating an existing key deep in a collision bucket can
trigger treeification or resizing without increasing the entry count; both insertion
and replacement histories are retained. This differs from simply sorting IDs or
deduplicating before map restoration, and can change Float cancellation. Ten added
unit tests include 116 independent Java 8 Integer-map and 20 String-map fixtures,
duplicate slot selection, relocation, malformed unused content and composition with
the general effect failure boundary. Only JDK collections and synthetic values were
executed to produce those fixtures; no private game classes were run.

This projection defines fresh-map traversal from the repository's stable SQL ordering.
It does not reconstruct historical resident caches or the legacy database's unspecified
row order. Residency, authoritative expedition state and maximum
collection time still need composition before occupied-resource responses can be
enabled. All current evidence is server-side unit coverage.

`controllers/world-resource-owner-context` now selects the requested building by item
ID after fresh String ConcurrentHashMap restoration of UUIDs. The default target is
the stronghold. Multiple buildings of that type select the first map entry, not the
highest level or first SQL row. Duplicate UUIDs retain the final loaded record. The
main-building level adds level and star with signed Int wrapping; nullable primitive
stars default to zero. An absent requested building returns before general content,
equipment modifiers or status clocks are consumed.

The controller connects the restored generals and building state to the concrete
equipment/building effect composition. Player level, prestige and office getters defer
restoration until the eligibility branch requests them. Direct assignments therefore
do not fail because of unused official catalog or prestige data. Reached restoration
errors retain the whole-general-module zero fallback, including sums accumulated by
earlier generals. No office repairs, building initialization or data writes occur.

Official prestige selects the owner's current civilization, including type zero,
without applying the ordinary civilization-effect feature gate. Missing saved records
or unmatched ranges yield level zero. The first matching range uses exact signed Long
comparisons: one positive threshold is inclusive above, one nonpositive threshold is
exclusive below, and two thresholds form a half-open interval. Whole-separator parsing
retains malformed trailing values and rejects them when consumed. Level parsing occurs
only after a match. `reputation_level` now retains all ordered XML records alongside
its final-definition ID index; both official and ordinary prestige lookup use the
ordered records, preserving overlapping ranges and duplicate IDs.

Official and refinement features use the saved owner's app version, not an observer's
version. Null and Java-blank owner versions skip version comparison while retaining
the configured feature, execution-realm and time gates. The execution realm remains
separate from saved home/cross-fight origin. Nonblank general feature versions parse
all supplied dot-separated Java Integer components, ignoring empty segments, before
short-circuit comparison of the first three components. Missing components fail only
when comparison reaches them; malformed extra components still fail parsing.
Seventeen added unit tests cover these projections, deferred failures, overflow,
exact Long thresholds, duplicate catalog
records, resource loading and ordinary prestige regression. This supplies the general
owner projection; ordinary modifier composition is described below, and complete
occupied-resource responses remain pending. Function-on realm parsing now uses the
ordered Java-compatible selector described above; lenient legacy dates remain pending.

`controllers/world-resource-owner-effects` now composes the resource owner's saved
abilities and ordinary effects with the building/general projection. It reads world
effects for the execution realm and reads that realm's emperor version only when
saved throne reward records require it. The cache methods and runtime service wiring
accept an explicit destination realm; calls without one retain their local default.
Saved home/cross-fight origin and observer version do not replace the execution realm
or the owner's version. Persisted-owner contexts explicitly opt into legacy player
version comparison for ordinary feature gates; other contexts retain their existing
strict version checks.

Ordinary load effects 78/2196 and general-only 133 are resolved first. Bound general
equipment resolves its color/site/all-equipment modifiers from the same current owner
state, without mixing general pieces into the player's worn-equipment collection.
The concrete building contribution retains its own zero-on-failure boundary.
Conditional 895 resolution consumes the saved expedition phase only after its
feature and merge gates and retains its separate fallback. Missing world dependencies, malformed
abilities, invalid ordinary effect state and unavailable required emperor state fail
the composition instead of returning fabricated zero modifiers. An explicit no-emperor
state remains different from an unavailable emperor version.

Thirteen additional unit tests cover this composition through raw troop-load arithmetic,
owner version handling, world expiration, missing dependencies, moved-owner state,
separate failure boundaries and destination cache routing. Redis commands are replaced
with in-memory doubles; no connections or listeners are created. The cache reads occur
after the persisted snapshot, without cross-store atomicity. The endpoint still needs
expedition runtime synchronization, resident-owner policy, decoded ownership checks
and runtime maximum collection time. It must also avoid consuming owner effects on
the cached-load or no-applicable-troop branches.

`controllers/world-resource-expedition` now connects effect 895 to the cache phase
reader using the execution realm. The `merge_server.k5` list uses Java Integer
parsing, including every supplied member before membership is checked. Missing item
records fail; missing or blank lists mean no merged realms. The effective owner realm
uses `crossFightSrcServerId` unless it is exactly -1, when `serverId` is used. Other
nonpositive origin values do not fall back to the saved home realm. Only phase 3 and
an effective home equal to the execution realm reach effect resolution. Missing phase
data, malformed merge rules and failed stage/effect reads return zero for 895 alone.

Seven added in-memory unit tests cover all phase values, invalid/absent records,
explicit destination routing, merge parsing, origin selection, skipped dependencies
and the isolated fallback. The normalized persisted-phase reader does not reproduce
the Java module's startup initialization, minute-synchronized runtime cache,
thread-local stage override or event transitions. Importers/writers must maintain
the phase field; scheduling and writes are not implemented by this read. These limits
remain distinct from the pending occupied-resource wire command.

An absent fallback profile supplies no current owner modifiers; a resident profile
requires explicit effects for troops with a load catalog entry. Catalog entries
without a load field skip the troop. Malformed required fields reject. Snapshots
are bounded to 4,096 troop entries and remain unchanged by calculation, including
the cached load. Seven units include 2,400 independently authored Java 8 arithmetic
vectors, cached/fallback paths, Unicode integer catalog parsing, overflow, float
special values and composition with resource weight/plunder. Fixtures contain only
synthetic primitive inputs and outputs.

`messages/world-resource-army` decodes the saved troop object into an owner ID,
cached load and ordered troop records. It validates the army and soldier stream
class names, serial UIDs and consumed field types. Missing compatible fields retain
Java defaults; null roots/lists remain null. It accepts the canonical Java 8
ArrayList and LinkedList forms, preserving duplicates and shared entries as
independent projected records. The projection also keeps each troop's saved owner
and nullable troop ID so a later resolver can validate ownership and required data.

The internal object-stream reader interprets serialization bytes as data. It handles
default serializable class fields, superclass slots, references/cycles, enums,
primitive/object arrays and framed custom-write data without loading classes or
invoking constructors, read hooks, replacement hooks or methods. Unused companion,
general and effect graphs are traversed structurally and omitted from the result;
their class metadata is not treated as executable code or validated as gameplay
state. Externalizable/proxy descriptors, resets, exception tokens and unframed
custom serialization are unsupported. This is a bounded saved-data reader, not a
general Java deserialization runtime.

Limits include the existing 65,535-byte army column bound, nesting depth 32,
16,384 handles, 256 fields per descriptor, 4,096 entries in troop lists and object
arrays, and a 32,768 parsing-operation budget. Primitive byte arrays may use the column bound;
other primitive arrays are capped at 4,096 entries. Nine units use independently
authored synthetic DTOs serialized by Java 8, with compatibility class metadata
mapped by the fixture writer. No private game classes are compiled or executed.
Evidence includes shared/cyclic auxiliary graphs, collection forms, modified UTF-8,
schema defaults, malformed handles/counts, every truncated fixture prefix and
composition with the raw-load rule. Null or unwell-formed saved values are not
silently converted into valid gameplay inputs.

The point repository now reads the pointed resource march for types 3/37 when
both owner ID and march UUID are nonblank. That read shares the point/owner snapshot,
including the destination snapshot for remote requests. Selection uses the saved
UUID alone, matching the reference's march index; it does not substitute a world,
destination or occupancy-state search. The snapshot retains those metadata fields
for subsequent resolution, even when they differ from the point. It rejects a row
with another UUID or owner and duplicate rows, rather than expose another owner's
saved army through an inconsistent point pointer.

Only army bytes, collection speed/times, collected-before-speed-change count and
plunder text are read alongside identity metadata. Exploration reports, combat
payloads and unrelated march columns are omitted. Nullable columns retain null;
Int64 values stay bigint, and PostgreSQL real values are normalized to Float32.
Payload sizes follow existing column bounds. Missing marches remain explicitly
absent; no ownership repair, fake zero-load army or scheduling is performed. The
readiness probe includes these columns with limit zero. Eight additional synthetic
adapter units cover local/remote snapshots, pointer selection, omitted reads,
nullable/bounded payloads, Float32 normalization, precision, authorization and rollback.

`messages/legacy-json` also decodes root arrays through the same bounded parser
used for stored mailbox structures. The resource controller's plunder restoration
maps SQL null to the model's initial empty array. A nonnull value must parse as an
array, including when its entries will not be used for load subtraction. Only a
single object can contribute `v`, and that value must retain its SFS Int type;
strings, Longs, Doubles, nulls and duplicate-key arrays are not coerced. Missing `v`
contributes nothing. Multiple entries and territory types 18/19 skip the value cast,
matching the reference's access order. Malformed arrays and retained function/hole
values still reject. The persisted text is limited to the column's 2,048 characters.

`resourceSavedCollection` restores the saved collection fields independently of raw
army load and runtime maximum collection time. Nullable primitive columns default
to zero; times remain exact signed Long values, speed becomes Float32 and the
collected-before-speed-change count becomes Int. That count is bigint in the
TypeScript storage schema but INTEGER in the reference mapper and int in its model.
Out-of-Int-range values reject rather than wrap, consistent with the bundled JDBC
driver's default truncation-check setting; nondefault driver configurations are not
claimed equivalent. Restoring these fields neither advances collection nor writes
the saved row.

Nine added units cover 459 frozen numeric-oracle outcomes, 28 frozen array-structure
outcomes, permissive legacy syntax, typed plunder access, nullable primitives,
signed-width boundaries and composition through resource arithmetic and SFS binary
encoding. The JSON parser remains separate from the controller's resource-specific
access rules and the pure collection arithmetic.

The saved-data decoder and raw-load calculation are not yet composed into the
occupied-resource command. The controller now connects decoded army ownership and
per-troop modifier resolution, but the endpoint still needs explicit residency,
collection-state composition and runtime timing before it can return the full
resource projection. A database read is not evidence that an owner
was resident in the reference process. The runtime-only maximum collection time is assigned by destination-march rescheduling;
it is not a persisted march column. Restoring its read value still needs an explicit
policy backed by that lifecycle, without scheduling work from the query. This pure
calculation does not make occupied-resource responses available yet.

`controllers/world-resource-army-load` consumes the decoded army and an explicit
march-owner/residency pair. The nonblank root owner must match the march before any
cached return. This is the persisted-state consistency boundary; it rejects foreign
army data instead of following the legacy getter into another player's profile.
Soldier owner fields are unused by this calculation and never select the effect owner.
The effect snapshot must match the march owner when an applicable troop needs it.

A nonresident owner with positive saved load returns before troop traversal and
owner-effect access. Otherwise each troop's catalog load and signed base calculation
precede current-owner effects; missing load fields skip the troop. Concrete owner
modifiers are read separately for each applicable troop, retaining dependency and
clock evaluation order rather than caching the first troop's result for the army.
An absent fallback owner contributes no current modifiers. Missing required resident
owner state fails on the first applicable troop. The shared rule primitives preserve
the previously verified Float order, casts, signed count arithmetic and final Int sum.

Nine additional synthetic units cover decoded armies, cached and empty branches,
unused fields, owner consistency, per-troop reads, failures without partial results
and input immutability. The existing 2,400 arithmetic vectors also cover the shared
primitives after extraction. These reads do not update `armyLoad`, persist data or
establish historical profile-cache residency. The caller must still supply a runtime
residency decision; the wire command does not invoke this controller yet.

The point/owner read foundation below now supplies lookup, observer authorization,
local/remote routing and base owner fields. Specialized point projections,
existing-march restoration and command composition remain pending.
Raw troop load and runtime-only `maxCollectTime` must be resolved explicitly; the
persisted march row alone does not provide both values. The read path must not
silently schedule marches, start combat or repair ownership. This foundation does
not establish full point-detail compatibility or complete topic 5.

For local neutral-resource type 60, `sp_resources.xml` is loaded optionally into
`Rules.world.neutralResources`, retaining the final duplicate ID definition. When
the point item is nonblank, the reader selects one state-1 march by destination ID
in the same read-only snapshot as the point. It selects only UUID, destination,
world, state and resource end time; army data and report blobs are not read. Missing
marches omit `occupybegintime` without consulting the catalog. Blank items skip
both the march query and duration lookup. The point's owner/name occupancy flag
does not suppress this branch.

The ordinary-realm reference destination index ignores the supplied world ID and
does not restrict march owner, so those extra filters are not introduced. Selection
uses database UUID ascending order with limit one. The Java set contains march
objects with identity-based hashes, and saved rows do not retain that process's
traversal order. This deterministic selection is a documented restoration difference;
it does not claim historical first-march equivalence or implement the per-world
indexes of special battle/neutral server processes.

`occupybegintime` is an exact SFS Long: stored `occupyResourceEndTime` minus signed
Java Int `gather_time` widened to Long and multiplied by 1,000. Nullable end time
defaults to zero; negative durations and signed-long wrapping are preserved.
Missing/malformed required catalog data rejects instead of inventing a timestamp.
The literal item string `null` is nonblank and requires its own catalog record when
a march exists. Five added command/adapter units cover selection across owners and
worlds, omitted fields, malformed dependencies, authorization, exact numeric
boundaries and failure rollback; a loader unit covers optional files and duplicates.

## World point and owner read foundation

`repositories/world-point-detail` supplies a read-only snapshot for
`world.get.detail`. Its port and readiness helper are composed into
the runtime through `GameServices.worldPointDetail` for the local and remote branches listed above.
The current ordinary-realm implementation uses existing tables and adds
no schema or configuration. It does not start a march, repair ownership, create
missing player/statistics rows or mutate caches.

`rules/world-point-detail` normalizes omitted/`-1` server IDs to the local kingdom.
The reader validates the observer UID, local realm and ban state before any world
or target reads. Nonpositive signed point IDs require no world lookup. Positive IDs
require the observer's existing `user_world` row. A local point is selected by both
ID and that world's ID; a configured remote realm is read at world zero, after the
local authorization transaction commits. Remote access uses the supplied public-read
database topology without a global account-directory lookup. Unknown realms fail
explicitly. Missing points remain absent in the snapshot rather than becoming a
fabricated resource or empty owner; the connected command maps their absence to
`E100169`. Supported remote branches use the separate projection and JSON conversion
described above; pending occupied-resource and territory state still rejects.

Each realm read uses a read-only repeatable-read transaction. Point and owner data
share that transaction; local authorization and remote reads are not atomic together.
Readiness probes select only required columns with limit zero. Invalid dependencies,
ambiguous rows and failed transactions produce a sanitized dependency error. The
ordinary-realm registration rule is not an implementation of cross-fight-server
registration behavior.

| Base owner field    | Selection and presentation                                                                                                                                                                                                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uid`               | Nonblank point owner ID; Java whitespace rules also determine occupancy from either owner ID or owner name. Local monster-boss type 15 returns before this field.                                                                                                                                        |
| `registerTime`      | Long, initially the existing owner's profile time or zero if no profile exists. With a profile, the chosen registration record can raise this value: type 2 takes priority, otherwise the latest timestamp is used. Equal-time records use type order as a deterministic tie-breaker.                    |
| `pic`               | String for cities (1/2), resources (3/37), relics (4) and towers (5). Missing profiles supply an empty string; a null picture on an existing profile rejects, matching the reference SFS non-null string requirement.                                                                                    |
| `power`, `killArmy` | Exact Long fields for cities with an existing owner profile; missing statistics reject. Nullable stored primitive counters use zero. No statistics are invented when the owner profile is absent.                                                                                                        |
| `afn`               | Optional abbreviation from the alliance recorded on the point, for cities and ordinary resources. Empty abbreviations are retained; missing/null abbreviations are omitted.                                                                                                                              |
| `rank`, `vl`        | Int membership rank defaults to zero. Membership lookup uses owner UID, including the reference database fallback when point/profile alliance membership differs. Cities emit rank only with a nonblank point alliance; ordinary resources always emit rank. Both emit `vl: 0`; new resources omit both. |

Local monster type 6 stops base-owner projection after UID, and local monster-boss
type 15 has no base owner fields. The specialized exploration/HP projection foundation
is documented below and is connected for local queries.
Remote reads do not take these observer-specific early exits. Territory
and other specialized additions are also pending; the base fields alone are not a
complete response. The DTO preserves direct/local SFS field types; the remote
command subsequently applies the bounded legacy JSON conversion described above.

Current database snapshots replace the legacy process-local profile, statistics
and alliance caches. This can expose persisted updates sooner and does not reproduce
unpersisted in-memory changes, stale cache contents or invalidation timing. Cache
equivalence and live database snapshot behavior are not claimed.

Sixteen unit tests compose the actual Drizzle reader with synthetic query clients
and the pure owner projection. They cover all point-kind base-field omissions,
local/remote world selection, authorization, migration-record priority, missing
and inconsistent rows, exact numeric wire types, failure rollback, captured query
inputs and read-only readiness. No database, service, listener or client is started.

## World monster detail foundation

`rules/world-monster-detail` and `dtos/world-monster-detail` supply local monster
detail fields for the implemented local `world.get.detail` branches. `loadRules` now loads
optional `field_monster.xml` and `army.xml` into `Rules.world.fieldMonsters` and
`Rules.world.armies`. The `army` formation catalog is distinct from the existing
`arms` troop-attribute catalog. Both new catalogs retain the final definition of a
duplicate ID, matching the reference cache loader; absent files produce empty maps.
Used missing records or malformed required counts reject rather than invent HP.

For local monster-boss type 15, `mchp` is the point's current HP and `mmhp` is the
catalog-derived maximum, both SFS Ints. Nullable current HP defaults to the Java
primitive zero. Blank item IDs give maximum zero. An exact `NPC="1"` uses signed
Java integer `Gift`; other records sum army formation counts. Semicolon-separated
army IDs and pipe-separated formations ignore empty tokens, retain repeated IDs
and count only entries with exactly two nonempty semicolon-separated components.
Counts retain Java decimal parsing, negative values and signed 32-bit wrapping.
Missing formation `arm` attributes contribute no count. The maximum-HP helper also
supports field-monster type 9, but the point-detail health projection is restricted
to local type 15, preserving the reference's early return before owner UID fields.

For local monster type 6, exploration uses the first matching destination from the
supplied ordered owner-march snapshot, then checks for OCCUPY state 1. An earlier
march in another state suppresses later occupying matches. The rule does not add
world or march-type filters absent from the reference accessor. No matching march
or a nonoccupying first match adds no exploration fields. A matching occupied march
adds `erp` as an SFS array, `st` as its exact Long start time and `et` as arrival time
plus exploration duration with signed 64-bit wrapping. This uses `arrivalTime`,
not the separate `marchArrivalTime`. Nullable stored arrival/duration primitives
default to zero. A missing report becomes an empty array; present reports decode
from bounded root SFS-array binary data and preserve nested type tags and longs.

The rule consumes an ordered march snapshot. The connected reader fetches up to
4,096 owned metadata rows, with a 4,097th-row overflow check, in the same read-only
snapshot as the point. The controller sorts UUIDs by UTF-16 code units and reconstructs
a fresh Java 8 concurrent-map traversal using the existing verified map-order helper.
Selection uses that traversal, not UUID order directly, and occurs before any
occupancy check. Only the selected report is then read by both UUID and owner; other
report blobs are not loaded. Foreign/duplicate metadata, a missing selected report
row or failed reads reject rather than return an empty exploration result.

This is a canonical persisted-state query order. The database does not retain the
legacy process map's original insertion/deletion history, high-water capacity or global-to-owner
map restoration order, so historical traversal equivalence is not claimed. Reads
use current persisted marches and do not run the reference login's expired-return
cleanup. No world, march-type or OCCUPY-only SQL filter replaces the reference
destination-first selection. The reader does not create, restore, schedule or advance
marches. Remote queries omit these observer-specific monster additions and use the
base-field JSON conversion described above.

Eleven unit tests cover the rules and projections, including a manually specified
binary report fixture, exact boundary arithmetic, missing catalogs, owner identity,
selection order and malformed binary payloads. A resource-loader unit test covers
optional files, final duplicates and separation from `arms`. Root SFS array helpers
use the existing codec's size, depth and element budgets; trailing bytes, malformed
UTF-8, invalid tags and duplicate object keys reject rather than reproduce every
permissive legacy decoding path. Report inputs retain the existing 65,535-byte
storage limit and are copied before use. No private game classes, client, database
or service are executed by these tests.

## Realm avatar grants

`user.avatar.grant`, tracked in [issue #76](https://github.com/ReeseArch64/opencok/issues/76),
returns `owner` (String), `sequence` (Int), `grant` (String) and `pendingHash` (String).
It requires an authenticated numeric owner and, when supplied, an exactly matching
String `gameuid`. Request version, sequence and endpoint fields cannot override stored
state. Correlation is retained; grant issuance changes no profile, upload record or
mail and emits no push. `user.avatar.finish` is now available under the separate completion
configuration below. Direct `user.update.picVer` remains unsupported.

The repository locks the owner's durable profile in a repeatable-read transaction and
rejects missing, foreign, misplaced or banned profiles before eligibility or files reads.
The nonnegative signed-32-bit encoded picture version supplies its last six digits;
the next sequence must remain within 1–999999. Only `function_on5.k2` exactly equal to
`0` bypasses eligibility. Otherwise the raw stronghold level must meet `hero.k9`, then
an existing upload record applies the `hero.k7` seconds cooldown followed by its report
ban. Missing castles have level zero. Missing upload records skip cooldown configuration
parsing. Rules preserve Java signed parsing, 64-bit arithmetic wrapping, inclusive
eligibility deadlines and the level/cooldown/ban error precedence (`105775`, `105769`,
`105770`). Castle and record reads are lazy, owner-bound and limited to the required fields.

Configure `GAME_FILES_URL` as the internal HTTP(S) origin reachable from the realm and
`FILES_SIGNING_KEY_FILE` as an explicit path to the protected 32-byte key used by the files
service. The file contains 64 lowercase hex characters with an optional final newline.
No key is generated, replaced or logged. The origin accepts no path, embedded credentials,
query or fragment. An absent origin keeps issuance unsupported; invalid configuration,
an unreadable key or an unavailable upload-record table fails configured startup.
Development Compose does not forward these settings or mount the key automatically;
an operator override must provide both settings and a read-only key mount. The files
service itself is also provisioned separately.

The realm reads `/_internal/avatars/{owner}/{sequence}` using a separate 30-second
confirmation signature. `DEPENDENCY_TIMEOUT_MS` bounds the whole exchange, including
streamed response consumption while the profile lock is held. Redirects reject, receipts
are limited to 128 bytes, and owner, canonical sequence and SHA-256 must match. An empty
404 means no pending upload. Other failed or malformed responses prevent a grant, with
sanitized errors and no automatic retry. The resulting upload grant has a fresh random
nonce and a 120-second lifetime. An existing valid receipt supplies `pendingHash`, allowing
a caller to recognize an upload already stored for that sequence.

The maintained files service verifies immutable S3 receipts and actual object bytes. It
has no historical filesystem `completed` marker; the durable profile version is the
sequence authority. This slice does not establish equivalence for independently restored
profile/object state or reset versions. The completion path below now verifies receipts,
commits profile/upload state and coordinates mail, metadata publication and notifications.

Socket-free unit tests compose the realm command with the maintained files handler and
synthetic storage, and inspect generated SQL through a synthetic database client. They
cover ownership, eligibility, expiry, pending receipts, fresh retries, exact wire types,
rollback, bounded responses and timeouts. No real database, object store, listener, client
or ADB execution is used. Real concurrency and deployment behavior remain unverified.

## Avatar completion transaction foundation

[Issue #77](https://github.com/ReeseArch64/opencok/issues/77) adds the internal
`controllers/avatar-finish` workflow and `repositories/avatar-finish` transaction.
They are connected through the opt-in runtime composition described below.
The migration is generated only; this work has not changed a running realm or database.

Every attempt locks and authorizes the owner profile and verifies the requested
`sequence:sha256` against the maintained files receipt, including repeated and older
receipts. A same-sequence request returns the current durable version without applying
eligibility or effects again. If no completion receipt exists for that current version,
it stores an observed receipt with no pending effects, matching the legacy completion
marker without inventing past notifications. Such receipts record their observation time,
not an inferred original commit time, and accept any nonnegative encoded picture state. An older receipt returns the current version with
`superseded: true`. A future sequence must be exactly next and have no prior completion
receipt. A stored completion prevents reuse after an isolated profile version reset;
it cannot reconstruct historical filesystem markers or recover independently restored
object and database snapshots.

An advancing request rechecks raw castle level, cooldown and report ban. Finish differs
from grant: a missing `function_on5.k2` is invalid, and `hero.k7` is parsed after the level
check but before reading the upload record, even if no record exists. The exact `0`
bypass stores `2000000 + sequence` (Waiting) and leaves moderation records unchanged.
Otherwise the record gets the new sequence, zero reports, current millisecond timestamp
and WAITING status, preserving existing ban count/time. New records explicitly initialize
those ban fields to zero. Java signed-long overflow and exact deadlines remain covered.

The profile update, moderation upsert and immutable `avatar_completion` receipt share
one repeatable-read transaction. The receipt contains owner/sequence, SHA-256, committed
picture version/time, a bounded versioned JSON effect snapshot and pending-effect bits.
Bit 1 represents system mail, bit 2 profile timestamp publication, and bit 4 chat metadata
publication. A nonempty supplied XML mail template is copied for later delivery; missing
or empty templates retain the legacy no-mail behavior. The snapshot retains profile name,
platform and the commit timestamp in seconds, avoiding a later lookup of changed intent.
Each owner may have at most 1,000 pending completions; saturation rejects before writes.
Unlike the legacy best-effort filesystem marker, an observed receipt write must succeed
or the request fails. This preserves database replay protection instead of silently
acknowledging missing history.
Delivery must clear only the successfully applied bits, never delete the receipt.

Repository boundaries validate the plan and owned reads, preserve report-ban fields on
upsert, condition the profile write on the locked version, and roll back every local
write if any step fails. Readers cannot escape the transaction. An uncertain commit is
resolved by a fresh verified retry: a committed version skips the mutation and retains
one effect record. There is no automatic transaction retry. Actual PostgreSQL concurrency
and isolation behavior have not been exercised; SQL and failure paths use synthetic
clients only.

The authorized mail catalog and internal system-mail consumer are now implemented as
described below. The internal profile-marker and chat metadata consumers are implemented
below, together with their command/notification/runtime composition. Persisted intents
alone are not evidence of delivered mail or updated caches; delivery clears independent bits.

## Avatar system-mail delivery

[Issue #78](https://github.com/ReeseArch64/opencok/issues/78) adds the internal consumer
for pending mail bit 1. The resource loader reads optional authorized `mail.xml`, preserving
strings and the final duplicate definition. Completion captures template `10111` by default;
a missing catalog/template retains the legacy no-mail outcome. Templates are copied before
asynchronous work and serialized in the completion receipt, so subsequent XML edits do not
change already committed mail intent.

Static source inspection and read-only disassembly of the supplied compiled mail sender
corrected an earlier assumption: the two `mail` overloads do not invoke `getCheckInfo`.
The capacity/discard helper exists but is not called by this path. Accordingly, this
consumer does not prune the mailbox, redeem old rewards, reuse an older message or inherit
saved flags. It creates a new unread unsaved message. The earlier capacity/reward-retention
prerequisite for avatar completion is withdrawn; unrelated mailbox behavior is unaffected.

Projection preserves the exact blank/`0` notice-type branch, sender/title Java trimming,
two-code-unit category suffix and signed 32-bit share shift. Normal system mail has type 2
and a UID group; notice type 15 has no group. The reference avatar template has no reward.
Literal comma-containing reward strings retain the legacy encoded bytes; symbolic reward
IDs require an explicit resolver and otherwise fail without acknowledgment. This slice does
not implement the full reward-ID resolver or grant attached rewards.

Text encoding preserves Java 8's UTF-8 encoder backing-array capacity, including trailing
zero bytes, rather than replacing it with a tightly sized byte array. The 40,000-byte
extra-content threshold therefore applies to that encoded capacity. Exact `MAILTEST` also
uses owned `mail_contents`; primary contents become `extra`. Blank message bodies reject
before writes because the maintained primary contents column is non-nullable. Fifty-seven
frozen synthetic Java 8 vectors cover ASCII, Unicode, BOM, trimming and threshold lengths;
normal unit runs do not start Java or read the private reference inputs.

`repositories/avatar-mail` locks the owning profile before the completion row, consistent
with completion's lock order. Already committed intent can be delivered to an existing
owner even if the account is subsequently banned; a missing or misplaced owner is skipped.
A stable domain-separated digest of owner/sequence/hash supplies the mail ID stem. The
message, optional extra row, UID group and clearing of bit 1 commit together. Other pending
bits and all completion history remain unchanged. Collisions reject instead of overwriting
existing mail. A repeat after acknowledgment does not insert again, even if the mail was
later deleted. Failure or an uncertain commit is resolved by retry against the durable bit.
The creation timestamp comes from the captured completion time, not the relay's wall clock.

The returned message has a tested `push.mail` projection: base fields, exact SFS types,
normal-group counts of one, and optional full fields controlled by the caller's chat-mail
switch. The default reference sender does not include a separate `contents` field. Full
metadata uses `contentsLocal` and expands literal backslash-n sequences. Push projection
is now consumed by the runtime coordinator below. No listener or live service was started
for validation; notifications are tested through simulated connections.

## Avatar profile-marker publication

[Issue #79](https://github.com/ReeseArch64/opencok/issues/79) adds the internal consumer
for pending profile/cache bit 2. `rules/avatar-profile` validates captured owner, realm,
sequence, picture version, commit time and metadata before publication. The timestamp is
an exact epoch-second decimal string derived from the receipt's millisecond time; name
and platform come from the captured snapshot. This does not write new progression or
send chat metadata.

`Cache.publishPlayerUpdateTime` writes the existing
`opencok:kingdom:<realm>:player-update:<uid>` key used by profile query readers. It uses
one Lua command with exact decimal comparison, not floating-point conversion. A newer
marker wins over a late older publication, equal markers are idempotent, and legacy
leading-zero values compare by their normalized numeric value. Missing or empty values
are initialized. Malformed nonempty values, values outside signed-long range and invalid
Redis replies fail with a sanitized dependency error. The caller supplies canonical
nonnegative decimal timestamps; the realm is taken from cache configuration.

Markers have no TTL, matching the reference. The monotonic maximum is an intentional
reliability guarantee for reordered durable delivery; a future-valued marker is retained
instead of being overwritten by an older event. Redis is only a query-cache marker.
The durable picture version and delivery history stay in PostgreSQL. Cache loss does not
reapply profile changes; existing readers return missing markers through their established
fallbacks (including an empty `lastUpdateTime` in public profile replies). This slice does
not add automatic replay of already acknowledged history after cache loss.

`repositories/avatar-profile` takes the owner lock before the completion lock, publishes
through a deadline-bounded port, then clears only bit 2. Missing/misplaced owners and
already acknowledged work do not publish. Failures before acknowledgment roll back the
bit change while retaining mail/chat bits and receipt history. An external write may
succeed before a database failure or a timeout; retry is safe because the writer is
idempotent and monotonic. The port receives an abort signal. A late response cannot
acknowledge rolled-back work, although an adapter unable to cancel an in-flight Redis
command may still complete its safe external write. Actual Redis commands retain the
configured connection/operation timeout in the existing cache adapter.

Unit evidence includes 154 frozen cases from the exact Lua script executed with an
isolated Lua 5.1 engine and synthetic GET/SET functions. A script digest ties that oracle
to the maintained implementation; ordinary tests need neither Lua nor Redis. Tests also
compose publication with the existing marker reader and simulate SQL failures, uncertain
commits, deadlines, out-of-order updates, realm isolation and malformed projections.
No listener, Redis/PostgreSQL service, migration or client is exercised. The consumer is
now started by the opt-in completion runtime described below, along with the chat consumer.

## Avatar chat metadata publication

[Issue #80](https://github.com/ReeseArch64/opencok/issues/80) implements the internal
`publishAvatarChat` consumer for pending bit 4. It shares owner/completion locking and
bounded publication with the profile-marker consumer, while each entry point clears only
its own bit. `avatarChatUpdate` validates captured metadata even after bit 2 was delivered.
Mail bits and immutable completion history survive either publication.

`connection/chat-avatar-profile` signs the captured snapshot and sends it to the chat
service's exact private `/_internal/avatar-profile` endpoint. The adapter requires a
configured HTTP(S) URL without credentials/query/fragment, the existing shared signing
secret and a 100–30,000 ms timeout. It bounds requests to 4 KiB and JSON responses to
16 KiB, rejects redirects, honors the consumer abort signal through body consumption and
accepts only a matching owner/realm/sequence acknowledgment. It does not automatically
retry. Invalid responses and dependency errors are sanitized. The completion runtime below supplies the explicit endpoint and recovery worker.

The [chat receiver contract](../chat/README.md#internal-avatar-metadata) describes durable
sequence ordering and account routing checks. If chat commits but the response or realm
commit fails, bit 4 remains retryable. A repeated identical snapshot is accepted without
another write; a snapshot already overtaken by a newer avatar sequence can also clear its
old bit. A same-sequence conflicting snapshot fails and remains pending. A response after
the consumer deadline cannot acknowledge rolled-back work. An uncertain chat transaction
may finish after cancellation, but its write is idempotent.

Unit tests compose the actual realm consumer, HTTP adapter, receiver and chat repository
with synthetic database clients, including SQL lock order, commit loss, ownership checks,
clock rollback, input bounds, signatures and deadlines. No listener, service, database,
ADB or client is started. Global migration `0002_chat_avatar_profiles` is generated only.
The opt-in completion runtime now schedules this consumer.

## Avatar completion runtime

[Issue #81](https://github.com/ReeseArch64/opencok/issues/81) connects
`user.avatar.finish` to the maintained receipt transaction, all three consumers and local
session notifications. Enable it with `GAME_AVATAR_CHAT_URL` pointing to the chat service's
exact private `/_internal/avatar-profile` endpoint, matching `CHAT_SIGNING_SECRET`, and
the existing `GAME_FILES_URL`/`FILES_SIGNING_KEY_FILE` integration. The completion endpoint
is independent of chat session issuance. Missing settings leave finish unsupported;
configured startup checks the completion and mail tables. Previously generated kingdom
`0006_avatar_completions` and global `0002_chat_avatar_profiles` must be provisioned
through the deployment workflow; startup never applies migrations. Compose still needs
an explicit operator override and read-only key mount. No new external dependency or
schema is introduced here; the existing rules workspace becomes a server runtime dependency.

The authenticated command accepts a String `receipt` containing `sequence:sha256`, and
an optional String `gameuid` must match the session. It returns String `uid`, Int `picVer`
and Bool `superseded`, and emits an independent copy as `push.picVer.update`. Correlation
fields appear only in the command reply. Verified repeated/current/older receipts use
durable state without reapplying moderation or creating duplicate mail. Direct
`user.update.picVer` remains unsupported. A failed completion attempt gets one bounded
recovery read through the same authorization and file verification path: recovery requires
an existing matching completion receipt and a durable version at least as advanced, and
cannot execute the mutation inspector or create an observed receipt. It resolves a lost
commit reply without automatically retrying a progression write.

Before a new moderated completion commits, its captured system mail must materialize
through the maintained mail rules. Missing templates retain the no-mail behavior; invalid
or symbolic reward templates without a resolver reject before progression is changed.
The reference avatar notice has no reward. This preflight does not extend support to
custom reward-ID resolution. Existing unmaterializable pending records remain pending and
produce sanitized failure categories rather than being discarded.

After a confirmed commit, mail, cache and chat delivery are attempted independently.
Their failures leave the respective bits pending and do not turn committed progression
into a failure response. Successful mail insertion can emit `push.mail` using the exact
`chat_switch.k3` token `1` for full fields. Online notifications are best effort, matching
the legacy push boundary: offline/disconnected recipients recover their durable mail
through mailbox reads, and a lost notification never recreates a deleted or acknowledged
message. There is no exactly-once notification guarantee.

A scoped worker selects one pending owner/sequence every five seconds after its preceding
attempt finishes. Its keyset cursor advances before delivery, passes failing entries,
and wraps after reaching the end. Selection joins the current local profile realm; each
consumer locks and revalidates ownership. Workers and request delivery can encounter the
same record, but durable bit checks make acknowledged work idempotent. Each external
publication has the configured deadline. Shutdown cancels scheduling, drains active work
before releasing the database, and never starts a new delivery after an outstanding
selection finishes. The cursor is ephemeral; restarting safely begins at the first key.
This initial throughput and real multi-process SQL concurrency remain unmeasured.

Local notification subscriptions are installed only after authenticated initialization.
Delivery checks readiness, the current local session and its Redis ownership token, then
rechecks the session after the asynchronous ownership check. Disconnect and replacement
remove only the matching subscription. No public notification route is added. Unit tests
use EventEmitter-based connection objects and encoded SFS frames; no real socket, listener,
service, client or ADB is used. Full media restoration and moderation lifecycle remain
separate migration work.

## Realm chat sessions

`chat.session.create`, tracked in [issue #74](https://github.com/ReeseArch64/opencok/issues/74),
uses the authenticated player's stored profile and returns the maintained chat service's
`session` token and `expire` timestamp in seconds. Request identity, realm, TTL, metadata
and endpoint fields are ignored; command correlation is retained and no push is emitted.
Missing, foreign, misplaced or banned profiles cannot issue sessions. Ordinary kingdoms
send server type `0`. The profile supplies name, level, device ID, country, platform,
application version, language, alliance and phone device; all metadata is sent as strings.
A null phone device becomes empty. Other null metadata rejects, preserving the Java
string-field behavior instead of inventing profile defaults.

Configure `GAME_CHAT_SESSION_URL` with the internal `/external/session` URL reachable from
the realm process and set `CHAT_SIGNING_SECRET` to the chat service's configured value.
The development Compose realm forwards these optional settings; it does not provision a
chat service. An absent URL keeps the command unsupported. URLs require HTTP(S), the exact
route and no embedded credentials, query or fragment; legacy production chat hosts reject.
The game-facing WebSocket endpoint remains the chat service's `CHAT_WEBSOCKET_URL` setting.

The connection adapter signs the legacy form with application ID `100001` and a TTL of
86,400 seconds. The current chat service stores only a SHA-256 token digest. Signature
input includes the unencoded JSON string and sorted form keys; Unicode and reserved form
characters survive encoding. Both the encoded request and streamed response are bounded
to 16 KiB. `DEPENDENCY_TIMEOUT_MS` bounds the exchange including response consumption;
redirects reject. The adapter makes one attempt, leaving retries to a later command rather
than silently minting additional tokens after an uncertain response. A lost response can
leave a valid stored session until expiry; this is not an idempotent issuance operation.
No body, token, signature, secret or upstream error detail is logged by the realm adapter.

Successful replies require a canonical 32-byte base64url token and a future integer expiry.
Expiry uses SFS Int through the signed 32-bit maximum and Long afterward, as confirmed by
an isolated synthetic Java probe. The original code/data wrapper is not exposed. Failed
exchanges return the legacy invalid-operation code; unconfigured issuance is unsupported.
Server-side checks remain authoritative if caller-controlled fields or response extras exist.

Socket-free unit tests compose the realm command, an in-memory HTTP exchange, the maintained
session handler and token verifier. They cover stored-hash identity, exact expiry, fresh
sessions on repeat, profile/realm isolation, signatures, bounded streams, timeouts and
errors. No HTTP listener, WebSocket, database, client or ADB process is exercised. The
shared API/gateway now exposes the chat service's public metadata through its existing
GET paths when `API_CHAT_URL` is configured; see the
[discovery contract](../api/README.md#public-chat-discovery). No new realm login field is
invented. Private-conversation delivery remains separate work; issuing public-room
sessions does not complete `chatMail.read`.

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

| Topic                                     | Implemented evidence                                                                                                                                                                                                                                                                         | Remaining work                                                                                                                                                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Configuration and feature availability | Settings and data-config queries; deferred-login configuration; feature announcements and account-specific eligibility; grouped XML; timed star previews; ordered feature/item/event realm parsing and kingdom-skill tabs; synthetic unit and adapter tests                                  | Lenient dates, version policies and other exceptional catalog behavior. Native-client and real-service validation remain deferred; bosses, commerce and account switching stay outside this wave. |
| 2. Player/progression queries             | Initial player DTO; public summary batches; full ordinary-realm public-profile read command; detailed-power command with modifier composition and unit tests                                                                                                                                 | Full own/reconnect behavior; documented read-versus-write differences, exceptional-state limits and authoritative global-state import.                                                            |
| 3. Ranking queries                        | Ordinary-realm player power, kills, level, castles and contributions; alliance power/kills and paired expedition reads; self positions, capacity/video presentation and synthetic unit coverage                                                                                              | Event and cross-realm families; pagination where supported; documented cache, collation and exceptional-state differences.                                                                        |
| 4. Basic mailbox                          | Category counts; saving/read marking; conversation/type saving; category/paginated message lists and bounded content reads; gift-opening retry; ordinary deletion with atomic related cleanup; group listing with bounded previews, full counts and atomic cleanup; synthetic units          | Content edge cases, batch/category/conversation deletion, conversation read marking and synchronization readers/cleanup; redemption is outside this wave.                                         |
| 5. Additional map queries                 | Base viewport; owned world favorites; map and general player search with configured-realm routing, typed public fields and compatibility pagination; local and remote point-detail command branches, resource arithmetic, owner fields and monster detail reads with synthetic unit coverage | Remaining occupied-resource and specialized point details; search cache/collation/exceptional-state differences; live behavior remains deferred.                                                  |
| 6. Profile/preferences                    | Initial profile reads                                                                                                                                                                                                                                                                        | Nicknames, validation, applicable costs, flags and persisted preferences.                                                                                                                         |
| 7. Avatar integration                     | Files service; realm grants; verified completion with atomic profile/moderation/intent state; mail/cache/chat delivery, recovery relay and typed mail/picture notifications covered by synthetic units                                                                                       | Validate restored-state semantics, moderation lifecycle and remaining legacy picture-version flows. Native-client validation stays deferred.                                                      |
| 8. Basic chat integration                 | Standalone chat service; authenticated realm session issuance; shared API/gateway public discovery; bounded HTTP exchanges and synthetic units                                                                                                                                               | Private conversations and read-state delivery; live cross-service behavior. Native-client validation remains deferred by request.                                                                 |

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
