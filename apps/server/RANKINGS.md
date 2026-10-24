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
