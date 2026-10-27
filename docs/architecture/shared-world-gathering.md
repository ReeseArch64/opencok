# Shared world gathering

The resident `RESOURCE_NEW` main point is type 37; its native four-cell ranges
are type 38. This is a noncombat resource lifecycle. Reference evidence is
`WorldResourceNewFightHandler.check`, `handleWin` and `needFight`,
`WorldMarch.updateAllMarchTime`, `getAlreadyCollectCount`, `onOccupyFinish`,
`attachExreaResNewReward`, `UserWorld.addMarchExtraInfo` and
`GetResourceNewDetail.handleRequest`. Supply and expiry remain separate from
party admission. The maintained `on_event2` quota is zero and its start/end dates
form a closed interval; this implementation does not replace those settings.
Synthetic acceptance rules enable tests without changing the shipped catalogue.

An owned ordinary `world.march` can reserve its actual troops and companions for
an existing main point. Its travel path uses the native four-cell target. Each
party pins the actual resource capacity and the collection rate calculated from
`on_event2.k4`, castle production and the existing collection effects. The saved
army retains raw load, so adopting an imported party applies resource weights
once. Entering a shared point neither attacks another party nor claims exclusive
ownership of the node. One resident cannot occupy it twice. A full point returns
the arriving party and sends the native unrewarded 11666 system mail. Missing,
changed or virtually exhausted targets return their party through the existing
owned return lifecycle.

The existing world placement lock serializes admission, recalls and depletion
with supply and expiry. Target snapshots include the actual gathering marches,
checkpoints, troop levels, profiles and saved companions. A join or departure
recalculates the remaining stock divided by the summed collection rate and the
individual load deadlines. Shared depletion retains the native whole-second
rounding. Pending owned checkpoints and the main point's actual party counter
commit in the same economic transaction. Peer deadlines use a constrained
versioned write: the peer must still gather at this type-37 target, and its
checkpoint may change only version and deadline. Its army, cargo, owner, source,
companions and all other checkpoint fields must match the locked original. No
peer inventory or troop balance is rewritten. Unknown occupied actors cannot be
silently excluded from admission or converted into a maintained party.

A party settles only its actual collected amount against the remaining stock,
then carries the cargo home. The shared main and ranges remain until their actual
expiry; ordinary exclusive-resource cleanup thresholds do not apply. Returning
parties do not count as occupants. A retry, late tick or fresh database pool
cannot reserve troops or fund cargo again. Owned imported parties can adopt a
checkpoint from their actual saved army, collection clock and reserved troops.
An unknown foreign checkpoint requires its owner's recovery before another
party can safely reschedule it; a read does not assume its economic history.

Extra rewards preserve `on_event2.k5/k6/k7` periods, stochastic partial periods
and weighted identities. The native return path selects the first Java hash-map
reward identity and awards the total count; this behavior is preserved even if
the configuration contains distinct identities. Independent reward draws are
pinned in the party checkpoint at departure and funded once on return. Native
`plunderRes` retains resource entries and the actual reward identity/count
records. The standard progression reward resolver supplies the assets; no
synthetic item, victory or casualty is produced.

`resource.new.detail` returns native integer `existMember`, integer `maxMember`
and the `army` member array. It reconciles only the stored party counter with the
actual occupied parties. Member identities, troop levels/counts, profile fields,
companions and travel timestamps come from saved owned records. The map supports
both 37 and 38, and gathering views expose native quantity, float speed, long
start and deadline, remaining stock and saved collection fields. Reconnect
quantity uses the persisted occupation deadline rather than an invented zero
collection period. The command uses the existing mutation receipt and outbox so
a factual counter repair remains atomic and retryable.

PostgreSQL acceptance covers concurrent admission, peer deadline contraction,
full-node returns and mail, native member fields, fresh-pool completion, stock and
troop conservation, once-only item rewards, recall deadline expansion, forced
peer-write rollback, counter reconciliation and imported-party clock/load
recovery. The existing ordinary march, companion and treasure regressions remain
required. There is no new schema, dependency or environment variable. Combat
admission, foreign-world deployment and special resource actor engines retain
their own validation requirements.
