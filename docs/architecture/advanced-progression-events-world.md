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

## Hero event detail projections

`hero.event.info.get`, `hero.event.ranking.get` and `hero.cross.info` read the
persisted main periods, event definitions and owned personal/alliance scores.
Detail responses retain native field order, reward-preview arrays, target strings,
persisted bands, completion flags and integer-set claim ordering. Personal fallback
bands retain the reference's castle-level cap; alliance fallback bands use the
current alliance power. Rank positions use the existing shared Redis publication
and gate rules. Kingdom event views retain the configured kingdom order and hydrate
available public names and banners.

The reader uses a repeatable read transaction, rejects ambiguous active periods and
bounds events and owned aggregate rows. It selects the authenticated character and
its current alliance aggregate. Querying a preview preserves saved scores, claims,
rank keys and expiration. The packet budget applies before returning the response.
Cross requests resolve the home kingdom recorded on the authenticated profile,
validate the home character and use only configured realm connections. Missing,
banned or unavailable home characters return the reference's empty cross response.
Client-supplied realm selectors do not route these reads.

Cross-panel projections combine saved main periods with the maintained Sunday-first
upcoming calendar. Existing stronger-lord activity suppresses upcoming fallback
periods. Configured panel dates, merge windows, popup conditions and public resource
hashes retain their native representations. The configured kingdoms use the common
maintained gameplay catalog. No schema migration, dependency or environment variable
is added. Main-period creation, confirmed score producers and automatic hero-rank
settlement remain subsequent coordinator work; queries do not create those states.

Synthetic acceptance uses two disposable kingdom databases, shared public kingdom
metadata and actual Redis ranks. It verifies owned score filtering, saved completion
flags, personal/alliance bands, reward previews, kingdom order, cross-home routing,
expired periods, missing home characters and unchanged score/rank state. Native TCP
preserves LONG correlation on all three commands. Native-device execution remains
unverified. Saved state and rollback use the existing hero activity, event, score,
reward-record and rank-publication backups.

## Persisted hero calendars

The realm now admits and recovers configured personal, alliance and kingdom hero
periods through a fenced scheduler. Sunday-first eligibility, UTC day boundaries,
preparation/running intervals, the configured event sequence and coupled kingdom
stages persist in the existing activity/event tables. Stable realm/definition/time
identities and one transaction per refresh make concurrent starts and repeated
recovery idempotent. Existing active imported identifiers remain authoritative.

Recovery creates the currently applicable stage and preserves earlier stages and
scores. Expired main periods close; missed inactive stages do not receive synthetic
participation. Existing periods retain their saved round and running interval,
including multi-day periods on a day without new admission. Stronger-lord and
active expedition periods block new admission while existing hero periods continue.
A disabled family closes its current events and preserves the saved score rows;
re-enabling it does not reset the same day's period or claim state.

The bounded scheduler checks the realm authority, serializes calendar writes and
recovers at startup and each second. A failed child-stage write rolls back the
parent and every coupled event. A stale authority cannot create or advance a
period. The periodic operation reuses existing tables and adds no migration,
dependency or environment variable. Back up hero periods, events, score/claim
rows and existing reward records together. Preserve ended event records and
scores during binary rollback.

Synthetic PostgreSQL cases cover concurrent admission, restarts, deadline/UTC
advancement, stronger-lord blocking, disabled-family retention, write failure and
authority replacement. Native TCP with the complete maintained catalog reads an
admitted period before and after SIGKILL recovery. The minimal-catalog native
fixture retains its empty optional-calendar behavior. Shared kingdom matching,
confirmed score ingestion and economic reward settlement remain subsequent runtime
work; calendar admission itself grants no reward or battle result. Device execution
remains unverified.

## Confirmed hero score and target rewards

Owned progression commands now record the hero catalog's confirmed action pairs:
resource collection, completed troop/fort training, signed power changes, building
and research power, prayer, and outer/inner lottery spins. Healing does not count
as training. Queued and direct training share their completion producer. Gathering
uses the actual saved amount and transition time, including recovered deadlines;
a failed command rolls back its action, score, contribution, ledger and outbox.
No client command can supply a score or invoke target-reward delivery.

The realm reads bounded eligible events lazily, uses half-open running intervals,
freezes the first saved reward band and serializes guild contributions with a
transaction-scoped event/guild lock. Guild points retain each contributor's owned
row. Milestones persist every earned tier flag, so a later decrease and recovery
cannot award a tier again. Legacy negative sentinel flags remain readable; score
arithmetic rejects signed integer overflow instead of wrapping into a false score.
Unmatched kingdom events and characters visiting another realm do not earn points.
Validated combat and hot-item payment producers remain prerequisites for their
corresponding action pairs.

Target entitlements pin each eligible recipient's reward and mail template in the
same mutation outbox as the score. Guild recipients are current members who have
contributed to that event. Delivery batches contain at most 64 recipients, and
owned deterministic receipts fund mail once even when a batch retries after a
partial failure. Banned or unavailable recipients retain pending deliveries.
The existing worker retries with a delay, and successful delivery publishes the
native target-achieved view. Guild score notifications use the persisted total
and discard superseded totals before publication.

No schema, environment variable or dependency is added. Back up score rows,
contributions, tier flags, mutation outbox, receipts and funded mail together;
retain unpublished delivery facts during rollback. PostgreSQL acceptance covers
concurrent actors, receipt replay, cutoffs, negative power, unmatched events,
rollback and mail recovery. Native TCP rejects the private delivery command.
Shared kingdom matching and global rank publication/final prizes remain separate
coordinated runtime work. Device execution remains unverified.

## Shared hero kingdom matching

Kingdom hero periods now register their realm's frozen power and random ordering
value in a shared PostgreSQL cohort. The cohort identity binds the activity
definition and UTC period start. The first registration persists a four-minute
admission window, the period end and configured power-group/match sizes. A late
first startup can admit a cohort only while enough period time remains. Subsequent
configuration or power changes cannot rewrite an admitted realm or a closed cohort.

At admission closure, exact integer power orders bounded cohorts, then each power
group uses its saved random ordering value to form configured matches. Realm IDs
break ties consistently. A final unmatched realm forms a single-realm group; no
opponent is invented. Realms arriving after closure wait for their next period.
The global match commits every realm's group and the closed-cohort marker together.
Local fenced commands attach that result to the owned main period and its coupled
personal/alliance kingdom events in one transaction. Restart recovery preserves
the group, and ambiguous local periods or stale authorities reject the transition.

Global migration `0012_hero_matching` adds `hero_match_period` and
`hero_match_realm`. The legacy `hero_kingdom_activity` input table remains intact;
its activity-only identity cannot store independent realm/period registrations.
At this matching migration, the inventory contains 820 tables and 6,666 fields:
136 global and 684 kingdom tables. No dependency or environment variable is added. Apply the
global migration before starting this binary, and back up cohort headers,
registrations, local hero periods, event groups and scores together. Binary rollback
can retain the additional tables; deleting a closed cohort would lose its immutable
opponent assignment and is not a valid retry strategy.

Synthetic PostgreSQL acceptance races two realms, closes admission, recovers the
same groups, creates an independent next-day cohort and rejects late enrollment.
It preserves frozen power/configuration and rolls back failures in both global and
local attachment transactions. Pure cases cover exact power beyond binary64 integer
precision, ties, incomplete groups and duplicate realm rejection. Global rank
publication, final ranking prizes and expedition matching remain subsequent work.
Native device execution remains unverified.

## Recoverable hero ranking publication

Hero scores now feed the existing native global rank keys through a recoverable
PostgreSQL projection. Each realm reads only its fenced score/event rows, captures
at most four pages of 64 members per refresh and advances its cursor only after
successful cache publication. Personal and guild bands, ordinary realm ranges,
matched kingdom group order and signed scores retain their existing wire/key
contracts. Unmatched kingdom events remain excluded. A failed page retries without
losing its tail, and overlapping refresh requests share one in-flight snapshot.

Global migration `0013_hero_rank_publication` adds `hero_rank_owner` and
`hero_rank_score`. The inventory now contains 822 tables and 6,683 fields: 138 global
and 684 kingdom tables. Each shared write checks the realm's authority generation,
persists a durable sequence and rejects an older owner or another realm's member.
The snapshot and sequence commit together. Public guild metadata contains only its
ID, name, abbreviation, icon and realm. No economy or reward claim changes in this
projection, and no dependency or environment variable is added.

Redis publication replaces absolute scores, retains native ascending negative-score
ordering and limits each board to 5,000 members. Authority generations and sequences
use exact decimal comparisons, including values beyond binary64 integer precision.
Delayed publications cannot overwrite a newer cached generation or member version.
Guild metadata has its own shared version guard. Recent scores rebuild the existing
rank/history maps after cache loss; rank keys and their member-version maps expire
ten days after the stage end. The durable PostgreSQL projection remains available
for subsequent coordinated finality and reward settlement.

Apply the global migration before this binary. Back up realm authority, hero events,
owned scores and the global owner/projection tables together. Retain the additional
projection tables during binary rollback; restoring only an older realm authority
while keeping a newer shared generation requires an operator-coordinated restore.
Redis can be rebuilt from the persisted scores. Publication itself sends no funded
mail, chooses no battle winner and does not finalize an event.

PostgreSQL/Redis acceptance covers two-realm ordering, ties, positive and negative
score changes, complete cache loss, authority replacement, delayed publications,
exact large versions, write rollback, foreign member rejection, guild metadata,
matched group ordering, board limits and a 257-member page boundary. Native TCP and
SIGKILL recovery pass with the publisher composed into the realm. Final ranking
prizes, kingdom result settlement and expedition coordination remain subsequent
runtime work. Native device execution remains unverified.

## Coordinated hero ranking finality

Hero ranking closes after a minimum five-minute grace and explicit confirmation
from every configured realm in the native ranking group. Each realm first takes
an exclusive authority barrier, waits for executable overdue queues and march
transitions, then marks its event closed and stores a score count/fingerprint in
one owned transaction. In-flight mutations complete before that fingerprint is
read. Banned, missing or visiting characters cannot execute those transitions;
their pending state remains intact and a later authorization change cannot reopen
the closed hero stage or add retroactive hero points.

A realm with no corresponding event confirms its own absence under the same
barrier. The coordinator does not infer an offline realm's absence. Unmatched
kingdom events close without an invented opponent or new prize entitlement and
retain their imported score rows. Calendar admission samples its clock after
acquiring the owned calendar transaction, so a delayed refresh cannot create a
historical stage after absence was confirmed.

Sealed scores upload in pages of 64 with a durable cursor. The shared registry
checks the complete count and fingerprint before accepting a realm's confirmation;
a mismatch resets that upload for retry. Once accepted, projection updates preserve
its immutable score facts while allowing current authority/cache versions to advance.
This also protects final standings against a delayed snapshot captured before
closure. Shared finalization uses the persisted realm cohort and rejects a caller
that attempts to shorten it. An unavailable realm keeps the group pending.

Kingdom ordering uses the exact sum of personal kingdom scores; alliance kingdom
scores do not replace that total. Ties preserve the admitted opponent order. The
coupled alliance result waits for the personal kingdom result, and both persisted
event rows and their main activity retain the same final country order. No extra
kingdom victory effect is created: the corresponding reference reward hook has no
economic implementation. Ranking prize mail is the next owned delivery stage.

Global migration `0014_hero_ranking_finality` adds `hero_rank_period` and
`hero_rank_watermark`; kingdom migration `0032_hero_ranking_finality` adds
`hero_rank_closure`. The inventory becomes 825 tables and 6,716 fields: 140 global
and 685 kingdom tables. The source index supports sealed-publication guards.
Apply both roles' migrations before this binary. Back up closure cursors, event
markers, owned score rows, shared projection ownership, fingerprints and group
results together. Retain all sealed state during binary rollback; clearing a
marker or cursor independently is not a valid reward-recovery strategy. No new
dependency or environment variable is required.

Synthetic PostgreSQL cases cover grace/cohort waiting, actual overdue training,
in-flight mutations with the production transaction fence, absence and banned
actors, checksum mismatch/retry, immutable facts across authority replacement,
local/shared rollback, coupled country totals, unmatched stages and bounded tails.
Native TCP and SIGKILL recovery retain ordinary gameplay with the coordinator
composed into the realm. Final ranking mail remains a separate stage; native device
execution remains unverified.

## Recoverable hero ranking prizes

Finalized shared hero standings now produce owned reward entitlements. Ranking is
computed from the completed cohort proofs, separately for each saved level band,
with score descending and member identity ascending for ties. Each realm scans its
own eligible members in pages of 64 and persists the entitlement and member cursor
in the same fenced transaction. Current guild members receive a guild prize only
when their saved contribution belongs to that guild and stage. Missing profiles
advance the cursor without creating a recipient.

