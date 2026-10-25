# Hero and general progression

Topic 22 uses the authoritative city transaction introduced for construction,
research and military progression. Native commands select owned entities and
catalog operations. Inventory costs, reward quantities, random outcomes,
cooldowns, assignment changes, production settlement, command receipts and
responses commit together under realm fencing. Repeating an operation ID returns
the original result. A different request must satisfy the current business state.

The old `user_general` model remains separate from the numeric `new_general`
roster. Old generals retain their talent bytes and follow the lord's level.
Defense replacement swaps two owned records and preserves the three-position
limit. Dismissal cannot remove a marching general or the final profile general.
Tavern picks consume persisted offers, and an internal recruitment operation
claims a revealed offer once. The reference's test-only level-up handler is not
exposed as a player command.

The new roster supports fragment purchases, recruitment, building-based unlocks,
experience items, breach gates, stars, basic skills, talent prerequisites and point
budgets. The hero building limits the roster. Civilization recruitment checks the
current civilization and prestige. Item experience consumes only the items used
before the next progression limit, without changing the lord's experience.

Refinement stores applied properties separately from proposed properties. Value
rolls preserve the applied bonuses until confirmation through the native
`refinerollback` action. Type changes preserve each property's relative value;
locked slots retain their types. Free value rolls reset at UTC midnight. Native
batch values greater than one select ten paid rolls and require the corresponding
feature and active premium status. Both single and batch outcomes are persisted
in the same receipt as their costs.

Active skills validate learned ownership, replacement skills and cooldowns before
applying effects. Supported reference branches grant temporary general/player
statuses, resources, troops, catalog rewards, equipment/research acceleration,
world resources or a duration marker. World resource placement locks distinct
empty eligible tiles in ID order; an occupied target rolls back the entire skill.
Queue acceleration advances the authoritative activity version and deadline;
normal activity recovery remains responsible for granting completion rewards.

Garrison changes preserve one occupant per owned building and reject movement
while its relevant queue is occupied. Offices enforce castle, lord and prestige
requirements, with one hero per position and one position per hero. Office
experience advances a persisted checkpoint only for credited whole experience,
retaining the remaining time. Changing an assignment settles production before
rebuilding its future schedule. General status expiration retains the reference's
inclusive endpoint and therefore changes production at `endTime + 1`.

Read-side general skill, equipment, refinement and building rules remain the
source of bonuses. No second attribute cache is applied. March departure and
return expose transaction plans; combat receives an immutable effect snapshot
with conditional faction bonuses and school-field modifiers. Capturing a hero
removes its city assignment and equipment bindings. Prison operations lock the
captured record and verify its current captor and realm. Release and suicide
cannot overwrite one another after a concurrent ownership change. Login repairs
missing-building/march assignments and restores completed revival/home timers.

The hero turntable preserves daily free draws, pinned item outcomes and bounded
notice history. The older `herodraw` event preserves tier tickets, cooldowns,
discounts, scores and terminal score-reward claims. Local ranks derive from the
persisted event period; global ranks consume the existing bounded
`GOLD_WHEEL_RANK_` publication. Producing cross-realm rankings and running combat
remain responsibilities of those systems, rather than client-authorized general
commands.

Compatibility targets the 12.06.0 SFS fields and native action spellings. Current
maintained catalogs provide the hero turntable and modern weighted general pools;
the older event implementation expects a different pool declaration containing
its costs and item arrays. It rejects incompatible declarations and closed event
periods. It does not infer missing probabilities, extend expired events, or
fabricate old tavern distributions. Existing legacy tavern offers remain usable.
A compatible maintained declaration is required before enabling those older draw
paths. Native APK execution and a complete combat session have not been verified.

No new dependency or schema migration is required. Keep the original reference
inputs read-only. Back up realm state before rollout, retain receipts together
with inventory postings, and never clear cooldowns, claims or draw state to retry
an operation after rollback of application code.
