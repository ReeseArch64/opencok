# Local development stack

Compose is the local development environment. Production uses a separate deployment
and does not depend on this Compose configuration. Development settings are written
directly in `docker-compose.yml`; the game login secret and optional endpoint
overrides are substituted from the root `.env`.

Every service uses both profiles `all` and `dev`; either profile starts the same
complete set of containers, including pgAdmin, Redis Insight and Portainer.
Chat runs as its own service. Media runs inside the API using the five S3 settings
and shared Redis authorization; there is no Files container or media overlay. See the
[API guide](../../apps/api/README.md#avatar-media). MinIO and `minio-setup` provide the
client CDN alongside the TypeScript API/server, gateway, PostgreSQL, Redis and
ZooKeeper.

## Local inputs and start

The root `.env` contains `NODE_ENV`, `DATABASE_ROLE`, `DATABASE_URL` and the private
`GAME_LOGIN_SECRET` exception. Chat defaults to `chat:8083`: the realm uses
`/external/session` and the API proxies public metadata. `CHAT_SIGNING_SECRET`
overrides the shared development signing value on both Chat and the realm. Optional
`GAME_CHAT_SESSION_URL` and `API_CHAT_URL` select another host. Set
`CHAT_WEBSOCKET_URL` when clients need a different address than
`ws://192.168.1.104:8083/chat/ws`. Use `.env.example` as the reference and preserve
existing values. No app-local env files are needed. The example database URL uses
Compose service DNS; PostgreSQL has no published host port. Run database tools
through `docker compose --profile dev exec -T postgres` or the internal network.

After changing `GAME_LOGIN_SECRET`, recreate the server to apply it:

```sh
docker compose --profile dev up -d --no-deps --wait server
```

A container restart retains its previous environment. A stale login secret causes
signature rejection (`LoginErr`) even when the root `.env` is correct.

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
docker compose --profile dev config --quiet
docker compose --profile dev up --build -d --wait
docker compose --profile dev ps -a

docker compose --profile all up --build -d --wait
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

Port mappings have no host-IP prefix. Internal connections use service DNS:
`postgres:5432`, `redis:6379`, `zookeeper:2181`, `api:8080`, `server:9933`,
`minio:9000` and `chat:8083`. The API and game server have no directly published host
ports. The API joins the external network for outbound access. Avatar storage operations use `S3_ENDPOINT=http://minio:9000`;
image URLs use the client-reachable `S3_PUBLIC_ENDPOINT`.
The local API advertises `192.168.1.104:9933`; edit that direct value if the host
address changes. The MinIO console redirect uses the same local host address.

The realm is explicitly configured as ID 1 / `opencok_kingdom_1`, with shared global
state in `opencok_global`. The second kingdom database keeps the same schema.
Changing the active realm requires matching server database/ID and API directory
configuration; the disposable test exercises COK2 through explicit overrides.

Application settings are still validated by `@opencok/env`. Compose provides the
container values directly; host-side tools use the root database URL. Database and
MinIO credentials in Compose are local development values. The prepared client's
existing login secret remains in the ignored root env file rather than source.

## Persistence and recovery

The existing PostgreSQL, Redis, ZooKeeper and MinIO named volumes are preserved.
The service names are `postgres`, `postgres-setup` and `minio`; update local
overrides that previously targeted `database`, `database-setup` or `storage`.
Redis 6.2.24 and ZooKeeper 3.4.14 use pinned upstream images with configuration
in Compose. Redis command arguments retain RDB/AOF persistence, a 384 MiB limit,
`noeviction` and disabled command slowlogs. ZooKeeper environment variables retain
session timing, client limits, hourly snapshot cleanup, the 256 MiB heap and
`ruok`/`srvr` health commands. Both services remain private on the internal network.
Recreate the affected service after configuration changes; no image rebuild is needed.
The MariaDB volume is never mounted by this stack. Startup does not reseed players,
reactivate accounts, flush Redis or remove objects/volumes. PostgreSQL remains the
authority for player progress. Back up databases and local inputs before changes;
an image rollback does not reverse SQL migrations.

```sh
docker compose --profile dev run --rm postgres-setup
docker compose --profile dev down
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
bun run test:stack
```

The integration test creates an isolated Compose configuration with synthetic
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