Every entitlement stores its selected mail template, original reward identifier
and independently resolved reward contents. A restart or later catalog change
cannot reroll an admitted prize. Personal standings outside a funded tier receive
the native consolation mail only through rank 1,000; guild standings have no
consolation mail. Informational zero rewards retain their ranking history. The
existing personal history format with an empty alliance identity also prevents a
duplicate payment when imported state already records the prize.

A private owned command atomically acknowledges delivery, writes the ranking
history and funded system mail, and records its native publication in the mutation
outbox. The existing mail claim service credits the attached items once. Failed
receipts roll back all delivery state. Banned owners retry after a delay while
other recipients continue; a shared ranking outage does not prevent delivery of
already persisted entitlements. Both ranking mail and target-achievement mail now
publish through the durable outbox, including the native target notification.

Apply kingdom migration `0033_hero_ranking_rewards` before this binary. It adds
`hero_rank_award` and appends the award cursor to `hero_rank_closure`; all existing
score, history and mailbox rows remain intact. The inventory becomes 826 tables
and 6,733 fields: 140 global and 686 kingdom tables. Back up entitlements, closure
cursors, ranking history, mail, command receipts and their outbox together. Retain
these records across binary rollback; clearing acknowledgements independently can
invalidate recovery. No new dependency, configuration or environment variable is
required. Device execution remains unverified, and expedition coordination and
other campaign families remain separate work in issue 385.

Acceptance covers personal and guild entitlements, funded mailbox claims,
canonical replay, receipt rollback, legacy history, deferred owners, catalog
changes, shared outages and bounded member tails. Thirteen focused tests passed
with 369 assertions. The server unit suite passed 1,462 tests with 244,897
assertions. Native TCP and process-kill recovery passed two tests with 235
assertions. Schema contracts and snapshots passed 1,661 tests with 48,815
assertions; physical schemas and upgrades passed 1,518 tests with 36,473
assertions. Lint, formatting, migration consistency and server/nine package type
checks passed.

## Shared expedition calendar

The expedition clock now persists one shared calendar, serialized independently
of realm ownership. Initial waiting ends at the next configured UTC weekday; the
same weekday always selects the following week. Subsequent stages follow the
ordered nine-stage catalog with its hour durations. The admitted schedule and
configured realm census remain fixed until that cycle ends, including across
restarts and catalog changes. A long outage advances directly to the current
cycle without replaying expired stages or inventing historical participation.

A single unambiguous legacy global period retains its current boundary and all
remaining configured stages. Adoption records its source identity and preserves
the original row. Ambiguous active legacy rows and malformed saved schedules
reject recovery instead of resetting state. Disabled feature flags preserve the
saved clock, and a reversed wall clock cannot issue a replacement. New-cycle
insertion and prior-cycle closure commit together under the shared advisory lock.
The active-state unique index prevents two current cycles.

Global migration `0015_expedition_calendar` adds `expedition_calendar`, bringing
the inventory to 827 tables and 6,742 fields: 141 global and 686 kingdom tables.
Apply it before this binary. Back up calendar rows with the legacy global and
owned expedition periods; retain them during binary rollback. No dependency,
configuration or environment variable is added. This foundation supplies the
shared clock for subsequent matching and owned period admission; it does not
select opponents, install a fighting manifest or produce a combat result.

Nine focused cases passed with 62 assertions, covering shared workers, restart,
atomic rollover, failure rollback, legacy adoption, ambiguous history, disabled
flags, clock reversal and boundary sampling. The server unit suite passed 1,467
tests with 244,937 assertions. Native TCP and process-kill recovery passed two
tests with 235 assertions. Schema contracts and snapshots passed 1,663 tests with
48,879 assertions; physical schemas and upgrades passed 1,519 tests with 36,503
assertions. Lint, formatting, global migration consistency and server/nine package
type checks passed. Native device execution remains unverified.

## Confirmed expedition matching and owned admission

Expedition matching now registers each realm during its saved matching window.
The realm waits for overlapping hero or stronger-lord periods and preserves an
existing active expedition. It takes the owned authority barrier and calendar
lock before freezing aggregate matching statistics. A durable admission then
blocks new hero calendars until the shared decision is applied. Global outages
retain that original admission for retry instead of resampling the realm.

Statistics use the highest five eligible guild powers, including guild science,
the leading eligible player's power, castle-level and player-power counts, recent
five-star military buildings and prior expedition results. They contain aggregate
values, without player identities. Top-player double-to-long conversion, weighted
float arithmetic and the reference's asymmetric castle comparison are retained.
Candidates follow the configured power neighborhood and weighted top-choice
cutoff before prior opponents are excluded. Equal priorities use realm identity;
a persisted random seed selects among eligible candidates and survives rollback.

Shared batches pin matching configuration and first registrations. Finalization
after the matching deadline writes reciprocal pairs once; an unmatched realm has
opponent zero. Missing or late realms cannot change a finalized batch. A reciprocal
proof is required before each owned realm installs the same preparing-through-
fighting schedule. Installation and its admission acknowledgement are atomic.
A replacement authority resumes frozen state, and missing optional configuration
does not prevent an already persisted decision from being applied. Configuration
absence prevents new admission. Matching and period admission create no combat
result; combat score producers retain their validated-engine gates.

Global migration `0016_expedition_matching` adds the batch and realm registration
tables. Kingdom migration `0034_expedition_admission` adds the owned admission and
its recovery index. Inventory becomes 830 tables and 6,764 fields: 143 global and
687 kingdom tables. Apply both migrations before this binary. Back up the shared
calendar, batches, seeds, aggregate registrations, owned admissions, manifests and
stage progress together. Retain these records during binary rollback; clearing a
seed, opponent or acknowledgement independently invalidates recovery. Matching
is bounded to 128 configured realms. No dependency, configuration or environment
variable is added. Waiting-only client projections, cross-realm score publication,
settlement and stage broadcasts remain subsequent integration work.

Eleven focused tests passed with 61 assertions, including seven PostgreSQL cases.
They verify reciprocal results, actual completed training points, immutable
statistics, deadlines, rollback, missing configuration, shared outages and
replacement authority recovery. Eight existing expedition/calendar acceptance
cases also passed. The server unit suite passed 1,471 tests with 244,955 assertions.
Native TCP and process-kill recovery passed two tests with 235 assertions. Schema
contracts and snapshots passed 1,669 tests with 49,041 assertions; physical schemas
and upgrades passed 1,523 tests with 36,611 assertions. Lint, formatting, both
migration-role consistency checks and server/nine package type checks passed.
Native device execution remains unverified.

## Owned expedition phase views and native activity updates

Each realm now keeps a durable presentation clock for expedition waiting,
matching and confirmed stages. A realm without an admitted opponent retains its
matching view after the deadline, including the original end time. An existing
validated manifest supplies active stages. Display-only phases cannot supply
score events or authorize reward claims, and native queries omit the nonexistent
opponent instead of adding realm zero.

Login now reads the owned activity snapshot and sends the native expedition panel.
Historical catalog windows and merge windows remain enforced; historical entries
are not reopened. Login panels keep personal score and guild score at zero, omit
personal rewards and retain the player's crossing count. Stage changes publish
`push.activity.update` through an owned private command, its canonical receipt and
the durable mutation outbox. Superseded revisions are discarded before publication,
including revisions above Number precision. Notification delivery scans at most
32 connected owners and relays 64 events per refresh; reconnect reads the current
owned panel without depending on the shared database.

Clock updates are fenced and serialized with calendar admission. Equal views keep
the same revision across restart. A replaced authority retains that revision,
backward clocks cannot regress it and signed-long exhaustion rejects advancement
without wrapping. Clock or receipt failures roll back completely before retry.
Owned reads reject missing, foreign-realm or banned profiles. Public clients
cannot invoke the private notification command, and protocol bodies contain no
internal revision or projection markers.

Apply kingdom migration `0035_expedition_clock` before this binary. It adds the
owned clock table, bringing inventory to 831 tables and 6,772 fields: 143 global
and 688 kingdom tables. Back up clocks, manifests, admissions, stage progress,
notification receipts and outbox together. Keep these records during binary
rollback; resetting a revision independently can invalidate delivery recovery.
No dependency, configuration or environment variable is added. Shared score
publication and settlement remain subsequent work, and combat result producers
retain their validated-engine gates.

Six PostgreSQL acceptance tests passed with 44 assertions. Phase, panel,
publication and reconnect unit acceptance passed twelve tests with 66 assertions.
Ten existing expedition/matching PostgreSQL cases passed with 63 assertions.
The server unit suite passed 1,475 tests with 244,980 assertions. Native TCP and
process-kill recovery passed two tests with 237 assertions. Schema contracts and
snapshots passed 1,671 tests with 49,099 assertions; physical schemas and upgrades
passed 1,525 tests with 36,667 assertions. Lint, formatting, kingdom migration
consistency and server/nine package type checks passed. Device execution remains
unverified.

## Shared expedition score publication

Confirmed owned expedition progress now feeds a durable shared score projection.
Publication writes absolute values, refreshes current guild membership and public
ranking metadata, and advances its bounded cursor only after the canonical write.
It does not increment points on retry. A shared ownership epoch and sequence reject
superseded publishers; another realm's member row cannot be overwritten. Records
without a reciprocal matching proof remain local rather than creating a cohort.

Native activity queries now combine the owned personal score with the confirmed
pair's shared ranking and kingdom totals. Equal scores use descending member
identity, matching the native positive-score reverse ordering. Guild totals stay
inside the current realm. Missing shared data marks rank unavailable while
preserving owned fields, and a changed phase cannot merge an earlier response with
another stage. The Redis discovery record publishes the owned native stage and
opponent with exact decimal authority versions. Disabled expedition features
publish waiting discovery. Redis loss rebuilds from owned state and does not stop
canonical score pages.

Owned manifests are now archived before replacement so old progress remains
recoverable after a cycle rolls over. Existing manifests backfill with an unknown
recording time of zero; their original rows and timestamps remain unchanged.
Realm identity is part of the archive key, preserving unrelated realm rows.

Apply global migration `0017_expedition_score_publication` and kingdom migration
`0036_expedition_manifests` before this binary. They add shared score ownership,
score facts and owned manifest history. Inventory becomes 834 tables and 6,795
fields: 145 global and 689 kingdom tables. Back up manifests, current periods,
progress, shared ownership versions, score facts and matching proofs together.
Retain them during binary rollback; clearing ownership sequences or proofs
independently invalidates publication recovery. Publication scans four pages of
64 members per refresh and retains a ten-day recovery window after a period ends.
No dependency, configuration or environment variable is added. Stage finality,
ranking history production and automatic settlement remain subsequent work.

Seven PostgreSQL/Redis acceptance cases passed with 37 assertions. Three focused
unit cases passed with 17 assertions. Sixteen existing expedition, matching and
phase acceptance cases passed with 107 assertions. The server unit suite passed
1,478 tests with 244,997 assertions. Native TCP and process-kill recovery passed
two tests with 237 assertions. Schema contracts and snapshots passed 1,677 tests
with 49,267 assertions; physical schemas and upgrades passed 1,529 tests with
36,774 assertions. Lint, formatting, both migration-role consistency checks and
server/nine package type checks passed. Device execution remains unverified.

## Expedition stage finality

Validated noncombat stages now close through owned snapshots and reciprocal
shared proofs. Collection, building, science and training stages are eligible.
Monster and fighting stages remain pending until their corresponding combat
engine is validated. Waiting, matching and preparation do not produce a result.
A legacy manifest without a matching shared calendar and reciprocal admission
remains local and cannot prevent a verified later stage from closing.

A five-minute recovery interval follows each saved stage deadline. Sealing takes
the exclusive owned authority barrier and waits for authorized pending timers,
legacy queues and gathering transitions due before that deadline. Banned,
missing and visiting actors cannot hold the stage open. Their pending unit or
resource work remains recoverable; a sealed stage cannot acquire later points.

Timed score actions now retain their saved completion deadline even when a
production checkpoint has already advanced farther. Immediate finishes use the
actual earlier completion time. Deferred expedition scoring loads the archived
manifest at that instant, preserves separate cycle keys and commits alongside
the original action. Hero score actions use that same confirmed instant.

The owned seal freezes member score, guild, claim flags, castle band, active
science identifiers and public metadata. Its canonical proof hashes exact
PostgreSQL float8 bytes and member identities in C order. Upload resumes from a
persisted 64-member cursor, advances only after the shared write and checks the
full count, digest and total before completing the proof. A mismatch discards
only that realm's incomplete shared stage upload and retries its owned snapshot.
Live publishers preserve sealed economic values and cannot recreate missing
members, including after authority replacement. Public metadata may refresh.

