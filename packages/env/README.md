# Shared server environment

`@opencok/env` loads the single workspace-root `.env` and validates server settings
with Zod schemas, separated by domain. Add `"@opencok/env": "workspace:*"` to each
consuming server package.

From the repository root, copy `.env.example` to `.env` if it does not exist, then
fill in the settings privately. Keep existing configuration when the file exists.
The local file and dotenv variants are ignored; only the root example is tracked.
Do not create `.env` files inside apps or packages.

```ts
import { env } from "@opencok/env";
import { env as database, requireEnv } from "@opencok/env/database";

const mode = env.NODE_ENV;
const role = database.DATABASE_ROLE;
const connectionString = requireEnv("DATABASE_URL");
```

| Import                  | Key                  | Accepted values                                             | Requirement                                                  |
| ----------------------- | -------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| `@opencok/env`          | `NODE_ENV`           | `development`, `testing`, `production`                      | Defaults to `development`                                    |
| `@opencok/env/database` | `DATABASE_ROLE`      | `global`, `kingdom`                                         | Required by Drizzle Kit and single-database migration        |
| `@opencok/env/database` | `DATABASE_URL`       | `postgres://` or `postgresql://` URL with host and database | Required by server composition and single-database migration |
| `@opencok/env/database` | `POSTGRES_ADMIN_URL` | PostgreSQL URL with host and database                       | Required by topology setup                                   |
| `@opencok/env/database` | `POSTGRES_USER`      | Nonblank string                                             | Local Compose user; defaults to `postgres`                   |
| `@opencok/env/database` | `POSTGRES_PASSWORD`  | Nonempty string, preserved verbatim                         | Required by local Compose setup                              |

Each entry validates and exposes only its own domain. Types are inferred from Zod;
the general entry never re-exports database variables. Pure schemas are available
through `@opencok/env/schema` and `@opencok/env/database/schema`. Add future service
settings through dedicated subpaths rather than exposing every secret to every consumer.

Explicit process/CI variables override the root file, including blank values, which
clear optional settings. A missing file is allowed. Invalid nonblank values in the
selected domain fail at import; `requireEnv` fails when a specific setting is absent. Diagnostics contain
variable names, never supplied values or raw Zod issues. Do not log environment
objects or URLs.

The Compose setup password preserves spaces and special characters. An empty
password is absent; the initialization job requires it. See the [local environment guide](../../infra/compose/README.md).

The read-only object is a snapshot at import and does not mutate `process.env`.
Only the listed keys are exposed. Parsing uses native `node:util.parseEnv`: quoted
values and comments are supported; `$VARIABLE` expansion is not performed.

The root is discovered from the package location using the ancestor workspace
`package.json`, rather than the current working directory. Deployments must retain
that workspace layout and manifest. Inject production secrets through the process
environment; no local file is required. This package uses server filesystem APIs
and must not be imported into browser/mobile bundles.

Run Bun commands at the repository root, for example:

```sh
bun run --cwd packages/env check-types
bun run --cwd packages/env test
DATABASE_ROLE=kingdom bun run --cwd packages/drizzle db:check
```

The root `bunfig.toml` disables Bun's automatic dotenv loading. Drizzle links the
same config for commands launched inside that package; its Kit wrapper also pins
the tool's internal dotenv loader to the root file. For other entry points launched
from another working directory, use `bun --no-env-file` to prevent Bun from loading
local files before this package runs. External loaders must follow the same rule.

Tests use temporary synthetic workspaces and subprocesses to verify cwd independence,
process precedence, missing files, required keys, validation and secret redaction.

The realm server loads its dedicated settings with `loadServerEnvironment()` from
`@opencok/env/server`; the pure validator is `@opencok/env/server/schema`.
This validates `GAME_*`, `KINGDOM_ID`, the database routing names and
`DEPENDENCY_TIMEOUT_MS` only when requested, so offline/database tools do not
require a game secret or XML directory. The [server guide](../../apps/server/README.md)
documents all keys.

The shared discovery service uses `loadApiEnvironment()` from `@opencok/env/api`,
with its pure validator at `@opencok/env/api/schema`. Database URLs stay in the
database subpath; API settings select listener, dependency timeout, directory and
advertised client endpoint. See the [API guide](../../apps/api/README.md).
Compose declares each application's internal `DATABASE_URL` directly, while
host tools retain the host-facing root value; container builds exclude `.env`.

For the current local Compose workflow, the root file is limited to `NODE_ENV`,
`DATABASE_ROLE`, `DATABASE_URL`, shared `REDIS_URL` and the `GAME_LOGIN_SECRET`
exception, with optional endpoint/telemetry overrides. Other local service values
are declared in Compose and are still validated by the relevant
runtime schema. Production deployment is separate. Gameplay catalogs ship as
maintained TypeScript; GAME_RESOURCES and external XML inputs are no longer
application settings.

## Effect application configuration

API and realm composition use `@opencok/env/effect` as defined in
[ADR-0012](../../docs/decisions/0012-adopt-effect-for-service-composition.md).
`EnvironmentLive` reads the same root file and process overrides once when its
Layer is built, rather than at module import. `EnvironmentSource` can be replaced
with a synthetic Layer in tests; `readEnvironment(schema)` and `databaseUrl`
validate that snapshot inside Effect and report only invalid/missing key names.

App-specific configuration services map these validated settings to adapter
contracts. API and realm schemas share realm identity, database naming, Redis URL,
port and timeout validators, retaining their different defaults and required keys.
Both Redis-consuming apps use `REDIS_URL`, defaulting to `redis://127.0.0.1:6379/0`
outside Compose. Custom `redis://` and TLS `rediss://` URLs retain their credentials,
port and database path. Compose requires the shared root/process value; use
`redis://redis:6379/0` with the explicit dev override for local containers and a
separate external URL/secret environment for production. Do not log URL values.
Zod remains the single validation definition; no parallel Effect Config schema is
maintained. Existing synchronous subpaths remain for database/offline tools.
