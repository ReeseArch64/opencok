# Local development stack

Compose is the local development environment. Production uses a separate deployment
and does not depend on this Compose configuration. Development settings are written
in `docker-compose.yml`; `docker-compose.dev.yml` adds local Redis readiness for
API/server, MinIO readiness for API, and PostgreSQL setup ordering for API/server/Chat and pgAdmin. The game
login secret, shared `REDIS_URL` and `DATABASE_URL`, and optional endpoint overrides
are substituted from the root `.env`.

Use both files for local development. The `dev` profile starts the application stack
and Mongo Express; `all` also includes pgAdmin, Redis Insight and Portainer. The `devops` profile selects
these three administration tools together with PostgreSQL, PostgreSQL setup and Redis.
The `redis` profile selects Redis and Redis Insight; `database` selects PostgreSQL,
PostgreSQL setup, pgAdmin, MongoDB and Mongo Express. The `observability` profile selects only Maple, without
application startup dependencies. The `prod` profile omits database inspection tools.
Combine `--profile dev --profile devops` to start
the development stack with administration tools.
Chat runs as its own service. Media runs inside the API using the five S3 settings
and shared Redis authorization; there is no Files container or media overlay. See the
[API guide](../../apps/api/README.md#avatar-media). MinIO and `minio-setup` provide the
client CDN alongside the TypeScript API/server, gateway, PostgreSQL, Redis and
ZooKeeper.

The API, chat and realm images build minified JavaScript with Bun before starting
their entrypoints. Run `bun run --cwd apps/<service> build` to build an individual
service locally (`<service>` is `api`, `chat` or `server`). These artifacts target
Bun and still require the Bun runtime. The realm build also copies its nickname
filter into `dist/src/data`. Rebuild images after source or resource changes.

## Local inputs and start

The root `.env` contains `NODE_ENV`, `DATABASE_ROLE`, `DATABASE_URL` and the private
`GAME_SECRET` exception, plus `REDIS_URL=redis://redis:6379/0` for local
containers. Chat defaults to `chat:8083`: the realm uses
`/external/session` for sessions, `/_internal/nickname` for player renames and
`/_internal/mailbox` for mailbox effects; the API proxies public metadata. `CHAT_SECRET`
overrides the shared development signing value on both Chat and the realm. Optional
`CHAT_URL` selects the shared HTTP(S) origin for API and realm; paths are fixed in
code. Setting it enables all three private realm integrations, including mailbox.
Use a bare origin without credentials, path, query or fragment. The Chat entrypoint
advertises `ws://192.168.1.104:8083/chat/ws` as a fixed value; changing the client-facing
address requires a code change and rebuild. Use `.env.example` as the reference and preserve
existing values. No app-local env files are needed. The example database URL uses
Compose service DNS; PostgreSQL has no published host port. Run database tools
through `docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev exec -T postgres` or the internal network.

After changing `GAME_SECRET`, recreate the server to apply it:

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev up -d --no-deps --wait server
```

A container restart retains its previous environment. A stale login secret causes
signature rejection (`LoginErr`) even when the root `.env` is correct.

Player renames require the private Chat nickname endpoint and matching signing
secret. Compose passes both by default. After updating this configuration or its
root `.env` override, recreate the server with the command above; a restart alone
does not enable renames in an existing container. Existing accounts, inventories
and rename receipts are preserved. Custom deployments must configure the endpoint
explicitly as described in [Profile and preferences](../../apps/server/PROFILE_PREFERENCES.md#activation-and-recovery).

Gameplay catalogs are included as readable TypeScript in `packages/resources/src/catalogs`.
The nickname filter is bundled as `packages/policy/src/resources/data/badwords.json`.
The server has no resource volume and does not require the ignored reference tree.
Rebuild and recreate it after catalog edits; see the
[catalog guide](../../packages/resources/README.md). Original private references
remain ignored and outside runtime images.

The CDN source is `data/cdn/data`, containing the extracted `cok.eleximg.com`
and `asset.cok.chat` host trees. MinIO initialization commands live directly in
Compose. These local inputs are not supplied by the public repository. The source
must contain both extracted host trees for the import to succeed. Obtain the authorized inputs before starting a new checkout.

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev config --quiet
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev up --build -d --wait
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev ps -a

docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile all up --build -d --wait
```

PostgreSQL setup applies pending Drizzle migrations to the global database and both
kingdom databases. API/server/Chat wait for setup and their dependencies. MinIO setup
imports the CDN; the development override makes the gateway wait for successful
CDN setup in addition to API/server health. The base gateway uses `CDN_URL` from
the root `.env` and has no MinIO dependency. Set an external HTTP(S) origin for
production, preserving the storage path layout in the [gateway guide](../gateway/README.md).
The one-shot jobs exit with code zero after completion.

## Direct development values

| Endpoint                                 | Published port |
| ---------------------------------------- | -------------- |
| Gateway HTTP game/chat discovery and CDN | 80             |
| Gateway game TCP                         | 9933           |
| Chat HTTP/WebSocket                      | 8083           |
| MinIO object endpoint                    | 9000           |
| MinIO console                            | 9001           |
| pgAdmin                                  | 5050           |
| Mongo Express                            | 8081           |
| Redis Insight                            | 5540           |
| Portainer HTTP (host to container)       | 9443 → 9000    |

Development port mappings have no host-IP prefix. Internal connections use service DNS:
`postgres:5432`, `redis:6379`, `zookeeper:2181`, `api:8080`, `server:9933`,
`minio:9000` and `chat:8083`. The API and game server have no directly published host
ports. API and server join the external network for outbound access, including
external Redis. Avatar storage operations use `S3_ENDPOINT=http://minio:9000`;
image URLs use the client-reachable `S3_PUBLIC_ENDPOINT`.
The local API advertises `192.168.1.104:9933`; edit that direct value if the host
address changes. The MinIO console redirect uses the same local host address.

The realm is explicitly configured as ID 1 / `opencok_kingdom_1`, with shared global
state in `opencok_global`. The second kingdom database keeps the same schema.
Changing the active realm requires matching server database/ID and API directory
configuration.

The resident map size is fixed at 1201 in the server configuration, matching the saved native terrain and
the one-based identity `id = 1 + x + y * 1201`. A worker configured with 1200 can
answer `world.get` successfully while selecting cells outside the requested view.
Keep this constant aligned with the actual realm database; changing it does not
convert terrain or move existing cities.

When correcting a realm previously started with 1200, stop its worker and back up
its database first. Inspect private `opencok.world.monsters.*.v1` records under
`trigger_var(-1, @world:0)` before restarting. An idle `expiry` cursor with empty
quota, remaining and pool values can retain its point-ID cursor while its size
metadata is corrected to the verified terrain width. Other producer snapshots
need separate reconciliation because their area numbering depends on map size.
Do not delete producer snapshots or regenerate occupied terrain automatically.
Recreate the server with `docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev up -d --no-deps server`
and confirm its health and absence of world recovery failures.

Future `server_info.activityTime`, `shuaguaiActStart` or `daoliangStart` values
are a separate replenishment gate. Correcting viewport geometry does not establish
the historical opening date. Reconcile those values from verified operator
evidence before enabling ordinary production; do not replace them automatically
with the deployment time.

Application settings are still validated by `@opencok/env`. Compose provides the
container values directly; host-side tools use the root database URL. Database and
MinIO credentials in Compose are local development values. The prepared client's
existing login secret remains in the ignored root env file rather than source.

## External PostgreSQL and development ordering

API, realm/server and Chat receive the same `DATABASE_URL` from the root environment.
Use `postgres://postgres:postgres@postgres:5432/opencok_global` for the local stack.
The base API also has no MinIO startup dependency. The development override adds
MinIO readiness ordering; configure external S3 endpoints for production through
the existing S3 environment settings.

The base file has no application or pgAdmin dependency on `postgres` or
`postgres-setup`; the development override adds the setup dependency, and the local
setup job waits for PostgreSQL health before applying migrations and generating
pgAdmin registration. Both local services remain defined in the base file with
their existing profiles. Omitting the override removes startup ordering; profiles
such as `all` still select the local PostgreSQL and setup services.

For an external database, supply its `DATABASE_URL` through environment configuration,
omit the development override and select the intended services. Preserve the provider's
connection options, including TLS. Provision the global and kingdom databases and
apply migrations separately before starting applications; removing Compose ordering
does not provision the external database. The existing administrative setup entrypoint
is `bun run --cwd packages/drizzle db:setup`; `POSTGRES_ADMIN_URL` selects an
administrative connection when application credentials cannot create databases or
apply migrations. Run it deliberately against the intended environment. The local
`postgres-setup` service remains configured for local PostgreSQL only. Configure an
external server manually in pgAdmin when not using local setup registrations.

Base Compose requires `DATABASE_URL` during interpolation even for service subsets.
The example URL is for local development; existing volumes and their `PGDATA` path
are preserved. This configuration does not establish external database connectivity,
provider compatibility or migration success.

## Application profiles

Base Compose includes `scheduler`, `mail-workers` and `web` in `all`, `dev` and
`prod`. Server uses external activity discovery and Mail delivery, disabling only
the corresponding local background loops. The default realm remains `1`, with
`opencok_kingdom_1` and `opencok_global`. These profiles select services; they do
not provision restricted database roles, apply deployment migrations or certify
production readiness.

Before starting, provision the restricted roles described below and supply
`SCHEDULER_DATABASE_URL`, `ACTIVITY_SCHEDULER_SECRET`, `MAIL_WORKER_KINGDOM_URL`,
`MAIL_WORKER_GLOBAL_URL`, `MAIL_WORKER_CHAT_SECRET` and `CHAT_MAILBOX_SECRETS`
through private deployment configuration. Missing values fail application validation;
there is no fallback to broad database credentials. All six variable names already
exist in the application schemas and previous overlays; no new deployment variable
names are introduced. Restricted URLs cannot reuse `DATABASE_URL`, and the two
signing keys cannot reuse `GAME_SECRET` or `CHAT_SECRET`. The Chat key map preserves
per-realm key isolation. Internal origins and realm/database names are fixed in base
Compose; port, timeout, polling and pool limits use the existing schema defaults.
Do not run provisioning with administrative credentials inside application containers.

Web listens at <http://localhost:5173>, with port 5173 published on all host
interfaces. Restrict network access with host firewall rules when necessary. It runs
Bun's existing server, including `/api/ping`, rather than a static-only bundle.
Supply the three already prepared images in `apps/web/assets/`, mounted read-only;
the bind mount refuses to create a missing directory. See the
[Web guide](../../apps/web/README.md#local-assets). Compose does not extract private
assets. The existing fixed gateway health target is unchanged.

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev up -d --build
docker compose -f docker-compose.yml --profile prod up -d --build
```

Development ordering waits for database setup and for Server/Chat readiness before
starting Scheduler/Workers. Base services can reach external PostgreSQL through
the external network without depending on local PostgreSQL/setup.

## Mail integration Workers

Base Compose runs the implemented Workers process for the default realm.
[`mail-workers.yml`](mail-workers.yml) remains a one-realm configuration overlay
with the `mail-workers` profile alias and explicit realm/database/key requirements.
Read the [Workers guide](../../apps/workers/README.md) for restricted-role
provisioning, exact grants, bindings, failure recovery and measured limits before
starting either configuration.

Provision the intended realm/global databases and their migrations first, then run
the operator-only role provisioning command with fresh role names. Administrative
URLs and the provisioning password belong only in that operator process. The
worker receives only its two restricted URLs, its realm mailbox key and telemetry
settings. The overlay adds no migration/setup dependency and does not provision
permissions during application startup.

Configure these deployment values in the private environment supplied to Compose.
The realm/database-name variables and `MAIL_WORKER_CHAT_URL` customize the overlay;
base Compose uses realm `1`, the database names above and `http://chat:8083`.
Each overlay also rebinds the other background process to the same Server realm.
Provide both restricted process URLs for that realm; if combining overlays, use
identical realm/database identities in both sets of variables:

| Variable                            | Scope                                                           |
| ----------------------------------- | --------------------------------------------------------------- |
| `MAIL_WORKER_KINGDOM_ID`            | Realm shared by Server and this worker                          |
| `MAIL_WORKER_KINGDOM_DATABASE_NAME` | Actual realm database expected by both                          |
| `MAIL_WORKER_GLOBAL_DATABASE_NAME`  | Global database, default `opencok_global`                       |
| `MAIL_WORKER_KINGDOM_URL`           | Restricted role bound to that realm database                    |
| `MAIL_WORKER_GLOBAL_URL`            | Distinct restricted global projection role                      |
| `CHAT_MAILBOX_SECRETS`              | JSON realm-to-key map passed only to Chat                       |
| `MAIL_WORKER_CHAT_URL`              | Reachable private Chat origin, normally `http://chat:8083` here |
| `MAIL_WORKER_CHAT_SECRET`           | Only the map value for this worker's realm                      |

Map every realm using external workers to a distinct key, different from the broad
Chat key and optional unmapped-realm fallback. Chat receives the map;
Server and its worker receive only their selected realm value. The overlay does not expose other
realm signing keys to Workers. Unmapped realms may retain local delivery with the
explicit fallback described in the Chat guide.

Build matching artifacts before cutover:

```sh
docker compose -f docker-compose.yml -f infra/compose/mail-workers.yml --profile mail-workers build server chat mail-workers
```

This command requires the normal base-stack interpolation values as well as the
private worker values above. Do not print resolved Compose configuration with real
credentials. The new Workers image uses the pinned Bun runtime and a non-root
user. Its health listener uses port 18091 inside the container; the overlay does
not publish it on the host. The internal network must reach PostgreSQL, Chat and
telemetry. The worker joins the external network for external database access; this does
not prove provider connectivity or grant database permissions.

After matching Chat/key-map support is deployed while delivery remains local,
stop and drain the old Server consumer and any previous worker. Start the worker
with this overlay, verify health and backlog progress, then start Server with the
same overlay and realm identity. The overlay's Server environment selects external
mode, suppressing its two local Mail loops. It does not start a worker implicitly
unless the worker service/profile is selected. Keep all durable intent and Chat
receipt rows throughout this transition.

The overlay sets a 45-second graceful stop allowance, pools of two realm and one
global connection, five-second polling/operation timeouts and bounded health
requests. These are explicit deployment limits, not measured production SLOs.
For rollback, stop/drain Workers and Server, explicitly override
`MAIL_INTEGRATION_MODE` to `local` on Server, and restart only Server.
Removing the overlay alone no longer restores local delivery. Retain the Chat key configuration needed by
that Server version and preserve queues/receipts for uncertain-outcome replay.
Follow the full [cutover sequence](../../apps/workers/README.md#cutover-and-rollback).
No production deployment or native client repackaging is performed by this change.

## Timed-activity Scheduler

Base Compose runs Scheduler and selects external timed-activity discovery for
realm `1`. [`activity-scheduler.yml`](activity-scheduler.yml) remains an explicit
realm/database configuration overlay with the `scheduler` profile alias. Read the [Scheduler guide](../../apps/scheduler/README.md)
for the complete twelve-type scope, legacy restoration, restricted-role provisioner,
health semantics and remaining deadline families.

Apply kingdom migration `0045_timed_activity_discovery.sql` in an operator-planned
window first: its regular index build can block writes and adds storage/write
maintenance cost. Then run the operator-only provisioner
with a fresh restricted role and protected realm binding. Supply these values in
the private Compose environment. The realm/database-name variables customize
only the overlay; base Compose uses realm `1` and `opencok_kingdom_1`:

| Variable                          | Scope                                                   |
| --------------------------------- | ------------------------------------------------------- |
| `SCHEDULER_KINGDOM_ID`            | Realm shared by Server and Scheduler                    |
| `SCHEDULER_KINGDOM_DATABASE_NAME` | Actual realm database expected by both                  |
| `SCHEDULER_DATABASE_URL`          | Read-only role bound to that realm/database             |
| `ACTIVITY_SCHEDULER_SECRET`       | Distinct realm deadline key, shared only with its owner |

The key must differ from game, provisioning and Chat credentials; use a different
key for each realm. Administrative provisioning URLs/passwords do not belong in
the Scheduler container. The overlay adds no migration/setup dependency and the
runtime never creates roles or repairs grants.

Build matching artifacts before cutover:

```sh
docker compose -f docker-compose.yml -f infra/compose/activity-scheduler.yml --profile scheduler build server scheduler
```

Normal base-stack interpolation values are still required. Do not print resolved
Compose configuration with real credentials. The image uses the pinned Bun
runtime and a non-root user. Its health port 18092 remains inside the network;
the overlay publishes no new host port. The owner endpoint is reached through
Server's existing internal HTTP port 18090. The internal network must reach the
realm database, owner and telemetry. Scheduler also joins the external network
for external database access; provider connectivity is not verified by configuration.

After deploying matching protocol support in local mode, stop and drain the old
Server global loop and any existing Scheduler. Start Server with the overlay's
external mode and realm identity, then start Scheduler with the same overlay and
`scheduler` profile. Verify current-owner capability checks, restricted-role
readiness, actual deadline lateness and backlog progress. Scheduler readiness
requires the owner to answer successfully. Foreground/reconnect recovery stays
local to Server throughout the external mode.

The overlay sets a two-connection pool, one-second delay between completed passes,
64 candidates per phase, four attempts per owner, five-second operation timeout
and 45-second graceful stop allowance. The owner retains every gameplay mutation
and its existing transaction fence. These are deployment bounds, not measured
production SLOs. All queue/activity rows and economic receipts survive cutover.

For rollback, stop/drain Scheduler and Server, explicitly override
`ACTIVITY_SCHEDULER_MODE` to `local` on Server, and restart only Server.
Removing the overlay alone no longer restores local activity discovery. Retain compatible protocol support and
all persisted activities, legacy queues, receipts and outbox entries. A lost HTTP
response may follow a committed owner transaction; replay the same durable
operation rather than resetting a queue or granting rewards again. This change
performs no production deployment and does not complete the other W16 deadlines.

## External Redis and deployment separation

Both Redis consumers (API, including media tickets, and realm/server sessions) use
`REDIS_URL`. Chat and the remaining services do not consume Redis. The same root
value reaches both containers; `redis://` and `rediss://` URLs with credentials,
custom ports and database paths pass through unchanged. Outside Compose, both
schemas default to `redis://127.0.0.1:6379/0`. For host-side development, set a
host-reachable URL; the local Redis service deliberately publishes no host port.

The base file has no API/server `depends_on: redis`; profiles alone cannot remove
a dependency. Production must supply an external `REDIS_URL` through its own
secret/environment configuration and must not include `docker-compose.dev.yml`.
Use TLS and provider-required credentials/network controls. Do not use the local
Redis service DNS name in a production environment. Keep production and development
env files and deployment projects separate, never reuse production credentials in
the local stack or Redis Insight, and do not print resolved Compose config with
real credentials. Base Compose requires `REDIS_URL` even when inspecting a subset
of services because interpolation covers the full file.

For local Redis with Redis Insight using nonsecret example settings:

```sh
docker compose --env-file .env.example -f docker-compose.yml --profile redis up -d --wait
```

Use a separate checkout/environment for concurrent stacks: project names alone
cannot isolate the existing fixed container/network names and published ports;
those also need isolated overrides. This is not a production Compose conversion:
ZooKeeper/MinIO setup dependencies, development credentials, tool
exposure and other production hardening remain separate work. The external network
permits outbound routing but does not prove DNS, firewall, TLS or provider access.
Application readiness checks still require Redis at runtime; removing Compose
ordering does not make Redis optional. Validate readiness, session claim/TTL,
compare-token renewal/release, media tickets, persistence and outage/recovery with
synthetic data before any deployment. No Redis/container runtime validation was
performed for this update.

## Persistence and recovery

The existing PostgreSQL, Redis, ZooKeeper and MinIO named volumes are preserved.
The service names are `postgres`, `postgres-setup` and `minio`; update local
overrides that previously targeted `database`, `database-setup` or `storage`.
Redis 6.2.24 Bookworm and ZooKeeper 3.4.14 use pinned upstream images with
configuration in Compose. Redis remains on the existing baseline; an upgrade requires
client, command, persistence and recovery compatibility validation first.
See [ADR-0006](../../docs/decisions/0006-adopt-redis-and-insight.md).
Redis command arguments retain RDB/AOF persistence, a 384 MiB limit,
`noeviction` and disabled command slowlogs. ZooKeeper retains session timing,
client limits, hourly snapshot cleanup and `ruok`/`srvr` health commands.
Both services remain private on the internal network.
ZooKeeper relies on the pinned image defaults for its 2000 ms tick, 60 client
connections per IP, retention of three snapshots and console logging at INFO.
The Compose overrides retain `initLimit=10`, `syncLimit=5` and hourly cleanup;
the image defaults for these differ. These settings follow the
[official image configuration](https://hub.docker.com/_/zookeeper) and were checked
against the local `3.4.14` image. This image's startup scripts do not consume
`ZOO_HEAP_SIZE`; removing that unused variable leaves the JVM command unchanged.
Keep the existing volumes and healthcheck.
Recreate the affected service after configuration changes; no image rebuild is needed.
The MariaDB volume is never mounted by this stack. Startup does not reseed players,
reactivate accounts, flush Redis or remove objects/volumes. PostgreSQL remains the
authority for player progress. Back up databases and local inputs before changes;
an image rollback does not reverse SQL migrations. Before any future Redis upgrade,
back up the existing Redis volume and test compatibility on a disposable copy.
Newer persistence files may not be readable by older Redis versions; rollback
requires a compatible pre-upgrade backup, not merely changing the image tag.

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev run --rm postgres-setup
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev down
```

PostgreSQL initialization passwords do not rotate existing accounts. Keep direct
Compose credentials aligned with the existing cluster; do not delete a volume to
repair authentication. pgAdmin registration uses `postgres:5432` and omits the
database password. Redis Insight and Portainer each have their own named data
volume. Portainer enables its HTTP listener with `--http-enabled` and maps host
port 9443 to container port 9000. Open `http://localhost:9443`; the published
endpoint uses HTTP. Its development service mounts the host Docker socket for
local container administration.

## Verification

```sh
bun run --cwd apps/api check-types
bun run --cwd apps/server check-types
bun run --cwd packages/env test
```

Validate Compose interpolation and dependencies without starting containers:

```sh
docker compose --env-file .env.example -f docker-compose.yml -f docker-compose.dev.yml --profile dev config --quiet
docker compose --env-file .env.example -f docker-compose.yml -f docker-compose.dev.yml --profile all config --quiet
```

These checks do not establish runtime health, gateway behavior or client compatibility.
Application and package suites remain alongside their respective implementations.

## Social chat archive

Topic 24 adds authenticated `mongo:8.0.34` on the internal network with the
`mongodb-data` volume and no host port. Chat uses `MONGO_URI`; local initialization
uses the local MongoDB development credentials. The Chat entrypoint uses the fixed
consumer ID `chat-local` for the single Compose instance; additional instances need
distinct IDs supplied through application composition. Read the [social chat deployment guide](../../docs/social-chat-migration.md)
for migration order, archive outage behavior, original expiry, rollback and synthetic
acceptance. Existing MongoDB volumes keep their initialized credentials when environment
values change; do not delete the volume to rotate credentials.

## Observability

[ADR-0004](../../docs/decisions/0004-adopt-maple.md)
selects Maple Local for server/API logs, traces, controlled errors and duration/process
metrics. Grafana, Loki, Prometheus, Axiom and Sentry adoption is suspended for these
signals while Maple passes the required checks. A derived `v0.3.0` image contains
OTLP HTTP ingest, the query API, embedded ClickHouse and the bundled offline dashboard.
It applies the guarded [WebAssembly CSP workaround](../observability/maple/README.md)
to the versioned official image with an executable checksum guard; currently only the
verified Linux amd64 build is supported.
It uses `maple-data:/data`; no second database or hosted Maple account is required.
Its own outgoing telemetry/update checks are disabled. Start only observability with:

```sh
docker compose --profile observability up --build -d
```

Maple has no periodic Compose healthcheck: no service waits for its health, and the
former CLI probe queried the embedded store without validating the dashboard. Check
its HTTP endpoint and authenticated dashboard explicitly when diagnosing it. Keep
`stop_grace_period: 45s` for request draining/store shutdown and bounded `json-file`
logs (20 MiB per file, five files) to avoid unbounded Docker disk usage. pgAdmin's
redundant periodic probe is also removed. Database checks used by `service_healthy`
and application/ingress readiness checks remain, including Chat and MongoDB, so
operators retain runtime diagnostics and meaningful `up --wait` behavior. A running
Maple or pgAdmin container alone does not establish readiness.

Start the services after rebuilding the applications:

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev up --build -d --wait maple server api chat gateway
```

Compose's PostgreSQL setup applies migration `0044_mutation_trace_context.sql` before
server/API start. This adds nullable outbox trace context without resetting existing
state. Rebuild server/API/Chat when updating this integration. Maple is not a gameplay
readiness dependency: a telemetry outage does not prevent application startup.

Open `http://127.0.0.1:4318`. Set independently generated
`MAPLE_LOCAL_ACCESS_TOKEN` and `MAPLE_LOCAL_INGEST_KEY` values in the ignored root `.env`
before starting the services; Compose supplies no default credentials. Maple, server,
API, Chat and gateway must use the same ingest key. After changing credentials,
recreate all five services together. Generate each
value with `openssl rand -hex 32`; keep them out of source and command output captured
for reports. The dashboard token can read/query telemetry; the ingest key only writes.
Maple's port 4318 is published on all host interfaces. Restrict access with host
network controls when the development machine is reachable by other devices.

Server, API and Chat send OTLP to `http://maple:4318`. Chat initializes its exporter
before opening application resources and flushes after closing them on shutdown or
startup failure. The gateway sends filtered access logs and HTTP metrics through
Traefik's native OTLP exporters; see the [gateway guide](../gateway/README.md).
For applications run outside Compose,
set `OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318` and the same ingest key.
The telemetry export interval is fixed at 1000 ms in code.
`OTEL_SLOW_OPERATION_MS` defaults to 1000 and accepts 100–60000 ms; configure it
on the applications when changing the slow-operation threshold. Leaving the endpoint
unset keeps JSON logs without network export.

In the dashboard, select `server`, `api`, `chat` or `gateway`, filter by operation/outcome/level and open
a log's trace to inspect its child spans. Use request/connection/job IDs or the opaque
mutation reference for a specific operation. Inspect Errors for controlled exception
groups and Metrics for `opencok.operation.duration`, `opencok.operations.active`,
`opencok.events`, `process.cpu.time`, `process.memory.rss` and `process.uptime`.
`operation_slow` marks unfinished asynchronous work beyond the configured threshold.
A frame queued to TCP is not proof of client receipt. An outbox delivery failure
remains visible independently of the originating committed command.

Useful local queries require no token arguments because the container environment
already supplies its access token:

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev exec -T maple maple services --local
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev exec -T maple maple logs --service server --since 15m --local
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev exec -T maple maple errors --since 15m --local
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev exec -T maple maple metrics --local
```

Maple Local does not schedule automatic alerts. Keep the dashboard open for interactive
investigation; this integration does not send push notifications. Log/span exporters
have bounded queues and timeouts. If Maple becomes unreachable, local JSON diagnostics
report `telemetry_export_failed`; operations continue and operational telemetry can be
lost. Receipts, ledger and outbox remain the durable business record. Do not interpret
absence of a telemetry event as proof that a mutation never committed.

Logs/traces default to 30-day retention and metrics to 90 days. Clean restart preserves
the volume. After an unclean stop the upstream entrypoint restores a checkpoint when
available or starts a fresh store; recent operational telemetry can be lost. Back up
`maple-data` and consult the pinned upstream recovery documentation before upgrades.
Do not use `down --volumes` on a persistent operator stack. Server/API/Maple console
logs rotate at 20 MiB with five files each.

Verification commands use synthetic inputs and disposable infrastructure:

```sh
bun run --cwd packages/core test:maple
```

This checks application signals for server/API/Chat, gateway access logs and HTTP
metrics, trace/log correlation, private-field filtering,
query authentication and clean-restart persistence against the real Maple image.
Production capacity and representative load remain separate admission work.

## Mongo Express

Mongo Express `1.0.2` is available in `all`, `dev` and `database`, after MongoDB is
healthy. Open `http://localhost:8081` and use the local development login
`admin` / `admin`. Port 8081 is published without a host-IP restriction, following
the other local inspection services. These are development credentials.

The UI and Chat both receive `MONGO_URI` from the root `.env`; the URI selects the
database and authentication settings. The example selects local `opencok_chat`
with `authSource=admin`. Admin-wide database browsing is disabled. Inspect `chat_archive` for archived messages; UI changes are
local diagnostic actions and must not replace versioned repair or migration scripts.
The service has no application dependents or gateway route and is omitted from `prod`.
See [ADR-0005](../../docs/decisions/0005-adopt-database-stack.md).