Finality requires both reciprocal realms, including a verified empty proof for a
realm with no scores. The final result pins both totals and the ten leading
members. Equal kingdom totals favor the higher realm identifier, matching the
source coordinator order. Final results are immutable; an unavailable realm
leaves the stage pending. Owned snapshots, upload proofs and final markers each
commit atomically and recover independently after restart.

Apply global migration `0018_expedition_stage_finality` and kingdom migration
`0037_expedition_stage_finality` before this binary. They add only the four stage
snapshot, member, pair-period and watermark tables. Inventory becomes 838 tables
and 6,837 fields: 147 global and 691 kingdom tables. Existing progress, histories,
periods, inventories and queues remain unchanged. Back up these new records with
manifests, matching proofs, shared score ownership and score facts. Preserve them
on binary rollback; deleting an individual proof or cursor destroys settlement
recovery. No new dependency, configuration or environment variable is required.
Automatic reward admission and native ranking history remain the next module.

Seven PostgreSQL acceptance cases passed with 39 assertions, covering grace,
reciprocal proofs, missing legacy cohorts, floating-point values, saved completion
times, banned actors, mismatch recovery, transactional rollback and a 72-member
upload resumed under replacement authority. Two focused units passed with eight
assertions. Eighteen existing expedition and hero acceptance cases passed with
116 assertions. The server unit suite passed 1,480 tests with 245,005 assertions.
Native TCP and process-kill recovery passed two tests with 237 assertions. Schema
contracts and snapshots passed 1,685 tests with 49,559 assertions and 838
snapshots. Physical schemas and upgrades passed 1,535 tests with 36,971 assertions.
Required lint, formatting, both migration consistency checks and server/nine
package type checks passed. Device execution remains unverified.

## Expedition rewards and native ranking history

Finalized noncombat stages now admit funded ranking, personal target, guild
target and winning kingdom rewards. Personal targets include their separate
science double mail when the frozen science eligibility permits it. Tier flags
already claimed before sealing prevent another automatic payout. Guild eligibility
uses the sealed contribution and membership; changing guilds or sciences after
closure cannot change the entitlement. Kingdom thresholds retain the source's
floating-point comparison, while guild minimum contribution remains strict.

Reward planning reads both completed reciprocal proofs and the immutable shared
result. It scans eligible home profiles in C order through a saved recipient
cursor, admits at most 64 units of mail work per refresh and pins each recipient's
mail contents and reward outcomes in the owned database. A recipient can finish
its bounded bundle after the work budget is reached. Accounts registered after
sealing are excluded. Missing profiles do not invent recipients. Missing ranking
metadata stops the native ranking prefix without discarding economic score facts
or fabricating another player in history.

One canonical owned operation delivers the saved mail bundle, updates tier flags,
acknowledges the entitlement and enqueues native mail notifications atomically.
The resulting mail uses the existing funded claim path, so another mail claim
cannot grant its assets twice. Banned recipients defer for a minute while other
recipients continue. Delivery drains saved entitlements even if new admission
fails or shared standings are unavailable. Restart or catalog changes do not
reroll outcomes that were already admitted.

The native `newexpidition.rankinfo` query now returns up to twelve recent stage
reports across owned results and unchanged legacy history. It retains the native
stage, long begin-time, user-list and kingdom-list shapes. User identity, picture,
guild abbreviation and rank are fixed by the final report; score is absent from
the native historical user entry. Kingdom names and banners use current shared
server metadata, with an empty object when that metadata does not exist. Malformed
legacy reports reject instead of inventing an empty report. Queries enforce owned
profile, realm and ban checks and retain request correlation. Client requests
cannot invoke the private reward delivery command.

Apply kingdom migration `0038_expedition_stage_awards` before this binary. It adds
owned mail entitlements and appends the recipient cursor and native report to the
stage closure. Existing fields and legacy histories remain unchanged. Inventory
becomes 839 tables and 6,847 fields: 147 global and 692 kingdom tables. No dependency,
configuration or environment variable is added. Back up entitlements, mail, tier
flags, operation receipts, notification outbox and stage results together. Retain
these records on binary rollback. Deleting a delivered acknowledgement or funded
mail independently destroys payout recovery. Monster and fighting settlement
remain gated by their corresponding validated combat engine.

Eight PostgreSQL reward/history acceptance cases passed with 84 assertions,
including manual-before-automatic claims, pinned outcomes during shared outage,
receipt and admission rollback, ban deferral, a 72-recipient recovery tail and
missing ranking metadata. Focused units validate every maintained expedition
reward as funded claimable mail, fractional kingdom thresholds, native history
field order, malformed legacy history and public/private command correlation.
The complete server unit suite passed 1,483 tests with 245,129 assertions.
Sixteen expedition, stage-finality and hero reward regression cases passed with
101 assertions. Native TCP and process-kill recovery passed two tests with 243
assertions, including the active history request and rejection of client reward
delivery. Schema contracts and snapshots passed 1,687 tests with 49,629 assertions
and 839 snapshots. Physical schemas and upgrades passed 1,537 tests with 37,033
assertions. Required lint, formatting, kingdom migration consistency and
server/nine package type checks passed. Device execution remains unverified.

## Confirmed consumption ranking publication

Consumption competition now publishes the best hundred confirmed spenders per
owned realm to a canonical shared PostgreSQL board. Actual negative economy
postings prove each immutable spending frame. The wallet mutation, operation
receipt, ledger, outbox, spending fact and absolute aggregate commit together.
Nickname changes use their existing committed payment reservation as their
financial witness; refunded reservations produce no competitive spending.
A bounded startup backfill accepts older outbox frames only with the matching
operation receipt or committed nickname payment. Raw legacy activity totals
remain local because they do not establish a confirmed debit.

The period identity fixes start, end and resource type. Shared registration also
pins its reward bands and configured participating realms on first admission.
Later feature, reward or configuration edits cannot replace that census.
Publication uses absolute values and fenced ownership sequences. Retries cannot
increment totals, overwrite a foreign realm's member or advance after a failed
shared write. Every financial value retains its signed 64-bit integer precision.
The board sorts descending spend with ascending member identity on ties, avoiding
the source comparator's overflowing integer subtraction. Public entries retain
the native field types, order and current consumption privacy preference.

The public consumption query uses this board for registered periods and retains
the legacy cache fallback for periods without a registered owned projection.
Payment ranking retains its existing reader. Publication drains up to four
64-frame migration pages and eight period manifests per refresh; after the
startup tail is exhausted, new spending is captured by its original transaction.
The one-second worker needs no new configuration or dependencies. Automatic
ranking closure and its funded prizes are the following module.

Apply global migration `0019_continued_cost_ranking` and kingdom migration
`0039_continued_cost_facts` before this binary. They add six tables and an outbox
source index, preserving existing fields and legacy totals. Inventory becomes
845 tables and 6,895 fields: 150 global and 695 kingdom tables. Back up immutable
spending facts, aggregates, manifests, ownership versions, original payment
witnesses, receipts and outbox together. Retain them during binary rollback.
Deleting a fact independently can make its original frame eligible for recovery
again. Existing unverified totals must not be imported as financial evidence.

Nine PostgreSQL acceptance cases passed with 61 assertions, including values
above JavaScript's safe integer range, transaction rollback, first-bound census,
foreign identity rejection, a 65-frame recovery tail, period rollover, sealed
score preservation and committed versus refunded nickname payments. Thirty-five
nickname and spending regression cases passed with 358 assertions. The server
unit suite passed 1,486 tests with 245,144 assertions. Native TCP and process-kill
recovery passed two cases with 249 assertions; a real nickname debit appeared
exactly once in both realms' native consumption board. All fourteen critical
authentication and timed-economy mutations were killed. Schema contracts and
snapshots passed 1,699 tests with 49,977 assertions and 845 snapshots. Physical
schema and upgrade checks passed 1,546 tests with 37,283 assertions. Required
lint, formatting, both migration consistency checks and server/nine package type
checks passed. Device execution remains unverified.

## Consumption ranking finality

Consumption competitions now close after a five-minute recovery interval and
require a financial proof from every realm in their original registered census.
The worker recovers confirmed older frames before sealing. Sealing takes the
exclusive owned authority barrier, waits for authorized pending progression due
before the period deadline and waits for prepared gold nickname reservations
that can still confirm competition spending. It then freezes the realm's best
hundred members and seals its economic aggregate in the same transaction.
An empty realm records an explicit empty proof even when its feature has since
been disabled. An unavailable realm remains in the census and delays finality.

The owned snapshot retains exact decimal 64-bit values. Its SHA-256 proof covers
member identity, total spend, paid/free split and last confirmed spending time in
UTF-8 member order. Public names, pictures and privacy remain outside that
financial proof. Upload writes the full bounded snapshot and its shared watermark
atomically under the existing publication fence. Even before the other realms
finish, live publishers cannot change that realm's economic values or population.
Repeating a proof validates its saved economic rows and preserves newer public
metadata, including a changed privacy preference.

Shared finality verifies every census member's count and digest before recording
one immutable result. Equal spend retains ascending member identity. A failed
owned seal, shared proof or final acknowledgement retries from its saved boundary;
replacement authority cannot restart totals or permit its predecessor to write.
Confirmed debits that arrive after sealing retain their original financial
posting and an uncounted fact rather than altering the finalized ranking.
Only registered competitions can enter this process. Unverified legacy totals
remain local, and automatic funded ranking rewards are the next module.

Apply global migration `0020_continued_cost_finality` and kingdom migration
`0040_continued_cost_finality` before this binary. They add one owned closure table
and one shared watermark table. Inventory becomes 847 tables and 6,907 fields:
151 global and 696 kingdom tables. No dependency, configuration or environment
variable is added. Back up closures and watermarks with original payment witnesses,
facts, aggregates, manifests, ownership versions, receipts and outbox. Preserve
all these records during binary rollback. Do not delete a census member or proof
to force a pending competition to finish; restore the corresponding realm and
resume its saved snapshot. Device execution remains unverified.

Twenty-three finality, consumption and publication acceptance cases passed with
150 assertions. Two snapshot units passed with twelve assertions. The complete
server unit suite passed 1,488 tests with 245,156 assertions. Native TCP and
process-kill recovery passed two cases with 249 assertions. Schema contracts and
snapshots passed 1,703 tests with 50,069 assertions and 847 snapshots; physical
schema and upgrade checks passed 1,549 tests with 37,357 assertions. Required
lint, formatting, both migration consistency checks and server/nine package type
checks passed.

## Funded consumption ranking prizes

Final consumption standings now fund the source ranking mail and its registered
reward bands. Each realm scans the shared hundred-member result through an owned
rank cursor and admits prizes only for its own existing home profiles. Profiles
registered after sealing cannot acquire an old entitlement. Missing or visiting
profiles do not invent recipients. An empty result completes without mail.
Admission verifies every finalized financial count and digest before selecting
positions, so inconsistent shared economic rows cannot fund another ranking.

One refresh scans at most 64 ranks. Admission pins the native mail template,
rank parameter and actual reward outcomes in an owned entitlement and advances
the cursor in the same transaction. A private canonical operation commits funded
mail, delivery acknowledgement and native notification outbox together. Repeating
that operation cannot create another mail; the existing funded mail claim path
cannot grant the assets twice. A recipient unique key complements the stable
period/member entitlement identity.

Banned recipients defer for a minute while eligible prizes continue. Stored
entitlements drain even when new shared admission fails or reward catalogs are
removed. A restarted service resumes its saved rank cursor and pinned outcomes.
Client traffic cannot invoke the internal delivery operation. The native public
reward endpoint remains a preview and cannot submit spending or claim a global
ranking position.

Pending shared proofs can now restore their own economic rows from the exact
owned snapshot after an older binary or damaged projection changes them. Repair
requires the matching immutable watermark and current publisher fence, replaces
only that realm's pending rows and preserves current public metadata. A finalized
result rejects economic repair and requires consistent restored data before any
new prize admission. Financial results cannot be rewritten to accommodate a
changed catalog, census or late debit.

Apply kingdom migration `0041_continued_cost_awards` before this binary. It adds
owned ranking entitlements and appends the award cursor and completion time to
the closure. Inventory becomes 848 tables and 6,917 fields: 151 global and 697
kingdom tables. Existing inventories, queues and legacy consumption totals remain
unchanged. No dependency, configuration or environment variable is added. Back up
entitlements, funded mail, operation receipts, notification outbox, cursors and
financial proofs together and preserve them during binary rollback. Deleting a
mail or its delivery acknowledgement independently invalidates payout recovery.
Device execution remains unverified.

