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
realm. Birth allocation and adoption integration are a separate followup to this
initial state contract.
