# Ranking query migration

Topic 3 tracks ranking lists, individual positions, supported pagination and tie
behavior. Score production, event lifecycle, military-rank settlement, rewards,
shops, alliance offices and visibility mutations remain with their authoritative
domains. Query execution does not invoke those writers.

## Published global boards

`attributeRank.info` checks normal-realm metadata before its selector, then
validates the authenticated local owner. Type 0 reads the first 151 entries of
`global_attack_wins_ranking_<realm>`; types 1 and 2 read the first 30 entries of
`global_defence_wins_ranking_<realm>` and `global_hp_ranking_<realm>` respectively.
Unsupported types acknowledge without reading a board. Entries retain published
ordering, duplicate rows and JSON-derived SFS widths in `rankMap`.

`paytotal.ranking` and `continuedcost.ranking` check the corresponding
`new_rank_recharge` and `new_rank_cost` feature's realm, version and date gates.
Enabled queries read `paytotal_global_rank_1` through `_100`, or
`continuedcost_global_rank_1` through `_100`, and stop at the first missing or
blank slot. A single MGET replaces the source's sequential periodic warmup,
providing one cache observation per read without retaining stale process state.
`rankList` preserves published rows and ties; the last matching published UID
supplies `myRank`, with -1 for an absent player. `myHide` comes from the owner's
`user_mixed_info.payHide` or `costHide`, defaulting to zero for an absent row.

These keys are derived publications owned by the original domain's publisher or
an authorized import. Readers add no TTL, invalidation or score refresh. They
observe current publications directly, so a removed publication becomes empty
rather than retaining a previous process-local board. Publishers must atomically
replace their publication when they require generation consistency. Cache loss
cannot erase authoritative scores. Missing publications are empty; unavailable
Redis, malformed reached entries and excessive payloads reject the query rather
than returning an incomplete success. Publications are bounded to 4 MiB of JSON,
and responses retain existing SFS string/collection/frame bounds. No publisher,
production data import or score reconstruction is implied by these readers.

The synthetic suite `published-ranking.test.ts` checks keys, limits, publication
holes, duplicate self positions, signed Long precision, feature and realm gates,
authentication, correlation and failures. Native-client and real-service behavior
remain unverified. No database migration or new dependency is needed for this
layer. Rollback removes these handlers; it does not require changing player data
or cache contents.

## Hero self position and cross-throne boards

`hero.self.rank` reads the configured origin realm when the authenticated profile
has a cross-fight source. A read-only repeatable-read snapshot resolves the owner,
the unique unfinished activity and its unexpired events. Ambiguous activity
instances reject. Event order is explicit `readyTime, uuid` rather than unspecified
SQL traversal. Event writers must persist their lifecycle before exposing it.
The reader does not instantiate events, award rewards or refresh score boards.

Each event resolves its existing `HERO_PERSON_RANK`, `HERO_ALLIANCE_RANK`,
`KINGDOM_PERSON_RANK` or `KINGDOM_ALLIANCE_RANK` keys from realm bands, event
version and stored cross-realm group. A read-only Redis script obtains the
requester's position across the source's bands in one observation, preserving
last-band overwrite and the 5,001-entry read boundary. Missing positions yield
zero; a disabled ranking switch yields -1. The response retains an empty
`eventList`, the last event's `ranking` and `type`, and only type 4 updates
`rankingAlliance`. No publisher TTL or score ordering is changed. The supported
shared Redis topology must contain the originating realm's published keys.

`ctf.get.rank` accepts an optional positive `serverId` selecting the executing
realm or its enabled odd/even partner. It resolves the highest published period
from `fight_of_king_inf<realm>`; the local realm can fall back to its latest
`fight_king_status` row. A peer without a publication is omitted. Closed periods
are omitted without accessing their player rows. Open periods read only public
`user_cross_throne` fields for that fight and positive origin server IDs. The
read-only snapshot sorts descending kills and ascending persistent ID, providing
stable ties where the reference's database order was unspecified. Current global
`server_king_info` names replace the reference's process-local name cache.

The displayed list deliberately retains the source's 19-entry boundary. Own
position scans the full bounded list; an absent UID returns the list length,
including the remote request's empty-UID fallback. Configured realm database
routing replaces the old RPC and its shared ten-minute response cache, so remote
reads cannot return a previous opponent's cached board. Separate realm snapshots
are not a distributed transaction. More than 32,767 internal rows, missing
required providers, invalid state and storage outages reject without partial
success. No combat score or fight lifecycle update is performed.

Synthetic hero/throne command, mapping, cache and SQL-adapter tests cover exact
longs, gates, origin routing, tied ordering, self positions, limits, correlation,
missing publications, read-only transactions and invalid state. Real Redis,
PostgreSQL, cross-process events and native clients have not been exercised.
These readers need no schema migration and can be rolled back without changing
stored scores or event state.

## Alliance donations and cemetery

