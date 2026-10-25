# Player progression migration

The authoritative city transaction also owns quest claims, story chapters, daily
quests, alliance daily tasks, and sign-in sequences. Costs, item grants, resource
credits, claim state, operation receipts, and the response commit together under
the existing player lock. Clients select an action or reward; they cannot submit
progress or reward amounts.

Quest progress is derived from owned buildings, research, troop totals, equipment,
player level, and committed actions. Main quests retain the existing reconnect
discovery rules. Story tasks are tracked across chapters while only the current
chapter can be claimed. A chapter reward requires its individual rewards to have
been claimed. Activity daily quests reset at UTC midnight. Alliance daily tasks
use the reference five-minute reset delay. Event-only tasks are excluded when
there is no authoritative event availability context.

Sign-in pins seven reward declarations using the castle level band. Consecutive
days advance within the week; a missed day returns to the beginning of the current
week. Four weeks wrap to the first stage. The separate beginner sign-in stops
after seven claims. Claims compare persisted server timestamps, and operation
receipts protect retries. Main and story reward states remain terminal after
reconnect. Alliance box claims also lock the alliance and enforce its member cap.

The compatibility target is the 12.06.0 command and SFS contract. Automated tests
use synthetic players and bundled maintained catalogs. Native APK execution has
not been verified. Combat, live event conditions, and alliance action producers
must supply their own authoritative action events; no client progress endpoint is
provided.

Deployment uses existing maintained quest tables and requires no schema change.
Back up kingdom state before rollout. Roll back the service version together with
its supported command set; never clear claim rows or receipts when restoring a
previous binary. Replaying an operation must preserve its original response and
must not grant a second reward. Private reference inputs remain read-only and are
not runtime dependencies.

VIP item use and temporary status items run inside the inventory transaction.
VIP and super-VIP thresholds, duration conversion, skill prerequisite trees,
point budgets, reset costs, and saved talent pages use maintained catalogs.
Players can add points to a tree; reducing an allocation requires the paid reset.
Inactive pages do not contribute to effects. Switching pages exchanges the saved
page and the active general's tree atomically. Ownership is checked before any
wallet change. Active status skills retain separate active and cooldown deadlines.

Effect changes settle old resource production and upkeep before replacing the
snapshot, then rebuild future rate schedules. Expiration is evaluated at the exact
server instant, including future-start states. Production schedules contain the
expiration boundary, so recovery does not apply today's rate to yesterday's time.
Stored bonuses remain source data; no second materialized bonus is added to player
attributes. Running activity deadlines remain pinned to their start calculation.
Harvest talent rewards use the economy port and their persisted cooldown.
Targeted combat, world-resource placement and dragon-specific active skills remain
with their owning systems and reject when that execution path is unavailable.

Equipment and workshop commands use the same player receipt and inventory ledger.
Crafting consumes catalog materials and any required parent equipment before
pinning the result, its random properties, and its finish time. Replaying the
operation or recovering the queue keeps that result. Equipment ownership,
character/general level, general state, and slot exclusivity are checked before
wearing or removing a piece. Equipped pieces and unfinished crafts cannot be
consumed by dismantling. Strengthening and reforging pay their catalog costs even
when a probabilistic upgrade fails. Set extraction requires owned, unused pieces
from distinct slots; selecting a permanent bonus requires the corresponding two,
four, or six consumed pieces.

Workshop jobs retain their ordered waiting list in the maintained material queue.
Completion credits the item and creates the next activity in one transaction.
Recovery processes overdue jobs in order. Existing completed, unharvested queue
positions are credited during import without consuming materials again. Material
acceleration uses its catalog price and persisted daily limit. The native harvest
command remains accepted; the authoritative worker can deliver finished items
before that command arrives, as it does for the other migrated queue domains.

Main quests, production collection, inventory use/composition, building/research
completion, military completion, and equipment/workshop actions feed server-owned
progress. Old completions cannot increment a newer daily period. Completed alliance
daily tasks still awaiting collection produce reward mail in the same transaction
that replaces the old list. Reward amounts are pinned in the mail; the existing
mail-claim transaction protects subsequent collection against duplicates. No client-supplied
counter, random outcome, or drawing-time bonus is authoritative. Target-specific
combat active skills, event availability producers, and a native APK playthrough
remain outside this server acceptance evidence.
