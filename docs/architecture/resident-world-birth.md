# Resident world birth

Source `WorldBornManager` uses the maintained `resdential` priorities 43000–43097
and the successive `worldmap_num` limits. Initial character placement and lost
city recreation require native four-cell footprints on space terrain (grid type
2), with secondary terrain type zero. Birth areas use `worldmap_city.k1` and the
source x-major area numbering. A priority can contain multiple birth areas; a
footprint must fit the currently admitted area set.

The private `trigger_var` identity `type=-1`, `uid=@world:0`,
`key=opencok.world.birth.v1` owns versioned birth state. Its JSON schema retains
the priority, limit round, phase, current limit, owning epoch and process-local
area counters. This identity is separate from player variables and is never
projected through native campaign variable lists. No schema migration or new
dependency is required.

`initializeWorldBirth` is the fenced fresh-world import callback. It requires no
existing birth state, player profiles or resident cities and writes the initial
43000/round-1/limited phase in the importer's transaction. Import rollback also
rolls back birth initialization. It never resets an existing realm's state.
Source inputs remain read-only and neither XML terrain nor private source is
stored in this record.

Source `updateRedis` persists only the priority, round and phase. Source
`readAreaPriority` rebuilds counters from current saved cities at startup;
allocations increment the in-memory counters until the next startup. Therefore
an owning epoch change can reconstruct factual occupancy without inventing
historical allocation totals. An imported realm without known source phase still
needs explicit operator adoption; an absent phase is not evidence of a fresh
realm. Birth allocation and explicit operator adoption use this state contract.

`allocateWorldBirth` supplies initial provisioning and lost-city recreation in
the same fenced transaction as the actual city. Each candidate must contain four
free source-native cells on space terrain, with matching coordinates, admitted
birth areas and no owner, reserved terrain or secondary obstruction. The source
priority advances when the current group reaches its saved process limit or has
no complete footprint. Exhausted configured regions fall back to the source
all-map search phase. A partial or ambiguous footprint never overwrites another
actor to satisfy a placement.

Regional candidates come from the source birth rectangles and use bounded
primary-key lookups. A normal maintained priority spans at most 14,400 tiles;
it does not scan the whole terrain for each placement. The source all-map phase
remains a deliberate wider search after configured regions are exhausted.
Allocation version, counters, footprint, profile identity and normal operation
receipt commit or roll back together. Startup ownership changes rebuild factual
current city counts before the next allocation; they retain the known priority,
round and phase. Concurrent retries cannot consume another birth allocation.

Random teleport uses the same owned allocator with the source random-priority
selection, then circularly searches configured groups before falling back to
normal birth selection. A successful random-region move increments its area
counter without advancing the initial-birth priority. Directed teleports retain
their explicit destination and do not claim an unrelated birth allocation.
Failed item or gold costs roll back the allocation and its counter.

Imported realms without a known birth phase fail these allocation paths before
charging or creating a city. The operator can inspect saved state without
acquiring a writer epoch:

```sh
bun --no-env-file apps/server/scripts/world-birth.ts inspect 1
```

To adopt a verified source priority, round and phase, stop the realm worker and
use the `adopt` command with an operator, reason, expected version (`missing` for
an absent state), the three source values and a stable operation ID. Phase 0 is
limited configured regions, phase 1 is unlimited configured regions and phase 2
is the all-map fallback. The following explicitly declares a future all-map
policy for a legacy realm; it does not claim to recover an unknown historical
source phase:

```sh
bun --no-env-file apps/server/scripts/world-birth.ts adopt 1 operator \
  "Declare all-map birth policy for this legacy realm" \
  missing 43000 1 2 legacy-birth-policy-v1
```

Use the existing `DATABASE_ROLE=kingdom` and `DATABASE_URL` configuration for the
chosen realm database. Adoption acquires an authoritative operator epoch; restart
the realm worker afterward. A realm mismatch, stale version, changed replay
request or missing authorization leaves the birth record unchanged. Adoption
records the operator and reason through a durable command receipt and derives
counters from current saved cities, rather than accepting an invented history.
The native client has no adoption command or private-state projection.

PostgreSQL acceptance covers regional priority transitions, allocation rollback,
concurrent creation receipts, stale owners, counter reconstruction, guarded
adoption and the real operator CLI. Native process recovery, recreation and
geometry checks exercise the shared allocation ports. No additional schema or
runtime dependency is added.
