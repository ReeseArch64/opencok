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

## Hua Mulan infantry content

Hua Mulan occupies the previously incomplete general 53571; 53572 and 53573 remain
reserved. The maintained `general_base`, `general_skill` and `general_ab` catalogs
define her existing fragment 213293, five star skills 54228–54232 and 60 talents
53571100–53571159. Recruitment requires 3,000 fragments. Existing star costs and
skill-book 211453 consumption remain authoritative; no account receives a hero.

Her base skills unlock at stars one through five. Formation grants infantry
health and attack (50% at level one, 470% at level fifteen). Basic attack grants
10–80 points, damage grants 50–260%, striking distance grants one at its single
level, and basic puncture grants 10–80 points. Effects target infantry variants:
1051/1052, 1011/1012, 1321/1322, 1061/1062, 406/407 and 6631, consumed through
the existing combat snapshot pipeline. Basic attack and puncture retain their
native flat units; striking distance remains a distance rather than a percentage.

Three talent trees, abilities 41020011, 53571201 and 53571202, contain 20 nodes
each, arranged in 12 rows with native columns 2, 4 and 6. Two- and three-way
branches reconverge on central nodes; completing either predecessor unlocks a
merge, consistently with native rendering and the server prerequisite rule.
Vanguard emphasizes health/basic attack; Offensive emphasizes attack/damage;
Spear emphasizes basic puncture and two single-level striking-distance nodes.
All nodes have maximum level 1 or 10. Percentage talent maxima scale from
50% to 500% by depth; increments are 5–50% per point. Flat basic attributes use
the same numeric range in their native units. Nodes unlock through level 96.

The 58 ten-level nodes and two one-level nodes accept 582 points. Hua Mulan's
catalog sets `talentPointDivisor=10`, yielding 564 spendable points at level 99
from the existing 5,640-point level catalog. The general rule floors the divided
cumulative point total, preserving consistent experience gains, recruitment and
talent resets. Other heroes retain the default divisor of one. No shared level
catalog or player record is changed. The general level cap remains 99; unlearned
talents correctly show zero current contribution.

The private Android patch `data/android/patches/033-hua-mulan` changes this
hero's definitions, fragment presentation, new localized strings and supporting
rendering. Other heroes use client `type=0` and `color=0` for white rarity;
the list cell displays the Legendary ribbon only for 53571 while preserving
combat/development/support subtype icons. Existing player rows and other hero
gameplay definitions are unchanged. It rebuilds and verifies all 807 database
SPD byte ranges. Both main
and Green locale INIs receive the strings; the Lua language adapter resolves the
new hero's keys even when an older native language cache remains active. The
hero's talent popup parses fractional scalar bonuses without truncating them.
Original APKs, artwork, signing identity and other reserved heroes stay unchanged.

The versioned CDN bundle `dr_newHero1.0.94_android.zip` retains original resources
and extends the shared head atlas with hero_head_72, card_72 and hero_body_72.
The body deliberately uses the already loaded `newHero_head` resource, since the
native loader did not install a newly named body atlas during device verification.
The RGBA PNG and Cocos2d plist format-2 atlas preserve the established 640×1136
body and 104×124 portrait sizes. Verify its MD5 against
`HERO_RESOURCE_ANDROID_MD5` before recreating the server. Install the matching
split with the existing base APK and signing identity without clearing app data.
Rollback restores the prior server artifact and retained before-split; retain
versioned CDN archives. Full combat balance requires gameplay evidence.

Device comparison with the adjacent Kevin hero established that the initial full-body
framing made Hua Mulan appear too small. Bundle 1.0.94 doubles her artwork scale,
centers the face and crops the outer weapon/legs inside the same 640×1136 frame.
Her portrait, gameplay values and APK remain unchanged.
