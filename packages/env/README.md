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

| Import | Key | Accepted values | Requirement |
| --- | --- | --- | --- |
| `@opencok/env` | `NODE_ENV` | `development`, `testing`, `production` | Defaults to `development` |
| `@opencok/env/database` | `DATABASE_ROLE` | `global`, `kingdom` | Required by Drizzle Kit and single-database migration |
| `@opencok/env/database` | `DATABASE_URL` | `postgres://` or `postgresql://` URL with host and database | Required by server composition and single-database migration |
| `@opencok/env/database` | `POSTGRES_ADMIN_URL` | PostgreSQL URL with host and database | Required by topology setup |

Each entry validates and exposes only its own domain. Types are inferred from Zod;
the general entry never re-exports database variables. Pure schemas are available
through `@opencok/env/schema` and `@opencok/env/database/schema`. Add future service
settings through dedicated subpaths rather than exposing every secret to every consumer.

Explicit process/CI variables override the root file, including blank values, which
clear optional settings. A missing file is allowed. Invalid nonblank values in the
selected domain fail at import; `requireEnv` fails when a specific setting is absent. Diagnostics contain
variable names, never supplied values or raw Zod issues. Do not log environment
objects or URLs.

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
