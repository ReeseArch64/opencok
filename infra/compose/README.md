# Local development stack

Compose is the local development environment. Production uses a separate deployment
and does not depend on this Compose configuration. Development settings are written
directly in `docker-compose.yml`; only the game login secret is substituted from the
root `.env`.

All services use profiles `all` and `dev`, except pgAdmin, which uses only `all`.
Chat and media/files remain outside this stage. MinIO and `minio-setup` provide the
client CDN alongside the TypeScript API/server, gateway, PostgreSQL, Redis and
ZooKeeper.

## Local inputs and start

The root `.env` contains `NODE_ENV`, `DATABASE_ROLE`, `DATABASE_URL` and the private
`GAME_LOGIN_SECRET` exception. Use `.env.example` as the reference and preserve
existing values. No app-local env files are needed. The example database URL uses
Compose service DNS; host-side tools need the published PostgreSQL port 55432.

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

# Include pgAdmin.
docker compose --profile all up --build -d --wait
```

PostgreSQL setup applies pending Drizzle migrations to the global database and both
kingdom databases. API/server wait for setup and their dependencies. MinIO setup
imports the CDN; the gateway waits for API/server health and successful CDN setup.
The one-shot jobs exit with code zero after completion.

## Direct development values

| Endpoint | Published port |
| --- | --- |
| Gateway HTTP discovery and CDN | 80 |
| Gateway game TCP | 9933 |
| PostgreSQL | 55432 |
| MinIO object endpoint | 9000 |
| MinIO console | 9001 |
| pgAdmin, profile `all` only | 5050 |

Port mappings have no host-IP prefix. Internal connections use service DNS:
`database:5432`, `redis:6379`, `zookeeper:2181`, `api:8080`, `server:9933` and
`storage:9000`. The API and game server have no directly published host ports.
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
The MariaDB volume is never mounted by this stack. Startup does not reseed players,
reactivate accounts, flush Redis or remove objects/volumes. PostgreSQL remains the
authority for player progress. Back up databases and local inputs before changes;
an image rollback does not reverse SQL migrations.

```sh
# Apply only pending database migrations.
docker compose --profile dev run --rm database-setup
# Stop services while retaining volumes.
docker compose --profile dev down
```

PostgreSQL initialization passwords do not rotate existing accounts. Keep direct
Compose credentials aligned with the existing cluster; do not delete a volume to
repair authentication. pgAdmin registration uses `database:5432` and omits the
database password.

## Verification

```sh
bun run --cwd apps/api check-types
bun run --cwd apps/server check-types
bun run --cwd packages/env test
bun run test:stack
```

The integration test creates an isolated Compose configuration with synthetic
accounts, XML and CDN files, unique ports/networks and disposable volumes. It
verifies discovery, SFS login, CDN reads/Range/ETag, private paths, unchanged player
state and Redis failure/recovery. Cleanup removes only its own test project.
Native APK rendering and unimplemented gameplay still require separate evidence.
