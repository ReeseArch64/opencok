# Timed activity Scheduler

Scheduler discovers persisted activity deadlines and requests their completion
from the current realm owner. It implements the first W16 group in
[#699](https://github.com/ReeseArch64/opencok/issues/699), under
[realm authority design](../../.github/ARCHITECTURE.md#9-authoritative-server-zookeeper-and-scaling).
The [Queues package](../../packages/queues/README.md) defines the twelve supported
activity types, existing operation identities and versioned dispatch contract.

The realm retains every gameplay write and its existing transaction fence.
Scheduler has restricted read-only access to scheduling metadata and a dedicated
realm dispatch credential. It loads no gameplay Rules catalog, shares no
RealmAuthority token and requires no Redis connection. Reconnect and foreground
reconciliation remain local to the realm even when background discovery runs in
this process.

## Discovery and durable recovery

The two sources are supported active legacy `queue` rows without a matching active
registration, and supported due `timed_activity` rows. Capability discovery comes
from the owner rather than an independent copy of its domain roster. Scheduler
requests restoration before normal registered completion; the owner revalidates
the exact saved fingerprint before changing anything.

A wakeup carries the expected activity generation, version and deadline. The owner
validates current locked state, actual due time and earlier activity ordering.
Preparatory settlement remains inside that same transaction and rolls back if the
locked guard rejects the request. The existing owner transaction commits state,
ledger, receipt and outbox together.
Duplicate discovery, lost HTTP acknowledgment, reconnect and replacement of the
scheduler process therefore converge on the same owned transition. Failed or
unsupported work remains in PostgreSQL. There is no transient timer per player and
no independent scheduler grant or completion implementation.

A normal pass reads at most 64 legacy and 64 due candidates by default. Legacy
rows keep UUID order; due rows keep `(dueAt, id)` order across types. A finite
upper bound and captured due-time horizon let the scan finish despite a growing
tail. Every eighth pass retries the head without advancing the active horizon.
Changed owner capabilities reset the horizon. Default admission permits four
attempts per owner across both phases; skipped, failed and blocked candidates
remain persisted for a later pass. Dispatch is sequential, so one slow request
can delay the pass up to its configured timeout. These bounds prevent unbounded
admission; they do not promise a fixed worst-case latency for an arbitrary backlog.

Health discovery counters describe the latest completed pass, not cumulative
throughput. Backlog observations read at most 1,001 candidates per phase; a true
`legacyLimited` or `dueLimited` means the reported count is a lower bound. The
oldest due age describes supported registered activity, not every gameplay timer.

Scheduler readiness must be distinct from process liveness and queue exhaustion.
A healthy process may have overdue work because an owner is unavailable, a request
is blocked by earlier work or a domain remains unsupported. Observe deadline
lateness, backlog and per-result/failure behavior together; an HTTP success alone
does not establish that all pending work completed.

## Runtime configuration

Start from the repository root with dependencies installed:

```sh
bun --no-env-file apps/scheduler/src/index.ts
```

The application reads the explicit process environment and does not load a local
`.env` file. Required values are `ACTIVITY_SCHEDULER_MODE=external`, `KINGDOM_ID`,
`SCHEDULER_DATABASE_URL`, `SCHEDULER_OWNER_URL` and `ACTIVITY_SCHEDULER_SECRET`.
The owner URL is an HTTP(S) origin with no credentials, query, fragment or path;
the publisher appends the internal deadline endpoint. The database URL must target
`opencok_kingdom_<KINGDOM_ID>` unless `KINGDOM_DATABASE_NAME` explicitly supplies
its deployed name. The protected database binding still decides realm identity.
Only SSL query parameters are accepted in this URL; pool, timeout and connection
settings cannot be overridden through arbitrary URL options.

| Setting                  | Default     | Accepted values                                      |
| ------------------------ | ----------- | ---------------------------------------------------- |
| `SCHEDULER_HEALTH_HOST`  | `127.0.0.1` | Nonempty bind host                                   |
| `SCHEDULER_HEALTH_PORT`  | `18092`     | `0`–`65535`; zero selects an ephemeral test port     |
| `SCHEDULER_TIMEOUT_MS`   | `5000`      | `100`–`30000`                                        |
| `SCHEDULER_POLL_MS`      | `1000`      | `100`–`60000`, delay after the completed pass        |
| `SCHEDULER_POOL`         | `2`         | `1`–`4` PostgreSQL connections                       |
| `SCHEDULER_BATCH_SIZE`   | `64`        | `1`–`256` candidates per phase                       |
| `SCHEDULER_OWNER_BUDGET` | `4`         | `1`–batch size attempts per owner across both phases |

PostgreSQL connections default to read-only transactions. Connection, statement
and client-query timeout use the configured timeout; PostgreSQL 17 transaction
timeout is twice that value. These settings supplement restricted grants rather
than grant gameplay access. Runtime rechecks effective permissions before every
pass, then verifies the current owner's capabilities.

`GET /health/live` reports process liveness; `GET /health/ready` also requires the
latest completed discovery pass to succeed. Both return bounded discovery metrics
and no player identifiers or credentials. Permission/capability/read failures or
failed dispatches make readiness false; `blocked` and `not_due` alone do not.
The health listener uses five-second header/request timeouts and one-second
keepalive. Shutdown stops new work, awaits the admitted dispatch, closes health
connections and releases the pool. Consult the actual stopped event when checking
a supervised shutdown; do not infer transaction completion from an exit code.

## Authenticated owner boundary

The realm and its Scheduler share a distinct `ACTIVITY_SCHEDULER_SECRET` of at
least 32 characters. Use a separate secret for every realm and keep it different
from game, provisioning and Chat credentials. Signed JSON requests and responses
use `X-Activity-Time` and `X-Activity-Signature`, HMAC-SHA256 with a dedicated
protocol/direction/path domain, and a 30-second timestamp tolerance. The publisher
rejects redirects, unsigned responses and mismatched operation/realm/request IDs.
Use synchronized clocks and protected transport between the processes.

The owner admits at most eight requests by default and bounds each request body
to 4,096 bytes. Its response timeout does not cancel an already-admitted gameplay
transaction; that work remains tracked for drain. Replays within the signature
window remain possible and are safe only because the saved generation and existing
economic receipt govern the actual transition. Capability discovery is read-only.
This endpoint cannot dispatch arbitrary SFS commands.

## Permission boundary

The runtime credential reads only these scheduling fields:

| Table                            | Readable columns                                                 |
| -------------------------------- | ---------------------------------------------------------------- |
| `opencok_kingdom.queue`          | `uuid`, `ownerId`, `type`, `itemId`, `startTime`, `updateTime`   |
| `opencok_kingdom.timed_activity` | `id`, `ownerId`, `queueId`, `type`, `dueAt`, `version`, `status` |
| `scheduler_access.binding`       | `role_name`, `kingdom_id`, `database_kind`                       |

The operator-owned binding associates the actual login with a realm/database kind.
A URL or environment label alone does not establish realm identity. Runtime checks
reject unexpected effective grants, writes, role inheritance, ownership or unsafe
schema/function/sequence capabilities in the connected database. The scheduler
cannot read activity payloads, inventory or other gameplay state and cannot write
queue, activity, authority, receipt, ledger or outbox rows.

Administrative provisioning runs separately from the application. PostgreSQL
PUBLIC CONNECT may remain; data-denial tests do not establish network isolation.
Operators must audit other databases' grants and apply connection/HBA/network
policy separately when connections themselves must be denied. The runtime
permission audit covers its connected database, not every database on the cluster.

## Additive discovery index

Kingdom migration [`0045_timed_activity_discovery.sql`](../../packages/drizzle/migrations/kingdom/0045_timed_activity_discovery.sql)
adds `timed_activity_due_cursor(status, dueAt, id)`, matching both forward due pages
and the upper scan bound. It preserves the old due index and every saved row.
The existing migration runner applies a regular, non-concurrent `CREATE INDEX`;
plan the operator-controlled migration window because index construction can block
writes and consumes build resources. The additional index also adds ongoing
storage and write-maintenance cost. Scheduler cannot apply this migration itself.

Disposable PostgreSQL diagnostics use 100,000 activities, including 80,000
sharing a deadline, to inspect the tuple-keyset due-page and upper-bound access
paths. In one before/after migration run, the page changed from 19.550 ms/1,209
buffer accesses to 0.137 ms/6; the upper bound changed from 23.412 ms/1,640 to
0.035 ms/4. These are individual plan observations, not repeated application throughput measurements
or a production capacity claim. The actual migration preserves all 100,000 saved
rows and their aggregate checksum. The inspected legacy query showed no material
benefit from its candidate index, so no legacy index was added.

Apply the migration before role provisioning and cutover, using the existing
Drizzle migration process and operator credentials. Rolling back discovery mode
does not require dropping the additive index or deleting activity state.

## Restricted role provisioning

Run the provisioning command with an operator account against the migrated target
realm database, outside the runtime application:

```sh
bun --no-env-file apps/scheduler/scripts/provision-role.ts
```

Supply `SCHEDULER_PROVISION_ADMIN_URL`, `KINGDOM_ID`,
`SCHEDULER_PROVISION_ROLE` and `SCHEDULER_PROVISION_PASSWORD` through the operator's
secret environment. Role names use lowercase letters/digits/underscores, begin
with a letter and contain at most 63 characters. Passwords contain 24–256 printable
non-space ASCII characters. The provisioner creates a fresh non-inheriting login,
stores a generated SCRAM verifier rather than cleartext in SQL, and grants only
the listed scheduling columns. Existing role names fail; rotate with a fresh name
and verify permissions before switching runtime credentials.

The access schema and binding table must remain operator-owned. The binding
must be an ordinary table without row-level security. Role creation, binding and grants commit in one
transaction. A provisioning failure must be investigated by the operator; the
application neither provisions itself nor repairs grants at startup. Administrative
environment variables do not belong in the runtime container.

## Cutover and rollback

Deploy matching realm/Scheduler protocol support while the realm still uses local
background discovery. Provision the restricted role and distinct realm signing
credential separately; never pass an administrative URL or general gameplay
credential to Scheduler. Keep every existing queue, activity, receipt and outbox
row. This switch does not convert player identities or native queue payloads.

For one controlled realm, stop and drain its old global discovery loop, select
external background discovery and start the matching owner/Scheduler pair. Verify
permission checks, capability agreement, owner readiness, backlog progress and
actual deadline lateness. Foreground/reconnect recovery remains enabled on the
owner; it is not a competing implementation of completion.

For rollback, stop admission and drain Scheduler before restoring local background
discovery. Retain matching owner protocol support and all durable state. An
interrupted or timed-out dispatch may already have committed; recover through the
same idempotent owner transition rather than deleting deadlines, resetting a queue
or issuing another reward. The [Compose overlay](../../infra/compose/README.md#opt-in-timed-activity-scheduler)
provides an explicit one-realm rollout recipe. No production deployment is performed
by this change.

## Remaining deadline groups

This first group is complete only for the twelve registered timed-activity types
and their legacy restoration. W16 as a whole remains incomplete:

| Group                                  | Current source/owner                                                             | Remaining boundary                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Alliance research                      | `AllianceScienceRecoveryReader`, alliance upgrade state and `alliance.tick`      | Versioned research/acceleration snapshot and owner dispatch                                         |
| Marches and gathering                  | `WorldMarchRecoveryJob`, `world_march_checkpoint`, existing realm world workflow | Expected checkpoint/generation, ordering and economic participant protocols; W18 remains separate   |
| World population and expiry            | `WorldPopulationJob`, World clocks and resource/monster repositories             | Discover persisted work without moving generation, occupancy or claims into Scheduler               |
| Totems and temporary effects           | Totem activations, player effects, skins and production boundaries               | Versioned expiry with correct production settlement and overlap ordering                            |
| Hero/Expedition calendars and matching | Owned calendar, matching and phase Services/stores                               | Persisted discoverable phase facts; current `refresh()` methods also write state                    |
| Ranking/event finality and awards      | Hero, Expedition stages, Continued Cost, Gold Eggs                               | Separate deadline discovery from authoritative closure, funding and once-only delivery              |
| Olympic, Cup and GroupBuy              | Existing calendars/settlement readers and domain commands                        | Explicit period/round generation and guarded owner settlement                                       |
| Campaigns and red packets              | Merge campaign clocks and red-packet expiry stores                               | Discover expiry without moving refunds, mail creation or effect changes                             |
| Integration retries and publication    | Mail/avatar/outbox, special purchases, online notifications                      | W15 worker or gateway delivery responsibilities; do not classify every timer as gameplay scheduling |

This register identifies the maintained families inspected for the first slice;
it does not claim a complete file-level inventory of every catalog or stored time
column. The umbrella's broader ownership inventory, remaining W16 families and
W17/W18 authorities must be verified separately before #558 can close.

## Verification scope

Use synthetic data, migrated disposable PostgreSQL and actual signed HTTP/process
boundaries. Required scenarios include all supported types, restored legacy rows,
reordered/stale/early wakeups, cancel/speedup races, concurrent reconnect, owner
replacement, crash after commit, two realms, slow/failing work, fairness, drain and
permissions. Compare current local and isolated discovery against the preserved
parent behavior and report aggregate process/pool costs and timing limitations.
The [benchmark recipe](BENCHMARK.md) specifies the archived-parent adapter,
identical workload and instrumentation limits. Native-device rendering and
production capacity are separate verification. Nine balanced benchmark trials
produced identical saved outcomes without demonstrating a latency, CPU or memory
benefit; isolated discovery adds process/connection cost. See the recorded results
and instrumentation limits in the benchmark guide.
