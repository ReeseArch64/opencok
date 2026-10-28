# Persistent mutation foundation

Topic 9 migrates the persistent-mutation foundation from the read-only Java
reference to the PostgreSQL realm architecture. It supplies reusable command
receipts, atomic credit/debit postings and outbox records, plus runtime transaction
fencing. It does not migrate the business rules of future construction, rewards,
combat or payment commands.

## Legacy audit and compatibility

The audited reference lives under ignored `data/reference/server/modules`.
Private source remains read-only and is not included in this document or commits.

| Legacy component                                               | Observed responsibility                                                                                             | Maintained replacement                                                                         |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Gameplay `SqlSessionWrapper`                                   | Delegates commit/rollback to MyBatis sessions                                                                       | Drizzle/PostgreSQL transaction commits all participating state and records                     |
| Gameplay `RequestHandler` and server-core `ClientMsgCatchList` | Uses `_cok_` to return a session-cached response before running a handler; cache may be disabled and is not durable | Owner/request-key receipt stores command, exact request bytes and exact response bytes         |
| Gameplay `AbstractClientRequestHandler` and `ConcurrentLock`   | Synchronized-command/session properties and process-local user/cross-move locks                                     | Persisted realm epoch and database row locks held through commit                               |
| Gameplay `ActionCostRecord`                                    | Records action cause and serialized cost/reward categories in monthly tables through a separate mapper call         | Typed asset, before/after and signed bigint delta in the same transaction as state and receipt |

This is an independently authored replacement, not a claim that the Java already
provided durable idempotency or persisted owner epochs. The audited paths contain
no equivalent common epoch fence. Existing domain-specific receipts, nickname
compensation arithmetic and legacy log readers retain their contracts. Historical
monthly logs are not imported or rewritten as authoritative ledger entries.

The client wire protocol is unchanged. The foundation does not automatically turn
all legacy `_cok_` values into durable keys: each migrating domain must define the
identity and canonical payload of its operation. Session-local identifiers are not
safe global retry identities unless namespaced by a durable session/operation ID.

## Transaction and receipt contract

`repositories/mutation.createMutationExecutor` takes the authenticated owner,
request ID, command name, immutable request bytes and a trusted transaction
callback. The realm authority supplies the realm and epoch; callers cannot select
a different realm through the command. The owner must exist in that realm and not
be banned. Payload limits are 64 KiB for the request, 1 MiB for the response and
256 postings/events per operation.

The lock order is realm authority shared lock, owner profile update lock, then
owned domain rows. A receipt key consists of realm, owner and request ID. A
matching command and byte-identical request return the saved response without
calling the mutation planner. Reusing a key for another command or payload fails.
The caller must canonicalize requests before admission; semantically similar but
differently encoded payloads are intentionally distinct content.

State changes, response receipt, ledger postings and optional outbox events share
one physical PostgreSQL transaction. Failure in any write rolls back all four.
The callback receives the transaction and must use it for every owned write; do
not use the root pool or make external calls inside it. Callback exceptions and
validation failures are not committed receipts. No automatic retry reruns an
arbitrary callback after an ambiguous commit. Retry the same key and bytes through
the executor; a persisted receipt resolves the uncertain result.

Responses are bytes so SFS longs, floating values and field order need not be
converted through JSON. Input and response buffers are copied. Cross-player
transactions are not exposed by this first executor; a domain requiring them
must define participant lock order and authorization before extending it.

## Economy and live adoption

`repositories/economy-mutation.createEconomyMutationExecutor` locks the existing
profile and resource rows and presents an immutable bigint balance snapshot to a
trusted domain planner. It supports the six existing profile gold pools and the
bound/unbound wood, stone, iron and food fields. It does not create a parallel
wallet or expose an arbitrary credit/debit command to clients.

A plan supplies explicit asset, signed delta and cause, plus response and optional
events. Each asset appears at most once per operation. The adapter updates the
materialized balance and writes its matching posting atomically. Balances must
remain between zero and signed-int64 maximum; arithmetic never passes through a
JavaScript number. Domain rules remain responsible for eligibility, prices,
platform-specific pool order, resource caps and whether a credit is authorized.
Nullable legacy pool values are interpreted as zero, matching existing balance
projection conventions. This adapter does not silently reinterpret existing
nickname signed-overflow compatibility rules.

