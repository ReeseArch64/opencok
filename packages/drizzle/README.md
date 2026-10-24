# PostgreSQL database package

`@opencok/drizzle` owns the application's PostgreSQL schemas, typed client and
versioned Drizzle migrations. The maintained source of truth is `src/schema`,
with **773 tables / 6,319 fields** and one module per table.

| Default physical database | SQL namespaces                                  | Migration role | Tables |
| ------------------------- | ----------------------------------------------- | -------------- | -----: |
| `opencok_global`          | `opencok_global`, `opencok_pay`, `opencok_chat` | `global`       |    113 |
| `opencok_kingdom_1`       | `opencok_kingdom`                               | `kingdom`      |    660 |
| `opencok_kingdom_2`       | `opencok_kingdom`                               | `kingdom`      |    660 |

Kingdom IDs **1 and 2** are configured by default. There is one maintained kingdom
schema, one set of table modules and one kingdom migration history. Both physical
databases use those same definitions. Additional kingdoms use configuration, not
copied schemas or folders. Table/field names and data contracts are preserved.
A transaction belongs to one physical database. The architecture defines
[persistence ownership](../../.github/ARCHITECTURE.md#151-postgresql-database-package).

## Initialize the default topology

The root [Docker Compose environment](../../infra/compose/README.md) starts a local
PostgreSQL instance and runs this setup automatically for the default topology.

Copy the root `.env.example` to the root `.env` once and set `DATABASE_URL`
privately. The host setup command uses its cluster credentials and the `postgres`
maintenance database; an explicit process-level `POSTGRES_ADMIN_URL` remains an
optional override. All commands use
[`@opencok/env`](../env/README.md) and that single root file. Process/CI values
override it; do not create package-local env files. From this package, run:

```sh
bun run db:setup
```

Setup creates missing global/kingdom databases and applies their pending migrations.
The setup account needs database-creation and migration privileges. The command can
run again: existing databases and saved rows are retained, with no reseeding or reset.
A failure can leave earlier databases initialized; rerun after correcting the failure.
No database is dropped. Use application credentials with the necessary runtime grants
for server connections, rather than keeping the setup account in the server.

## Use from the server

Declare `"@opencok/drizzle": "workspace:*"` and `"@opencok/env": "workspace:*"`
in the consuming server package.

```ts
import { requireEnv } from "@opencok/env/database";
import { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";

const databases = createDatabases({
  connectionString: requireEnv("DATABASE_URL"),
  max: 10,
});

const kingdom1 = databases.getKingdom(1);
const kingdom2 = databases.getKingdom(2);
const profiles = await kingdom1.db.select().from(userprofile).limit(10);
const otherProfiles = await kingdom2.db.query.userprofile.findMany({ limit: 10 });

await databases.close();
```

The global client is `databases.global`; `databases.kingdoms` is a read-only map.
Unknown kingdom IDs fail explicitly. Pool creation is lazy and the same model objects
are used for both kingdoms. URL routing preserves credentials/TLS options and changes
only the physical database name. Duplicate IDs, shared database names, empty kingdom
lists and invalid database names are rejected before opening connections.

The exported `defaultDatabaseTopology` contains the default names/IDs. Pass a
`DatabaseTopology` as the second argument to `createDatabases` to select other names
or kingdoms; the setup API `setupDatabases` accepts the same topology. Names use
lowercase letters, digits and underscores, up to 63 bytes, excluding maintenance and
system databases. Existing physical database names can be configured without moving
their records to new databases.

For a service scoped to a single kingdom or the global database, use the lower-level
`createDatabase("kingdom" | "global", poolConfig)` with that database's explicit URL
and credentials. Reuse pools across requests and close them at service shutdown.
Each client exposes `db`, `pool`, `role` and `close()`; imports create no connections.
Connections use UTC and accept pg TLS options. Global relational-query names include
the SQL namespace, for example `databases.global.db.query.opencok_global_usermapping`.
Role-wide schemas are exported through `schema/global` and `schema/kingdom`; the four
SQL namespaces and individual table modules are available under `schema/opencok_*`.

## Schema changes and migrations

Run `bun install --frozen-lockfile` at the repository root, then from this package:

```sh
DATABASE_ROLE=global bun run db:generate --name add_account_preferences
DATABASE_ROLE=kingdom bun run db:generate --name add_kingdom_state
DATABASE_ROLE=global bun run db:check
DATABASE_ROLE=kingdom bun run db:check

DATABASE_ROLE=global bun run db:migrate
DATABASE_ROLE=kingdom bun run db:migrate
```

Edit the relevant table modules first. Review generated SQL and commit the migration
plus its Drizzle snapshot/journal. Apply the same kingdom migrations to **both**
kingdom databases; the shared global database has its own history. `db:setup` applies
pending migrations to all default databases in one command. Migrations serialize
per database with an advisory lock and reject the other role's application schemas.
`DATABASE_ROLE=global|kingdom bun run db:studio` opens the selected database in Studio.

The original `0000_initial.sql` migrations remain immutable. The next migration
renames PostgreSQL namespaces with `ALTER SCHEMA`, preserving tables, rows, keys,
indexes, native identities and sequence state. Old namespace names occur only in
that migration history and its upgrade guard/test. Existing deployments apply the
new migration to their existing physical databases; no database-name change or
copy is required. Never edit a migration already applied to a deployment.

## Data contracts

The additive `0003_mail_update_markers` kingdom migration creates the recipient/message
update-marker table used by server mailbox mutations. The owner/time index supports
future synchronization reads; no mail foreign key is present so deletion markers can
outlive messages. Existing mail rows are unchanged. Apply the migration to all kingdoms
before using the corresponding server version. Generation, synthetic schema contracts
and SQL snapshots are verified; real migration execution and persistence/concurrency
checks remain deferred under the current unit-only validation restriction.

- Bigints, including the bounded full-width sequence ID, use TypeScript `bigint`.
  Serialize bigint explicitly at JSON/transport boundaries. Native sequences retain
  allocation across transaction rollback; the full-width numeric ID uses an exact
  offset over a signed PostgreSQL sequence.
- Decimals use strings. Declared fixed-scale numeric fields with a number contract
  use Drizzle's numeric number mode. Floating fields use real/double precision.
- Binary values use PostgreSQL bytea and `Buffer`; the only custom column adapter
  preserves arbitrary bytes, including NUL.
- `mail.rewardId` retains a TypeScript string contract but stores UTF-8 bytes in
  PostgreSQL `bytea` through `utf8Bytea`. This preserves embedded NUL characters,
  which PostgreSQL `text` cannot store. The adapter preserves BOM characters and
  rejects invalid Unicode instead of replacing bytes. Raw SQL writers must send
  UTF-8 buffers; do not cast bytea to text to read this field. The next kingdom
  migration converts existing text using `convert_to(..., 'UTF8')`, preserving
  literal backslashes and normal strings. Apply it to every kingdom. After
  importing NUL-containing values, a text downgrade cannot represent those values;
  restore an appropriate backup or retain a lossless representation before rollback.
- Calendar-string fields retain text values and inline format/calendar constraints,
  including existing zero/sentinel strings. This keeps the current persisted values
  intact; changing these field contracts requires a separate domain migration.
- The two automatic update-time fields use Drizzle `$onUpdateFn`. Direct SQL writers
  must supply update-time fields themselves. Required columns reject NULL normally.
- Text uses ordinary PostgreSQL operators, database collation and declared lengths.
  Keys and indexes are defined directly in the table modules.

## Verification

```sh
bun run check-types
bun run test:unit
bun run test:snapshots
bun run test:e2e
```

Every table has a named unit case, schema/CRUD snapshot and persistence E2E case.
`tests/fixtures/schema.json` is the reviewed PostgreSQL test contract, used only by
tests. Intentional schema changes must update the corresponding contract and reviewed
snapshots. Update snapshots with `bun test tests/schema.snapshots.test.ts --update-snapshots`.

E2E requires Docker and `postgres:17.11-bookworm`. Tests own a uniquely named instance,
generated credentials and an ephemeral loopback port; no deployment URLs are accepted.
They cover every field, defaults, NULL/unique/FK/check constraints, CRUD, transaction
rollback, migration repeatability, both default kingdoms, preserved namespace upgrades and persistence after restart.
Run this suite sequentially because its FK fixtures and final restart are shared.
Missing dependencies fail the suite. CI runs the same PostgreSQL-only commands with
Bun 1.4.2. This verifies persistence; application/gameplay flows have their own E2E.