Eleven reward and finality acceptance cases passed with 78 assertions. Two units
verified all maintained consumption reward bands and stable identities. Twenty-five
consumption, publication and expedition reward regression cases passed with
200 assertions. The server unit suite passed 1,490 tests with 245,168 assertions.
Native TCP and process-kill recovery passed two cases with 251 assertions,
including rejection of the private delivery command in both realms. Schema
contracts and snapshots passed 1,705 tests with 50,139 assertions and 848 snapshots;
physical schema and upgrade checks passed 1,551 tests with 37,423 assertions.
Required lint, formatting, kingdom migration consistency and server/nine package
type checks passed.

## General campaign variable declarations

Campaign variable queries now expose all 384 maintained declarations, preserving
exact scope, aliases and canonical keys, including the declared key containing
spaces. The previous loader restricted queries and owned persistence to the
third-anniversary prefix. Other personal campaign counters now use the same owned
transaction, receipt and UTC refresh behavior without changing unrelated legacy
rows. Personal and realm values remain isolated. Static declarations return their
configured value and ignore assignment, matching the source static-variable rule.
Server and global mutation boundaries remain unchanged. General variable queries
and trusted internal events no longer require the anniversary calendar; anniversary
queries retain their calendar availability checks.

Campaign realm conditions now use inclusive ranges and semicolon groups. A selector
such as `1-50` includes the interior realms, rather than only its two endpoints.
The source ALL marker remains supported. This module expands the variable catalog;
loading the remaining campaign rules and binding their trusted producers are
subsequent modules. Client traffic still cannot invoke internal campaign events.

No migration, dependency, configuration or environment variable is added. The
existing `trigger_var` table retains its 200-character key bound, signed 64-bit
values, original rows and actor/realm keys. Back up campaign variables with their
receipts and mutation outbox; retaining these records preserves replay and daily
refresh behavior during rollback. Inventory remains 848 tables and 6,917 fields.

Four PostgreSQL acceptance cases passed with fifteen assertions, covering generic
aliases, exact long values, personal/realm isolation, immutable static declarations,
keys containing spaces, inclusive ranges, rollback and UTC refresh. Ten anniversary
and recipe regression cases passed with 73 assertions. A catalog contract verified
all 384 declarations and independent query availability with 395 assertions. The
complete server unit suite passed 1,491 tests with 245,563 assertions. Native TCP
acceptance passed one test with 208 assertions in both realms. Required lint, formatting and server/nine
package type checks passed. Device execution remains unverified.

## Maintained login campaigns and native notices

The campaign loader now retains all 272 maintained rules, including their original
state and event gates; 62 rules are active declarations. Login executes the native
castle/period-limited kingwar gift and the daily flower-ranking and alliance-leader
notices. Eligibility reads the owned saved flower position and current matching
alliance membership. Missing ranking facts, missing guilds and stale membership
cannot invent an announcement. Personal quotas use the existing owned UTC refresh
and receipt rules. The later cake campaign also runs in its own declared window
without borrowing the earlier anniversary's counters.

Alliance notices contain the sender's saved name. Realm notices contain the saved
guild and sender names. Their native `push.common.notice` fields retain UTF message
identity and array parameters in source order. Each action commits an owned outbox
event together with its daily counter. Delivery selects current online eligible
home profiles and rechecks guild membership for alliance audiences. Foreign,
visiting and banned profiles are excluded. Selection uses pages of at most 500
identities and publishes at most 32 notifications concurrently.

A login notice waits for the actor's initialized session and retries independently
of other pending notices. Informational login notices expire after five minutes,
so recovery cannot display an old login indefinitely. Delivery remains best effort
for a disconnected recipient and does not grant assets. The reference's unused
all-server notice branch remains a no-op. Combat triggers still require their
validated engine; payment triggers require verified provider evidence. Confirmed
shop, mail, exchange and appearance producer bindings remain subsequent work.

No schema migration, dependency, configuration or environment variable is added.
Inventory remains 848 tables and 6,917 fields. Back up campaign variables, operation
receipts and notification outbox together. An older binary retains the new daily
flags and outbox rows but does not publish the new notice type. Preserve those
records during rollback and resume only fresh announcements after recovery.

Seven PostgreSQL acceptance cases passed with 34 assertions, including real login
rules, native gift admission, daily limits, stale membership, recipient isolation,
receipt rollback, initialized-session retries, expiry and the later cake window.
Two catalog and mapping units passed with ten assertions. Fourteen existing
variable, anniversary and recipe cases passed with 88 assertions. The complete
server unit suite passed 1,493 tests with 245,573 assertions. Native TCP acceptance
passed one test with 212 assertions, including real maintained flower login
notices in both realms. Required lint, formatting and server/nine package type
checks passed. Device execution remains unverified.

## Confirmed shop and mail campaign producers

Ordinary purchases and funded mail claims now observe actual delivered item
quantities before their semantic shop or saved-title event. The original item,
wallet, stock and claim writes precede observation within the same owned
transaction. Campaign counters, grants, receipts, ledger and outbox therefore
commit or roll back with the original delivery. A repeated shop receipt or saved
mail claim cannot observe the delivery a second time. Previews and foreign mail
claims cannot create progress. Rule state, selectors, time windows and personal
caps remain enforced; numeric maintained offers supply their saved sale category.

The observer reloads the inventory after the original validated writes and uses
the existing campaign planner with a private command. Client dispatch rejects
that command. Its extra native pushes append to the original response without
replacing the purchase or claim body. Positive item changes supply event 40,
confirmed purchases event 68 and newly funded mail claims event 61. A cheap rule
and leading-time-window check avoids loading an inactive campaign aggregate.

Chained debits retain continuous postings and combine consumption evidence only
when owner, timestamp, period, type and pinned tiers agree. One owned consumption
fact then proves the complete debit, including a campaign's additional item cost.
Unexpected duplicate event identities fail the transaction. Newly granted rewards
still use the campaign planner's bounded recursive item observation.

No schema migration, dependency, configuration or environment variable is added.
Inventory remains 848 tables and 6,917 fields. Back up item balances, campaign
variables, shop stock, mail claim markers, consumption facts, operation receipts
and outbox together. Preserve these records during rollback; an older binary
retains committed rewards and counters but does not observe new shop or mail
campaign events. This module does not bind appearance, exchange, paid gifts or
combat outcomes.

Eight PostgreSQL acceptance tests passed with 51 assertions. They exercise the
maintained fire purchase and saved-title mail rules, exact delivered quantities,
caps, replay, appended grant pushes, expired windows, foreign claims, failures
before receipts and combined speed-item spending. Native TCP regression passed
one test with 212 assertions in two realms. Device execution remains unverified.

The server unit suite passed 1,493 tests with 245,574 assertions. Final mail and
private-command units passed five tests with 47 assertions; existing consumption,
anniversary and recipe acceptance passed eighteen tests with 128 assertions.
Required lint, formatting and server/nine package type checks passed.

## Campaign item requests and mail publication

The native `item.askFor` command passes only its validated integer item identity
to the maintained request event. The campaign declaration decides whether to grant
anything. The first cake request in its declared window grants the configured
reward and 45 points once, with the owned cake flag and count in the same
transaction. Unmatched identities and closed windows return native success
without inventing an item. Personal quotas and operation receipts prevent repeat
delivery; another player's eligibility remains independent.

Campaign mail actions now enqueue a native mail publication with each saved
message. Reward-bearing templates pin their actual contents before admission;
informational templates retain their unclaimable reward status. Notification
failure leaves the saved message available and retries from the existing owned
outbox. Mail and notification identities commit with campaign variables and the
original receipt. The existing funded claim receipt prevents a second asset
claim even under a different outer request identity.

No migration, dependency, configuration or environment variable is added.
Inventory remains 848 tables and 6,917 fields. Back up campaign variables,
inventories, mail, receipts and outbox together. Preserve notification rows during
rollback; an older binary retains the saved mail but does not publish the new
campaign mail event. Device execution remains unverified.

Four PostgreSQL request and mail tests passed with 31 assertions. Eleven login
and recipe regression tests passed with 67 assertions. The server unit suite
passed 1,493 tests with 245,575 assertions. Native TCP passed one test with 214
assertions, including item requests in both realms. Required lint, formatting and
server/nine package type checks passed.

## Saved campaign appearance activation

Native appearance activation now validates the actor's stored city skin, bubble
or overlay ownership before executing event 59. Exact stored identities take
precedence; a matching type and cosmetic subgroup supplies the reference's
family fallback. Missing, foreign, expired or feature-disabled ownership rejects
without campaign progress, mail or a saved status. Activation does not extend the
stored ownership deadline.

The maintained cake appearance creates its informational mail and adds 150 points
up to the configured two-activation quota. Replaying the same receipt cannot add
mail or points. A new eligible activation follows the original rule, including
its unconditional informational mail action. The saved status, ownership marker,
mail, campaign counters, outbox and receipt commit atomically. Closed campaign
dates do not prevent an otherwise valid appearance activation.

Status responses retain native integer identity, exact long deadlines, optional
effects and the indefinite wire sentinel. The production boundary checkpoints
earned output before changing owned effects. Durable publication sends private
status details only to the actor and map appearance updates to current interested
players. Recovery uses the existing cosmetic and mail relays. This module covers
the three campaign map appearance families; other avatar systems retain their
existing boundaries.

No migration, dependency, configuration or environment variable is added.
Inventory remains 848 tables and 6,917 fields. Back up stored appearance ownership,
player states, campaign variables, mail, receipts and outbox together. Preserve
committed states and notification rows during rollback. Device execution remains
unverified.

Ten activation and existing cosmetic PostgreSQL tests passed with 77 assertions.
The server unit suite passed 1,493 tests with 245,575 assertions. Native TCP
passed one test with 216 assertions, including owned activation in both realms
and reconnection after restart with the same declared status catalog. Required
lint, formatting and server/nine package type checks passed.

## Fragment exchange offers and confirmed campaign scoring

The three native fragment commands now expose the maintained six-, four- and
three-slot recipes. Thirteen catalog declarations retain their configured
repetition probabilities, reward weights and multipliers. Each actor's generated
list persists in the existing exchange table. Repeated views retain that list;
reward admission consumes every required copy and replaces only the selected
recipe. The configured fourteenfold reward scales the actual grant rather than
merely changing its preview.

Paid refresh uses the panel's two daily free updates and then its configured gold
cost. Refresh budgets follow the owned saved UTC day, and receipts prevent repeat
charges or redraws. The original native query, refresh and reward field shapes
are preserved, including optional recipe previews and the query's activity
identity. Client quantities, reward identities and multipliers cannot select a
prize. The default fragment panel remains disabled until its existing declaration
is enabled. Disabled or unavailable panels cannot charge, generate offers or grant
prizes. Optional declared start/end windows are enforced at the server boundary.

Actual item grants are observed before confirmed exchange event 62. Its two native
selector positions independently accept the original `-1` wildcard. The maintained
September campaign's counter starts at one and caps at five, allowing four
30-point awards. Source-compatible defaults are retained. Preview, failed debit,
failed receipt and replay cannot create points. All inventory, reward, replacement
recipe, counters, financial evidence and receipt writes use the original owned
transaction. Confirmed paid refreshes participate in consumption competitions;
free updates and repeated receipts do not.

No migration, dependency, configuration variable or environment variable is added.
Inventory remains 848 tables and 6,917 fields. Existing UTF-8 offer blobs, including
Java's trailing allocation padding, remain readable. Invalid saved recipes fail
without overwriting their original bytes. Back up exchange rows, inventories,
campaign variables, financial records, receipts and outbox together. Preserve
committed rows during rollback; an older binary can still read the native JSON
recipe shape. This module implements fragment exchange; the other maintained
monster-token exchange form continues separately. Device execution remains
unverified.

Eight PostgreSQL fragment cases passed with 60 assertions. Three catalog,
probability, snapshot and selector units passed with 321 assertions. The server
unit suite passed 1,496 tests with 245,896 assertions. Native TCP passed one test
with 218 assertions in both realms. Required lint, formatting and server/nine
package type checks passed.

## Independent event-token exchange panels

The native exchange dispatcher now supports both fragment recipes and event-token
lists while retaining each form's original response. Token lists retain weighted
quantities and colors, out-of-order one-time tier claims, completion refresh,
graduated item refresh costs, the native ten-second manual refresh grace and
aligned automatic deadlines. Confirmed grants precede campaign event 62 with the
reference's logical activity category six. Combat engines still own token-earning
combat outcomes; this module cannot report a fictitious kill or battle result.

