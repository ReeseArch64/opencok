# PostgreSQL discovery API

The shared Bun API reads the maintained global PostgreSQL schema through Drizzle.
It provides the existing mobile discovery aliases while the authoritative
TypeScript server is migrated. It does not provision players or change accounts.
See the [architecture](../../.github/ARCHITECTURE.md#154-local-typescript-stack).

## Code organization

`src/index.ts` composes Effect Layers and runs the shared process runtime;
`src/config.ts` provides the ApiConfig service from the shared environment Layer. The composition root wires the shared packages described
in the [architecture package map](../../.github/ARCHITECTURE.md#implemented-api-and-realm-package-boundaries).
`src/app.ts` connects `@opencok/api/handler` to the account repository, server
directory and Redis health adapter. Account pools are registered in a scope before
startup checks, and the HTTP scope closes before dependency scopes. Both apps use
`@opencok/core/http` and `@opencok/core/runtime`; no per-app signal handlers or
ambient configuration imports remain. See
[ADR-0012](../../docs/decisions/0012-adopt-effect-for-service-composition.md).

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
`@opencok/env/database`; local Compose values are direct declarations except for the
optional chat origin forwarded from the environment. Media is opt-in; see
[API media](MEDIA.md) for S3/key settings, gateway routes and migration from Files:

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
| `API_CHAT_URL`              | Optional HTTP(S) origin of the maintained chat service; no path, embedded credentials, query or fragment.              |
| `API_GAME_PORT`             | Optional advertised port override for a single-realm directory. Compose uses `GATEWAY_GAME_PORT`.                      |

Direct Bun execution requires separately reachable dependencies; the default
Compose network does not publish Redis. If the server runs directly in Bun, set
`API_GAME_PORT` to its `GAME_PORT`; Compose instead advertises the gateway port.

Runtime credentials need SELECT access to `account_new`, `usermapping` and
`userbindmapping`. Global queries retain parameterization and exact bigint sorting;
only the six identity/discovery fields are selected. Raw driver errors, device IDs,
request bodies, tokens, paths and query strings do not enter operational logs.

## Routes and compatibility

| Path                                                                                                     | Methods         | Behavior                                                                          |
| -------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------- |
| `/gameservice/getserverlist.php`, `/gameservice/getline.php`, `/gameservice/getserverlist_memoryold.php` | GET, POST, HEAD | PHP-compatible form/query parsing and JSON string escaping.                       |
| `/api/v1global_config`, `/chat/server/links`, `/chat/server/all`                                         | GET             | Public chat metadata when configured; 404 when disabled, 503 on upstream failure. |
| `/healthz`, `/_health.php`                                                                               | GET, HEAD       | Process liveness, `ok` plus newline.                                              |
| `/readyz`                                                                                                | GET, HEAD       | PostgreSQL and Redis readiness; failures return non-200.                          |
| `/gameservice/api/query_userinfo_by_name.php`                                                            | GET, POST, HEAD | Internal API compatibility query; not exposed by the gateway in this stage.       |

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

## Public chat discovery

[Issue #75](https://github.com/ReeseArch64/opencok/issues/75) connects the chat service's
existing public metadata routes through the shared API and gateway. Set `API_CHAT_URL`
to the chat HTTP origin reachable from the API process, for example
`http://chat.internal:8083`. The API fetches only `/api/v1global_config`,
`/chat/server/links` and `/chat/server/all`; it never derives an upstream URL from
caller input. Query strings, cookies, authorization and caller request IDs are not
forwarded. The public gateway allows these exact paths with GET only. `/external/session`,
`/_health` and `/chat/ws` remain outside its chat routing.

Chat owns configuration and readiness. The proxy validates and returns its public
WebSocket arrays, message-display/type metadata and server lists, preserving advertised
capabilities rather than filling missing configuration locally. Unknown top-level
response fields, server-list fields and upstream headers are not forwarded. Redirects,
non-JSON replies, invalid shapes, unsafe WebSocket endpoints or unavailable upstreams
produce HTTP 503 with `code: 0` and empty object/list data. Success and failure use
`Cache-Control: no-store`. An unconfigured origin preserves HTTP 404. The normal API
readiness and game-realm discovery remain independent of chat availability.

`API_DEPENDENCY_TIMEOUT_MS` bounds both the request and response consumption. Streamed
responses are capped at 16 KiB; no chat metadata cache or automatic retry is introduced.
The public WebSocket remains the chat service's configured `CHAT_WEBSOCKET_URL` and
must be directly reachable by clients. The API does not relay WebSocket traffic or
expose the session-signing secret. The realm's `GAME_CHAT_SESSION_URL` separately
addresses the same service's internal `/external/session` endpoint. Development Compose
forwards `API_CHAT_URL` without starting a chat container; separately hosted chat must
be reachable on the configured network. No database or migration changes are involved.

Socket-free units compose the API routes with the maintained chat metadata handlers,
verify configuration/dependency injection, failures, stream/deadline limits and gateway
allowlist declarations. They do not prove live DNS, HTTP proxying, WebSocket connectivity,
Traefik execution or native-client behavior. The existing integration suite remains
unexecuted under the current unit-only validation restriction.

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

## Avatar media

`API_FILES_ENABLED=true` composes signed avatar uploads, public JPEG delivery and
private receipt confirmation into this API process. There is no separate Files
application or listener. See [API media](MEDIA.md) for provisioning, limits,
realm configuration and recovery. Discovery continues to work without media configuration.
