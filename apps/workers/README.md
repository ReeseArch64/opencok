# Mail integration workers

`apps/workers` runs committed mail integration delivery in its own Bun process,
with one configured realm queue and a separately restricted global projection
connection. It implements the first W15 integration boundary under
[realm authority design](../../.github/ARCHITECTURE.md#9-authoritative-server-zookeeper-and-scaling).
The realm remains the sole gameplay writer. This application acquires no
RealmAuthority token, loads no Rules catalog, connects to no Redis instance and
cannot grant rewards, change inventory or settle world activity.

The [Mail domain](../../packages/mail/README.md) owns the unchanged gift-opening
and Chat intent relays plus their bounded polling Service. Application composition
supplies the actual PostgreSQL clients and signed Chat publisher. The process
entrypoint uses the existing Effect runtime and telemetry lifecycle. This slice is
tracked by [#697](https://github.com/ReeseArch64/opencok/issues/697), under #558.
With the validated worker environment supplied, start it with
`bun run --cwd apps/workers start`; the entrypoint does not load a local env file.

## Owned effects and durable delivery

| Responsibility           | Effect and boundary                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| Realm gift-opening queue | Read/lock committed `mail_gift_opening` rows and acknowledge them after the global commit           |
| Global gift projection   | Update only `mail_gift_log.isOpened` and `receiveTime`, matched by mail ID, send time and recipient |
| Realm Chat intent queue  | Read/lock committed `mail_chat_read_intent` rows and acknowledge after signed HTTP success          |
| Chat mailbox             | Chat owns message changes and replay receipts; Workers use its existing authenticated endpoint      |

The global gift log has no kingdom column. Its two mutable projection fields are
explicit global integration state across realms; per-realm queue access does not
imply global row-level realm isolation. A worker is not authorized to change the
other gift-log fields or insert new log rows. Queue producers and gameplay mail
status mutations remain in their existing realm transactions.

Gift delivery holds the realm row locks while committing the global projection,
then deletes the corresponding realm intents. A process death between these
commits leaves an intent for replay of the same values. Missing global logs are
acknowledged no-ops, preserving existing behavior. Chat delivery holds one realm
intent lock while the publisher sends its original operation/effect identity and
payload. Chat commits its deduplicated update/receipt before acknowledgment; only
then does the worker delete the intent. Lost responses and uncertain outcomes are
retried from the durable queues, without resetting state or granting benefits.

## Configuration and resource bounds

Use explicit restricted PostgreSQL URLs, never the administrative migration or
realm credentials. The worker requires `MAIL_INTEGRATION_MODE=external`; the Server
setting defaults to `local` and must be explicitly switched during cutover.

| Variable                   | Meaning/default                                                   |
| -------------------------- | ----------------------------------------------------------------- |
| `KINGDOM_ID`               | Required positive realm identity                                  |
| `MAIL_WORKER_KINGDOM_URL`  | Required restricted connection to that realm database             |
| `MAIL_WORKER_GLOBAL_URL`   | Required restricted global gift-projection connection             |
| `KINGDOM_DATABASE_NAME`    | Expected realm database, default `opencok_kingdom_<KINGDOM_ID>`   |
| `GLOBAL_DATABASE_NAME`     | Expected global database, default `opencok_global`                |
| `CHAT_URL`                 | Optional Chat origin; composition fixes the mailbox endpoint path |
| `CHAT_SECRET`              | Required with `CHAT_URL`; matches Chat and Server                 |
| `MAIL_WORKER_HEALTH_HOST`  | `127.0.0.1`                                                       |
| `MAIL_WORKER_HEALTH_PORT`  | `18091`                                                           |
| `MAIL_WORKER_TIMEOUT_MS`   | `5000`, accepted range 100–30000                                  |
| `MAIL_WORKER_POLL_MS`      | `5000`, accepted range 1000–60000                                 |
| `MAIL_WORKER_KINGDOM_POOL` | `2`, accepted range 1–4                                           |
| `MAIL_WORKER_GLOBAL_POOL`  | `1`, accepted range 1–2                                           |

Database path validation prevents an accidental mismatch with the configured realm
or global database. Startup also checks actual database permissions before opening
the health listener or admitting delivery. Misconfigured or administrative roles
must fail closed. PostgreSQL grants enforce the write boundary; an application
configuration label alone does not establish it. See the
[Compose deployment guide](../../infra/README.md) for provisioning and
local deployment.

If Chat delivery was active in the realm, configure its endpoint in Workers before
switching the realm to external mode. Omitting Chat config intentionally disables
that queue consumer; it does not reroute pending intents back into the realm.
Configure the same `CHAT_SECRET` on Chat, Server and Workers. The shared key
covers trusted Chat integrations across realms; signed mailbox requests retain
their realm, owner and operation identity. Deploy the matching application versions
together when replacing the previous mailbox-specific settings.

Each process owns up to two independent, non-overlapping loops. A gift pass processes at
most one batch of 100 rows; a Chat pass processes at most 50 single-intent
transactions. Enabled queues start immediately, then schedule their next pass after
completion/failure plus the configured interval. Each PostgreSQL statement/query
and connection acquisition uses the configured timeout; transaction and idle-in-
transaction timeouts are twice that value. Chat also retains the existing bounded
HTTP timeout. A transaction timeout can roll back a partially attempted gift batch,
leaving its durable intent for replay. These are operation/transaction bounds, not
an end-to-end delivery or shutdown SLO. Pool limits are per process; account for
every realm and replica when sizing the deployment. Worker PostgreSQL URLs accept
only supported TLS options, preventing URL parameters from replacing database,
pool or timeout settings.

## Database permissions and realm binding

Provision new login roles separately from starting Workers. The provisioning
operation accepts administrative connections only in the operator process; those
credentials must never appear in the worker environment. Existing role names are
rejected rather than silently stripped of privileges or repurposed. Rotate by
provisioning new names, draining old consumers and switching the restricted URLs.

The operator entrypoint is `bun --no-env-file apps/workers/scripts/provision-mail-roles.ts`.
Supply these values through a private process environment, without embedding them
in shell command history or printing the environment:

| Variable                           | Operator input                                           |
| ---------------------------------- | -------------------------------------------------------- |
| `MAIL_PROVISION_KINGDOM_ADMIN_URL` | Administrative connection to the intended realm database |
| `MAIL_PROVISION_GLOBAL_ADMIN_URL`  | Administrative connection to its global database         |
| `KINGDOM_ID`                       | Realm bound to the newly created credentials             |
| `MAIL_PROVISION_KINGDOM_ROLE`      | Fresh restricted realm login name                        |
| `MAIL_PROVISION_GLOBAL_ROLE`       | Different fresh restricted global login name             |
| `MAIL_PROVISION_PASSWORD`          | Generated secret of 24–256 printable ASCII characters    |

Role names use lowercase ASCII letters, digits and underscores, start with a
letter and contain at most 63 characters. Provisioning derives a SCRAM verifier
locally; the SQL does not contain the cleartext password. Treat the verifier and
operator database logs as sensitive as well. Construct the worker URLs through
your secret manager with URL-encoded credentials and the actual database names.

The two database commits are not atomic. A failure can leave one newly provisioned
role/binding committed. Inspect operator-owned roles and bindings before retrying;
do not assume a failed command undid both databases. Use new names for the next
attempt and retire abandoned roles explicitly after verifying they are unused.
Provisioning never automatically drops or rewrites existing credentials.

Each database has an operator-owned `mail_worker_access.binding` table associating
the login role with its realm and database kind. Workers can read this binding but
cannot insert, update or delete it. Startup compares the configured realm with the
binding for the actual connected user; matching URL names alone cannot establish
that identity. This is additive access metadata, not a gameplay schema migration,
queue conversion or authority epoch.

Realm roles can read and delete only the two integration queues. PostgreSQL also
requires an UPDATE privilege to lock rows with `FOR UPDATE`; the role receives
only the selected integration timestamp column on each queue. Consequently the
credential technically permits changing those timestamps, although the maintained
relays only delete acknowledged rows. Global roles can read the three gift identity
columns and update only `isOpened` and `receiveTime`. Neither role owns tables or
schemas, inherits another role, or receives gameplay, reward or other-realm DML.

The permission check rejects unexpected table/column access, schema or database
creation/ownership, role memberships, sequence mutation and executable user
security-definer routines. Recurring checks gate delivery and remove readiness
when the configured boundary changes. PostgreSQL grants enforce denied writes;
the application check is a fail-closed configuration check, not a replacement for
those grants or protection against an administrator changing policy concurrently.

PostgreSQL may grant database CONNECT through PUBLIC. Provisioning does not revoke
that privilege cluster-wide or disrupt other applications. A worker may therefore
connect to another database and read PostgreSQL metadata while remaining unable
to use its gameplay schemas or mutate its data. Require operator-managed database
CONNECT/HBA/network policy separately when connections themselves must be denied.
The scoped runtime tests establish foreign data denial for the disposable two-realm
fixture, not cluster-wide network isolation. Runtime permission checks inspect the
connected realm and global databases; operators must also audit existing PUBLIC
and explicit grants in other databases. Startup does not inspect every foreign
database's table grants.

## Health, backlog and drain

`GET /health/live` reports whether the application is running outside drain.
`GET /health/ready` requires every enabled queue's latest pass to have succeeded.
Readiness is false until the first pass finishes, after a permission/delivery/backlog failure,
and throughout shutdown. The health listener starts after permission checks; the
initial delivery runs after the application can register its shutdown finalizer.
Each queue checks the permission boundary again before its delivery sweep.

Health responses expose aggregate queue state only: `pending`, `limited`,
`oldestAgeMs`, `delivered` and `ready`. Backlog reads select at most 1001 oldest
entries. When `limited` is true the count is a bound, not an exact queue total.
Age and delivered counts describe the latest successful observation/pass, not a
cumulative delivery ledger. A failed pass marks readiness false while retaining
previous observations. The global projection is probed even with an empty gift
queue. An empty Chat queue does not issue a synthetic HTTP update, so readiness
does not prove that Chat is reachable until actual delivery is attempted.

Shutdown first marks the application unready, cancels future polling and stops
admitting further Chat intents after the current one. It waits for active queue
work, closes the health listener and its connections, then releases both pools.
The health listener bounds headers/requests to five seconds and keepalive to one
second; it accepts only the two GET health paths. If the supervisor
must kill a process before drain finishes, inspect queue/receipt state and restart
normal replay; do not delete intents merely because delivery may have happened.
Worker failure leaves committed gameplay and pending integration work intact.

## Cutover and rollback

1. Build matching Chat/Server/Workers artifacts and provision restricted roles
   while the realm remains in local mode. Configure the per-realm mailbox
   key map on Chat and the matching realm key on local Server before switching
   consumers. Verify credential
   rejection and resource limits in the intended environment; never pass
   migration credentials or the broad Chat key to Workers.
2. Gracefully stop the current realm/local delivery loops and any previous worker.
   Confirm their active work has drained or the processes have exited. Keep all
   pending queue, global projection and Chat receipt rows.
3. Set the realm to `MAIL_INTEGRATION_MODE=external`. Configure the worker for the
   same realm and required Chat delivery, using its restricted URLs.
4. Start Workers, verify permission checks/readiness and backlog progress, then
   start the realm in external mode. Confirm the realm no longer owns the two mail
   polling loops. Gameplay producers continue committing durable intents normally.
5. For rollback, stop and drain Workers and stop the realm before restoring
   `MAIL_INTEGRATION_MODE=local` and restarting it. Preserve queues and receipts;
   replay resolves uncertain delivery. Avoid deliberately running local and
   external consumers simultaneously during the transition.

No population clock, gameplay epoch, gameplay schema or native client asset is
converted by this switch. This is integration process isolation, not separate player/world
writers, a scheduler, a combat/generation worker or a complete W15/W18 rollout.

## Validation and measurements

Run the Workers unit and disposable-PostgreSQL integration suites, affected Mail,
Env and Server checks, the existing mailbox regression and root architecture,
type, lint/format and build checks. Process tests must exercise the production
entrypoint/configuration as well as controlled child-process failure fixtures.
Use synthetic queues and credentials in disposable databases; never use player
queues for failure injection or benchmarks.

```sh
bun run --cwd apps/workers check-types
bun run --cwd apps/workers test
bun run --cwd apps/workers test:integration
bun run --cwd apps/workers build
```

The integration command requires Docker for its disposable PostgreSQL fixture.
Workers units also run in the ordinary code-quality workflow. The dedicated
PostgreSQL Workers workflow runs on matching pushes to `main`, following the
repository's existing integration-workflow policy.

The [benchmark reproduction guide](BENCHMARK.md) provides the exact commands,
archived static adapter and measurement limits. The comparison supports three modes: archived parent relays and polling
lifecycle, current local delivery, and current separate-process delivery. Parent
mode resolves the original gift/Chat relay functions, publisher and PollingWorker
from an archived baseline, and reproduces the prior 50-intent composition loop.
All modes share the current fenced producer and Chat receiver fixture; this is a
comparison of the delivery boundary, not the complete historical application.
Source manifests identify both the loaded baseline and current benchmark/runtime.

Aggregate process CPU/RSS and pool limits include the parent and all worker
children; PostgreSQL is separate. Delayed Chat and two-realm failure tests establish
specific isolation behavior. The benchmark also reports command latency, backlog,
event-loop delay and sampled connection counts. Timing differences cannot be
attributed solely to processes: isolated mode adds restricted pools and recurring
permission checks. Performance benefit requires repeated measurements and explicit
workload limits.

The disposable PostgreSQL/process suite completed 14 tests and 85 assertions,
including crash replay, lost HTTP acknowledgments, database privilege drift,
foreign-owner denial, independent realms, drain and the production entrypoint.
The production Effect entrypoint emits its successful stopped event and exits
with interruption status 130 after SIGTERM; the controlled fixture uses its own
explicit clean-exit status. A process exit code alone does not establish drain.

The [recorded nine-trial comparison](BENCHMARK.md#recorded-comparison-for-697)
retains the observed ranges and poll-phase limitation. Isolated delivery increased
median sampled aggregate RSS from 163.57 MiB in current local mode to 427.98 MiB.
Its shorter delivery window reflects different polling overlap and is not a
throughput claim. No performance gain or equivalence is established.
