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

| Topic | Modules still requiring implementation and acceptance                                                                                |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 25    | Dragon lifecycle, travel, feeding, skills and dedicated resources; civilization castle; totems; native-client progression acceptance |
| 26    | Local schedules, enrollment, score producers, lotteries, anniversary, expedition and arena; durable reward and period acceptance     |
| 27    | Troop reservations, march creation/movement/gathering/return, acceleration, teleport and world interest publication                  |

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
cooldowns and next-day reset. This module is one slice of topic 26; lotteries,
anniversary, campaign enrollment and arena are still pending.

## March transition foundation

`contracts/world-march-lifecycle` and `rules/world-march-lifecycle` define the
noncombat lifecycle independently of transport and storage. Departure transfers
selected free troops into the march reservation. Arrival starts gathering at the
saved arrival instant, even during late recovery. Gathering completion pins cargo
and the return deadline; only completed return releases troops and credits cargo.
An outbound recall takes an authoritative reverse-route duration. Ordinary-route
acceleration uses Java float rounding and preserves the reference 1,500 ms minimum
remaining outbound time. Black-land routes need their separate segment calculation.

Each transition requires the owning player and expected version and returns the
version to compare before writing. Insufficient troops, overflow, duplicate troop
selections, premature transitions, foreign ownership and stale versions reject.
Inputs remain immutable. The terminal state rejects repeated return completion.
Synthetic tests check conservation of troop counts across the full lifecycle,
late recovery without deadline drift, single cargo delivery and acceleration edges.

These are domain rules, not an enabled world runtime. A realm transaction adapter
must atomically compare the saved version, persist the march and troop changes,
apply cargo through the ledger, and write the receipt and outbox before native
commands can use them. Route duration, target availability, troop capacity and
cargo amounts must come from authoritative catalogs and a locked world point;
none may be accepted from a client. The point update and cargo debit must share
the same transaction. Gathering interruption, combat losses, special routes,
teleport, interest subscriptions and background recovery remain separate work.
Existing world commands are not redirected to an in-memory simulation.

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
