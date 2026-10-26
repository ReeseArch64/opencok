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
| 27    | Specialized target engines, process-restart acceptance and native interest-stream acceptance                                                           |

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