The current reconnect resource-settlement path adopts the common records. Each
settled interval uses `settlement:<from>:<to>` under `resource.settle`, preserving
its existing checkpoint, resource-settlement row, troop changes and business
calculations. Food and bound-food before/after postings commit with the checkpoint
and receipt. Zero-delta postings preserve evidence of an evaluated interval;
replaying an already settled interval cannot debit again. Existing historical
balances are the opening baseline; the new ledger is not a reconstruction of all
previous spending. Future consumers must reconcile from that baseline plus their
own confirmed postings.

`RealmDependenciesLive` exposes `mutations` and `economy` for trusted application
use cases. No new public game command is registered. The lower-level
`appendMutationRecords` supports domain transactions already holding their owner
lock, as reconnect does; it does not independently authorize arbitrary balance
writes or verify a caller's declared before/after values. Economic callers should
use the balance adapter or a domain implementation that proves those values.

## Ownership and failure ordering

The realm acquires its ZooKeeper ephemeral ownership before incrementing the
persisted PostgreSQL epoch. Runtime composition then installs the transaction
fence before starting mail relays and serving requests. Existing current-realm
repository write transactions consequently share the same fence, including
preferences, mailbox, nickname, avatar and reconnect operations.

Every participating write transaction verifies realm, epoch and instance under a
shared authority-row lock before domain work, and checks local coordination
readiness again before commit. A replacement epoch needs an exclusive update and
therefore waits for an already fenced transaction to finish. After takeover,
old-epoch transactions fail before writes. Coordination loss observed before commit
rolls back the operation. A successful transaction ordered before takeover remains
valid; this is not instantaneous cancellation of a COMMIT already accepted by the
database.

Root insert/update/delete builders on the guarded realm database are rejected;
writes belong inside a transaction. Explicit read-only transactions remain reads,
and PostgreSQL rejects attempts to write through them. This is an application
protocol, not a defense against a database administrator or arbitrary SQL through
an independently acquired connection. Global/API/Chat writers, operator scripts
and offline migration connections retain separate authority protocols. Deployment
must drain older binaries that do not participate in fencing. PostgreSQL ownership
checks do not turn cross-database nickname coordination into a distributed atomic
transaction.

## Outbox delivery

`relayMutationEvent` selects one pending event, verifies current authority,
publishes outside the database transaction with a three-second deadline, then
acknowledges in a new fenced transaction. The publisher receives realm, owner,
request ID, event ID/type and payload. Receivers must deduplicate that full event
identity. Delivery is at least once: loss of remote acknowledgment, concurrent
relays or takeover before local acknowledgment can repeat publication. An expired
publisher promise may still finish remotely; it cannot acknowledge the event in a
stale realm transaction.

The foundation intentionally does not start a generic remote publisher without a
domain-owned destination. Existing domain relays remain in use. An integrating
domain must supply its transport, idempotent consumer and retry scheduling. Outbox
payloads must contain no session tokens, secrets or unnecessary player data.

## Activation and recovery

Apply kingdom migration `0013_mutation_foundation` to each configured realm before
starting this server. Global schema and protocol do not change. Startup checks the
three new tables. The migration is additive and requires no player reset. Drain
old realm processes, migrate, then start one owner per realm with the existing
ZooKeeper/PostgreSQL configuration. No new environment variable or third-party
library is required.

Back up realm state, command receipts, postings, outbox and authority together.
After uncertain commits, retry or inspect the receipt on the writer database;
never issue a new key merely because the response was lost. On restart, acquire a
new epoch and reconcile pending domain operations. Restore only while all old
writers are stopped; preserved instance identity plus monotonic epochs protect
participating processes, not an independently restored database served alongside
its old writers.

Receipts, ledger and events currently have no automatic pruning. Retain receipts
for the full allowed retry period and retain postings for reconciliation/audit;
a future archive policy must define replay tombstones before deleting them. Do
not delete records to make a failed retry appear new. Roll back application code
only after draining writers and preserving the additive tables. Older code loses
the new common accounting/fencing guarantees; do not run it concurrently.

## Verification

The disposable PostgreSQL integration exercises concurrent identical commands,
changed command/content, exact bigint credit/debit, insufficient funds and overflow,
failures at each journal table, competing debits, local coordination loss,
takeover blocked by an in-flight transaction, stale existing preference writes,
lost COMMIT acknowledgment, database restart and two-realm isolation. The real
SFS integration also reconciles reconnect postings and rejects a preference write
from a still-connected server after its persisted epoch is superseded.

Run server units/integrations, Drizzle schema/snapshot/database suites, affected
workspace type checks, root lint and formatting. The standalone mutation harness
has been removed; it is no longer an available verification command. No production
or APK testing is part of this foundation acceptance.
