# In-game shops and NPC exchanges

Topic 12 implements gold/item purchases and NPC item swaps for the 12.06.0 realm
protocol. Rules come from the maintained `shop_new` and `trade` catalogs, loaded
without private Java files. The source audit covers `ShoppingMallManager`,
`ShopNewConfig`, its container and the NPC trade handlers/service. This is not a
claim of complete parity for every legacy shop, event or payment family.

## Commands and rules

| Command            | Behavior                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `mall.info`        | Lists eligible offers in display order, including both `shoppingMall` and `mall` arrays.  |
| `mall.info.type`   | Filters using string `type`; blank/unknown categories return an empty object.             |
| `mall.data`        | Filters using string `mallId`.                                                            |
| `shoppingMall.buy` | Accepts offer `id` and positive integer `num`; prices and delivery come from the catalog. |
| `trade.info`       | Generates and persists a weighted NPC offer or returns its existing outcome.              |
| `trade.exchange`   | Consumes the persisted offer's items and grants its reward atomically.                    |
| `trade.cancel`     | Clears the current offer without incrementing the completed-trade count.                  |

Shop eligibility checks sale state, catalog/version, realm, country, civilization,
player/castle levels, registration age and absolute sale windows. Listings exclude
sold-out offers. Purchases recheck eligibility and counters while holding the
account and offer locks. A client cannot set a price, currency, reward or limit.
The version gate uses the saved profile's `appVersion`; profiles without a saved
version retain the maintained client-version fallback. An old saved version cannot
use that fallback to bypass an offer's minimum version.

Normal gold spending uses free gold, special paid gold and paid gold in that
order. DMM accounts use the corresponding DMM pools. Optional item costs consume
valid value-zero stacks. Expired items cannot pay for a purchase or trade. Debit
and grant legs remain in the ledger even if an exchange has no net item change.
Item grants use the inventory subsystem's stacking and expiration rules.
An item is expired when `vanishTime <= now`, except for the permanent zero value.
The same exclusive deadline applies to spending and selecting a reusable grant
stack, so delivery cannot revive an expired stack. An offer without a positive
configured currency or item cost is unavailable, matching the source purchase
guard. Equipment identities and missing item catalogs cannot become item costs.

Daily boundaries and calendar timestamps use UTC, matching maintained realm
tests. Weekly offers use the catalog's comma-separated Calendar weekdays (Sunday
is 1) and the configured sale duration from UTC midnight. An offer is unavailable
on unlisted days or after that day's sale window. This deliberately closes the
legacy fallback that treats an unlisted day as having no time restriction.
Weekly schedules combined with cycle renewal remain unsupported. Daily price tiers use the requested batch's final daily quantity, as in
the audited Java purchase calculation. Per-player cycle counters renew from the
configured anchor and interval. Realm stock remains cumulative across player
cycle/day renewal. Catalog reads calculate current counters without writing.

NPC offer selection uses catalog weights, the next daily pool, castle level and
owned item quantities. The selected offer is persisted, including its premium
flag. Completing a trade increments its daily count and starts the configured
cooldown. Day renewal clears the previous offer and resets the count. Canceling
an offer leaves its pool unchanged. Empty exchange/cancel calls return the current
caravan without granting anything.

## Atomicity and retries

The realm mutation executor locks the fenced realm epoch and the player before
shop/trade work. A purchase then locks its `shop_stock` row; distinct buyers of
the same offer serialize on that row. Inventory, currency, `shopping_mall`, stock,
command receipt, ledger and outbox commit in one PostgreSQL transaction. NPC
trade state shares the same inventory transaction and receipt.

Use the same UUID `operationId` for retries across connections and restarts.
Without it, the transport derives an operation ID from the connection, command
and typed `_cok_` correlation. That fallback only protects retries on the same
connection. Reusing an operation ID with different purchase arguments fails.
A saved response replays without spending again even after the catalog changes.

A failed transaction changes nothing. A reply lost after commit is recovered by
replaying the saved command. Stale realm owners cannot write or replay through
the mutation executor. The outbox remains at-least-once; downstream effects must
use its stable event identity and are not certified by successful item delivery.

## Deployment and recovery