Each token panel uses its native panel identity in `user_activity_new`, with a
reserved-field domain marker and a saved token/interval header. Several source
panels shared category six; using that category as their common persistence key
could mix their currencies, offers and refresh budgets. The logical wire category
remains six, while each panel's persistent list and daily budget remain independent.
The existing `flushDate` stores the UTC budget day so repeated requests cannot
reset free uses merely because the offer checkpoint belongs to yesterday.

An old category-six list is adopted once only when all saved reward quantities
and colors match exactly one complete maintained panel configuration. Its existing
claims, refresh budget and deadline are retained. A marker prevents repeat
adoption. Ambiguous or malformed lists remain untouched, and new panel lists do
not mint assets. Colliding slots owned by another domain reject without writes.

Expired quotes cannot debit tokens until a fresh projection is requested. Token
identity and interval remain bound to the saved list. A replacement token
configuration waits for the original refresh boundary before admission. Automatic
alignment skips long outages without an iteration cap. Receipts, item debits,
actual grants, claim flags, replacement lists and campaign progress commit or
roll back together. A selected reward with missing catalog metadata fails without
consuming paid refresh tokens or replacing the saved list; no substitute reward
or hidden reroll is admitted.

Seven source token panel configurations are complete. Two placeholders lack offer
configuration and another declaration lacks its declared final gears. Incomplete
panels remain unavailable. The maintained data also contains a weighted reference
to absent reward `24701201`; selecting it rejects admission until the catalog is
corrected. No private input is modified to invent its intended reward.

No migration, dependency, environment variable or configuration key is added.
Inventory remains 848 tables and 6,917 fields. Back up event-token rows, legacy
adoption markers, inventories, campaign variables, receipts and outbox together.
An older binary does not understand the panel-keyed lists; retain the rows and
keep token panels disabled during rollback until the compatible binary is
restored. Device execution remains unverified.

Eighteen token and fragment PostgreSQL cases passed with 135 assertions. Four
catalog, probability, legacy-format and clock units passed with 57 assertions.
The complete server unit suite passed 1,500 tests with 245,953 assertions. Native
TCP passed one test with 222 assertions, including real saved token offers in
both realms. Required lint, formatting and server/nine package type checks passed.

## Dragon skill material ordering and capped experience

Skill upgrade now validates the complete material selection before applying it.
Strengthening materials run before ordinary experience materials, as in the
reference. An ordinary material appearing first in the client request therefore
cannot block a valid upgrade beyond the original level cap. The effective
strengthening cap is calculated before consumption, while unused ordinary
materials remain owned. A skill already at its reachable cap rejects without a
charge.

Experience arithmetic retains the reference's float conversion. Experience
clipped at the final cap is excluded from the saved transferable total, preventing
clipped points from becoming extra material value later. Both client material
orders produce the same owned state, and concurrent retries share one receipt.
No migration, dependency or configuration is added. Existing records are retained;
only newly accepted upgrades use the corrected accounting. Back up dragon skill
rows, receipts, ledger and outbox together before rollback. Device execution
remains unverified.

Ten dragon progression acceptance cases passed with 112 assertions across the
PostgreSQL and unit files. Required lint, formatting and server/nine package type
checks passed.

## Post-merge realm timers

The realm now runs active noncombat timer rules 656, 748 and 749 from the declared
campaign catalog. Condition 90 compares elapsed milliseconds with the inclusive
hour limits against `server_info.lastMergeMillis` for the `server` row. Missing,
zero or future merge facts never establish a campaign. The 24-hour monster gate
and the 120/168-hour upper limits remain distinct. Disabled timers and the
world-boss spawn/offline-notification actions remain outside this executor.

An advisory-locked, owner-fenced PostgreSQL transaction updates the exact declared
`trigger_timmer.timmer_name`, successful execution count and `last_exec_millis`.
Imported progress is retained. Missed ticks collapse into one execution at the
actual successful time; there is no reward or timer backfill. Each successful
action retains its full 600-second lifetime, including a legitimate tail after
an inclusive campaign boundary.

The same transaction writes a version-one snapshot of at most four effects in
`trigger_var` under realm scope type 2 and key `realm.merge.effects`, together
with its command receipt and `merge.campaign.board` outbox invalidation. The key
is excluded from the public `long_` campaign-variable query. Snapshot decoding
bounds the payload to 4096 bytes, validates effect identities, times and values,
and tracks the last advertised active identifiers so expiry produces one clear.
No schema migration or new dependency is required; existing realm tables remain
the backup and recovery unit.

The authoritative overlay owns effects 307 through 310 and removes their Redis
entries before adding live, matching-merge PostgreSQL values. Expired effects,
a changed merge fact and a cache replay cannot resurrect a boost. Unrelated
world effects remain intact. Economic reads reuse the active realm transaction
and hold shared locks on the merge fact and saved board, avoiding a second
connection per active mutation. `server_buff` continues to gate their benefits.
Gathering consumes effect 308 through the existing owner-effect resolver. Actual
`signIn.reward` goods grants now apply effect 310 with Java float arithmetic and
integer truncation; direct resources and equipment retain their original amounts.
Other reward commands receive no sign-in multiplier. Effect 307 is available to
the fresh resource-creation producer and never rewrites existing resource stock;
effect 309 remains available for a validated monster reward engine.

Native `world.effect.push` sends integer `effNum`, `effVal` and `stateId` plus a
long `endTime`, with string clears for 307, 308, 309 and 310. Login replays the
current board. Recovery relays rebuild that board instead of replaying a stale
outbox body, including clear-only boards after expiry. Delivery selects only
subscribed, eligible local characters in pages of 500, sends at most 32 at once,
and checks current ownership. Offline characters receive the current board on
their next login; no offline notification or missed sign-in reward is fabricated.

PostgreSQL integration evidence covers concurrent execution, imported cadence,
state/receipt/outbox rollback, owner replacement, missing/future merge facts,
TTL tails, expiry, stale Redis removal and actual sign-in inventory/ledger
behavior. Protocol tests verify native types, login replay, feature gating,
bounded fanout, payload bounds and float multiplication. Native-device rendering
and combat rewards remain separate compatibility evidence.

Before rollback to a binary without this executor, stop its worker and clear only
effect identifiers 307 through 310 from the Redis world-effect projection. Retain
the PostgreSQL snapshot, timer progress, receipts and outbox together. Restoring
the compatible binary resumes cadence and rebuilds the current board; an old
queued invalidation never grants a missed reward.

## Ordinary resource supply and dragon skill acceptance

The source audit identified an absent ordinary world resource producer, despite
existing gathering, return and search handlers. The maintained lifecycle and its
precise remaining boundaries are recorded in
[ordinary world resource creation and recovery](ordinary-world-resources.md).

The audit also checked the source `PetDragonSkillService` material workflow.
`petdragon.upgrade.skill` now validates the whole material selection and processes
strengthening materials before ordinary experience materials, independent of
client order. It retains unused ordinary materials when boosters already reach
the cap and rejects an already capped target before consumption. Experience
discarded at the final cap no longer inflates the skill's transferable total.
Concurrent retries and reversed input order produce the same persisted result.

The inspected public handler families include petdragon incubation, info,
friendship, gifts, civilization unlock, active selection, feeding, level upgrades,
travel, names and skills; dragon talents; civilization science; civilization
castle placement, settlement, speed-up, movement and removal; and totem placement,
recycling and status delivery. Existing tests establish those maintained slices,
not full native acceptance. Tower battle outcomes, civilization garrison and
robbery, battle-triggered talents and totem damage still require their validated
combat integrations. Ordinary world refresh is a server-owned producer and adds
no client command or alternate wire representation.

## Verified gift campaigns and funded red packets

The internal delivered-gift consumer requires `ServerConfig.paidGiftGateway` and
its owned, completed `paylog` record. `server.paidGifts.consume` binds the player,
kingdom, provider, order, exchange catalog identity, product tier, exact price in
cents and original delivery instant. The gateway attests that the original gift
body has already been delivered; this consumer neither accepts money nor repeats
that gift body. The default composition has no gateway and rejects consumption.
Native commands cannot invoke the trusted producer or submit campaign counters.

A permanent canonical command receipt pins the verified evidence and prevents
repeated provider/order delivery from issuing a second bonus. Event 56 observes
that evidence at its original instant. The six maintained system packet tiers
retain `gold_8` at 0.99 and `gold_1` through `gold_5` at 4.99, 9.99, 19.99, 49.99
and 99.99. Condition 104 compares the actual saved product tier. The declared
window, rule state, open type and personal purchase quota continue through the
campaign planner. Action 47 saves the declared funded pool, audience, distribution
mode, claimant count and original expiry together with campaign progress and its
announcement outbox event. Delayed consumption cannot extend that lifetime.

Native `redPackets.sd` validates the owned type-15 envelope, actual castle level,
item limits, message and current kingdom or alliance membership before reserving
one item and the complete gold amount. Native correlation supplies a stable
receipt for transport retries. Preview, status and received-history commands keep
the source field names and SFS integer and long types. Alliance access rechecks
matching current membership; visiting profiles and foreign kingdoms cannot claim.
Group audiences and foreign-server transfers require their corresponding shared
protocol and remain unavailable.

Claims lock the shared packet row inside the recipient's fenced economic
transaction. Saved funding history must match the remaining pool and claimant
count. A recipient receives at most one grant, the configured claimant quota
cannot be exceeded, and the final claimant receives the remainder. The random
selector retains the configured single-precision distribution and its five
parameters while reserving positive shares for later claimants. Average packets
retain ceiling division and the final remainder. System claims require the
configured castle threshold. Only a newly credited claim emits event 52;
condition 81 reads its actual grant and system sender. Previews and receipt or
claim-history retries cannot repeat score or gold.

The packet lifecycle sweep closes at most 128 due pools per transaction, using
row locks and the realm fence. Claims reject the exact expiry boundary even
before that sweep runs. Player-funded remainders become deterministic funded
mail for the original local sender, with the packet closure, mail notification
and receipt committed together. Repeated or concurrent sweep attempts cannot
repeat the refund, and an ordinary owned mail claim delivers the reserved gold.
System remainders close without creating mail for the synthetic system sender.
Imported pools with inconsistent funding history require reconciliation; missing
or relocated original senders retain their reserved pool until local ownership
can be established. The native post-12 announcement retains the packet identity,
server, sender and dialog identity and rechecks its current online audience.
Without a maintained localization table, its optional system message is empty.

No schema migration, dependency or environment variable is added. Inventory stays
at 848 tables and 6,917 fields. Back up packet pools and claim records, payment
records, inventories, wallets, campaign variables, permanent receipts, refund mail
and outbox together. Preserve outstanding pools and evidence during rollback;
resume their claim and refund lifecycle with a supporting binary. Provider
integration and native-device execution remain unverified.

Fourteen PostgreSQL acceptance cases passed with 121 assertions, covering all six
paid tiers, rejected evidence, native previews and claims, concurrent conservation,
quotas, sender and audience isolation, funded refund-mail collection, transaction
rollback, fencing and delayed delivery. Four rule and native-routing tests passed
with 27,021 assertions. The complete server unit suite passed 1,504 tests with
272,974 assertions. Native TCP regression passed one test with 222 assertions
across two realms. Required lint, formatting and 19 implemented workspace type
checks passed.

## Native activity directory

`act.ls` reads the owned character and current realm activity declarations in one
repeatable-read snapshot. The query returns native `act` entries with integer
`t`, optional integer `opt`, `st` and `et`, and Java signed-second conversion.
Entry iteration retains the source integer-map order. Closed declarations,
unsupported factory types and elapsed periods are omitted. Future opening and
start dates remain visible as announcements. An exact end boundary remains
visible until the next millisecond. The query never advances a period, creates a
reward or admits a combat command; validated period writers remain authoritative.

Queries require a local, existing, eligible profile. Reads use at most 4,096
announcements and reject oversized native frames. A new service instance reads
updated saved declarations immediately without a process-local schedule cache.
Missing directory support returns the standard unavailable error. No new schema,
dependency, environment variable or configuration key is required. Existing
activity rows are retained during upgrade and rollback.

PostgreSQL and wire-rule acceptance passed two tests with 19 assertions covering
stored periods, reconnect reads, end boundaries, factory exclusions, ownership,
bans, optional field order, native integer overflow and unchanged stored state.
Required lint, formatting and server/nine package type checks passed. Device
rendering and unvalidated combat schedules remain separate acceptance evidence.

## Black-market offers and confirmed hero actions

