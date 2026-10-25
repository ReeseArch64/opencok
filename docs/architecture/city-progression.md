# City progression

Topics 16 and 17 are tracked in [issue 344](https://github.com/ReeseArch64/opencok/issues/344)
and [issue 345](https://github.com/ReeseArch64/opencok/issues/345).
The independently authored TypeScript domains consume maintained catalogs; the
ignored Java reference is a development input and is never a runtime dependency.

## Transaction and protocol

Construction uses the existing realm owner lock, ownership epoch, inventory
ledger, command receipts, outbox and persistent activity queues. The controller
routes to Services; domain rules and serialization stay outside persistence.
The queue UUID is reusable; activity ID and version identify its occupant.

`build.create`, `build.upgrade`, `build.destroy`, `build.move`,
`buildingUnlock.info`, `buildingUnlock.glory`, `miracle.unlock` and
`building.reward` are implemented. The original `buildingUnlock` multihandler
also accepts `M__REQUEST_ID__H=info|glory`. Queue finish, cancellation and
acceleration use the existing common commands. Durations, prices, next levels
and star progress are computed from authoritative catalogs inside the locked
transaction. Position and instance constraints are validated even when the
reference relies on the client to enforce them. A dependent building cannot
upgrade or demolish while its training/research/healing queue remains occupied.

Gold modes preserve queued ordinary payment (0), immediate completion with
resource-shortage purchase (1), and queued shortage purchase (2). Bound resources
are consumed before ordinary balances. Resource shortages use the existing
piecewise catalog price; required items use their catalog price, except honor
items, which must be owned. Move uses item 200032 or its gold price. All economic
changes use the inventory port, including refunds and rewards.

The additive kingdom migration `0016_city_progression.sql` stores nullable JSONB
domain data on timed activities: version, paid resource costs, item consumption
and pinned completion targets. Cancellation refunds half the actually consumed
resource balances, with integer truncation. It never recomputes a larger refund
from a discounted current catalog. Gold and items are not refunded. Old occupied
queues are imported in bounded, rotating batches after their registered domain
validates the saved target. Restore does not recharge start costs. Imported
activities lack proof of historical charges, so cancellation clears their pending
state without a resource refund. Unavailable or malformed domains stay pending.

Stable `operationId` values replay the complete response after acknowledgment
loss. Legacy requests without the extension receive generated IDs and do not
have a repeat-request guarantee. A terminal activity cannot apply twice. Clock,
queue-generation, catalog, ownership or persistence failures roll back all writes.

## Progression and production

The current level's definition supplies upgrade costs, duration and experience;
the next definition supplies the resulting level, star/progress and power.
Unlock conditions and payments gate star steps. Level 30 follows its explicit
progress steps, and the available star catalog controls the maximum. Castle
rewards are available once after a committed upgrade and are cleared on claim;
the reference's inconsistent reward flag does not permit repeated grants.
Building experience tracks a current total and historical maximum, so demolishing
and rebuilding cannot repeatedly award the same experience. Player level and
persisted power advance in the same transaction.

A domain write settles every existing producer using the old schedule, changes
the building or research input, then installs the newly resolved schedules at the
commit clock. Already accumulated buffers and fractional production survive.
Demolition transfers the remaining buffer through the inventory ledger before
removing its checkpoint. Assigned generals are detached from demolished buildings.
Ordinary production is still collected explicitly; upgrading does not implicitly
credit an uncollected buffer. Offline completions apply at the fenced command's
clock, without retroactively rewriting an already settled interval.

## Delivery and recovery

Apply pending kingdom migrations before starting the new runtime. Back up the
kingdom first; no player reset or bulk queue conversion is required. Recovery
runs bounded batches on reconnect and in the realm loop. Existing resource and
queue limits remain authoritative. Rollback must retain activity data, command
receipts and production checkpoints; do not enable an older runtime that ignores
the new domain effects while these queues are active. Drain or retain them for
a compatible runtime instead.

Synthetic PostgreSQL tests exercise concurrent starts, replay, invalid ownership,
occupied/invalid positions, completion, stale generations, cancellation, stars,
castle rewards, earned production and rollback after a receipt-insertion failure.
Pure units check quantity bounds, arithmetic and activity-data versions. This is
maintained 12.06.0 protocol evidence, not native APK rendering or certification
of the 5.36.0, 6.12.20 and 9.27.0 clients.

Event scores, alliance missions, combat, advanced civilizations and independent
quest reward systems retain their domain ownership. The transaction emits durable
activity events; this migration does not execute those other domains' external
side effects or recreate their commercial services.

## Basic technology research

`science.data.init`, `science.research`, `science.upgrade` and `science.directly`
use queue type 6. The current science definition supplies costs and prerequisites;
completion advances one pinned level and updates persisted power. Building,
science, civilization-prestige and VIP prerequisites are checked before payment.
An upgrading academy and a pending instance of the same technology reject new
research. Science-point items must be owned. Ordinary and gold-shortage queued
payment share the economy port; direct research additionally pays acceleration.

Generic queue commands own research acceleration, cancellation and recovery. The
legacy `science.upgrade` alias verifies both queue ownership and technology ID,
and retains its one-second finish tolerance. Rescheduling persists the science
deadline, and terminal transitions restore its idle sentinel. Existing effect
resolution reads the saved level immediately, including production rate changes.
Catalog troop unlocks preserve existing troop quantities, while recognized basic
research skills initialize their owned skill record once.

Initialization and reconnect include the basic tree's saved levels and occupied
deadlines. The explicit reader returns the `science` array, including level-zero
technologies. Alliance and advanced civilization science payloads remain with
their own domains. The large tree response stays in the command receipt and is
not duplicated into a bounded activity outbox event.

`integration/research.test.ts` verifies prerequisite failures, concurrent starts,
acceleration, immediate completion, cancellation, power/effect persistence and
production schedule changes. Research units check scalar wire types, locked tree
entries, malformed prices and pinned-level/queue conflicts.
