# Ordinary world resource creation and recovery

The maintained 12.06.0 ordinary resource producer replaces the noncombat lifecycle
in `WorldFlushResourceTask` and the resource selection portion of
`WorldCreatorV2`. This is implementation evidence for topic 27, not acceptance
of every world target engine or client version. The authorized private source
was read only; production consumes maintained catalogs exclusively.

The source has four independently declared `resources` groups, selected without
repeating a group until all groups have participated. Selection uses the saved
group interval, radial area band, realm age and native integer weights. A selected
type six is a failed node creation and becomes a delayed wait ticket; it never
creates a pretend silver, crystal or combat target. The existing realm-opening
clock supplies age. Imported realms without an authoritative opening clock pause
natural generation and rotation rather than receiving an invented age. Existing
ordinary and player resource nodes can still expire or postpone expiry.

A fenced realm worker shares the world mutation lock with placement, movement
and marching. It postpones expiry for occupied ordinary resources, clears expired
unoccupied resources, creates delayed replacements through `world_res_dead`,
retries replacements without discarding blocked tickets and tops up ordinary
area quotas. Quotas include living resources and waiting tickets, preventing
repeated refresh from increasing supply. Resource selection can move a replacement
to another eligible tile in its saved area. Owned, reserved, stopped and unsupported
territory tiles are excluded. Existing city, monster, event and special resource
points remain untouched.

The worker processes at most 64 expirations, 64 waiting replacements, 64 new
ordinary quota slots and 64 black-land quota slots per transaction, visiting at
most eight ordinary areas. A persisted
cursor continues a large refresh after restart. Full pages drain before the next
30-minute refresh interval. A long outage advances the group clock once on
recovery and starts a new interval; it does not replay historical random draws.
Expired occupied resources receive a future lifetime directly, avoiding an
unbounded sequence of historical postponements.

New nongold capacities use the native float sum of world effects 305 and 307.
Gold capacity ignores these effects; its selection weight can use the source
`17_wk.k11` bonus while `server_info.resGoldAddEndTime` is live. Existing node
capacities are immutable under later effect changes. Gathering and return remain
the existing owned march workflow; generation never credits a player's wallet.

Migration `0042_world_resource_refresh.sql` adds one five-field singleton table
for group selection, refresh time and area progress. It does not change existing
resource, player or march columns. The schema inventory becomes 849 tables and
6,922 fields. Node mutations, wait tickets, clock progress and native point
invalidation events commit together. Notification recovery uses `world.resources`
and the existing world interest relay. Resource recovery failures are reported
without stopping march recovery.

Back up `world_resource_runtime`, `world_res_dead`, world points and mutation
outbox together. A binary rollback can retain these records with resource
refresh disabled; deleting only the clock or waiting tickets loses rotation or
supply history. No new dependency, environment variable or operator setting is
introduced.

Synthetic PostgreSQL checks cover concurrent initialization, node capacity,
occupied expiry, delayed replacement, reconstruction with a fresh executor,
wallet conservation, durable native notifications, authority fencing, group
rotation, no-node draws, bounded catch-up, blocked replacements and rollback.
Schema contracts, SQL snapshots and physical database checks cover the new table.
Device execution remains unverified.

Black-land ordinary resource creation is also maintained. Source geometry is the
inclusive 575–625 square; free resource tiles use grid type zero, while normal
areas use grid type two. Black-land selection uses native resource band zero and
the separate `black_land_res_dead` table. It replenishes toward the configured
maximum of 31 only when living nodes plus waiting tickets reach the configured
minimum of 21 or lower. A partial reduction above that threshold does not refill
the world. Occupied nodes retain their capacity; expiry, delayed recovery,
capacity effects and native notifications use the same fenced transaction.

Special/event resource generation, neutral resources, battle resource targets,
monster rewards and territory engines have separate source lifecycles and are not
established by these ordinary-node tests. Their concrete dependencies must be
audited separately; this document does not label every remaining producer as
combat-dependent.

Player resource items use `world.use` and persist `flushFlag=1`. Their base
capacity is independent of effects 305 and 307. Such nodes stay outside natural
area quotas, postpone expiry while occupied and clear without replacement tickets
when free. The bounded expiry scan includes both natural and player nodes; only
natural nodes can produce ordinary or black-land wait tickets.

Expiry does not require a known or already-started realm opening. Missing, zero
and future opening dates permit factual node cleanup, but cannot create rotation
state, replacements or new quota supply. The source `World.startFlushResourceTimer`
uses a default 30-minute resource interval. Without a natural clock, an ephemeral
30-minute executor deadline limits cleanup scans; it advances only after commit
and full 64-node pages drain immediately. Restart resets this scheduling cache
and retains actual node deadlines in PostgreSQL.

The existing `worldpoint_world_pointType_flushTime_index` begins with point type,
item and expiry. Cleanup reads six individually bounded index ranges, one per
ordinary resource item type, before locking at most 64 selected rows under the
shared world lock. Each range reads at most 64 candidates, so a missing opening
clock does not cause a full terrain scan every worker tick. Native deadlines and
outbox invalidations remain atomic with node changes. PostgreSQL checks cover
missing, zero and future openings, occupied nodes, interval suppression, bounded
catch-up and rollback without retaining an uncommitted scheduling deadline.