Apply kingdom migration `0014_shop_stock` to every realm before deploying this
runtime. It adds an offer-keyed cumulative purchase counter without altering
existing inventory. Back up realm databases before migration/deployment. Existing
maintained realms had no enabled shop purchase path; their counters start at zero.
Importing legacy production shop data requires separately reconciling the old
shared stock counters. Do not infer cumulative realm stock from player counters
that may already have renewed, or enable limited offers before that reconciliation.

Rollback the runtime while retaining `shop_stock`, receipts, postings, NPC offers
and purchase counters. Do not clear these tables to recover from a failed reply;
that can permit duplicate grants or replenish exhausted supply. Completed
purchases remain durable and are not automatically reversed by a code rollback.
No new environment settings, dependencies or client artifact changes are required.

## Validation and limits

The disposable PostgreSQL test exercises duplicate purchase requests, conflicting
payloads, concurrent buyers, daily/cycle/shared limits, insufficient gold, rollback
on receipt failure, lost replies, restart replay, stale epochs, persisted NPC
offers, concurrent exchange, cancellation and daily renewal. Unit tests cover
batch tier prices, overflow, eligibility windows, separate DMM pools and debit/grant
ledger continuity. The two-realm TCP/SFS scenario checks catalog discovery,
purchase, correlation replay, exhausted limits and subsequent inventory use.
`apps/server/scripts/mutate-shops.ts` checks that critical protection removals
cause validation failures. These synthetic tests do not validate APK rendering.

The recovery suite compares complete synthetic profile, resource, inventory,
purchase, realm-stock, NPC-offer, receipt, ledger and outbox snapshots after each
rejection or injected persistence failure. Both shop and NPC failures at ledger,
outbox and receipt insertion roll back the entire operation. NPC tests also cover
insufficient items, exact expiry deadlines, unsupported equipment, distinct racing
operations, lost replies, restored offers, durable replay after PostgreSQL restart
and stale-owner rejection for both new commands and saved replies.

The actual TCP/SFS scenario exercises all three catalog commands in two realms.
It then replays explicit purchase and exchange operation IDs after server restart
and authenticated reconnect, with different `_cok_` correlation values and without
restoring the original shop offer. The saved result replays through the native
response envelope without consulting current pricing or repeating delivery.

## Issue 324 acceptance