The maintained hot-item engine implements native `hot.item.v2.get`,
`hot.item.refresh`, `hot.item.refreshV3`, `hot.item.v2.buy` and `hot.item.v3.buy`.
The shared get command selects V3 only while the `hotstore` feature/version gate
and strict `store.k10`/`store.k11` activity window allow it; otherwise it serves
V2 and respects `store.k7`. Historical activity dates are retained. These
commands execute in the owned city transaction and preserve the Source integer,
string, array and long wire fields, including V3 `kind` and `endTime`.

Offers and featured cards persist in the existing V2/V3 hot-item tables.
`hot_refresh_record` retains the shared daily free/paid refresh budget and
`hot_buy_record` retains the per-pack purchase counts used by weighted draws.
Initial reads persist a zero-count daily checkpoint so reconnecting does not
reroll an unrefreshed board. A new actual UTC day resets the budget and purchase
weights without replaying missed purchases. Automatic and manual generation
preserve their different eligibility rules, early gold-offer exclusion,
purchase-dependent weights, routine entries, V2 item deduplication, V3 category
quotas and configured fallback entries. All state, stock, refresh charges,
grants, receipts, postings, campaign state and score effects commit together.

Purchases match the saved pack, price and payment type; clients cannot choose a
cheaper price, spend another owner's stock or buy an expired-day board. Gold
uses the existing paid/free pool order, resource costs consume bound stock before
regular stock, and item-token/crystal costs use their authoritative inventory or
profile balances. Grants create actual goods, resource balances or equipment.
The Source request `num` depletes that many stock units while `price` and
`itemNum` describe one purchased pack; it does not multiply either the debit or
grant. Sold-out offers draw a replacement from their eligible category. If no
alternative exists, the exhausted zero-stock entry remains visible until a
refresh rather than inventing stock or committing an incomplete grant.

The TCP adapter derives stable receipt identities for repeated native hot-item
correlation values within the authenticated connection; explicit operation IDs
retain the existing replay contract. Native replies include the updated offer,
remaining gold/crystal and resource state, plus goods or equipment when granted.
Eligibility reads remain bounded to 64 offers per version, 2048 purchase-history
entries, 128 relevant legacy score facts and 4096 catalog entries. Invalid or
oversized saved state fails before economic effects commit.

The successful purchase path records hero action **8**, parameter **2**, count
one, plus expedition action 11, campaign event 84 and the corresponding quest
progress. Source `WISH_AND_HOTITEM` is ordinal 8; ordinal 5 is a combat action.
The existing `user.pray` altar engine already records action 8, parameter 1 after
its real grant and debit. An ordinary shop or paid gift does not produce this
black-market action. Receipt replay, forged/failed purchases and rolled-back
transactions cannot add another score contribution.

Login includes the Source `businessMan` calendar. A realm-local cache retains
that derived configuration board until its next arrival/departure boundary,
matching the Source lifecycle rather than moving its end time on every login.
The current owner publishes `push.businessman.refresh` to subscribed, eligible
local characters in pages of 500 and batches of 32; unsuccessful publication is
retried and reconnects read the current board. This calendar is reconstructible
UI availability, not economic progress or reward authority. Its configured open
flag and offer transaction gates remain distinct.

No migration, dependency or new environment variable is introduced. Back up the
existing hot-item, featured-card, daily-budget, purchase-history, inventory,
equipment, profile/resource, score, campaign, receipt and outbox rows together.
An older binary can retain those rows during rollback, but hot-item commands
should be disabled until the owned executor is restored. Native device rendering
remains unverified; the implementation does not activate combat-dependent events.

## Resident map utilities and viewport departure

The source `FindNearestFreePoint`, `GetAllianceLeaderWorldPoint` and `LeaveWorld`
handlers now have maintained native routes: `point.nearest.find`,
`world.al.leader.pt` and `world.leave`. Their reads use a bounded, repeatable
PostgreSQL snapshot and the authenticated resident player's realm and alliance.
Client-supplied alliance identifiers cannot select another alliance's positions.

Nearest-point search preserves the source's seven perimeter rings, iteration
order and bottom-right four-cell anchor convention. It reads at most the native
17-by-17 window and rejects edge wrapping, occupied cells and invalid realm
selection. The result remains an integer `point`, with zero when no complete
footprint exists. This helper does not redefine existing provisioning or march
geometry.

Alliance map output preserves `pointId`, optional `territoryPointId` and optional
`memberPointId` order. Member entries retain integer point/world IDs and string
alliance IDs. The leader and requester are excluded from the ordinary member
array; only the current alliance's native type-14 towers appear in its territory
array. Multiple saved leaders fail instead of choosing an arbitrary owner.
Battle-world observer and specialized minimap projections remain unavailable in
this resident realm path.

Leaving the world removes only that player's durable viewport interest through a
fenced transaction. Repeating it is harmless; another viewer's subscription is
preserved. The next `world.get` obtains a fresh snapshot and resubscribes through
the existing world service. These commands add no schema, asset grant or
configuration setting. Synthetic PostgreSQL and native field tests establish
these routes; device execution remains unverified.

## Resident city fire and repairs

`buy.citydef` and `world.user.rcd` replace the ordinary `BuyCityDef` and
`RecoverCityDef` handlers through the owned city mutation transaction. Extinguish
settles whole-second fire damage, charges the configured game gold once and clears
the fire checkpoints. Repair enforces the saved minute-based cooldown, adds the
configured defense and clamps to the current wall maximum plus effect 125.
The native `repairType=1` black-land probe retains its string response without
changing defense or the cooldown.

Fire rates preserve the source float arithmetic, effects 122 and 2189 and the
61-cell outer/53-cell inner black-land reduction ring. Saved active boss fire
ranges supply their configured rate when applicable; reading an existing boss
record does not synthesize a boss battle. Native cross-battle realm restrictions
remain outside this resident world path. Both commands require the current owned
city point and the shared world mutation lock. Failed costs preserve health,
checkpoints and gold. Operation receipts prevent concurrent retries from charging
or applying a repair again; world point invalidations use the existing outbox.

The existing player effect calculation now admits these three source effect IDs.
No effect provider or scoring producer is bypassed. No schema, dependency or
configuration key is added. PostgreSQL acceptance covers fire settlement,
concurrent extinguish and repair, cooldown, wall cap, black-land probe, persisted
boss rates and insufficient-gold rollback. Device execution and the separate
combat producers that start fires remain unverified.

## Owned treasure map hints

The source `GetTreasureMap` and `DestroyTreasureMap` handlers now have maintained
`treasuremap.get` and `treasuremap.destroy` routes, plus the source login list of
unstarted maps. Generation checks owned item counts, color, player level and
weighted heritage rows. It creates only the difference between owned items and
saved unstarted maps of that color; concurrent retries cannot create duplicate
hints. Generation retains the items until occupation or explicit destruction.
Each request creates at most 128 hints; another request continues a larger owned
backlog. Foreign map identities cannot be destroyed or projected through login.

Hint geometry preserves the source's four corner regions and excluded black-land
coordinate strips. Target checks use bounded transactional reads, with the source
nearby fallback order. A map is not created if no usable terrain exists. The first
eligible row for a color supplies the source hint's range and displayed time;
the weighted selected heritage identity is retained independently. These differ
for a maintained purple variant and must not be silently conflated.

Destruction requires an owned unstarted map and consumes exactly one matching
item. The item debit, removal and operation receipt commit together. Reconnect
projects saved identities, owners, target, time, color and state with native field
order and types. No schema, dependency or external service is added; the existing
`treasure_map` table owns these records. Back up map rows with inventory and
receipts. An older binary can retain the rows with treasure handlers disabled.

The owned noncombat lifecycle described below adds excavation, acceleration,
completion mail and march recovery. Taking over an occupied enemy camp still
requires its validated battle engine.

## Native march preflight

The `MarchWorldPointCheck` audit corrected `world.march.check` to the native
Boolean `needBreakShield` response. It accepts a point without a soldier
selection and checks saved outbound/occupied march counts for `wantToFight`.
Changed resource and target conditions retain source errors `108896` and `103730`.
A shielded resident can inspect an occupied target without authorizing its attack.
The corresponding battle-dependent march admission remains unavailable.

Preflight runs before march recovery and cannot reserve troops, consume an item,
settle an overdue march or rewrite a world cell. The existing cosmetic type-13
preview remains a no-cost owned-item validation and never requires breaking a
shield. Previously returned travel, load and collection forecasts were not the
source preflight contract and are no longer substituted for it. PostgreSQL
acceptance covers a minimal native request, target-count changes, shield state,
overdue checkpoint preservation and troop conservation.

## Native city anchors and saved footprint compatibility

New cities, directed and random teleports, civilization castles and future march
routes use the native lower-right anchor. Its ordered footprint is left, above,
above-left and anchor. The anchor receives main type 1 and the other cells receive
range type 8; maintained city ranges retain the matching `pointItem` anchor link.
Civilization castles use main 68 and range 69 with their original `pointItem`
payloads. Coordinate bounds reject wrapped four-cell placements. Read loading
always retains a single-cell target, so a resource or treasure target on a map
edge does not need to be a valid city anchor. Gold-funded random teleport uses the
same validated native destination selection as its item-funded counterpart.

An existing maintained forward footprint can be normalized in its owned world
transaction. The owner, resident world, map placement lock, four occupied cells,
marches and active checkpoints provide the evidence. A uniquely matching legacy
square retains exactly the same four physical IDs. Its logical anchor advances
by one row and one column; main metadata moves to that anchor, and ranges receive
the appropriate type and city link. The resident `user_world.pointId`,
`userprofile.worldPoint`, known `world_march.ownerId` and checkpoint `origin` change
together. Troop buffers, cargo, segments, versions and every recorded deadline
remain unchanged. The coordinate and terrain fields of the physical cells stay
in place. Native imported cities remain unchanged, including native range cells
whose unused owner or point metadata was not populated by the reference server.

Only owned recognized checkpoint envelopes are reanchored. Unknown marches,
malformed checkpoints, inconsistent profile pointers, visiting or foreign-return
metadata, another actor's march references and pending foreign arrivals defer the
normalization. A proven legacy footprint remains available to future routes while
those blockers remain. Ambiguous ownership or incomplete cells cannot authorize
an assumed footprint or rewrite. A native preflight reads that evidence without
normalizing it. Once a blocker disappears, a later world recovery can normalize
the same saved city without resetting troops or clocks. Arrival outbox records
retain their original city binding until their recipient delivery acknowledges.

Provisioning locks its four native cells before inserting a character. Teleports
clear the previous footprint and its stale range links, reserve the validated new
footprint and update both player and world anchors in the economic transaction.
An imported native footprint with unlabelled range owners can move after its main
and range geometry have been verified; those imported rows are not repaired as a
side effect of reading or starting a march.

No migration, dependency, environment variable or catalog change is added.
Inventory remains 849 tables and 6,922 fields. Back up city cells, player and world
anchors, march rows and checkpoints, troop balances, receipts and outbox together.
A binary predating this geometry convention needs the compatibility adapter or
world-mutation gating during rollback; it must not reinterpret a native anchor
as a forward footprint. Preserve ambiguous records for reconciliation instead of
rewriting them or restarting their deadlines.

Twelve PostgreSQL geometry cases passed with 50 assertions. They cover concurrent
adoption, preserved metadata and checkpoints, fresh-pool recovery, imported native
ranges, ambiguity, unknown actors, pending arrivals, rollback, native preflight
and both teleport funding paths. Fourteen existing march, trouble, companion and
civilization cases passed. Native provisioning passed with 65 assertions, the
two-realm TCP regression with 222, and killed-process recovery with 47. Five
geometry rule cases, required lint and formatting, and 19 implemented workspace
type checks passed. Device execution remains unverified.

## Owned treasure excavation and recovery

The noncombat branches of `TreasureMapService.occupy`, `retreat`, `speedUp` and
`toMarchObj`, together with the empty-camp `WorldSpaceFightHandler` occupation
path and treasure completion callback, now use the persistent ordinary march
lifecycle. An owned unstarted hint on a genuinely free point admits a type-0
march with real reserved troops and companions. Arrival checks the point and
map again, resolves and pins the maintained heritage reward, consumes one map
item and starts the selected heritage row's actual excavation duration. A target
that changes before arrival returns the party without spending the map item or
overwriting its new owner.

The occupied camp and treasure row retain their march identity and deadline.
Native timer fields restore through owned march queries, viewport marches and
login. The source empty-camp occupation notification uses
`push.world.march.win` without a fight result or casualty fields. Its type-9
encampment mail contains the deployed party and point; this mail cannot carry a
reward. Completion deletes the owned map, clears only the matching owned camp,
creates funded template-11616 reward mail and starts the return journey. Mail
claim uses the existing ledger and receipt protections. A pinned reward remains
claimable after its catalog definition changes.

