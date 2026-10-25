# City progression

Topics 16–18 are tracked in [issue 344](https://github.com/ReeseArch64/opencok/issues/344),
[issue 345](https://github.com/ReeseArch64/opencok/issues/345) and
[issue 346](https://github.com/ReeseArch64/opencok/issues/346).
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
Rejected player actions use the native invalid-parameter, resource, prerequisite,
queue, level and reward codes; dependency/persistence failures remain internal
errors.

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
authoritative transition clock. Already accumulated buffers and fractional production survive rate changes.
Demolition transfers the remaining whole-resource buffer through the inventory ledger before
removing its checkpoint. Assigned generals are detached from demolished buildings.
Ordinary production is still collected explicitly; upgrading does not implicitly
credit an uncollected buffer. Overdue completions use the saved deadline, followed by settlement of the later
interval at the new rate and troop upkeep. Recovery processes due activities in
deadline order before new city mutations and collection; explicit queue commands
first recover preceding activities. Restoring a legacy queue does not settle its
future interval. If an imported account already has a later resource/production
checkpoint or producer refresh, completion clamps to that checkpoint instead of
rewriting already settled history. Historical changes missing from an imported
snapshot cannot be reconstructed.

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

## Training, hospital and fortifications

Training uses queue types 1, 8, 9, 10 and 17; fortifications use 2 and healing uses 3. Commands include `army.add`, `army.complete`, `army.cd`, `army.fire`,
`hospital.cure`, `hospital.cure.done`, `hospital.cancel`, `hospital.cd`,
`hospital.fire`, `fort.build`, `fort.build.done`, `fort.cancel`, `fort.cd` and
`fort.destory`. The correctly spelled `fort.destroy` is also accepted. Legacy
completion/cancellation aliases verify the queue type and supplied troop ID.

Training capacity comes from barracks and the base catalog allowance, with active
capacity/speed effects and assigned generals. Required buildings must be finished;
configured saga/civilization research prerequisites must be present. Resource
prices, fine iron item costs, deadlines, power and acceleration prices use the
authoritative catalogs. When the realm enables its power limit, pending city,
research and military power reserves headroom before another job is charged.
Healthy quantity bounds include both pending training and healing.

`army.cd` pays acceleration and, when the `max` field is present, resource
shortages. Its default creates a paid, ready queue for completion; `complete=true`
commits available soldiers immediately. `fort.cd` creates a paid, ready defense
queue. `army.add` and `fort.build` use their Boolean `gold` field only to purchase
resource shortages. Guide progress commits with the corresponding army command.

Dismissal subtracts only owned available soldiers, preserving marching, defending,
PVE and pending training quantities. Healing accepts the original flat troop-ID
Int fields, reserves selected wounds, charges catalog healing costs and updates
the shared hospital deadline. Cancellation returns all reserved troops to the
wounded pool while refunding the configured portion of actually paid resources.
Completion moves exactly the reserved quantity into available troops and updates
power and the cumulative cure count. Direct healing can consume other wounds
while preserving the same troop type's existing queued reservation. Wounded
dismissal cannot consume units already reserved for healing.

Hospital batch capacity derives from hospital buildings and flat/percentage
effects; existing excess wounds remain stored for smaller healing batches.
Fortification capacity includes completed and pending defenses across every type.
Nonpositive starts, negative counters, excessive dismissal, overflow, unavailable
buildings and conflicting queues reject atomically. Combat intake, special battle
server capacity modifiers and battle damage remain owned by their future domains.

Deferred military login includes saved counters, pending deadlines and zero-count
ordinary troop/defense definitions from the catalogs. These virtual empty entries
do not grant soldiers or reset existing rows. Reconnect exposes hospital and
defense state; elapsed healing stays visible if completion could not commit.

`integration/military.test.ts` covers retries, capacity and quantity failures,
training/defense completion, healing/cancellation, direct healing during a queued
batch, dismissal, paid-ready jobs and power reservations. Overdue construction,
research and training tests verify deadline-based output and upkeep. The
provisioning SFS E2E exercises live construction, training/acceleration, healing,
dismissal, research reads and deferred military data. Critical mutations cover
prerequisites, power, paid refunds, quantity bounds, capacities and healing
conservation. This evidence uses synthetic players and disposable dependencies.
