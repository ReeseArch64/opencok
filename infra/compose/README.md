# Local development stack

Compose is the local development environment. Production uses a separate deployment
and does not depend on this Compose configuration. Development settings are written
directly in `docker-compose.yml`; the game login secret and optional chat integration
settings are substituted from the root `.env`.

Every service uses both profiles `all` and `dev`; either profile starts the same
complete set of containers, including pgAdmin, Redis Insight and Portainer.
Chat and media/files containers remain outside this stage. MinIO and `minio-setup` provide the
client CDN alongside the TypeScript API/server, gateway, PostgreSQL, Redis and
ZooKeeper.

## Local inputs and start

The root `.env` contains `NODE_ENV`, `DATABASE_ROLE`, `DATABASE_URL` and the private
`GAME_LOGIN_SECRET` exception. Optional `GAME_CHAT_SESSION_URL`, `CHAT_SIGNING_SECRET`
and `API_CHAT_URL` connect separately hosted chat without provisioning it. The realm
uses the private session URL; the API uses the HTTP origin for public metadata only.
Both processes must be able to reach the configured service on their network, and its
advertised WebSocket must be reachable by clients. Use `.env.example` as the reference and preserve
existing values. No app-local env files are needed. The example database URL uses
Compose service DNS; host-side tools need the published PostgreSQL port 5432.

After changing `GAME_LOGIN_SECRET`, recreate the server to apply it:

```sh
docker compose --profile dev up -d --no-deps --wait server
```

A container restart retains its previous environment. A stale login secret causes
signature rejection (`LoginErr`) even when the root `.env` is correct.

The full authorized server reference is copied into `data/reference/server`.
The runtime mounts only `data/reference/server/runtime/base/resource` read-only at
`/resources`. It has no dependency on another checkout or a user home directory.
The reference contains private legacy inputs and stays ignored by Git, outside
runtime images; maintained TypeScript code remains under `apps/server`.

The CDN source is `data/cdn/data`; see the [CDN guide](../storage/README.md) for
its two extracted host trees. These local inputs are not supplied by the public
repository. Missing input directories fail the mount instead of being silently
created. Obtain the authorized inputs before starting a new checkout.

```sh
docker compose --profile dev config --quiet
docker compose --profile dev up --build -d --wait
docker compose --profile dev ps -a

docker compose --profile all up --build -d --wait
```

PostgreSQL setup applies pending Drizzle migrations to the global database and both
kingdom databases. API/server wait for setup and their dependencies. MinIO setup
imports the CDN; the gateway waits for API/server health and successful CDN setup.
The one-shot jobs exit with code zero after completion.

## Direct development values

| Endpoint                                 | Published port |
| ---------------------------------------- | -------------- |
| Gateway HTTP game/chat discovery and CDN | 80             |
| Gateway game TCP                         | 9933           |
| PostgreSQL                               | 5432           |
| MinIO object endpoint                    | 9000           |
| MinIO console                            | 9001           |
| pgAdmin                                  | 5050           |
| Redis Insight                            | 5540           |
| Portainer HTTPS                          | 9443           |

Port mappings have no host-IP prefix. Internal connections use service DNS:
`postgres:5432`, `redis:6379`, `zookeeper:2181`, `api:8080`, `server:9933` and
`minio:9000`. The API and game server have no directly published host ports.
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
Redis and ZooKeeper configuration is copied into their development images, so
configuration changes require rebuilding the corresponding image.
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
volume. Portainer uses HTTPS on port 9443 and its development service mounts
the host Docker socket for local container administration.

## Verification

```sh
bun run --cwd apps/api check-types
bun run --cwd apps/server check-types
bun run --cwd packages/env test
bun run test:stack
```

The integration test creates an isolated Compose configuration with synthetic
accounts, XML and CDN files, unique ports/networks and disposable volumes. It
checks that `dev` and `all` select the same complete service set and runs a named
lifecycle/functional test for each of the 12 services. Long-running containers must
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
