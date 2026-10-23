# PostgreSQL discovery API

The shared Bun API reads the maintained global PostgreSQL schema through Drizzle.
It provides the existing mobile discovery aliases while the authoritative
TypeScript server is migrated. It does not provision players or change accounts.
See the [architecture](../../.github/ARCHITECTURE.md#154-local-typescript-stack).

## Code organization

`src/index.ts` owns process startup and shutdown, and `src/config.ts` maps the
validated environment. The composition root wires the shared packages described
in the [architecture package map](../../.github/ARCHITECTURE.md#implemented-api-and-realm-package-boundaries).
`src/app.ts` connects `@opencok/api/handler` to the account repository, server
directory and Redis health adapter.

## Run

The root `.env` is limited to the shared host settings and private login-secret
exception described in the [stack guide](../../infra/compose/README.md). Compose
provides all other local values directly. There are no app-local env files.
For standalone Bun execution with separately configured dependencies:

```sh
bun install --frozen-lockfile
bun run --cwd apps/api start
```

For containers, use `docker compose --profile dev up --build -d` after configuring
the game secret and repository-local input copies described in the
[stack guide](../../infra/compose/README.md). The gateway is the public HTTP entry
point; the API has no directly published container port.

Container/process settings are validated through `@opencok/env/api` and
`@opencok/env/database`; local Compose values are direct declarations:

| Setting                     | Purpose                                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`              | PostgreSQL cluster connection; the configured global database replaces the URL pathname.                               |
| `KINGDOM_ID`                | Default single-realm directory ID/zone; defaults to `1`, matching the Compose server.                                  |
| `GLOBAL_DATABASE_NAME`      | Global physical database, default `opencok_global`.                                                                    |
| `API_HOST` / `API_PORT`     | Direct Bun listener, defaults `127.0.0.1:8082`; Compose uses `0.0.0.0:8080` internally.                                |
| `API_REDIS_URL`             | Dependency health endpoint; Compose uses `redis://redis:6379/0`.                                                       |
| `API_DEPENDENCY_TIMEOUT_MS` | Database/Redis timeout, default 3000 ms.                                                                               |
| `API_SERVERS_FILE`          | Optional JSON directory, relative to the workspace root; defaults to an in-memory directory derived from `KINGDOM_ID`. |
| `API_GAME_HOST`             | Optional advertised client-reachable TCP host. A bind wildcard is rejected.                                            |
| `API_GAME_PORT`             | Optional advertised port override for a single-realm directory. Compose uses `GATEWAY_GAME_PORT`.                      |

Direct Bun execution requires separately reachable dependencies; the default
Compose network does not publish Redis. If the server runs directly in Bun, set
`API_GAME_PORT` to its `GAME_PORT`; Compose instead advertises the gateway port.

Runtime credentials need SELECT access to `account_new`, `usermapping` and
`userbindmapping`. Global queries retain parameterization and exact bigint sorting;
only the six identity/discovery fields are selected. Raw driver errors, device IDs,
request bodies, tokens, paths and query strings do not enter operational logs.

## Routes and compatibility

| Path                                                                                                     | Methods         | Behavior                                                                    |
| -------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------- |
| `/gameservice/getserverlist.php`, `/gameservice/getline.php`, `/gameservice/getserverlist_memoryold.php` | GET, POST, HEAD | PHP-compatible form/query parsing and JSON string escaping.                 |
| `/healthz`, `/_health.php`                                                                               | GET, HEAD       | Process liveness, `ok` plus newline.                                        |
| `/readyz`                                                                                                | GET, HEAD       | PostgreSQL and Redis readiness; failures return non-200.                    |
| `/gameservice/api/query_userinfo_by_name.php`                                                            | GET, POST, HEAD | Internal API compatibility query; not exposed by the gateway in this stage. |

Discovery requires the legacy `loginFlag=1` marker. This marker is not independent
proof of identity; SFS login still checks its own signature/device binding. Existing
active accounts are resolved from the configured platform/device mapping and retain
their realm. Status 0 and the legacy nullable active value are readable. Missing
configured realms return an empty list; they never silently fall back to another
kingdom. Unknown devices receive directory metadata without a fabricated game UID.
Registration and Firebase integration remain future work.

The old account reactivation, new-game counters, country weighting, China/Facebook
server constants, upload-key initialization, GeoIP resources and unrelated external
APK update URL are removed. Discovery does not write PostgreSQL or Redis. Inactive
accounts remain inactive. Directory entries expose only ID, name, address, port and
zone; internal configuration fields are not returned.

The default directory derives its ID, name and zone from `KINGDOM_ID` (default
realm 1 / `COK1`). `resources/servers.json` is an optional public JSON template;
Compose mounts a configured `API_SERVERS_FILE` read-only when selected. The PostgreSQL topology still
prepares both realm databases. To add another active server, configure its own
process, TCP entry point and directory entry; a second empty database does not
establish client/account readiness. Per-realm ports belong in a multi-realm directory,
without the single-port `API_GAME_PORT` override.

## Verification

```sh
bun run --cwd apps/api check-types
bun run --cwd apps/api test
bun run --cwd packages/env test
bun run test:stack
```

The stack test builds images and starts a uniquely named disposable Compose project
with synthetic PostgreSQL accounts/XML. It verifies all discovery aliases, real TCP
handshake/login through Traefik, exact bigint responses, unchanged resources and
inactive accounts, rejected out-of-scope routes, body limits and Redis failure/recovery.
It never connects to the imported player databases. A native APK remains a separate
validation step; previous PHP/MariaDB checks do not establish this port's compatibility.