`treasuremap.spd` uses the configured gold formula and atomically advances the
excavation to completion. Failed costs preserve the deadline. Recall abandons
an active excavation without refund or completion reward. Recovery catches up
arrival, excavation and return in deadline order after a late worker or restart;
saved claimed camps without a checkpoint can be imported from their owned map,
point, army and reserved troops without charging the item again. PostgreSQL
acceptance covers those transitions, concurrent retries, restored native timers,
reward claim and changed targets. No schema or dependency is added.

Taking over another player's occupied camp remains unavailable until its battle
engine validates the defender, casualties and outcome. Cross-battle treasure
transfer is a separate realm-transfer dependency. Neither is needed for owned
free-point excavation; device execution remains unverified.

### Trusted activity military awards

Configured activity entitlements can plan `military` and `milhonor` grants through
`applyMilitaryRankAward`. The helper accepts a server-owned entitlement identity
and configured positive integer amounts. It exposes requested and credited amounts
separately: the native reward description retains the requested amount, while
weekly honor limits and float32 rounding can reduce the persisted credit. It does
not expose a native command or accept battle results from clients. A closed
`wr_switch` retains the reference reward manager's skip behavior.

The reader locks the existing `server_info.lastClearMilitaryMailSendTime` clock
and the owned `user_military_rank` row. An absent, zero, future or expired clock
leaves the entitlement available; a reward cannot initialize or advance the
military period. The expiry bound uses the saved marker plus `wr_info.k2` days and
the reference clock's one-day offset. A missing player row receives the reference
login defaults. Existing ranking experience, rank, awards, skills, status, reset
markers and active effects remain unchanged. These configured grants do not
perform global ranking settlement, promotion, combat scoring or period resets.

Score and honor retain the reference float32 operations before PostgreSQL's
numeric balance rounding. Honor uses the configured `wr_info.k13` ceiling for the
saved configured rank level. A missing or rank-zero row can receive score, but
honor remains unavailable until a factual configured rank is present; the
reference honor grant directly looks up the persisted rank and has no rank-zero
ceiling. The grant does not replace that missing metadata with a visible level.
Overflow and invalid amounts fail the entire claim. The writer checks the locked
clock and full row against the plan, repeats the counter calculations, and writes
only the affected counters. It records score, honor and weekly honor in integer
cents under the canonical `activity-military:{entitlementId}` journal namespace,
including zero-credit grants. Journal uniqueness fences a reused entitlement even
if another caller incorrectly resets its claim status.

The activity consumer must compose this writer with its owned entitlement status,
other reward effects and final command receipt in the same fenced mutation
transaction. A stale clock, counter, authority, ledger failure or receipt failure
rolls back every effect. No migration, dependency or environment setting is added;
back up military rows, the authoritative clock, entitlements, journals and receipts
together. Restoring only one of those records can invalidate award evidence.

Seven PostgreSQL cases passed with 61 assertions, covering owned claims, missing
rank metadata, replay, float32 balances, weekly limits under concurrency,
authoritative clock rejection, preserved rank effects, canonical entitlement
fencing, realm authority and atomic ledger or receipt failure. Five rule and
service cases passed with 34 assertions; package boundaries, required lint and
formatting, and 25 workspace type checks passed. The activity command composition
requires its consumer's integration verification.

## Owned imported activity reward claims

`activity.accept.reward` consumes the existing owned `user_activity` row and its
`server_push` reward in one fenced city transaction. A missing, foreign, banned,
wrong-realm or already consumed entitlement cannot grant assets. The configured
minimum version retains the reference's concatenated integer comparison. Expired
announcement dates do not erase an already owned entitlement. A missing reward or
unsupported configured type leaves its claim available rather than charging or
partially applying it.

Reward bytes use strict UTF-8 and the reference's padded-string trim. At most 64
blocks retain their original order; blocks are validated individually rather than
merged across intervening actions. Goods, equipment, game gold, crystals, ordinary
and dedicated resources, legacy generals, quest power, alliance contribution,
alliance points and configured military counters use their existing owned stores.
The native fields retain their integer, long and array types. A goods grant
produces actual item event 40 through the common campaign observer; it does not
produce a fabricated funded-mail claim.

Legacy general rewards preserve level one, the requested batch, the three defense
slots and the existing ownership check. A later block requesting an already owned
general does not create another copy. Player level changes update only generals
present at that point in the configured sequence. Consecutive level changes use
their effective previous levels, so saved power cannot count an earlier increment
again. A newly granted level-one general is not raised merely because another XP
block leaves the player's level unchanged.

The shared player experience planner applies effect 80 as float32 converted to
double, narrows the complete old-experience-plus-scaled-award expression with Java
integer semantics, follows the factual role thresholds and applies the configured
maximum. Already capped imported experience remains intact. Native `expDelta`
retains only the last requested block amount. This calculation also serves
existing construction, quest, sign-in and progression rewards, whose callers pass
raw amounts. Quest power survives subsequent power updates in the same context.

Alliance rewards lock the current owned membership and shared pool before
planning. The writer checks the saved counters again, records their actual
before/after values under `activity-reward:{actId}` and writes the claim marker in
the original mutation. These non-inventory counters have their own journal; the
inventory posting-chain validation remains unchanged. A durable alliance
invalidation publishes the current `al.point.push` total only to current local
members other than the claimant. Military grants compose the clock, rank and
weekly-cap helper above in the same transaction; native quantities describe the
requested grant while the journal records the actual capped credit.

The supplied reference has no entitlement issuance or reconnect announcement
protocol to reproduce. Its `UserActivity.getLoginInfo` implementation is empty,
and the original extension bytecode confirms the empty body and lack of callers
for the entitlement insert/select producers. These rows are factual import or
external backoffice input. The separate scheduled `server_push` mail pipeline
uses mail delivery records; it is not evidence for inventing activity enrollment
or a new native announcement field.

No migration, dependency, environment variable or private resource is added.
Back up entitlements, announcement rewards, inventories, equipment, generals,
player progression, alliance and military counters, both canonical journals,
receipts and outbox together. Preserve claim markers and journals during rollback;
restoring only a wallet or status can invalidate its award evidence. An older
binary must not expose the reference's repeat-claim bug against these records.
Native-device execution remains unverified.

Nineteen PostgreSQL, ordered-parser and experience-rule cases passed with 184
assertions. They cover concurrent replay, unique claims, version and realm gates,
missing metadata, all grant families, sequential ownership and level changes,
real XP bonuses, maximum experience, canonical journals, military caps and
receipt-failure rollback. The complete server unit suite passed 1,535 tests with
276,837 assertions across 281 files. Broader progression and integrated-stack
checks follow the composed dependent modules.

Nine existing construction, quest, legacy-general and draw PostgreSQL regression
cases passed with 82 assertions. Two strengthened version/category cases passed
with 19 assertions, including the non-semantic concatenated version order and
rejection of a raw `silver` alias that the reference does not grant.

## Native operator activity projection

`activity.operators` now returns the Source `activityList` array with INT page
identifiers and LONG end times in seconds. It reads `activity_page` and projects
the maintained newcomer recharge, castle-level, target-task, recall-task,
alliance group-buy and continued-cost modules. Enabled, current noncombat
custom/Lua/UI/pack windows retain their configured page identifiers. Historical
dates are preserved, and combat resource battles, battle-tagged panels and
unsupported panel types remain absent.

The read uses one repeatable-read, read-only writer transaction. It selects only
the principal fields needed for ownership/bans, the real realm opening clock,
owned castle levels and target/recall deadlines, registration country and bounded
group-buy calendars. Existing personal deadlines survive configuration changes;
relative newcomer/castle events require a positive, nonfuture opening fact.
Fixed-date newcomer windows do not invent or require a relative opening clock.
Target and recall periods retain their separate feature, country, castle and
calendar rules. Group-buy projections check the persisted matching period and
round when present, and can expose the configured current period before its
first owned interaction without creating that interaction.

Feature/version closure, personal expiry, insufficient castle level, foreign or
banned principals and inconsistent saved clocks cannot produce a live entry.
Continued-cost pages reuse the actual period and castle/realm eligibility rules.
The reader bounds pages to 4096, buildings to 256, relevant group-buy rows to two
and each saved calendar to 32768 characters. It never creates tasks, claims,
periods, receipts, outbox records, inventory changes or rewards. Native correlation
fields remain intact, and saved long clocks do not pass through JavaScript number
conversion before the Source division by 1000.

This projection does not substitute regional recall for the separate legacy
`comeback` engine. Normal accumulated recharge (type 20), legacy comeback (21), today-sale (24) and
overseas trade (26) are covered by the focused backend/projection sections below. Combat
resource battles (38) remain gated. Those remaining engines and native-device
rendering are separate completion work; this section does not declare topics
25–27 complete. No migration, dependency or environment variable is added.

## Ordinary resource supply and dragon skill acceptance

The source audit identified an absent ordinary world resource producer, despite
existing gathering, return and search handlers. The maintained lifecycle and its
precise remaining boundaries are recorded in
[ordinary world resource creation and recovery](ordinary-world-resources.md).

The audit also checked the source `PetDragonSkillService` material workflow.
`petdragon.upgrade.skill` now validates the whole material selection and processes
strengthening materials before ordinary experience materials, independent of
client order. It retains unused ordinary materials when boosters already reach
the cap and rejects an already capped target before consumption. Experience
discarded at the final cap no longer inflates the skill's transferable total.
Concurrent retries and reversed input order produce the same persisted result.

The inspected public handler families include petdragon incubation, info,
friendship, gifts, civilization unlock, active selection, feeding, level upgrades,
travel, names and skills; dragon talents; civilization science; civilization
castle placement, settlement, speed-up, movement and removal; and totem placement,
recycling and status delivery. Existing tests establish those maintained slices,
not full native acceptance. Tower battle outcomes, civilization garrison and
robbery, battle-triggered talents and totem damage still require their validated
combat integrations. Ordinary world refresh is a server-owned producer and adds
no client command or alternate wire representation.

## Legacy comeback enrollment and explicit claims

The separate Source comeback engine now serves `comeback.info` and
`comeback.reward`, with an internal login initializer. Its maintained `comeback`
catalog controls weighted configurations, global opening, inactivity thresholds,
return classes, character/castle/payment bands, realm/country/language/platform
selectors and welcome/daily/paid channels. The catalog's current configuration
opens indefinitely and enables welcome plus seven daily rewards. Channel three
requires an explicitly configured payment node and the authoritative
`userprofile.payTotal` increase since enrollment; a client counter cannot qualify.
Regional recall and recall tasks retain their own eligibility and records.

Authenticated session open, observed traffic at most once per minute and close
persist monotonic player activity clocks under realm fencing. Before advancing
`lastOnlineTime`, open saves the prior character and device observations in a
bounded, versioned private `trigger_var` snapshot. The snapshot freezes the
absence at session opening; remaining online cannot grow an initially ineligible
absence into a comeback. A socket identifier prevents an old connection from
closing its replacement. An owner profile lock followed by a hashed device
advisory lock serializes same-device enrollment without exposing device identity
in receipts, notifications or logs.

Untouched imported profiles can use their preserved legacy clock. A character
with prior TypeScript mutation receipts and no persisted presence snapshot starts
observation at adoption, because its stale imported timestamp cannot prove that
it was absent. The same conservative rule applies to device peers with unknown
activity. Missing, zero and future clocks do not create inactivity. Device
aggregation reads at most 256 actors, and a device return of class one can qualify
another character only from that character's own prior absence. Trusted stored
return flags retain Source classes three/four and clear only on committed
enrollment. Existing globally open configurations do not reenroll an expired
personal period.

Session capture, actual enrollment, baseline payment counter, flag clearing,
welcome mail and command receipt commit together. Enrollment sends no economic
reward. Each explicit claim checks the configured channel, reached day or
payment node, stored ownership, deadline and unclaimed flag before the normal
inventory transaction grants the pinned pay reward. Claim flags, inventory,
economy postings, outbox and receipt share rollback and concurrency protection.
Future daily claims, unknown payment nodes and unconfigured channels are rejected.
Login and recovery never claim missed daily or paid rewards. The Source calendar
view and actual elapsed claim deadline remain distinct, preserving its inclusive
claim tail.

Native info retains INT counts/days/states, BOOL welcome state, LONG deadlines in
seconds and payment deltas, UTF payment nodes and reward arrays. Viewed-today
state persists privately and suppresses the native `login_popup` 57083. Operator
REGRESS21 reads only owned configuration/time facts and the real 57083 panel end;
it neither enrolls nor replaces historical panel dates. Migration0043 adds the
`user_comeback_record(deviceId, backTime)` lookup index, with matching Drizzle
metadata, schema inventory, SQL snapshot and physical PostgreSQL verification.
No external dependency or environment setting is added. This module does not
establish native-device rendering or completion of topics25–27.