`al.donate.rank.all`, `.today` and `.week` read the authenticated player's
alliance membership and public member metadata in a read-only snapshot. Total
and weekly rankings preserve wrapped `donation * 10 + role` keys. Total ties
compare exact Long power; daily ordering compares donation, role and power;
weekly equal keys retain the stable UID order of the snapshot. Missing weekly
history omits honor and donation fields. Daily values expire without resetting
stored counters. The shared UTC calendar is explicit; importing a realm whose
Java clock used another zone requires reconciling its day/week publications.

`al.donate.res.rank.day`, `.week` and `.history` read the existing
`bsDonateRankDay<realm><yyyyMMdd><alliance>`,
`bsDonateRankWeek<realm><yyyyMMdd><alliance>` and
`bsDonateRank<realm><alliance>` sorted sets. The inclusive source range contains
up to 101 entries. Redis determines score ties. Former members are omitted, and
remaining current members are appended with zero Double score. Weekly cache
keys use Sunday while `weekendTime` uses the next Monday. Cross-fight realm
classification comes from current global server metadata; such realms receive
an acknowledgment without consuming donation publications. Neither member
progress nor Redis scores are updated.

`cemetery.get.ranking` accepts string type `0` for item contributions and `1`
for deaths. Positive candidates are limited to 100, ordered by their metric
and UID for stable ties. Own position refers to that candidate list and remains
zero unless the owner's existing cemetery row has nonzero item contributions,
including the death board. Presentation skips unavailable public profiles or
alliances and retains the source's 49-successful-entry boundary. Reading does
not create cemetery rows or trigger collection/revival. Only public counters
and identity fields are selected; stored troop detail and revival data are not
read or exposed.

Synthetic tests cover ordering, overflow, exact Long power/deaths, absent weekly
history, calendar boundaries, resource-score hydration, membership filtering,
wire omission, command authorization and malformed inputs. These queries add
no schema or dependencies. Their publishers retain score, TTL and invalidation
ownership. Database/cache failures reject, and rollback requires no data edits.

## Flower rankings

`flower.ranking` reads `flower_ranking_<realm>` and the requesting UID in
`flower_ranking_self_<realm>` together. Missing self positions retain 5001.
The configured `ranking.k2` bounds both local and optional numbered global
`flower_global_rank_<position>` publications. A read-only Redis script observes
these publications together. Public identity fields are hydrated from current
profiles; absent profiles are omitted without changing cached self rank.
Global duplicates and ties retain publication order, with last-UID overwrite
for `myGRank` and -1 when absent. `myHide` reads existing `flower_ranking.hideKing`
without creating the default row that the legacy getter sometimes inserted.

Cross-fight realms resolve the local board/profile presentation against the
configured origin realm. Global visibility remains scoped to the executing
realm. `flowers_all_sev` uses the current realm/version/date gate. The maintained
shared resource catalog and Redis topology must contain the source realm's
publications; unavailable realm configuration rejects rather than inventing a
local board.

Refresh uses existing `time_notice` type 0 and `flowers.k5`. It retains weekly,
monthly and fortnightly calculations, including the source Calendar's Sunday
behavior and millisecond remainder. Missing notice/unknown refresh modes retain
the signed-Long wrapped `now + Long.MAX_VALUE` sentinel. No reset, score refresh,
publication, visibility toggle or notice insertion occurs on read. Cache and
public-profile state are separate observations. Unlike the source per-row catch,
malformed reached publications reject instead of silently hiding damaged rows.
The UTC calendar and 4 MiB JSON/frame bounds are explicit maintained contracts.

Flower unit tests cover publication keys and snapshot composition, missing self
positions, profile omissions, global visibility, origin routing, refresh
boundaries, Long sentinel arithmetic, correlation and failures. Native-client
and real-service validation remain deferred. Rollback needs no player-data edits.

## Military leaderboards

`military.ranking` accepts type 0 for published military score or type 1 for
ranking experience. `wr_switch` gates the query. `wr_sever.xml` supplies realm
groups, retaining Java integer-hash group traversal and fallback group 0. The
resource loader exposes this catalog independently of military reward/settlement
rules; the same loader now retains `heroevent.xml` for event-ranking projections.

One read-only script checks `<score|exp>RankingGroupKey_<group>` for completion
value `0`, reads positions 0 through 150 from `<score|exp>RankingKey_<group>`,
and resolves each exact member's public JSON in
`<score|exp>RankingUserKey_<group>`. Incomplete/missing publications are empty;
missing metadata for a published member or provider failures reject. Redis's
reverse-score/member ordering preserves ties. The response adds one-based
`ranking` positions and matches `selfRanking` by both UID and string server ID;
absent self is zero. Military score/experience remain Int values and realm IDs
remain Strings as published. No stale local-cache result survives invalidation.

The legacy handler's incidental `enable` and `settle` calls are intentionally
not invoked. The authoritative military domain must settle and publish scores;
leaderboard reads cannot grant points, ranks or rewards. The reader adds no
publication TTL and cannot rebuild missing score publications. Existing domain
publishers or authorized imports must expose the three-key contract in the
maintained shared Redis topology. Unit tests cover groups, publication barriers,
metadata coherence, tie/order preservation, self matching, gates and correlation.