This matrix covers the scope and explicit exclusions of
[issue 324](https://github.com/ReeseArch64/opencok/issues/324). Completion of that
scope does not certify every legacy shop family or device build.

| Criterion                                                                                  | Maintained implementation                                                                                    | Verification                                                                                                                        |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Versioned catalog, eligibility, tier prices and counters                                   | `rules/shops`, `mappings/shops`, `ShopService` and maintained `shop_new` catalog                             | `test/shops.test.ts`, `integration/shop-trade-recovery.test.ts` and the three native catalog commands in `integration/core.test.ts` |
| Atomic purchase, player/cycle/day limits and realm stock                                   | `createShopRepository` composes the fenced mutation and inventory executors with the locked `shop_stock` row | `integration/shops.test.ts` and mixed-cost, complete-state rollback checks in `integration/shop-trade-recovery.test.ts`             |
| Persisted NPC offers, exchange, cancel and UTC day renewal                                 | `TradeService` and `createTradeExecutor`                                                                     | `integration/shops.test.ts` and offer restoration, renewal, race and rollback checks in `integration/shop-trade-recovery.test.ts`   |
| Duplicates, concurrent buyers, insufficient balances, reply loss, restart and stale owners | Durable `command_receipt`, `economy_posting` and `mutation_outbox` under realm fencing                       | Disposable PostgreSQL shop/NPC suites plus purchase/exchange replay after actual TCP/SFS reconnect in `integration/core.test.ts`    |
| Explicit specialized dependencies and unsupported families                                 | Pre-debit eligibility and item-delivery guards; dependency matrix below                                      | Unit denial matrix, unchanged PostgreSQL snapshots and unsupported NPC delivery tests                                               |
| Small dependent PRs and migration/recovery instructions                                    | Original persistence, service and runtime changes followed by eligibility/recovery completion                | Kingdom migration `0014_shop_stock`, deployment instructions above and issue-linked PR stack                                        |

Reproduce the targeted checks from the repository root:

```sh
bun --no-env-file test apps/server/test/shops.test.ts apps/server/test/inventory.test.ts
bun --no-env-file test apps/server/integration/shops.test.ts apps/server/integration/shop-trade-recovery.test.ts
bun --no-env-file test apps/server/integration/core.test.ts apps/server/integration/campaign-producers.test.ts apps/server/integration/continued-cost.test.ts
bun --no-env-file apps/server/scripts/mutate-shops.ts
bun run lint
bun run format:check
bun run --cwd apps/server check-types
bun run --cwd packages/rules check-types
bun run --cwd packages/services check-types
```

## Specialized dependency boundaries

| Native price or delivery family                                                   | Authoritative dependency required before exposure                             | Current behavior                                                                             |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Price 1, gold                                                                     | Saved ordinary or DMM gold pools                                              | Atomic debit and normal inventory delivery                                                   |
| `value_item`, ordinary goods                                                      | Owned, unexpired value-zero inventory stacks and configured positive quantity | Atomic item debit, optionally combined with gold                                             |
| Price 2, alliance contribution                                                    | Alliance membership and contribution accounting                               | Hidden/rejected before debit                                                                 |
| Price 3, kingdom contribution                                                     | Kingdom contribution accounting and its lifecycle                             | Hidden/rejected before debit                                                                 |
| Price 4, military rank honor                                                      | Military feature/rank eligibility and honor accounting                        | Hidden/rejected before debit                                                                 |
| Price 5, SVIP points                                                              | Owned SVIP shop level, points and experience progression                      | Hidden/rejected before debit                                                                 |
| Price 6, neutral score                                                            | Neutral score authority and lifecycle                                         | Hidden/rejected before debit                                                                 |
| Price 7, civilization score                                                       | Civilization authority and verified spending effects                          | Hidden/rejected before debit                                                                 |
| Price 8, crystal gold                                                             | Crystal-gold authority, distinct from ordinary gold and crystals              | Hidden/rejected before debit                                                                 |
| Price 9, CSMOD balance                                                            | CSMOD balance and fulfillment authority                                       | Hidden/rejected before debit                                                                 |
| Status `type2=1` and equipment delivery/costs                                     | Status/equipment ownership, storage, effects and native response composition  | Never substituted with an ordinary item stack; shop and NPC requests fail before consumption |
| Prestige/military/SVIP conditions, shop experience and group discounts            | Saved eligibility and domain effects, including discount-item consumption     | Conditioned offers hidden/rejected; client discount requests rejected                        |
| Weekly schedules combined with cycle renewal                                      | Audited combined scheduling and renewal policy                                | Unsupported before debit                                                                     |
| NPC princess tasks and unrelated event progression                                | The owning task/event trigger and atomic integration                          | No fabricated task completion; inventory changes remain durable                              |
| `exchange.*`, `csmodstore.*`, dedicated alliance/military and promotion exchanges | Their separate payment, currency, stock and event lifecycles                  | Outside the ordinary shop/NPC command surface                                                |

Existing confirmed ordinary shop purchases already feed the maintained campaign
and continued-cost domains. `integration/campaign-producers.test.ts` and
`integration/continued-cost.test.ts` verify those integrations, their receipts and
rollback. Durable outbox delivery alone is not evidence of an unimplemented
specialized effect. No new dependency, schema migration, environment setting or
mobile resource patch is needed for the eligibility and recovery completion.

Specialized alliance/kingdom contribution, military honor, SVIP, neutral and
civilization scores, crystal-gold/CSMOD balances, status/equipment delivery,
group-purchase discounts and prestige/SVIP conditions remain
unsupported. Such offers are hidden or rejected before any debit. Discounts passed
by the client are rejected. NPC task/progression side effects remain a separate
authoritative-domain integration; inventory events are durable, but no synthetic
task completion is emitted. Item quantities spanning multiple stacks are aggregated
for NPC eligibility rather than retaining the legacy map's last-stack behavior.

`exchange.*` payment packages, `csmodstore.*`, specialized alliance/military shops,
activity/promotion exchanges and their lifecycle effects are not enabled by this
change. Topic 12 therefore has implemented core shop/trade evidence, not complete
legacy-inventory certification. Real-money fulfillment and specialized currencies
must be migrated with their owning systems before those offers are exposed.
