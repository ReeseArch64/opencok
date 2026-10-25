# Timed activities and city production

Topics 14 and 15 use the existing PostgreSQL kingdom mutation boundary. No new
storage or queue service is introduced. The implementation is tracked in
[issue 338](https://github.com/ReeseArch64/opencok/issues/338).

## Activity ownership

`timed_activity` records an activity UUID independently of its reusable queue
UUID, start/deadline, version and terminal state. The partial unique index allows
only one running activity per queue. Every start, reschedule, cancellation and
completion locks the player aggregate, checks the realm epoch, and commits the
queue projection, domain effect, inventory postings, receipt and outbox together.
The five-second finish tolerance matches the legacy command. Background recovery
waits for the actual deadline, reads bounded batches with a rotating cursor and
continues past failed domain handlers. Reconnect processes up to 256 owned due
activities. Failed activities remain pending for subsequent attempts.

`TimedActivityService.start` is an internal domain entry point. Duration and target
come from the authoritative domain, never a generic client-controlled start
command. The composition root supplies an `ActivityDomain` by queue type. Its
callback receives the same database transaction and an economic port for gold,
resources and items. Costs and refunds must use this port, rather than writing
wallets behind the inventory snapshot. Domain state is written through the
supplied transaction; network calls and separately committed writes do not belong
inside a handler. Failure rolls the entire transition back.

Construction and basic research now register their authoritative domains through the
[city progression integration](city-progression.md). Troops, hospital,
equipment and other effects remain owned by their corresponding domains.
Unavailable adapters reject transitions without freeing a queue or charging
acceleration. Material-production acceleration rejects the generic gold formula.

`restore` imports an occupied legacy queue only after its registered domain
validates the saved target. It preserves the original deadline and creates a new
activity identity without replaying start costs. Idle queues need no import.
Imported occupied queues without a domain adapter remain preserved and blocked.

The client commands are `queue.finish`, `queue.cancel`, `queue.ccd`, `queue.open`
and `queue.rent`. Opening consumes an opening item; renting debits the configured
gold price. Speedups support flat and percentage items, configured gold prices,
and building free-time allowances including active VIP and effect 899. Guide
progress is committed with acceleration. Activity commands return identity and
version alongside the legacy fields. Supplying these fields rejects an old
command targeting a later occupant of the same queue.

## Production and consumption

`building_production` stores uncollected wood, stone, iron or food per building,
its settlement instant, fractional carry and ordered rate/capacity boundaries.
Collection transfers the buffer into the existing resource wallet with ledger
postings. Reconnect accrues into the buffer without collecting it. Capacity limits
uncollected production, not the wallet balance. Lowering capacity never deletes an
already accumulated buffer; production resumes after room becomes available.

Rates use millionths of a resource per hour and bigint integration. Splitting an
interval does not discard fractional output. This intentionally avoids legacy
integer-duration overflow and rounding loss on repeated settlement. The existing
reconnect consumption rules still govern troop food, bound food, protection,
weakness and their legacy rounding. Consumption settles before production credit
under the same transaction. The current runtime consumption ratio remains one,
as in the existing reconnect path.

Known effect, VIP, assigned-general and production-boost expirations form future
rate boundaries. Both item and gold boosts settle the previous interval first.
The item path retains the uncollected buffer; the gold path collects it before
payment, matching its existing behavior. A boost cannot extend an active boost.
The specialized science-stone producer requires its civilization domain and is
not treated as an ordinary four-resource building. Seasonal harvest rewards and
quest triggers remain owned by their event/progression domains; this common
production layer emits committed events rather than implementing those systems.

Authoritative domains changing a building, general, effect or production rate
must call `changeProductionInTransaction` inside their fenced mutation, with the
player lock already held. Supply old-rate bootstrap accounts for every affected
producer and perform the domain change in its callback. The helper settles the
persisted old schedules before the callback and stores the newly calculated
schedules at the same instant. An error rolls back both the domain and checkpoint.
Never update rate inputs directly and then retroactively recompute elapsed output.
The existing output-boost command applies the equivalent boundary in its own
production transaction. External/manual SQL and changes to authoritative catalogs
are not supported rate-change paths.

## Receipts, compatibility and recovery

Stable `operationId` values replay committed responses after acknowledgment loss.
An identifier reused with different input is rejected. Legacy packets without
this extension receive a generated ID and remain accepted; identical anonymous
requests cannot be distinguished from intentional repeated actions. They do not
have the stable-request retry guarantee. Generation/version guards are likewise
optional for legacy packets. A terminal activity cannot execute twice, and a
production checkpoint cannot credit the same elapsed interval twice.

Migration `0015_timed_economy.sql` adds two tables and indexes without rewriting
player rows. Existing production initializes lazily from the building refresh
instant; missing refresh times use the legacy five-second fallback. Historical
rate changes predating the first durable checkpoint cannot be reconstructed from
an imported current snapshot. Back up the kingdom before migration. Apply the
migration before starting this runtime. On rollback, retain the new tables and
restore an application version that understands their checkpoints before enabling
production again; running an old producer against advanced refresh times can
recompute already collected output. Do not delete receipts or checkpoints to
retry an operation.

Synthetic PostgreSQL tests cover concurrent duplicate starts/finishes, cancellation,
item opening, rental, speedup, economic costs/refunds, rate changes, boosts,
rollback on receipt insertion, replay after database restart and stale-owner
rejection. Pure tests cover deadline boundaries, fractional conservation,
capacity and scheduled expiry. Runtime integration includes login, provisioning
and reconnect. This evidence does not certify native APK rendering or any
unregistered domain's completion effects.
