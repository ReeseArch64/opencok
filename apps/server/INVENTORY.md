# Atomic inventory and simple items

Topic 10 is implemented on the [persistent mutation foundation](MUTATION_FOUNDATION.md),
following [ADR-0002](../../docs/decisions/0002-adopt-postgresql-for-authoritative-state.md).
The server loads the maintained goods and material catalogs. No private reference
files or APK are runtime dependencies.

## Command surface

| Command                            | Inputs                                                              | Persisted behavior and response                                   |
| ---------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `item.buy`                         | `itemId`, positive integer `num`, optional `batch`, `hasCDTime`     | Gold purchase; `item`, long `remainGold`, integer `costGold`      |
| `item.use`                         | Owned `uuid`, positive integer `num`                                | Simple effect and consumption; `itemId`, `count`, `itemEffectObj` |
| `item.buyUse`                      | Purchase inputs                                                     | One transaction for purchase and consumption; `buyRet`, `useRet`  |
| `item.compose`                     | Source `itemId`, optional `targetId`, positive `pernum` (default 1) | Catalog recipe costs and resulting item                           |
| `item.compose2`                    | Material recipe integer `id`, `count` from 1 through 9999           | All materials and weighted outcomes; `itemlist`                   |
| `item.compose.suitequipment.store` | Owned `uuid`, positive `num`                                        | Type 43 recipe, exact costs, inventory push                       |

Changes produce `push.useritem` with `useritemlist` and complete item snapshots.
Resource effects additionally produce `push.city.refresh`. Item fields retain
UUID, item ID, integer quantity, long expiration and the catalog's parameter
strings. Login and reconnect continue reading the same persisted item rows.

`InventoryService.grant(owner, operationId, itemId, count, value)` is an internal
capability composed on the realm runtime. A trusted reward/payment/domain service
must authorize the grant and supply a stable operation ID. There is no public
arbitrary grant command. The caller receives the committed item snapshot; an
asynchronous producer must arrange notification or let reconnect refresh it.
Do not implement a multi-step reward by committing an independent grant and then
marking its source redeemed: that source needs its own transaction integration.

## Rules and transaction ownership

The repository takes the realm epoch fence and player lock through the foundation.
Inventory, cooldowns, gold/resources, receipt, individual credit/debit postings and
an `inventory.changed` outbox event commit together. Failed effects, invalid
recipes, insufficient balances, overflow or lost ownership roll everything back.
The repository verifies posting continuity against both initial and final balances.
A purchase followed by use records both legs even when their net item delta is zero.

Quantities and recipe products must fit positive signed 32-bit integers. Balances
remain exact signed 64-bit nonnegative values; silver/chip/diamond remain bounded
32-bit resources. Normal purchases debit free, paid-special and then paid gold.
DMM purchases use their separate pools. Normal sale bundles preserve the legacy
fallback to one item; batch purchases multiply unit price. Material purchases use
the catalog make-price and the existing batch feature gate. Dynamic speedup/CD
pricing is rejected because it belongs to the queue/timer domain.

Stacks distinguish item ID and value. Non-overlapping catalog items create a new
UUID; ordinary grants merge a valid stack and refresh configured relative expiry.
Expired stacks cannot be spent or revived by merging. Their rows remain retained;
expiry deletion and notification mail are not part of these commands. Composition
can consume multiple valid value-zero stacks. A zero-quantity stack is retained,
as in the existing inventory representation.

Simple use supports type 21 (consume only), type 3 effects 100–104 and 158–160
(gold, wood, stone, iron, food, silver, chip and diamond), and type 13 redirection
to those effects. The maintained player effect resolver supplies bonuses, including
world effects; stone and iron require the configured castle unlock level. Resource
packs credit bound resource pools. Civilization restrictions, bulk-use permission
and item cooldowns are checked before commit. CN1 effects requiring the absent
anti-addiction policy reject rather than assuming unrestricted rewards.

Type 13/43 recipes support alternative targets, alternative materials, simultaneous
materials and weighted targets. Material recipes draw their bounded weighted outputs
inside the receipt transaction; retries reuse the outcome. Dragon egg targets
require the dragon capacity domain and reject. Other inventory rewards can be
stored without executing their special effects. The suite-store path consumes the
recipe cost once per requested result; the legacy handler's extra decrement is not
reproduced. Gold returns use the actual remaining balance, including DMM.

VIP, queues, troops, heroes, shields, teleports, gift/reward boxes, chosen rewards,
crystal/dragon currencies, special shops, event quotas and other special-use effects
remain with their authoritative systems. Unsupported use leaves the owned item
unchanged. This is completion of the simple inventory slice, not parity certification
for every `ItemManager` branch or item-related handler.

## Receipt and notification recovery

Clients may send a UUID `operationId` and receive it in the response. Repeating the
same identity and command parameters replays the persisted response, including
random outcomes, without another application. A conflicting payload is rejected.
For legacy item commands with `_cok_`, the TCP adapter derives a UUID from the
connection identity, command and typed correlation value. Repetition on that
connection is durable; a new connection has a different namespace. Reconnect-safe
retry requires preserving the returned/explicit operation ID. Requests without
either identity are independent operations; identical purchases are not silently
coalesced.

The receipt stores response and push snapshots. Replaying an old receipt can return
old snapshots; a fresh login/reconnect is the current-state authority. A lost reply
after commit must be retried with its operation ID, never compensated with a second
grant. The outbox event records each economic leg and is pending until a domain
consumer relays it. Achievement/quest/event consumers are separate domain work;
this change does not claim those downstream counters are updated. Consumers must
deduplicate the complete realm/owner/request/event identity.

## Activation and recovery

Deploy the complete server artifact after applying kingdom migration 0013 from
topic 9 to every realm. This change adds no schema, dependency or environment setting.
Do not mix old inventory writers with the new owner. Before rollout, back up realm
state and verify ownership, ready status and catalog compatibility on a disposable
copy. Existing inventory rows are preserved.

Rollback replaces the application artifact; committed items, balances, receipts,
postings and outbox records must remain together. Do not delete receipts to retry
an uncertain operation or restore only one economic table. Previous artifacts can
read these inventories but do not expose the new commands. Special-item activation
requires that item's owning domain and its own acceptance evidence.

## Evidence

The read-only Java audit covered the six registered handlers, `ItemManager`
add/buy/batch/use/combine methods, `UserItem` stack/expiry/wire methods,
`UserProfile` gold pools and `UserResource` resource effects. The maintained code is
independently authored; private Java and real player data are excluded from delivery.

`integration/inventory.test.ts` uses disposable PostgreSQL and the maintained
catalog loader with synthetic goods. It verifies concurrent grants/purchases,
competing consumption, receipt conflict, foreign UUIDs, rollback, recipe variants,
non-overlapping and expired stacks, gold/resource effects, cooldowns, overflow,
separate debit/credit legs, bonus effects, DMM pools, lost response recovery,
PostgreSQL restart and stale-owner rejection. `integration/core.test.ts` exercises
authenticated SFS item use, session replay, conflicting correlation and rejected
public grants across two realms. `test/inventory.test.ts` pins price, recipe and
weighted-outcome boundaries. `scripts/mutate-inventory.ts` verifies those tests kill
removed gold debits, item conservation, expiration and durable replay guards.

Validation targets v12.06.0 server contracts. Native APK rendering and other client
tracks are untested. Synthetic transport evidence does not certify them.
