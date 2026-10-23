# Experimental realm server

This is the first migration slice of the working Bun `apps/new-server` proof of
concept. It preserves the mobile **12.06.0** SFS binary protocol and adapts its
login, city bootstrap and world reads to the existing PostgreSQL Drizzle models.
The runtime requires Bun 1.4.2 and the workspace layout.

Implemented commands: `cmd.finishinit`, `cmd.ping`, `login.dataconfig`,
`login.other`, `build.info` and `world.get`. The SFS handshake, login rejection,
session replacement, fragmentation, zlib input and signed 64-bit values are
preserved. Construction, queue completion, combat and other mutations return
`102192` (unsupported). Reading the city never settles queues or changes resources.

## Code organization

`src/index.ts` owns process startup and shutdown, and `src/config.ts` maps the
validated environment. The composition root wires the shared packages described
in the [architecture package map](../../.github/ARCHITECTURE.md#implemented-api-and-realm-package-boundaries).
`src/server.ts` loads the rule catalog and connects `@opencok/connection/server`
to repositories, Redis/ZooKeeper adapters and command controllers.

## Start locally

From the repository root:

```sh
docker compose --profile dev up --build -d --wait
```

The root `.env` contains `NODE_ENV`, `DATABASE_ROLE`, `DATABASE_URL` and the
private `GAME_LOGIN_SECRET` exception. Other development values are direct
Compose settings, still validated by `@opencok/env/server` and
`@opencok/env/database`. Authorized XML comes from the complete local reference
copy at `data/reference/server/runtime/base/resource`; the runtime does not
reference another checkout. Direct Bun execution requires providing the remaining
service/resource settings through its process environment.

| Setting                          | Purpose/default                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`                   | Required PostgreSQL cluster URL; the adapter selects physical databases from the names below, retaining URL credentials/TLS options. |
| `KINGDOM_ID`                     | Realm ID, default `1`; selects SFS zone `COK1` or `COK2`.                                                                            |
| `KINGDOM_DATABASE_NAME`          | Defaults to `opencok_kingdom_<KINGDOM_ID>`.                                                                                          |
| `GLOBAL_DATABASE_NAME`           | Defaults to `opencok_global`.                                                                                                        |
| `GAME_LOGIN_SECRET`              | Required private secret matching the legacy mobile login issuer.                                                                     |
| `GAME_RESOURCES`                 | Required directory of authorized, extracted 12.06.0 XML rules.                                                                       |
| `GAME_REDIS_URL`                 | Defaults to `redis://127.0.0.1:6379/0`.                                                                                              |
| `GAME_ZOOKEEPER`                 | Defaults to `127.0.0.1:2181`.                                                                                                        |
| `GAME_HOST`                      | Bind address, default `127.0.0.1`.                                                                                                   |
| `GAME_PORT` / `GAME_HEALTH_PORT` | Defaults to `19933` / `18090`.                                                                                                       |
| `GAME_MAP_SIZE`                  | Defaults to `1200`.                                                                                                                  |
| `DEPENDENCY_TIMEOUT_MS`          | Defaults to `5000`.                                                                                                                  |

The root [Compose stack](../../infra/compose/README.md) starts this server, the
shared discovery API, gateway, PostgreSQL, Redis, ZooKeeper and MinIO CDN. It mounts the XML
directory read-only and uses a container-specific database URL. For direct Bun
execution, provide reachable PostgreSQL/Redis/ZooKeeper endpoints separately. Each running realm needs its own TCP/health ports and
`KINGDOM_ID`. The PostgreSQL topology setup initializes realms 1 and 2 with the
same schema. Advertise the corresponding `COK<id>` zone and TCP endpoint through
the existing discovery issuer; the shared API implements discovery; registration remains unavailable.

Relative XML paths are resolved from the workspace root, independently of the
command working directory. The XML loader requires `building.xml`, `role.xml` and `position.xml`.
`item.xml` supplies `login.dataconfig`; `arms.xml` and `goods.xml` are needed for
persisted troops/inventory. `function_star.xml` and `function_on.xml` describe
building star rules and optional features. Files remain local authorized inputs;
read-only mobile originals must be extracted in a separate working directory.

Use runtime credentials with SELECT access to the required global/realm tables,
separate from the administrative setup account. Startup checks the required
projections and dependencies before opening listeners. `/healthz` and `/readyz`
return 200 when dependencies are available and 503 when unavailable; readiness
is refreshed every two seconds. SIGINT/SIGTERM drain pending commands, release
session leases and close pools. Logs omit account/device IDs, secrets and raw
query/driver errors.

## Compatibility and persistence boundaries

- Login requires existing `userprofile` and matching global `account_new` rows,
  device binding, supported mobile channel, valid signature and no active ban.
  Legacy `cmdBaseTime` is signed literally; the web timestamp window is not
  applied to this mobile path. Firebase auth/account provisioning remain future work.
- PostgreSQL data is read through `@opencok/drizzle` using typed table modules.
  Global accounts use their own physical database connection; game reads use the
  selected realm. City/map snapshots use read-only repeatable-read transactions
  and UTC. PostgreSQL bigint values remain exact until SFS serialization.
- Redis sessions and ZooKeeper registrations are scoped to the realm.
  ZooKeeper prevents simultaneous registration at `/opencok-experiment/COK<id>`;
  this is a read-only migration slice. Epoch fencing is still required before
  enabling authoritative mutations, as defined in the architecture.
- Map reads use PostgreSQL, avoiding the proof of concept's unscoped `world1`
  cache. Only base-world terrain, unallied cities and resources have migrated
  DTOs. Realms with active marches, specialized points or unsupported queue
  types fail explicitly rather than advertising incomplete simulation state.
- No schema or migration is added here. Existing PostgreSQL migrations remain
  unchanged. MySQL/MariaDB records are **not transferred** by this change;
  preparing existing accounts/cities requires a separate reviewed data migration.
  Empty databases do not automatically create or reset player state.
- Optional features and commerce remain closed. Other client versions, APK
  rendering and real-client discovery against this PostgreSQL server remain
  unvalidated. The source proof of concept's successful APK connection does not
  establish that validation for this port.

See [architecture](../../.github/ARCHITECTURE.md#153-first-postgresql-server-migration-slice)
for ownership and the next migration steps.

## Verification

```sh
bun run --cwd apps/server check-types
bun run --cwd apps/server test
bun run --cwd packages/env test
bun run --cwd apps/server test:mutations
bun run --cwd apps/server test:integration
```

The integration suite owns disposable Docker instances of PostgreSQL
`17.11-bookworm`, Redis `6.2.24-bookworm` and ZooKeeper `3.4.14` (the source
experiment's Redis/ZooKeeper versions). It applies the real Drizzle migrations,
creates only synthetic XML/accounts and tests TCP login, rejection paths,
city/army/inventory/map reads, realm isolation, exact bigint transport,
unsupported mutations, process restart and Redis failure/recovery. Docker must
be running; missing dependencies fail the suite. It does not accept deployment
URLs or use private resources. A synthetic SFS client verifies wire responses;
APK/device validation and production dependency versions are separate gates.

A focused mutation check runs the login tests against seven disabled auth guards in
a temporary test bundle: signature, device binding, account activation, realm,
account device and both ban checks. Every mutant must fail its tests. This is a
bounded auth check, not the architecture's future repository-wide Stryker suite.
