# PostgreSQL database package

`@opencok/drizzle` owns the application's PostgreSQL schemas, typed client and
versioned Drizzle migrations. The maintained source of truth is `src/schema`,
with **772 tables / 6,316 fields** and one module per table.

| Database role | SQL schemas | Tables |
| --- | --- | ---: |
| Global | `cokdb_global`, `cokdb_pay`, `opencok_chat` | 113 |
| One physical database per realm | `cokdb1` | 659 |

Physical database names and credentials are deployment configuration. The two
roles have separate migration histories; apply realm migrations to each realm's
database. SQL table/field names are preserved. A transaction belongs to one database.
The architecture defines [persistence ownership](../../.github/ARCHITECTURE.md#151-postgresql-database-package).

## Use from the server

Declare `"@opencok/drizzle": "workspace:*"` in the consuming package.

```ts
import { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/cokdb1/userprofile";

const realm = createDatabase("realm", {
  connectionString: process.env.REALM_DATABASE_URL,
  max: 10,
});

const profiles = await realm.db.select().from(userprofile).limit(10);
const profile = await realm.db.query.userprofile.findFirst();

// At service shutdown:
await realm.close();
```

Create and reuse pools at service startup. Configure TLS using pg's `ssl` option
when required. Each client uses UTC and exposes `db`, `pool`, `role` and `close()`;
importing the package creates no connections. Global relational-query names include
the SQL namespace, for example `global.db.query.cokdb_global_usermapping`, so equal
table names in different global schemas do not collide. Realm query names match
its table exports. Role-wide schemas are available from `schema/global` and
`schema/realm`; individual namespaces and tables are available under `schema/*`.

## Schema changes and migrations

Run `bun install --frozen-lockfile` at the repository root, then from this package:

```sh
DATABASE_ROLE=global bun run db:generate --name add_account_preferences
DATABASE_ROLE=realm bun run db:generate --name add_realm_state
DATABASE_ROLE=global bun run db:check
DATABASE_ROLE=realm bun run db:check

# Set DATABASE_URL privately to the selected PostgreSQL database.
DATABASE_ROLE=global bun run db:migrate
DATABASE_ROLE=realm bun run db:migrate
```

Edit the relevant table modules first. Review the generated SQL and commit the
migration plus its Drizzle snapshot/journal. `db:migrate` applies pending migrations
incrementally and can run again without duplicating them. It serializes migration
processes with an advisory lock and rejects a database containing the other role's
application schemas. New databases start from the checked-in `0000_initial.sql`.
Never edit a migration already applied to a deployment; add the next migration.
`DATABASE_ROLE=global|realm bun run db:studio` opens the configured database in Studio.

## Data contracts

- Bigints, including the bounded full-width sequence ID, use TypeScript `bigint`.
  Serialize bigint explicitly at JSON/transport boundaries. Native sequences retain
  allocation across transaction rollback; the full-width numeric ID uses an exact
  offset over a signed PostgreSQL sequence.
- Decimals use strings. Declared fixed-scale numeric fields with a number contract
  use Drizzle's numeric number mode. Floating fields use real/double precision.
- Binary values use PostgreSQL bytea and `Buffer`; the only custom column adapter
  preserves arbitrary bytes, including NUL.
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
rollback, migration repeatability, a second isolated realm and persistence after restart.
Run this suite sequentially because its FK fixtures and final restart are shared.
Missing dependencies fail the suite. CI runs the same PostgreSQL-only commands with
Bun 1.4.2. This verifies persistence; application/gameplay flows have their own E2E.
