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
clock supplies age. Imported realms without an authoritative opening clock are
preserved rather than assigned an invented age.

A fenced realm worker shares the world mutation lock with placement, movement
and marching. It postpones expiry for occupied ordinary resources, clears expired
unoccupied resources, creates delayed replacements through `world_res_dead`,
retries replacements without discarding blocked tickets and tops up ordinary
area quotas. Quotas include living resources and waiting tickets, preventing
repeated refresh from increasing supply. Resource selection can move a replacement
to another eligible tile in its saved area. Owned, reserved, stopped and unsupported
territory tiles are excluded. Existing city, monster, event and special resource
points remain untouched.

The worker processes at most 64 expirations, 64 waiting replacements and 64 new
quota slots per transaction, visiting at most eight ordinary areas. A persisted
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

Black-land resource quotas and their separate waiting table are a remaining
ordinary noncombat implementation boundary at this checkpoint. Special/event
resource generation, neutral resources, battle resource targets, monster rewards
and territory engines have separate source lifecycles and are not established by
these ordinary-node tests. Their concrete dependencies must be audited separately;
this document does not label every remaining producer as combat-dependent.

Production captures the refresh clock after acquiring the shared world lock.
World effects are read inside that same transaction through the authoritative
merge overlay, so a delayed worker cannot reuse an earlier cache snapshot or
backdate a new node lifetime. Explicit clocks remain available to deterministic
acceptance fixtures. Eleven integrated resource and merge cases passed with 210
assertions, including an actual PostgreSQL lock wait before clock capture.