## Today-sale and overseas operator pages

The Source audit identifies TODAY_SALE24 as the existing `SpecialEventToday`
backend, served by `special.ui.state` and the authoritative special-sale stock and
accepted-payment reservation path. Its operator entry uses only the69026 version
and realm control and returns LONG endTime zero. The sale's own fixed dates and
purchase/stock gates remain in that backend, preserving the Source distinction
between its navigation entry and actionable inventory.

OVERSEAS_TRADE26 projects the existing `ShippingTradeInvest` backend, served by
`shipping.trade.invest.ui` and `shipping.trade.invest.reward`. Its operator deadline
uses the positive, nonfuture persisted realm opening plus69027.k6days, with a
strict end boundary. The investment backend retains its separate Source version
and realm gate, sequential persisted tiers, active VIP requirement, actual gold
stake, pinned weighted return and atomic receipt. Completing a tier does not
remove the Source navigation entry early. Historical dates and closed production
controls remain intact. Neither projection adds a payment claim route, mutation,
schema, dependency or environment setting.

## Verified gift campaigns and funded red packets

The internal delivered-gift consumer requires `ServerConfig.paidGiftGateway` and
its owned, completed `paylog` record. `server.paidGifts.consume` binds the player,
kingdom, provider, order, exchange catalog identity, product tier, exact price in
cents and original delivery instant. The gateway attests that the original gift
body has already been delivered; this consumer neither accepts money nor repeats
that gift body. The default composition has no gateway and rejects consumption.
Native commands cannot invoke the trusted producer or submit campaign counters.

A permanent canonical command receipt pins the verified evidence and prevents
repeated provider/order delivery from issuing a second bonus. Event 56 observes
that evidence at its original instant. The six maintained system packet tiers
retain `gold_8` at 0.99 and `gold_1` through `gold_5` at 4.99, 9.99, 19.99, 49.99
and 99.99. Condition 104 compares the actual saved product tier. The declared
window, rule state, open type and personal purchase quota continue through the
campaign planner. Action 47 saves the declared funded pool, audience, distribution
mode, claimant count and original expiry together with campaign progress and its
announcement outbox event. Delayed consumption cannot extend that lifetime.

Native `redPackets.sd` validates the owned type-15 envelope, actual castle level,
item limits, message and current kingdom or alliance membership before reserving
one item and the complete gold amount. Native correlation supplies a stable
receipt for transport retries. Preview, status and received-history commands keep
the source field names and SFS integer and long types. Alliance access rechecks
matching current membership; visiting profiles and foreign kingdoms cannot claim.
Group audiences and foreign-server transfers require their corresponding shared
protocol and remain unavailable.

Claims lock the shared packet row inside the recipient's fenced economic
transaction. Saved funding history must match the remaining pool and claimant
count. A recipient receives at most one grant, the configured claimant quota
cannot be exceeded, and the final claimant receives the remainder. The random
selector retains the configured single-precision distribution and its five
parameters while reserving positive shares for later claimants. Average packets
retain ceiling division and the final remainder. System claims require the
configured castle threshold. Only a newly credited claim emits event 52;
condition 81 reads its actual grant and system sender. Previews and receipt or
claim-history retries cannot repeat score or gold.

The packet lifecycle sweep closes at most 128 due pools per transaction, using
row locks and the realm fence. Claims reject the exact expiry boundary even
before that sweep runs. Player-funded remainders become deterministic funded
mail for the original local sender, with the packet closure, mail notification
and receipt committed together. Repeated or concurrent sweep attempts cannot
repeat the refund, and an ordinary owned mail claim delivers the reserved gold.
System remainders close without creating mail for the synthetic system sender.
Imported pools with inconsistent funding history require reconciliation; missing
or relocated original senders retain their reserved pool until local ownership
can be established. The native post-12 announcement retains the packet identity,
server, sender and dialog identity and rechecks its current online audience.
Without a maintained localization table, its optional system message is empty.

No schema migration, dependency or environment variable is added. Inventory stays
at 848 tables and 6,917 fields. Back up packet pools and claim records, payment
records, inventories, wallets, campaign variables, permanent receipts, refund mail
and outbox together. Preserve outstanding pools and evidence during rollback;
resume their claim and refund lifecycle with a supporting binary. Provider
integration and native-device execution remain unverified.

Fourteen PostgreSQL acceptance cases passed with 121 assertions, covering all six
paid tiers, rejected evidence, native previews and claims, concurrent conservation,
quotas, sender and audience isolation, funded refund-mail collection, transaction
rollback, fencing and delayed delivery. Four rule and native-routing tests passed
with 27,021 assertions. The complete server unit suite passed 1,504 tests with
272,974 assertions. Native TCP regression passed one test with 222 assertions
across two realms. Required lint, formatting and 19 implemented workspace type
checks passed.

## Normal accumulated recharge

The Source PaymentService engine now owns `pay_total(uid,type)` progress for
month-end type one, midmonth type three and post-merge type four. Maintained
`heap` nodes drive ordered thresholds and claimable12000/12014 system mails.
Normal threshold advancement emits trusted campaign event70 with the actual
reached level; merge advancement preserves Source's separate event behavior.
Native login `repayinfo` retains millisecond LONG start/end/points, UTF gift type
and face, INT thresholds and reward previews. The internal delivery result
retains LONG `repay_add`. Operator NORMAL_ADD_UP_RECHARGE20 uses the same actual
window and converts its end to LONG seconds.

69022 version/realm admission requires the persisted positive, nonfuture
`server_info.payTotalTime`. Normal calendars retain their maintained dates and
inclusive boundaries. The separate merge feature additionally requires an actual
positive, nonfuture `lastMergeMillis`. The first initializer or verified delivery
pins `mergeTiredRushBeginTime` under the realm transaction; an overlapping normal
window postpones that anchor to its configured end before applying the declared
offset. Existing anchors survive retries. Active merge windows take precedence,
retain the configured full duration and do not start from absent/future facts.
The initial anchor lock is avoided after that fact is established.

The observer reuses `ServerConfig.paidGiftGateway` and
`server.paidGifts.consume(owner,orderId,platform)`. Its adapter must attest that
the original gift body is already delivered. Before progressing, the observer
checks the owned status-two paylog, provider/order, exact SKU, single-pack catalog
price and original instant. Points use the exact Source `gold_doller` catalog
field. They are never inferred from a dollar-to-gold ratio, and the original gift
body is not granted again. The shared proof can explicitly report
`rechargeGold` between zero and the declared single-pack amount for confirmed
zero/reduced-gold delivery outcomes. Quantity-priced deliveries require an
explicitly supported provider contract; this observer does not guess quantity.
Mycard's separate type-two path requires trusted method metadata and preserves
Source float arithmetic for cents; no current heap nodes declare that type.

The owner-fenced transaction commits total, monotonic observed payment time,
reached level, pinned mails, campaign changes, outbox and canonical command
receipt together. A private version-one order marker additionally prevents
reapplication after generic receipt cleanup. Each marker contains a bounded
fingerprint and its key hashes the canonical provider/order identity. Valid
orders outside an admitted window are recorded without awarding a later
retroactively configured period. Same-period out-of-order deliveries can still
increase the total; an older period cannot replace newer progress. Login and
startup never scan historical orders or repair missing threshold awards.

PostgreSQL tests cover competing retries, owned status/SKU/price checks, Source
point values, mail-to-inventory grants, rollback, stale realm fencing, clock
admission and concurrent merge-anchor creation. The default provider adapter
remains unconfigured and rejects trusted delivery calls. No native paid command,
provider endpoint, schema migration, dependency or environment setting is added.
Provider integration and native paid-response/device acceptance remain explicit
external boundaries; this section does not claim topics25–27 complete.

## Shared delivered-payment observers

A configured `paidGiftGateway` now reaches normal recharge, verified gift
campaigns, newcomer recharge and recharge feedback through the existing internal
`paidGifts.consume` port. The dispatcher establishes the canonical owner/provider/
order context for that call and assigns each observer its own stable command
receipt. Newcomer and feedback adapters reuse the exact owned status-two
paylog/SKU/price/time validation and declared delivered gold. Proof reads use the
current fenced mutation transaction; adapters cannot be called successfully from
an unrelated private event or native player command. No primary gift body is
issued by these observers.

Each observer commits independently. A later failure rejects the delivery
acknowledgement so the trusted caller can retry the same order; completed
observers replay their receipts and remaining observers finish. Original payment
instants retain the existing period semantics. Closed observer windows and valid
zero-gold outcomes acknowledge without fabricating progress. Feedback counts
exclude pending/noncompleted paylog rows, including records that cannot present
a delivered proof. The dispatcher creates no order-history scan, startup reward
backfill or public payment route. Providers still own actual payment acceptance,
primary delivery and retry until this internal acknowledgement succeeds.

PostgreSQL tests exercise concurrent duplicate callbacks, all four observer
receipts, actual normal/newcomer totals and feedback mails, zero-gold delivery,
pending-order exclusion, unrelated-event denial, failure in the final observer
and safe retry. Native two-realm acceptance configures the proof adapter and
checks the real server composition, canonical retry and login replay. The
existing default composition remains unconfigured for external payment
providers. This composition adds no schema, dependency or environment setting.

## Owned resource placement items

`UseWorldPoint` and the resource branch of `TreasureMapService.useWorldPoint`
now route `world.use` through the owned city transaction and world mutation lock.
The native request selects an owned item UUID and a point. Type-11 goods choose
their configured weighted target from the first `resources` group and create a
real ordinary resource node with the selected type, level, base capacity and
lifetime. Player placement deliberately uses no natural-spawn capacity bonus.
The source free-point check admits grid types 0 and 1 as well as 2 when the point
is empty, has no owner and has no secondary terrain restriction.

The exact selected stack is consumed once. Foreign items, occupied points,
unsupported goods and invalid resource definitions fail before the debit.
The native `pointId` integer and `itemid` string response is also published as
`push.world.use` to other interested residents through the durable outbox.
Source `flushFlag=1` is persisted so player nodes do not count toward natural
resource quotas or create replacement tickets. Expiry postpones occupied nodes;
a free expired player node clears without replenishing it. Natural nodes retain
the existing delayed replenishment behavior. PostgreSQL acceptance covers the
owned stack, receipts, costs, actual stored capacity, terrain, notification,
expiry and occupied-node preservation. No schema or dependency is added.

Type-12 monster placement has a separate ordinary point creation and expiry
recipe. That producer remains to be established independently of battle
admission; this resource route does not charge a monster item.

## Resident crash-city recreation

`RecreateWorld` and the resident `UserWorld.recreateWorld` path now route
`world.user.rcr` through the owned city transaction. The saved resident point
must be zero. Recreation consumes no teleport item or gold, restores the current
wall maximum including effect 125 and the saved active shield, writes the native
main/range footprint, and updates both the profile and world point identity.
`lastCityDefTime` and `lastMoveCityTime` advance together with the placement.
The native response retains `srcPoint`, `dstPoint`, `point`, `cityDefValue` and
long `lastCityDefTime` order and types.

Existing owned ordinary parties use the same recovered recall and return path as
city relocation. Their reserved troops and saved companions return once; an
active gathering or treasure camp is released according to its actual lifecycle.
An unsupported party cannot be invented or resolved to make recreation succeed.
No complete free native birth footprint leaves the lost city unchanged. Native
move notifications and point invalidations commit through the existing outbox.
This route remains available when new ordinary march admission is disabled.

Source recreation uses the initial birth placement path on space grid type
two. The saved birth priorities differ from ordinary random teleport selection. The [resident birth allocator](resident-world-birth.md) persists Source
`WorldBornManager` phased `resdential` priorities and shares the placement
distribution with initial provisioning and random relocation. Existing imported cities are not relocated by this
command. PostgreSQL acceptance covers zero-point ownership, retry conservation,
reserved terrain, wall and shield restoration, native fields, recovered troops
and unavailable footprints. Cross-battle recreation retains its separate realm
and target-engine dependencies. No schema or dependency is added.

The native birth terrain gate is `GridType.SPACE` (2), confirmed by
`WorldPoint.selectFreeBornPoints` and `selectAllFreeBornPoints`. Both initial
character provisioning and recreation use this gate. Neutral grid type 0 does
not admit a new resident city. Existing imported cities retain their actual
terrain and identity. PostgreSQL provisioning acceptance first supplies only
neutral tiles and verifies that no character is created, then enables space
tiles and exercises normal receipt, rollback and ownership recovery.
