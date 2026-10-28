# Timed activity queues

Queues owns the shared persisted activity lifecycle, deadline discovery and scoped
dispatch contracts used by the realm and Scheduler. This is the existing queues
workspace populated for [#699](https://github.com/ReeseArch64/opencok/issues/699)
under #558 W16. Player missions remain in Tasks; transport/outbox queues and their
Workers are separate responsibilities.

The realm owns all authoritative completion, refund, reward, production, ledger,
receipt and outbox writes. Scheduler reads scheduling metadata and requests an
owned transition. It does not receive the realm epoch, gameplay write credentials,
Rules catalog or authority to complete an activity itself.

## Supported activity families

The first process group covers every type currently registered by the city
activity domains:

| Domain owner | Queue types               | Authoritative behavior                         |
| ------------ | ------------------------- | ---------------------------------------------- |
| Building     | `0`                       | Construction and its existing completion hooks |
| Troops       | `1`, `8`, `9`, `10`, `17` | Training and the existing queued continuation  |
| Troops       | `2`                       | Fortifications                                 |
| Troops       | `3`                       | Hospital healing                               |
| Research     | `6`                       | Ordinary research                              |
| Equipment    | `11`                      | Equipment crafting                             |
| Equipment    | `12`                      | Workshop production                            |
| Research     | `19`                      | Civilization research                          |

The owner advertises its actual supported types through the deadline capability
operation. Unsupported persisted types remain untouched. A city domain that has
`types=[]` is not part of this scheduling mechanism merely because it has a
calendar or a time-dependent command. The [remaining W16 register](../../apps/scheduler/README.md#remaining-deadline-groups)
records those separate families.

## Durable facts and owner validation

`timed_activity` carries activity identity, queue, owner, type, version, status and
deadline. Starting, accelerating, cancelling and completing work retain their
existing atomic owner transaction. The historical `queue` row remains the native
queue projection. Existing active legacy queues without a registered activity
are discovered separately and restored through the same owner workflow; discovery
never inserts or rewrites them.

Finish requests pin activity ID, queue ID, owner, type, version and deadline.
Restore requests pin queue UUID, owner, type, item and original start/update
timestamps. The owner checks the saved fingerprint while holding the activity
aggregate locks. A stale snapshot, reused queue or changed generation cannot
become a request to act on the newer state.

Strict recovery checks use the owner's captured clock and current locked state.
They reject early wakeups and preserve earlier due activity ordering for the same
owner. Equal-deadline ordering follows the executor's PostgreSQL-ordered activity
snapshot rather than a separate JavaScript string comparison. Preparatory
production writes may precede the guard inside that transaction; a rejection rolls
back those writes too, and domain completion/economic commit occur only after
validation. Client commands retain their existing timing grace; introducing Scheduler
does not silently change mobile completion timing. Reconnect and foreground
reconciliation continue invoking the owned recovery transition.

The application operation identities remain `finish:<activityId>:<version>` and
`restore:<sha256>` over queue UUID, owner, item, start and update timestamps joined
by colons. The original inner SFS command/request bytes and receipt identity are
preserved. HTTP correlation IDs identify individual dispatch attempts; they are
not new economic operation identities and do not authorize rerolling a result.

## Internal dispatch contract

Exact `POST /_internal/activity-deadlines` carries contract version 1, realm,
request ID and one operation: capability discovery, restore or finish. Deadline
instants use canonical decimal strings in JSON and bigint internally, preserving
nonnegative instants below the signed-64 idle sentinel. Validators bound identifiers/types and reject extra/missing
fields, malformed times and incompatible versions. Response correlation must
match the requested operation, realm and request ID before it is accepted.

The result vocabulary is `applied`, `obsolete`, `not_due` and `blocked`.
`obsolete` describes an authoritative stale-generation outcome, not permission to
delete the scheduler's source row. `not_due` and `blocked` retain pending work for
a later pass. A transport timeout is an uncertain outcome; discovery retries the
same durable operation against the owner. The owner deduplicates committed effects
before acknowledging. No exactly-once transport is claimed.

The [Scheduler guide](../../apps/scheduler/README.md) specifies authenticated
transport, discovery fairness, operational bounds, access provisioning and
cutover. Native SFS responses remain owned by existing domain/transport adapters;
this internal endpoint is not a generic gameplay command proxy.
