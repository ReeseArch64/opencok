# Local development stack

Compose is the local development environment. Production uses a separate deployment
and does not depend on this Compose configuration. Development settings are written
in `docker-compose.yml`; `docker-compose.dev.yml` explicitly adds local Redis
readiness dependencies for API/server. The game login secret, shared `REDIS_URL`
and optional endpoint overrides are substituted from the root `.env`.

Use both files for local development. Every service uses both profiles `all` and
`dev`; either profile starts the same complete set of containers, including
pgAdmin, Redis Insight and Portainer. Only Redis also has the `redis` profile;
it selects Redis alone, without applications or inspection tools.
Chat runs as its own service. Media runs inside the API using the five S3 settings
and shared Redis authorization; there is no Files container or media overlay. See the
[API guide](../../apps/api/README.md#avatar-media). MinIO and `minio-setup` provide the
client CDN alongside the TypeScript API/server, gateway, PostgreSQL, Redis and
ZooKeeper.

The API, chat and realm images build minified JavaScript with Bun before starting
their entrypoints. Run `bun run --cwd apps/<service> build` to build an individual
service locally (`<service>` is `api`, `chat` or `server`). These artifacts target
Bun and still require the Bun runtime. The realm build also copies its nickname
filter into `dist/data`. Rebuild images after source or resource changes.

## Local inputs and start

The root `.env` contains `NODE_ENV`, `DATABASE_ROLE`, `DATABASE_URL` and the private
`GAME_LOGIN_SECRET` exception, plus `REDIS_URL=redis://redis:6379/0` for local
containers. Chat defaults to `chat:8083`: the realm uses
`/external/session` for sessions and `/_internal/nickname` for player renames,
and the API proxies public metadata. `CHAT_SIGNING_SECRET`
overrides the shared development signing value on both Chat and the realm. Optional
`GAME_CHAT_SESSION_URL`, `GAME_NICKNAME_CHAT_URL` and `API_CHAT_URL` select another host. Set
`CHAT_WEBSOCKET_URL` when clients need a different address than
`ws://192.168.1.104:8083/chat/ws`. Use `.env.example` as the reference and preserve
existing values. No app-local env files are needed. The example database URL uses
Compose service DNS; PostgreSQL has no published host port. Run database tools
through `docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev exec -T postgres` or the internal network.

After changing `GAME_LOGIN_SECRET`, recreate the server to apply it:

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
The nickname filter is bundled as `packages/resources/data/badwords.json`.
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
imports the CDN; the gateway waits for API/server health and successful CDN setup.
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
| Redis Insight                            | 5540           |
| Portainer HTTP (host to container)       | 9443 → 9000    |

Maple and the other development port mappings have no host-IP prefix. Internal connections use service DNS:
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
configuration; the disposable test exercises COK2 through explicit overrides.

The resident map uses `GAME_MAP_SIZE=1201`, matching the saved native terrain and
the one-based identity `id = 1 + x + y * 1201`. A worker configured with 1200 can
answer `world.get` successfully while selecting cells outside the requested view.
Keep this setting aligned with the actual realm database; changing the setting
does not convert terrain or move existing cities.

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

For a Redis-only local instance using nonsecret example settings:

```sh
docker compose --env-file .env.example -f docker-compose.yml --profile redis up -d --wait
```

Use a separate checkout/environment for concurrent stacks: project names alone
cannot isolate the existing fixed container/network names and published ports;
those also need isolated overrides. This is not a production Compose conversion:
PostgreSQL/ZooKeeper/MinIO setup dependencies, development credentials, tool
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
Redis 8.2.11 Bookworm and ZooKeeper 3.4.14 use pinned upstream images with
configuration in Compose. The Redis upgrade is runtime-unverified; the official
image tag is not evidence of Bun client, managed-service or production compatibility.
See [ADR-0005](../../docs/decisions/0005-adopt-redis-for-cache.md).
Redis command arguments retain RDB/AOF persistence, a 384 MiB limit,
`noeviction` and disabled command slowlogs. ZooKeeper environment variables retain
session timing, client limits, hourly snapshot cleanup, the 256 MiB heap and
`ruok`/`srvr` health commands. Both services remain private on the internal network.
Recreate the affected service after configuration changes; no image rebuild is needed.
The MariaDB volume is never mounted by this stack. Startup does not reseed players,
reactivate accounts, flush Redis or remove objects/volumes. PostgreSQL remains the
authority for player progress. Back up databases and local inputs before changes;
an image rollback does not reverse SQL migrations. Before the Redis major upgrade,
back up the existing Redis volume and test the upgrade on a disposable copy.
Redis 8 persistence files may not be readable by Redis 6; rollback requires a
compatible pre-upgrade backup, not merely changing the image tag.

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
bun --no-env-file test tests/compose
bun run test:stack
```

`bun --no-env-file test tests/compose` checks the base and development YAML
statically without Docker: shared URL mappings, outbound networks, local dependency
override and Redis-only selection. It does not prove Compose merge or runtime health.

The integration test loads both base and dev files and forces a synthetic local
`REDIS_URL` before interpolation, regardless of inherited environment settings.
It creates an isolated Compose configuration with synthetic
accounts, a compiled synthetic catalog registry and CDN files, unique ports/networks and disposable volumes. It
checks that `dev` and `all` select the same complete service set and runs a named
lifecycle/functional test for each of the 13 services. Long-running containers must
be running; `postgres-setup` and `minio-setup` must exit successfully. Checks cover
PostgreSQL databases, setup registrations, pgAdmin ping/login page, Redis TTLs,
ZooKeeper status, API/server readiness, gateway routing, MinIO health/CDN policy,
Redis Insight health/API and Portainer HTTPS/authentication boundaries.

The existing discovery, SFS login, CDN reads/Range/ETag, private-path, player-state
and Redis failure/recovery checks remain. Every published test port binds to
loopback with a unique port. Portainer receives a disposable data volume and no
host Docker socket: these tests validate its UI/API startup and authentication
boundary, not management of the host daemon. Cleanup removes only the test project.
Native APK rendering and unimplemented gameplay still require separate evidence.

## Social chat archive

Topic 24 adds authenticated `mongo:8.0.34` on the internal network with the
`mongodb-data` volume and no host port. Chat uses `MONGODB_URI`; local initialization
uses `MONGODB_USER` and `MONGODB_PASSWORD`. Configure a unique stable `CHAT_INSTANCE_ID`
for every additional Chat instance. The development default identifies the single
Compose Chat consumer. Read the [social chat deployment guide](../../docs/social-chat-migration.md)
for migration order, archive outage behavior, original expiry, rollback and synthetic
acceptance. Existing MongoDB volumes keep their initialized credentials when environment
values change; do not delete the volume to rotate credentials.

## Observability

[ADR-0013](../../docs/decisions/0013-adopt-maple-for-local-operational-observability.md)
selects Maple Local for server/API logs, traces, controlled errors and duration/process
metrics. Grafana, Loki, Prometheus, Axiom and Sentry adoption is suspended for these
signals while Maple passes the required checks. The official `v0.3.0` image contains
OTLP HTTP ingest, the query API, embedded ClickHouse and the bundled offline dashboard.
It uses `maple-data:/data`; no second database or hosted Maple account is required.
Its own outgoing telemetry/update checks are disabled.

Start the services after rebuilding the applications:

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev up --build -d --wait maple server api
```

Compose's PostgreSQL setup applies migration `0044_mutation_trace_context.sql` before
server/API start. This adds nullable outbox trace context without resetting existing
state. Rebuild server/API when updating this integration. Maple is not a gameplay
readiness dependency: a telemetry outage does not prevent application startup.

Open `http://127.0.0.1:4318`. Set independently generated
`MAPLE_LOCAL_ACCESS_TOKEN` and `MAPLE_LOCAL_INGEST_KEY` values in the ignored root `.env`
before starting the services; Compose supplies no default credentials. Maple, server
and API must use the same ingest key. After changing credentials, recreate Maple,
server and API together. Generate each
value with `openssl rand -hex 32`; keep them out of source and command output captured
for reports. The dashboard token can read/query telemetry; the ingest key only writes.
Maple's port 4318 is published on all host interfaces. Restrict access with host
network controls when the development machine is reachable by other devices.

Both services send OTLP to `http://maple:4318`. For applications run outside Compose,
set `OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318` and the same ingest key.
`OTEL_EXPORT_INTERVAL_MS` defaults to 1000 and accepts 1000–60000 ms;
`OTEL_SLOW_OPERATION_MS` defaults to 1000 and accepts 100–60000 ms. Configure these
values on the applications when overriding Compose defaults. Leaving the endpoint
unset keeps JSON logs without network export.

In the dashboard, select `server` or `api`, filter by operation/outcome/level and open
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
bun run test:stack
```

The first checks every required signal, trace/log correlation, private-field filtering,
query authentication and clean-restart persistence against the real Maple image. The
second exercises the actual API/server containers and queries their stored telemetry.
Production capacity and representative load remain separate admission work.
