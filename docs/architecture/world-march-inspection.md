# Resident march inspection

Reference `World.GetMarchRecord` permits `world.get.march` with another resident's
`uid` when both profiles share a nonblank alliance or the observer has an actual
`ObUser` record. `UserProfile.isOb` tests that record's presence. The maintained
foreign-owner branch now uses a repeatable-read, read-only PostgreSQL snapshot
and retains this permission check before loading the party. An empty alliance
does not grant access. A mismatched party owner, missing profile, foreign-world
party or absent target cannot authorize a substitute record.

The supported resident parties are actual ordinary resource/shared-resource and
treasure marches, and trouble-delivery marches. `WorldMarch.toMarchArmyObj` and
`WorldMarchGeneralArmy.getInfo` define their wire projection: native identities,
party type/state, actual soldiers and companions, long start/end timestamps,
float collection speed, target type and integer collection maximum. Resource
load uses the established owner effect resolver, saved soldier load modifiers,
resource weights and actual return cargo. A collecting resource party's displayed
end timestamp uses the Source per-load calculation; the read does not replace
its shared scheduler deadline or settle overdue cargo.

The route bypasses the caller's city mutation domain. It does not normalize a
city footprint, adopt a party checkpoint, grant an item, return troops, repair a
counter or enqueue a notification. Imported ordinary parties remain readable
from their actual saved army and target without an invented checkpoint. The
observer role is read from the existing table; no player command grants it.
Cross-world actors, siege `msFlag`, combat teams, occupied battle buildings and
member arrays retain their separate actor and permission requirements. They
cannot be inferred from an ordinary party or an observer flag.

Native `Soldier.level` is a saved star level rather than the troop's later city
level. The march decoder preserves that field when the Java descriptor provides
it. New maintained party snapshots save the actual owned level at departure, and
native owned detail, shared-member detail and foreign inspection prefer it.
Older maintained snapshots that omitted the field retain their existing current
owned-level fallback; a read does not claim to reconstruct a lost historical
star value. The resource-only army decoder keeps its existing shape.

PostgreSQL acceptance covers same-alliance permission, persisted observers,
foreign and blank alliances, missing and mismatched parties, overdue read-only
inspection, imported snapshots, current resource load and return cargo, native
field types and a departure star level distinct from the current city level.
Snapshots of parties, troops, points, checkpoints, command receipts and outbox
remain identical across a successful inspection. Synthetic native serialization
and maintained-snapshot cases verify saved troop levels and backwards-compatible
resource decoding. No schema, dependency or environment variable is added.
