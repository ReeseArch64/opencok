# Advanced progression, local events and dynamic world migration

[Issue 385](https://github.com/ReeseArch64/opencok/issues/385) tracks topics 25, 26 and 27 as separate migration areas. This document tracks implemented
slices and remaining acceptance; a command registration is not completion evidence.
The compatibility target is the 12.06.0 server contract. Native APK execution and
other client tracks remain unverified. Private reference inputs are read-only and
are not runtime dependencies.

## Civilization science

`civilization.science.data.init`, `race.science.research`, `race.science.directly`
and `race.science.upgrade` use the existing city mutation boundary and queue type 19. Research resolves contiguous catalog levels, validates building, civilization
science, prestige and VIP prerequisites, and charges the authoritative inventory
ledger. The next level is pinned in the activity; a retry cannot charge or complete
the same operation twice. Resource cancellation refunds half the recorded paid
amounts; consumed items are not refunded. Imported queues retain their deadlines
and do not replay start costs.

Effects remain sourced from `user_civilization_science`. Updates settle production
under the old effects before applying the level, then rebuild the future schedule.
The protocol preserves float effect fields, string catalog fields and long
milliseconds. The native completion command checks queue type, target and deadline.
Generic queue acceleration and cancellation use the shared lifecycle.

The implementation adds no schema or dependency. Existing type-19 queues are used;
this slice does not grant missing queues, prestige or currency. Operators should
back up realm state before rollout. Rollback must retain research rows, activity
identities, receipts and production checkpoints. A binary without this domain must
leave its pending queues blocked rather than clear or complete them.

Synthetic tests exercise prerequisites, costs, wire types, four concurrent retries,
wrong-target completion, duplicate completion and cancellation against a disposable
PostgreSQL instance. No test uses the operator's running realm or player data.

## Remaining topic boundaries

| Topic | Modules still requiring implementation and acceptance                                                                                                  |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 25    | Validated tower battle integration, battle skills and garrison interactions; native-client acceptance                                                  |
| 26    | Remaining local activity handlers and trusted score producers; matched-period coordination, arena battle integration and full native period acceptance |
| 27    | Specialized target engines and native-device acceptance                                                                                                |

Existing read projections, catalogs, rankings and schema definitions are reused,
but do not establish that these mutations are implemented. Combat-dependent modes
must use their corresponding validated engine before being enabled. No generic
victory or empty success response substitutes for combat acceptance.

## Local event timing and minstrel

The native `minstrel` multihandler supports `info`, `listen`, `share` and `reward`.
Its `activity_panel` gate must be enabled and within the configured inclusive start
and end timestamps. Dates and daily periods use UTC, consistent with maintained
quest periods; the host timezone cannot change claim eligibility. Malformed or
reversed dates fail closed. This change does not enable the currently disabled
catalog event or rewrite its historical dates.

`activity_minstrel` persists daily counters and cooldown instants. A daily reset
clears counters while preserving action timestamps, matching the reference. The
first listen awards its configured reward; the first share creates reward mail;
periodic rewards enforce both the cooldown and daily cap. The existing inventory
transaction pins random rewards with the receipt and counters. Share mail and its
claimable reward commit with the share counter. Concurrent retries cannot repeat
these grants. Clients never submit authoritative counters, times or reward values.

No migration is required. Back up realm state before rollout and retain counters,
mail, receipts and ledger records on rollback. PostgreSQL acceptance covers a
closed event, four concurrent first listens, repeated shares with one mail, reward
cooldowns and next-day reset. See the remaining topic boundaries for the local modes still awaiting acceptance.

## March transition foundation

`contracts/world-march-lifecycle` and `rules/world-march-lifecycle` define the
noncombat lifecycle independently of transport and storage. Departure transfers
selected free troops into the march reservation. Arrival starts gathering at the
saved arrival instant, even during late recovery. Gathering completion pins cargo
and the return deadline; only completed return releases troops and credits cargo.
An outbound recall takes an authoritative reverse-route duration. Ordinary-route
acceleration uses Java float rounding and preserves the reference 1,500 ms minimum
remaining outbound time. Black-land routes use the separate persisted route-segment calculation.

Each transition requires the owning player and expected version and returns the
version to compare before writing. Insufficient troops, overflow, duplicate troop
selections, premature transitions, foreign ownership and stale versions reject.
Inputs remain immutable. The terminal state rejects repeated return completion.
Synthetic tests check conservation of troop counts across the full lifecycle,
late recovery without deadline drift, single cargo delivery and acceleration edges.

The realm now composes these transitions through its fenced player transaction.
`world.march`, `world.march.check`, `world.march.retreat`, `world.march.spd`,
`world.user.march` and `world.get.march` operate on owned troops and catalog-backed
resource targets. Costs, troop reservations, point ownership, cargo, checkpoint,
receipt and outbox commit together. Map mutations lock their points and serialize
through a transaction-scoped map lock. Competing arrivals cannot both occupy a
resource node; an unavailable target returns the later army without inventing a
battle. Combat targets require their validated engine.

`world.mv` and `world.mv.gold` validate all four destination tiles before payment.
Directed movement recalls existing ordinary marches; collected cargo and troops
return through the same checkpoint. Random movement requires no active marches and
chooses a free footprint on the server. Random choices and costs replay from the
receipt. Native inspection, march lists and map queries expose the saved state.

Migration `0018_world_march_runtime.sql` adds bounded march checkpoints and map
interests. Background recovery scans persisted deadlines and unregistered ordinary
resource marches in bounded batches, retaining original deadlines and avoiding a
second reservation on import. Checkpoints use explicit versions and terminal state.
New army snapshots have an identified maintained format; readers retain the Java
object-stream import path. No private input is a runtime dependency.

World views record bounded-lived interests. The outbox sends native march,
acceleration, return, deletion and point-invalidation updates to interested players.
Late delivery does not repeat economic transitions. Reconnect also recovers owned
marches before building its snapshot.

Back up the realm before applying the additive migration. Keep checkpoints,
receipts, postings and modern army snapshots on rollback. A replacement binary
must understand the checkpoint and army formats before enabling these commands;
an old Java writer cannot safely resume them. Do not delete checkpoint rows or
restore free troop counts manually to retry a march. Synthetic PostgreSQL scenarios
cover concurrent departure, delayed full-cycle recovery, single cargo credit,
acceleration, foreign recall, teleport ownership and interest selection.

## Dragon progression runtime

Dragon ownership, incubation checkpoints, friendship, level and experience,
communication timestamps, travel outcomes, skill inventory and talent cooldowns
use the maintained dragon tables inside the player mutation transaction. The
12.06.0 petdragon commands now execute these workflows. Reconnect reconstructs
saved timers, advances expired incubation/travel state, and returns the dragon and
skill lists. Empty rosters receive the catalog's initial egg once; existing levels,
eggs, skills and balances are preserved.

Travel completion pins its selected reward in the dragon row; cancellation uses
the catalog's elapsed-time reward band. Claiming transfers that saved outcome and
clears the pending reward in the same transaction. Feeding outcomes are generated
on the server and pinned by the operation receipt. Skill learning enforces slot
quality, allowed dragon types, unlock level and ownership. Skill materials cannot
be equipped, innate, repeated in the selection, or the target skill itself.

Egg and skill-book inventory items enter these workflows through the existing
item-use transaction. Friendship, active-skill and passive-skill effects remain
source data for the common effect calculation. Production is settled before any
change to those effects. Talent start and expiration times join the production
schedule. Status and continuous talents are supported; a battle-triggered talent
requires the validated battle integration before activation.

Synthetic PostgreSQL acceptance traverses incubation, feeding, upgrading,
renaming, travelling, reward recovery and claim, skill consumption, talent unlock
and cooldown. Concurrent retries debit or grant once; foreign ownership, early
hatching, repeated claims and repeated unlocks reject. No schema migration is
needed for these dragon workflows. Retain dragon rows, receipts and ledger records
when rolling back, and recover pending travel from its stored reward rather than
rerolling it.

The civilization castle runtime now persists the native `civilizationCastle`
info, placement, construction acceleration, settlement, movement and removal
commands. Placement requires the maintained civilization building, reserves four
free map tiles and debits resources and civilization score in the same fenced
inventory transaction. Production resumes from the saved construction deadline,
advances by whole configured intervals and preserves the fractional interval
across reconnects. Settlement credits the configured crystal item once per
operation receipt and enforces its cooldown. Movement consumes the configured
item only after validating the entire destination footprint; removal credits the
remaining whole crystals and frees the owned tiles. Map invalidations use the
world interest relay. Garrison and robbery require their corresponding combat
march engine; occupied legacy garrisons are rejected before changing their state.

Totem placement persists a catalog snapshot, footprint, alliance, health and
activation deadline. The native `totem` info, put and remove actions enforce
owned inventory, placement limits, cooldowns and free tiles; permanent props are
retained. Nearby allied totems shorten their persisted deadlines together.
Recycling cancels the activation without resetting the placement cooldown.

Expiry captures eligible cities under the map lock, clears the footprint and
creates one durable delivery per recipient. Recipient mutations apply pending
deliveries in deadline order under that player's lock. Each status change settles
production at the saved activation instant before recalculating rates, including
its eventual expiry. Delivery markers, status rows, notification events and mail
commit together. A fenced recovery worker expires world activations independently
of whether their owner can log in, then drains eligible recipient deliveries.
Combat damage against totems still requires the corresponding validated battle
engine; the placement workflow does not synthesize casualties or battle results.

The native lottery runtime persists the outer reward grid, chosen chest strategy,
ordered inner prizes, selected positions, multipliers, daily strategy counts and
chest tokens. Its start, buy, batch, chest-use and cancel commands run through
player locks, inventory postings and operation receipts. Client counters detect
stale selections; the server chooses and saves the prize order independently of
client positions. Reconnect can reshuffle the presentation without rerolling the
saved sequence. Goods responses include maintained inventory identities and
awarded counts; equipment awards use the existing equipment planner.

Lottery daily boundaries use UTC, matching the maintained local event calendar.
Batch spins advance the lifetime and daily counters and update the free-spin
checkpoint. This closes the reference batch path's missing counter updates,
which otherwise repeatedly apply first-spin guarantees or the daily free spin.
Gold top-ups cover the currency deficit and all failures roll back costs and
prizes together. Lottery actions also advance the maintained legacy, daily and
main quest producers with their corresponding native action types.

Campaign catalog conversion preserves nested Boolean conditions and both direct
reference branch forms: a conditional action and an if/else action. Their nested
rewards, claim-flag updates and score caps are maintained data rather than empty
branch declarations. Existing scalar fields and top-level rules remain identical.
The source XML remains read-only and is not a runtime dependency. Synthetic
conversion tests verify nested conjunctions, rewards, claim flags and both arms
of a branch before the campaign runtime interprets them.

Anniversary info, score-box claims and activity-variable reads use the maintained
week and task catalogs plus owned `trigger_var` counters. Server-scoped limits are
read separately; a player action cannot write another scope or another player's
variables. Exact control and trigger windows must both permit a claim. Rewards,
claim flags, inventory postings and the native server-action response commit
atomically. A failed action rolls back earlier planned rewards in the same event.

The anniversary event planner executes maintained nested conditions, compound
actions, bounded long arithmetic, refresh periods, counter changes, reward grants,
mail and variable projections. Item use emits the corresponding server event
inside the inventory transaction. Positive item postings feed acquisition events
once, including awards from other city domains; bounded event expansion rejects
cycles. Clients can read their counters but cannot inject internal campaign events.
Historical catalog dates and disabled rules remain unchanged. Actions requiring
world actors, foreign-player status changes or their battle engines remain gated
until those integrations are validated; they cannot synthesize scores or results.

`1year.info` projects the owned historical anniversary snapshot, alliance totals
and first-battle metadata. Resource divisors remain long values, percent fields
retain their native double or string types, and missing records retain the source
defaults. An absent opponent-name cache can be resolved from the owned first-attack
history without mutating the cache or loading unrelated battle data.

Arena registration and virtual army preferences use migration
`0020_arena_runtime.sql`. Its registration table preserves millisecond timestamps,
application identity and ratings without altering the nullable legacy arena table
or its integer time field. An unambiguous legacy owner imports once; the original
record remains read-only. Native info and roster queries expose the saved state.
Selections validate catalog identities, reject ambiguous duplicate entries and
respect the configured total capacity. They never reserve ordinary world troops.

Arena applications require the feature, castle threshold, resident ownership and
a validated battle gateway. The application and its durable enqueue event commit
together. Match callbacks bind the saved application identity, room and version;
public player commands cannot inject these callbacks. Result consumers require
adapter authorization and the current assignment before updating rating and win
or loss counters once. Native state notifications use the mutation outbox. The
reference float-to-integer rating behavior is retained explicitly.

The current realm composes no validated arena battle gateway. Enrollment and
battle admission therefore fail before changing the registration; info and army
preferences remain available. Admission, actor transfer and battle results belong
to the corresponding validated realm combat integration. Synthetic adapter tests
verify enqueue persistence, stale-assignment rejection and result-consumer
idempotency; they are not battle-engine acceptance or native arena-play evidence.

Expedition periods now have a PostgreSQL manifest and per-player progress keyed
by period and stage. Authorized realm coordination installs a bounded, immutable
schedule with its matched kingdom; player commands cannot install schedules or
submit scores. Exact saved boundaries select the active stage after recovery.
The realm currently has no validated cross-kingdom match coordinator, so it does
not invent an opponent or activate a fighting period at startup.

The local expedition runtime exposes activity info, individual and alliance
threshold rewards and paginated expedition, tax and distribution history. Reward
claims check stage, castle range, participation minimum, science prerequisites
and claim flags inside the player's mutation. Alliance aggregates include only
the current realm, period and stage. The optional research bonus delivers its
second reward through native system mail. Training, construction, research and
gathering supply scores from their validated state transitions with the source
floating-point bonuses; arbitrary client counters cannot supply scores. Combat
score producers and cross-kingdom projections still require their validated actor
integration. Period identities must be issued uniquely by that coordinator.

Expedition treasury reads, daily recipient counters and royal distributions are
implemented independently of battle scoring. Transfers lock local participants
in stable order, verify the current kingdom's king, then debit the shared treasury
and persist a weighted daily counter, distribution record, funded reward mail,
receipt and notification event in one fenced transaction. The recipient claims
the attachment through the existing mail reward workflow; retries cannot create
another mail or debit the treasury twice. Cross-realm recipients are rejected.
The dedicated executor registers only its own kingdom treasury as an additional
ledger account; ordinary player mutation executors retain their owner restriction.

Ordinary gathering marches bind eligible owned pet dragons and new generals in
the saved army snapshot. Preflight validates the same level, feature, castle and
idle-state requirements without reserving a companion. Departure persists the
general's marching state together with the troop reservation. Existing army
snapshots prevent a second assignment even if a legacy general row incorrectly
claims to be idle; a traveling dragon cannot depart. Return releases companions
inside the same transaction that returns troops and credits cargo.

Native march responses and reconnect projections include the saved companion
identities. Durable owner-only notifications update dragon march flags and
general state; nearby interested players receive only the corresponding map and
march projections. Recovery triggered by a march query also writes its durable
notifications. The reference accepts but does not attach `heroUid` in this army
implementation, so that field remains inert rather than inventing hero effects.

Dragon tower state, layer offers, virtual troops and purchased buffs reuse the
maintained tower tables. Native entry pins weighted monster choices once. Army
selection validates owned free quantities and capacity without reserving ordinary
troops. Saved roster buffs authorize replacement or reinforcement and are consumed
once. Healing persists the selected wounded troops and completion deadline;
reconnect or a later tower request recovers that deadline and writes the native
army notification with the transition. Gold and item acceleration remain atomic
with the virtual troop update.

Daily and weekly resets clear temporary armies, healing, buffs, score and claim
counters while preserving the appropriate lifetime and weekly progress. A reset
notification replaces the triggering operation, matching the source proxy's
retry behavior. Share rewards are awarded once per day and their persisted
counter saturates before signed overflow can reopen the reward. Purchases accept
only the saved offered buff and replace matching buff groups. Native rankings
project public local-realm records, and report reads preserve stored long fields.

Tower battle and sweep operations remain gated because the realm has no validated
tower combat integration. Local tests exercise existing imported completed-floor
and wounded-army fixtures; those fixtures are not proof of battle correctness.
No client-submitted win, score, report or casualty map can advance a floor.

The native `activity.close.info` query projects enabled close markers within
strict inclusive UTC windows; malformed or partial dates do not activate a
marker. `resource.client.reward.get` authenticates the player and returns the
maintained reward preview plus the source catalog strings. It performs no claim,
inventory mutation or counter update. Reward previews preserve their native
array, string and correlation fields without introducing a free grant endpoint.

The integrated migration sequence preserves the already published social outbox
retention migration as `0017`. The additional world, totem, arena and expedition
migrations follow as `0018` through `0021`. Databases that applied only the
published develop sequence can upgrade without editing their migration history.
Earlier draft worktree migration numbers were not a deployed release sequence;
disposable databases built from those drafts must be recreated before validation.

Lucky-day polling persists the chosen effect, expiry, daily success count and
unsuccessful-attempt count. A repeated operation replays its saved result, active
bonuses cannot be rerolled, and failed attempts retain the configured cooldown and
guarantee threshold. Native login projects the saved active bonus without making
a new attempt. Platform, realm, version and normal or merged campaign windows
share the existing effect resolver's gates. Historical dates remain unchanged.

Activation writes the lucky-day row at the existing production boundary. The
production schedule includes both the new rate and its saved expiry cut, so a
later settlement cannot apply the bonus retrospectively or continue it after
expiry. Lucky-day polling grants no items or gold; ordinary production settlement
continues using its existing audited resource postings. Realm metadata must be
present before the campaign can create an active effect.

Castle-level event entitlements are earned only at the exact configured castle
level, through a validated construction completion or native UI reconciliation.
Owned rows in either historical shard remain in their original table. New
numeric UIDs preserve the legacy prefix modulo-two placement; modern nonnumeric
UIDs use the deterministic Java string hash parity. Duplicate owned levels across
shards are rejected rather than ambiguously selecting a claim record.

Personal and collective rewards use the maintained pay-reward catalog, with
realm-wide achievement totals calculated across both shards. Claim markers,
inventory changes and receipts commit together. Native UI arrays retain their
integer-array and string-array types and expose only the owner's purchase IDs.
Missing historical exchange definitions produce an empty preview, without
inventing a purchasable package. Payment receipts remain the responsibility of
the validated payment pipeline.

Login recovery marks eligible unclaimed level rewards and funds one system mail
inside the same transaction. The configured realm-age window applies to this
automatic mail path; explicit claims preserve the reference's entitlement-based
eligibility. Realm opening time comes from saved server metadata. Closed feature
selectors and historical configuration remain unchanged. No migration or private
resource input is required.

The native alchemist `info` and `reward` actions use the independent type-one
activity counter row. Its panel window, initial wait, subsequent cooldown and daily
cap are enforced from maintained configuration. UTC daily reset clears counters
while retaining action timestamps. Receipt replay pins rewards once, and a failed
transaction rolls back inventory and counters together. A premature request returns
the source's empty response without awarding a reward. Type-zero minstrel records
remain independent. No migration or feature enabling is introduced.

Daily investment uses maintained bank plans and the existing owned investment
row. Enrollment validates castle, VIP and realm-age conditions, debits the configured
game gold once and stores its installment flags and start time. Installments become
eligible at UTC calendar-day boundaries, including slot zero on enrollment day.
The persisted `0`/`1` flag is authoritative: a fresh request cannot recredit a
received slot. Bounds, future installments, unfinished-plan replacement and
insufficient funds reject before a partial mutation can commit.

A saved unfinished plan remains visible if its sale ends. Login sends one reminder
per UTC day while a due unclaimed installment exists; enrollment and completion
mail use only configured template keys. The legacy catalog's `end_mai` spelling
does not silently become an `end_mail` template. Notifications, claim flags, game
gold and receipts share the player transaction. This workflow handles game currency
only and introduces no payment provider, schema migration or dependency.

Shipping investment persists its lifetime tier count and last gross return in the
owner's mixed-info row. Only the next configured tier can execute. The opening
game-gold stake and active VIP requirement are checked before drawing; the stake,
weighted return, counter and receipt commit together. A retry returns its saved
result without another draw. Native UI projects the next offer as catalog strings
and retains the integer count and gross-return fields. Unrelated mixed-info
columns are preserved.

The configured weight bands all participate in selection and amount ranges retain
the reference's exclusive upper endpoint. This corrects the decompiled selection
loop that could keep selecting the first band, and prevents clients from skipping
straight to a later tier. Closed realm controls and absent mixed-info rows return
the native empty response without a grant. No schema migration, payment provider
or additional dependency is introduced.

Seven-day cycles persist three independent page stages, claim lists, purchase
wait times and reset deadlines. Native offer selection uses configured castle
level bands, native numeric price fields and catalog strings. Expired cycles
recover their stage and reset deadline on access. Reward previews do not grant
anything; claims validate the selected page and level band and use exact saved
claim tokens before granting once.

The internal purchase consumer requires a validated payment gateway and the
canonical operation ID derived from its owner and accepted external event ID.
This makes replay of the same accepted event stable across days, while another
operation ID or changed purchase payload rejects. The next stage and one-purchase
per-UTC-day rule are authoritative. Draw credits are produced by accepted
purchases only, and login never invents credits. The default realm composition
has no payment gateway, so it cannot accept paid progression until the validated
payment pipeline is connected. Public clients cannot invoke this producer.

Draws consume saved credits, pin configured weighted results, and can grant
rewards, temporary statuses or replacement draw credits. Statuses use the existing
production boundary and native status notification. Saved status deadlines and
rare-result history survive reconnects; expired deadlines project zero in the
native draw table. State, history, inventory and receipts commit together. The
weighted selector uses nonoverlapping bands to avoid the source's inclusive-boundary
bias. Existing cycle, draw and history tables are reused without a new migration.

Ordinary box previews pin the selected pay-reward pool and special flag in the
existing 128-word mixed-info encoding. Opening consumes the owned box through the
inventory planner and consumes its key or explicitly enabled game-gold fee inside
the same transaction. The saved pool is awarded once, the configured guarantee
counter advances, any threshold reward is granted, and the next pool is pinned.
Repeated previews do not reroll the saved pool; a request cannot turn a preview
into an opening. An opening without a prior preview first pins its pool in the
same transaction, so it cannot consume a box without awarding its configured pool. Maintained box items do not support bulk use.

Bit-field updates preserve unrelated signed words and adjacent counters. Empty
maintained bootstrap encodings, including an empty object, initialize to zero;
unknown nonempty encodings reject instead of being discarded. Catalog conditions,
VIP score, realm age and the lucky-day box effect select the eligible weighted
pools. Native previews retain raw item/count strings and reward-preview fields.

Migration `0022_ordinary_box_gold_mode.sql` adds one bounded mode field to mixed
info. Gold mode is explicit, checked again against its feature gate on opening,
and reset by login or a new preview. Login resets only that mode without parsing
or rewriting unrelated mixed-info data. Back up mixed-info rows, inventory,
receipts and ledger before deployment. Rollback must retain cached pools and
counters; older binaries can ignore the additive mode field, whose default is zero.

New-server cumulative recharge uses the existing lord total and owned threshold
claim rows. Native UI projects raw threshold fields and maintained reward previews;
login preserves the total as a long and projects either an inclusive dated window
or a realm-age deadline. Qualified thresholds grant once with their claim markers.
Explicit claims retain the reference's saved-total eligibility rather than
discarding earned rewards when the window closes.

An internal accepted-event consumer requires a validated gateway, an immutable
server-provided amount and occurrence timestamp, and the canonical owner/event
operation ID. Client amount fields never contribute to qualification. An accepted
event from the active window can arrive late without being credited twice. This
consumer updates the qualifying total only; purchased game currency belongs to
the payment pipeline. The default composition has no payment gateway and cannot
accept this internal producer from a public client.

After the event closes, login recovers each eligible unclaimed threshold into one
funded system mail and records the same claim marker atomically. Reconnect and
receipt replay cannot duplicate mail or direct claims, and failed receipts roll
back totals, markers and mail together. Existing saved totals and other lord
fields are preserved. No new migration, provider connection or dependency is added.

Recharge feedback previews compare only the owner's in-window nominal-price
counts and keep the native array of boolean elements aligned with the catalog
rows. Nominal cents are derived from consistent maintained product prices; missing
or conflicting prices do not qualify a reward. Payment-log reads return aggregate
counts or the minimal selected order fields, rather than exposing payment details.
The maintained empty feedback catalog is valid and preserves the currently closed
historical configuration.

The internal feedback consumer requires a validated gateway and its owned saved
payment. Event IDs have canonical receipt identities, and qualifying thresholds
have durable owner, catalog-ID and period markers. Processing confirmations out
of order recovers all reached thresholds and cannot duplicate an already funded
mail. Late confirmations use the saved occurrence time. Mail, threshold markers
and the mutation receipt commit together; no purchased currency is granted here.
The default composition has no payment gateway and the consumer is not public.

Migration `0023_recharge_feedback_claims.sql` adds period-specific delivery markers.
Back up mail and delivery records before deployment, and retain these markers
during rollback. Existing historical deliveries have no equivalent marker;
operators must seed their delivered thresholds before replaying old callbacks, or
begin with a fresh event period. No payment provider or new dependency is added.

Target tasks reuse the owned task and period-note tables. A stable UTC weekly
window selects distinct, castle-eligible weighted tasks and persists their IDs,
quantities, progress, completion and reward multiplier. Only the matching day and
trusted server action advance a task. Training, healing, defenses, construction,
research, collection returns, quest producers and item-use hooks update progress
inside their original mutation, so retries and failed receipts cannot create
additional progress. Target queries recover owned world transitions first so a
finished collection contributes before the period's mail recovery.

New assignments include only task types with a maintained trusted producer.
Imported unsupported tasks remain readable; combat, cross-realm and payment task
producers require their corresponding validated engine or payment integration.
The public transport does not accept arbitrary progress or purchase events.
Completion items preserve the saved counter and doubling consumes the requested
owned quantity while incrementing the multiplier once, matching the reference.
Items cannot be consumed after a period expires or its rewards are claimed.

Both ordinary and validated premium claims grant the configured full reward:
the reference's ordinary-claim fraction is not applied to its actual grant.
Empty claims reject instead of forfeiting an uncompleted period. Claims, item
costs, markers, ledger and receipts commit together. An expired unclaimed period
funds one mail per completed task, aggregating its repeated reward quantities
instead of creating hundreds of identical mails. Mail recovery precedes any new
period replacement. Premium claims require an accepted immutable payment proof
and canonical event receipt; the default realm composition has no such gateway.
Its durable private notification contains only the owner's resulting reward.
Back up task notes, tasks, inventory and mail before deployment; preserve claim
modes and period bounds when rolling back. No new migration or dependency is added.

VIP wheels persist the selected daily table, awarded indices and paid-draw step
in the existing owner and VIP-band rows. The first draw is free and each following
draw consumes the configured owned token quantity. Awarded indices are excluded
from subsequent weighted choices. Exclusive random intervals remove the source's
boundary bias. A query may preview a higher band, but drawing always resolves the
owner's saved VIP and super-VIP level; expired VIP activation does not erase that
level. UTC-day rollover requires a new table selection before another draw.

Native replies preserve raw catalog string fields, their Java hash-map field
order, boolean free-state semantics and the existing item/index response. Draw
costs, grants, wheel progress and notable-result history commit with the receipt.
A failed transaction leaves no partial result. Login projects existing saved state
without granting a new spin. Feature closures preserve the saved wheel.

Migration `0024_vip_box_history.sql` replaces the volatile shared notable-result
list with a durable structured history. It retains the newest fifty results,
serializing only history writes across owners. Names remain structured strings
rather than a comma-delimited encoding. Back up wheel rows, inventory, receipts
and this history before deployment. Rollback must preserve awarded indices and
the consumed-free-draw marker; the additive history table can remain in place.
No new dependency is added.

Seasonal exchange supports the reference's five-step jester-token activity using
the existing persisted realm period and owned offer row. Queries pin weighted
reward IDs and token prices, refresh elapsed offers only in the configured refresh
mode, and project the native reward previews. Each claim must select exactly the
next level, consumes owned tokens and grants the selected reward atomically. The
fifth paid step starts a new saved offer cycle; a repeated receipt cannot repeat
its cost or grant. Catalog IDs, prices and timestamps remain authoritative.

The persisted period must be open, started and unexpired. Unsupported activity
types reject rather than creating invalid rows with an empty exchange item.
Frozen mode preserves saved offers after the refresh interval. Existing reserve
and auxiliary fields remain intact on updates. Back up activity rows, inventory,
receipts and ledger before rollout, and retain the saved level and offers during
rollback. No new migration or dependency is added.

Raw catalog objects in castle-level, cumulative-recharge and shipping UI replies
use the validated Java hash-map traversal order before native encoding. This
preserves the reference's field order independently of the maintained catalog's
TypeScript property order. Nested reward arrays retain their existing wire types.
Focused PostgreSQL assertions cover the emitted field sequences as well as the
existing economic behavior. This correction changes no saved data or migration.

Process acceptance starts the actual realm server in a separate Bun process with
synthetic PostgreSQL, Redis and ZooKeeper services. A native TCP departure reserves
troops, then SIGKILL interrupts the process while its march is outbound. A fresh
process acquires the same kingdom with a higher persisted authority epoch and
reconstructs the saved march. Replaying the departure receipt reserves nothing
again. Native acceleration, gathering and return restore all troops and deliver
exactly the target's five resources once. A nearby subscribed native client sees
march, point and deletion notifications; a distant client sees none.

The test uses synthetic catalog travel and gathering rates to bound its duration;
maintained route arithmetic has separate rule and repository acceptance. It waits
for the real ZooKeeper ownership lease to expire instead of clearing shared state.
Its processes, clients and disposable services are cleaned up after success or
failure. This verifies the native wire transport, rather than APK execution.

Realm login sessions now bind their Redis key to the acquired database authority
epoch. After a crash, an old token cannot block a new owner generation's login or
remove its token. The existing token comparison and TTL continue to protect
replacement sessions within one generation. Old cache keys expire naturally;
wallets, marches and receipts are not reset. No schema migration is introduced.

Player item gifts accept only owned type-25 gift tokens and an existing recipient
in the same kingdom. Sending consumes one token and appends one durable received-item
row with the sender's receipt. A client quantity cannot increase the gift. Offline
recipients retain their queue until owned login recovery; connected recipients
also receive bounded background delivery. No public command can acknowledge or
consume another player's pending gifts.

Delivery locks and consumes only the selected owner's next sixty-four rows. Each
row grants one mapped item, matching the reference's handling of its otherwise
unused item-count field. Inventory, selected queue deletion and the delivery
receipt commit together. Concurrent retries cannot grant again; new arrivals
outside the selected batch remain queued. Login preserves paired native string
arrays for sender names and original gift IDs. Names containing commas remain
structured strings. Connected delivery persists private item and sender
notifications in the outbox so publication is separate from the committed grant.

Migration `0025_player_item_gift_index.sql` adds an owner and row-ID index to the
existing queue. It changes no existing rows or gift amounts. Back up pending gifts,
owned inventory, receipts and outbox before rollout. Retain undelivered rows and
committed receipts on rollback; never restore consumed rows independently of their
inventory grants. The additive index can remain. No dependency is added.

## Allied heart effects

`heart.send` validates current kingdom membership, a shared nonempty alliance,
and the exact owned type-20 item UUID before consuming one item. Both base-city
points retain the catalog effect and its expiration in seconds. The response
keeps the target point as UTF; map projections retain the reference signed-INT
seconds while `push.heart.having` uses UTF milliseconds. Teleport and initial
city placement clear cosmetics on reused ground.

Offline recipients retain the existing received-heart queue. `heart.init`
acknowledges at most 64 selected IDs and preserves the reference joined sender
names, first effect and LONG expiration relative to login. Connected recipients
receive a private notification; nearby map subscribers receive public effects.
A separate bounded worker drains deliveries when a recipient connects during a
send and relays committed notifications without delaying march recovery.

Migration 0026 appends an identity and owner index to the existing queue. It
backfills distinct IDs even for identical imported rows. Item consumption, city
effects, pending insertion, receipt and outbox commit atomically; failed delivery
receipts retain the selected rows. Back up these records together. Preserve
committed acknowledgments during rollback and retain the additive identity/index.
Synthetic PostgreSQL tests cover exact-stack consumption, concurrent retries,
rollback, bounded queues, missing recipient cities and interested-player pushes;
a migration test verifies imported duplicates and later arrivals survive.

## Fresh-realm event clock

After acquiring and fencing realm ownership, a fresh empty kingdom records its
opening instant once in `server_info.activityTime`. Concurrent starts serialize
and restarts retain that instant, so age-based castle, recharge, investment and
VIP periods do not move with the process clock. Existing rows, including zero or
unknown timestamps, remain unchanged. Populated imported kingdoms without this
metadata remain unknown; startup does not silently reopen their event periods.
No migration or dependency is introduced. Back up and retain the opening metadata
across restores. A disposable PostgreSQL scenario covers concurrent starts,
owner replacement, stale-owner rejection and preservation of imported metadata.

## Regional return gifts

`region.recall.init` selects the authoritative registration country, preferring
the reference type-2 registration. It validates the configured calendar,
registration cutoff, minimum offline interval, castle level and reward ladder
before creating the existing regional-recall row once. Its cosmetic deadline
is UTC midnight after the configured number of days. Optional catalog statuses
use that deadline and settle production through the shared boundary. Alliance
announcement mail commits with enrollment and is not repeated on reconnect.

`region.recall.open.ui` preserves nested reward arrays and the saved claim count.
`region.recall.receive` grants the next configured reward at most once per UTC
day, independently of client counters. The response retains the reference's
previous receive timestamp. The seven earned gifts remain claimable after the
cosmetic/login-banner deadline, matching the reference entitlement semantics;
this does not create another enrollment or extend its temporary statuses.

No migration or dependency is introduced. Back up regional rows, registration
metadata, inventory, receipts and mail together. Preserve committed claims during
rollback. Synthetic PostgreSQL scenarios cover all seven gifts, concurrent
retries, eligibility, UTC rollover, receipt failures and once-only alliance mail.
Native APK/device execution remains unverified.

## Returning-player tasks

`recall.task.init` selects the maintained regional task control by saved
registration country and castle band. The configured overall period controls
initial enrollment; the returning-player cutoff determines the saved opening
marker. Assignments, target quantities and completion/claim flags use the
existing recall tables. They do not reset on reconnect.

The shared confirmed-action hook advances matching recall tasks alongside weekly
target tasks. Completed training, construction, research, returned gathering,
item use, equipment actions, lottery and supported alliance actions supply their
actual quantities. Clients cannot post counters. Native prayer supplies the prayer
producer required by the maintained assignments. Combat and paid
producers require their corresponding validated engines.

Owned task progress stops at its saved deadline; completed entitlements remain
claimable once. The native UI retains Boolean state and receive fields, INT
counters, nested reward arrays and the LONG opening marker. Milestone status or
reward updates commit with the task claim and cannot repeat the same saved
milestone. Migration 0027 appends a last-login timestamp so daily login credit
survives reconnect independently of per-login task credit and claim timestamps.
The initial enrollment preserves the reference behavior of creating tasks after
that login's progress hooks.

Back up assignments, notes, rewards, status rows, receipts and inventory together.
Retain the added timestamp during rollback. Synthetic PostgreSQL scenarios cover
maintained assignments, actual completed training, daily reconnect credit,
concurrent claims, failed receipts and once-only milestone effects.

## Native prayer and confirmed event progress

`user.pray.info` and `user.pray` use the owned altar, its maintained level/star
parameters and the saved `user_pray` row. The server validates the exact resource
quote and gold price before selecting a multiplier. First free and paid draws
use the configured reference first-hit pool; subsequent draws use the altar's
weighted pool. Growth, per-resource escalating prices, daily limits and free
item credits persist with the resource grant and receipt. Retry reuses the
committed result and cannot draw or spend again.

The response preserves INT quotes, flags and multipliers, Boolean first-use
markers, and LONG uppercase native resource balances. Steel quotes apply the
reference float arithmetic for effect 205 while the matching silver asset uses
the authoritative ledger. UTC rollover resets daily counts and amounts while
retaining unused item credits and first-use history. Altar upgrades rescale the
saved daily amounts without replaying prayers or costs.

Owned item 200031 enters the internal prayer-credit domain through the inventory
transaction; clients cannot invoke the credit producer directly. Confirmed prayer
updates returning-player and weekly targets, daily tasks, expedition scoring and
supported campaign triggers. The existing prayer history stores each committed
draw. No migration or dependency is introduced. Back up prayer rows, history,
resources, inventory, receipts and event progress together and retain committed
receipts during rollback. Synthetic PostgreSQL and wire tests cover quoted costs,
pinned draws, free credits, UTC reset, status effects, upgrade scaling and rollback.

## Client campaign recipes

`trigger.activity` maps client selectors to the fixed client event 51; selector
47 retains its dedicated share event. Clients cannot choose authoritative item
acquisition or combat events. The maintained four-part painting recipe verifies
all owned ingredients and its catalog selector before consuming the exact costs,
granting the pinned prize and recording campaign score in the same receipt.
Wrong selectors roll back rather than advancing a score without an exchange.
The response retains the INT selector and native server-action reward pushes.

Owned cake interactions consume one catalog item, update the configured
cosmetic statuses and evaluate their exact-count milestone. Overlap-five status
counters now preserve their original deadline, increment their stored count and
reset at the configured limit. The target-cosmetic module applies these interactions to another local player
under the shared multi-account mutation boundary. Current recipes retain their historical exclusive
calendar bounds. No migration or dependency is introduced. Preserve ingredient,
reward, variable, status and receipt records together during backup and rollback.

## Cosmetic interactions between players

Cake interactions select a real player in the same kingdom and lock both profile
rows in sorted order before charging the sender or changing the recipient. The
selected target is retained by the repository and checked again for writes.
The bounded campaign route changes only configured cosmetic statuses without
economic effects; currency, inventory and economic buffs cannot be assigned to
the recipient through a client trigger. Receipt failure rolls back sender costs,
recipient statuses, cosmetic ownership and notification outbox together.

The existing cosmetic storage controls the final reference lifetimes: cake
counters retain fourteen days, bubbles last five seconds and the fiftieth-count
castle appearance lasts one hour. Active permanent ownership remains permanent.
Modern status replacement compares configured subgroups. Only changed status and
ownership rows are written; unrelated effects and owned appearances remain intact.

Committed private status and activation messages go to the recipient. Native
bubble, overlap and city updates reach the sender, recipient and interested map
subscribers. The map query reads cosmetics only for city owners among its selected
points and projects signed INT seconds, overlap counts and nested bubble fields.
Expired appearances disappear from projections without replaying the interaction.
No schema or dependency change is required. Preserve status, cosmetic storage,
sender inventory, receipts and pending notification records together on backup and
rollback. Synthetic PostgreSQL checks cover opposing sends, transaction failure,
realm boundaries, map projections, expiry and notification privacy.

## Trouble event marches and history

Native type-13 marches carry one exact owned type-26 item to another resident
city. The scout route uses the investigation-speed effect and watchtower honour
steps. Empty armies are allowed only for this explicit march purpose; they cannot
collect or carry resources. Supplied troops remain subject to ownership and march
reservation limits. Preview does not consume inventory. Departure, item decrement,
checkpoint and owner notification commit together, and retries retain one march.

Arrival verifies that the original city still belongs to the selected recipient,
then persists its delivery in the march transaction and starts the return. Recall
and a changed target suppress delivery. The fenced realm relay applies the effect
through the recipient's own mutation transaction with an operation ID derived from
the march identity. Pending delivery survives authority replacement; replay cannot
extend the status or duplicate history. Status duration uses the saved arrival
processing time so delayed delivery does not extend the effect. The route performs
no combat or resource credit. Native trouble notifications reach the recipient,
sender and interested map subscribers through the committed notification outbox.

`get.trouble.list` returns the ten newest structured entries with UTF status, name
and item fields and LONG timestamps. `trouble.speed` quotes the reference cooldown
formula, charges total owned gold and removes one trouble status atomically with
its receipt. Same-variant effects extend duration; opposite variants subtract the
incoming duration until replacement is required. Map projections prefer trouble
over ordinary castle appearances and remove expired effects.

Migration `0028_trouble_history.sql` widens existing numeric owner IDs to strings,
retains nullable legacy owners and duplicate rows, and appends item and identity
columns. It preserves the existing owner index and adds ordered owner lookup.
Back up history, status, march checkpoints, inventory, balances, receipts and
pending outbox records together. Rollback must retain the widened owner column,
new history identities and pending deliveries; an older binary must not process
active type-13 checkpoints. No new dependency or environment variable is needed.
Synthetic PostgreSQL tests cover migration of legacy rows, exact-item costs,
preview, concurrent replay, authority replacement, moved targets, recall,
notification recipients and rollback of paid removal. Native-device acceptance
and the remaining specialized combat engines remain separate acceptance work.

## Confirmed continued-cost events

`continuedcost.info` and `continuedcost.reward` use the maintained event window,
castle minimum, feature gate and reward tiers. The fresh response retains INT zero
for an absent cost record and LONG points for saved progress. Existing earned,
unclaimed tiers remain claimable once. Confirmed spending automatically funds mail
12174 for each newly reached tier and records the claim and activity log in the
same recipient transaction. Global-prize previews and the native ranking-privacy
toggle retain their feature gate; previews do not grant prizes.

The inventory planner supplies a pure spending observer. The common repository
invokes it only after validating the final posting chain, including shop debits
added after item planning. It counts actual negative gold pools, speed-item
quantities and bound or unbound wood, food, iron and stone costs. Credits, free
previews, rejected operations and receipt retries add no points. The confirmed
fact captures the original castle eligibility, period, reward thresholds and gold
pool distribution in the same transaction as the spending receipt. Clients cannot
submit or choose these facts.

Nickname changes use their existing distributed commit flow. Its gold debit saves
the original spending fact with the prepared payment. Successful finalization
publishes it atomically with the committed realm state; refunded changes publish
no spending fact. Recovery retains the original eligibility and does not debit or
publish twice. Existing payment records without this optional fact remain valid.

A bounded, fenced realm worker consumes committed facts with operation identities
that include the owner, original request and event. Native cost reads first drain
that owner's pending facts, with bounded work and a prompt failure if delivery
remains pending. Deferred failures receive a retry deadline so another owner's
facts can proceed. Late facts retain their original period after the event closes
or a newer event begins. They cannot reset or contribute to a later period.

Migration `0029_continued_cost_periods.sql` appends a period-start column to the
existing activity-cost table and extends its primary key. Old rows remain in
period zero and are imported into an applicable event once, preserving totals
and claim flags. Other periods and types remain independently addressable. The
existing activity log and funded system-mail tables are reused. No new dependency
or environment variable is required. Back up cost rows, legacy rows, nickname
payments, spending receipts, logs, mail and pending facts together. Disable the
cost event before binary rollback and preserve the period key and pending facts;
restoring only balances or claim flags would break accounting. Cross-realm rank
aggregation and final global-rank settlement remain coordinator work.

## Limited daily paid offers

`special.ui.state` preserves the configured minimum version, ordinary and test
realm selectors and inclusive calendar bounds. The two native UTF arrays retain
the same ordered counter sequence as the reference protocol. The UI selects the
original exchange catalog; admission also accepts the corresponding maintained
new-exchange definition. The current catalogs contain no type-500 offers and
retain their historical closed window, so this migration creates no new products.

The API payment owner can reserve one globally limited unit through
`SpecialEventPurchaseService`. Global PostgreSQL transactions serialize each
product's capacity across realms and enforce one active purchase per character,
product and UTC day. Admission requires an owned realm reader and respects existing
legacy exchange timestamps before creating a hold. A reservation becomes paid only through the injected trusted
payment-proof gateway. Repeating an order retains its original identity; a
cancelled hold releases capacity and a paid purchase cannot be cancelled through
that path. Unresolved holds remain available for payment reconciliation rather
than expiring into a possible second sale. Stock locks have a one-second wait
limit and transactional statements have a three-second limit.

The realm consumes only verified paid records for its own kingdom. Its fenced
command receipt and existing exchange-time row commit together, then a separate
global acknowledgment marks delivery. A lost acknowledgment replays the same
owned receipt. Late older purchases cannot move the saved daily timestamp
backward. A bounded worker defers failed records so other recipients can proceed.
Package grants remain owned by the shared payment contract; these availability
and daily-purchase hooks do not mint the package a second time. Client commands
cannot reserve, confirm or submit a paid purchase. Provider-specific payment
binding remains an explicit integration boundary.

Global migration `0011_special_event_stock.sql` adds the purchase reservation,
confirmation and delivery table, with daily uniqueness, stock/delivery indexes
and consistent period, clock and state constraints. Existing global and realm rows
remain intact. Before enabling an imported active campaign, reconcile its prior
counter and provider records with the admitted-purchase ledger. Back up global
purchase records, realm exchange times, receipts and the payment owner's orders
and grants together. Preserve confirmed units and unresolved holds on rollback;
rewinding only a displayed counter could sell the same capacity twice. No new
dependency or environment variable is introduced.

Synthetic PostgreSQL tests exercise competing realms, payment rejection,
immutable orders, cancelled holds, UTC limits, receipt failure, acknowledgment,
out-of-order delivery and the lock deadline. Native TCP checks retain LONG
correlation and reject the internal payment producer. Actual provider and native
APK/device execution are not claimed by this module.

## Realm group-buy rounds

`groupbuys.info` preserves the native reward thresholds, exchange products,
realm-wide point total, eleven-entry participant preview, personal point count,
castle-level purchase code and LONG round/cutoff clocks. Despite its historical
name, the reference aggregates the kingdom's participants without an alliance
filter. Visibility requires the function gate, resident character and configured
minimum kingdom age. The maintained calendar remains closed by default; no paid
products or providers are activated.

The payment owner must obtain a fenced `groupbuys.reserve` result before charging.
The internal reservation retains its order hash, product, original point quantity
and admission time in the existing participant history. Outstanding reservations
consume the personal point limit but do not count as paid points. Only the injected
trusted payment gateway can confirm or cancel an order. Confirmations bind the
owner, kingdom, activity, round, product and original payment time. Replays retain
the same canonical operation. Uncertain holds have no automatic expiry; the payment
owner must reconcile them before releasing capacity. Package grants remain the
shared payment contract's responsibility.

Existing activity and participant tables persist schedules, paid points, order
markers and delivered reward counts. A kingdom transaction lock serializes round
admission, confirmation and closure, with a one-second lock wait. Stored schedules
retain their configured thresholds. Closing a round requires a trusted reconciled
payment watermark whose total matches the realm's committed paid points and no
remaining uncertain orders. Closure freezes the total and selected reward mail.
Delayed valid confirmations and closure still address their original persisted
round after the calendar ends. Imported closed rounds can resume any unpaid mail
points using their original activity and participant rows.

A bounded, fenced worker traverses closed rounds and sends one funded system mail
per unpaid point, committing mail, delivered count and command receipt together.
Its cursor advances past failed recipients and wraps after the end. Receipt failure
rolls back both mail and progress; a repeated delivery cannot grant another mail.
Native clients can query the event but cannot reserve, confirm, cancel, close or
settle payments. Provider-specific binding, order creation and the reconciliation
watermark remain payment-owner integration ports.

No migration, dependency, environment variable or mobile artifact is introduced.
Back up activity schedules, participant histories and reward counts, receipts,
funded mail and payment-owner orders together. Preserve outstanding reservations
and confirmed points during rollback. Reconcile legacy purchases before enabling
an imported open round; do not alter its product point mapping during payment
reconciliation. Synthetic PostgreSQL acceptance covers competing reservations,
proof rejection, delayed confirmation, uncertain holds, round isolation, legacy
recovery, settlement rollback and lock deadlines. Native TCP acceptance verifies
LONG correlation and rejection of every internal payment command. Provider and
native-device execution are not claimed.

## Cup predictions and persisted sporting results

The five native `euro.cup` commands now expose match listings, owned betting
history, placement and reward collection. The maintained server catalog defines
countries, admission and match clocks, original odds, allowed resources, aggregate
stake caps, per-match bet counts, participation rewards and final results.
Client requests cannot publish a result. Country selectors resolve to the stored
canonical side, and zero or negative stakes reject before any economic write.

A fenced kingdom schedule service persists stable country/time match identities
and only applies configured results after betting has closed. Resolved results
remain immutable. Match totals are serialized with owned wager admission; the
resource debit, actual participation grant, wager, pool update and command receipt
commit together. Stakes consume bound resources first. Each wager retains the
float odds quoted at admission, and later pool changes cannot change its payout.
A one-sided pool retains its configured opposite-side price until both sides have
stakes, avoiding an infinite quote for a new purchase. Existing positive infinite
legacy receipt odds retain the reference's capped Java integer payout.

Migration `0030_cup_odds_precision.sql` changes the two match prices and owned wager
price from two-decimal numeric values to PostgreSQL real values. This preserves
Java float quotes and dynamic pool prices. Already rounded imported prices remain
at their saved value; the migration cannot recover discarded historical precision.
Native listings use the shortest matching float representation, and owned receipts
retain the SFS FLOAT tag. Direct resource winnings credit bound balances in the
reference's resource order. Large legacy totals retain their complete economic
value through bounded native integer reward entries rather than integer wraparound.

Native claims mark winning and losing resolved wagers as collected in the same
transaction as the winning credits. After the event ends, a bounded worker sends
one funded system mail per winning wager, up to 64 wagers per recipient command.
Its canonical operation identifies the exact owned wager batch. A later match
result or a second batch receives its own operation, while an acknowledgment retry
reuses the committed receipt. The cursor advances past failed recipients and wraps
after exhaustion. Unresolved results remain pending and cannot manufacture a win.

The existing closed calendar remains unchanged. No provider, charge, dependency,
environment variable or client artifact is introduced. Back up match rows, owned
wagers, receipts, inventory grants, resource postings and funded mail together.
Retain saved float prices during rollback; converting them back to a two-decimal
column loses precision and requires a deliberate data rollback. Keep already
collected flags and paid mail consistent with balances. Synthetic acceptance covers
concurrent wagers, mixed and bound resources, stake/count caps, cutoff, fixed odds,
trusted results, receipt rollback, repeated claims, delayed outcomes and mail batches.
Native TCP preserves LONG correlation and rejects the internal settlement producer.
Device execution and actual sporting-result ingestion outside the maintained server
catalog remain unverified.

## Olympic prediction questions

The four case-sensitive native `Olympic` commands preserve question listings,
owned betting history, integer stake inputs, remaining total gold and reward
arrays. Questions use the maintained betting catalog and activity-panel calendar.
The displayed pool retains the reference's ten-minute growth, integer conversion
before multiplication and LONG representation; this display is separate from the
actual staked resource ledger.

Admission accepts positive configured resource or gold stakes within the individual
limit and strict question cutoff. Resource stakes consume bound balances first;
gold stakes use the existing owned gold pools. The wager, shared question total,
debit and command receipt commit together under a fenced transaction and a
one-second question-lock deadline. Client requests cannot set a result. Only
trusted maintained server definitions can close a question after admission ends.

Migration `0031_olympic_settlement.sql` appends nullable winning-stake, reward-pool,
tax and zero-pool reward-limit fields to the existing question table. Closing a
new question freezes the correctly answered stake total, losing pool or configured
basic fallback, normalized tax and limit. Each winning wager receives its principal
plus the reference integer share and one-unit bonus, capped at the Java integer
maximum. Later configuration changes cannot recalculate a closed pool. The
settlement constraint requires a complete valid snapshot or an entirely absent
legacy snapshot. Composite owner/question and question/country indexes bound the
owned read and shared aggregate queries.

The event owner updates its question projection and aggregate SQL; owned commands
materialize individual wager outcomes and grant economic value. Repeated or
concurrent claims cannot credit a wager twice. Imported closed questions with no
new settlement snapshot retain the saved legacy wager reward. Reconcile imported
open-question totals before enabling a new admission period rather than resetting
old wagers or inferring a replacement reward pool.

After the panel ends, a bounded fenced worker processes up to 64 owned wagers per
recipient command and sends one funded system mail per winning wager. The exact
wager batch identifies the canonical operation. A late result and a remaining
batch can therefore settle independently, while repeated delivery reuses its
receipt. Losers are marked collected without economic value, and unresolved
questions remain pending. The default historical calendar and disabled panel are
preserved. No provider, charge, dependency, environment variable or mobile artifact
is added.

Back up question snapshots, owned wagers, receipts, economic postings, collected
flags and funded mail together. Keep appended settlement fields and indexes during
binary rollback; dropping only the snapshot could recalculate earned winnings.
Preserve legacy rewards and recorded claims. Synthetic PostgreSQL acceptance covers
concurrent stakes, resource and gold-pool debits, configured limits, display growth,
fixed final pools, fallback rewards, failed stake and reward receipts, repeated
claims, delayed result mail and imported rewards. Native TCP preserves LONG
correlation and rejects result publication and internal settlement. Native-device
execution and external sporting-result feeds remain unverified.
