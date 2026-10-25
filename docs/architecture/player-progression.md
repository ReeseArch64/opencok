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
